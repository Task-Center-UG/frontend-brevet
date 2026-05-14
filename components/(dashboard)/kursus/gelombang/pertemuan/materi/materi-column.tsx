"use client";

import { ColumnDef } from "@tanstack/react-table";
import { trimWords } from "@/lib/utils";
import { MateriAction } from "./materi-action";
import { TMeetingMaterial } from "@/components/(dashboard)/kelas/materi/_types/materi-type";

export const materiColumns: ColumnDef<TMeetingMaterial>[] = [
  {
    accessorKey: "title",
    header: "Judul Materi",
    cell: ({ row }) => <div className="font-medium">{row.original.title}</div>,
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
    cell: ({ row }) => (
      <div className="line-clamp-2">
        {trimWords(row.original.description, 8)}
      </div>
    ),
  },
  {
    accessorKey: "url",
    header: "Link Materi",
    cell: ({ row }) => (
      <a
        href={row.original.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline text-sm"
      >
        Buka Materi
      </a>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Dibuat",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at).toLocaleDateString(
        "id-ID",
        {
          dateStyle: "medium",
        }
      );
      return <span>{date}</span>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <MateriAction materialId={row.original.id} />,
  },
];
