"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useGetData } from "@/hooks/use-get-data";
import { usePostData } from "@/hooks/use-post-data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Clock4, ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  batchSlug: string;
  quizId: string;
  attemptId: string;
};

type TOption = { id: string; option_text: string };
type TQuestion = { id: string; question: string; options: TOption[] };
type TQuizDetail = {
  id: string;
  title: string;
  description?: string;
  type: "tf" | "mc" | string;
  start_time?: string;
  end_time?: string;
  duration_minute?: number;
  max_attempts?: number;
  questions?: TQuestion[];
};
type TAttemptDetail = {
  id: string;
  quiz_id: string;
  user_id: string;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
};
type TTempSubmission = {
  id: string;
  user_id: string;
  question_id: string;
  selected_option_id: string;
  created_at: string;
  updated_at: string;
};
type TAttemptPayload = {
  attempt: TAttemptDetail;
  quiz: TQuizDetail;
  temp_submissions?: TTempSubmission[];
};

const chip =
  "inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs";

function formatTimeLeft(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  if (hh > 0)
    return `${String(hh)}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  return `${String(mm)}:${String(ss).padStart(2, "0")}`;
}

export default function QuizAttempt({ batchSlug, quizId, attemptId }: Props) {
  const router = useRouter();

  const {
    data: attemptResp,
    isLoading,
    isError,
  } = useGetData({
    queryKey: ["attempt-with-quiz", attemptId],
    dataProtected: `quizzes/attempts/${attemptId}`,
    options: { refetchOnWindowFocus: false },
  });

  const tempSubmit = usePostData({
    queryKey: "attempt-temp",
    dataProtected: `quizzes/attempts/${attemptId}/temp-submissions`,
    successMessage: "Jawaban tersimpan sementara.",
  });

  const finalSubmit = usePostData({
    queryKey: "attempt-submit",
    dataProtected: `quizzes/attempts/${attemptId}/submissions`,
    successMessage: "Attempt berhasil dikumpulkan.",
  });

  const payload: TAttemptPayload | undefined =
    attemptResp?.data?.data ?? attemptResp?.data ?? attemptResp;

  const attempt = payload?.attempt;
  const quiz = payload?.quiz;
  const questions: TQuestion[] =
    (quiz?.questions && Array.isArray(quiz.questions) && quiz.questions) || [];
  const tempSubs: TTempSubmission[] = Array.isArray(payload?.temp_submissions)
    ? payload?.temp_submissions || []
    : [];

  const [now, setNow] = React.useState<number>(Date.now());

  const windowEnd = quiz?.end_time
    ? new Date(quiz.end_time).getTime()
    : Infinity;
  const startedAt = attempt?.started_at
    ? new Date(attempt.started_at).getTime()
    : Date.now();
  const durationEnd =
    quiz?.duration_minute != null
      ? startedAt + quiz.duration_minute * 60_000
      : Infinity;

  const hardDeadline = Math.min(windowEnd, durationEnd);
  const timeLeftSec = Math.max(0, Math.floor((hardDeadline - now) / 1000));

  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const afterHref = `/dashboard/program-saya/${batchSlug}/quiz/${quizId}`;
  React.useEffect(() => {
    if (!isLoading && timeLeftSec <= 0) {
      router.replace(afterHref);
    }
  }, [timeLeftSec, isLoading, router, afterHref]);

  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [index, setIndex] = React.useState(0);
  const [openDialog, setOpenDialog] = React.useState(false);

  React.useEffect(() => {
    if (!questions.length) return;
    if (!tempSubs.length) return;
    const hydrated: Record<string, string> = {};
    for (const ts of tempSubs) hydrated[ts.question_id] = ts.selected_option_id;
    setAnswers(hydrated);
  }, [questions, tempSubs]);

  const total = questions.length;
  const current = questions[index];
  const ended = timeLeftSec <= 0;
  const allAnswered = total > 0 && questions.every((q) => !!answers[q.id]);

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(total - 1, i + 1));
  const goTo = (i: number) => setIndex(Math.min(Math.max(0, i), total - 1));

  const onChoose = (q: TQuestion, op: TOption) => {
    if (ended) return;
    setAnswers((prev) => ({ ...prev, [q.id]: op.id }));
    tempSubmit.mutate({
      question_id: q.id,
      selected_option_id: op.id,
    });
  };

  const confirmSubmit = async () => {
    try {
      await finalSubmit.mutateAsync({});
      router.replace(afterHref);
    } catch {}
  };

  if (isLoading) {
    return (
      <Card className="w-full rounded-xl border shadow-sm overflow-hidden">
        <div className="h-1.5 w-full bg-primary" />
        <CardHeader className="p-5 md:p-6 border-b">
          <Skeleton className="h-6 w-52 mb-2" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent className="p-5 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
            <div className="space-y-3">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-24 w-full" />
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
              <div className="flex justify-between pt-2">
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-28" />
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-6 w-40" />
              <div className="grid grid-cols-5 gap-2">
                {[...Array(15)].map((_, i) => (
                  <Skeleton key={i} className="h-10" />
                ))}
              </div>
              <Skeleton className="h-9 w-40" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !attempt || !quiz) {
    return (
      <div className="text-sm text-destructive">
        Gagal memuat data attempt/quiz.
      </div>
    );
  }

  return (
    <>
      <Card className="w-full rounded-xl border shadow-sm overflow-hidden">
        <div className="h-1.5 w-full bg-primary" />
        <CardHeader className="p-5 md:p-6 border-b">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <CardTitle className="text-lg md:text-xl font-semibold tracking-tight">
                {quiz.title}
              </CardTitle>
              {quiz.description && (
                <CardDescription className="text-sm leading-relaxed">
                  {quiz.description}
                </CardDescription>
              )}
            </div>
            <div className={chip} title="Sisa waktu">
              <Clock4 className="h-4 w-4 text-orange-500" />
              <span className="font-semibold tabular-nums">
                {formatTimeLeft(timeLeftSec)}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
            <section aria-label="Area soal" className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Soal {index + 1} dari {total}
              </div>

              <div className="rounded-xl border bg-muted/20 p-4">
                <p className="text-[15px] leading-relaxed">
                  {current?.question}
                </p>
              </div>

              <div className="grid gap-2">
                {current?.options.map((op, i) => {
                  const selected = answers[current!.id] === op.id;
                  return (
                    <button
                      key={op.id}
                      disabled={ended}
                      onClick={() => onChoose(current!, op)}
                      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition
                        ${selected ? "border-green-600 bg-green-500/10" : "hover:bg-muted"}
                        ${ended ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">
                        {String.fromCharCode(97 + i)}.
                      </span>
                      <span className="text-sm">{op.option_text}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  onClick={goPrev}
                  disabled={index === 0}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Sebelumnya
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={goNext}
                    disabled={index >= total - 1}
                  >
                    Selanjutnya
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </section>

            <aside className="space-y-3">
              <p className="text-sm font-medium">Quiz navigation</p>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, i) => {
                  const answered = !!answers[q.id];
                  const isCurrent = i === index;
                  return (
                    <button
                      key={q.id}
                      onClick={() => goTo(i)}
                      className={`h-10 rounded-md border text-sm font-medium transition
                        ${isCurrent ? "ring-2 ring-primary" : ""}
                        ${answered ? "bg-green-500/15 border-green-500/30" : "bg-background hover:bg-muted"}`}
                      title={`Soal ${i + 1}${answered ? " • sudah dijawab" : ""}`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="orange"
                className="w-full text-white"
                disabled={!allAnswered || ended || finalSubmit.isPending}
                onClick={() => setOpenDialog(true)}
              >
                Kumpulkan quiz...
              </Button>

              {!allAnswered && (
                <div className="flex items-start gap-2 rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <p>Jawab semua soal untuk mengaktifkan tombol kumpulkan.</p>
                </div>
              )}
            </aside>
          </div>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Kumpulkan attempt?</DialogTitle>
            <DialogDescription>
              Setelah dikumpulkan, jawaban kamu akan dinilai. Pastikan semua
              sudah benar.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenDialog(false)}>
              Batal
            </Button>
            <Button
              variant="orange"
              className="text-white"
              onClick={confirmSubmit}
              disabled={finalSubmit.isPending}
            >
              {finalSubmit.isPending ? "Mengumpulkan..." : "Kumpulkan Sekarang"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
