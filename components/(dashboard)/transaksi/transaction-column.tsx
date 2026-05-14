"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TTransaction } from "./_types/transaction-type";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { TransactionAction } from "./transaction-action";
import { formatRupiah } from "../pembayaran/_libs/format-rupiah";
import { formatDateIndo } from "../pembayaran/_libs/format-date-indo";

export const transactionColumns: ColumnDef<TTransaction>[] = [
  {
    accessorKey: "batch.title",
    header: "Program",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <ImageWithFallback
          src={row.original.batch.batch_thumbnail || "/placeholder.svg"}
          alt={row.original.batch.title}
          width={100}
          height={100}
          className="h-16 w-24 object-cover rounded-md border"
        />
        <div className="font-medium max-w-[200px] truncate">
          {row.original.batch.title}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "user.name",
    header: "Mahasiswa",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.user.name}</span>
        <span className="text-sm text-muted-foreground">
          {row.original.user.email}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "price.price",
    header: "Harga",
    cell: ({ row }) => (
      <span>
        {formatRupiah(row.original.price.price + row.original.unique_code)}
      </span>
    ),
  },
  {
    accessorKey: "payment_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.payment_status;

      const badgeColor = {
        paid: "bg-green-100 text-green-700 border-green-300",
        pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
        waiting_confirmation: "bg-blue-100 text-blue-700 border-blue-300",
        rejected: "bg-red-100 text-red-700 border-red-300",
        expired: "bg-gray-100 text-gray-700 border-gray-300",
        cancelled: "bg-orange-100 text-orange-700 border-orange-300",
      }[status];

      const badgeLabel = {
        paid: "Berhasil",
        pending: "Menunggu Pembayaran",
        waiting_confirmation: "Menunggu Konfirmasi",
        rejected: "Ditolak",
        expired: "Kadaluarsa",
        cancelled: "Dibatalkan",
      }[status];

      return (
        <span
          className={`px-3 py-1 text-xs font-medium border rounded-full ${badgeColor}`}
        >
          {badgeLabel}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Tanggal Transaksi",
    cell: ({ row }) => <span>{formatDateIndo(row.original.created_at)}</span>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <TransactionAction transaction={row.original} />,
  },
];
