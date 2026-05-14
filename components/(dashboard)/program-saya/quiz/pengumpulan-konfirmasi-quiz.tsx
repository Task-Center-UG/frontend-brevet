"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetData } from "@/hooks/use-get-data";
import { usePostData } from "@/hooks/use-post-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Clock4,
  CheckCircle2,
  Info,
  Timer,
  ClipboardCheck,
  FileText,
} from "lucide-react";
import { formatDistanceToNowStrict, isAfter, isBefore } from "date-fns";
import { id as localeID } from "date-fns/locale";
import axiosInstance from "@/helpers/axios-instance";
import { formatWIB } from "../../kelas/_utils/utils";

const chip =
  "inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-sm";

function pill(state: "open" | "closed" | "notStarted") {
  const base =
    "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-medium";
  if (state === "open") return `${base} bg-green-500 text-white`;
  if (state === "closed") return `${base} bg-destructive text-white`;
  return `${base} bg-muted text-foreground`;
}

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

type TQuizDetail = {
  id: string;
  title: string;
  description?: string;
  type: "tf" | "mc" | string;
  start_time?: string;
  end_time?: string;
  duration_minute?: number;
  max_attempts?: number;
};

type TAttempt = {
  id: string;
  quiz_id: string;
  user_id: string;
  started_at?: string | null;
  ended_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

type TAttemptListResp =
  | { data?: { data?: TAttempt[] } }
  | { data?: TAttempt[] }
  | { data?: TAttempt }
  | unknown;

type TAttemptResult = {
  id: string;
  attempt_id: string;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  score_percent: number;
  created_at: string;
  updated_at: string;
};

type TAttemptResultResp = {
  data?: TAttemptResult;
  message?: string;
  success?: boolean;
};

type Props = { batchSlug: string; quizId: string };

function isPlainObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

function isAttempt(x: unknown): x is TAttempt {
  if (!isPlainObject(x)) return false;
  return typeof x.id === "string";
}

function isAttemptArray(x: unknown): x is TAttempt[] {
  return Array.isArray(x) && x.every(isAttempt);
}

function isAttemptResult(x: unknown): x is TAttemptResult {
  if (!isPlainObject(x)) return false;
  return (
    typeof x.attempt_id === "string" && typeof x.score_percent === "number"
  );
}

function normalizeAttempts(raw: TAttemptListResp): TAttempt[] {
  if (isPlainObject(raw) && isPlainObject(raw.data)) {
    const inner = (raw.data as Record<string, unknown>).data;
    if (isAttemptArray(inner)) return inner;
    if (isAttempt(inner)) return [inner];
  }
  if (isPlainObject(raw) && "data" in raw) {
    const d = (raw as Record<string, unknown>).data;
    if (isAttemptArray(d)) return d;
    if (isAttempt(d)) return [d];
  }
  if (isAttemptArray(raw)) return raw;
  return [];
}

function extractAttemptId(raw: unknown): string | null {
  if (isPlainObject(raw) && typeof raw.id === "string") return raw.id;
  if (isPlainObject(raw) && isPlainObject(raw.data)) {
    const d = raw.data;
    if (typeof (d as Record<string, unknown>).id === "string")
      return (d as Record<string, unknown>).id as string;
    if (isPlainObject(d.data)) {
      const dd = d.data as Record<string, unknown>;
      if (typeof dd.id === "string") return dd.id as string;
      if (typeof dd.attempt_id === "string") return dd.attempt_id as string;
    }
  }
  return null;
}

function extractActiveAttemptId(raw: unknown): string | null {
  if (isPlainObject(raw) && isPlainObject(raw.data)) {
    const d = raw.data as Record<string, unknown>;
    if (typeof d.id === "string") return d.id;
  }
  return null;
}

export default function PengumpulanKonfirmasiQuiz({
  batchSlug,
  quizId,
}: Props) {
  const router = useRouter();

  const { data, isLoading, isError } = useGetData({
    queryKey: ["quiz", quizId],
    dataProtected: `quizzes/${quizId}`,
    options: { refetchOnWindowFocus: false },
  });

  const { data: activeAttemptResp } = useGetData({
    queryKey: ["active-attempt", quizId],
    dataProtected: `quizzes/${quizId}/attempts/active`,
    options: { refetchOnWindowFocus: false },
  });

  const { data: attemptQuiz } = useGetData({
    queryKey: ["attempt-quiz", quizId],
    dataProtected: `quizzes/${quizId}/attempts`,
    options: { refetchOnWindowFocus: false },
  });

  const [attemptResults, setAttemptResults] = React.useState<
    Record<string, TAttemptResult | null>
  >({});
  const [isLoadingResults, setIsLoadingResults] = React.useState(false);

  const attempts: TAttempt[] = React.useMemo(() => {
    return normalizeAttempts(attemptQuiz as TAttemptListResp);
  }, [attemptQuiz]);

  const activeAttemptId = extractActiveAttemptId(activeAttemptResp);
  const hasActiveAttempt = Boolean(activeAttemptId);

  const continueHref = hasActiveAttempt
    ? `/dashboard/program-saya/${batchSlug}/quiz/${quizId}/kerjakan/${activeAttemptId}`
    : "";

  const goBackHref = `/dashboard/program-saya/${batchSlug}`;

  const startAttempt = usePostData({
    queryKey: "quiz",
    dataProtected: `quizzes/${quizId}/start`,
    successMessage: "Quiz dimulai. Selamat mengerjakan!",
  });
  const isStarting =
    (startAttempt as { status?: string })?.status === "pending";

  React.useEffect(() => {
    let cancelled = false;
    async function fetchResults() {
      try {
        setIsLoadingResults(true);
        const entries = await Promise.all(
          attempts.map(
            async (att): Promise<readonly [string, TAttemptResult | null]> => {
              try {
                const res = await axiosInstance.get<TAttemptResultResp>(
                  `/quizzes/attempts/${att.id}/result`
                );
                const payload = res.data?.data;
                if (isAttemptResult(payload)) {
                  return [att.id, payload] as const;
                }
                return [att.id, null] as const;
              } catch {
                return [att.id, null] as const;
              }
            }
          )
        );
        if (cancelled) return;
        const map: Record<string, TAttemptResult | null> = {};
        for (const [id, val] of entries) map[id] = val;
        setAttemptResults(map);
      } finally {
        if (!cancelled) setIsLoadingResults(false);
      }
    }
    if (attempts.length) fetchResults();
    else setAttemptResults({});
    return () => {
      cancelled = true;
    };
  }, [attempts]);

  if (isLoading) {
    return (
      <Card className="w-full rounded-xl border shadow-sm overflow-hidden">
        <div className="h-1.5 w-full bg-primary" />
        <CardHeader className="p-5 md:p-6 border-b">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-full max-w-md" />
        </CardHeader>
        <CardContent className="p-5 md:p-6 grid gap-5">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
          <Skeleton className="h-1.5 w-full" />
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
          <Skeleton className="h-9 w-48" />
        </CardContent>
      </Card>
    );
  }

  if (
    isError ||
    !isPlainObject(data) ||
    !isPlainObject((data as Record<string, unknown>).data) ||
    !isPlainObject(
      ((data as Record<string, unknown>).data as Record<string, unknown>).data
    )
  ) {
    return <div className="text-sm text-destructive">Gagal memuat quiz.</div>;
  }

  const quiz = (
    (data as Record<string, unknown>).data as Record<string, unknown>
  ).data as TQuizDetail;

  const startAt = quiz.start_time ? new Date(quiz.start_time) : undefined;
  const endAt = quiz.end_time ? new Date(quiz.end_time) : undefined;
  const now = new Date();

  const notStarted = startAt ? isAfter(startAt, now) : false;
  const closed = endAt ? isBefore(endAt, now) : false;
  const open = !notStarted && !closed;

  const totalMs =
    startAt && endAt ? endAt.getTime() - startAt.getTime() : undefined;
  const goneMs = startAt ? now.getTime() - startAt.getTime() : undefined;
  const pct =
    totalMs && goneMs ? clamp(Math.round((goneMs / totalMs) * 100)) : 0;

  const timeInfo = endAt
    ? open
      ? `Sisa waktu: ${formatDistanceToNowStrict(endAt, { locale: localeID })}`
      : closed
        ? `Ditutup: ${formatDistanceToNowStrict(endAt, { locale: localeID })} lalu`
        : startAt
          ? `Mulai dalam: ${formatDistanceToNowStrict(startAt, { locale: localeID })}`
          : "-"
    : "-";

  const attemptsAllowed = quiz.max_attempts ?? 1;
  const attemptsUsed = attempts.length;
  const attemptsUsedText = String(attemptsUsed);

  const windowOpen = open;
  const reachedMax = attemptsUsed >= attemptsAllowed;
  const canInteract = (windowOpen && !reachedMax) || hasActiveAttempt;

  const typeLabel =
    quiz.type?.toLowerCase() === "tf"
      ? "True/False"
      : quiz.type?.toLowerCase() === "mc"
        ? "Pilihan Ganda"
        : (quiz.type ?? "-").toUpperCase();

  const btnLabel = hasActiveAttempt
    ? "Lanjutkan Quiz"
    : isStarting
      ? "Memulai..."
      : "Mulai Quiz";

  const handleClick = () => {
    if (hasActiveAttempt && continueHref) {
      router.push(continueHref);
      return;
    }
    if (!windowOpen || reachedMax) return;
    startAttempt.mutate(
      {},
      {
        onSuccess: (res: unknown) => {
          const id = extractAttemptId(res);
          if (id) {
            router.push(
              `/dashboard/program-saya/${batchSlug}/quiz/${quizId}/kerjakan/${id}`
            );
          } else {
            router.push(`/dashboard/program-saya/${batchSlug}/quiz/${quizId}`);
          }
        },
      }
    );
  };

  const sortedAttempts = [...attempts].sort((a, b) => {
    const getTime = (x: TAttempt) =>
      new Date(x.started_at ?? x.created_at ?? x.updated_at ?? 0).getTime();
    return getTime(b) - getTime(a);
  });

  return (
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
          <span
            className={pill(
              notStarted ? "notStarted" : open ? "open" : "closed"
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current/70" />
            {notStarted
              ? "Belum Dibuka"
              : open
                ? "Sedang Berjalan"
                : "Tertutup"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-5 md:p-6 grid gap-6">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <div className={chip}>
            <Clock4 className="h-4 w-4 text-orange-500" />
            <span>
              <span className="font-medium text-foreground">Mulai: </span>
              {formatWIB(startAt)}
            </span>
          </div>
          <div className={chip}>
            <Clock4 className="h-4 w-4 text-orange-500" />
            <span>
              <span className="font-medium text-foreground">Berakhir: </span>
              {formatWIB(endAt)}
            </span>
          </div>
          <div className={chip}>
            <Clock4 className="h-4 w-4 text-orange-500" />
            <span>{timeInfo}</span>
          </div>
        </div>

        {startAt && endAt && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Progres waktu</span>
              <span>{pct}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted">
              <div
                className="h-1.5 rounded-full bg-orange-500 transition-[width] duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <div className={chip}>
            <Info className="h-4 w-4 text-orange-500" />
            <span>
              Tipe:{" "}
              <span className="font-semibold text-foreground">{typeLabel}</span>
            </span>
          </div>
          <div className={chip}>
            <Timer className="h-4 w-4 text-orange-500" />
            <span>
              Durasi:{" "}
              <span className="font-semibold text-foreground">
                {quiz.duration_minute ?? 0} menit
              </span>
            </span>
          </div>
          <div className={chip}>
            <ClipboardCheck className="h-4 w-4 text-orange-500" />
            <span>
              Maks. percobaan:{" "}
              <span className="font-semibold text-foreground">
                {quiz.max_attempts ?? 1}
              </span>{" "}
              <span className="text-muted-foreground">
                (dipakai: {attemptsUsedText})
              </span>
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            variant={canInteract ? "orange" : "outline"}
            className={canInteract ? "text-white" : ""}
            disabled={!canInteract || isStarting}
            onClick={handleClick}
            title={
              hasActiveAttempt
                ? "Lanjutkan pengerjaan"
                : reachedMax
                  ? "Batas percobaan sudah tercapai"
                  : windowOpen
                    ? "Mulai quiz sekarang"
                    : notStarted
                      ? "Belum dibuka"
                      : "Ditutup"
            }
          >
            {hasActiveAttempt
              ? btnLabel
              : reachedMax
                ? "Batas Percobaan Tercapai"
                : btnLabel}
          </Button>

          <Button variant="outline" asChild>
            <Link href={goBackHref}>Kembali ke Kursus</Link>
          </Button>
        </div>

        <div className="mt-1 flex items-start gap-2 rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-orange-500" />
          <p>
            Mulai quiz akan memulai timer durasi. Pastikan koneksi stabil dan
            baca instruksi pengajar terlebih dahulu.
          </p>
        </div>

        <div className="mt-2">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-orange-500" />
            <h3 className="text-sm font-semibold">Riwayat Percobaan</h3>
          </div>

          {sortedAttempts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Belum ada percobaan.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-left">#</th>
                    <th className="px-3 py-2 text-left">Mulai</th>
                    <th className="px-3 py-2 text-left">Selesai</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Nilai</th>
                    <th className="px-3 py-2 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAttempts.map((att, idx) => {
                    const result = attemptResults[att.id] ?? null;
                    const isOngoing = !att.ended_at;
                    return (
                      <tr
                        key={att.id}
                        className="border-t hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-3 py-2">{idx + 1}</td>
                        <td className="px-3 py-2">
                          {formatWIB(att.started_at ?? att.created_at)}
                        </td>
                        <td className="px-3 py-2">
                          {formatWIB(att.ended_at ?? undefined)}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={
                              "inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-[11px] font-medium " +
                              (isOngoing
                                ? "bg-blue-500 text-white"
                                : "bg-muted text-foreground")
                            }
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current/70" />
                            {isOngoing ? "Sedang Berjalan" : "Selesai"}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          {isLoadingResults ? (
                            <span className="text-muted-foreground">
                              memuat...
                            </span>
                          ) : result ? (
                            <div className="flex flex-col">
                              <span className="font-semibold">
                                {result.score_percent}%
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Benar {result.correct_answers}/
                                {result.total_questions} • Salah{" "}
                                {result.wrong_answers}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          {isOngoing ? (
                            <Button
                              size="sm"
                              variant="orange"
                              className="text-white"
                              onClick={() =>
                                router.push(
                                  `/dashboard/program-saya/${batchSlug}/quiz/${quizId}/kerjakan/${att.id}`
                                )
                              }
                            >
                              Lanjutkan
                            </Button>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
