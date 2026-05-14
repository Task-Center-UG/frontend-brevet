"use client";

import { useGetData } from "@/hooks/use-get-data";
import { usePatchData } from "@/hooks/use-patch-data";
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
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { format, formatDistanceToNowStrict, isAfter, isBefore } from "date-fns";
import { id as localeID } from "date-fns/locale";
import Link from "next/link";
import * as React from "react";
import type { TAssignmentSubmission } from "./_types/submission-type";
import {
  EssayAnswerFormData,
  EssayAnswerSchema,
} from "./_schemas/assignment-essay-schema";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  batchSlug: string;
  assignmentId: string;
  submissionId: string;
};

const UpdatePengumpulanEssay = ({
  batchSlug,
  assignmentId,
  submissionId,
}: Props) => {
  const { data, isLoading, isError } = useGetData({
    queryKey: ["submission", submissionId],
    dataProtected: `submissions/${submissionId}`,
  });

  const submission: TAssignmentSubmission | undefined = data?.data?.data;
  const assignment = submission?.assignment;

  const form = useForm<EssayAnswerFormData>({
    resolver: zodResolver(EssayAnswerSchema),
    defaultValues: { essay_text: submission?.essay_text ?? "" },
  });

  React.useEffect(() => {
    if (submission?.essay_text != null) {
      form.reset({ essay_text: submission.essay_text });
    }
  }, [submission?.essay_text, form]);

  const patch = usePatchData({
    queryKey: "assignment",
    dataProtected: `submissions/${submissionId}`,
    successMessage: "Jawaban berhasil diperbarui!",
    backUrl: `/dashboard/program-saya/${batchSlug}/tugas/${assignmentId}`,
  });

  if (isLoading) return <UpdateEssaySkeleton />;

  if (isError || !submission || !assignment) {
    return <div className="text-sm text-destructive">Gagal memuat data.</div>;
  }

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

  const onSubmit = (values: EssayAnswerFormData) => {
    patch.mutate({ essay_text: values.essay_text });
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
              <span className="text-xs rounded-full border px-2 py-0.5">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perbarui Jawaban (Esai)</CardTitle>
            <CardDescription>
              Revisi jawabanmu lalu simpan perubahan.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="essay_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jawaban Esai</FormLabel>
                  <FormControl>
                    <MinimalTiptapEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Tulis revisi jawaban kamu…"
                      editable={!patch.isPending && open}
                      output="html"
                      className="w-full max-w-full overflow-hidden"
                      editorContentClassName="prose max-w-none p-4"
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
              disabled={patch.isPending || !open}
            >
              {patch.isPending ? (
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

export default UpdatePengumpulanEssay;

/** ================= Skeleton ================= */
function UpdateEssaySkeleton() {
  return (
    <div className="grid gap-4">
      {/* Header Card */}
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
        </CardContent>
      </Card>

      {/* Editor Card */}
      <Card>
        <CardHeader className="p-5 md:p-6">
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="p-5 md:p-6 grid gap-4">
          <Skeleton className="h-4 w-28" />
          {/* simulate editor area */}
          <div className="rounded-md border">
            <Skeleton className="h-10 w-full border-b" />
            <div className="p-4 grid gap-3">
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[85%]" />
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-4 w-[70%]" />
              <Skeleton className="h-4 w-[60%]" />
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
