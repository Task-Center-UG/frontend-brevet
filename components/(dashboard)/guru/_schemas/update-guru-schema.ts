import { z } from "zod";

export const updateGuruSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  phone: z.string().min(8, "Nomor telepon tidak valid"),
  avatar: z.string().optional(),
  institution: z.string().min(1, "Asal institusi wajib diisi"),
  origin: z.string().min(1, "Asal daerah wajib diisi"),
  birth_date: z.date({ required_error: "Tanggal lahir wajib diisi" }),
  address: z.string().min(1, "Alamat wajib diisi"),
  role_type: z.enum(["admin", "siswa", "guru"]),
  group_type: z.enum([
    "mahasiswa_gunadarma",
    "mahasiswa_non_gunadarma",
    "umum",
  ]),
});

export type TUpdateGuru = z.infer<typeof updateGuruSchema>;
