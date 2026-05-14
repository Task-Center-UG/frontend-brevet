"use client";

import { useGetData } from "@/hooks/use-get-data";
import { useDataTableQueryParams } from "@/hooks/use-data-table-query-params";
import { DataTable } from "@/components/ui/datatable";
import { TTransaction } from "../transaksi/_types/transaction-type";
import { transactionColumns } from "../transaksi/transaction-column";

const TransactionDataTable = () => {
  const { page, limit, search, filters } = useDataTableQueryParams();

  const filterOptions = {
    payment_status: {
      placeholder: "Pilih Status",
      options: [
        { label: "Menunggu Pembayaran", value: "pending" },
        { label: "Menunggu Konfirmasi", value: "waiting_confirmation" },
        { label: "Berhasil", value: "paid" },
        { label: "Ditolak", value: "rejected" },
        { label: "Kadaluarsa", value: "expired" },
        { label: "Dibatalkan", value: "cancelled" },
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
    queryKey: ["transactions", queryString],
    dataProtected: `purchases?${queryString}`,
  });

  const transactions: TTransaction[] = (data?.data?.data ?? []).filter(
    (trx: TTransaction) =>
      trx.batch_id && trx.batch_id !== "00000000-0000-0000-0000-000000000000"
  );

  const meta = data?.data?.meta ?? {
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  };

  return (
    <DataTable
      columns={transactionColumns}
      data={transactions}
      meta={meta}
      isLoading={isLoading}
      searchPlaceholder="Cari Nama Mahasiswa atau Status"
      filterOptions={filterOptions}
    />
  );
};

export default TransactionDataTable;
