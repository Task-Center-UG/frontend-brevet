import { z } from "zod";

export const UpdateStatusSchema = z.object({
  payment_status: z.enum(["paid", "rejected"], {
    required_error: "Status pembayaran wajib dipilih",
  }),
});

export type UpdateStatusFormData = z.infer<typeof UpdateStatusSchema>;
