"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import {
  MessageSquareQuote,
  PencilLine,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
} from "lucide-react";

import { TFeedback } from "@/components/(dashboard)/umpan-balik/_types/umpan-balik-type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE_URL } from "@/helpers/api-config";
import { useGetData } from "@/hooks/use-get-data";
import NotFoundContent from "../not-found-content";
import { UmpanBalikCreateDialog } from "./umpan-balik-create-dialog";
import { UmpanBalikDeleteDialog } from "./umpan-balik-delete-dialog";
import { UmpanBalikUpdateDialog } from "./umpan-balik-update-dialog";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

function Stars({ value }: { value: number }) {
  const rating = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${rating} dari 5 bintang`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={
            index < rating
              ? "size-4 fill-primary text-primary"
              : "size-4 text-muted-foreground/35"
          }
        />
      ))}
    </div>
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
    [totalPages],
  );

  const averageRating = testimonials.length
    ? testimonials.reduce((sum, item) => sum + Number(item.rating || 0), 0) /
      testimonials.length
    : 0;

  return (
    <main className="w-full overflow-hidden bg-background text-foreground">
      <section className="relative border-b bg-[linear-gradient(135deg,oklch(0.985_0.006_78),oklch(0.955_0.01_86))] dark:bg-[linear-gradient(135deg,oklch(0.16_0.012_285),oklch(0.21_0.014_285))]">
        <div className="absolute inset-x-0 top-0 h-px bg-primary/40" />
        <div className="mx-auto grid max-w-screen-xl gap-10 px-6 py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
          <motion.div
            className="flex max-w-5xl flex-col gap-7"
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
          >
            <Badge
              variant="outline"
              className="w-fit rounded-full border-primary/20 bg-primary/10 px-3 py-1 text-primary"
            >
              <Sparkles />
              Umpan balik peserta
            </Badge>
            <div className="flex flex-col gap-5">
              <h1 className="text-[2.75rem] font-extrabold leading-[0.98] tracking-normal md:text-[4.5rem] lg:text-[5.8rem]">
                Suara peserta setelah belajar.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                Baca pengalaman kelas brevet dari peserta, lalu kirim ulasanmu
                setelah mengikuti program di LMS Tax Center Gunadarma.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="rounded-xl border bg-card p-6 shadow-xl shadow-primary/8"
            initial={{ opacity: 0, y: 34, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.1, ease: easeOutExpo }}
          >
            <div className="flex min-h-72 flex-col justify-between rounded-lg border bg-background p-5">
              <MessageSquareQuote className="size-10 text-primary" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Snapshot
                </p>
                <p className="mt-3 text-3xl font-extrabold leading-tight">
                  {testimonials.length || "Belum ada"} ulasan tampil di halaman
                  ini.
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <Stars value={averageRating} />
                  <span className="text-sm font-semibold text-muted-foreground">
                    {averageRating ? averageRating.toFixed(1) : "0.0"} rata-rata
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-screen-xl px-6 py-12 md:py-16">
        <div className="flex flex-col gap-5 rounded-xl border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between md:p-5">
          <div className="relative w-full md:max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari judul atau isi ulasan"
              className="h-12 rounded-full pl-11"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              <SlidersHorizontal />
              {totalPages} halaman
            </Badge>
            {meId && <UmpanBalikCreateDialog onSuccess={() => refetch()} />}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="rounded-xl border bg-card p-6">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="mt-6 h-5 w-28" />
                <Skeleton className="mt-4 h-6 w-3/4" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-2/3" />
              </div>
            ))
          ) : testimonials.length === 0 ? (
            <div className="col-span-full">
              <NotFoundContent
                title="Umpan balik belum tersedia"
                message="Belum ada ulasan yang cocok dengan pencarian ini."
                icon={<PencilLine className="size-7" />}
              />
            </div>
          ) : (
            testimonials.map((feedback, index) => {
              const ownedByMe = meId && feedback.user_id === meId;
              return (
                <motion.article
                  key={feedback.id}
                  className="group flex min-h-[320px] flex-col rounded-xl border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/8"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "-80px" }}
                  transition={{
                    duration: 0.55,
                    delay: Math.min(index * 0.04, 0.18),
                    ease: easeOutExpo,
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="size-11 border">
                        <AvatarImage
                          src={feedback.user?.avatar ?? undefined}
                          alt={feedback.user?.name ?? "Peserta"}
                        />
                        <AvatarFallback>
                          {(feedback.user?.name ?? "P").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-foreground">
                          {feedback.user?.name ?? "Anonim"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {feedback.batch?.title ?? "Program brevet"}
                        </p>
                      </div>
                    </div>
                    <Stars value={Number(feedback.rating)} />
                  </div>

                  <div className="mt-8 flex flex-1 flex-col">
                    <MessageSquareQuote className="size-7 text-primary transition-transform duration-300 group-hover:-rotate-6" />
                    <h2 className="mt-5 line-clamp-2 text-xl font-extrabold leading-7">
                      {feedback.title}
                    </h2>
                    {feedback.description ? (
                      <p className="mt-3 line-clamp-5 text-sm leading-7 text-muted-foreground">
                        {feedback.description}
                      </p>
                    ) : (
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        Peserta belum menambahkan deskripsi.
                      </p>
                    )}
                  </div>

                  {ownedByMe ? (
                    <div className="mt-6 flex items-center gap-2 border-t pt-4">
                      <UmpanBalikUpdateDialog
                        feedback={feedback}
                        onSuccess={() => refetch()}
                      />
                      <UmpanBalikDeleteDialog
                        feedbackId={feedback.id}
                        onSuccess={() => refetch()}
                      />
                    </div>
                  ) : null}
                </motion.article>
              );
            })
          )}
        </div>

        {totalPages > 1 && (
          <Pagination className="mt-12 justify-center">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    setPage((currentPage) => Math.max(currentPage - 1, 1));
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
                      onClick={(event) => {
                        event.preventDefault();
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
                  onClick={(event) => {
                    event.preventDefault();
                    setPage((currentPage) =>
                      Math.min(currentPage + 1, totalPages),
                    );
                  }}
                  className={
                    page >= totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </section>
    </main>
  );
}
