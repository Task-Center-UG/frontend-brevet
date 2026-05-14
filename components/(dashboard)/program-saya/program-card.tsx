"use client";

import { TMyCourse } from "./_types/my-course-type";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useGetData } from "@/hooks/use-get-data";
import { usePostData } from "@/hooks/use-post-data";
import { toAssetUrl } from "@/helpers/api-config";
import * as React from "react";

const dayLabels: Record<string, string> = {
  monday: "Senin",
  tuesday: "Selasa",
  wednesday: "Rabu",
  thursday: "Kamis",
  friday: "Jumat",
  saturday: "Sabtu",
  sunday: "Minggu",
};

function isPlainObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}
function getProp(obj: unknown, key: string): unknown {
  return isPlainObject(obj) ? obj[key] : undefined;
}
function pickString(obj: unknown, key: string): string | null {
  const v = getProp(obj, key);
  return typeof v === "string" ? v : null;
}
function pickNumber(obj: unknown, key: string): number | null {
  const v = getProp(obj, key);
  return typeof v === "number" ? v : null;
}
function extractProgress(resp: unknown): number {
  const direct = pickNumber(resp, "progress_percent");
  if (direct !== null) return direct;

  let cur: unknown = getProp(resp, "data");
  for (let i = 0; i < 3; i++) {
    const val = pickNumber(cur, "progress_percent");
    if (val !== null) return val;
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

  const {
    data: certData,
    isRefetching: isFetchingCert,
    refetch: refetchCert,
  } = useGetData({
    queryKey: [`my-certificate-${course.id}`],
    dataProtected: `me/batches/${course.id}/certificate`,
    options: {
      refetchOnWindowFocus: false,
      enabled: progress >= 100,
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

  const openUrl = (url: string) =>
    window.open(url, "_blank", "noopener,noreferrer");

  const handlePrimaryClick = async () => {
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

  const primaryLabel = existingCertUrl
    ? "Lihat Sertifikat"
    : "Cetak Sertifikat";
  const isBusy = isChecking || isFetchingCert || isGenerating;

  return (
    <div className="group transition-all duration-300 border border-muted rounded-xl shadow-md hover:shadow-lg bg-background overflow-hidden">
      <div className="relative w-full h-40 bg-muted/50">
        <ImageWithFallback
          src={course.batch_thumbnail}
          alt={course.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-sm font-semibold leading-snug line-clamp-2 text-foreground">
          {course.title}
        </h3>

        <p className="text-xs text-muted-foreground">
          {format(new Date(course.start_at), "dd MMM yyyy", { locale: id })} –{" "}
          {format(new Date(course.end_at), "dd MMM yyyy", { locale: id })}
        </p>

        <div className="flex items-center justify-between flex-wrap gap-y-1">
          <div className="flex flex-wrap gap-1">
            {course.days.map((d) => (
              <Badge key={d.id} variant="outline">
                {dayLabels[d.day] || d.day}
              </Badge>
            ))}
          </div>
          <Badge variant="secondary" className="whitespace-nowrap">
            {course.course_type?.toUpperCase() ?? "KELAS"}
          </Badge>
        </div>

        <div className="mt-2 space-y-1">
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Progress</span>
            <span>{isLoading ? "..." : `${progress}%`}</span>
          </div>
          <Progress
            value={progress}
            className="h-2 rounded-md [&>div]:bg-orange-500"
          />
        </div>

        {/* CTA */}
        <div className="mt-3 grid gap-2">
          {progress >= 100 ? (
            <>
              <Button
                className="w-full text-xs"
                variant="orange"
                disabled={isBusy}
                onClick={handlePrimaryClick}
                title={
                  existingCertUrl
                    ? "Buka sertifikat kamu"
                    : "Buat sertifikat dan buka"
                }
              >
                {isGenerating
                  ? "Memproses..."
                  : isChecking || isFetchingCert
                    ? "Memeriksa..."
                    : primaryLabel}
              </Button>

              <Link href={`/dashboard/program-saya/${course.slug}`}>
                <Button className="w-full text-xs" variant="outline">
                  Lihat Detail
                </Button>
              </Link>
            </>
          ) : (
            <Link href={`/dashboard/program-saya/${course.slug}`}>
              <Button className="w-full text-xs" variant="orange">
                Lihat Detail
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
