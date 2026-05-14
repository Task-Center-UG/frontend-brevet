import { z } from "zod";

export const AssignmentFileAnswerSchema = z.object({
  files: z
    .array(z.union([z.instanceof(File), z.string()]))
    .min(1, "Minimal unggah 1 file")
    .max(10, "Maksimal 10 file"),
});

export type AssignmentFileAnswerFormData = z.infer<
  typeof AssignmentFileAnswerSchema
>;
