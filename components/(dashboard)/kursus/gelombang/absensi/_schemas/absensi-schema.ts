import { z } from "zod";

export const absensiSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      pertemuan: z.array(z.boolean()),
    })
  ),
});

export type AbsensiFormData = z.infer<typeof absensiSchema>;
