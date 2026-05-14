"use client";

import { useGetData } from "@/hooks/use-get-data";
import React from "react";
import { TAssignment } from "../../kelas/tugas/_types/tugas-type";
import PengumpulanEssay from "./pengumpulan-essay";
import PengumpulanFile from "./pengumpulan-file";
import { Skeleton } from "@/components/ui/skeleton";

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
      <div className="space-y-4">
        <div className="space-y-3">
          <Skeleton className="h-6 w-[40%] max-w-[320px]" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[85%]" />
            <Skeleton className="h-4 w-[70%]" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-28 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-sm text-destructive">Gagal memuat data tugas.</div>
    );
  }

  const tugas: TAssignment | undefined = data?.data?.data;
  if (!tugas) return <div>Data tugas tidak ditemukan.</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{tugas.title}</h2>
      <p className="text-sm text-muted-foreground">{tugas.description}</p>

      {tugas.type === "essay" ? (
        <PengumpulanEssay batchSlug={batchSlug} assignment={tugas} />
      ) : (
        <PengumpulanFile batchSlug={batchSlug} assignment={tugas} />
      )}
    </div>
  );
};

export default PengumpulanJawaban;
