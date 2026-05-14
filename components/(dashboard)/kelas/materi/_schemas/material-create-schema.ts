import { z } from "zod";

export const CreateMaterialSchema = z.object({
  title: z.string().min(1, "Judul materi wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  url: z.string().min(1, "File materi wajib diunggah"),
});

export type CreateMaterialFormData = z.infer<typeof CreateMaterialSchema>;
