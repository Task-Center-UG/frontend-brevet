"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BookCheck,
  BookOpen,
  ListChecks,
  Paperclip,
  ClipboardList,
  FileText,
  Clock4,
  ChartBarIncreasing,
  BookDashed,
} from "lucide-react";
import { formatDistanceToNowStrict, isAfter, isBefore } from "date-fns";
import { id as localeID } from "date-fns/locale";
import { TBatchMeeting } from "./_types/kelas-pertemuan-type";
import { TUser } from "../profile/_types/user-type";
import * as React from "react";
import { formatWIB } from "./_utils/utils";

const getFileBadgeClass = (ext: string) => {
  if (ext === "pdf") return "bg-destructive/15 text-destructive";
  if (["png", "jpg", "jpeg", "webp"].includes(ext))
    return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
  return "bg-muted text-muted-foreground";
};

const quizTypeLabel: Record<string, string> = {
  mc: "Pilihan Ganda",
  tf: "True/False",
};

type Props = {
  meeting: TBatchMeeting;
  batchSlug: string;
  currentUser?: TUser;
};

export default function KelasCard({ meeting, batchSlug, currentUser }: Props) {
  const isTeacher = meeting.teachers.some((t) => t.id === currentUser?.id);

  const type = meeting.meeting_type;
  const label = type === "basic" ? "Biasa" : type === "exam" ? "Ujian" : type;

  const cardTone =
    type === "exam"
      ? "from-destructive/20 via-destructive/10 to-transparent"
      : "from-orange-500/20 via-orange-500/10 to-transparent";

  const statusVariant =
    type === "basic"
      ? "secondary"
      : type === "exam"
        ? "destructive"
        : "outline";

  return (
    <Card
      className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-background/60 to-background shadow-sm transition-all hover:shadow-lg hover:ring-1 hover:ring-primary/30"
      aria-label={`Kartu pertemuan ${meeting.title}`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${cardTone}`}
        aria-hidden
      />

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-base font-semibold text-foreground leading-snug line-clamp-2">
              {meeting.title}
            </CardTitle>
            {meeting.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {meeting.description}
              </p>
            )}
          </div>

          <div className="shrink-0">
            <Badge
              variant={statusVariant}
              className="rounded-full px-2.5 py-0.5 text-[11px]"
            >
              {label}
            </Badge>
          </div>
        </div>

        {/* counter pill: materi, tugas, quiz */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 bg-background">
            <BookCheck className="h-3.5 w-3.5 text-orange-500" />
            {meeting.materials.length} materi
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 bg-background">
            <ClipboardList className="h-3.5 w-3.5 text-orange-500" />
            {meeting.assignments.length} tugas
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 bg-background">
            <BookDashed className="h-3.5 w-3.5 text-orange-500" />
            {meeting.quizzes?.length ?? 0} quiz
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Materi */}
        <section aria-label="Materi pertemuan" className="space-y-2">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-orange-500" />
            Materi
          </h4>

          {meeting.materials.length > 0 ? (
            <ul className="grid gap-2 sm:grid-cols-2">
              {meeting.materials.map((m, index) => {
                const ext = m.url.split(".").pop()?.toLowerCase() ?? "file";
                return (
                  <li
                    key={m.id}
                    className="group/material flex items-center justify-between gap-3 rounded-xl border bg-background/60 px-3 py-3 transition hover:bg-muted"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">
                        {m.title}
                      </p>
                      {m.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {m.description}
                        </p>
                      )}
                    </div>

                    <Link
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] hover:bg-background"
                      aria-label={`Unduh materi ${index + 1} ekstensi ${ext}`}
                    >
                      <span
                        className={`px-2 py-0.5 rounded-full ${getFileBadgeClass(
                          ext
                        )}`}
                      >
                        {ext.toUpperCase()}
                      </span>
                      materi-{index + 1}.{ext.toUpperCase()}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Belum ada materi pada pertemuan ini.
            </p>
          )}
        </section>

        {/* Tugas */}
        <section aria-label="Daftar tugas" className="space-y-2">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-orange-500" />
            Daftar Tugas
          </h4>

          {meeting.assignments.length > 0 ? (
            <ul className="space-y-3">
              {meeting.assignments.map((assignment, index) => {
                const now = new Date();
                const startDate = new Date(assignment.start_at);
                const endDate = new Date(assignment.end_at);

                const notStarted = isAfter(startDate, now);
                const closed = isBefore(endDate, now);
                const open = !notStarted && !closed;

                const timeInfo = open
                  ? `Sisa waktu: ${formatDistanceToNowStrict(endDate, {
                      locale: localeID,
                    })}`
                  : closed
                    ? `Ditutup: ${formatDistanceToNowStrict(endDate, {
                        locale: localeID,
                      })} lalu`
                    : `Mulai dalam: ${formatDistanceToNowStrict(startDate, {
                        locale: localeID,
                      })}`;

                const timePillClass = notStarted
                  ? "bg-muted text-foreground"
                  : open
                    ? "bg-green-500 text-white"
                    : "bg-destructive text-white";

                return (
                  <li
                    key={assignment.id}
                    className="rounded-2xl border bg-background/60 p-3 transition hover:bg-muted"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground leading-tight line-clamp-1">
                          {assignment.title}
                        </p>

                        <div className="mt-0.5 flex flex-wrap items-center gap-3 text-[12px] text-muted-foreground">
                          <span>
                            <span className="font-medium text-foreground/80">
                              Mulai:
                            </span>{" "}
                            {formatWIB(assignment.start_at)}
                          </span>
                          <span>
                            <span className="font-medium text-foreground/80">
                              Berakhir:
                            </span>{" "}
                            {formatWIB(assignment.end_at)}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] ${timePillClass}`}
                      >
                        <Clock4 className="h-3.5 w-3.5" />
                        {timeInfo}
                      </span>
                    </div>

                    {assignment.assignment_files.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {assignment.assignment_files.map((file) => {
                          const ext =
                            file.file_url.split(".").pop()?.toLowerCase() ??
                            "file";
                          return (
                            <Link
                              key={file.id}
                              href={file.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] hover:bg-background"
                              aria-label={`Unduh tugas ${index + 1} ekstensi ${ext}`}
                            >
                              <Paperclip className="h-3.5 w-3.5" />
                              <span
                                className={`px-2 py-0.5 rounded-full ${getFileBadgeClass(
                                  ext
                                )}`}
                              >
                                {ext.toUpperCase()}
                              </span>
                              <span className="text-primary hover:underline">
                                tugas-{index + 1}.{ext}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    )}

                    {currentUser?.role_type === "siswa" && (
                      <div className="mt-3">
                        {closed ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            asChild
                            className="w-full sm:w-auto text-white"
                          >
                            <Link
                              href={`/dashboard/program-saya/${batchSlug}/tugas/${assignment.id}`}
                              aria-label={`Kerjakan tugas ${assignment.title}`}
                            >
                              Ditutup
                            </Link>
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="orange"
                            asChild
                            className="w-full sm:w-auto"
                            disabled={notStarted}
                          >
                            <Link
                              href={`/dashboard/program-saya/${batchSlug}/tugas/${assignment.id}`}
                              aria-label={`Kerjakan tugas ${assignment.title}`}
                            >
                              {notStarted ? "Belum Dibuka" : "Kerjakan Tugas"}
                            </Link>
                          </Button>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Belum ada tugas pada pertemuan ini.
            </p>
          )}
        </section>

        <section aria-label="Daftar quiz" className="space-y-2">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <BookDashed className="h-4 w-4 text-orange-500" />
            Daftar Quiz
          </h4>

          {meeting.quizzes && meeting.quizzes.length > 0 ? (
            <ul className="space-y-3">
              {meeting.quizzes.map((q) => {
                const now = new Date();
                const startDate = new Date(q.start_time);
                const endDate = new Date(q.end_time);

                const notStarted = isAfter(startDate, now);
                const closed = isBefore(endDate, now);
                const open = !notStarted && !closed;

                const timeInfo = open
                  ? `Sisa waktu: ${formatDistanceToNowStrict(endDate, {
                      locale: localeID,
                    })}`
                  : closed
                    ? `Ditutup: ${formatDistanceToNowStrict(endDate, {
                        locale: localeID,
                      })} lalu`
                    : `Mulai dalam: ${formatDistanceToNowStrict(startDate, {
                        locale: localeID,
                      })}`;

                const timePillClass = notStarted
                  ? "bg-muted text-foreground"
                  : open
                    ? "bg-green-500 text-white"
                    : "bg-destructive text-white";

                const tLabel =
                  quizTypeLabel[q.type?.toLowerCase?.() || ""] ?? q.type;

                return (
                  <li
                    key={q.id}
                    className="rounded-2xl border bg-background/60 p-3 transition hover:bg-muted"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground leading-tight line-clamp-1">
                            {q.title}
                          </p>
                          <Badge variant="outline">{tLabel}</Badge>
                        </div>

                        <div className="mt-0.5 flex flex-wrap items-center gap-3 text-[12px] text-muted-foreground">
                          <span>
                            <span className="font-medium text-foreground/80">
                              Mulai:
                            </span>{" "}
                            {formatWIB(q.start_time)}
                          </span>
                          <span>
                            <span className="font-medium text-foreground/80">
                              Berakhir:
                            </span>{" "}
                            {formatWIB(q.end_time)}
                          </span>
                          <span>
                            <span className="font-medium text-foreground/80">
                              Durasi:
                            </span>{" "}
                            {q.duration_minute} menit
                          </span>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] ${timePillClass}`}
                      >
                        <Clock4 className="h-3.5 w-3.5" />
                        {timeInfo}
                      </span>
                    </div>

                    {currentUser?.role_type === "siswa" && (
                      <div className="mt-3">
                        {closed ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            asChild
                            className="w-full sm:w-auto text-white"
                          >
                            <Link
                              href={`/dashboard/program-saya/${batchSlug}/quiz/${q.id}`}
                              aria-label={`Ikuti quiz ${q.title}`}
                            >
                              Ditutup
                            </Link>
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="orange"
                            asChild
                            className="w-full sm:w-auto"
                            disabled={notStarted}
                          >
                            <Link
                              href={`/dashboard/program-saya/${batchSlug}/quiz/${q.id}`}
                              aria-label={`Ikuti quiz ${q.title}`}
                            >
                              {notStarted ? "Belum Dibuka" : "Ikuti Quiz"}
                            </Link>
                          </Button>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Belum ada quiz pada pertemuan ini.
            </p>
          )}
        </section>

        {isTeacher && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button size="sm" variant="orange" asChild>
              <Link href={`/dashboard/kelas/${batchSlug}/materi?${meeting.id}`}>
                <BookCheck className="mr-2 h-4 w-4" />
                Kelola Materi
              </Link>
            </Button>
            <Button size="sm" variant="orange" asChild>
              <Link href={`/dashboard/kelas/${batchSlug}/tugas?${meeting.id}`}>
                <BookOpen className="mr-2 h-4 w-4" />
                Kelola Tugas
              </Link>
            </Button>
            <Button size="sm" variant="orange" asChild>
              <Link href={`/dashboard/kelas/${batchSlug}/quiz?${meeting.id}`}>
                <BookDashed className="mr-2 h-4 w-4" />
                Kelola Quiz
              </Link>
            </Button>
            <Button size="sm" variant="orange" asChild>
              <Link href={`/dashboard/kelas/${batchSlug}/nilai?${meeting.id}`}>
                <ChartBarIncreasing className="mr-2 h-4 w-4" />
                Kelola Nilai
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
