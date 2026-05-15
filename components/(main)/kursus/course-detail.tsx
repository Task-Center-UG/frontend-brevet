"use client";

import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Info,
  ListTodo,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useGetData } from "@/hooks/use-get-data";
import { useParams } from "next/navigation";
import Link from "next/link";
import { TCourseBatch } from "@/components/(dashboard)/kursus/gelombang/_types/course-batch-type";
import { formatPeriode } from "./_libs/format-periode";
import { DAY_OPTIONS } from "@/components/(dashboard)/kursus/gelombang/_constants/day-options";
import NotFoundContent from "../not-found-content";
import { cn } from "@/lib/utils";

import {
  isWithinInterval,
  isBefore,
  isAfter,
  differenceInCalendarDays,
  format,
} from "date-fns";
import { id as idLocale } from "date-fns/locale";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

type RegStatus = "open" | "not_yet" | "closed" | "unknown";

const groupLabel = (
  groupType: "mahasiswa_gunadarma" | "mahasiswa_non_gunadarma" | "umum",
) => {
  if (groupType === "mahasiswa_gunadarma") return "Mahasiswa Gunadarma";
  if (groupType === "mahasiswa_non_gunadarma") return "Mahasiswa Non-Gunadarma";
  return "Umum";
};

const dayLabel = (day: string) =>
  DAY_OPTIONS.find((option) => option.value === day)?.label || day;

const statusCopy: Record<RegStatus, { label: string; tone: string }> = {
  open: {
    label: "Pendaftaran dibuka",
    tone: "border-primary/20 bg-primary/10 text-primary",
  },
  not_yet: {
    label: "Belum dibuka",
    tone: "border-amber-500/20 bg-amber-500/10 text-amber-700",
  },
  closed: {
    label: "Pendaftaran ditutup",
    tone: "border-muted bg-muted text-muted-foreground",
  },
  unknown: {
    label: "Jadwal pendaftaran belum tersedia",
    tone: "border-muted bg-muted text-muted-foreground",
  },
};

