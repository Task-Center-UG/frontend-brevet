"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TGuru } from "./_types/guru-type";
import { GuruAction } from "./guru-action";

export const guruColumns: ColumnDef<TGuru>[] = [
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original.email,
  },
  {
    accessorKey: "phone",
    header: "Telepon",
    cell: ({ row }) => row.original.phone,
  },
  {
    accessorKey: "profile.institution",
    header: "Institusi",
    cell: ({ row }) => row.original.profile.institution,
  },
  {
    accessorKey: "profile.origin",
    header: "Asal Daerah",
    cell: ({ row }) => row.original.profile.origin,
  },
  {
    accessorKey: "profile.birth_date",
    header: "Tanggal Lahir",
    cell: ({ row }) =>
      new Date(row.original.profile.birth_date).toLocaleDateString("id-ID"),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <GuruAction memberId={row.original.id} />;
    },
  },
];
