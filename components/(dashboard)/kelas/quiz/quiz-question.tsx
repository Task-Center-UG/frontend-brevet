"use client";

import * as React from "react";
import Link from "next/link";
import { useGetData } from "@/hooks/use-get-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, ListChecks, Upload } from "lucide-react";

type Props = {
  batchSlug: string;
  quizId: string;
  meetingId?: string;
  uploadHref?: string;
};

type TOption = { id: string; option_text: string; is_correct: boolean };
type TQuestion = { id: string; question: string; options: TOption[] };
type TQuizDetail = {
  id: string;
  title: string;
  description?: string;
  type: "tf" | "mc" | string;
  questions?: TQuestion[];
};

const typeLabel: Record<string, string> = {
  tf: "True/False",
  mc: "Pilihan Ganda",
};
const letters = ["A", "B", "C", "D", "E", "F"];

export default function QuizQuestion({
  batchSlug,
  quizId,
  meetingId,
  uploadHref = `/dashboard/kelas/${batchSlug}/quiz/${quizId}/upload?${meetingId}`,
}: Props) {
  const { data: metaResp, isLoading: loadingMeta } = useGetData({
    queryKey: ["quiz", quizId],
    dataProtected: `quizzes/${quizId}`,
    options: { enabled: !!quizId, refetchOnWindowFocus: false },
  });

  const { data: qResp, isLoading: loadingQ } = useGetData({
    queryKey: ["quiz-questions", quizId],
    dataProtected: `quizzes/${quizId}/questions?limit=500`,
    options: { enabled: !!quizId, refetchOnWindowFocus: false },
  });

  const quiz: TQuizDetail | undefined = metaResp?.data?.data;

  const qData = qResp?.data?.data;
  const questions: TQuestion[] = Array.isArray(qData)
    ? (qData as TQuestion[])
    : Array.isArray(qData?.questions)
      ? (qData.questions as TQuestion[])
      : Array.isArray(quiz?.questions)
        ? (quiz?.questions as TQuestion[])
        : [];

  const isLoading = loadingMeta || loadingQ;
  const hasQuestions = !isLoading && questions.length > 0;

  const qType = (quiz?.type ?? "mc").toLowerCase();
  const labelType = typeLabel[qType] ?? qType.toUpperCase();

  const renderOptions = (q: TQuestion) => {
    const isTF = qType === "tf";
    return (
      <div
        className={
          isTF ? "mt-2 flex flex-wrap gap-2" : "mt-2 grid gap-2 sm:grid-cols-2"
        }
      >
        {q.options.map((op, idx) => {
          const key = letters[idx] ?? String(idx + 1);
          const isCorrect = !!op.is_correct;
          return (
            <div
              key={op.id}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                isCorrect
                  ? "bg-green-500/10 border-green-500/30"
                  : "bg-background"
              }`}
            >
              <span
                className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold ${
                  isCorrect ? "bg-green-500 text-white border-transparent" : ""
                }`}
                title={`Opsi ${key}`}
              >
                {key}
              </span>
              <span className="leading-snug">{op.option_text}</span>
              {isCorrect && (
                <CheckCircle2 className="ml-1 mt-0.5 h-3.5 w-3.5 text-green-600" />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden rounded-2xl">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle>
              Soal Quiz {quiz?.title ? `— ${quiz.title}` : ""}
            </CardTitle>
            <CardDescription>
              Daftar pertanyaan (khusus pengajar). Non-interaktif.
            </CardDescription>
          </div>
          <Badge variant="secondary" className="rounded-full">
            {labelType}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {isLoading && (
          <div className="grid gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-2xl border bg-muted/30"
              />
            ))}
          </div>
        )}

        {!isLoading && !hasQuestions && (
          <div className="group relative overflow-hidden rounded-2xl border bg-gradient-to-b from-background/60 to-background p-5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-orange-500/40 via-orange-500/20 to-transparent" />

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-xl border bg-orange-500/10 p-2.5 text-orange-600">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Belum ada soal
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Anda belum mengupload soal. Silakan lanjut ke halaman upload
                    untuk mengimpor file Excel.
                  </p>
                </div>
              </div>

              <Button asChild variant="orange" size="sm" className="text-white">
                <Link href={uploadHref} aria-label="Ke halaman upload soal">
                  Ke Halaman Upload
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </div>
        )}

        {hasQuestions && (
          <>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 bg-background">
                <ListChecks className="h-3.5 w-3.5 text-orange-500" />
                {questions.length} soal
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 bg-background">
                Tipe: {labelType}
              </span>
            </div>

            <ol className="grid gap-3">
              {questions.map((q, idx) => {
                const isTF = qType === "tf";
                const correctIdx = q.options.findIndex((o) => o.is_correct);
                const correctLabel =
                  correctIdx >= 0
                    ? isTF
                      ? q.options[correctIdx].option_text
                      : letters[correctIdx]
                    : "-";

                return (
                  <li
                    key={q.id}
                    className="rounded-2xl border bg-background/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground leading-snug">
                          {idx + 1}. {q.question}
                        </p>
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        Jawaban: {correctLabel}
                      </Badge>
                    </div>
                    {renderOptions(q)}
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </CardContent>

      {hasQuestions && (
        <CardFooter className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Maksimal 500 soal ditampilkan tanpa paginasi.
          </div>
          <Button
            asChild
            size="sm"
            variant="orange"
            className="text-white"
            title="Impor ulang soal dari file Excel"
          >
            <Link href={uploadHref}>Unggah / Impor Ulang</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
