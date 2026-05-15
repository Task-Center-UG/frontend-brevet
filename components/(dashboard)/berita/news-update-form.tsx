"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Newspaper } from "lucide-react";
import { useEffect, useState } from "react";
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
import { useGetData } from "@/hooks/use-get-data";
import { usePutData } from "@/hooks/use-put-data";

import {
  DashboardFormActions,
  DashboardFormHeader,
  DashboardFormSection,
} from "../kursus/_components/dashboard-form-shell";
import {
  CreateNewsFormData,
  CreateNewsSchema,
} from "./_schemas/news-create-schema";

type Props = {
  newsSlug: string;
};

const NewsUpdateForm = ({ newsSlug }: Props) => {
  const [isReady, setIsReady] = useState(false);
  const { uploadFile } = useFileUploader();

  const { data, isLoading: isFetching } = useGetData({
    queryKey: ["news", newsSlug],
    dataProtected: `blogs/${newsSlug}`,
    options: {
      refetchOnWindowFocus: false,
    },
  });

  const form = useForm<CreateNewsFormData>({
    resolver: zodResolver(CreateNewsSchema),
    defaultValues: {
      title: "",
      short_description: "",
      full_description: "",
      image: "",
    },
  });

  const { mutate: updateNews, isPending } = usePutData({
    queryKey: "news",
    dataProtected: `blogs/${data?.data?.data?.id}`,
    successMessage: "Berita berhasil diperbarui!",
    backUrl: "/dashboard/berita",
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, "images");
    form.setValue("image", url || "", { shouldValidate: true });
  };

  const onSubmit = (values: CreateNewsFormData) => {
    updateNews({
      title: values.title,
      description: values.short_description,
      content: values.full_description,
      image: values.image,
    });
  };

  useEffect(() => {
    if (data?.data?.data && !form.formState.isDirty) {
      form.reset({
        title: data.data.data.title || "",
        short_description: data.data.data.description || "",
        full_description: data.data.data.content || "",
        image: data.data.data.image || "",
      });
      setIsReady(true);
    }
  }, [data, form]);

  if (!isReady) return null;

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
          title="Perbarui berita tanpa merusak ritme baca."
          description="Cek ulang judul, ringkasan, isi, dan gambar utama agar artikel tetap jelas untuk pembaca publik."
        />

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <main className="min-w-0 space-y-5">
            <DashboardFormSection
              step="01"
              title="Identitas berita"
              description="Judul dan ringkasan menjadi sinyal pertama di daftar berita."
            >
              <div className="grid gap-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Judul berita"
                          disabled={isFetching}
                        />
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
                          disabled={isFetching}
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
              description="Pastikan susunan artikel mudah dibaca, tidak hanya panjang."
            >
              <FormField
                control={form.control}
                name="full_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Isi Berita</FormLabel>
                    <FormControl>
                      <MinimalTiptapEditor
                        key={newsSlug}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Masukkan isi lengkap berita..."
                        autofocus={false}
                        editable={!isFetching}
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
              description="Ganti gambar hanya jika gambar lama sudah tidak relevan."
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
                        disabled={isFetching}
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
            mode="Update Berita"
          />
        </div>

        <DashboardFormActions
          disabled={isPending || isFetching}
          pending={isPending}
          label="Perbarui Data"
          note="Simpan setelah perubahan berita sudah dicek."
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
            {title || "Judul berita"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description || "Deskripsi singkat belum diisi."}
          </p>
        </div>
      </section>

      <section className="rounded-lg border bg-card p-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-primary">
            <FileText className="size-5" />
          </span>
          <div>
            <h2 className="font-bold">Jaga kualitas publik.</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Perubahan judul, isi, dan gambar langsung memengaruhi halaman
              berita publik.
            </p>
          </div>
        </div>
      </section>
    </aside>
  );
}

export default NewsUpdateForm;
