"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  ArrowRight,
  Award,
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";

import { TMyCourse } from "./_types/my-course-type";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useGetData } from "@/hooks/use-get-data";
import { usePostData } from "@/hooks/use-post-data";
import { toAssetUrl } from "@/helpers/api-config";

const dayLabels: Record<string, string> = {
  monday: "Senin",
  tuesday: "Selasa",
  wednesday: "Rabu",
  thursday: "Kamis",
  friday: "Jumat",
  saturday: "Sabtu",
  sunday: "Minggu",
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getProp(obj: unknown, key: string): unknown {
  return isPlainObject(obj) ? obj[key] : undefined;
}

function pickString(obj: unknown, key: string): string | null {
  const value = getProp(obj, key);
  return typeof value === "string" ? value : null;
}

function pickNumber(obj: unknown, key: string): number | null {
  const value = getProp(obj, key);
  return typeof value === "number" ? value : null;
}

function extractProgress(resp: unknown): number {
  const direct = pickNumber(resp, "progress_percent");
  if (direct !== null) return direct;

  let cur: unknown = getProp(resp, "data");
  for (let i = 0; i < 3; i++) {
    const value = pickNumber(cur, "progress_percent");
    if (value !== null) return value;
    cur = getProp(cur, "data");
    if (cur === undefined) break;
  }
  return 0;
}

function extractUrlDeep(res: unknown): string | null {
  const direct = pickString(res, "url") || pickString(res, "download_url");
  if (direct) return direct;

  let cur: unknown = getProp(res, "data");
  for (let i = 0; i < 3; i++) {
    const found = pickString(cur, "url") || pickString(cur, "download_url");
    if (found) return found;
    cur = getProp(cur, "data");
    if (cur === undefined) break;
  }
  return null;
}

function extractAssetUrlDeep(res: unknown): string | null {
  const url = extractUrlDeep(res);
  return url ? toAssetUrl(url) : null;
}

type Props = { course: TMyCourse };

export function ProgramSayaCard({ course }: Props) {
  const { data, isLoading } = useGetData({
    queryKey: ["progress-kelas-saya", course.id],
    dataProtected: `me/batches/${course.id}/progress`,
    options: { refetchOnWindowFocus: false },
  });

  const progress = !isLoading ? Math.round(extractProgress(data) ?? 0) : 0;
  const isComplete = progress >= 100;

  const {
    data: certData,
    isRefetching: isFetchingCert,
    refetch: refetchCert,
  } = useGetData({
    queryKey: [`my-certificate-${course.id}`],
    dataProtected: `me/batches/${course.id}/certificate`,
    options: {
      refetchOnWindowFocus: false,
      enabled: isComplete,
    },
  });

  const existingCertUrl = extractAssetUrlDeep(certData);

  const generateCert = usePostData({
    queryKey: `my-certificate-${course.id}`,
    dataProtected: `me/batches/${course.id}/certificate`,
    successMessage: "Sertifikat berhasil dibuat.",
  });

  const [isChecking, setIsChecking] = React.useState(false);
  const isGenerating =
    (generateCert as { status?: "idle" | "pending" | "success" | "error" })
      .status === "pending";
  const isBusy = isChecking || isFetchingCert || isGenerating;

  const openUrl = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCertificateClick = async () => {
    setIsChecking(true);
    try {
      const result = await refetchCert?.();
      const freshUrl = extractAssetUrlDeep(result?.data ?? certData);
      if (freshUrl) {
        openUrl(freshUrl);
        return;
      }
    } finally {
      setIsChecking(false);
    }

    generateCert.mutate({} as Record<string, unknown>, {
      onSuccess: (res: unknown) => {
        const url = extractAssetUrlDeep(res);
        if (url) openUrl(url);
      },
    });
  };

  const certificateLabel = existingCertUrl
    ? "Lihat Sertifikat"
    : "Cetak Sertifikat";
  const certificateBusyLabel = isGenerating ? "Memproses..." : "Memeriksa...";
  const formattedStart = format(new Date(course.start_at), "dd MMM yyyy", {
    locale: id,
  });
  const formattedEnd = format(new Date(course.end_at), "dd MMM yyyy", {
    locale: id,
  });

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      <div className="relative h-44 w-full bg-muted">
        <ImageWithFallback
          src={course.batch_thumbnail}
          alt={course.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-foreground/70 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge className="rounded-full bg-background text-foreground shadow-sm">
            {course.course_type?.toUpperCase() ?? "KELAS"}
          </Badge>
          {isComplete && (
            <Badge className="rounded-full bg-primary text-primary-foreground shadow-sm">
              <CheckCircle2 className="size-3.5" />
              Selesai
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-col gap-2">
          <h3 className="line-clamp-2 min-h-11 text-base font-bold leading-snug text-foreground">
            {course.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className="size-4 shrink-0 text-primary" />
            <span>
              {formattedStart} - {formattedEnd}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="size-4 shrink-0 text-primary" />
            <span>
              {course.days
                .map((day) => dayLabels[day.day] || day.day)
                .join(", ")}
            </span>
          </div>
        </div>

        <div className="rounded-lg border bg-background p-3">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="font-medium text-muted-foreground">
              Progress kelas
            </span>
            <span className="font-bold text-foreground">
              {isLoading ? "..." : `${progress}%`}
            </span>
          </div>
          <Progress value={progress} className="mt-2 h-2" />
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {isComplete
              ? "Kelas selesai. Kamu tetap bisa membuka materi dan aktivitas kelas."
              : "Selesaikan pertemuan, tugas, dan quiz untuk membuka sertifikat."}
          </p>
        </div>

        <div className="mt-auto grid gap-2">
          <Button className="w-full gap-2" asChild>
            <Link href={`/dashboard/program-saya/${course.slug}`}>
              Masuk Kelas
              <ArrowRight className="size-4 shrink-0" />
            </Link>
          </Button>

          {isComplete ? (
            <Button
              className="w-full gap-2"
              variant="outline"
              disabled={isBusy}
              onClick={handleCertificateClick}
              title={
                existingCertUrl
                  ? "Buka sertifikat kamu"
                  : "Buat sertifikat dan buka"
              }
            >
              {isBusy ? (
                <Loader2 className="size-4 shrink-0 animate-spin" />
              ) : (
                <Award className="size-4 shrink-0" />
              )}
              {isBusy ? certificateBusyLabel : certificateLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
