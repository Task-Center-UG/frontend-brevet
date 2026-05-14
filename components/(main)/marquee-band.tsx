"use client";

import { motion } from "framer-motion";

const items = [
  "Brevet Pajak A & B",
  "Brevet Pajak C",
  "PPL Workshop",
  "Sertifikasi Resmi",
  "Kurikulum Praktis",
  "Pengajar Berpengalaman",
  "Kelas Online & Offline",
  "Komunitas Alumni",
];

export default function MarqueeBand() {
  return (
    <section className="w-full py-6 border-y bg-background overflow-hidden">
      <motion.div
        className="flex w-max gap-12"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="text-sm font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap flex items-center gap-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
            {item}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
