"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle2,
  IdCard,
  User,
  BookOpen,
  CalendarDays,
  Link as LinkIcon,
  Share2,
  FileDown,
  Copy,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetData } from "@/hooks/use-get-data";
import { toast } from "sonner";
import { CertificateAPI } from "./_types/certificate-type";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

function isDefaultDate(d?: string | null) {
  if (!d) return true;
  return d.startsWith("0001-01-01");
}

function formatDate(d?: string | null) {
  if (!d || isDefaultDate(d)) return "-";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return d;
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const statusMeta: Record<
  NonNullable<CertificateAPI["status"]>,
  { label: string; className: string }
> = {
  valid: {
    label: "Sertifikat valid",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
  },
  expired: {
    label: "Sudah expired",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-700",
  },
  revoked: {
    label: "Dicabut",
    className: "border-destructive/20 bg-destructive/10 text-destructive",
  },
  "not-found": {
    label: "Tidak ditemukan",
    className: "border-muted bg-muted text-muted-foreground",
  },
};

function StatusBadge({
  status,
}: {
  status: NonNullable<CertificateAPI["status"]>;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-full px-3 py-1", statusMeta[status].className)}
    >
      {status === "valid" ? <CheckCircle2 /> : <AlertCircle />}
      {statusMeta[status].label}
    </Badge>
  );
}

function ResultLine({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <div className="mt-1 break-words text-sm font-semibold leading-6 text-foreground">
          {value}
        </div>
      </div>
    </div>
  );
}

type Props = { sertifikatId?: string };

const ValidasiSertifikatId: React.FC<Props> = ({ sertifikatId }) => {
  const params = useParams();
  const idFromParams = params?.id as string | undefined;
  const id = sertifikatId || idFromParams;

  const { data, isLoading, isError } = useGetData({
    queryKey: ["certificate", id ?? "unknown"],
    dataProtected: `certificates/${id}/verify`,
    options: { enabled: Boolean(id), retry: 1 },
  });

  const cert: CertificateAPI | undefined = data?.data?.data;

  const number = cert?.number || cert?.id || "-";
  const participant = cert?.user?.name || "-";
  const course = cert?.batch?.title || "-";
  const issuedAt = formatDate(cert?.created_at);

  const inferredStatus: NonNullable<CertificateAPI["status"]> =
    cert?.status ?? (cert?.url ? "valid" : "not-found");

  function notify(successMessage: string) {
    toast("Berhasil!", { description: successMessage });
  }

  async function handleCopy(text: string, successMsg: string) {
    try {
      await navigator.clipboard.writeText(text);
      notify(successMsg);
    } catch {
      toast("Gagal!", { description: "Tidak bisa menyalin ke clipboard." });
    }
  }

  async function handleShare() {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const title = "Validasi Sertifikat Brevet";
    const text = `Cek sertifikat: ${number}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        notify("Tautan berhasil dibagikan.");
      } catch {}
    } else {
      handleCopy(shareUrl, "Tautan halaman tersalin.");
    }
  }

  return (
    <section className="w-full overflow-hidden bg-background text-foreground">
      <div className="relative border-b bg-[linear-gradient(135deg,oklch(0.985_0.006_78),oklch(0.955_0.01_86))] dark:bg-[linear-gradient(135deg,oklch(0.16_0.012_285),oklch(0.21_0.014_285))]">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-6 px-6 pb-16 pt-16 md:pb-20 md:pt-24">
          <motion.div
            className="flex max-w-5xl flex-col gap-6"
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
          >
            <Badge variant="outline" className="w-fit rounded-full border-primary/20 bg-primary/10 px-3 py-1 text-primary">
              <ShieldCheck />
              Validasi Sertifikat
            </Badge>
            <h1 className="text-[2.75rem] font-extrabold leading-[0.98] tracking-normal md:text-[4.5rem] lg:text-[5.5rem]">
              Detail Sertifikat
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              Halaman ini membaca status sertifikat langsung dari sistem Tax Center Gunadarma.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-screen-xl px-6 py-16 lg:py-24">
        {!id && (
          <Alert className="mb-6 border-destructive/20 bg-destructive/5">
            <AlertCircle />
            <AlertTitle>ID sertifikat tidak ditemukan</AlertTitle>
            <AlertDescription>Periksa kembali tautan validasi sertifikat.</AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <div className="rounded-xl border bg-card p-6 md:p-8">
            <div className="flex flex-col gap-4">
              <Skeleton className="h-7 w-44 rounded-full" />
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          </div>
        )}

        {isError && (
          <Alert className="border-destructive/20 bg-destructive/5">
            <AlertCircle />
            <AlertTitle>Gagal memuat data sertifikat</AlertTitle>
            <AlertDescription>Data tidak ditemukan atau server tidak dapat memproses validasi.</AlertDescription>
          </Alert>
        )}

        {cert && (
          <motion.div
            className="rounded-xl border bg-card p-6 shadow-xl shadow-primary/6 md:p-8"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Hasil Validasi
                </p>
                <h2 className="mt-2 text-3xl font-extrabold">Data sertifikat</h2>
              </div>
              <StatusBadge status={inferredStatus} />
            </div>

            <Separator className="my-6" />

            <div className="grid gap-5 md:grid-cols-2">
              <ResultLine icon={IdCard} label="Nomor atau ID Sertifikat" value={number} />
              <ResultLine icon={User} label="Peserta" value={participant} />
              <ResultLine icon={BookOpen} label="Kursus" value={course} />
              <ResultLine icon={CalendarDays} label="Terbit" value={issuedAt} />
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {cert.url && (
                <Button
                  asChild
                  variant="secondary"
                  className="rounded-full"
                  onClick={() =>
                    notify("Membuka atau mengunduh sertifikat dalam tab baru.")
                  }
                >
                  <a href={cert.url} target="_blank" rel="noreferrer">
                    <FileDown data-icon="inline-start" />
                    Lihat Sertifikat
                  </a>
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() =>
                  handleCopy(number.toString(), "Nomor sertifikat tersalin.")
                }
                className="rounded-full"
              >
                <Copy data-icon="inline-start" />
                Salin Nomor
              </Button>

              <Button variant="outline" onClick={handleShare} className="rounded-full">
                <Share2 data-icon="inline-start" />
                Bagikan
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  const shareUrl =
                    typeof window !== "undefined" ? window.location.href : "";
                  handleCopy(shareUrl, "Tautan halaman tersalin.");
                }}
                className="rounded-full"
              >
                <LinkIcon data-icon="inline-start" />
                Salin Tautan
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ValidasiSertifikatId;
