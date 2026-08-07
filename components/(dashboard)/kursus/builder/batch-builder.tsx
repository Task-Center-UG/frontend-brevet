"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  BookOpenCheck,
  CalendarClock,
  Edit,
  FileSpreadsheet,
  HelpCircle,
  ListChecks,
  Plus,
  Route,
  Trash2,
} from "lucide-react";

import NilaiDatatable from "@/components/(dashboard)/kelas/nilai/nilai-datatable";
import { TCourseBatch } from "@/components/(dashboard)/kursus/gelombang/_types/course-batch-type";
import { AbsensiDatatable } from "@/components/(dashboard)/kursus/gelombang/absensi/absensi-datatable";
import { TMeeting } from "@/components/(dashboard)/kursus/gelombang/pertemuan/_types/meeting-type";
import MateriDataTable from "@/components/(dashboard)/kursus/gelombang/pertemuan/materi/materi-datatable";
import QuizDatatable from "@/components/(dashboard)/kursus/gelombang/pertemuan/quiz/quiz-datatable";
import TugasDataTable from "@/components/(dashboard)/kursus/gelombang/pertemuan/tugas/tugas-datatable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDeleteData } from "@/hooks/use-delete-data";
import { useGetData } from "@/hooks/use-get-data";
import { cn } from "@/lib/utils";

type Props = {
  courseSlug: string;
  batchSlug: string;
};

type BuilderTab =
  | "pertemuan"
  | "absensi"
  | "materi"
  | "tugas"
  | "quiz"
  | "nilai";

const tabLabels: Record<BuilderTab, string> = {
  pertemuan: "Pertemuan",
  absensi: "Absensi",
  materi: "Materi",
  tugas: "Tugas",
  quiz: "Quiz",
  nilai: "Nilai",
};

const contentTabs: BuilderTab[] = ["materi", "tugas", "quiz", "nilai"];

const isBuilderTab = (value: string | null): value is BuilderTab =>
  ["pertemuan", "absensi", "materi", "tugas", "quiz", "nilai"].includes(
    value ?? "",
  );

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const tabTriggerClass =
  "h-10 flex-none gap-2 rounded-md border border-transparent px-4 text-muted-foreground hover:bg-muted data-[state=active]:border-[#2a176f] data-[state=active]:bg-[#2a176f] data-[state=active]:text-white data-[state=active]:shadow-sm";

