"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

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
        <Button
          variant="destructive"
          size="sm"
          className="rounded-full text-white"
        >
          <Trash2 data-icon="inline-start" />
          Hapus
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
            {del.isPending ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
