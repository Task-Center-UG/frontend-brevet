"use client";

import { useGetData } from "@/hooks/use-get-data";
import { useDataTableQueryParams } from "@/hooks/use-data-table-query-params";
import { DataTable } from "@/components/ui/datatable";
import { batchColumns } from "./batch-column";
import { TCourseBatch } from "./_types/course-batch-type";

type Props = {
  courseSlug: string;
};

const BatchDatatable = ({ courseSlug }: Props) => {
  const { page, limit, search, filters } = useDataTableQueryParams();

  const queryParams = new URLSearchParams({
    ...(search && { q: search }),
    page: String(page),
    limit: String(limit),
    ...filters,
  });

  const queryString = queryParams.toString();

  const { data, isLoading } = useGetData({
    queryKey: ["batches", queryString],
    dataProtected: `courses/${courseSlug}/batches?${queryString}`,
  });

  const batches: TCourseBatch[] = data?.data?.data ?? [];

  const meta = data?.data?.meta ?? {
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  };

  return (
    <DataTable
      columns={batchColumns}
      data={batches}
      meta={meta}
      isLoading={isLoading}
      searchPlaceholder="Cari Judul Batch"
    />
  );
};

export default BatchDatatable;
