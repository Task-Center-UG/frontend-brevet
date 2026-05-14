"use client";

import * as React from "react";
import { useGetData } from "@/hooks/use-get-data";
import { usePatchData } from "@/hooks/use-patch-data";
import { useFileUploader } from "@/hooks/use-file-uploader";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FileInput from "@/components/ui/file-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Paperclip } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { format, formatDistanceToNowStrict, isAfter, isBefore } from "date-fns";
import { id as localeID } from "date-fns/locale";
import type { TAssignmentSubmission } from "./_types/submission-type";
import {
  AssignmentFileAnswerFormData,
  AssignmentFileAnswerSchema,
} from "./_schemas/assignment-file-answer-schema";

type Props = {
  batchSlug: string;
  assignmentId: string;
  submissionId: string;
};

const UpdatePengumpulanFile = ({
  batchSlug,
  assignmentId,
  submissionId,
}: Props) => {
  const { data, isLoading, isError } = useGetData({
    queryKey: ["submission", submissionId],
    dataProtected: `submissions/${submissionId}`,
    options: { refetchOnWindowFocus: false },
  });

  const submission: TAssignmentSubmission | undefined = data?.data?.data;
  const assignment = submission?.assignment;

  const [initialUrls, setInitialUrls] = React.useState<string[]>([]);
  const [isReady, setIsReady] = React.useState(false);

  const form = useForm<AssignmentFileAnswerFormData>({
    resolver: zodResolver(AssignmentFileAnswerSchema),
    defaultValues: { files: [] },
  });

  const { uploadFile } = useFileUploader();

  const patchSubmission = usePatchData({
    queryKey: "assignment",
    dataProtected: `submissions/${submissionId}`,
    successMessage: "Jawaban file berhasil diperbarui!",
    backUrl: `/dashboard/program-saya/${batchSlug}/tugas/${assignmentId}`,
  });

  React.useEffect(() => {
    if (!submission || !assignment) return;
    const oldUrls = submission.submission_files?.map((f) => f.file_url) ?? [];
    setInitialUrls(oldUrls);
    form.reset({ files: oldUrls });
    setIsReady(true);
  }, [submission, assignment, form]);

  if (isLoading) return <UpdateFileSkeleton />;
  if (isError || !submission || !assignment) {
    return <div className="text-sm text-destructive">Gagal memuat data.</div>;
  }
  if (!isReady) return <UpdateFileSkeleton />;

  const startAt = new Date(assignment.start_at);
  const endAt = new Date(assignment.end_at);
  const now = new Date();

  const notStarted = isAfter(startAt, now);
  const closed = isBefore(endAt, now);
  const open = !notStarted && !closed;

  const timeInfo = open
    ? `Sisa waktu: ${formatDistanceToNowStrict(endAt, { locale: localeID })}`
    : closed
      ? `Ditutup: ${formatDistanceToNowStrict(endAt, { locale: localeID })} lalu`
      : `Mulai dalam: ${formatDistanceToNowStrict(startAt, { locale: localeID })}`;

  const keyOf = (item: string | File) =>
    typeof item === "string"
      ? `u:${item}`
      : `f:${item.name}:${item.size}:${item.lastModified}`;

  const handleRemoveInitial = (index: number) => {
    setInitialUrls((prev) => {
      const newUrls = prev.filter((_, i) => i !== index);
      const current = form.getValues("files") as (string | File)[];
      const updated = current.filter((item) =>
        typeof item === "string" ? newUrls.includes(item) : true
      );
      form.setValue("files", updated, {
        shouldDirty: true,
        shouldValidate: true,
      });
      return newUrls;
    });
  };

  const onSubmit = async (values: AssignmentFileAnswerFormData) => {
    const existingUrls: string[] = [];
    const newFiles: File[] = [];

    for (const item of values.files) {
      if (typeof item === "string") existingUrls.push(item);
      else newFiles.push(item);
    }

    const uploadedUrls: string[] = [];
    for (const f of newFiles) {
      const isImage = f.type.startsWith("image/");
      const url = await uploadFile(f, isImage ? "images" : "documents");
      if (url) uploadedUrls.push(url);
    }

    const finalUrls = [...existingUrls, ...uploadedUrls];
    const payload = {
      submission_files: finalUrls.map((url) => ({ file_url: url })),
    };
    patchSubmission.mutate(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">{assignment.title}</CardTitle>
                {assignment.description && (
                  <CardDescription className="mt-1">
                    {assignment.description}
                  </CardDescription>
                )}
              </div>
              <span className="text-[11px] rounded-full border px-2 py-0.5">
                {notStarted
                  ? "Belum Dibuka"
                  : open
                    ? "Sedang Berjalan"
                    : "Tertutup"}
              </span>
            </div>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm text-muted-foreground">
            <div className="flex flex-wrap gap-4">
              <div>
                <span className="font-medium text-foreground">Mulai: </span>
                {format(startAt, "dd MMM yyyy, HH:mm", {
                  locale: localeID,
                })}{" "}
                WIB
              </div>
              <div>
                <span className="font-medium text-foreground">Berakhir: </span>
                {format(endAt, "dd MMM yyyy, HH:mm", { locale: localeID })} WIB
              </div>
              <div className="text-foreground/80">{timeInfo}</div>
            </div>

            {assignment.assignment_files?.length > 0 && (
              <div className="mt-1">
                <div className="font-medium text-foreground mb-1">
                  File Tugas
                </div>
                <ul className="flex flex-wrap gap-2">
                  {assignment.assignment_files.map((f, i) => (
                    <li key={f.id}>
                      <Link
                        href={f.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs hover:bg-muted"
                      >
                        <Paperclip className="h-3.5 w-3.5" />
                        <span className="text-primary hover:underline">
                          tugas-{i + 1}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perbarui Jawaban (File)</CardTitle>
            <CardDescription>
              Ubah, tambah, atau hapus berkas jawabanmu.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Jawaban</FormLabel>
                  <FormControl>
                    <FileInput
                      onFilesChange={(incoming) => {
                        const prev = (field.value ?? []) as (string | File)[];
                        const add = Array.isArray(incoming)
                          ? incoming
                          : [incoming];
                        const map = new Map<string, string | File>();
                        for (const it of [...prev, ...add])
                          map.set(keyOf(it), it);
                        field.onChange(Array.from(map.values()));
                      }}
                      initialUrls={initialUrls}
                      onRemoveInitial={handleRemoveInitial}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex gap-2">
            <Button
              type="submit"
              variant="orange"
              className="min-w-40"
              disabled={patchSubmission.isPending || !open}
            >
              {patchSubmission.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan…
                </>
              ) : closed ? (
                "Tugas Ditutup"
              ) : notStarted ? (
                "Belum Dibuka"
              ) : (
                "Simpan Perubahan"
              )}
            </Button>

            <Button variant="outline" asChild>
              <Link
                href={`/dashboard/program-saya/${batchSlug}/tugas/${assignmentId}`}
              >
                Batal
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default UpdatePengumpulanFile;

function UpdateFileSkeleton() {
  return (
    <div className="grid gap-4">
      <Card className="overflow-hidden">
        <div className="h-1.5 w-full bg-primary/70" />
        <CardHeader className="p-5 md:p-6 border-b">
          <div className="flex items-start justify-between gap-3">
            <div className="w-full">
              <Skeleton className="h-5 w-56 mb-2" />
              <Skeleton className="h-4 w-[60%]" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="p-5 md:p-6 grid gap-3">
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-4 w-60" />
          </div>
          <div className="grid gap-2">
            <Skeleton className="h-4 w-40" />
            <div className="flex gap-2">
              <Skeleton className="h-7 w-28 rounded-full" />
              <Skeleton className="h-7 w-28 rounded-full" />
              <Skeleton className="h-7 w-28 rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-5 md:p-6">
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="p-5 md:p-6 grid gap-4">
          <Skeleton className="h-4 w-28" />
          <div className="rounded-md border p-4">
            <Skeleton className="h-10 w-full border-b mb-4" />
            <div className="grid gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-1/2" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-5 md:p-6 flex gap-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-24" />
        </CardFooter>
      </Card>
    </div>
  );
}
