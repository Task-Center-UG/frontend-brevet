import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import type { ReactNode } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: AuthShellProps) {
  return (
    <main className="min-h-svh bg-[linear-gradient(135deg,oklch(0.985_0.006_78),oklch(0.955_0.01_86))] px-5 py-6 text-foreground dark:bg-[linear-gradient(135deg,oklch(0.16_0.012_285),oklch(0.21_0.014_285))] md:px-8">
      <div className="mx-auto flex min-h-[calc(100svh-3rem)] w-full max-w-6xl flex-col">
        <header className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold transition hover:bg-background/70"
          >
            <ImageWithFallback
              src="/logo-tc.png"
              alt="Logo Tax Center"
              width={150}
              height={50}
              className="block h-10 w-auto dark:hidden"
              priority
            />
            <ImageWithFallback
              src="/logo-dark-tc.png"
              alt="Logo Tax Center"
              width={150}
              height={50}
              className="hidden h-10 w-auto dark:block"
              priority
            />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md border bg-background/80 px-3 py-2 text-sm font-medium shadow-xs transition hover:bg-background"
          >
            <ArrowLeft className="size-4" />
            Beranda
          </Link>
        </header>

        <section className="grid flex-1 gap-8 py-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,520px)] lg:items-center lg:py-14">
          <aside className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <ShieldCheck className="size-4" />
              {eyebrow}
            </div>
            <h1 className="mt-6 text-[2.75rem] font-extrabold leading-[0.98] tracking-normal md:text-[4.5rem]">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
              {description}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["Data resmi", "Akses kelas", "Sertifikat"].map((item) => (
                <div key={item} className="rounded-md border bg-background/75 p-4">
                  <p className="text-sm font-bold">{item}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Terhubung ke alur Brevet Tax Center.
                  </p>
                </div>
              ))}
            </div>
          </aside>

          <div className="rounded-lg border bg-card p-5 shadow-xl shadow-primary/6 md:p-6">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
