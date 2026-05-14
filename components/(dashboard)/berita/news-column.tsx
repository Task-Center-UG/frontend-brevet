"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TNews } from "./_types/news-type";
import { NewsAction } from "./news-action";
import { trimWords } from "@/lib/utils";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

export const newsColumns: ColumnDef<TNews>[] = [
  {
    accessorKey: "image",
    header: "Gambar",
    cell: ({ row }) => (
      <ImageWithFallback
        width={96}
        height={64}
        src={row.original.image}
        alt={row.original.title}
        className="h-16 w-24 object-cover rounded-md border"
      />
    ),
  },
  {
    accessorKey: "title",
    header: "Judul Berita",
    cell: ({ row }) => <div className="font-medium">{row.original.title}</div>,
  },
  {
    accessorKey: "description",
    header: "Deskripsi Singkat",
    cell: ({ row }) => (
      <div className="line-clamp-2">
        {trimWords(row.original.description, 8)}
      </div>
    ),
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => (
      <span className="text-gray-500 max-w-[200px] truncate block">
        {row.original.slug}
      </span>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <NewsAction newsId={row.original.id} newsSlug={row.original.slug} />
    ),
  },
];
