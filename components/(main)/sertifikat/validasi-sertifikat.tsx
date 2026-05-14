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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
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
} from "lucide-react";
import { toast } from "sonner";
import { useGetData } from "@/hooks/use-get-data";
import { CertificateAPI } from "./_types/certificate-type";

const schema = z.object({
  certificateNo: z
    .string()
    .trim()
    .min(6, "Minimal 6 karakter")
    .max(64, "Maksimal 64 karakter"),
});
type FormValues = z.infer<typeof schema>;

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
function StatusPill({
  status,
}: {
  status: NonNullable<CertificateAPI["status"]>;
}) {
  if (status === "valid")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
        <CheckCircle2 className="h-4 w-4" /> Sertifikat Valid
      </span>
    );
  if (status === "expired")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
        <AlertCircle className="h-4 w-4" /> Sudah Expired
      </span>
    );
  if (status === "revoked")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
        <AlertCircle className="h-4 w-4" /> Dicabut
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">
      <AlertCircle className="h-4 w-4" /> Tidak Ditemukan
    </span>
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
    <section className="w-full py-24 md:py-32 dark:bg-background transition-colors">
      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div className="space-y-6">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f97316]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
              Verifikasi Keaslian
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight !leading-[1.1]">
              Validasi{" "}
              <span className="text-muted-foreground">Sertifikat</span>
            </h1>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Masukkan <span className="font-medium">nomor sertifikat</span> untuk
            memeriksa keaslian dan statusnya.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="certificateNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Sertifikat</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          placeholder="cth: BREV-UG-2025-ABC123"
                          {...field}
                        />
                        <Button
                          type="submit"
                          variant="orange"
                          disabled={isSubmitting}
                          className="rounded-full"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Memeriksa
                            </>
                          ) : (
                            <>
                              <Search className="mr-2 h-4 w-4" />
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

          {errorMsg && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              {errorMsg}
            </div>
          )}
        </div>

        <div className="md:sticky md:top-20 h-fit p-6 border rounded-2xl bg-card shadow-sm">
          {!hasResult && !showSkeleton && (
            <div className="text-muted-foreground text-sm">
              Hasil validasi akan muncul di sini.
            </div>
          )}

          {showSkeleton && (
            <div className="space-y-3">
              <Skeleton className="h-6 w-1/3 rounded" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </div>
          )}

          {hasResult && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      colSpan={2}
                      className="text-2xl font-semibold text-primary"
                    >
                      Hasil Validasi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="flex items-center gap-2 font-medium text-muted-foreground">
                      <IdCard className="h-4 w-4 text-orange-500" />
                      Nomor / ID Sertifikat
                    </TableCell>
                    <TableCell className="break-all">{number}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="flex items-center gap-2 font-medium text-muted-foreground">
                      <User className="h-4 w-4 text-orange-500" />
                      Peserta
                    </TableCell>
                    <TableCell>{participantName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="flex items-center gap-2 font-medium text-muted-foreground">
                      <BookOpen className="h-4 w-4 text-orange-500" />
                      Kursus
                    </TableCell>
                    <TableCell>{courseTitle}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="flex items-center gap-2 font-medium text-muted-foreground">
                      <CalendarDays className="h-4 w-4 text-orange-500" />
                      Terbit
                    </TableCell>
                    <TableCell>{issuedAt}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="mt-4 flex flex-wrap gap-2">
                <StatusPill status={status} />

                {verifierUrl && (
                  <Button
                    asChild
                    variant="secondary"
                    onClick={() =>
                      notify("Membuka / mengunduh sertifikat dalam tab baru.")
                    }
                    className="rounded-full"
                  >
                    <a href={verifierUrl} target="_blank" rel="noreferrer">
                      <FileDown className="mr-2 h-4 w-4" />
                      Lihat / Unduh Sertifikat
                    </a>
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() =>
                    handleCopy(number, "Nomor sertifikat tersalin.")
                  }
                  className="rounded-full"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Salin Nomor
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleShare(number)}
                  className="rounded-full"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Bagikan
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    const shareUrl =
                      typeof window !== "undefined"
                        ? window.location.href
                        : "";
                    handleCopy(shareUrl, "Tautan halaman tersalin.");
                  }}
                  className="rounded-full"
                >
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Salin Tautan Halaman
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
