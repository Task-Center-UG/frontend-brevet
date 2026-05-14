"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Search,
  IdCard,
  User,
  BookOpen,
  CalendarDays,
  Link as LinkIcon,
  Share2,
  FileDown,
  Copy,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useGetData } from "@/hooks/use-get-data";
import { CertificateAPI } from "./_types/certificate-type";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const schema = z.object({
  certificateNo: z
    .string()
    .trim()
    .min(6, "Minimal 6 karakter")
    .max(64, "Maksimal 64 karakter"),
});
type FormValues = z.infer<typeof schema>;

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

export default function ValidasiSertifikat() {
  const [queryNo, setQueryNo] = React.useState<string>("");
  const [lastSubmittedNo, setLastSubmittedNo] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { certificateNo: "" },
  });

  const { data, isLoading, isError, isSuccess, isRefetching } = useGetData({
    queryKey: ["certificate-verify", queryNo],
    dataProtected: queryNo ? `certificates/number/${queryNo}` : "",
    options: {
      enabled: Boolean(queryNo),
      retry: 0,
    },
  });

  const apiData = data?.data?.data as unknown;
  const cert: CertificateAPI | null =
    apiData && typeof apiData === "object" ? (apiData as CertificateAPI) : null;

  const number = cert?.number || cert?.id || lastSubmittedNo || "-";
  const participantName = cert?.user?.name || "-";
  const courseTitle = cert?.batch?.title || "-";
  const issuedAt = formatDate(cert?.created_at);
  const verifierUrl = cert?.url;

  const status: NonNullable<CertificateAPI["status"]> =
    cert?.status ?? (cert?.url ? "valid" : isError ? "not-found" : "not-found");

  React.useEffect(() => {
    if (isSuccess && queryNo) {
      toast("Berhasil!", { description: "Pemeriksaan berhasil." });
    }
  }, [isSuccess, queryNo]);

  React.useEffect(() => {
    if (isError && queryNo) {
      setErrorMsg("Sertifikat tidak ditemukan atau terjadi kesalahan.");
      toast("Gagal!", {
        description: "Sertifikat tidak ditemukan atau terjadi kesalahan.",
      });
    } else {
      setErrorMsg(null);
    }
  }, [isError, queryNo]);

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

  async function handleShare(num?: string) {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const title = "Validasi Sertifikat Brevet";
    const text = `Cek sertifikat: ${num ?? "-"}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        notify("Tautan berhasil dibagikan.");
      } catch {}
    } else {
      handleCopy(shareUrl, "Tautan halaman tersalin.");
    }
  }

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    setErrorMsg(null);
    setLastSubmittedNo(values.certificateNo);
    setQueryNo(values.certificateNo);
    setIsSubmitting(false);
  }

  const showSkeleton = isSubmitting || isLoading || isRefetching;
  const hasResult = Boolean(cert) || (isError && lastSubmittedNo);

  return (
    <section className="w-full overflow-hidden bg-background text-foreground">
      <div className="relative border-b bg-[linear-gradient(135deg,oklch(0.985_0.006_78),oklch(0.955_0.01_86))] dark:bg-[linear-gradient(135deg,oklch(0.16_0.012_285),oklch(0.21_0.014_285))]">
        <div className="mx-auto grid max-w-screen-xl gap-10 px-6 pb-16 pt-16 md:pb-20 md:pt-24 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <motion.div
            className="flex max-w-4xl flex-col gap-6"
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
          >
            <Badge variant="outline" className="w-fit rounded-full border-primary/20 bg-primary/10 px-3 py-1 text-primary">
              <ShieldCheck />
              Verifikasi Keaslian
            </Badge>
            <h1 className="text-[2.75rem] font-extrabold leading-[0.98] tracking-normal md:text-[4.5rem] lg:text-[5.5rem]">
              Validasi Sertifikat
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              Masukkan nomor sertifikat untuk memeriksa status, pemilik, program, dan tautan dokumen resmi Tax Center Gunadarma.
            </p>
          </motion.div>

          <motion.div
            className="rounded-xl border bg-card p-5 shadow-xl shadow-primary/8"
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: easeOutExpo }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="certificateNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Sertifikat</FormLabel>
                      <FormControl>
                        <div className="flex flex-col gap-3 sm:flex-row">
                          <Input
                            placeholder="cth: BREV-UG-2025-ABC123"
                            className="h-12 rounded-full"
                            {...field}
                          />
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-12 rounded-full px-6"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 data-icon="inline-start" className="animate-spin" />
                                Memeriksa
                              </>
                            ) : (
                              <>
                                <Search data-icon="inline-start" />
                                Cek
                              </>
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto grid max-w-screen-xl gap-10 px-6 py-16 lg:grid-cols-[360px_minmax(0,1fr)] lg:py-24">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-xl border bg-card p-5">
            <Sparkles className="size-5 text-primary" />
            <h2 className="mt-4 text-2xl font-extrabold">Cara membaca hasil</h2>
            <Separator className="my-5" />
            <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
              <p>Status valid berarti nomor sertifikat cocok dengan data resmi sistem.</p>
              <p>Jika data tidak ditemukan, periksa kembali nomor sertifikat atau hubungi Tax Center.</p>
            </div>
          </div>
        </aside>

        <motion.div
          className="min-h-[360px] rounded-xl border bg-card p-6 shadow-xl shadow-primary/6 md:p-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
        >
          {!hasResult && !showSkeleton && (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <IdCard className="size-7" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold">Hasil validasi muncul di sini.</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Masukkan nomor sertifikat dari dokumen atau QR verification untuk memulai pemeriksaan.
                </p>
              </div>
            </div>
          )}

          {showSkeleton && (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-7 w-44 rounded-full" />
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          )}

          {errorMsg && !showSkeleton && (
            <Alert className="mb-5 border-destructive/20 bg-destructive/5">
              <AlertCircle />
              <AlertTitle>Validasi gagal</AlertTitle>
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}

          {hasResult && !showSkeleton && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Hasil Validasi
                  </p>
                  <h2 className="mt-2 text-3xl font-extrabold">Data sertifikat</h2>
                </div>
                <StatusBadge status={status} />
              </div>

              <Separator />

              <div className="grid gap-5 md:grid-cols-2">
                <ResultLine icon={IdCard} label="Nomor atau ID Sertifikat" value={number} />
                <ResultLine icon={User} label="Peserta" value={participantName} />
                <ResultLine icon={BookOpen} label="Kursus" value={courseTitle} />
                <ResultLine icon={CalendarDays} label="Terbit" value={issuedAt} />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {verifierUrl && (
                  <Button asChild variant="secondary" className="rounded-full">
                    <a href={verifierUrl} target="_blank" rel="noreferrer">
                      <FileDown data-icon="inline-start" />
                      Lihat Sertifikat
                    </a>
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => handleCopy(number, "Nomor sertifikat tersalin.")}
                  className="rounded-full"
                >
                  <Copy data-icon="inline-start" />
                  Salin Nomor
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleShare(number)}
                  className="rounded-full"
                >
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
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
