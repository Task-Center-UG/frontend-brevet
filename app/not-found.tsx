import Link from "next/link";
import { ArrowLeft, Compass, Home, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,oklch(0.985_0.006_78),oklch(0.955_0.01_86))] text-foreground dark:bg-[linear-gradient(135deg,oklch(0.16_0.012_285),oklch(0.21_0.014_285))]">
      <section className="mx-auto grid min-h-screen max-w-screen-xl gap-10 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
        <div className="flex max-w-4xl flex-col gap-7">
          <div className="flex w-fit items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <SearchX className="size-4" />
            404
          </div>
          <div className="flex flex-col gap-5">
            <h1 className="text-[2.75rem] font-extrabold leading-[0.98] tracking-normal md:text-[4.5rem] lg:text-[6rem]">
              Halaman tidak ditemukan.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              Alamat yang kamu buka tidak tersedia, sudah dipindahkan, atau
              tidak lagi aktif di LMS Tax Center Gunadarma.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="rounded-full" asChild>
              <Link href="/">
                <Home data-icon="inline-start" />
                Kembali ke Beranda
              </Link>
            </Button>
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/jadwal-program">
                Lihat Jadwal Program
                <ArrowLeft className="size-4 rotate-180" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-xl shadow-primary/8">
          <div className="flex min-h-[320px] flex-col justify-between rounded-lg border bg-background p-6">
            <Compass className="size-10 text-primary" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Navigasi
              </p>
              <p className="mt-3 text-3xl font-extrabold leading-tight">
                Ambil jalur resmi, kembali ke halaman utama.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NotFoundPage;
