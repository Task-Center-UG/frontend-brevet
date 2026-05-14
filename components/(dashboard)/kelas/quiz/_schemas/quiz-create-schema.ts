import { z } from "zod";

export const CreateQuizSchema = z
  .object({
    title: z.string().min(1, "Judul quiz wajib diisi"),
    description: z.string().min(1, "Deskripsi wajib diisi"),
    quiz_type: z.enum(["tf", "mc"], {
      required_error: "Tipe quiz wajib dipilih",
    }),
    duration_minute: z
      .number({ invalid_type_error: "Durasi harus berupa angka" })
      .int("Durasi harus bilangan bulat")
      .positive("Durasi minimal 1 menit"),
    start_time: z.date({ required_error: "Waktu mulai wajib diisi" }),
    end_time: z.date({ required_error: "Waktu selesai wajib diisi" }),
    max_attempts: z
      .number({ invalid_type_error: "Maksimal percobaan harus angka" })
      .int("Maksimal percobaan harus bilangan bulat")
      .min(1, "Minimal 1 percobaan"),
    is_open: z.coerce.boolean(),
  })
  .refine((v) => v.start_time < v.end_time, {
    message: "Waktu selesai harus setelah waktu mulai",
    path: ["end_time"],
  });

export type CreateQuizFormData = z.infer<typeof CreateQuizSchema>;
