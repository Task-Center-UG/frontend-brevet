"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useGetData } from "@/hooks/use-get-data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { TCourseImage } from "@/components/(dashboard)/kursus/_types/couurse-type";
import NotFoundContent from "../not-found-content";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Layers3,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  courseSlug: string;
};

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const stripHtml = (value?: string) =>
  value
    ? value
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    : "";

function ProgramSkeleton() {
  return (
    <section className="w-full bg-background pt-16 md:pt-24">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-8 px-6 pb-24">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-24 w-full max-w-5xl" />
        <Skeleton className="h-6 w-full max-w-3xl" />
        <Skeleton className="min-h-[440px] w-full rounded-xl" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function CourseDetailPage({ courseSlug }: Props) {
  const { data, isLoading } = useGetData({
    queryKey: ["courses", courseSlug],
    dataProtected: `courses/${courseSlug}`,
  });

  const course = data?.data?.data;

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);

  if (isLoading) return <ProgramSkeleton />;

  if (!course) {
    return (
      <div className="mx-auto max-w-screen-md px-6 py-24 md:py-32">
        <NotFoundContent message="Kursus tidak ditemukan." />
      </div>
    );
  }

  const images = course.course_images?.length
    ? course.course_images
    : [{ image_url: "/placeholder.jpeg" }];

  const heroSummary =
    stripHtml(course.short_description) ||
    stripHtml(course.description) ||
    "Program brevet pajak resmi Tax Center Universitas Gunadarma dengan struktur belajar yang rapi dan relevan untuk kebutuhan profesional.";

  const programFacts = [
    {
      icon: BookOpen,
      label: "Fokus belajar",
      value: "Pajak praktis dan terapan",
    },
    {
      icon: Layers3,
      label: "Alur program",
      value: "Materi, tugas, quiz, sertifikat",
    },
    {
      icon: CalendarDays,
      label: "Jadwal",
      value: "Pilih gelombang aktif",
    },
  ];

  const tabItems = [
    {
      value: "tentang",
      label: "Tentang Kursus",
      content: course.description,
    },
    {
      value: "learning",
      label: "Hasil Pembelajaran",
      content: course.learning_outcomes,
    },
    {
      value: "achievements",
      label: "Pencapaian",
      content: course.achievements,
    },
  ];

  return (
    <section className="w-full overflow-hidden bg-background text-foreground">
      <div className="relative border-b bg-[linear-gradient(135deg,oklch(0.985_0.006_78),oklch(0.955_0.01_86))] dark:bg-[linear-gradient(135deg,oklch(0.16_0.012_285),oklch(0.21_0.014_285))]">
        <div className="absolute inset-x-0 top-0 h-px bg-primary/40" />
        <div className="mx-auto flex max-w-screen-xl flex-col gap-10 px-6 pb-16 pt-16 md:pb-20 md:pt-24">
          <motion.div
            className="flex max-w-6xl flex-col gap-6"
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="rounded-full border-primary/20 bg-primary/10 px-3 py-1 text-primary">
                <Sparkles />
                Program Tax Center
              </Badge>
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                Brevet Pajak
              </Badge>
            </div>
            <div className="flex flex-col gap-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Tax Center Gunadarma
              </p>
              <h1 className="text-[2.75rem] font-extrabold leading-[0.98] tracking-normal md:text-[4.5rem] lg:text-[6rem]">
                {course.title}
              </h1>
              <p className="max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
                {heroSummary}
              </p>
            </div>
          </motion.div>

          <motion.div
            className="relative overflow-hidden rounded-xl border bg-muted shadow-2xl shadow-primary/10"
            initial={{ opacity: 0, y: 38, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.82, delay: 0.1, ease: easeOutExpo }}
          >
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {images.map((img: TCourseImage, index: number) => (
                  <CarouselItem key={index}>
                    <div className="relative min-h-[360px] md:min-h-[540px] lg:min-h-[640px]">
                      <ImageWithFallback
                        src={img.image_url}
                        alt={`${course.title} ${index + 1}`}
                        fill
                        priority={index === 0}
                        className="object-cover transition duration-700 hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-foreground/72 via-foreground/10 to-transparent" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-5 p-5 text-background md:p-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">
                  Jalur belajar resmi
                </p>
                <p className="mt-2 text-2xl font-extrabold leading-tight md:text-4xl">
                  Pilih gelombang yang sesuai jadwalmu.
                </p>
              </div>
              <Button className="h-12 rounded-full px-6" asChild>
                <Link href={`/jadwal-program?slug=${courseSlug}`}>
                  Lihat Jadwal Kursus
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2 md:w-[420px]">
              {images.map((img: TCourseImage, index: number) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-lg border transition duration-300 hover:-translate-y-0.5",
                    current === index + 1
                      ? "border-primary opacity-100"
                      : "border-border opacity-55"
                  )}
                  aria-label={`Lihat gambar ${index + 1}`}
                >
                  <ImageWithFallback
                    src={img.image_url}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="grid gap-3 md:grid-cols-3">
            {programFacts.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  className="group flex min-h-28 flex-col justify-between rounded-xl border bg-card/80 p-4 shadow-xs transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.55,
                    delay: 0.15 + index * 0.08,
                    ease: easeOutExpo,
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-muted-foreground">
                      {item.label}
                    </span>
                    <Icon className="size-4 text-primary transition-transform duration-300 group-hover:rotate-6" />
                  </div>
                  <p className="text-sm font-semibold leading-6">{item.value}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-screen-xl gap-10 px-6 py-16 lg:grid-cols-[280px_minmax(0,1fr)] lg:py-24">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-xl border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Program
            </p>
            <h2 className="mt-2 text-2xl font-extrabold">Isi kursus</h2>
            <Separator className="my-5" />
            <div className="flex flex-col gap-3">
              {tabItems.map((item) => (
                <div key={item.value} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                  <p className="text-sm leading-6 text-muted-foreground">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <Tabs defaultValue="tentang" className="min-w-0">
          <ScrollArea className="w-full overflow-auto whitespace-nowrap">
            <TabsList className="mb-8 h-auto justify-start rounded-full border bg-card p-1">
              {tabItems.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className="rounded-full px-4 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {tabItems.map((item) => (
            <TabsContent key={item.value} value={item.value}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: easeOutExpo }}
                className="rounded-xl border bg-card p-6 md:p-8"
              >
                <article
                  className="prose max-w-none dark:prose-invert prose-p:leading-8 prose-headings:font-bold prose-a:text-primary"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
