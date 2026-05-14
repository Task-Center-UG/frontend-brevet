"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MemberAction } from "./member-action";
import { TMember } from "./_types/member-type";

export const memberColumns: ColumnDef<TMember>[] = [
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
      return <MemberAction memberId={row.original.id} />;
    },
  },
];
