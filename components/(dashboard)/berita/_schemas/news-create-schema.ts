import * as z from "zod";

export const CreateNewsSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: "Judul harus memiliki minimal 5 karakter",
    })
    .max(150, { message: "Deskripsi singkat maksimal 150 karakter" }),
  short_description: z
    .string()
    .min(10, { message: "Deskripsi singkat minimal 10 karakter" })
    .max(150, { message: "Deskripsi singkat maksimal 150 karakter" }),
  full_description: z.string().min(20, {
    message: "Deskripsi lengkap minimal 20 karakter",
  }),
  image: z.string().min(1, { message: "Gambar wajib diunggah" }),
});

export type CreateNewsFormData = z.infer<typeof CreateNewsSchema>;