function DetailSkeleton() {
  return (
    <section className="w-full bg-background pt-16 md:pt-24">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-10 px-6 pb-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-col gap-6">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-20 w-full max-w-3xl" />
            <Skeleton className="h-6 w-full max-w-2xl" />
            <Skeleton className="aspect-[16/9] w-full rounded-xl" />
          </div>
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-6">
            <Skeleton className="h-6 w-32" />
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
            <Skeleton className="h-11 w-full rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CourseDetail() {
  const params = useParams();
  const slug = params?.slug as string;

  const { data, isLoading, isError } = useGetData({
    queryKey: ["batches", slug],
    dataProtected: `batches/${slug}`,
  });

  const batch: TCourseBatch | undefined = data?.data?.data;

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError || !batch) {
    return (
      <div className="mx-auto max-w-screen-md px-6 py-24 md:py-32">
        <NotFoundContent message="Gagal memuat data kursus. Silakan coba lagi." />
      </div>
    );
  }

  const now = new Date();
  const regStart = batch.registration_start_at
    ? new Date(batch.registration_start_at)
    : null;
  const regEnd = batch.registration_end_at
    ? new Date(batch.registration_end_at)
    : null;

  let regStatus: RegStatus = "unknown";
  if (regStart && regEnd) {
    if (isWithinInterval(now, { start: regStart, end: regEnd })) {
      regStatus = "open";
    } else if (isBefore(now, regStart)) {
      regStatus = "not_yet";
    } else if (isAfter(now, regEnd)) {
      regStatus = "closed";
    }
  }

  const daysLeft =
    regStatus === "open" && regEnd
      ? Math.max(differenceInCalendarDays(regEnd, now), 0)
      : null;

  const regPeriodText =
    regStart && regEnd
      ? `${format(regStart, "dd MMM yyyy", { locale: idLocale })} sampai ${format(
          regEnd,
          "dd MMM yyyy",
          { locale: idLocale },
        )}`
      : "Belum tersedia";

  const scheduleDays = batch.days.map((day) => dayLabel(day.day)).join(" dan ");
  const scheduleTime = `${batch.start_time.slice(0, 5).replace(":", ".")} sampai ${batch.end_time
    .slice(0, 5)
    .replace(":", ".")} WIB`;
  const location =
    batch.course_type === "online"
      ? "Online, Zoom atau Google Meet"
      : batch.room;
  const buttonDisabled = regStatus !== "open";
  const buttonLabel =
    regStatus === "open"
      ? "Daftar Sekarang"
      : regStatus === "not_yet"
        ? "Pendaftaran Belum Dibuka"
        : regStatus === "closed"
          ? "Pendaftaran Ditutup"
          : "Pendaftaran Belum Tersedia";

  const registrationProgress =
    regStatus === "open" && regStart && regEnd
      ? Math.min(
          Math.max(
            ((now.getTime() - regStart.getTime()) /
              (regEnd.getTime() - regStart.getTime())) *
              100,
            5,
          ),
          100,
        )
      : regStatus === "closed"
        ? 100
        : 0;

  const quickFacts = [
    {
      icon: CalendarDays,
      label: "Periode kelas",
      value: formatPeriode(batch.start_at, batch.end_at),
    },
    {
      icon: Clock,
      label: "Waktu belajar",
      value: scheduleTime,
    },
    {
      icon: MapPin,
      label: "Format",
      value: location,
    },
  ];

  const detailRows = [
    {
      icon: CalendarDays,
      label: "Pendaftaran",
      value: regPeriodText,
    },
    {
      icon: ListTodo,
      label: "Hari",
      value: scheduleDays || "Belum tersedia",
    },
    {
      icon: Users,
      label: "Kapasitas",
      value: `${batch.quota} peserta`,
    },
  ];

  const learningPoints = [
    "Kelas resmi Tax Center Universitas Gunadarma.",
    "Jadwal dan akses materi dikelola dalam LMS.",
    "Alur belajar, tugas, quiz, dan sertifikat tersusun per pertemuan.",
  ];

  return (
    <section className="w-full overflow-hidden bg-background text-foreground">
      <div className="relative border-b bg-[linear-gradient(135deg,oklch(0.985_0.006_78),oklch(0.955_0.01_86))] dark:bg-[linear-gradient(135deg,oklch(0.16_0.012_285),oklch(0.21_0.014_285))]">
        <div className="absolute inset-x-0 top-0 h-px bg-primary/40" />
        <div className="mx-auto flex max-w-screen-xl flex-col gap-10 px-6 pb-16 pt-16 md:pb-20 md:pt-24">
          <motion.div
            className="flex min-w-0 flex-col gap-7"
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className={cn(
                  "rounded-full border px-3 py-1",
                  statusCopy[regStatus].tone,
                )}
              >
                <Sparkles />
                {statusCopy[regStatus].label}
              </Badge>
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {batch.course_type === "online" ? "Online" : "Offline"}
              </Badge>
            </div>

            <div className="flex flex-col gap-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Tax Center Gunadarma
              </p>
              <h1 className="max-w-6xl text-[2.75rem] font-extrabold leading-[0.98] tracking-normal text-foreground md:text-[4.5rem] lg:text-[6rem]">
                {batch.title}
              </h1>
            </div>
          </motion.div>

          <motion.div
            className="relative min-h-[360px] overflow-hidden rounded-xl border bg-muted shadow-2xl shadow-primary/10 md:min-h-[520px] lg:min-h-[620px]"
            initial={{ opacity: 0, y: 38, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.82, delay: 0.1, ease: easeOutExpo }}
          >
            <ImageWithFallback
              src={batch.batch_thumbnail}
              alt={batch.title}
              fill
              priority
              className="object-cover transition duration-700 hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-foreground/70 via-foreground/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-5 p-5 text-background md:p-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">
                  Gelombang aktif
                </p>
                <p className="mt-2 text-2xl font-extrabold leading-tight md:text-4xl">
                  {formatPeriode(batch.start_at, batch.end_at)}
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-3 lg:w-[680px]">
                {quickFacts.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      className="group flex min-h-28 flex-col justify-between rounded-xl border border-background/18 bg-background/92 p-4 text-foreground shadow-lg transition duration-300 hover:-translate-y-1 hover:border-primary/40"
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.55,
                        delay: 0.18 + index * 0.08,
                        ease: easeOutExpo,
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-medium text-muted-foreground">
                          {item.label}
                        </span>
                        <Icon className="size-4 text-primary transition-transform duration-300 group-hover:rotate-6" />
                      </div>
                      <p className="text-sm font-semibold leading-6">
                        {item.value}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto grid max-w-screen-xl gap-10 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_380px] lg:py-24">
        <main className="flex min-w-0 flex-col gap-14">
          <motion.section
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
          >
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Ringkasan Program
              </p>
              <h2 className="max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl">
                Detail yang perlu kamu tahu sebelum daftar.
              </h2>
            </div>

            <div
              className="prose max-w-none dark:prose-invert prose-p:leading-8 prose-headings:font-bold prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: batch.description }}
            />
          </motion.section>

          <motion.section
            className="grid gap-4 md:grid-cols-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
          >
            {detailRows.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  className="group rounded-xl border bg-card p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.22, ease: easeOutExpo }}
                >
                  <div className="mb-8 flex items-center justify-between">
                    <Icon className="size-5 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-2 text-lg font-bold leading-7">
                    {item.value}
                  </p>
                </motion.div>
              );
            })}
          </motion.section>

          <motion.section
            className="relative overflow-hidden rounded-xl border bg-[#2a176f] p-6 text-white md:p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
          >
            <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end">
              <div className="flex flex-col gap-4">
                <Badge className="w-fit rounded-full bg-white/12 px-3 py-1 text-white">
                  <ShieldCheck />
                  Jalur resmi
                </Badge>
                <h2 className="text-3xl font-extrabold leading-tight md:text-4xl">
                  Belajar pajak dengan alur kelas yang rapi.
                </h2>
              </div>
              <div className="grid gap-3">
                {learningPoints.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 rounded-lg border border-white/15 bg-white/8 p-3"
                  >
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                    <p className="text-sm leading-6 text-white/86">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        </main>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <motion.div
            className="overflow-hidden rounded-xl border bg-card shadow-xl shadow-primary/8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
          >
            <div className="flex flex-col gap-5 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Tiket Kelas
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold">
                    Amankan kursi
                  </h2>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full px-3 py-1",
                    statusCopy[regStatus].tone,
                  )}
                >
                  {batch.course_type === "online" ? "Online" : "Offline"}
                </Badge>
              </div>

              <Separator />

              <div className="flex flex-col gap-4">
                <InfoRow
                  icon={CalendarDays}
                  label="Pendaftaran"
                  value={regPeriodText}
                />
                <InfoRow icon={Clock} label="Jam" value={scheduleTime} />
                <InfoRow icon={MapPin} label="Lokasi" value={location} />
                <InfoRow
                  icon={Users}
                  label="Kapasitas"
                  value={`${batch.quota} peserta`}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
                  <span>Progress periode daftar</span>
                  <span>{Math.round(registrationProgress)}%</span>
                </div>
                <Progress value={registrationProgress} />
                {typeof daysLeft === "number" && (
                  <p className="text-xs text-muted-foreground">
                    Sisa {daysLeft} hari sebelum periode pendaftaran selesai.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {batch.batch_groups.map((group) => (
                  <Badge
                    key={group.id}
                    variant="secondary"
                    className="rounded-full"
                  >
                    <UserCheck />
                    {groupLabel(group.group_type)}
                  </Badge>
                ))}
              </div>

              <Button
                className="h-12 w-full rounded-full"
                asChild={!buttonDisabled}
                disabled={buttonDisabled}
              >
                {buttonDisabled ? (
                  <span>{buttonLabel}</span>
                ) : (
                  <Link href={`/pembayaran/${batch.slug}`}>
                    {buttonLabel}
                    <ArrowRight data-icon="inline-end" />
                  </Link>
                )}
              </Button>
            </div>

            <div className="border-t bg-muted/40 p-5">
              <Alert className="border-primary/20 bg-background">
                <Info />
                <AlertTitle>Status jadwal</AlertTitle>
                <AlertDescription>
                  {regStatus === "open"
                    ? "Pendaftaran aktif. Jadwal mulai tetap dapat menyesuaikan jumlah peserta."
                    : regStatus === "not_yet"
                      ? `Pendaftaran dibuka ${regStart ? format(regStart, "dd MMM yyyy", { locale: idLocale }) : "sesuai jadwal resmi"}.`
                      : regStatus === "closed"
                        ? "Pendaftaran untuk gelombang ini sudah ditutup."
                        : "Pendaftaran belum tersedia untuk gelombang ini."}
                </AlertDescription>
              </Alert>
            </div>
          </motion.div>
        </aside>
      </div>
    </section>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm font-semibold leading-6 text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}
