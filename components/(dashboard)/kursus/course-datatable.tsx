"use client";

import { useGetData } from "@/hooks/use-get-data";
import { useDataTableQueryParams } from "@/hooks/use-data-table-query-params";
import { DataTable } from "@/components/ui/datatable";
import { TCourse } from "./_types/couurse-type";
import { courseColumns } from "./course-column";

const CourseDataTable = () => {
  const { page, limit, search, filters } = useDataTableQueryParams();

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

  return (
    <DataTable
      columns={courseColumns}
      data={courses}
      meta={meta}
      isLoading={isLoading}
      searchPlaceholder="Cari Judul Kursus"
    />
  );
};

export default CourseDataTable;
