import { z } from "zod";

const FileOrUrlSchema = z.union([
  z.string().url("URL gambar tidak valid"),
  z.instanceof(File, { message: "Harus berupa file gambar" }),
]);

export const CreateCourseFormSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  short_description: z
    .string()
    .min(1, "Deskripsi singkat wajib diisi")
    .max(150, "Maksimal 150 karakter"),
  description: z.string().min(1, "Deskripsi lengkap wajib diisi"),
  learning_outcomes: z.string().min(1, "Learning outcomes wajib diisi"),
  achievements: z.string().min(1, "Achievements wajib diisi"),
  course_images: z
    .array(FileOrUrlSchema)
    .min(1, "Minimal upload 1 gambar kursus")
    .max(10, "Maksimal 10 gambar diperbolehkan"),
});

export type CreateCourseFormValues = z.infer<typeof CreateCourseFormSchema>;
