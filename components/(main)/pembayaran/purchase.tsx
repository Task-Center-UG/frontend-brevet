"use client";

import { useGetData } from "@/hooks/use-get-data";
import { usePostData } from "@/hooks/use-post-data";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { TCourseBatch } from "@/components/(dashboard)/kursus/gelombang/_types/course-batch-type";
import NotFoundContent from "../not-found-content";
import { DAY_OPTIONS } from "@/components/(dashboard)/kursus/gelombang/_constants/day-options";
import Link from "next/link";
import {
  CalendarDays,
  ListTodo,
  Clock,
  MapPin,
  Users,
  UserCheck,
  Globe,
  BadgeInfo,
} from "lucide-react";
import {
  isWithinInterval,
  isBefore,
  isAfter,
  differenceInCalendarDays,
  format,
} from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Notice } from "@/components/notice";

type Props = {
  batchSlug: string;
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
      <div className="max-w-screen-xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-10 w-2/3 rounded" />
          <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !batch) {
    return (
      <div className="max-w-screen-md mx-auto py-16 px-6">
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

  type RegStatus = "open" | "not_yet" | "closed" | "unknown";
  let regStatus: RegStatus = "unknown";
  if (regStart && regEnd) {
    if (isWithinInterval(now, { start: regStart, end: regEnd }))
      regStatus = "open";
    else if (isBefore(now, regStart)) regStatus = "not_yet";
    else if (isAfter(now, regEnd)) regStatus = "closed";
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
          { locale: idLocale }
        )}`
      : "-";

  const coursePeriodText = `${format(new Date(batch.start_at), "dd MMM yyyy", {
    locale: idLocale,
  })} - ${format(new Date(batch.end_at), "dd MMM yyyy", { locale: idLocale })}`;

  const dayLabels = batch.days
    .map((d) => DAY_OPTIONS.find((opt) => opt.value === d.day)?.label || d.day)
    .join(" & ");

  const timeRange = `${batch.start_time.slice(0, 5).replace(":", ".")} - ${batch.end_time
    .slice(0, 5)
    .replace(":", ".")} WIB`;

  const groupBadges =
    batch.batch_groups?.map((g) =>
      g.group_type === "mahasiswa_gunadarma"
        ? "Mahasiswa Gunadarma"
        : g.group_type === "mahasiswa_non_gunadarma"
          ? "Mahasiswa Non-Gunadarma"
          : "Umum"
    ) || [];

  const buttonDisabled = regStatus !== "open" || isPending;
  const buttonLabel =
    regStatus === "open"
      ? isPending
        ? "Memproses..."
        : "Bayar & Daftar"
      : regStatus === "not_yet"
        ? "Pendaftaran Belum Dibuka"
        : regStatus === "closed"
          ? "Pendaftaran Ditutup"
          : "Pendaftaran";

  const handlePurchase = () => {
    if (!batch?.id) return toast.error("Batch tidak ditemukan.");
    if (regStatus !== "open") {
      return toast.warning("Pendaftaran belum tersedia untuk gelombang ini.");
    }
    purchaseCourse({ batch_id: batch.id });
  };

  return (
    <div className="w-full">
      <div className="w-full bg-background">
        <div className="relative mx-auto max-w-screen-xl rounded-none md:rounded-xl overflow-hidden">
          <div className="relative aspect-[16/9] w-full">
            <ImageWithFallback
              src={batch.batch_thumbnail || "/placeholder.svg"}
              alt={batch.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full text-xs md:text-sm bg-white/90 text-gray-800">
                  {batch.course_type === "online" ? "Online" : "Offline"}
                </span>
                {groupBadges.map((b, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full text-xs md:text-sm bg-orange-100 text-orange-700"
                  >
                    {b}
                  </span>
                ))}
              </div>
              <h1 className="text-white text-2xl md:text-4xl font-bold drop-shadow">
                {batch.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Rincian Gelombang</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <InfoRow
                icon={<CalendarDays className="h-4 w-4" />}
                label="Periode Pelaksanaan"
                value={coursePeriodText}
              />
              <InfoRow
                icon={<ListTodo className="h-4 w-4" />}
                label="Hari"
                value={dayLabels || "-"}
              />
              <InfoRow
                icon={<Clock className="h-4 w-4" />}
                label="Jam"
                value={timeRange}
              />
              <InfoRow
                icon={
                  batch.course_type === "online" ? (
                    <Globe className="h-4 w-4" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )
                }
                label={batch.course_type === "online" ? "Platform" : "Lokasi"}
                value={
                  batch.course_type === "online"
                    ? "Online (Zoom/Google Meet)"
                    : batch.room
                }
              />
              <InfoRow
                icon={<Users className="h-4 w-4" />}
                label="Kapasitas"
                value={`${batch.quota} Peserta`}
              />
              <InfoRow
                icon={<UserCheck className="h-4 w-4" />}
                label="Jenis Peserta"
                value={groupBadges.length ? groupBadges.join(", ") : "-"}
              />
            </div>
          </div>
          <div className="bg-card rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Pendaftaran</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <InfoRow
                icon={<CalendarDays className="h-4 w-4" />}
                label="Periode Pendaftaran"
                value={regPeriodText}
              />
              <InfoRow
                icon={<BadgeInfo className="h-4 w-4" />}
                label="Status"
                value={
                  regStatus === "open"
                    ? "Dibuka"
                    : regStatus === "not_yet"
                      ? "Belum dibuka"
                      : regStatus === "closed"
                        ? "Ditutup"
                        : "-"
                }
                badgeColor={
                  regStatus === "open"
                    ? "bg-green-100 text-green-700"
                    : regStatus === "not_yet"
                      ? "bg-yellow-100 text-yellow-700"
                      : regStatus === "closed"
                        ? "bg-gray-200 text-gray-700"
                        : "bg-muted text-muted-foreground"
                }
              />
              {typeof daysLeft === "number" && (
                <InfoRow
                  icon={<Clock className="h-4 w-4" />}
                  label="Sisa Waktu"
                  value={`${daysLeft} hari`}
                />
              )}
            </div>

            {regStatus === "open" ? (
              <Notice
                tone="success"
                text={
                  typeof daysLeft === "number" && daysLeft > 0
                    ? `Pendaftaran sedang dibuka. Sisa waktu ${daysLeft} hari.`
                    : "Pendaftaran sedang dibuka. Yuk daftar sekarang!"
                }
              />
            ) : regStatus === "not_yet" ? (
              <Notice
                tone="warning"
                text={`Pendaftaran akan dibuka pada ${
                  regStart
                    ? format(regStart, "dd MMM yyyy", { locale: idLocale })
                    : "-"
                }.`}
              />
            ) : regStatus === "closed" ? (
              <Notice
                tone="neutral"
                text="Pendaftaran gelombang ini sudah ditutup."
              />
            ) : null}
          </div>
          <Notice
            tone="warningSoft"
            text={
              <span>
                <strong>Tanggal mulai bersifat tentatif.</strong> Jadwal dapat
                berubah tergantung pada jumlah peserta yang mendaftar pada
                gelombang ini. Silakan daftar lebih awal untuk mengamankan
                tempat Kamu.
              </span>
            }
          />
        </div>
        <aside className="bg-card rounded-2xl border shadow-sm p-6 h-fit sticky top-24">
          <h2 className="text-lg font-semibold text-foreground">
            Konfirmasi Pendaftaran
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tekan <strong>Bayar &amp; Daftar</strong> untuk melanjutkan.
          </p>

          <div className="mt-4 text-sm text-muted-foreground space-y-1">
            <p>
              <strong>Kuota Maksimal:</strong> {batch.quota}
            </p>
            <p>
              <strong>Ketersediaan:</strong> Tidak tersedia real-time
            </p>
          </div>

          <Button
            variant="orange"
            onClick={handlePurchase}
            disabled={buttonDisabled}
            size="lg"
            className="w-full mt-5 rounded-full"
          >
            {buttonLabel}
          </Button>

          {regStatus !== "open" && (
            <Button variant="outline" asChild size="sm" className="w-full mt-3 rounded-full">
              <Link href={`/kursus/${batch.slug}`}>Lihat Detail Gelombang</Link>
            </Button>
          )}
        </aside>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  badgeColor,
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
  badgeColor?: string;
}) {
  const isBadge = typeof badgeColor === "string";
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-orange-600">{icon}</div>
      <div className="flex-1">
        <div className="text-[13px] text-muted-foreground">{label}</div>
        {isBadge ? (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badgeColor}`}
          >
            {value}
          </span>
        ) : (
          <div className="font-medium">{value}</div>
        )}
      </div>
    </div>
  );
}
