"use client";

import { useGetData } from "@/hooks/use-get-data";
import { useDataTableQueryParams } from "@/hooks/use-data-table-query-params";
import { DataTable } from "@/components/ui/datatable";
import { TMeetingMaterial } from "./_types/materi-type";
import { materiColumns } from "./materi-column";

type Props = {
  batchSlug: string;
  meetingId?: string;
};

const MateriDataTable = ({ meetingId }: Props) => {
  const { page, limit, search, filters } = useDataTableQueryParams();

  const queryParams = new URLSearchParams({
    ...(search && { q: search }),
    page: String(page),
    limit: String(limit),
    ...filters,
  });

  const queryString = queryParams.toString();
  console.log(queryString);

  const { data, isLoading } = useGetData({
    queryKey: ["materials", queryString],
    dataProtected: `meetings/${meetingId}/materials?${queryString}`,
  });

  const materials: TMeetingMaterial[] = data?.data?.data ?? [];
  const meta = data?.data?.meta ?? {
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  };

  return (
    <DataTable
      columns={materiColumns}
      data={materials}
      meta={meta}
      isLoading={isLoading}
      searchPlaceholder="Cari Judul Materi"
    />
  );
};

export default MateriDataTable;
