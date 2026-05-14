"use client";

import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import Link from "next/link";
import { useState } from "react";
import NotFoundContent from "../not-found-content";
import { Button } from "@/components/ui/button";
import { useGetData } from "@/hooks/use-get-data";
import { Skeleton } from "@/components/ui/skeleton";
import { TNews } from "@/components/(dashboard)/berita/_types/news-type";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const NewsList = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 6;

  const queryParams = new URLSearchParams({
    ...(search && { q: search }),
    page: page.toString(),
    limit: limit.toString(),
  });

  const queryString = queryParams.toString();

  const { data, isLoading } = useGetData({
    queryKey: ["blogs", queryString],
    dataProtected: `blogs?${queryString}`,
  });

  const posts: TNews[] = data?.data?.data ?? [];
  const totalPages: number = data?.data?.meta?.total_pages ?? 1;

  return (
    <div className="max-w-screen-xl mx-auto py-24 md:py-32 px-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f97316]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
            Informasi Terkini
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight !leading-[1.1]">
            Berita &{" "}
            <span className="text-muted-foreground">Artikel Pajak</span>
          </h2>
        </div>
        <p className="text-muted-foreground max-w-sm md:text-right leading-relaxed">
          Dapatkan informasi terbaru seputar perpajakan, regulasi, dan edukasi
          dari Tax Center.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          type="text"
          placeholder="Cari judul berita..."
          className="w-full"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(6)].map((_, idx) => (
            <div
              key={`skeleton-${idx}`}
              className="rounded-2xl bg-card border overflow-hidden h-full flex flex-col"
            >
              <Skeleton className="aspect-[16/10] w-full" />
              <div className="p-5 space-y-3">
                <Skeleton className="w-1/2 h-4 rounded" />
                <Skeleton className="w-full h-4 rounded" />
                <Skeleton className="w-2/3 h-4 rounded" />
              </div>
            </div>
          ))
        ) : posts.length === 0 ? (
          <div className="col-span-full flex justify-center items-center py-10">
            <NotFoundContent message="Tidak ada berita yang ditemukan." />
          </div>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/berita/${post.slug}`}
              className="group block h-full"
            >
              <div className="relative rounded-2xl border bg-card overflow-hidden transition-all duration-300 hover:border-foreground/20 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
                <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                  <ImageWithFallback
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="text-base font-semibold tracking-tight group-hover:text-[#f97316] transition-colors truncate">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                    {post.description}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 w-fit rounded-full h-9"
                    asChild
                  >
                    <span className="flex items-center">
                      Baca Selengkapnya
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </span>
                  </Button>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-12 justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.max(p - 1, 1));
                }}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNumber = i + 1;
              const isActive = pageNumber === page;

              if (
                pageNumber !== 1 &&
                pageNumber !== totalPages &&
                Math.abs(pageNumber - page) > 1
              ) {
                if (
                  (pageNumber === page - 2 && page > 3) ||
                  (pageNumber === page + 2 && page < totalPages - 2)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              }

              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    isActive={isActive}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.min(p + 1, totalPages));
                }}
                className={
                  page >= totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default NewsList;
