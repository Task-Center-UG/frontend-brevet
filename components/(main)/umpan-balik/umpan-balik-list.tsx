"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import NotFoundContent from "../not-found-content";
import { useGetData } from "@/hooks/use-get-data";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { TFeedback } from "@/components/(dashboard)/umpan-balik/_types/umpan-balik-type";
import { UmpanBalikCreateDialog } from "./umpan-balik-create-dialog";
import { UmpanBalikUpdateDialog } from "./umpan-balik-update-dialog";
import { UmpanBalikDeleteDialog } from "./umpan-balik-delete-dialog";
import { API_BASE_URL } from "@/helpers/api-config";

function Stars({ value }: { value: number }) {
  const v = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <span
      aria-label={`${v} dari 5 bintang`}
      className="font-medium tracking-tight"
    >
      {"★".repeat(v)}
      <span className="text-muted-foreground">{"★".repeat(5 - v)}</span>
    </span>
  );
}

export default function UmpanBalikList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [meId, setMeId] = useState<string | undefined>(undefined);
  const limit = 6;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = Cookies.get("access_token");
        if (!token || token === "undefined") return;

        const res = await axios.get(`${API_BASE_URL}/users/me`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        const id = res?.data?.data?.id as string | undefined;
        if (!cancelled) setMeId(id);
      } catch {
        if (!cancelled) setMeId(undefined);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const queryParams = new URLSearchParams({
    ...(search && { q: search }),
    page: page.toString(),
    limit: limit.toString(),
  });
  const queryString = queryParams.toString();

  const { data, isLoading, refetch } = useGetData({
    queryKey: ["testimonials", queryString],
    dataProtected: `testimonials?${queryString}`,
  });

  const testimonials: TFeedback[] = data?.data?.data ?? [];
  const meta = data?.data?.meta ?? { total_pages: 1 };
  const totalPages: number = Number(meta.total_pages ?? 1);

  const paginationItems = useMemo(
    () => Array.from({ length: totalPages }).map((_, i) => i + 1),
    [totalPages]
  );

  return (
    <div className="max-w-screen-xl mx-auto py-24 md:py-32 px-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f97316]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
            Testimoni Peserta
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight !leading-[1.1]">
            Umpan Balik{" "}
            <span className="text-muted-foreground">Peserta</span>
          </h2>
        </div>
        <div className="flex flex-col md:items-end gap-4">
          <p className="text-muted-foreground max-w-sm md:text-right leading-relaxed">
            Baca pengalaman peserta dan bagikan pendapatmu tentang kelas yang
            sudah kamu ikuti.
          </p>
          {meId && <UmpanBalikCreateDialog onSuccess={() => refetch()} />}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          type="text"
          placeholder="Cari judul/ulasan..."
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
              className="rounded-2xl bg-card border overflow-hidden h-full flex flex-col p-6"
            >
              <Skeleton className="w-24 h-6 rounded mb-3" />
              <Skeleton className="w-3/4 h-4 rounded mb-2" />
              <Skeleton className="w-full h-4 rounded mb-2" />
              <Skeleton className="w-2/3 h-4 rounded" />
            </div>
          ))
        ) : testimonials.length === 0 ? (
          <div className="col-span-full flex justify-center items-center py-10">
            <NotFoundContent message="Belum ada umpan balik yang sesuai." />
          </div>
        ) : (
          testimonials.map((fb) => (
            <div
              key={fb.id}
              className="rounded-2xl border bg-card overflow-hidden transition-all duration-300 hover:border-foreground/20 hover:shadow-lg hover:-translate-y-1 flex flex-col h-full"
            >
              <div className="flex items-center gap-3 p-6 pb-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted shrink-0">
                  {fb.user?.avatar ? (
                    <ImageWithFallback
                      src={fb.user.avatar}
                      alt={fb.user.name}
                      fill
                      className="object-cover"
                      fallbackClassName="rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-muted-foreground bg-muted">
                      {(fb.user?.name ?? "A").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-foreground truncate">
                    {fb.user?.name ?? "Anonim"}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {fb.batch?.title ?? "-"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col flex-1 px-6 pb-6 text-muted-foreground gap-2">
                <Stars value={Number(fb.rating)} />
                <h4 className="text-base font-semibold text-foreground line-clamp-2">
                  {fb.title}
                </h4>
                {fb.description ? (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {fb.description}
                  </p>
                ) : null}

                <div className="mt-auto flex items-center justify-between pt-3">
                  {meId && fb.user_id === meId ? (
                    <div className="flex items-center gap-2">
                      <UmpanBalikUpdateDialog
                        feedback={fb}
                        onSuccess={() => refetch()}
                      />
                      <UmpanBalikDeleteDialog
                        feedbackId={fb.id}
                        onSuccess={() => refetch()}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
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

            {paginationItems.map((pageNumber) => {
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
}
