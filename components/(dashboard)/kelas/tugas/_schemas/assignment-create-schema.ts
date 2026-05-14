import { z } from "zod";

export const CreateAssignmentSchema = z.object({
  title: z.string().min(1, "Judul tugas wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  type: z.enum(["file", "essay"], {
    required_error: "Tipe tugas wajib dipilih",
  }),
  start_at: z.date(),
  end_at: z.date(),
  assignment_files: z
    .array(z.union([z.instanceof(File), z.string()]))
    .min(1, "Minimal upload 1 file/gambar tugas")
    .max(10, "Maksimal 10 file/gambar diperbolehkan"),
});

export type CreateAssignmentFormData = z.infer<typeof CreateAssignmentSchema>;
