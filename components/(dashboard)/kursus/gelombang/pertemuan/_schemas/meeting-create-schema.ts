import { z } from "zod";

export const MeetingFormSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  description: z.string().optional(),
  type: z.enum(["basic", "exam"], {
    required_error: "Tipe pertemuan wajib dipilih",
  }),
  start_at: z.date({ required_error: "Tanggal dibuka wajib diisi" }),
  end_at: z.date({ required_error: "Tanggal ditutup wajib diisi" }),
  assigned_teacher_ids: z.array(z.string()).optional(),
});

export type MeetingFormData = z.infer<typeof MeetingFormSchema>;
