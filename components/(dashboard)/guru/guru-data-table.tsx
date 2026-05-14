"use client";

import { useGetData } from "@/hooks/use-get-data";
import { useDataTableQueryParams } from "@/hooks/use-data-table-query-params";
import { DataTable } from "@/components/ui/datatable";
import { TGuru } from "./_types/guru-type";
import { guruColumns } from "./guru-column";

const GuruDataTable = () => {
  const { page, limit, search, filters } = useDataTableQueryParams();

  const queryParams = new URLSearchParams({
    ...(search && { q: search }),
    page: String(page),
    limit: String(limit),
    role_type: "guru",
    ...filters,
  });

  const queryString = queryParams.toString();

  const { data, isLoading } = useGetData({
    queryKey: ["guru", queryString],
    dataProtected: `users?${queryString}`,
  });

  const teachers: TGuru[] = data?.data.data ?? [];
  const meta = data?.data?.meta ?? {
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  };

  return (
    <DataTable
      columns={guruColumns}
      data={teachers}
      meta={meta}
      isLoading={isLoading}
      searchPlaceholder="Cari Nama Pengajar"
    />
  );
};

export default GuruDataTable;
