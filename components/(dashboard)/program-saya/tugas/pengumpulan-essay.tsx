"use client";

import Link from "next/link";
import { formatDistanceToNowStrict, isAfter, isBefore } from "date-fns";
import { id as localeID } from "date-fns/locale";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Clock4,
  FileText,
  Loader2,
  Paperclip,
  Send,
} from "lucide-react";
import { useForm } from "react-hook-form";

import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toAssetUrl } from "@/helpers/api-config";
import { usePostData } from "@/hooks/use-post-data";
import { cn } from "@/lib/utils";
import type { TAssignment } from "../../kelas/tugas/_types/tugas-type";
import {
  EssayAnswerFormData,
  EssayAnswerSchema,
} from "./_schemas/assignment-essay-schema";
import { formatWIB } from "./_utils/utils";

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
  const timeInfo = open
    ? `Sisa ${formatDistanceToNowStrict(endAt, { locale: localeID })}`
    : closed
      ? "Tugas ditutup"
      : `Mulai ${formatDistanceToNowStrict(startAt, { locale: localeID })} lagi`;

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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]"
      >
        <aside className="h-fit rounded-lg border bg-card p-5 shadow-sm lg:sticky lg:top-20">
          <div className="flex items-center justify-between gap-3">
            <Badge variant="secondary" className="rounded-full">
              Esai
            </Badge>
            <StatusBadge open={open} closed={closed} notStarted={notStarted} />
          </div>

          <h1 className="mt-4 text-xl font-extrabold leading-tight">
            {assignment.title}
          </h1>
          {assignment.description ? (
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {assignment.description}
            </p>
          ) : null}

          <div className="mt-5 grid gap-2 text-sm">
            <InfoLine label="Mulai" value={formatWIB(startAt)} />
            <InfoLine label="Berakhir" value={formatWIB(endAt)} />
            <div className="flex items-center gap-2 rounded-md border bg-background p-3 text-muted-foreground">
              <Clock4 className="size-4 shrink-0 text-primary" />
              <span>{timeInfo}</span>
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold">File Tugas</p>
            {assignment.assignment_files.length > 0 ? (
              <div className="grid gap-2">
                {assignment.assignment_files.map((file, index) => {
                  const ext = getExt(file.file_url);
                  return (
                    <a
                      key={file.id}
                      href={toAssetUrl(file.file_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-md border bg-background p-3 text-sm hover:bg-muted/50"
                    >
                      <Paperclip className="size-4 shrink-0 text-primary" />
                      <span className="min-w-0 flex-1 truncate">
                        tugas-{index + 1}.{ext}
                      </span>
                      <FileBadge ext={ext} />
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-md border bg-background p-3 text-sm text-muted-foreground">
                Tidak ada lampiran.
              </p>
            )}
          </div>

          <Button variant="outline" className="mt-5 w-full gap-2" asChild>
            <Link href={`/dashboard/program-saya/${batchSlug}`}>
              <ArrowLeft className="size-4 shrink-0" />
              Kembali ke Kelas
            </Link>
          </Button>
        </aside>

        <section className="rounded-lg border bg-card p-5 shadow-sm">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <FileText className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold">Jawaban Esai</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Tulis jawaban dengan struktur yang jelas. Jawaban dikirim ke
                endpoint tugas saat tombol submit ditekan.
              </p>
            </div>
          </div>

          <FormField
            control={form.control}
            name="essay_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Isi Jawaban</FormLabel>
                <FormControl>
                  <MinimalTiptapEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Tulis jawaban kamu..."
                    autofocus
                    editable={!isPending && open}
                    output="html"
                    className="min-h-[360px] w-full max-w-full overflow-hidden rounded-md"
                    editorContentClassName="prose max-w-none p-4"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              type="submit"
              disabled={isPending || !open}
              className="gap-2"
            >
              {isPending ? (
                <Loader2 className="size-4 shrink-0 animate-spin" />
              ) : (
                <Send className="size-4 shrink-0" />
              )}
              {isPending
                ? "Mengirim..."
                : closed
                  ? "Tugas Ditutup"
                  : notStarted
                    ? "Belum Dibuka"
                    : "Kirim Jawaban"}
            </Button>
          </div>
        </section>
      </form>
    </Form>
  );
};

export default PengumpulanEssay;

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function StatusBadge({
  open,
  closed,
  notStarted,
}: {
  open: boolean;
  closed: boolean;
  notStarted: boolean;
}) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-semibold",
        open && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        closed && "bg-destructive/10 text-destructive",
        notStarted && "bg-muted text-muted-foreground",
      )}
    >
      {open ? "Berjalan" : closed ? "Ditutup" : "Belum Dibuka"}
    </span>
  );
}

function FileBadge({ ext }: { ext: string }) {
  return (
    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold uppercase text-muted-foreground">
      {ext}
    </span>
  );
}

function getExt(value: string) {
  return value.split(".").pop()?.toLowerCase() || "file";
}
