"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TFeedback } from "./_types/umpan-balik-type";

function Stars({ value }: { value: number }) {
  const v = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <span
      aria-label={`${v} dari 5 bintang`}
      className="font-medium tracking-tight"
    >
      {"★".repeat(v)}
      <span className="text-muted-foreground">{"★".repeat(5 - v)}</span>
    </span>
  );
}

export const umpanBalikColumns: ColumnDef<TFeedback>[] = [
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => <Stars value={Number(row.original.rating)} />,
    enableSorting: true,
    size: 80,
  },
  {
    accessorKey: "title",
    header: "Judul",
    cell: ({ row }) => (
      <div
        className="max-w-[280px] truncate font-medium"
        title={row.original.title}
      >
        {row.original.title}
      </div>
    ),
  },
  {
    id: "user_name",
    header: "Pengulas",
    accessorFn: (r) => r.user?.name ?? "-",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium leading-tight">
          {row.original.user?.name ?? "-"}
        </span>
        <span className="text-xs text-muted-foreground">
          {row.original.user?.email ?? ""}
        </span>
      </div>
    ),
    enableSorting: false,
  },
  {
    id: "batch_title",
    header: "Kursus",
    accessorFn: (r) => r.batch?.title ?? "-",
    cell: ({ row }) => (
      <div className="max-w-[260px] truncate" title={row.original.batch?.title}>
        {row.original.batch?.title ?? "-"}
      </div>
    ),
    enableSorting: false,
  },
];
