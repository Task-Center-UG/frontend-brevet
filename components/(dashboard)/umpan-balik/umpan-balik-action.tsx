"use client";

import { useState } from "react";
import { Trash2, MoreHorizontal } from "lucide-react";

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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  testimonialId: string;
};

export function UmpanBalikAction({ testimonialId }: Props) {
  const [open, setOpen] = useState(false);

  const deleteTestimonial = useDeleteData({
    queryKey: "testimonials",
    dataProtected: `testimonials/${testimonialId}`,
    successMessage: "Umpan balik berhasil dihapus!",
  });

  const isLoading = deleteTestimonial.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            aria-label="Aksi testimonial"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DialogTrigger asChild>
            <DropdownMenuItem disabled={isLoading}>
              <Trash2 className="mr-2 h-4 w-4 text-red-600" />
              <span className="text-red-600">Hapus</span>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Hapus Umpan Balik</DialogTitle>
          <DialogDescription>
            Aksi ini tidak dapat dibatalkan. Umpan balik akan dihapus permanen.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            className="text-white"
            disabled={isLoading}
            onClick={() => {
              deleteTestimonial.mutate(undefined, {
                onSuccess: () => {
                  setOpen(false);
                },
              });
            }}
          >
            {isLoading ? "Menghapus…" : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
