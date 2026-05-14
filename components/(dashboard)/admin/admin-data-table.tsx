"use client";

import { useGetData } from "@/hooks/use-get-data";
import { useDataTableQueryParams } from "@/hooks/use-data-table-query-params";
import { DataTable } from "@/components/ui/datatable";
import { TAdmin } from "./_types/admin-type";
import { adminColumns } from "./admin-column";

const AdminDataTable = () => {
  const { page, limit, search, filters } = useDataTableQueryParams();

  const queryParams = new URLSearchParams({
    ...(search && { q: search }),
    page: String(page),
    limit: String(limit),
    role_type: "admin",
    ...filters,
  });

  const queryString = queryParams.toString();

  const { data, isLoading } = useGetData({
    queryKey: ["admin", queryString],
    dataProtected: `users?${queryString}`,
  });

  const admins: TAdmin[] = data?.data.data ?? [];
  const meta = data?.data?.meta ?? {
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  };

  return (
    <DataTable
      columns={adminColumns}
      data={admins}
      meta={meta}
      isLoading={isLoading}
      searchPlaceholder="Cari Nama Admin"
    />
  );
};

export default AdminDataTable;
