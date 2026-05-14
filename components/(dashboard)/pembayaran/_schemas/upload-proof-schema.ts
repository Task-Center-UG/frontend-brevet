import { z } from "zod";

export const UploadPaymentSchema = z.object({
  payment_proof_url: z.string().min(1, "Bukti pembayaran wajib diunggah."),
  buyer_bank_account_name: z
    .string()
    .min(1, "Nama pemilik rekening wajib diisi."),
  buyer_bank_account_number: z
    .string()
    .min(5, "Nomor rekening wajib diisi.")
    .regex(/^\d+$/, "Nomor rekening harus berupa angka."),
});

export type UploadPaymentFormData = z.infer<typeof UploadPaymentSchema>;
