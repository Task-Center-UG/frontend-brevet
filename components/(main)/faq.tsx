"use client";

import { faq } from "@/lib/data/faq";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

function FAQItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: easeOutExpo }}
      className={cn(
        "rounded-xl border transition-colors duration-300",
        open
          ? "border-foreground/20 bg-accent/30"
          : "border-transparent bg-accent/50 hover:border-foreground/10"
      )}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base sm:text-lg font-semibold tracking-tight text-foreground pr-2">
          {question}
        </span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25, ease: easeOutExpo }}
          className="shrink-0"
        >
          <Plus className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: easeOutExpo }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-[15px] leading-relaxed text-muted-foreground">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const FAQ = () => {
  return (
    <section id="faq" className="relative py-20 xs:py-28 px-6 overflow-hidden">
      <div className="max-w-screen-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f97316]">
            Bantuan
          </span>
          <h2 className="mt-4 text-3xl xs:text-4xl md:text-5xl !leading-[1.15] font-extrabold tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            Temukan jawaban cepat atas pertanyaan umum seputar program dan
            layanan Tax Center.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faq.map((item, index) => (
            <FAQItem key={item.question} {...item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
