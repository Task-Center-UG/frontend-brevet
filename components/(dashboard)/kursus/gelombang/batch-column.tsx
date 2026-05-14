import { ColumnDef } from "@tanstack/react-table";
import { TCourseBatch } from "./_types/course-batch-type";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { BatchAction } from "./batch-action";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

const dayLabels: Record<string, string> = {
  monday: "Senin",
  tuesday: "Selasa",
  wednesday: "Rabu",
  thursday: "Kamis",
  friday: "Jumat",
  saturday: "Sabtu",
  sunday: "Minggu",
};

export const batchColumns: ColumnDef<TCourseBatch>[] = [
  {
    accessorKey: "batch_thumbnail",
    header: "Thumbnail",
    cell: ({ row }) => {
      const thumbnail = row.original.batch_thumbnail;
      return (
        <ImageWithFallback
          src={thumbnail}
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
    header: "Judul Batch",
    cell: ({ row }) => <div className="font-medium">{row.original.title}</div>,
  },
  {
    accessorKey: "room",
    header: "Ruangan",
    cell: ({ row }) => <span>{row.original.room}</span>,
  },

  // ✅ KOLom BARU: Periode pendaftaran + status
  {
    id: "registration",
    header: "Pendaftaran",
    cell: ({ row }) => {
      const start = row.original.registration_start_at
        ? format(new Date(row.original.registration_start_at), "dd MMM yyyy", {
            locale: id,
          })
        : "-";
      const end = row.original.registration_end_at
        ? format(new Date(row.original.registration_end_at), "dd MMM yyyy", {
            locale: id,
          })
        : "-";

      return (
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">
            {start} - {end}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "start_at",
    header: "Jadwal",
    cell: ({ row }) => {
      const start = format(new Date(row.original.start_at), "dd MMM yyyy", {
        locale: id,
      });
      const end = format(new Date(row.original.end_at), "dd MMM yyyy", {
        locale: id,
      });
      return (
        <div className="text-sm text-muted-foreground">
          {start} - {end}
        </div>
      );
    },
  },
  {
    accessorKey: "days",
    header: "Hari",
    cell: ({ row }) => {
      const days = row.original.days || [];
      if (days.length === 0) {
        return <span className="text-muted-foreground">-</span>;
      }

      return (
        <div className="flex flex-wrap gap-1">
          {days.map((d) => (
            <Badge key={d.id}>{dayLabels[d.day] || d.day}</Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "group_types",
    header: "Jenis Peserta",
    cell: ({ row }) => {
      const groups = row.original.batch_groups || [];

      if (groups.length === 0) {
        return <span className="text-muted-foreground">-</span>;
      }

      return (
        <div className="flex flex-wrap gap-1">
          {groups.map((g) => (
            <Badge key={g.id} variant="secondary">
              {g.group_type === "mahasiswa_gunadarma"
                ? "Mahasiswa Gunadarma"
                : g.group_type === "mahasiswa_non_gunadarma"
                  ? "Mahasiswa Non-Gunadarma"
                  : "Umum"}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "course_type",
    header: "Tipe",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.course_type === "offline" ? "Offline" : "Online"}
      </Badge>
    ),
  },
  {
    accessorKey: "quota",
    header: "Kuota",
    cell: ({ row }) => <span>{row.original.quota} peserta</span>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <BatchAction batchId={row.original.id} batchSlug={row.original.slug} />
    ),
  },
];
