"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Hero() {
  return (
    <section className="relative w-full border-b overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-6 py-24 md:py-32 lg:py-40">
        <div className="max-w-4xl">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f97316] mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
            Terbuka Pendaftaran Gelombang Terbaru
          </motion.span>

          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[8rem] font-extrabold !leading-[0.95] tracking-tight">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: easeOutExpo }}
            >
              Jadilah Ahli
            </motion.span>
            <motion.span
              className="block text-[#f97316]"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: easeOutExpo }}
            >
              Pajak
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: easeOutExpo }}
            >
              Bersertifikat
            </motion.span>
          </h1>

          <motion.p
            className="mt-8 text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: easeOutExpo }}
          >
            Pelatihan brevet pajak resmi Universitas Gunadarma. Kurikulum
            praktis, pengajar berpengalaman, dan sertifikasi diakui industri.
          </motion.p>

          <motion.div
            className="mt-12 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: easeOutExpo }}
          >
            <Button
              size="lg"
              className="rounded-full text-base px-8 h-13 gap-2 group"
              asChild
            >
              <Link href="/auth/sign-up">
                Daftar Sekarang
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full text-base px-8 h-13 border-foreground/15 hover:bg-accent"
              asChild
            >
              <Link href="/jadwal-program">Lihat Jadwal Kursus</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Micro decorative dot pattern */}
      <div className="absolute top-20 right-20 hidden lg:block">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: easeOutExpo }}
          className="grid grid-cols-4 gap-3"
        >
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-foreground/10"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.9 + i * 0.03,
                ease: easeOutExpo,
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
