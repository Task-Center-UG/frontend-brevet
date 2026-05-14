"use client";

import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useGetData } from "@/hooks/use-get-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import NotFoundContent from "../not-found-content";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Newspaper,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  newsSlug: string;
};

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const stripHtml = (value?: string) =>
  value
    ? value
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    : "";

const readingMinutes = (html?: string) => {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
};

const formatDate = (value?: string) => {
  if (!value) return "Tax Center Gunadarma";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Tax Center Gunadarma";
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const NewsDetail = ({ newsSlug }: Props) => {
  const { data, isLoading } = useGetData({
    queryKey: ["blog-detail", newsSlug],
    dataProtected: `blogs/${newsSlug}`,
  });

  const news = data?.data?.data;

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: news?.title || "Berita", url });
        toast("Berhasil!", { description: "Tautan berita dibagikan." });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast("Berhasil!", { description: "Tautan berita tersalin." });
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-screen-xl flex-col gap-8 px-6 py-24 md:py-32">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-24 w-full max-w-4xl" />
        <Skeleton className="min-h-[420px] w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="mx-auto max-w-screen-md px-6 py-24 md:py-32">
        <NotFoundContent message="Berita tidak ditemukan." />
      </div>
    );
  }

  const excerpt = stripHtml(news.content).slice(0, 190);

  return (
    <article className="w-full overflow-hidden bg-background text-foreground">
      <div className="relative border-b bg-[linear-gradient(135deg,oklch(0.985_0.006_78),oklch(0.955_0.01_86))] dark:bg-[linear-gradient(135deg,oklch(0.16_0.012_285),oklch(0.21_0.014_285))]">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-10 px-6 pb-16 pt-16 md:pb-20 md:pt-24">
          <motion.div
            className="flex max-w-5xl flex-col gap-6"
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className="rounded-full border-primary/20 bg-primary/10 px-3 py-1 text-primary"
              >
                <Newspaper />
                Artikel
              </Badge>
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {readingMinutes(news.content)} menit baca
              </Badge>
            </div>
            <h1 className="text-[2.75rem] font-extrabold leading-[0.98] tracking-normal md:text-[4.5rem] lg:text-[5.5rem]">
              {news.title}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
              {excerpt}
              {excerpt.length >= 190 ? "..." : ""}
            </p>
          </motion.div>

          <motion.div
            className="relative min-h-[360px] overflow-hidden rounded-xl border bg-muted shadow-2xl shadow-primary/10 md:min-h-[540px] lg:min-h-[620px]"
            initial={{ opacity: 0, y: 38, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.82, delay: 0.1, ease: easeOutExpo }}
          >
            <ImageWithFallback
              src={news.image}
              alt={news.title}
              fill
              priority
              className="object-cover transition duration-700 hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-foreground/72 via-foreground/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-5 p-5 text-background md:p-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">
                  Dipublikasikan
                </p>
                <p className="mt-2 text-2xl font-extrabold leading-tight md:text-4xl">
                  {formatDate(news.created_at)}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  className="gap-2 rounded-full"
                  asChild
                >
                  <Link href="/berita">
                    <ArrowLeft className="size-4 shrink-0" />
                    Berita
                  </Link>
                </Button>
                <Button className="gap-2 rounded-full" onClick={handleShare}>
                  <Share2 className="size-4 shrink-0" />
                  Bagikan
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1040px] flex-col gap-8 px-6 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="min-w-0 rounded-xl border bg-card p-6 md:p-8"
        >
          <div
            className="prose max-w-none dark:prose-invert prose-p:leading-8 prose-headings:font-bold prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </motion.div>

        <aside className="rounded-xl border bg-card p-6 md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xl">
              <BookOpen className="size-5 text-primary" />
              <h2 className="mt-4 text-2xl font-extrabold">Catatan Artikel</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Artikel Tax Center Gunadarma untuk informasi perpajakan,
                program, dan aktivitas pembelajaran.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border bg-background px-3 py-2 text-sm text-muted-foreground">
              <CalendarDays className="size-4 text-primary" />
              <span>{formatDate(news.created_at)}</span>
            </div>
          </div>
          <Separator className="my-5" />
          <p className="text-sm leading-6 text-muted-foreground">
            Sumber dan pembaruan konten mengikuti kanal resmi Tax Center
            Universitas Gunadarma.
          </p>
        </aside>
      </div>
    </article>
  );
};

export default NewsDetail;
