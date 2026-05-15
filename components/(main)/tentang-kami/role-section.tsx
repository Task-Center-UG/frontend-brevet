import { roleCards } from "./about-data";
import { SectionEyebrow, SectionReveal } from "./about-motion";

export function RoleSection() {
  return (
    <section className="border-b py-24 md:py-32">
      <div className="mx-auto max-w-screen-xl px-6">
        <SectionReveal className="max-w-3xl">
          <SectionEyebrow>Untuk siapa</SectionEyebrow>
          <h2 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-normal md:text-5xl">
            Peserta, guru, dan admin melihat konteks yang mereka butuhkan.
          </h2>
        </SectionReveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {roleCards.map((item, index) => {
            const Icon = item.icon;
            return (
              <SectionReveal key={item.role} delay={index * 0.07}>
                <article className="rounded-lg border bg-card p-6">
                  <div className="flex items-center justify-between gap-3">
                    <Icon className="size-6 text-primary" />
                    <span className="rounded-full border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">
                      {item.role}
                    </span>
                  </div>
                  <h3 className="mt-8 text-xl font-extrabold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.desc}
                  </p>
                </article>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
