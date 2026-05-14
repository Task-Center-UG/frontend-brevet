"use client";

import { useGetData } from "@/hooks/use-get-data";
import { useDataTableQueryParams } from "@/hooks/use-data-table-query-params";
import { DataTable } from "@/components/ui/datatable";
import { quizColumns } from "./quiz-column";
import { TQuiz } from "@/components/(dashboard)/kelas/_types/kelas-pertemuan-type";

type Props = {
  batchSlug: string;
  meetingId?: string;
};

const QuizDatatable = ({ meetingId }: Props) => {
  const { page, limit, search, filters } = useDataTableQueryParams();

  const queryParams = new URLSearchParams({
    ...(search && { q: search }),
    page: String(page),
    limit: String(limit),
    ...filters,
  });

  const queryString = queryParams.toString();

  const { data, isLoading } = useGetData({
    queryKey: ["quizzez", meetingId, queryString],
    dataProtected: `meetings/${meetingId}/quizzes?${queryString}&sort=created_at&order=desc`,
    options: {
      enabled: !!meetingId,
      placeholderData: undefined,
    },
  });

  const quizzes: TQuiz[] = data?.data?.data ?? [];
  const meta = data?.data?.meta ?? {
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  };

  return (
    <DataTable
      columns={quizColumns}
      data={quizzes}
      meta={meta}
      isLoading={isLoading}
      searchPlaceholder="Cari Judul Quiz"
    />
  );
};

export default QuizDatatable;
