"use client";

import * as React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { useGetData } from "@/hooks/use-get-data";
import { Skeleton } from "@/components/ui/skeleton";
import { TCourseBatch } from "@/components/(dashboard)/kursus/gelombang/_types/course-batch-type";
import { formatPeriode } from "@/components/(main)/kursus/_libs/format-periode";
import { useSearchParams } from "next/navigation";
import { DAY_OPTIONS } from "@/components/(dashboard)/kursus/gelombang/_constants/day-options";
import { Notice } from "@/components/notice";
import { motion, useInView } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Monitor,
  Users,
  Search,
  X,
  ArrowUpRight,
} from "lucide-react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

function ScheduleCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      <Skeleton className="aspect-[3/2] w-full" />
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>
    </div>
  );
}

function BatchCard({ item, index }: { item: TCourseBatch; index: number }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-60px" });

  const now = new Date();
  const regStart = item.registration_start_at
    ? new Date(item.registration_start_at)
    : null;
  const regEnd = item.registration_end_at
    ? new Date(item.registration_end_at)
    : null;

  let regStatus: "open" | "not_yet" | "closed" | "unknown" = "unknown";
  if (regStart && regEnd) {
    if (now >= regStart && now <= regEnd) regStatus = "open";
    else if (now < regStart) regStatus = "not_yet";
    else if (now > regEnd) regStatus = "closed";
  }

  const statusConfig = {
    open: {
      label: "Pendaftaran Dibuka",
      class:
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900",
    },
    not_yet: {
      label: "Segera Dibuka",
      class:
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900",
    },
    closed: {
      label: "Ditutup",
      class:
        "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-800",
    },
    unknown: {
      label: "-",
      class: "bg-gray-50 text-gray-500 border-gray-200",
    },
  };

  const status = statusConfig[regStatus];

  const daysLabel = item.days
    .map((d) => {
      const indo = DAY_OPTIONS.find((opt) => opt.value === d.day);
      return indo?.label || d.day;
    })
    .join(" · ");

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: easeOutExpo }}
    >
      <Link href={`/kursus/${item.slug}`} className="group block">
        <div className="relative rounded-2xl border bg-card overflow-hidden transition-all duration-500 hover:border-[#f97316]/30 hover:shadow-xl hover:-translate-y-1.5">
          <div className="relative aspect-[3/2] bg-muted overflow-hidden">
            {item.batch_thumbnail ? (
              <img
                src={item.batch_thumbnail}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm font-medium px-4 text-center">
                {item.title}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="absolute top-4 left-4">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border shadow-sm ${
                  item.course_type === "online"
                    ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800"
                    : "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-800"
                }`}
              >
                {item.course_type === "online" ? (
                  <Monitor className="h-3.5 w-3.5" />
                ) : (
                  <MapPin className="h-3.5 w-3.5" />
                )}
                {item.course_type === "online" ? "Online" : "Offline"}
              </span>
            </div>

            <div className="absolute bottom-4 right-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center text-foreground shadow-lg">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-lg md:text-xl font-semibold tracking-tight leading-snug group-hover:text-[#f97316] transition-colors duration-300 truncate">
              {item.title}
            </h3>

            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">
                    {formatPeriode(item.start_at, item.end_at)}
                  </p>
                  <p>{daysLabel}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mt-0.5 shrink-0" />
                <p>
                  {item.start_time} - {item.end_time}
                </p>
              </div>

              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                {item.course_type === "online" ? (
                  <Monitor className="h-4 w-4 mt-0.5 shrink-0" />
                ) : (
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                )}
                <p>
                  {item.course_type === "online"
                    ? "Online (Zoom / Google Meet)"
                    : item.room}
                </p>
              </div>

              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Users className="h-4 w-4 mt-0.5 shrink-0" />
                <p>
                  Kuota{" "}
                  <span className="font-medium text-foreground">
                    {item.quota}
                  </span>{" "}
                  peserta
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t flex items-center justify-between gap-3">
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${status.class}`}
              >
                {status.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {item.registration_start_at && item.registration_end_at
                  ? `${new Date(
                      item.registration_start_at
                    ).toLocaleDateString("id-ID")} - ${new Date(
                      item.registration_end_at
                    ).toLocaleDateString("id-ID")}`
                  : "-"}
              </span>
            </div>

            <div className="mt-4">
              <Button
                asChild
                className="w-full group/btn rounded-full h-11"
                variant={regStatus === "open" ? "default" : "outline"}
              >
                <Link href={`/kursus/${item.slug}`}>
                  {regStatus === "open" ? "Daftar Sekarang" : "Lihat Detail"}
                  <ArrowUpRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function CourseScheduleTable() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const [search, setSearch] = React.useState("");
  const [courseType, setCourseType] = React.useState("");
  const [page, setPage] = React.useState(1);
  const limit = 6;

  const queryParams = new URLSearchParams({
    ...(courseType && courseType !== "semua" && { course_type: courseType }),
    ...(search && { q: search }),
    page: page.toString(),
    limit: limit.toString(),
  });

  const queryString = queryParams.toString();

  const { data, isLoading, isError } = useGetData({
    queryKey: ["batches", slug ?? "", queryString],
    dataProtected: slug
      ? `courses/${slug}/batches?${queryString}`
      : `batches?${queryString}`,
    options: { enabled: true },
  });

  const result = data?.data;
  const batches: TCourseBatch[] = result?.data ?? [];
  const totalPages: number = result?.meta?.total_pages ?? 1;
  const totalItems: number = result?.meta?.total ?? 0;

  const handleReset = () => {
    setSearch("");
    setCourseType("");
    setPage(1);
  };

  const hasActiveFilters = search || (courseType && courseType !== "semua");

  const headerRef = React.useRef(null);
  const headerInView = useInView(headerRef, { once: false, margin: "-60px" });

  return (
    <section className="min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="w-full bg-background border-b">
        <div className="max-w-screen-xl mx-auto px-6 py-16 md:py-24">
          <div ref={headerRef} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-xl">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: easeOutExpo }}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f97316]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
                Jadwal Program
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}
                className="mt-4 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight !leading-[1.05]"
              >
                Jadwal{" "}
                <span className="text-muted-foreground">Kursus</span>
              </motion.h1>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: easeOutExpo }}
              className="text-muted-foreground max-w-md md:text-right leading-relaxed text-lg"
            >
              Telusuri jadwal kursus dan pelatihan perpajakan. Pilih program
              sesuai kebutuhan dan jadwal Anda.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-10 md:py-14">
        <Notice
          tone="warningSoft"
          text={
            <span>
              <strong>Tanggal mulai bersifat tentatif.</strong> Jadwal dapat
              berubah tergantung pada jumlah peserta. Silakan daftar lebih awal
              untuk mengamankan tempat Anda.
            </span>
          }
        />

        {/* Filters */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 items-stretch md:items-end">
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-foreground mb-2">
              Cari Kursus
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Nama kursus..."
                className="pl-9 h-11 rounded-full"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="w-full md:w-56">
            <label className="block text-sm font-medium text-foreground mb-2">
              Kategori
            </label>
            <Select
              value={courseType || "semua"}
              onValueChange={(val) => {
                setCourseType(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-11 w-full rounded-full">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="semua">Semua Kategori</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasActiveFilters}
            className="h-11 px-6 rounded-full border-foreground/15"
          >
            Reset Filter
          </Button>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Hasil:</span>
            <span className="font-medium text-foreground">{totalItems} program</span>
            ditemukan
          </div>
        )}

        {/* Content */}
        <div className="mt-10">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <ScheduleCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-2xl border bg-card p-12 text-center">
              <p className="text-destructive font-medium">Gagal memuat data</p>
              <p className="text-sm text-muted-foreground mt-1">
                Silakan refresh halaman atau coba lagi nanti.
              </p>
            </div>
          ) : batches.length === 0 ? (
            <div className="rounded-2xl border bg-card p-16 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground">
                Tidak ada jadwal yang ditemukan
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Coba ubah filter atau kata kunci pencarian Anda.
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="mt-4 rounded-full"
                >
                  Reset Filter
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {batches.map((item, index) => (
                  <BatchCard key={item.id} item={item} index={index} />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination className="mt-14 justify-center">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setPage((p) => Math.max(p - 1, 1));
                        }}
                        className={
                          page <= 1 ? "pointer-events-none opacity-50" : ""
                        }
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
                          page >= totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
