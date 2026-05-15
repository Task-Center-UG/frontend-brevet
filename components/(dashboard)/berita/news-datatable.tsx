"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDataTableQueryParams } from "@/hooks/use-data-table-query-params";
import { useGetData } from "@/hooks/use-get-data";
import { trimWords } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronsLeft,
  ChevronsRight,
  Newspaper,
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";
import Link from "next/link";
import { NewsAction } from "./news-action";
import { TNews } from "./_types/news-type";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const NewsDataTable = () => {
  const { page, limit, search, filters, updateQuery, resetFilters } =
    useDataTableQueryParams();

  const queryParams = new URLSearchParams({
    ...(search && { q: search }),
    page: String(page),
    limit: String(limit),
    ...filters,
  });

  const queryString = queryParams.toString();

  const { data, isLoading } = useGetData({
    queryKey: ["news", queryString],
    dataProtected: `blogs?${queryString}`,
  });

  const news: TNews[] = data?.data?.data ?? [];
  const meta = data?.data?.meta ?? {
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  };

  const leadNews = news[0];
  const otherNews = news.slice(1);

  return (
    <div className="space-y-5">
      <section className="rounded-lg border bg-card p-5">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_520px] lg:items-end">
          <div>
            <Badge variant="outline" className="mb-4 gap-2">
              <Newspaper className="size-3" />
              Manajemen Berita
            </Badge>
            <h1 className="text-2xl font-extrabold tracking-normal">
              Ruang editorial untuk kabar Tax Center.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Pantau artikel, buka halaman publik, ubah konten, dan hapus berita
              dari layout editorial yang tetap operasional.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari judul berita"
                  value={search}
                  onChange={(event) =>
                    updateQuery("search", event.target.value)
                  }
                  className="pl-9 text-sm"
                />
              </div>
              <Button variant="outline" onClick={resetFilters}>
                <RotateCcw className="size-4" />
                Reset
              </Button>
              <Button asChild>
                <Link href="/dashboard/berita/tambah">
                  <Plus className="size-4" />
                  Tambah
                </Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {meta.total} berita ditemukan, halaman {page} dari{" "}
              {meta.total_pages || 1}.
            </p>
          </div>
        </div>
      </section>

      {isLoading ? (
        <NewsSkeleton />
      ) : news.length === 0 ? (
        <EmptyNewsState />
      ) : (
        <div className="space-y-4">
          {leadNews && <LeadNews news={leadNews} />}

          {otherNews.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {otherNews.map((item, index) => (
                <NewsCard key={item.id} news={item} index={index} />
              ))}
            </div>
          )}

          <ListPagination
            page={page}
            totalPages={meta.total_pages || 1}
            onPageChange={(targetPage) =>
              updateQuery("page", String(targetPage))
            }
          />
        </div>
      )}
    </div>
  );
};

function LeadNews({ news }: { news: TNews }) {
  return (
    <motion.article
      className="grid overflow-hidden rounded-lg border bg-card lg:grid-cols-[minmax(360px,1fr)_minmax(0,0.85fr)]"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18, ease: easeOutExpo }}
    >
      <div className="relative min-h-[300px] bg-muted">
        <ImageWithFallback
          src={news.image}
          alt={news.title}
          fill
          sizes="(min-width: 1024px) 52vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-col justify-between gap-8 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Badge variant="secondary" className="mb-4">
              Artikel Utama
            </Badge>
            <h2 className="text-2xl font-extrabold leading-tight">
              {news.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {trimWords(news.description || news.content, 30)}
            </p>
          </div>
          <NewsAction newsId={news.id} newsSlug={news.slug} />
        </div>

        <div className="grid gap-4">
          <div className="rounded-md border bg-background px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Slug publik
            </p>
            <p className="mt-1 truncate text-sm font-semibold">{news.slug}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm">
              <Link href={`/dashboard/berita/${news.slug}/update`}>
                Ubah Data
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={`/berita/${news.slug}`}>
                Lihat Publik
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function NewsCard({ news, index }: { news: TNews; index: number }) {
  return (
    <motion.article
      className="overflow-hidden rounded-lg border bg-card"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18, delay: index * 0.01, ease: easeOutExpo }}
    >
      <div className="relative h-48 bg-muted">
        <ImageWithFallback
          src={news.image}
          alt={news.title}
          fill
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex min-h-[240px] flex-col justify-between gap-6 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Badge variant="outline" className="mb-3">
              Berita
            </Badge>
            <h3 className="line-clamp-2 text-lg font-extrabold leading-snug">
              {news.title}
            </h3>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
              {trimWords(news.description || news.content, 22)}
            </p>
          </div>
          <NewsAction newsId={news.id} newsSlug={news.slug} />
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-xs font-semibold text-muted-foreground">
            /{news.slug}
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href={`/berita/${news.slug}`}>Detail</Link>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

function NewsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid overflow-hidden rounded-lg border bg-card lg:grid-cols-[minmax(360px,1fr)_minmax(0,0.85fr)]">
        <Skeleton className="h-[300px] rounded-none" />
        <div className="space-y-5 p-6">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-lg border bg-card">
            <Skeleton className="h-48 rounded-none" />
            <div className="space-y-4 p-5">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-8 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyNewsState() {
  return (
    <div className="rounded-lg border bg-card p-10 text-center">
      <Newspaper className="mx-auto size-8 text-primary" />
      <h2 className="mt-4 text-xl font-extrabold">Belum ada berita</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Tambahkan berita pertama supaya pengumuman Tax Center tampil di halaman
        publik.
      </p>
      <Button asChild className="mt-6">
        <Link href="/dashboard/berita/tambah">
          <Plus className="size-4" />
          Tambah Berita
        </Link>
      </Button>
    </div>
  );
}

function ListPagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Halaman <span className="font-semibold text-foreground">{page}</span>{" "}
        dari {totalPages}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronsLeft className="size-4" />
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Selanjutnya
          <ChevronsRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export default NewsDataTable;
