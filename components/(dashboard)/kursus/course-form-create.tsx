"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Target } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { Badge } from "@/components/ui/badge";
import FileInput from "@/components/ui/file-input";
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
import { useFileUploader } from "@/hooks/use-file-uploader";
import { usePostData } from "@/hooks/use-post-data";

import {
  DashboardFormActions,
  DashboardFormHeader,
  DashboardFormSection,
} from "./_components/dashboard-form-shell";
import {
  CreateCourseFormSchema,
  CreateCourseFormValues,
} from "./_schemas/course-create-schema";

const CourseFormCreate = () => {
  const { uploadFile } = useFileUploader();

  const form = useForm<CreateCourseFormValues>({
    resolver: zodResolver(CreateCourseFormSchema),
    defaultValues: {
      title: "",
      short_description: "",
      description: "",
      learning_outcomes: "",
      achievements: "",
      course_images: [],
    },
  });

  const { mutate: submitCourse, isPending } = usePostData({
    queryKey: "courses",
    dataProtected: `courses`,
    successMessage: "Kursus berhasil ditambahkan!",
    backUrl: "/dashboard/kursus",
  });

  const onSubmit = async (values: CreateCourseFormValues) => {
    const newImages: { image_url: string }[] = [];

    for (const item of values.course_images) {
      if (typeof item === "string") {
        newImages.push({ image_url: item });
      } else if (item instanceof File) {
        const url = await uploadFile(item, "images");
        if (url) newImages.push({ image_url: url });
      }
    }

    submitCourse({
      ...values,
      course_images: newImages,
    });
  };

  const title = form.watch("title");
  const shortDescription = form.watch("short_description");

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit(onSubmit, () => {
            toast.error("Ada isian yang belum benar.");
          })(event);
        }}
        className="min-w-0 space-y-5"
      >
        <DashboardFormHeader
          eyebrow="Manajemen Kursus"
          title="Tambah kursus dengan struktur konten yang siap dipublikasikan."
          description="Pisahkan identitas, narasi, hasil belajar, dan galeri agar informasi kursus mudah dicek sebelum disimpan."
        />

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <main className="min-w-0 space-y-5">
            <DashboardFormSection
              step="01"
              title="Identitas kursus"
              description="Judul dan ringkasan pendek yang akan muncul di halaman publik."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul Kursus</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Masukkan judul kursus" />
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
                        <Input
                          {...field}
                          placeholder="Masukkan deskripsi singkat"
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
              title="Narasi kursus"
              description="Tuliskan konteks program, target peserta, dan alasan kursus ini penting."
            >
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi Lengkap</FormLabel>
                    <FormControl>
                      <MinimalTiptapEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Tuliskan deskripsi lengkap kursus..."
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
              title="Hasil belajar"
              description="Bedakan hal yang dipelajari dan capaian akhir peserta."
            >
              <div className="grid gap-5">
                <FormField
                  control={form.control}
                  name="learning_outcomes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hasil Pembelajaran</FormLabel>
                      <FormControl>
                        <MinimalTiptapEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Apa yang akan dipelajari peserta?"
                          autofocus={false}
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

                <FormField
                  control={form.control}
                  name="achievements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pencapaian</FormLabel>
                      <FormControl>
                        <MinimalTiptapEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Apa yang akan dicapai peserta?"
                          autofocus={false}
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
              </div>
            </DashboardFormSection>

            <DashboardFormSection
              step="04"
              title="Galeri kursus"
              description="Gunakan gambar nyata kelas, dokumen, atau suasana belajar."
            >
              <FormField
                control={form.control}
                name="course_images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gambar Kursus</FormLabel>
                    <FormControl>
                      <FileInput onFilesChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </DashboardFormSection>
          </main>

          <aside className="min-w-0 space-y-5 xl:sticky xl:top-24 xl:h-fit">
            <section className="overflow-hidden rounded-lg border bg-card">
              <div className="relative aspect-[4/3] bg-muted">
                <ImageWithFallback
                  src="/placeholder.jpeg"
                  alt="Pratinjau gambar kursus"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <Badge variant="secondary" className="gap-2">
                  <BookOpen className="size-3" />
                  Draft Kursus
                </Badge>
                <h2 className="mt-4 text-xl font-bold leading-7">
                  {title || "Judul kursus akan tampil di sini"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {shortDescription ||
                    "Ringkasan singkat membantu admin mengecek positioning kursus sebelum publikasi."}
                </p>
              </div>
            </section>

            <section className="rounded-lg border bg-card p-5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-primary">
                  <Target className="size-5" />
                </span>
                <div>
                  <h2 className="font-bold">Cek sebelum simpan.</h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Judul jelas, ringkasan pendek, konten lengkap, dan gambar
                    kursus sudah siap.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>

        <DashboardFormActions
          disabled={isPending}
          pending={isPending}
          label="Simpan Kursus"
          note="Simpan setelah semua informasi kursus sudah siap untuk dikelola."
        />
      </form>
    </Form>
  );
};

export default CourseFormCreate;
