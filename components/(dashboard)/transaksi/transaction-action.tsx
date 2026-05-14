"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, FileCheck2 } from "lucide-react";
import Link from "next/link";
import { TTransaction } from "./_types/transaction-type";

type Props = {
  transaction: TTransaction;
};

export function TransactionAction({ transaction }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Aksi</DropdownMenuLabel>

        <DropdownMenuItem asChild>
          <Link href={`/kursus/${transaction.batch.slug}`} target="_blank">
            Lihat Program
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/dashboard/transaksi/${transaction.id}`}>
            <FileCheck2 className="mr-2 h-4 w-4 text-blue-600" />
            <span className="text-blue-600">Verifikasi Transaksi</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
