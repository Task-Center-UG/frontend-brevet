"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function SectionReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 34 }}
      animate={
        reduceMotion
          ? { opacity: 1 }
          : inView
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 34 }
      }
      transition={{
        duration: reduceMotion ? 0 : 0.65,
        delay,
        ease: easeOutExpo,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MotionSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0.96, y: 8 }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: easeOutExpo }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export function MicroCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-80px" }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{
        duration: reduceMotion ? 0 : 0.48,
        delay,
        ease: easeOutExpo,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionEyebrow({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
      <motion.span
        className="h-1.5 w-1.5 rounded-full bg-primary"
        animate={
          reduceMotion
            ? { scale: 1, opacity: 1 }
            : { scale: [1, 1.4, 1], opacity: [0.72, 1, 0.72] }
        }
        transition={{
          duration: reduceMotion ? 0 : 2.2,
          repeat: Infinity,
          ease: easeOutExpo,
        }}
      />
      {children}
    </span>
  );
}
