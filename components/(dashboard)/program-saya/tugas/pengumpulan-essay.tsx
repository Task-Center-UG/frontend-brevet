"use client";

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
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Paperclip } from "lucide-react";
import { usePostData } from "@/hooks/use-post-data";
import {
  EssayAnswerFormData,
  EssayAnswerSchema,
} from "./_schemas/assignment-essay-schema";
import type { TAssignment } from "../../kelas/tugas/_types/tugas-type";
import { format, formatDistanceToNowStrict, isAfter, isBefore } from "date-fns";
import { id as localeID } from "date-fns/locale";

type Props = {
  batchSlug: string;
  assignment: TAssignment;
};

const PengumpulanEssay = ({ batchSlug, assignment }: Props) => {
  const startAt = new Date(assignment.start_at);
  const endAt = new Date(assignment.end_at);
  const now = new Date();

  const notStarted = isAfter(startAt, now);
  const closed = isBefore(endAt, now);
  const open = !notStarted && !closed;

  const statusInfo = (notStarted && {
    label: "Belum Dibuka",
    variant: "outline" as const,
  }) ||
    (open && { label: "Sedang Berjalan", variant: "secondary" as const }) || {
      label: "Tertutup",
      variant: "destructive" as const,
    };

  const timeInfo = open
    ? `Sisa waktu: ${formatDistanceToNowStrict(endAt, { locale: localeID })}`
    : closed
      ? `Ditutup: ${formatDistanceToNowStrict(endAt, { locale: localeID })} lalu`
      : `Mulai dalam: ${formatDistanceToNowStrict(startAt, { locale: localeID })}`;

  const getFileBadgeClass = (ext: string) => {
    if (ext === "pdf") return "bg-destructive/15 text-destructive";
    if (["png", "jpg", "jpeg", "webp"].includes(ext))
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
    return "bg-muted text-muted-foreground";
  };

  const form = useForm<EssayAnswerFormData>({
    resolver: zodResolver(EssayAnswerSchema),
    defaultValues: { essay_text: "" },
  });

  const { mutate: submitAnswer, isPending } = usePostData({
    queryKey: `assignment-${assignment.id}-answer`,
    dataProtected: `assignments/${assignment.id}/submissions`,
    successMessage: "Jawaban berhasil dikirim!",
    backUrl: `/dashboard/program-saya/${batchSlug}`,
  });

  const onSubmit = (values: EssayAnswerFormData) => {
    submitAnswer({ essay_text: values.essay_text });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mb-4">
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
              <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
            </div>
          </CardHeader>

          <CardContent className="grid gap-3 text-sm text-muted-foreground">
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

            <div>
              <div className="font-medium text-foreground mb-1">File Tugas</div>
              {assignment.assignment_files.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {assignment.assignment_files.map((f, i) => {
                    const ext =
                      f.file_url.split(".").pop()?.toLowerCase() ?? "file";
                    return (
                      <li key={f.id}>
                        <Link
                          href={f.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs hover:bg-muted"
                        >
                          <Paperclip className="h-3.5 w-3.5" />
                          <span
                            className={`px-2 py-0.5 rounded-full ${getFileBadgeClass(
                              ext
                            )}`}
                          >
                            {ext.toUpperCase()}
                          </span>
                          <span>{`tugas-${i + 1}.${ext.toUpperCase()}`}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>Tidak ada lampiran.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kumpulkan Jawaban (Esai)</CardTitle>
            <CardDescription>
              Tulis jawaban esai kamu di editor di bawah ini.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-6">
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
                      placeholder="Tulis jawaban kamu…"
                      autofocus
                      editable={!isPending && open}
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

          <CardFooter className="justify-start">
            <Button
              type="submit"
              disabled={isPending || !open}
              variant="orange"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengirim…
                </>
              ) : closed ? (
                "Tugas Ditutup"
              ) : notStarted ? (
                "Belum Dibuka"
              ) : (
                "Kirim Jawaban"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default PengumpulanEssay;
