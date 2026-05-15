"use client";

import { useGetData } from "@/hooks/use-get-data";
import { useDataTableQueryParams } from "@/hooks/use-data-table-query-params";
import { ManagedUserList } from "@/components/(dashboard)/_shared/managed-user-list";
import { TMember } from "./_types/member-type";
import { MemberAction } from "./member-action";

const MemberDataTable = () => {
  const { page, limit, search, filters } = useDataTableQueryParams();

  const filterOptions = {
    "profile.group_type": {
      placeholder: "Pilih Type",
      options: [
        { label: "Mahasiswa Gunadarma", value: "mahasiswa_gunadarma" },
        { label: "Mahasiswa Non-Gunadarma", value: "mahasiswa_non_gunadarma" },
        { label: "Umum", value: "umum" },
      ],
    },
  };

  const queryParams = new URLSearchParams({
    ...(search && { q: search }),
    page: String(page),
    limit: String(limit),
    role_type: "siswa",
    ...filters,
  });

  const queryString = queryParams.toString();

  const { data, isLoading } = useGetData({
    queryKey: ["members", queryString],
    dataProtected: `users?${queryString}`,
  });

  const members: TMember[] = data?.data.data ?? [];
  const meta = data?.data?.meta ?? {
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  };

  return (
    <ManagedUserList
      users={members}
      meta={meta}
      isLoading={isLoading}
      roleLabel="Peserta"
      searchPlaceholder="Cari Nama Peserta"
      filterOptions={filterOptions}
      showGroup
      emptyTitle="Belum ada peserta."
      emptyDescription="Peserta akan muncul setelah terdaftar atau ditambahkan ke sistem."
      renderAction={(member) => <MemberAction memberId={member.id} />}
    />
  );
};

export default MemberDataTable;
