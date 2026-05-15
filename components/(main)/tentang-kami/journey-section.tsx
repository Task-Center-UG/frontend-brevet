import { cn } from "@/lib/utils";
import { journeySteps } from "./about-data";
import {
  MicroCard,
  MotionSection,
  SectionEyebrow,
  SectionReveal,
} from "./about-motion";

export function JourneySection() {
  return (
    <MotionSection className="border-b bg-muted/25 py-24 md:py-32">
      <div className="mx-auto grid max-w-screen-xl gap-12 px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1fr)] lg:items-center">
        <SectionReveal>
          <SectionEyebrow>Alur pengguna</SectionEyebrow>
          <h2 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-normal md:text-5xl">
            Dari minat sampai selesai belajar, langkahnya tersambung.
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            LMS dibuat supaya peserta tidak berpindah ke banyak tempat untuk
            memahami apa yang harus dilakukan setelah mendaftar.
          </p>
        </SectionReveal>

        <div className="grid gap-3">
          {journeySteps.map((item, index) => (
            <MicroCard
              key={item}
              delay={0.08 + index * 0.04}
              className={cn(
                "rounded-lg border bg-card p-5 transition-colors hover:border-primary/30 hover:bg-background",
                index % 2 === 1 && "lg:ml-8",
              )}
            >
              <div className="flex items-center gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-extrabold text-primary">
                  {index + 1}
                </span>
                <p className="text-sm font-bold leading-6">{item}</p>
              </div>
            </MicroCard>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
