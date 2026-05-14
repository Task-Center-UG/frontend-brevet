import { z } from "zod";

export const VerifyCodeSchema = z.object({
  code: z.string().min(6, "Kode OTP harus 6 digit"),
  token: z.string().nonempty("Token tidak ditemukan"),
});
