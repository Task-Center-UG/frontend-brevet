import { ColumnDef } from "@tanstack/react-table";
import { TMeeting } from "./_types/meeting-type";
import { Badge } from "@/components/ui/badge";
import { MeetingAction } from "./pertemuan-action";
import { trimWords } from "@/lib/utils";
import { formatToIndoTime } from "./_libs";

export const meetingColumns: ColumnDef<TMeeting>[] = [
  {
    accessorKey: "title",
    header: "Judul Pertemuan",
    cell: ({ row }) => <div className="font-medium">{row.original.title}</div>,
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground line-clamp-2">
        {trimWords(row.original.description, 8) || "-"}
      </div>
    ),
  },
  {
    accessorKey: "meeting_type",
    header: "Tipe Pertemuan",
    cell: ({ row }) => {
      const type = row.original.meeting_type;
      const label =
        type === "basic" ? "Pembelajaran" : type === "exam" ? "Ujian" : type;

      const colorVariant =
        type === "basic"
          ? "secondary"
          : type === "exam"
            ? "destructive"
            : "outline";

      return (
        <Badge variant={colorVariant} className="capitalize">
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "start_at",
    header: "Mulai",
    cell: ({ row }) => (
      <div className="text-sm">{formatToIndoTime(row.original.start_at)}</div>
    ),
  },
  {
    accessorKey: "end_at",
    header: "Selesai",
    cell: ({ row }) => (
      <div className="text-sm">{formatToIndoTime(row.original.end_at)}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <MeetingAction meetingId={row.original.id} />,
  },
];
