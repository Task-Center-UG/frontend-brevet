"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  ChartBarIncreasing,
  CheckCircle2,
  ClipboardList,
  Clock4,
  FileQuestion,
  FileText,
  LockKeyhole,
  Paperclip,
  Settings,
  XCircle,
} from "lucide-react";
import { formatDistanceToNowStrict, isAfter, isBefore } from "date-fns";
import { id as localeID } from "date-fns/locale";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toAssetUrl } from "@/helpers/api-config";
import { cn } from "@/lib/utils";
import { TUser } from "../profile/_types/user-type";
import { formatWIB } from "./_utils/utils";
import { TBatchMeeting } from "./_types/kelas-pertemuan-type";

const quizTypeLabel: Record<string, string> = {
  mc: "Pilihan Ganda",
  tf: "True/False",
};

type Props = {
  meeting: TBatchMeeting;
  batchSlug: string;
  currentUser?: TUser;
  index?: number;
};

export default function KelasCard({
  meeting,
  batchSlug,
  currentUser,
  index = 0,
}: Props) {
  const isTeacher = meeting.teachers.some(
    (teacher) => teacher.id === currentUser?.id,
  );
  const isStudent = currentUser?.role_type === "siswa";
  const isExam = meeting.meeting_type === "exam";
  const meetingLabel = isExam ? "Ujian" : "Pertemuan";

  return (
    <article
      className="rounded-lg border bg-card shadow-sm transition duration-200 hover:border-primary/25 hover:shadow-md"
      aria-label={`Pertemuan ${meeting.title}`}
    >
      <header className="border-b p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={isExam ? "destructive" : "secondary"}
                className="rounded-full"
              >
                {meetingLabel} {index + 1}
              </Badge>
              <Badge variant="outline" className="rounded-full">
                <BookOpenCheck className="size-3.5" />
                {meeting.materials.length} materi
              </Badge>
              <Badge variant="outline" className="rounded-full">
                <ClipboardList className="size-3.5" />
                {meeting.assignments.length} tugas
              </Badge>
              <Badge variant="outline" className="rounded-full">
                <FileQuestion className="size-3.5" />
                {meeting.quizzes?.length ?? 0} quiz
              </Badge>
            </div>

            <h2 className="mt-3 text-xl font-extrabold leading-tight tracking-normal">
              {meeting.title}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1">
                <CalendarDays className="size-4 text-primary" />
                {formatWIB(meeting.start_at)} sampai {formatWIB(meeting.end_at)}
              </span>
            </div>
            {meeting.description ? (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                {meeting.description}
              </p>
            ) : null}
          </div>

          {isTeacher ? (
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <ManageButton
                href={`/dashboard/kelas/${batchSlug}/materi?${meeting.id}`}
                label="Materi"
              />
              <ManageButton
                href={`/dashboard/kelas/${batchSlug}/tugas?${meeting.id}`}
                label="Tugas"
              />
              <ManageButton
                href={`/dashboard/kelas/${batchSlug}/quiz?${meeting.id}`}
                label="Quiz"
              />
              <Button size="sm" variant="outline" className="gap-2" asChild>
                <Link
                  href={`/dashboard/kelas/${batchSlug}/nilai?${meeting.id}`}
                >
                  <ChartBarIncreasing className="size-4 shrink-0" />
                  Nilai
                </Link>
              </Button>
            </div>
          ) : null}
        </div>
      </header>

      <div className="grid gap-4 p-5 xl:grid-cols-3">
        <ContentPanel
          icon={FileText}
          title="Materi"
          empty="Belum ada materi pada pertemuan ini."
        >
          {meeting.materials.length > 0
            ? meeting.materials.map((material, materialIndex) => {
                const ext = getExt(material.url);
                return (
                  <a
                    key={material.id}
                    href={toAssetUrl(material.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 rounded-md border bg-background p-3 transition hover:border-primary/30 hover:bg-muted/50"
                  >
                    <div className="min-w-0">
                      <p className="line-clamp-1 text-sm font-semibold text-foreground">
                        {material.title || `Materi ${materialIndex + 1}`}
                      </p>
                      {material.description ? (
                        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                          {material.description}
                        </p>
                      ) : null}
                    </div>
                    <FileBadge ext={ext} />
                  </a>
                );
              })
            : null}
        </ContentPanel>

        <ContentPanel
          icon={ClipboardList}
          title="Tugas"
          empty="Belum ada tugas pada pertemuan ini."
        >
          {meeting.assignments.length > 0
            ? meeting.assignments.map((assignment) => {
                const timing = getTiming(
                  assignment.start_at,
                  assignment.end_at,
                );
                const href = `/dashboard/program-saya/${batchSlug}/tugas/${assignment.id}`;

                return (
                  <div
                    key={assignment.id}
                    className="rounded-md border bg-background p-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="line-clamp-1 text-sm font-semibold">
                          {assignment.title}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatWIB(assignment.start_at)} sampai{" "}
                          {formatWIB(assignment.end_at)}
                        </p>
                      </div>
                      <StatusPill timing={timing} />
                    </div>

                    {assignment.assignment_files.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {assignment.assignment_files.map((file, fileIndex) => {
                          const ext = getExt(file.file_url);
                          return (
                            <a
                              key={file.id}
                              href={toAssetUrl(file.file_url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs hover:bg-muted"
                            >
                              <Paperclip className="size-3.5" />
                              tugas-{fileIndex + 1}.{ext}
                            </a>
                          );
                        })}
                      </div>
                    ) : null}

                    {isStudent ? (
                      <div className="mt-3">
                        {timing.state === "notStarted" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled
                            className="w-full justify-start gap-2"
                          >
                            <LockKeyhole className="size-4 shrink-0" />
                            Belum Dibuka
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant={
                              timing.state === "closed" ? "outline" : "default"
                            }
                            className="w-full justify-start gap-2"
                            asChild
                          >
                            <Link href={href}>
                              {timing.state === "closed" ? (
                                <XCircle className="size-4 shrink-0" />
                              ) : (
                                <ArrowRight className="size-4 shrink-0" />
                              )}
                              {timing.state === "closed"
                                ? "Lihat Riwayat"
                                : "Kerjakan Tugas"}
                            </Link>
                          </Button>
                        )}
                      </div>
                    ) : null}
                  </div>
                );
              })
            : null}
        </ContentPanel>

        <ContentPanel
          icon={FileQuestion}
          title="Quiz"
          empty="Belum ada quiz pada pertemuan ini."
        >
          {meeting.quizzes?.length
            ? meeting.quizzes.map((quiz) => {
                const timing = getTiming(quiz.start_time, quiz.end_time);
                const typeLabel =
                  quizTypeLabel[quiz.type?.toLowerCase?.() || ""] ?? quiz.type;
                const href = `/dashboard/program-saya/${batchSlug}/quiz/${quiz.id}`;

                return (
                  <div
                    key={quiz.id}
                    className="rounded-md border bg-background p-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="line-clamp-1 text-sm font-semibold">
                          {quiz.title}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {typeLabel}, {quiz.duration_minute} menit
                        </p>
                      </div>
                      <StatusPill timing={timing} />
                    </div>

                    <div className="mt-3 grid gap-1 text-xs text-muted-foreground">
                      <span>{formatWIB(quiz.start_time)}</span>
                      <span>{formatWIB(quiz.end_time)}</span>
                    </div>

                    {isStudent ? (
                      <div className="mt-3">
                        {timing.state === "notStarted" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled
                            className="w-full justify-start gap-2"
                          >
                            <LockKeyhole className="size-4 shrink-0" />
                            Belum Dibuka
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant={
                              timing.state === "closed" ? "outline" : "default"
                            }
                            className="w-full justify-start gap-2"
                            asChild
                          >
                            <Link href={href}>
                              {timing.state === "closed" ? (
                                <CheckCircle2 className="size-4 shrink-0" />
                              ) : (
                                <ArrowRight className="size-4 shrink-0" />
                              )}
                              {timing.state === "closed"
                                ? "Lihat Hasil"
                                : "Ikuti Quiz"}
                            </Link>
                          </Button>
                        )}
                      </div>
                    ) : null}
                  </div>
                );
              })
            : null}
        </ContentPanel>
      </div>
    </article>
  );
}

