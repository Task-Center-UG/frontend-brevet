"use client";

import type { ElementType } from "react";
import {
  BookOpenCheck,
  ClipboardList,
  FileQuestion,
  Layers3,
} from "lucide-react";

import NotFoundContent from "@/components/(main)/not-found-content";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetData } from "@/hooks/use-get-data";
import type { TUser } from "../profile/_types/user-type";
import KelasCard from "./kelas-card";
import type { TBatchMeeting } from "./_types/kelas-pertemuan-type";

type Props = { batchSlug: string };

const KelasPertemuan = ({ batchSlug }: Props) => {
  const { data: myProfileData } = useGetData({
    queryKey: ["me"],
    dataProtected: "users/me",
  });
  const user: TUser | undefined = myProfileData?.data?.data;

  const { data, isLoading } = useGetData({
    queryKey: ["meetings", batchSlug],
    dataProtected: `batches/${batchSlug}/meetings?limit=30&sort=created_at&order=asc`,
  });

  const meetings: TBatchMeeting[] = data?.data?.data ?? [];
  const materialCount = meetings.reduce(
    (total, meeting) => total + meeting.materials.length,
    0,
  );
  const assignmentCount = meetings.reduce(
    (total, meeting) => total + meeting.assignments.length,
    0,
  );
  const quizCount = meetings.reduce(
    (total, meeting) => total + (meeting.quizzes?.length ?? 0),
    0,
  );

  return (
    <div className="space-y-6">
      <section className="rounded-lg border bg-card p-5 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Workspace Kelas
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-normal">
              Pertemuan
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Buka materi, kerjakan tugas, ikuti quiz, dan lihat aktivitas kelas
              dari satu alur yang sama untuk siswa dan guru.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <SummaryTile
              icon={BookOpenCheck}
              label="Materi"
              value={materialCount}
            />
            <SummaryTile
              icon={ClipboardList}
              label="Tugas"
              value={assignmentCount}
            />
            <SummaryTile icon={FileQuestion} label="Quiz" value={quizCount} />
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-lg border bg-card p-5">
              <Skeleton className="h-5 w-52" />
              <Skeleton className="mt-3 h-4 w-full max-w-xl" />
              <div className="mt-5 grid gap-3 lg:grid-cols-3">
                <Skeleton className="h-32 rounded-md" />
                <Skeleton className="h-32 rounded-md" />
                <Skeleton className="h-32 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : meetings.length === 0 ? (
        <NotFoundContent
          title="Belum ada pertemuan"
          message="Pertemuan akan tampil setelah admin atau guru menambahkan struktur kelas."
          icon={<Layers3 className="size-7" />}
        />
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting, index) => (
            <KelasCard
              key={meeting.id}
              meeting={meeting}
              batchSlug={batchSlug}
              currentUser={user}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default KelasPertemuan;

function SummaryTile({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-md border bg-background p-3">
      <Icon className="size-4 text-primary" />
      <p className="mt-3 text-xl font-extrabold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
