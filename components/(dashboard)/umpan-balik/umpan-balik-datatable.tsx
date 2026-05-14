"use client";

import { useGetData } from "@/hooks/use-get-data";
import { useDataTableQueryParams } from "@/hooks/use-data-table-query-params";
import { DataTable } from "@/components/ui/datatable";
import { TFeedback } from "./_types/umpan-balik-type";
import { umpanBalikColumns } from "./umpan-balik-column";

const TestimonialDataTable = () => {
  const { page, limit, search, filters } = useDataTableQueryParams();

  const filterOptions = {
    rating: {
      placeholder: "Pilih Rating",
      options: [
        { label: "★ 5", value: "5" },
        { label: "★ 4", value: "4" },
        { label: "★ 3", value: "3" },
        { label: "★ 2", value: "2" },
        { label: "★ 1", value: "1" },
      ],
    },
  };

  const queryParams = new URLSearchParams({
    ...(search && { q: search }),
    page: String(page),
    limit: String(limit),
    ...filters,
  });

  const queryString = queryParams.toString();

  const { data, isLoading } = useGetData({
    queryKey: ["testimonials", queryString],
    dataProtected: `testimonials?${queryString}`,
  });

  const testimonials: TFeedback[] = data?.data?.data ?? [];
  const meta = data?.data?.meta ?? {
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  };

  return (
    <DataTable
      columns={umpanBalikColumns}
      data={testimonials}
      meta={meta}
      isLoading={isLoading}
      searchPlaceholder="Cari judul/ulasan"
      filterOptions={filterOptions}
    />
  );
};

export default TestimonialDataTable;
