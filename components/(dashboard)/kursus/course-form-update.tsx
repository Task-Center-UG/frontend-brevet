"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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
import { useGetData } from "@/hooks/use-get-data";
import { usePutData } from "@/hooks/use-put-data";

import {
  DashboardFormActions,
  DashboardFormHeader,
  DashboardFormSection,
} from "./_components/dashboard-form-shell";
import {
  UpdateCourseFormData,
  UpdateCourseSchema,
} from "./_schemas/course-update-schema";
import { TCourseImage } from "./_types/couurse-type";

type Props = {
  courseSlug: string;
};

const CourseFormUpdate = ({ courseSlug }: Props) => {
  const [isReady, setIsReady] = useState(false);
  const [initialUrls, setInitialUrls] = useState<string[]>([]);
  const { uploadFile } = useFileUploader();

  const { data, isLoading: isFetching } = useGetData({
    queryKey: ["courses", courseSlug],
    dataProtected: `courses/${courseSlug}`,
    options: {
      refetchOnWindowFocus: false,
    },
  });

  const form = useForm<UpdateCourseFormData>({
    resolver: zodResolver(UpdateCourseSchema),
    defaultValues: {
      title: "",
      short_description: "",
      description: "",
      learning_outcomes: "",
      achievements: "",
      course_images: [],
    },
  });

  const { mutate: updateCourse, isPending } = usePutData({
    queryKey: "courses",
    dataProtected: `courses/${data?.data?.data?.id}`,
    successMessage: "Kursus berhasil diperbarui!",
    backUrl: "/dashboard/kursus",
  });

  const handleRemoveInitial = (index: number) => {
    setInitialUrls((prev) => {
      const updatedUrls = prev.filter((_, i) => i !== index);
      const updatedImages = form
        .getValues("course_images")
        .filter((img) => updatedUrls.includes(img.image_url));
      form.setValue("course_images", updatedImages, { shouldDirty: true });
      return updatedUrls;
    });
  };

  const onSubmit = async (values: UpdateCourseFormData) => {
    const currentImages = form.getValues("course_images");
    for (const img of currentImages) {
      if (!img.image_url.startsWith("http")) {
        console.warn("URL tidak valid:", img);
      }
    }

    updateCourse({
      ...values,
      course_images: values.course_images,
    });
  };

  const handleUploadFiles = async (files: File[]) => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (file.type.startsWith("image/")) {
        const url = await uploadFile(file, "images");
        if (url) uploadedUrls.push(url);
      }
    }

    const currentImages = form.getValues("course_images");
    const newImages = uploadedUrls.map((url) => ({ image_url: url }));
    const existingUrls = currentImages.map((img) => img.image_url);
    const filteredNewImages = newImages.filter(
      (img) => !existingUrls.includes(img.image_url),
    );

    form.setValue("course_images", [...currentImages, ...filteredNewImages], {
      shouldDirty: true,
    });
  };

  useEffect(() => {
    if (data?.data?.data && !form.formState.isDirty) {
      const course = data.data.data;
      const imageUrls =
        course.course_images?.map((img: TCourseImage) => img.image_url) || [];

      form.reset({
        title: course.title || "",
        short_description: course.short_description || "",
        description: course.description || "",
        learning_outcomes: course.learning_outcomes || "",
        achievements: course.achievements || "",
        course_images: imageUrls.map((url: string) => ({ image_url: url })),
      });

      setInitialUrls(imageUrls);
      setIsReady(true);
    }
  }, [data, form]);

  if (!isReady) return null;

  const title = form.watch("title");
  const shortDescription = form.watch("short_description");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="min-w-0 space-y-5"
      >
        <DashboardFormHeader
          eyebrow="Manajemen Kursus"
          title="Perbarui kursus tanpa kehilangan struktur konten."
          description="Cek ulang identitas, narasi, hasil belajar, dan galeri agar halaman publik tetap jelas."
        />

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <main className="min-w-0 space-y-5">
            <DashboardFormSection
              step="01"
              title="Identitas kursus"
              description="Judul dan ringkasan pendek yang paling cepat dibaca peserta."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul Kursus</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Judul kursus"
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
                        <Input
                          {...field}
                          placeholder="Deskripsi singkat"
                          disabled={isFetching}
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
              description="Pastikan deskripsi lengkap mudah dipahami calon peserta."
            >
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi Lengkap</FormLabel>
                    <FormControl>
                      <MinimalTiptapEditor
                        key={courseSlug}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Masukkan deskripsi lengkap kursus..."
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
              title="Hasil belajar"
              description="Kelompokkan hasil pembelajaran dan pencapaian akhir."
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
                          key={`lo-${courseSlug}`}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Apa yang akan dipelajari peserta?"
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

                <FormField
                  control={form.control}
                  name="achievements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pencapaian</FormLabel>
                      <FormControl>
                        <MinimalTiptapEditor
                          key={`ach-${courseSlug}`}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Apa yang akan dicapai peserta?"
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
              </div>
            </DashboardFormSection>

            <DashboardFormSection
              step="04"
              title="Galeri kursus"
              description="Pertahankan gambar yang masih relevan, hapus yang tidak dipakai."
            >
              <FormField
                control={form.control}
                name="course_images"
                render={() => (
                  <FormItem>
                    <FormLabel>Gambar Kursus</FormLabel>
                    <FormControl>
                      <FileInput
                        initialUrls={initialUrls}
                        onRemoveInitial={handleRemoveInitial}
                        onFilesChange={(incoming) => {
                          const arr = incoming as (string | File)[];
                          const onlyFiles = arr.filter(
                            (it): it is File => it instanceof File,
                          );
                          if (onlyFiles.length) {
                            void handleUploadFiles(onlyFiles);
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </DashboardFormSection>
          </main>

          <aside className="min-w-0 space-y-5 xl:sticky xl:top-24 xl:h-fit">
            <section className="overflow-hidden rounded-lg border bg-card">
              <div className="relative aspect-[4/3] bg-muted">
                <ImageWithFallback
                  src={initialUrls[0] || "/placeholder.jpeg"}
                  alt="Pratinjau gambar kursus"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <Badge variant="secondary" className="gap-2">
                  <BookOpen className="size-3" />
                  Update Kursus
                </Badge>
                <h2 className="mt-4 text-xl font-bold leading-7">
                  {title || "Judul kursus"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {shortDescription || "Ringkasan kursus belum diisi."}
                </p>
              </div>
            </section>

            <section className="rounded-lg border bg-card p-5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-primary">
                  <Target className="size-5" />
                </span>
                <div>
                  <h2 className="font-bold">Jaga konsistensi publik.</h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Perubahan kursus akan memengaruhi halaman publik dan pilihan
                    gelombang terkait.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>

        <DashboardFormActions
          disabled={isPending || isFetching}
          pending={isPending}
          label="Perbarui Kursus"
          note="Simpan setelah perubahan kursus sudah benar."
        />
      </form>
    </Form>
  );
};

export default CourseFormUpdate;
