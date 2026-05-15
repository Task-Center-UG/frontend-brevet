"use client";

import { useGetData } from "@/hooks/use-get-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock4,
  ExternalLink,
  Eye,
  Info,
  Paperclip,
  Repeat2,
  Trash2,
} from "lucide-react";
import { format, formatDistanceToNowStrict, isAfter, isBefore } from "date-fns";
import { id as localeID } from "date-fns/locale";
import * as React from "react";
import {
  TAssignmentDetail,
  TAssignmentSubmission,
} from "./_types/submission-type";
import { useDeleteData } from "@/hooks/use-delete-data";
import { toAssetUrl } from "@/helpers/api-config";
import { chip, clamp, formatWIB, pill } from "./_utils/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = { batchSlug: string; assignmentId: string };

const PengumpulanKonfirmasi = ({ batchSlug, assignmentId }: Props) => {
  const {
    data: assignmentResp,
    isLoading,
    isError,
  } = useGetData({
    queryKey: ["assignment", assignmentId],
    dataProtected: `assignments/${assignmentId}`,
  });

  const assignment: TAssignmentDetail | undefined = assignmentResp?.data?.data;

  const mySubmissions: (TAssignmentSubmission & { score?: number | null })[] =
    assignment?.assignment_submissions
      ?.slice()
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      )
      .map((s) => ({
        ...s,
        score: s.assignment_grade?.grade ?? null,
      })) ?? [];

  const latest = mySubmissions.at(-1);

  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    React.useState<TAssignmentSubmission | null>(null);

  const startAt = assignment ? new Date(assignment.start_at) : new Date();
  const endAt = assignment ? new Date(assignment.end_at) : new Date();
  const now = new Date();

  const notStarted = isAfter(startAt, now);
  const closed = isBefore(endAt, now);
  const open = !notStarted && !closed;

  const deleteLatest = useDeleteData({
    queryKey: "assignment",
    dataProtected: latest ? `submissions/${latest.id}` : "submissions/_",
    successMessage: "Jawaban berhasil dihapus.",
  });

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
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
          <Skeleton className="h-9 w-48" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !assignment)
    return <div className="text-sm text-destructive">Gagal memuat tugas.</div>;

  const totalMs = endAt.getTime() - startAt.getTime();
  const goneMs = now.getTime() - startAt.getTime();
  const pct = totalMs > 0 ? clamp((goneMs / totalMs) * 100) : 0;

  const timeInfo = open
    ? `Sisa waktu: ${formatDistanceToNowStrict(endAt, { locale: localeID })}`
    : closed
      ? `Ditutup: ${formatDistanceToNowStrict(endAt, { locale: localeID })} lalu`
      : `Mulai dalam: ${formatDistanceToNowStrict(startAt, { locale: localeID })}`;

  const attemptsAllowed = 1;
  const attemptsUsed = mySubmissions.length;
  const hasAnyAttempt = attemptsUsed > 0;

  const currentScore = latest?.assignment_grade?.grade ?? null;
  const currentScoreDisplay = currentScore == null ? "-" : `${currentScore}`;
  const isLatestGraded = currentScore !== null && currentScore !== undefined;

  const actionHref = `/dashboard/program-saya/${batchSlug}/tugas/${assignmentId}/kerjakan`;
  const goBackHref = `/dashboard/program-saya/${batchSlug}`;

  const isActing = deleteLatest?.status === "pending";

  return (
    <>
      <Card className="w-full overflow-hidden rounded-lg border shadow-sm">
        <div className="h-1 w-full bg-primary" />
        <CardHeader className="p-5 md:p-6 border-b">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Ruang Tugas
              </p>
              <CardTitle className="text-lg md:text-xl font-semibold tracking-tight">
                {assignment.title}
              </CardTitle>
              {assignment.description && (
                <CardDescription className="text-sm leading-relaxed">
                  {assignment.description}
                </CardDescription>
              )}
            </div>
            <span
              className={
                notStarted
                  ? pill("notStarted")
                  : open
                    ? pill("open")
                    : pill("closed")
              }
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

        <CardContent className="p-5 md:p-6 grid gap-5">
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

            <div className={`${chip} sm:col-span-2 lg:col-span-1`}>
              <Clock4 className="h-4 w-4 text-orange-500" />
              <span>{timeInfo}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Progres waktu</span>
              <span>{Math.round(pct)}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted">
              <div
                className="h-1.5 rounded-full bg-orange-500 transition-[width] duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <div className={chip}>
              <Info className="h-4 w-4 text-orange-500" />
              <span>
                Kesempatan pengerjaan:{" "}
                <span className="font-semibold text-foreground">
                  {attemptsAllowed}
                </span>
              </span>
            </div>
            <div className={chip}>
              <Repeat2 className="h-4 w-4 text-orange-500" />
              <span>
                Percobaan dipakai:{" "}
                <span className="font-semibold text-foreground">
                  {attemptsUsed}
                </span>
              </span>
            </div>
            <div className={chip}>
              <CheckCircle2 className="h-4 w-4 text-orange-500" />
              <span>
                Nilai saat ini:{" "}
                <span className="font-semibold text-foreground">
                  {currentScoreDisplay}
                </span>
              </span>
            </div>
          </div>

          {mySubmissions.length > 0 && (
            <>
              <div className="h-px w-full bg-border" />
              <p className="text-sm font-medium">Riwayat Percobaan</p>
              <ul className="space-y-1.5">
                {mySubmissions.map((s, i) => {
                  const isLatest = latest?.id === s.id;
                  const scoreText =
                    typeof s.score === "number"
                      ? `Skor: ${s.score}`
                      : "Belum dinilai";
                  const feedback =
                    s.assignment_grade?.feedback &&
                    s.assignment_grade.feedback.trim().length > 0
                      ? s.assignment_grade.feedback
                      : null;

                  return (
                    <li
                      key={s.id}
                      className="flex flex-col gap-3 rounded-md border bg-muted/30 px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="text-foreground">
                        Percobaan {i + 1} -{" "}
                        {format(new Date(s.created_at), "dd MMM yyyy, HH:mm", {
                          locale: localeID,
                        })}{" "}
                        WIB
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-muted-foreground">
                          {scoreText}
                        </span>

                        {feedback && (
                          <span className="text-xs text-muted-foreground italic">
                            Catatan: {feedback}
                          </span>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => {
                            setSelectedSubmission(s);
                            setOpenDialog(true);
                          }}
                        >
                          <Eye className="size-4" />
                          Lihat Jawaban
                        </Button>

                        {open && isLatest && !isLatestGraded && (
                          <>
                            <Button
                              variant="secondary"
                              disabled={isActing}
                              asChild
                            >
                              <Link
                                className="gap-2"
                                href={`/dashboard/program-saya/${batchSlug}/tugas/${assignmentId}/jawaban/${latest?.id}`}
                              >
                                Ubah Jawaban
                              </Link>
                            </Button>

                            <DeleteSubmissionDialog
                              disabled={isActing}
                              onConfirm={() => deleteLatest.mutate()}
                            />
                          </>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            {open && attemptsUsed < attemptsAllowed ? (
              <Button variant="orange" asChild>
                <Link href={actionHref}>
                  {!hasAnyAttempt ? "Kerjakan" : "Kerjakan Ulang"}
                </Link>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link href={goBackHref} className="gap-2">
                  <ArrowLeft className="size-4" />
                  Kembali ke Kursus
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>Lihat Jawaban</DialogTitle>
            <DialogDescription>
              Pratinjau jawaban yang telah dikumpulkan.
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission ? (
            <>
              {isEssayView(assignment?.type, selectedSubmission) ? (
                <div
                  className="prose max-w-none border rounded-md p-4 bg-muted/30"
                  dangerouslySetInnerHTML={{
                    __html:
                      selectedSubmission.essay_text &&
                      selectedSubmission.essay_text.trim()
                        ? selectedSubmission.essay_text
                        : "<p>(Tidak ada isi jawaban)</p>",
                  }}
                />
              ) : (
                <div className="space-y-3">
                  {selectedSubmission.submission_files?.length ? (
                    selectedSubmission.submission_files.map((f, idx) => {
                      const ext =
                        f.file_url.split(".").pop()?.toLowerCase() || "";
                      const studentName =
                        selectedSubmission.user?.name
                          ?.replace(/\s+/g, "_")
                          .toLowerCase() || "peserta";
                      const assignmentTitle =
                        assignment?.title?.replace(/\s+/g, "_").toLowerCase() ||
                        "tugas";
                      const filename = `${studentName}_${assignmentTitle}_${idx + 1}.${ext}`;

                      return (
                        <div
                          key={f.id}
                          className="flex items-center justify-between gap-3 rounded-md border bg-muted/30 p-3"
                        >
                          <span className="inline-flex min-w-0 items-center gap-2 text-sm">
                            <Paperclip className="size-4 shrink-0 text-primary" />
                            <span className="truncate">{filename}</span>
                          </span>
                          <Button asChild size="sm" variant="secondary">
                            <a
                              className="gap-2"
                              href={toAssetUrl(f.file_url)}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <ExternalLink className="size-4" />
                              Buka Lampiran
                            </a>
                          </Button>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Tidak ada lampiran yang diunggah.
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Tidak ada data.</p>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenDialog(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

function isEssayView(
  parentAssignmentType: string | undefined,
  sub: TAssignmentSubmission,
) {
  const parentIsEssay = (parentAssignmentType || "").toLowerCase() === "essay";
  const hasEssay =
    typeof sub.essay_text === "string" &&
    sub.essay_text.trim().length > 0 &&
    (sub.submission_files?.length ?? 0) === 0;

  return parentIsEssay || hasEssay;
}

export default PengumpulanKonfirmasi;

function DeleteSubmissionDialog({
  disabled,
  onConfirm,
}: {
  disabled?: boolean;
  onConfirm: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="gap-2 text-white"
          variant="destructive"
          disabled={disabled}
        >
          <Trash2 className="size-4" />
          Hapus
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle>Konfirmasi Hapus</DialogTitle>
          <DialogDescription>
            Yakin ingin menghapus jawaban terakhir? Tindakan ini tidak dapat
            dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button
            variant="destructive"
            className="text-white"
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
