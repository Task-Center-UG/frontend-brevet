import { z } from "zod";

export const createAdminSchema = z
  .object({
    name: z.string().min(1, "Nama wajib diisi"),
    phone: z.string().min(8, "Nomor telepon tidak valid"),
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirm_password: z
      .string()
      .min(6, "Konfirmasi password minimal 6 karakter"),
    avatar: z.string().optional(),
    institution: z.string().min(1, "Asal institusi wajib diisi"),
    origin: z.string().min(1, "Asal daerah wajib diisi"),
    birth_date: z.date({ required_error: "Tanggal lahir wajib diisi" }),
    address: z.string().min(1, "Alamat wajib diisi"),
    role_type: z.literal("admin"),
    group_type: z.enum([
      "mahasiswa_gunadarma",
      "mahasiswa_non_gunadarma",
      "umum",
    ]),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Password tidak cocok",
  });

export type TCreateAdmin = z.infer<typeof createAdminSchema>;
