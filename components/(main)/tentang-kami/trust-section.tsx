import { BadgeCheck, CheckCircle2 } from "lucide-react";

import { trustPoints } from "./about-data";
import {
  MicroCard,
  MotionSection,
  SectionEyebrow,
  SectionReveal,
} from "./about-motion";

export function TrustSection() {
  return (
    <MotionSection className="border-b py-24 md:py-32">
      <div className="mx-auto grid max-w-screen-xl gap-12 px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:items-center">
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

        <SectionReveal
          delay={0.1}
          className="rounded-lg border bg-card p-6 transition-colors hover:border-primary/30"
        >
          <div className="grid gap-4">
            {trustPoints.map((item, index) => (
              <MicroCard
                key={item}
                delay={0.12 + index * 0.04}
                className="flex items-start gap-3 rounded-md p-1"
              >
                <CheckCircle2 className="mt-1 size-5 shrink-0 text-primary" />
                <p className="text-sm leading-6 text-muted-foreground">
                  {item}
                </p>
              </MicroCard>
            ))}
          </div>
        </SectionReveal>
      </div>
    </MotionSection>
  );
}
