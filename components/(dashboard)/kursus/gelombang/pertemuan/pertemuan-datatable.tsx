"use client";

import { useGetData } from "@/hooks/use-get-data";
import { useDataTableQueryParams } from "@/hooks/use-data-table-query-params";
import { DataTable } from "@/components/ui/datatable";
import { meetingColumns } from "./pertemuan-column";

type Props = {
  courseSlug: string;
  batchSlug: string;
};

const PertemuanDatatable = ({ batchSlug }: Props) => {
  const { page, limit, search, filters } = useDataTableQueryParams();

  const queryParams = new URLSearchParams({
    ...(search && { q: search }),
    page: String(page),
    limit: String(limit),
    sort: "created_at",
    order: "asc",
    ...filters,
  });

  const queryString = queryParams.toString();

  const { data, isLoading } = useGetData({
    queryKey: ["meetings", queryString],
    dataProtected: `batches/${batchSlug}/meetings?${queryString}`,
  });

  const meetings = data?.data?.data ?? [];

  const meta = data?.data?.meta ?? {
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  };

  return (
    <DataTable
      columns={meetingColumns}
      data={meetings}
      meta={meta}
      isLoading={isLoading}
      searchPlaceholder="Cari Judul Pertemuan"
    />
  );
};

export default PertemuanDatatable;
