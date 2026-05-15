import { platformFeatures } from "./about-data";
import {
  MicroCard,
  MotionSection,
  SectionEyebrow,
  SectionReveal,
} from "./about-motion";

export function FeatureSection() {
  return (
    <MotionSection className="border-b bg-muted/25 py-24 md:py-32">
      <div className="mx-auto max-w-screen-xl px-6">
        <SectionReveal className="max-w-3xl">
          <SectionEyebrow>Fitur LMS</SectionEyebrow>
          <h2 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-normal md:text-5xl lg:text-6xl">
            Semua fitur diarahkan ke satu tujuan: peserta tahu harus melakukan
            apa.
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Fitur di dalam LMS bukan hanya daftar menu. Setiap fitur membantu
            peserta memahami status, akses, dan progres belajar.
          </p>
        </SectionReveal>

        <div className="mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {platformFeatures.map((item, index) => {
            const Icon = item.icon;
            return (
              <MicroCard
                key={item.title}
                delay={index * 0.04}
                className="h-full rounded-lg border bg-card p-5 transition-colors hover:border-primary/30 hover:bg-background"
              >
                <Icon className="size-5 text-primary" />
                <h3 className="mt-6 text-base font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.desc}
                </p>
              </MicroCard>
            );
          })}
        </div>
      </div>
    </MotionSection>
  );
}
