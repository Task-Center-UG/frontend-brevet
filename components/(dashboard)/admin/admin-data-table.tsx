"use client";

import { useGetData } from "@/hooks/use-get-data";
import { useDataTableQueryParams } from "@/hooks/use-data-table-query-params";
import { ManagedUserList } from "@/components/(dashboard)/_shared/managed-user-list";
import { TAdmin } from "./_types/admin-type";
import { AdminAction } from "./admin-action";

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
    <ManagedUserList
      users={admins}
      meta={meta}
      isLoading={isLoading}
      roleLabel="Admin"
      searchPlaceholder="Cari Nama Admin"
      emptyTitle="Belum ada admin."
      emptyDescription="Tambah admin agar akses operasional bisa dikelola oleh akun yang tepat."
      renderAction={(admin) => <AdminAction memberId={admin.id} />}
    />
  );
};

export default AdminDataTable;
