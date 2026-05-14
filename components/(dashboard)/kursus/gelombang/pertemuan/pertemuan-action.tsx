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
  BookOpenCheck,
  ListChecks,
  HelpCircle,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Props = {
  meetingId: string;
};

export function MeetingAction({ meetingId }: Props) {
  const params = useParams();
  const courseSlug = params.slug as string;
  const batchSlug = params.batchSlug as string;

  const [open, setOpen] = useState(false);

  const deleteMeeting = useDeleteData({
    queryKey: "meetings",
    dataProtected: `meetings/${meetingId}`,
    successMessage: "Pertemuan berhasil dihapus!",
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
            <Link
              href={`/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/pertemuan/${meetingId}/update`}
            >
              Ubah Data
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/builder?tab=materi&meeting=${meetingId}`}
            >
              <BookOpenCheck className="mr-2 h-4 w-4 text-purple-600" />
              <span className="text-purple-600">Lihat Materi</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/builder?tab=tugas&meeting=${meetingId}`}
            >
              <ListChecks className="mr-2 h-4 w-4 text-orange-600" />
              <span className="text-orange-600">Lihat Tugas</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/builder?tab=quiz&meeting=${meetingId}`}
            >
              <HelpCircle className="mr-2 h-4 w-4 text-blue-600" />
              <span className="text-blue-600">Lihat Quiz</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/builder?tab=nilai&meeting=${meetingId}`}
            >
              <BarChart3 className="mr-2 h-4 w-4 text-green-600" />
              <span className="text-green-600">Lihat Nilai</span>
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
            Apakah kamu yakin ingin menghapus pertemuan ini?
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
              deleteMeeting.mutate();
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
