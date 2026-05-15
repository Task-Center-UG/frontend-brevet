"use client";

import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDataTableQueryParams } from "@/hooks/use-data-table-query-params";
import { useGetData } from "@/hooks/use-get-data";
import { trimWords } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpenCheck,
  ChevronsLeft,
  ChevronsRight,
  Layers3,
  Plus,
  RotateCcw,
  Route,
  Search,
} from "lucide-react";
import Link from "next/link";
import { CourseAction } from "./course-action";
import { TCourse } from "./_types/couurse-type";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const CourseDataTable = () => {
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
    queryKey: ["courses", queryString],
    dataProtected: `courses?${queryString}`,
  });

  const courses: TCourse[] = data?.data?.data ?? [];
  const meta = data?.data?.meta ?? {
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  };

  const featuredCourse = courses[0];
  const otherCourses = courses.slice(1);

  return (
    <div className="space-y-5">
      <section className="rounded-lg border bg-card p-5">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_520px] lg:items-end">
          <div>
            <Badge variant="outline" className="mb-4 gap-2">
              <Layers3 className="size-3" />
              Manajemen Kursus
            </Badge>
            <h1 className="text-2xl font-extrabold tracking-normal">
              Kurasi program tanpa tabel panjang.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Kelola detail kursus, buka builder, cek halaman publik, dan hapus
              data dari tampilan yang lebih cepat dipindai.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari judul kursus"
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
                <Link href="/dashboard/kursus/tambah">
                  <Plus className="size-4" />
                  Tambah
                </Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {meta.total} kursus ditemukan, halaman {page} dari{" "}
              {meta.total_pages || 1}.
            </p>
          </div>
        </div>
      </section>

      {isLoading ? (
        <CourseSkeleton />
      ) : courses.length === 0 ? (
        <EmptyCourseState />
      ) : (
        <div className="space-y-4">
          {featuredCourse && <FeaturedCourse course={featuredCourse} />}

          {otherCourses.length > 0 && (
            <div className="grid gap-4 xl:grid-cols-2">
              {otherCourses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
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

function FeaturedCourse({ course }: { course: TCourse }) {
  const firstImage = course.course_images[0]?.image_url;

  return (
    <motion.article
      className="grid overflow-hidden rounded-lg border bg-card lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1fr)]"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18, ease: easeOutExpo }}
    >
      <div className="relative min-h-[260px] bg-muted">
        <ImageWithFallback
          src={firstImage}
          alt={course.title}
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-col justify-between gap-8 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Badge variant="secondary" className="mb-4">
              Sorotan
            </Badge>
            <h2 className="text-2xl font-extrabold leading-tight">
              {course.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {trimWords(course.short_description || course.description, 26)}
            </p>
          </div>
          <CourseAction courseId={course.id} courseSlug={course.slug} />
        </div>

        <div className="grid gap-4">
          <div className="rounded-md border bg-background px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Slug publik
            </p>
            <p className="mt-1 truncate text-sm font-semibold">{course.slug}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm">
              <Link href={`/dashboard/kursus/${course.slug}/builder`}>
                <Route className="size-4" />
                Builder
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={`/program/${course.slug}`}>
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

function CourseCard({ course, index }: { course: TCourse; index: number }) {
  const firstImage = course.course_images[0]?.image_url;

  return (
    <motion.article
      className="grid min-h-[220px] overflow-hidden rounded-lg border bg-card sm:grid-cols-[180px_minmax(0,1fr)]"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18, delay: index * 0.01, ease: easeOutExpo }}
    >
      <div className="relative min-h-[180px] bg-muted">
        <ImageWithFallback
          src={firstImage}
          alt={course.title}
          fill
          sizes="180px"
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-col justify-between gap-5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Badge variant="outline" className="mb-3">
              Kursus
            </Badge>
            <h3 className="line-clamp-2 text-lg font-extrabold leading-snug">
              {course.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {trimWords(course.short_description || course.description, 18)}
            </p>
          </div>
          <CourseAction courseId={course.id} courseSlug={course.slug} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-xs font-semibold text-muted-foreground">
            /{course.slug}
          </p>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href={`/program/${course.slug}`}>Detail</Link>
            </Button>
            <Button asChild size="sm">
              <Link href={`/dashboard/kursus/${course.slug}/builder`}>
                Builder
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function CourseSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid overflow-hidden rounded-lg border bg-card lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1fr)]">
        <Skeleton className="h-[260px] rounded-none" />
        <div className="space-y-5 p-6">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="grid overflow-hidden rounded-lg border bg-card sm:grid-cols-[180px_minmax(0,1fr)]"
          >
            <Skeleton className="h-[220px] rounded-none" />
            <div className="space-y-4 p-5">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyCourseState() {
  return (
    <div className="rounded-lg border bg-card p-10 text-center">
      <BookOpenCheck className="mx-auto size-8 text-primary" />
      <h2 className="mt-4 text-xl font-extrabold">Belum ada kursus</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Tambahkan kursus pertama supaya program bisa dikelola dan ditampilkan ke
        halaman publik.
      </p>
      <Button asChild className="mt-6">
        <Link href="/dashboard/kursus/tambah">
          <Plus className="size-4" />
          Tambah Kursus
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

export default CourseDataTable;
