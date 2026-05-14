"use client";

import { useDeleteData } from "@/hooks/use-delete-data";
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
import {
  Trash2,
  MoreHorizontal,
  Blinds,
  FileSpreadsheet,
  Route,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Props = {
  batchId: string;
  batchSlug: string;
};

export function BatchAction({ batchId, batchSlug }: Props) {
  const params = useParams();
  const courseSlug = params.slug as string;

  const [open, setOpen] = useState(false);

  const deleteBatch = useDeleteData({
    queryKey: "batches",
    dataProtected: `batches/${batchId}`,
    successMessage: "Batch berhasil dihapus!",
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
            <Link href={`/kursus/${batchSlug}`}>Lihat Detail</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/update`}
            >
              Ubah Data
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/builder`}
            >
              <Route className="mr-2 h-4 w-4 text-blue-600" />
              <span className="text-blue-600">Buka Builder</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/builder?tab=pertemuan`}
            >
              <Blinds className="mr-2 h-4 w-4 text-purple-600" />
              <span className="text-purple-600">Lihat Pertemuan</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/builder?tab=absensi`}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4 text-orange-600" />
              <span className="text-orange-600">Lihat Absensi</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Trash2 className="mr-2 h-4 w-4 text-red-600" />
              <span className="text-red-600">Hapus</span>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Konfirmasi Hapus</DialogTitle>
          <DialogDescription>
            Apakah kamu yakin ingin menghapus gelombang ini?
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
              deleteBatch.mutate();
              setOpen(false);
            }}
          >
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
