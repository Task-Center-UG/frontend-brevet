import { z } from "zod";

export const updateProfileSchema = z
  .object({
    name: z.string().min(1, "Nama wajib diisi"),
    phone: z.string().min(8, "Nomor telepon tidak valid"),
    avatar: z.string().optional(),
    institution: z.string().min(1, "Asal institusi wajib diisi"),
    origin: z.string().min(1, "Asal daerah wajib diisi"),
    birth_date: z.date({ required_error: "Tanggal lahir wajib diisi" }),
    address: z.string().min(1, "Alamat wajib diisi"),
    group_type: z.enum([
      "mahasiswa_gunadarma",
      "mahasiswa_non_gunadarma",
      "umum",
    ]),
    role_type: z.enum(["admin", "siswa", "guru"]),
    nim: z.string().optional(),
    nim_proof: z.string().optional(),
    nik: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role_type === "siswa") {
      if (
        data.group_type === "mahasiswa_gunadarma" ||
        data.group_type === "mahasiswa_non_gunadarma"
      ) {
        if (!data.nim) {
          ctx.addIssue({
            path: ["nim"],
            code: z.ZodIssueCode.custom,
            message: "NIM wajib diisi untuk mahasiswa.",
          });
        }

        if (!data.nim_proof) {
          ctx.addIssue({
            path: ["nim_proof"],
            code: z.ZodIssueCode.custom,
            message: "Bukti NIM wajib diunggah untuk mahasiswa.",
          });
        }
      }

      if (data.group_type === "umum" && !data.nik) {
        ctx.addIssue({
          path: ["nik"],
          code: z.ZodIssueCode.custom,
          message: "NIK wajib diisi untuk peserta umum.",
        });
      }
    }
  });

export type TUpdateProfile = z.infer<typeof updateProfileSchema>;
