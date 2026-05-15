"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Clock3,
  Instagram,
  MailIcon,
  MapPinIcon,
  MessageCircle,
  Send,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const ContactSchema = z.object({
  fullName: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Format email belum valid"),
  subject: z.string().min(4, "Topik minimal 4 karakter"),
  message: z.string().min(12, "Pesan minimal 12 karakter"),
  acceptTerms: z
    .boolean()
    .refine((value) => value, "Konfirmasi ini wajib dicentang"),
});

const contactChannels = [
  {
    icon: MailIcon,
    title: "Email",
    desc: "Untuk pertanyaan detail terkait program, pembayaran, atau sertifikat.",
    href: "mailto:zidanindratama03@gmail.com",
    label: "zidanindratama03@gmail.com",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    desc: "Untuk bantuan cepat saat memilih jadwal atau cek status pendaftaran.",
    href: "https://wa.me/6285141760017",
    label: "+62 851 4176 0017",
  },
  {
    icon: MapPinIcon,
    title: "Kantor",
    desc: "Datang langsung jika butuh arahan administratif di kampus.",
    href: "https://g.co/kgs/hNhkaiy",
    label: "Kampus F4 Universitas Gunadarma, Depok",
  },
  {
    icon: Instagram,
    title: "Instagram",
    desc: "Ikuti pengumuman program dan aktivitas Tax Center.",
    href: "https://instagram.com/taxcenter.ug",
    label: "@taxcenter.ug",
  },
];

const supportTopics = [
  "Pendaftaran akun dan verifikasi email",
  "Pilihan jadwal, kelas, dan gelombang",
  "Pembayaran dan upload bukti transfer",
  "Akses materi, tugas, quiz, nilai, dan sertifikat",
];

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-70px" });
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? false : { opacity: 0, y: 26 }}
      animate={
        reduceMotion || inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }
      }
      transition={{ duration: 0.58, delay, ease: easeOutExpo }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const Help = () => {
  const form = useForm<z.infer<typeof ContactSchema>>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
      acceptTerms: false,
    },
  });

  const onSubmit = (data: z.infer<typeof ContactSchema>) => {
    console.log(data);
    toast.success("Pesan tersimpan", {
      description: "Tim Tax Center dapat menindaklanjuti melalui email kamu.",
    });
    form.reset();
  };

  return (
    <main className="overflow-hidden bg-background text-foreground">
      <section className="border-b bg-[linear-gradient(135deg,oklch(0.985_0.006_78),oklch(0.955_0.008_78))] dark:bg-[linear-gradient(135deg,oklch(0.16_0.012_285),oklch(0.21_0.014_285))]">
        <div className="mx-auto grid max-w-screen-xl gap-10 px-6 py-20 md:py-24 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <ShieldCheck className="size-4" />
              Bantuan Tax Center
            </span>
            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-[1.02] md:text-6xl">
              Dapatkan jawaban tanpa menebak alur LMS.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              Cari bantuan untuk pendaftaran, pembayaran, akses kelas, tugas,
              quiz, nilai, dan validasi sertifikat. Mulai dari topik yang paling
              dekat dengan kebutuhanmu.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="rounded-full" variant="orange" asChild>
                <Link href="#kontak">
                  Hubungi Admin
                  <Send data-icon="inline-end" />
                </Link>
              </Button>
              <Button className="rounded-full" variant="outline" asChild>
                <Link href="/jadwal-program">
                  Lihat Jadwal
                  <ArrowUpRight data-icon="inline-end" />
                </Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center justify-between gap-4 border-b pb-5">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">
                    Respon operasional
                  </p>
                  <p className="mt-1 text-2xl font-extrabold">Hari kerja</p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Clock3 className="size-6" />
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {supportTopics.map((topic, index) => (
                  <motion.div
                    key={topic}
                    className="flex items-start gap-3 rounded-md border bg-background px-4 py-3 text-sm font-semibold"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.18, ease: easeOutExpo }}
                  >
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                      {index + 1}
                    </span>
                    {topic}
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="kontak" className="border-b py-20 md:py-28">
        <div className="mx-auto grid max-w-screen-xl gap-12 px-6 lg:grid-cols-[minmax(320px,0.8fr)_minmax(0,1fr)]">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Jalur kontak
            </span>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight md:text-5xl">
              Pilih kanal yang paling sesuai dengan kebutuhanmu.
            </h2>
            <div className="mt-10 divide-y rounded-lg border bg-card">
              {contactChannels.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    className="group grid gap-4 p-5 sm:grid-cols-[48px_minmax(0,1fr)]"
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, margin: "-80px" }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.04,
                      ease: easeOutExpo,
                    }}
                  >
                    <div className="flex size-12 items-center justify-center rounded-md bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {item.desc}
                      </p>
                      <Link
                        className="mt-3 inline-flex max-w-full items-center gap-2 text-sm font-semibold text-foreground underline-offset-4 hover:underline"
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                      >
                        <span className="truncate">{item.label}</span>
                        <ArrowUpRight className="size-4 shrink-0 text-primary" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="rounded-lg border bg-card p-6 md:p-8"
              >
                <div className="max-w-2xl">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Form bantuan
                  </span>
                  <h2 className="mt-4 text-2xl font-extrabold md:text-3xl">
                    Kirim pertanyaan dengan konteks yang jelas.
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Sertakan topik dan detail singkat supaya admin bisa membaca
                    kebutuhanmu tanpa bolak-balik bertanya.
                  </p>
                </div>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama lengkap</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama kamu" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email aktif</FormLabel>
                        <FormControl>
                          <Input placeholder="nama@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Topik bantuan</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Contoh: pembayaran belum terkonfirmasi"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Detail pesan</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={7}
                            placeholder="Tulis kendala, nama program, atau nomor transaksi jika ada."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <div className="flex items-start gap-3 rounded-md border bg-background p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-0.5"
                            />
                          </FormControl>
                          <div className="space-y-1">
                            <FormLabel className="font-normal leading-6">
                              Saya memastikan data kontak sudah benar dan bisa
                              digunakan untuk tindak lanjut.
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="mt-6 w-full rounded-md"
                  variant="orange"
                >
                  Kirim Pesan
                  <Send data-icon="inline-end" />
                </Button>
              </form>
            </Form>
          </Reveal>
        </div>
      </section>
    </main>
  );
};

export default Help;
