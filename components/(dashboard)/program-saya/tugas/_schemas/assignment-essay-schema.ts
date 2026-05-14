import * as z from "zod";

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const EssayAnswerSchema = z.object({
  essay_text: z
    .string()
    .min(1, { message: "Jawaban tidak boleh kosong." })
    .refine((v) => stripHtml(v).length >= 20, {
      message: "Jawaban minimal 20 karakter.",
    })
    .refine((v) => v.length <= 50_000, {
      message: "Jawaban terlalu panjang (maks 50.000 karakter).",
    }),
});

export type EssayAnswerFormData = z.infer<typeof EssayAnswerSchema>;
