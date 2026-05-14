"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CourseAction } from "./course-action";
import { trimWords } from "@/lib/utils";
import { TCourse } from "./_types/couurse-type";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

export const courseColumns: ColumnDef<TCourse>[] = [
  {
    accessorKey: "image",
    header: "Gambar",
    cell: ({ row }) => {
      const firstImage = row.original.course_images[0]?.image_url;
      return (
        <ImageWithFallback
          src={firstImage}
          alt={row.original.title}
          width={96}
          height={64}
          className="h-16 w-24 object-cover rounded-md border"
        />
      );
    },
  },
  {
    accessorKey: "title",
    header: "Judul Kursus",
    cell: ({ row }) => <div className="font-medium">{row.original.title}</div>,
  },
  {
    accessorKey: "short_description",
    header: "Deskripsi Singkat",
    cell: ({ row }) => (
      <div className="line-clamp-2">
        {trimWords(row.original.short_description, 8)}
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
      <CourseAction courseId={row.original.id} courseSlug={row.original.slug} />
    ),
  },
];
