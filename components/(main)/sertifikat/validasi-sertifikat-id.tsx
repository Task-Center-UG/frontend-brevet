"use client";

import React from "react";
import { useParams } from "next/navigation";
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
  IdCard,
  User,
  BookOpen,
  CalendarDays,
  Link as LinkIcon,
  Share2,
  FileDown,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetData } from "@/hooks/use-get-data";
import { toast } from "sonner";
import { CertificateAPI } from "./_types/certificate-type";

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
  if (status === "valid") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
        <CheckCircle2 className="h-4 w-4" /> Sertifikat Valid
      </span>
    );
  }
  if (status === "expired") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
        <AlertCircle className="h-4 w-4" /> Sudah Expired
      </span>
    );
  }
  if (status === "revoked") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
        <AlertCircle className="h-4 w-4" /> Dicabut
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">
      <AlertCircle className="h-4 w-4" /> Tidak Ditemukan
    </span>
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
    <section className="w-full py-16 dark:bg-background transition-colors">
      <div className="max-w-screen-md mx-auto px-6">
        <h1 className="text-2xl font-bold mb-6">Detail Sertifikat</h1>

        {!id && (
          <div className="flex items-center gap-2 text-red-600 text-sm mb-6">
            <AlertCircle className="h-4 w-4" />
            ID sertifikat tidak ditemukan pada URL.
          </div>
        )}

        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-6 w-1/3 rounded" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            Gagal memuat data sertifikat.
          </div>
        )}

        {cert && (
          <div className="p-6 rounded-lg border bg-card shadow-sm">
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
                  <TableCell>{participant}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center gap-2 font-medium text-muted-foreground">
                    <BookOpen className="h-4 w-4 text-orange-500" />
                    Kursus
                  </TableCell>
                  <TableCell>{course}</TableCell>
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

            <div className="p-4 flex flex-wrap gap-2">
              <StatusPill status={inferredStatus} />

              {cert.url && (
                <Button
                  asChild
                  variant="secondary"
                  onClick={() =>
                    notify("Membuka / mengunduh sertifikat dalam tab baru.")
                  }
                >
                  <a href={cert.url} target="_blank" rel="noreferrer">
                    <FileDown className="mr-2 h-4 w-4" />
                    Lihat / Unduh Sertifikat
                  </a>
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() =>
                  handleCopy(number.toString(), "Nomor sertifikat tersalin.")
                }
              >
                <Copy className="mr-2 h-4 w-4" />
                Salin Nomor
              </Button>

              <Button variant="outline" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Bagikan
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  const shareUrl =
                    typeof window !== "undefined" ? window.location.href : "";
                  handleCopy(shareUrl, "Tautan halaman tersalin.");
                }}
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                Salin Tautan Halaman
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ValidasiSertifikatId;