export function BatchBuilder({ courseSlug, batchSlug }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: batchResp, isLoading: isLoadingBatch } = useGetData({
    queryKey: ["batch-builder-batch", batchSlug],
    dataProtected: `batches/${batchSlug}`,
  });

  const { data: meetingsResp, isLoading: isLoadingMeetings } = useGetData({
    queryKey: ["batch-builder-meetings", batchSlug],
    dataProtected: `batches/${batchSlug}/meetings?limit=100&sort=created_at&order=asc`,
  });

  const batch: TCourseBatch | undefined = batchResp?.data?.data;
  const meetingsData: TMeeting[] | undefined = meetingsResp?.data?.data;
  const meetings = useMemo(() => meetingsData ?? [], [meetingsData]);
  const isLoading = isLoadingBatch || isLoadingMeetings;
  const searchParamsString = searchParams.toString();
  const deleteBatch = useDeleteData({
    queryKey: "batches",
    dataProtected: `batches/${batch?.id ?? batchSlug}`,
    backUrl: `/dashboard/kursus/${courseSlug}/builder?tab=gelombang`,
    successMessage: "Gelombang berhasil dihapus!",
  });

  const rawTab = searchParams.get("tab");
  const activeTab: BuilderTab = isBuilderTab(rawTab) ? rawTab : "pertemuan";
  const selectedMeetingId =
    searchParams.get("meeting") ?? meetings[0]?.id ?? "";

  const selectedMeeting = useMemo(
    () => meetings.find((meeting) => meeting.id === selectedMeetingId),
    [meetings, selectedMeetingId],
  );

  const selectedMeetingIndex = useMemo(
    () => meetings.findIndex((meeting) => meeting.id === selectedMeetingId),
    [meetings, selectedMeetingId],
  );

  const updateBuilderQuery = (next: {
    tab?: BuilderTab;
    meeting?: string | null;
  }) => {
    const params = new URLSearchParams(searchParamsString);
    const currentMeeting = params.get("meeting");

    if (next.tab) params.set("tab", next.tab);
    if (next.meeting === null) params.delete("meeting");
    if (next.meeting) params.set("meeting", next.meeting);

    params.delete("page");
    if (next.meeting && next.meeting !== currentMeeting) {
      params.delete("search");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const openMeetingTab = (tab: BuilderTab, meetingId: string) => {
    updateBuilderQuery({ tab, meeting: meetingId });
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    const currentMeeting = params.get("meeting");
    const hasCurrentMeeting = meetings.some(
      (meeting) => meeting.id === currentMeeting,
    );

    if (meetings[0]?.id && (!currentMeeting || !hasCurrentMeeting)) {
      params.set("meeting", meetings[0].id);
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [meetings, pathname, router, searchParamsString]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  const addHrefByTab: Partial<Record<BuilderTab, string>> = {
    pertemuan: `/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/pertemuan/tambah`,
    materi: `/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/pertemuan/${selectedMeetingId}/materi/tambah`,
    tugas: `/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/pertemuan/${selectedMeetingId}/tugas/tambah`,
    quiz: `/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/pertemuan/${selectedMeetingId}/quiz/tambah`,
  };

  const addLabelByTab: Partial<Record<BuilderTab, string>> = {
    pertemuan: "Pertemuan",
    materi: "Materi",
    tugas: "Tugas",
    quiz: "Quiz",
  };

  return (
    <div className="space-y-5">
      <Card className="rounded-lg shadow-none">
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <Link href={`/dashboard/kursus/${courseSlug}/builder`}>
                <ArrowLeft className="h-4 w-4" />
                Builder Kursus
              </Link>
            </Button>
            <Badge variant="secondary">Batch Builder</Badge>
            <Badge variant="outline">{meetings.length} pertemuan</Badge>
          </div>
          <div>
            <CardTitle className="text-2xl leading-tight">
              {batch?.title ?? "Gelombang"}
            </CardTitle>
          </div>
          <CardAction className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <Link
                href={`/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/update`}
              >
                <Edit className="h-4 w-4" />
                Ubah Batch
              </Link>
            </Button>
            <Dialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-2 text-white"
                  disabled={!batch?.id || deleteBatch.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus Gelombang
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Konfirmasi Hapus</DialogTitle>
                  <DialogDescription>
                    Apakah kamu yakin ingin menghapus gelombang ini?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="ghost"
                    onClick={() => setDeleteDialogOpen(false)}
                    disabled={deleteBatch.isPending}
                  >
                    Batal
                  </Button>
                  <Button
                    variant="destructive"
                    className="text-white"
                    disabled={!batch?.id || deleteBatch.isPending}
                    onClick={() => {
                      deleteBatch.mutate(undefined, {
                        onSuccess: () => setDeleteDialogOpen(false),
                      });
                    }}
                  >
                    {deleteBatch.isPending ? "Menghapus..." : "Hapus"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {addHrefByTab[activeTab] && selectedMeetingId && (
              <Button variant="orange" size="sm" className="gap-2" asChild>
                <Link href={addHrefByTab[activeTab]}>
                  <Plus className="h-4 w-4" />
                  {addLabelByTab[activeTab]}
                </Link>
              </Button>
            )}
          </CardAction>
        </CardHeader>
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          updateBuilderQuery({ tab: value as BuilderTab })
        }
      >
        <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="h-fit self-start rounded-lg border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold">Pilih Pertemuan</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Konten di kanan mengikuti pertemuan aktif.
                </p>
              </div>
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <Link
                  href={`/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/pertemuan/tambah`}
                >
                  <Plus className="h-4 w-4" />
                  Baru
                </Link>
              </Button>
            </div>

            <div className="mt-4 space-y-2">
              {meetings.length === 0 ? (
                <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                  Belum ada pertemuan.
                </div>
              ) : (
                meetings.map((meeting, index) => {
                  const active = selectedMeetingId === meeting.id;
                  return (
                    <button
                      key={meeting.id}
                      type="button"
                      onClick={() =>
                        updateBuilderQuery({
                          tab: contentTabs.includes(activeTab)
                            ? activeTab
                            : "pertemuan",
                          meeting: meeting.id,
                        })
                      }
                      className={cn(
                        "w-full rounded-lg border p-3 text-left transition hover:bg-muted/60",
                        active && "border-primary bg-primary/5",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant={active ? "default" : "outline"}>
                          #{index + 1}
                        </Badge>
                        <span className="min-w-0 flex-1 truncate text-sm font-medium">
                          {meeting.title}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{meeting.meeting_type}</span>
                        <span>{formatDateTime(meeting.start_at)}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          <main className="min-w-0 space-y-4">
            <div className="rounded-lg border bg-[#2a176f]/5 p-2">
              <TabsList className="h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
                <TabsTrigger value="pertemuan" className={tabTriggerClass}>
                  <Route className="h-4 w-4" />
                  Pertemuan
                </TabsTrigger>
                <TabsTrigger value="absensi" className={tabTriggerClass}>
                  <FileSpreadsheet className="h-4 w-4" />
                  Absensi
                </TabsTrigger>
                <TabsTrigger value="materi" className={tabTriggerClass}>
                  <BookOpenCheck className="h-4 w-4" />
                  Materi
                </TabsTrigger>
                <TabsTrigger value="tugas" className={tabTriggerClass}>
                  <ListChecks className="h-4 w-4" />
                  Tugas
                </TabsTrigger>
                <TabsTrigger value="quiz" className={tabTriggerClass}>
                  <HelpCircle className="h-4 w-4" />
                  Quiz
                </TabsTrigger>
                <TabsTrigger value="nilai" className={tabTriggerClass}>
                  <BarChart3 className="h-4 w-4" />
                  Nilai
                </TabsTrigger>
              </TabsList>
            </div>

            {contentTabs.includes(activeTab) && selectedMeeting && (
              <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">
                      Pertemuan #{selectedMeetingIndex + 1}
                    </Badge>
                    <Badge variant="secondary">{tabLabels[activeTab]}</Badge>
                  </div>
                  <h2 className="mt-2 truncate text-base font-semibold">
                    {selectedMeeting.title}
                  </h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <CalendarClock className="h-3.5 w-3.5" />
                    <span>{formatDateTime(selectedMeeting.start_at)}</span>
                    <span>sampai</span>
                    <span>{formatDateTime(selectedMeeting.end_at)}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <Link
                    href={`/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/pertemuan/${selectedMeeting.id}/update`}
                  >
                    <Edit className="h-4 w-4" />
                    Ubah Data
                  </Link>
                </Button>
              </div>
            )}

            <TabsContent value="pertemuan" className="mt-0">
              <div className="rounded-lg border bg-card">
                <div className="border-b p-4">
                  <h2 className="text-base font-semibold">Pertemuan</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Kelola data pertemuan, lalu buka materi, tugas, quiz, atau
                    nilai dari baris yang sama.
                  </p>
                </div>
                <div className="space-y-3 p-4">
                  {meetings.length === 0 ? (
                    <div className="flex min-h-44 flex-col items-center justify-center rounded-lg border border-dashed text-center">
                      <Route className="mb-3 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">Belum ada pertemuan</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Tambah pertemuan untuk mulai isi materi, tugas, dan
                        quiz.
                      </p>
                      <Button className="mt-4 gap-2" variant="orange" asChild>
                        <Link
                          href={`/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/pertemuan/tambah`}
                        >
                          <Plus className="h-4 w-4" />
                          Tambah Pertemuan
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    meetings.map((meeting, index) => (
                      <div
                        key={meeting.id}
                        className={cn(
                          "grid gap-3 rounded-lg border p-4 xl:grid-cols-[minmax(0,1fr)_auto]",
                          selectedMeetingId === meeting.id &&
                            "border-primary bg-primary/5",
                        )}
                      >
                        <div className="min-w-0 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline">#{index + 1}</Badge>
                            <h3 className="truncate text-sm font-semibold">
                              {meeting.title}
                            </h3>
                            <Badge variant="secondary">
                              {meeting.meeting_type}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span>{formatDateTime(meeting.start_at)}</span>
                            <span>{formatDateTime(meeting.end_at)}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            asChild
                          >
                            <Link
                              href={`/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/pertemuan/${meeting.id}/update`}
                            >
                              <Edit className="h-4 w-4" />
                              Data
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => openMeetingTab("materi", meeting.id)}
                          >
                            <BookOpenCheck className="h-4 w-4" />
                            Materi
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => openMeetingTab("tugas", meeting.id)}
                          >
                            <ListChecks className="h-4 w-4" />
                            Tugas
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => openMeetingTab("quiz", meeting.id)}
                          >
                            <HelpCircle className="h-4 w-4" />
                            Quiz
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => openMeetingTab("nilai", meeting.id)}
                          >
                            <BarChart3 className="h-4 w-4" />
                            Nilai
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="absensi" className="mt-0">
              <AbsensiDatatable batchSlug={batchSlug} />
            </TabsContent>

            <TabsContent value="materi" className="mt-0">
              <BuilderMeetingScope
                selectedMeeting={selectedMeeting}
                tab="materi"
              >
                {activeTab === "materi" && (
                  <MateriDataTable
                    key={`materi-${selectedMeetingId}`}
                    batchSlug={batchSlug}
                    meetingId={selectedMeetingId}
                  />
                )}
              </BuilderMeetingScope>
            </TabsContent>

            <TabsContent value="tugas" className="mt-0">
              <BuilderMeetingScope
                selectedMeeting={selectedMeeting}
                tab="tugas"
              >
                {activeTab === "tugas" && (
                  <TugasDataTable
                    key={`tugas-${selectedMeetingId}`}
                    batchSlug={batchSlug}
                    meetingId={selectedMeetingId}
                  />
                )}
              </BuilderMeetingScope>
            </TabsContent>

            <TabsContent value="quiz" className="mt-0">
              <BuilderMeetingScope selectedMeeting={selectedMeeting} tab="quiz">
                {activeTab === "quiz" && (
                  <QuizDatatable
                    key={`quiz-${selectedMeetingId}`}
                    batchSlug={batchSlug}
                    meetingId={selectedMeetingId}
                  />
                )}
              </BuilderMeetingScope>
            </TabsContent>

            <TabsContent value="nilai" className="mt-0">
              <BuilderMeetingScope
                selectedMeeting={selectedMeeting}
                tab="nilai"
              >
                {activeTab === "nilai" && (
                  <NilaiDatatable
                    key={`nilai-${selectedMeetingId}`}
                    batchSlug={batchSlug}
                    meetingId={selectedMeetingId}
                  />
                )}
              </BuilderMeetingScope>
            </TabsContent>
          </main>
        </div>
      </Tabs>
    </div>
  );
}

function BuilderMeetingScope({
  children,
  selectedMeeting,
  tab,
}: {
  children: ReactNode;
  selectedMeeting?: TMeeting;
  tab: BuilderTab;
}) {
  if (!selectedMeeting) {
    return (
      <div className="flex min-h-44 flex-col items-center justify-center rounded-lg border bg-card text-center">
        <p className="text-sm font-medium">Pertemuan belum dipilih</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Pilih pertemuan untuk melihat {tabLabels[tab].toLowerCase()}.
        </p>
      </div>
    );
  }

  return <div className="min-w-0">{children}</div>;
}
