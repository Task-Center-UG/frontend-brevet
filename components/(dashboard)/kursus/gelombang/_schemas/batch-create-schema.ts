import * as z from "zod";

export const CreateBatchSchema = z
  .object({
    title: z.string().min(3, { message: "Judul wajib diisi" }),
    description: z.string().min(5, { message: "Deskripsi wajib diisi" }),
    registration_start_at: z.date({
      required_error: "Periode mulai pendaftaran wajib diisi",
    }),
    registration_end_at: z.date({
      required_error: "Periode akhir pendaftaran wajib diisi",
    }),
    start_at: z.date({ required_error: "Tanggal mulai wajib diisi" }),
    end_at: z.date({ required_error: "Tanggal selesai wajib diisi" }),
    start_time: z
      .string()
      .min(1, { message: "Jam mulai wajib diisi" })
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "Format jam mulai harus HH:MM",
      }),
    end_time: z
      .string()
      .min(1, { message: "Jam selesai wajib diisi" })
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "Format jam selesai harus HH:MM",
      }),
    room: z.string().min(2, { message: "Ruangan wajib diisi" }),
    quota: z.coerce.number().min(1, { message: "Minimal 1 peserta" }),
    batch_thumbnail: z.string().min(1, { message: "Gambar wajib diunggah" }),
    course_type: z.enum(["online", "offline"], {
      errorMap: () => ({ message: "Tipe kursus wajib dipilih" }),
    }),
    days: z
      .array(z.string())
      .min(1, { message: "Minimal pilih 1 hari" })
      .refine((val) => val.every((v) => typeof v === "string")),
    group_types: z
      .array(z.enum(["mahasiswa_gunadarma", "mahasiswa_non_gunadarma", "umum"]))
      .min(1, { message: "Minimal pilih 1 jenis peserta" }),
  })
  .refine((data) => data.end_at > data.start_at, {
    path: ["end_at"],
    message: "Tanggal selesai harus setelah tanggal mulai",
  })
  .refine(
    (data) => {
      const [startH, startM] = data.start_time.split(":").map(Number);
      const [endH, endM] = data.end_time.split(":").map(Number);
      const startTotal = startH * 60 + startM;
      const endTotal = endH * 60 + endM;
      return endTotal > startTotal;
    },
    {
      path: ["end_time"],
      message: "Jam selesai harus setelah jam mulai",
    }
  );

export type CreateBatchFormData = z.infer<typeof CreateBatchSchema>;
