"use client";

import { useGetData } from "@/hooks/use-get-data";
import { useDataTableQueryParams } from "@/hooks/use-data-table-query-params";
import { DataTable } from "@/components/ui/datatable";
import { TNews } from "./_types/news-type";
import { newsColumns } from "./news-column";

const NewsDataTable = () => {
  const { page, limit, search, filters } = useDataTableQueryParams();

  const queryParams = new URLSearchParams({
    ...(search && { q: search }),
    page: String(page),
    limit: String(limit),
    ...filters,
  });

  const queryString = queryParams.toString();

  const { data, isLoading } = useGetData({
    queryKey: ["news", queryString],
    dataProtected: `blogs?${queryString}`,
  });

  const news: TNews[] = data?.data?.data ?? [];
  const meta = data?.data?.meta ?? {
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  };

  return (
    <DataTable
      columns={newsColumns}
      data={news}
      meta={meta}
      isLoading={isLoading}
      searchPlaceholder="Cari Judul Berita"
    />
  );
};

export default NewsDataTable;
