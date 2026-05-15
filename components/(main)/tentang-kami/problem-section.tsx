import {
  MicroCard,
  MotionSection,
  SectionEyebrow,
  SectionReveal,
} from "./about-motion";

const painPoints = [
  "Tidak yakin harus daftar di gelombang mana.",
  "Sulit tahu pembayaran sudah diverifikasi atau belum.",
  "Materi, tugas, dan quiz terasa terpisah dari jadwal kelas.",
  "Sertifikat perlu bukti validasi yang mudah dibagikan.",
];

export function ProblemSection() {
  return (
    <MotionSection className="border-b py-24 md:py-32">
      <div className="mx-auto grid max-w-screen-xl gap-12 px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:items-start">
        <SectionReveal>
          <SectionEyebrow>Masalah peserta</SectionEyebrow>
          <h2 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-normal md:text-5xl">
            Kelas yang baik tetap terasa berat kalau alurnya tidak jelas.
          </h2>
        </SectionReveal>

        <div className="grid gap-4 md:grid-cols-2">
          {painPoints.map((item, index) => (
            <MicroCard
              key={item}
              delay={0.08 + index * 0.04}
              className="rounded-lg border bg-card p-5 transition-colors hover:border-primary/30 hover:bg-background"
            >
              <span className="text-xs font-bold text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-4 text-base font-bold leading-6">{item}</p>
            </MicroCard>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
