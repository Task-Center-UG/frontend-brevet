import Link from "next/link";
import { ArrowUpRight, CheckCircle2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionEyebrow, SectionReveal } from "./about-motion";

export function HeroSection() {
  return (
    <section className="border-b bg-[linear-gradient(135deg,oklch(0.985_0.006_78),oklch(0.955_0.01_86))] py-24 dark:bg-[linear-gradient(135deg,oklch(0.16_0.012_285),oklch(0.21_0.014_285))] md:py-32">
      <div className="mx-auto grid max-w-screen-xl gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
        <SectionReveal>
          <SectionEyebrow>Tentang LMS Brevet</SectionEyebrow>
          <h1 className="mt-6 max-w-4xl text-[2.75rem] font-extrabold leading-[0.98] tracking-normal md:text-[4.5rem] lg:text-[5.6rem]">
            Satu tempat untuk daftar, belajar, bayar, dan validasi sertifikat.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            LMS Brevet Tax Center membantu peserta menjalani kelas brevet dengan
            alur yang jelas. Setiap tahap dibuat terlihat, dari memilih jadwal
            sampai menyelesaikan evaluasi.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button className="rounded-full" asChild>
              <Link href="/jadwal-program">
                Lihat Jadwal
                <ArrowUpRight />
              </Link>
            </Button>
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/auth/sign-up">Daftar Akun</Link>
            </Button>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1} className="rounded-lg border bg-card p-6">
          <ShieldCheck className="size-7 text-primary" />
          <h2 className="mt-6 text-2xl font-extrabold">
            Dibuat untuk mengurangi kebingungan peserta.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Peserta tidak perlu menebak status pembayaran, jadwal pertemuan,
            tugas yang aktif, atau sertifikat yang bisa dicek.
          </p>
          <div className="mt-6 grid gap-3">
            {["Pendaftaran", "Pembayaran", "Pembelajaran"].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-md border bg-background px-4 py-3 text-sm font-semibold"
              >
                {item}
                <CheckCircle2 className="size-4 text-primary" />
              </div>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
