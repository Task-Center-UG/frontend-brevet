import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionEyebrow, SectionReveal } from "./about-motion";

export function CtaSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-screen-xl px-6">
        <SectionReveal className="rounded-lg border bg-card p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <SectionEyebrow>Mulai dari jadwal</SectionEyebrow>
              <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-normal md:text-5xl">
                Cari gelombang yang cocok, lalu lanjutkan dari dashboard.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground">
                Kalau masih membandingkan program, mulai dari jadwal. Kalau
                sudah siap belajar, buat akun dan lanjutkan proses pendaftaran.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
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
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
