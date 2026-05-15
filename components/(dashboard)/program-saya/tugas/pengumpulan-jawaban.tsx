"use client";

import { FileText } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetData } from "@/hooks/use-get-data";
import { TAssignment } from "../../kelas/tugas/_types/tugas-type";
import PengumpulanEssay from "./pengumpulan-essay";
import PengumpulanFile from "./pengumpulan-file";

type Props = {
  batchSlug: string;
  assignmentId: string;
};

const PengumpulanJawaban = ({ batchSlug, assignmentId }: Props) => {
  const { data, isLoading, isError } = useGetData({
    queryKey: ["tugas", assignmentId],
    dataProtected: `assignments/${assignmentId}`,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="rounded-lg border bg-card p-5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-4 h-20 w-full" />
          <Skeleton className="mt-4 h-10 w-full" />
        </div>
        <div className="rounded-lg border bg-card p-5">
          <Skeleton className="h-5 w-56" />
          <Skeleton className="mt-4 h-64 w-full" />
          <Skeleton className="mt-4 h-10 w-40" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border bg-card p-6 text-sm text-destructive">
        Gagal memuat data tugas.
      </div>
    );
  }

  const tugas: TAssignment | undefined = data?.data?.data;
  if (!tugas) {
    return (
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        <FileText className="mb-3 size-5 text-primary" />
        Data tugas tidak ditemukan.
      </div>
    );
  }

  return tugas.type === "essay" ? (
    <PengumpulanEssay batchSlug={batchSlug} assignment={tugas} />
  ) : (
    <PengumpulanFile batchSlug={batchSlug} assignment={tugas} />
  );
};

export default PengumpulanJawaban;
