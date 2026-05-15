"use client";

import type { ElementType, ReactNode } from "react";
import Link from "next/link";
import {
  format,
  differenceInCalendarDays,
  isAfter,
  isBefore,
  isWithinInterval,
} from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeInfo,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  Globe,
  Info,
  ListTodo,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { DAY_OPTIONS } from "@/components/(dashboard)/kursus/gelombang/_constants/day-options";
import { TCourseBatch } from "@/components/(dashboard)/kursus/gelombang/_types/course-batch-type";
import NotFoundContent from "../not-found-content";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetData } from "@/hooks/use-get-data";
import { usePostData } from "@/hooks/use-post-data";
import { cn } from "@/lib/utils";

type Props = {
  batchSlug: string;
};

type RegStatus = "open" | "not_yet" | "closed" | "unknown";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const groupLabel = (
  groupType: "mahasiswa_gunadarma" | "mahasiswa_non_gunadarma" | "umum",
) => {
  if (groupType === "mahasiswa_gunadarma") return "Mahasiswa Gunadarma";
  if (groupType === "mahasiswa_non_gunadarma") return "Mahasiswa Non-Gunadarma";
  return "Umum";
};

const dayLabel = (day: string) =>
  DAY_OPTIONS.find((option) => option.value === day)?.label || day;

const statusCopy: Record<
  RegStatus,
  { label: string; action: string; tone: string; message: string }
> = {
  open: {
    label: "Pendaftaran dibuka",
    action: "Bayar & Daftar",
    tone: "border-primary/20 bg-primary/10 text-primary",
    message:
      "Pendaftaran aktif. Lanjutkan pembayaran untuk mengunci kursi di gelombang ini.",
  },
  not_yet: {
    label: "Belum dibuka",
    action: "Pendaftaran Belum Dibuka",
    tone: "border-amber-500/20 bg-amber-500/10 text-amber-700",
    message:
      "Periode daftar belum mulai. Kamu tetap bisa cek detail jadwal dulu.",
  },
  closed: {
    label: "Pendaftaran ditutup",
    action: "Pendaftaran Ditutup",
    tone: "border-muted bg-muted text-muted-foreground",
    message: "Gelombang ini sudah lewat masa pendaftaran.",
  },
  unknown: {
    label: "Jadwal belum tersedia",
    action: "Pendaftaran Belum Tersedia",
    tone: "border-muted bg-muted text-muted-foreground",
    message: "Tanggal pendaftaran belum tersedia dari sistem.",
  },
};

