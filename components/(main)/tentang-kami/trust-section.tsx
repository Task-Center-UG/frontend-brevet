import { BadgeCheck, CheckCircle2 } from "lucide-react";

import { trustPoints } from "./about-data";
import { SectionEyebrow, SectionReveal } from "./about-motion";

export function TrustSection() {
  return (
    <section className="border-b py-24 md:py-32">
      <div className="mx-auto grid max-w-screen-xl gap-12 px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:items-start">
        <SectionReveal>
          <SectionEyebrow>Rasa aman</SectionEyebrow>
          <h2 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-normal md:text-5xl">
            Data belajar dan pembayaran lebih mudah dipercaya.
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Sistem membantu mengurangi percakapan berulang karena status penting
            tampil langsung di dashboard.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.1} className="rounded-lg border bg-card p-6">
          <BadgeCheck className="size-6 text-primary" />
          <div className="mt-6 grid gap-4">
            {trustPoints.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 size-5 shrink-0 text-primary" />
                <p className="text-sm leading-6 text-muted-foreground">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
