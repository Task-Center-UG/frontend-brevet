"use client";

import { useGetData } from "@/hooks/use-get-data";
import { useDataTableQueryParams } from "@/hooks/use-data-table-query-params";
import { ManagedUserList } from "@/components/(dashboard)/_shared/managed-user-list";
import { TGuru } from "./_types/guru-type";
import { GuruAction } from "./guru-action";

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
    <ManagedUserList
      users={teachers}
      meta={meta}
      isLoading={isLoading}
      roleLabel="Pengajar"
      searchPlaceholder="Cari Nama Pengajar"
      emptyTitle="Belum ada pengajar."
      emptyDescription="Tambah pengajar agar kelas bisa ditugaskan dan dikelola dengan jelas."
      renderAction={(teacher) => <GuruAction memberId={teacher.id} />}
    />
  );
};

export default GuruDataTable;
