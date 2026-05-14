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
import { Trash2, MoreHorizontal, BookImage, BookLock } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

type Props = {
  quizId: string;
};

export function QuizAction({ quizId }: Props) {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const searchParams = useSearchParams();
  const courseSlug = params.slug as string;
  const batchSlug = params.batchSlug as string;
  const pertemuanId =
    (params.pertemuanId as string | undefined) ?? searchParams.get("meeting");

  const deleteQuiz = useDeleteData({
    queryKey: "quizzes",
    dataProtected: `quizzes/${quizId}`,
    successMessage: "Quiz berhasil dihapus!",
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
              href={`/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/pertemuan/${pertemuanId}/quiz/${quizId}/update`}
            >
              Ubah Data
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/pertemuan/${pertemuanId}/quiz/${quizId}/upload`}
            >
              <BookImage className="mr-2 h-4 w-4 text-purple-600" />
              <span className="text-purple-600">Upload Soal</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/pertemuan/${pertemuanId}/quiz/${quizId}`}
            >
              <BookLock className="mr-2 h-4 w-4 text-blue-600" />
              <span className="text-blue-600">Lihat Soal</span>
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
            Apakah kamu yakin ingin menghapus quiz ini?
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
              deleteQuiz.mutate();
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
