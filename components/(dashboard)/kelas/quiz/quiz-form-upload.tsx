"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axiosInstance from "@/helpers/axios-instance";
import Cookies from "js-cookie";
import { AxiosError } from "axios";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  FileUp,
  Download,
  Info,
  RefreshCw,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ACCEPT_ATTR =
  ".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel";

export const UploadSchema = z.object({
  file: z
    .instanceof(File, { message: "File .xlsx wajib diunggah" })
    .refine(
      (f) =>
        [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ].includes(f.type),
      {
        message: "Format harus .xlsx atau .xls",
      }
    )
    .refine((f) => f.size <= 10 * 1024 * 1024, {
      message: "Maksimal ukuran file 10 MB",
    }),
  confirmReplace: z
    .boolean({ required_error: "Harus dicentang" })
    .refine((v) => v === true, {
      message: "Centang untuk mengonfirmasi penggantian semua soal",
    }),
});

export type UploadForm = z.infer<typeof UploadSchema>;

type Props = {
  quizId: string;
  batchSlug: string;
  meetingId?: string;
};

export default function QuizFormUpload({
  quizId,
  batchSlug,
  meetingId,
}: Props) {
  const router = useRouter();
  const [progress, setProgress] = React.useState<number>(0);
  const [isPending, setIsPending] = React.useState(false);
  const [selectedName, setSelectedName] = React.useState<string>("");

  const form = useForm<UploadForm>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      file: undefined as unknown as File,
      confirmReplace: false,
    },
  });

  const onSubmit = async (values: UploadForm) => {
    if (!values.confirmReplace) {
      toast.warning("Konfirmasi dulu ya", {
        description: "Centang kotak 'Saya paham...' untuk melanjutkan.",
      });
      return;
    }

    const fd = new FormData();
    fd.append("file", values.file);

    setIsPending(true);
    setProgress(0);
    toast("Mengunggah soal...");

    try {
      const token = Cookies.get("access_token");

      await axiosInstance.post(`/quizzes/${quizId}/import-questions`, fd, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (e) => {
          if (!e.total) return;
          const pct = Math.round((e.loaded * 100) / e.total);
          setProgress(pct);
        },
      });

      toast.success("Berhasil mengimpor soal!", {
        description:
          "Semua soal pada quiz ini telah diganti sesuai file yang diunggah.",
      });
      router.push(`/dashboard/kelas/${batchSlug}/quiz?${meetingId ?? ""}`);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error("Gagal mengimpor soal", {
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleFileChange = (file?: File) => {
    if (!file) return;
    form.setValue("file", file, { shouldValidate: true, shouldDirty: true });
    setSelectedName(file.name);
  };

  const clearFile = () => {
    form.resetField("file");
    setSelectedName("");
    setProgress(0);
  };

  return (
    <Card className="overflow-hidden rounded-2xl">
      <CardHeader>
        <CardTitle>Upload Soal Quiz</CardTitle>
        <CardDescription>
          Unggah file Excel (.xlsx) sesuai template. Mengunggah ulang akan{" "}
          <span className="font-semibold text-destructive">
            mengganti seluruh soal
          </span>{" "}
          di quiz ini.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-start gap-3 rounded-xl border bg-muted/40 p-3">
          <Info className="mt-0.5 h-5 w-5 text-orange-500" />
          <div className="space-y-1 text-sm">
            <p className="leading-relaxed">
              Pastikan Anda memakai template terbaru. Header kolom pada file
              harus persis seperti di template. Jika sebelumnya sudah ada soal,
              import baru akan
              <span className="font-semibold"> menggantikan semuanya</span>.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">.xlsx</Badge>
              <Badge variant="secondary">Maks 10 MB</Badge>
              <Badge variant="secondary">Single file</Badge>
            </div>
          </div>
        </div>

        <ol className="grid gap-2 rounded-xl border bg-background/60 p-3 text-sm">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" />
            <span>
              1. Klik <span className="font-medium">Download Template</span> dan
              buka file Excel-nya.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" />
            <span>
              2. Isi pertanyaan dan opsi jawaban sesuai header di template.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" />
            <span>
              3. Simpan sebagai <code>.xlsx</code>.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" />
            <span>
              4. Unggah file pada form di bawah, lalu klik{" "}
              <span className="font-medium">Import</span>.
            </span>
          </li>
        </ol>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="orange" size="sm">
            <Link
              href="/excel-templates/quiz_pg_mock.xlsx"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Template Excel PG
            </Link>
          </Button>
          <Button asChild variant="orange" size="sm">
            <Link
              href="/excel-templates/quiz_tf_mock.xlsx"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Template Excel True/False
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link
              href="https://docs.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileUp className="mr-2 h-4 w-4" />
              Lihat Panduan Pengisian
            </Link>
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Soal (.xlsx)</FormLabel>
                  <FormControl>
                    <div
                      className={cn(
                        "group relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center",
                        "bg-muted/30 hover:bg-muted/50 transition",
                        !selectedName ? "py-14" : ""
                      )}
                    >
                      <FileUp className="h-8 w-8 opacity-80" />
                      {!selectedName ? (
                        <>
                          <p className="text-sm">
                            Seret & letakkan file di sini, atau klik untuk
                            memilih
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Format: .xlsx (maks 10 MB)
                          </p>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{selectedName}</Badge>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={clearFile}
                            className="h-7"
                          >
                            <RefreshCw className="mr-1 h-3.5 w-3.5" />
                            Ganti File
                          </Button>
                        </div>
                      )}
                      <Input
                        type="file"
                        accept={ACCEPT_ATTR}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        onChange={(e) => handleFileChange(e.target.files?.[0])}
                        onBlur={field.onBlur}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmReplace"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <div className="flex items-start gap-2 rounded-xl border bg-muted/30 p-3">
                    <input
                      id="confirmReplace"
                      type="checkbox"
                      className="mt-1 h-4 w-4"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                    <label htmlFor="confirmReplace" className="text-sm">
                      Saya paham bahwa import ini akan{" "}
                      <span className="font-semibold text-destructive">
                        mengganti semua soal
                      </span>{" "}
                      yang ada.
                    </label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isPending && (
              <div className="w-full rounded-full bg-muted p-0.5">
                <div
                  className="h-2 rounded-full bg-orange-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
                <div className="mt-1 text-right text-xs text-muted-foreground">
                  {progress}%
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-muted-foreground">
                Setelah sukses, kamu akan diarahkan kembali ke halaman daftar
                quiz.
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    router.push(
                      `/dashboard/kelas/${batchSlug}/quiz?${meetingId ?? ""}`
                    )
                  }
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="orange"
                  disabled={isPending || !form.watch("file")}
                  className="text-white"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mengimpor...
                    </>
                  ) : (
                    "Import Soal"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter />
    </Card>
  );
}
