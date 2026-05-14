"use client";

import { usePatchData } from "@/hooks/use-patch-data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Trash2, MoreHorizontal } from "lucide-react";
import Link from "next/link";

type Props = {
  purchaseId: string;
  batchSlug: string;
  payment_status:
    | "pending"
    | "waiting_confirmation"
    | "paid"
    | "rejected"
    | "expired"
    | "cancelled";
};

export function PurchaseAction({
  purchaseId,
  batchSlug,
  payment_status,
}: Props) {
  const [open, setOpen] = useState(false);

  const cancelPurchase = usePatchData({
    queryKey: "purchases",
    dataProtected: `me/purchases/${purchaseId}/cancel`,
    successMessage: "Pembelian berhasil dibatalkan!",
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={`/kursus/${batchSlug}`} target="_blank">
              Lihat Program
            </Link>
          </DropdownMenuItem>
          {payment_status === "pending" && (
            <>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/pembayaran/${purchaseId}`}>
                  Unggah Bukti Pembayaran
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                  <span className="text-red-600">Batalkan</span>
                </DropdownMenuItem>
              </DialogTrigger>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Konfirmasi Pembatalan</DialogTitle>
          <DialogDescription>
            Apakah kamu yakin ingin membatalkan pembelian ini?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button
            variant="destructive"
            className="text-white"
            onClick={() => {
              cancelPurchase.mutate({});
              setOpen(false);
            }}
          >
            Batalkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
