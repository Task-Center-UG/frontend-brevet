"use client";

import {
  BookOpenCheck,
  ChevronsLeft,
  ChevronsRight,
  RotateCcw,
  Search,
} from "lucide-react";

import { TMyCourse } from "./_types/my-course-type";
import { ProgramSayaCard } from "./program-card";
import NotFoundContent from "@/components/(main)/not-found-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useDataTableQueryParams } from "@/hooks/use-data-table-query-params";
import { useGetData } from "@/hooks/use-get-data";

const ProgramSayaDatatable = () => {
  const { page, search, filters, updateQuery, resetFilters } =
    useDataTableQueryParams();

  const queryParams = new URLSearchParams({
    ...(search && { search }),
    page: String(page),
    ...filters,
  });
  const queryString = queryParams.toString();

  const { data, isLoading } = useGetData({
    queryKey: ["kelas-saya", queryString],
    dataProtected: `me/batches?${queryString}`,
  });

  const myCourses: TMyCourse[] = data?.data.data ?? [];
  const meta = data?.data.meta ?? {
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  };

  const totalPages = meta.total_pages;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              LMS Siswa
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-normal">
              Program Saya
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Buka kelas aktif, lanjutkan materi, cek progress, dan akses
              sertifikat setelah program selesai.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-xl">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama program"
                value={search}
                onChange={(event) => updateQuery("search", event.target.value)}
                className="pl-9 text-sm"
              />
            </div>

            <Button variant="outline" onClick={resetFilters} className="gap-2">
              <RotateCcw className="size-4 shrink-0" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-lg border bg-card p-4">
              <Skeleton className="h-44 w-full rounded-md" />
              <Skeleton className="mt-4 h-5 w-3/4" />
              <Skeleton className="mt-3 h-4 w-2/3" />
              <Skeleton className="mt-4 h-20 w-full rounded-md" />
              <Skeleton className="mt-4 h-10 w-full rounded-md" />
            </div>
          ))}
        </div>
      ) : myCourses.length === 0 ? (
        <NotFoundContent
          title="Belum ada program"
          message="Program yang sudah dibayar dan dikonfirmasi akan tampil di sini."
          icon={<BookOpenCheck className="size-7" />}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {myCourses.map((course) => (
              <ProgramSayaCard key={course.id} course={course} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    aria-label="Halaman sebelumnya"
                    size="default"
                    className="gap-2 pl-2.5"
                    onClick={(event) => {
                      event.preventDefault();
                      if (page > 1) {
                        updateQuery("page", String(page - 1));
                      }
                    }}
                  >
                    <ChevronsLeft className="size-4" />
                    <span>Sebelumnya</span>
                  </PaginationLink>
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNumber) => (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={pageNumber === page}
                        onClick={(event) => {
                          event.preventDefault();
                          updateQuery("page", String(pageNumber));
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}

                <PaginationItem>
                  <PaginationLink
                    href="#"
                    aria-label="Halaman berikutnya"
                    size="default"
                    className="gap-2 pr-2.5"
                    onClick={(event) => {
                      event.preventDefault();
                      if (page < totalPages) {
                        updateQuery("page", String(page + 1));
                      }
                    }}
                  >
                    <span>Berikutnya</span>
                    <ChevronsRight className="size-4" />
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default ProgramSayaDatatable;
