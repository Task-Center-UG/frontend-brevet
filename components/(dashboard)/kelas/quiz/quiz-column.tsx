"use client";

import { ColumnDef } from "@tanstack/react-table";
import { trimWords } from "@/lib/utils";
import { TQuiz } from "./_types/quiz-type";
import { QuizAction } from "./quiz-action";

const typeLabel: Record<string, string> = {
  tf: "True/False",
  mc: "Pilihan Ganda",
};

export const quizColumns: ColumnDef<TQuiz>[] = [
  {
    accessorKey: "title",
    header: "Judul Quiz",
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
    accessorKey: "type",
    header: "Tipe",
    cell: ({ row }) => {
      const t = row.original.type;
      return <span className="capitalize">{typeLabel[t] ?? t}</span>;
    },
  },
  {
    accessorKey: "start_time",
    header: "Mulai",
    cell: ({ row }) => {
      const date = new Date(row.original.start_time).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "UTC",
      });
      return <span>{date}</span>;
    },
  },
  {
    accessorKey: "end_time",
    header: "Berakhir",
    cell: ({ row }) => {
      const date = new Date(row.original.end_time).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "UTC",
      });
      return <span>{date}</span>;
    },
  },

  {
    accessorKey: "duration_minute",
    header: "Durasi",
    cell: ({ row }) => <span>{row.original.duration_minute} menit</span>,
  },
  {
    accessorKey: "max_attempts",
    header: "Maks. Percobaan",
    cell: ({ row }) => <span>{row.original.max_attempts}x</span>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <QuizAction quizId={row.original.id} />,
  },
];