function ContentPanel({
  icon: Icon,
  title,
  empty,
  children,
}: {
  icon: React.ElementType;
  title: string;
  empty: string;
  children: React.ReactNode;
}) {
  const hasChildren = React.Children.count(children) > 0;

  return (
    <section className="rounded-md border bg-muted/20 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="size-4 text-primary" />
        <h3 className="text-sm font-bold">{title}</h3>
      </div>
      <div className="grid gap-2">
        {hasChildren ? (
          children
        ) : (
          <p className="rounded-md border bg-background p-3 text-sm text-muted-foreground">
            {empty}
          </p>
        )}
      </div>
    </section>
  );
}

function ManageButton({ href, label }: { href: string; label: string }) {
  return (
    <Button size="sm" variant="outline" className="gap-2" asChild>
      <Link href={href}>
        <Settings className="size-4 shrink-0" />
        {label}
      </Link>
    </Button>
  );
}

function FileBadge({ ext }: { ext: string }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold uppercase",
        ext === "pdf"
          ? "bg-destructive/10 text-destructive"
          : ["png", "jpg", "jpeg", "webp"].includes(ext)
            ? "bg-emerald-500/10 text-emerald-700"
            : "bg-muted text-muted-foreground",
      )}
    >
      {ext}
    </span>
  );
}

type Timing = {
  state: "open" | "closed" | "notStarted";
  text: string;
};

function getTiming(startValue: string, endValue: string): Timing {
  const now = new Date();
  const start = new Date(startValue);
  const end = new Date(endValue);
  const notStarted = isAfter(start, now);
  const closed = isBefore(end, now);

  if (notStarted) {
    return {
      state: "notStarted",
      text: `Mulai ${formatDistanceToNowStrict(start, { locale: localeID })} lagi`,
    };
  }
  if (closed) {
    return {
      state: "closed",
      text: "Ditutup",
    };
  }
  return {
    state: "open",
    text: `Sisa ${formatDistanceToNowStrict(end, { locale: localeID })}`,
  };
}

function StatusPill({ timing }: { timing: Timing }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        timing.state === "open" &&
          "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        timing.state === "closed" && "bg-destructive/10 text-destructive",
        timing.state === "notStarted" && "bg-muted text-muted-foreground",
      )}
    >
      <Clock4 className="size-3.5" />
      {timing.text}
    </span>
  );
}

function getExt(value: string) {
  return value.split(".").pop()?.toLowerCase() || "file";
}
