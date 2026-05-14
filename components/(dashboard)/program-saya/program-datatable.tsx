"use client";

import { useGetData } from "@/hooks/use-get-data";
import { useDataTableQueryParams } from "@/hooks/use-data-table-query-params";
import { TMyCourse } from "./_types/my-course-type";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProgramSayaCard } from "./program-card";

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
      <h1 className="text-xl font-bold">Kursus Saya</h1>

      <div className="flex flex-col md:flex-row gap-2">
        <Input
          placeholder="Cari Nama Kursus"
          value={search}
          onChange={(e) => updateQuery("search", e.target.value)}
          className="w-full text-sm"
        />

        <Button variant="outline" onClick={resetFilters}>
          Reset
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="border border-muted rounded-xl shadow-md p-4 space-y-4 bg-background"
            >
              <Skeleton className="h-40 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="h-6 w-16 rounded-md" />
              </div>
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          ))}
        </div>
      ) : myCourses.length === 0 ? (
        <p>Tidak ada kelas yang ditemukan.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {myCourses.map((course) => (
              <ProgramSayaCard key={course.id} course={course} />
            ))}
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  aria-label="Go to previous page"
                  size="default"
                  className="gap-1 pl-2.5"
                  onClick={() =>
                    page > 1 && updateQuery("page", String(page - 1))
                  }
                >
                  <ChevronsLeft className="h-4 w-4" />
                  <span>Previous</span>
                </PaginationLink>
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={p === page}
                    onClick={() => updateQuery("page", String(p))}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationLink
                  href="#"
                  aria-label="Go to next page"
                  size="default"
                  className="gap-1 pr-2.5"
                  onClick={() =>
                    page < totalPages && updateQuery("page", String(page + 1))
                  }
                >
                  <span>Next</span>
                  <ChevronsRight className="h-4 w-4" />
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
};

export default ProgramSayaDatatable;
