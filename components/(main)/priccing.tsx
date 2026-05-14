"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { plans } from "@/lib/data/plans";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { useRef } from "react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

function PricingCard({
  plan,
  index,
}: {
  plan: (typeof plans)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-60px" });
  const isPopular = plan.isPopular;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.65, delay: index * 0.12, ease: easeOutExpo }}
      className={cn(
        "relative rounded-2xl border bg-card p-8 md:p-10 transition-all duration-300",
        isPopular
          ? "border-[#f97316]/30 shadow-[0_8px_30px_-10px_rgba(249,115,22,0.12)]"
          : "border-border hover:border-foreground/15 hover:shadow-lg hover:-translate-y-1"
      )}
    >
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Badge className="bg-[#f97316] text-white hover:bg-[#f97316] gap-1 px-4 py-1.5 text-xs font-semibold tracking-wide rounded-full">
            PALING DIMINATI
          </Badge>
        </div>
      )}

      <h3 className="text-base font-medium text-muted-foreground uppercase tracking-wide">
        {plan.name}
      </h3>
      <p className="mt-4 text-4xl font-extrabold tracking-tight text-foreground">
        {plan.price}
      </p>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        {plan.description}
      </p>

      <div className="my-8 h-px bg-border" />

      <ul className="space-y-4">
        {plan.features.map((feature, fIndex) => (
          <motion.li
            key={feature}
            initial={{ opacity: 0, x: -10 }}
            animate={
              isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }
            }
            transition={{
              duration: 0.4,
              delay: index * 0.12 + 0.3 + fIndex * 0.07,
              ease: easeOutExpo,
            }}
            className="flex items-start gap-3 text-[15px] text-muted-foreground"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f97316]/10">
              <Check className="h-3 w-3 text-[#f97316]" />
            </span>
            <span className="leading-snug">{feature}</span>
          </motion.li>
        ))}
      </ul>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: easeOutExpo }}
        className="mt-10"
      >
        <Button
          variant={isPopular ? "default" : "outline"}
          size="lg"
          className={cn(
            "w-full rounded-full font-semibold transition-colors duration-200 h-12",
            isPopular
              ? ""
              : "border-foreground/20 hover:border-foreground/40 hover:bg-accent"
          )}
        >
          {plan.buttonText}
        </Button>
      </motion.div>
    </motion.div>
  );
}

const Pricing = () => {
  return (
    <section id="pricing" className="relative py-28 md:py-36 px-6 bg-muted/20">
      <div className="max-w-screen-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="text-center mb-20"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f97316]">
            Investasi Karir
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl !leading-[1.15] font-extrabold tracking-tight">
            Biaya Pendaftaran
          </h2>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
            Investasi terbaik untuk masa depan karir perpajakan Anda.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 items-stretch gap-8">
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
