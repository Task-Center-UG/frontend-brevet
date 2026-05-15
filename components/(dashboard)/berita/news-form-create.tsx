"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Newspaper } from "lucide-react";
import { useForm } from "react-hook-form";

import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFileUploader } from "@/hooks/use-file-uploader";
import { usePostData } from "@/hooks/use-post-data";

import {
  DashboardFormActions,
  DashboardFormHeader,
  DashboardFormSection,
} from "../kursus/_components/dashboard-form-shell";
import {
  CreateNewsFormData,
  CreateNewsSchema,
} from "./_schemas/news-create-schema";

const NewsFormCreate = () => {
  const { uploadFile } = useFileUploader();

  const form = useForm<CreateNewsFormData>({
    resolver: zodResolver(CreateNewsSchema),
    defaultValues: {
      title: "",
      short_description: "",
      full_description: "",
      image: "",
    },
  });

  const { mutate: submitNews, isPending } = usePostData({
    queryKey: "news",
    dataProtected: `blogs`,
    successMessage: "Berita berhasil ditambahkan!",
    backUrl: "/dashboard/berita",
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, "images");
    form.setValue("image", url || "", { shouldValidate: true });
  };

  const onSubmit = (values: CreateNewsFormData) => {
    submitNews({
      title: values.title,
      description: values.short_description,
      content: values.full_description,
      image: values.image,
    });
  };

  const title = form.watch("title");
  const shortDescription = form.watch("short_description");
  const image = form.watch("image");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="min-w-0 space-y-5"
      >
        <DashboardFormHeader
          eyebrow="Manajemen Berita"
          title="Tambah berita dengan alur editorial yang rapi."
          description="Pisahkan judul, ringkasan, isi, dan gambar agar berita mudah dicek sebelum dipublikasikan."
        />

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <main className="min-w-0 space-y-5">
            <DashboardFormSection
              step="01"
              title="Identitas berita"
              description="Judul dan ringkasan harus cukup jelas untuk daftar berita publik."
            >
              <div className="grid gap-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Judul berita" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="short_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi Singkat</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Ringkas isi berita dalam satu sampai dua kalimat"
                          className="min-h-24"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </DashboardFormSection>

            <DashboardFormSection
              step="02"
              title="Isi berita"
              description="Gunakan struktur paragraf yang enak dibaca dan hindari teks terlalu padat."
            >
              <FormField
                control={form.control}
                name="full_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Isi Berita</FormLabel>
                    <FormControl>
                      <MinimalTiptapEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Masukkan isi lengkap berita..."
                        autofocus
                        editable
                        output="html"
                        className="w-full max-w-full overflow-hidden"
                        editorContentClassName="prose max-w-none p-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </DashboardFormSection>

            <DashboardFormSection
              step="03"
              title="Gambar utama"
              description="Pilih gambar yang mendukung konteks berita, bukan dekorasi kosong."
            >
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>Gambar Berita</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </DashboardFormSection>
          </main>

          <NewsPreview
            title={title}
            description={shortDescription}
            image={image}
            mode="Draft Berita"
          />
        </div>

        <DashboardFormActions
          disabled={isPending}
          pending={isPending}
          label="Simpan Data"
          note="Simpan setelah judul, ringkasan, isi, dan gambar utama sudah benar."
        />
      </form>
    </Form>
  );
};

function NewsPreview({
  title,
  description,
  image,
  mode,
}: {
  title?: string;
  description?: string;
  image?: string;
  mode: string;
}) {
  return (
    <aside className="min-w-0 space-y-5 xl:sticky xl:top-24 xl:h-fit">
      <section className="overflow-hidden rounded-lg border bg-card">
        <div className="relative aspect-[4/3] bg-muted">
          <ImageWithFallback
            src={image || "/placeholder.jpeg"}
            alt="Pratinjau gambar berita"
            fill
            className="object-cover"
          />
        </div>
        <div className="p-5">
          <Badge variant="secondary" className="gap-2">
            <Newspaper className="size-3" />
            {mode}
          </Badge>
          <h2 className="mt-4 text-xl font-bold leading-7">
            {title || "Judul berita akan tampil di sini"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description ||
              "Deskripsi singkat membantu pembaca memahami konteks berita sebelum membuka artikel."}
          </p>
        </div>
      </section>

      <section className="rounded-lg border bg-card p-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-primary">
            <FileText className="size-5" />
          </span>
          <div>
            <h2 className="font-bold">Cek ritme baca.</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Judul jelas, ringkasan pendek, isi terstruktur, gambar relevan.
            </p>
          </div>
        </div>
      </section>
    </aside>
  );
}

export default NewsFormCreate;
