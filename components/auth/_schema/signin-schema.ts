import { z } from "zod";

export const SignInSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z
    .string({ required_error: "Password wajib diisi" })
    .min(6, "Password minimal 6 karakter"),
});
