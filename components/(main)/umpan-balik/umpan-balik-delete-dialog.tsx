"use client";

import { useState } from "react";
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
import { Trash2 } from "lucide-react";
import { useDeleteData } from "@/hooks/use-delete-data";

export function UmpanBalikDeleteDialog({
  feedbackId,
  onSuccess,
}: {
  feedbackId: string;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);

  const del = useDeleteData({
    queryKey: "testimonials",
    dataProtected: `testimonials/${feedbackId}`,
    successMessage: "Umpan balik berhasil dihapus!",
  });

  const onDelete = () => {
    del.mutate(undefined, {
      onSuccess: () => {
        setOpen(false);
        onSuccess?.();
      },
      onSettled: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="h-8 px-2">
          <Trash2 className="h-4 w-4 text-white" />
          <span className="sr-only">Hapus</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Hapus Umpan Balik</DialogTitle>
          <DialogDescription>
            Tindakan ini tidak dapat dibatalkan. Yakin ingin menghapus umpan
            balik ini?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button
            variant="destructive"
            className="text-white"
            onClick={onDelete}
            disabled={del.isPending}
          >
            {del.isPending ? "Menghapus…" : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
