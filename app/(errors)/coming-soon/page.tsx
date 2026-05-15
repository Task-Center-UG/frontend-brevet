"use client";

import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  CalendarClock,
  Home,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

import Footer from "@/components/(main)/footer";
import Navbar from "@/components/(main)/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ComingSoonPage() {
  return (
    <div>
      <Navbar />
      <main className="w-full overflow-hidden bg-background text-foreground">
        <section className="relative border-b bg-[linear-gradient(135deg,oklch(0.985_0.006_78),oklch(0.955_0.01_86))] dark:bg-[linear-gradient(135deg,oklch(0.16_0.012_285),oklch(0.21_0.014_285))]">
          <div className="absolute inset-x-0 top-0 h-px bg-primary/40" />
          <div className="mx-auto grid max-w-screen-xl gap-10 px-6 py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
            <motion.div
              className="flex max-w-5xl flex-col gap-7"
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeOutExpo }}
            >
              <Badge
                variant="outline"
                className="w-fit rounded-full border-primary/20 bg-primary/10 px-3 py-1 text-primary"
              >
                <Sparkles />
                Segera hadir
              </Badge>
              <div className="flex flex-col gap-5">
                <h1 className="text-[2.75rem] font-extrabold leading-[0.98] tracking-normal md:text-[4.5rem] lg:text-[5.8rem]">
                  Halaman ini sedang disiapkan.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                  Fitur atau halaman tujuan belum dibuka untuk publik. Kamu
                  tetap bisa menjelajahi program brevet, jadwal, berita, dan
                  validasi sertifikat yang sudah tersedia.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button className="rounded-full" asChild>
                  <Link href="/jadwal-program">
                    Lihat Jadwal Program
                    <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
                <Button variant="outline" className="rounded-full" asChild>
                  <Link href="/">
                    <Home data-icon="inline-start" />
                    Beranda
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="overflow-hidden rounded-xl border bg-card p-6 shadow-2xl shadow-primary/10"
              initial={{ opacity: 0, y: 34, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: easeOutExpo }}
            >
              <div className="flex min-h-[360px] flex-col justify-between rounded-lg border bg-background p-6">
                <div className="flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CalendarClock className="size-6" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Coming soon
                  </span>
                </div>
                <div className="flex flex-col gap-5">
                  <BellRing className="size-8 text-primary" />
                  <p className="text-3xl font-extrabold leading-tight">
                    Kami akan menampilkan konten baru saat sudah siap dirilis.
                  </p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Placeholder umum untuk fitur yang belum dirilis.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
