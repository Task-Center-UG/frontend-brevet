"use client";

import { useGetData } from "@/hooks/use-get-data";
import { useDataTableQueryParams } from "@/hooks/use-data-table-query-params";
import { DataTable } from "@/components/ui/datatable";
import { TAssignment } from "./_types/tugas-type";
import { assignmentColumns } from "./tugas-column";

type Props = {
  batchSlug: string;
  meetingId?: string;
};

const TugasDataTable = ({ meetingId }: Props) => {
  const { page, limit, search, filters } = useDataTableQueryParams();

  const queryParams = new URLSearchParams({
    ...(search && { q: search }),
    page: String(page),
    limit: String(limit),
    ...filters,
  });

  const queryString = queryParams.toString();

  const { data, isLoading } = useGetData({
    queryKey: ["assignments", queryString],
    dataProtected: `meetings/${meetingId}/assignments?${queryString}`,
  });

  const assignments: TAssignment[] = data?.data?.data ?? [];
  const meta = data?.data?.meta ?? {
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  };

  return (
    <DataTable
      columns={assignmentColumns}
      data={assignments}
      meta={meta}
      isLoading={isLoading}
      searchPlaceholder="Cari Judul Tugas"
    />
  );
};

export default TugasDataTable;