export default function Purchase({ batchSlug }: Props) {
  const { data, isLoading, isError } = useGetData({
    queryKey: ["batch", batchSlug],
    dataProtected: `batches/${batchSlug}`,
  });

  const batch: TCourseBatch | undefined = data?.data?.data;

  const { mutate: purchaseCourse, isPending } = usePostData({
    queryKey: "purchases",
    dataProtected: "me/purchases",
    successMessage: "Berhasil mendaftar!",
    backUrl: "/dashboard/pembayaran",
  });

  if (isLoading) {
    return (
      <section className="w-full bg-background pt-16 md:pt-24">
        <div className="mx-auto grid max-w-screen-xl gap-10 px-5 pb-24 sm:px-6 lg:px-8 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="flex flex-col gap-6">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-24 w-full max-w-4xl" />
            <Skeleton className="h-[520px] w-full rounded-xl" />
            <div className="grid gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-32 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <Skeleton className="h-6 w-40" />
            <div className="mt-6 flex flex-col gap-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
            <Skeleton className="mt-6 h-12 w-full rounded-full" />
          </div>
        </div>
      </section>
    );
  }

  if (isError || !batch) {
    return (
      <div className="mx-auto max-w-screen-md px-6 py-24">
        <NotFoundContent message="Gelombang tidak ditemukan." />
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
      ? `${format(regStart, "dd MMM yyyy", { locale: idLocale })} - ${format(
          regEnd,
          "dd MMM yyyy",
          { locale: idLocale },
        )}`
      : "-";

  const coursePeriodText = `${format(new Date(batch.start_at), "dd MMM yyyy", {
    locale: idLocale,
  })} - ${format(new Date(batch.end_at), "dd MMM yyyy", { locale: idLocale })}`;

  const dayLabels = batch.days.map((day) => dayLabel(day.day)).join(" & ");
  const timeRange = `${batch.start_time.slice(0, 5).replace(":", ".")} - ${batch.end_time
    .slice(0, 5)
    .replace(":", ".")} WIB`;
  const location =
    batch.course_type === "online"
      ? "Online, Zoom atau Google Meet"
      : batch.room;
  const groupBadges =
    batch.batch_groups?.map((group) => groupLabel(group.group_type)) || [];
  const buttonDisabled = regStatus !== "open" || isPending;
  const buttonLabel = isPending ? "Memproses..." : statusCopy[regStatus].action;

  const registrationProgress =
    regStatus === "open" && regStart && regEnd
      ? Math.min(
          Math.max(
            ((now.getTime() - regStart.getTime()) /
              (regEnd.getTime() - regStart.getTime())) *
              100,
            6,
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
      value: coursePeriodText,
    },
    {
      icon: Clock,
      label: "Jam belajar",
      value: timeRange,
    },
    {
      icon: batch.course_type === "online" ? Globe : MapPin,
      label: batch.course_type === "online" ? "Platform" : "Lokasi",
      value: location,
    },
  ];

  const processSteps = [
    "Masuk ke akun LMS Tax Center Gunadarma.",
    "Klik Bayar & Daftar untuk membuat tagihan.",
    "Upload bukti transfer dari dashboard pembayaran.",
    "Admin memverifikasi, akses kelas aktif setelah valid.",
  ];

  const handlePurchase = () => {
    if (!batch.id) return toast.error("Batch tidak ditemukan.");
    if (regStatus !== "open") {
      return toast.warning("Pendaftaran belum tersedia untuk gelombang ini.");
    }
    purchaseCourse({ batch_id: batch.id });
  };

  return (
    <section className="w-full overflow-hidden bg-background text-foreground">
      <div className="relative border-b bg-[linear-gradient(135deg,oklch(0.985_0.006_78),oklch(0.955_0.01_86))] dark:bg-[linear-gradient(135deg,oklch(0.16_0.012_285),oklch(0.21_0.014_285))]">
        <div className="absolute inset-x-0 top-0 h-px bg-primary/40" />
        <div className="mx-auto flex max-w-screen-xl flex-col gap-8 px-5 pb-14 pt-12 sm:px-6 md:gap-10 md:pb-16 md:pt-20 lg:px-8 xl:pb-20 xl:pt-24">
          <motion.div
            className="flex flex-col gap-7"
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
              {groupBadges.slice(0, 3).map((badge) => (
                <Badge
                  key={badge}
                  variant="secondary"
                  className="rounded-full px-3 py-1"
                >
                  {badge}
                </Badge>
              ))}
            </div>

            <div className="flex flex-col gap-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Pembayaran Program
              </p>
              <h1 className="max-w-5xl text-[2.45rem] font-extrabold leading-[1.02] tracking-normal text-foreground sm:text-5xl md:text-[4rem] lg:text-[4.65rem]">
                {batch.title}
              </h1>
              <p className="max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
                Cek ulang jadwal, format kelas, dan periode pendaftaran sebelum
                membuat tagihan.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="grid gap-4 lg:grid-cols-[minmax(0,1.12fr)_minmax(280px,0.58fr)] lg:items-stretch"
            initial={{ opacity: 0, y: 38, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.82, delay: 0.08, ease: easeOutExpo }}
          >
            <div className="relative min-h-[300px] overflow-hidden rounded-xl border bg-muted shadow-2xl shadow-primary/10 sm:min-h-[360px] md:min-h-[460px] lg:min-h-[540px]">
              <ImageWithFallback
                src={batch.batch_thumbnail || "/placeholder.svg"}
                alt={batch.title}
                fill
                priority
                className="object-cover transition duration-700 hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-foreground/72 via-foreground/12 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-background md:p-8">
                <div className="max-w-xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">
                    Review sebelum bayar
                  </p>
                  <p className="mt-2 text-2xl font-extrabold leading-tight md:text-4xl">
                    {regPeriodText}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="flex flex-col justify-end rounded-xl border bg-card p-4 text-card-foreground lg:min-h-[170px]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">
                  Detail utama
                </p>
                <p className="mt-3 text-lg font-extrabold leading-tight text-foreground">
                  Jadwal, waktu, dan lokasi sudah disiapkan sebelum tagihan
                  dibuat.
                </p>
              </div>
              {quickFacts.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    className="group flex min-h-28 flex-col justify-between rounded-xl border bg-card p-4 text-card-foreground transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.55,
                      delay: 0.16 + index * 0.08,
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
          </motion.div>
        </div>
      </div>

      <div className="mx-auto grid max-w-screen-xl gap-10 px-5 py-14 sm:px-6 lg:px-8 lg:py-20 xl:grid-cols-[minmax(0,1fr)_380px] xl:py-24">
        <main className="flex min-w-0 flex-col gap-10">
          <motion.section
            className="grid gap-4 md:grid-cols-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
          >
            <StatCard
              icon={CalendarDays}
              label="Pelaksanaan"
              value={coursePeriodText}
              index={1}
            />
            <StatCard
              icon={ListTodo}
              label="Hari kelas"
              value={dayLabels || "-"}
              index={2}
            />
            <StatCard
              icon={Users}
              label="Kuota"
              value={`${batch.quota} peserta`}
              index={3}
            />
          </motion.section>

          <motion.section
            className="rounded-xl border bg-card p-6 shadow-sm md:p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
          >
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Rincian Pendaftaran
                </p>
                <h2 className="text-3xl font-extrabold leading-tight md:text-4xl">
                  Pastikan data gelombang sudah cocok.
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoRow
                  icon={CalendarDays}
                  label="Periode daftar"
                  value={regPeriodText}
                />
                <InfoRow
                  icon={BadgeInfo}
                  label="Status"
                  value={statusCopy[regStatus].label}
                />
                <InfoRow icon={Clock} label="Jam kelas" value={timeRange} />
                <InfoRow
                  icon={batch.course_type === "online" ? Globe : MapPin}
                  label={batch.course_type === "online" ? "Platform" : "Lokasi"}
                  value={location}
                />
              </div>
            </div>
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
                  Alur Resmi LMS
                </Badge>
                <h2 className="text-3xl font-extrabold leading-tight md:text-4xl">
                  Bayar sekali, verifikasi rapi, akses kelas terbuka.
                </h2>
              </div>
              <div className="grid gap-3">
                {processSteps.map((step, index) => (
                  <motion.div
                    key={step}
                    className="flex items-start gap-3 rounded-lg border border-white/15 bg-white/8 p-3"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.22, ease: easeOutExpo }}
                  >
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-extrabold text-[#2a176f]">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-6 text-white/86">{step}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          <Alert className="border-primary/20 bg-primary/5">
            <Info />
            <AlertTitle>Catatan jadwal</AlertTitle>
            <AlertDescription>
              Tanggal mulai bersifat tentatif dan dapat menyesuaikan jumlah
              peserta terdaftar. Daftar lebih awal untuk mengamankan kursi.
            </AlertDescription>
          </Alert>
        </main>

        <aside className="xl:sticky xl:top-24 xl:h-fit">
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
                    Checkout
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold">
                    Konfirmasi daftar
                  </h2>
                </div>
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CreditCard className="size-5" />
                </div>
              </div>

              <Alert className={cn("border", statusCopy[regStatus].tone)}>
                <CheckCircle2 />
                <AlertTitle>{statusCopy[regStatus].label}</AlertTitle>
                <AlertDescription>
                  {statusCopy[regStatus].message}
                </AlertDescription>
              </Alert>

              <Separator />

              <div className="flex flex-col gap-4">
                <InfoRow
                  icon={Users}
                  label="Kuota maksimal"
                  value={`${batch.quota} peserta`}
                />
                <InfoRow
                  icon={UserCheck}
                  label="Jenis peserta"
                  value={groupBadges.length ? groupBadges.join(", ") : "-"}
                />
                <InfoRow
                  icon={CalendarDays}
                  label="Periode kelas"
                  value={coursePeriodText}
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
                    Sisa {daysLeft} hari sebelum pendaftaran selesai.
                  </p>
                )}
              </div>

              <Button
                onClick={handlePurchase}
                disabled={buttonDisabled}
                size="lg"
                className="h-12 w-full rounded-full"
              >
                {buttonLabel}
                {!buttonDisabled && <ArrowRight data-icon="inline-end" />}
              </Button>

              <Button
                variant="outline"
                asChild
                size="sm"
                className="w-full rounded-full"
              >
                <Link href={`/kursus/${batch.slug}`}>
                  Cek halaman gelombang
                </Link>
              </Button>
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
  icon: ElementType;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-background p-4">
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

function StatCard({
  icon: Icon,
  label,
  value,
  index,
}: {
  icon: ElementType;
  label: string;
  value: ReactNode;
  index: number;
}) {
  return (
    <motion.div
      className="group rounded-xl border bg-card p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22, ease: easeOutExpo }}
    >
      <div className="mb-8 flex items-center justify-between">
        <Icon className="size-5 text-primary" />
        <span className="text-xs font-medium text-muted-foreground">
          0{index}
        </span>
      </div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-lg font-bold leading-7">{value}</p>
    </motion.div>
  );
}
