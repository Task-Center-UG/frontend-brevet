"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  ClipboardList,
  UserCheck,
  FileCheck2,
  ArrowRight,
} from "lucide-react";
import { ToneBar } from "../(role-admin)/_libs/tone-bar";
import { useGetData } from "@/hooks/use-get-data";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

function StatCard({
  title,
  icon,
  value,
  subtitle,
  tone = "primary" as "primary" | "warning" | "danger",
  isLoading,
}: {
  title: string;
  icon: React.ReactNode;
  value: React.ReactNode;
  subtitle?: string;
  tone?: "primary" | "warning" | "danger";
  isLoading?: boolean;
}) {
  return (
    <Card className="relative overflow-hidden">
      <ToneBar tone={tone} />
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton className="h-7 w-24 mb-2" />
            <Skeleton className="h-4 w-36" />
          </>
        ) : (
          <>
            <p className="text-2xl font-semibold">{value}</p>
            {subtitle ? (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function ScheduleItemSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="space-y-2 w-full">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-72" />
      </div>
      <Skeleton className="h-8 w-28 rounded-md" />
    </div>
  );
}

const DashboardRoleGuru = ({ isLoading: externalLoading }: { isLoading?: boolean }) => {
  const {
    data: teacherData,
    isLoading: loadingTeacher,
    isError: isErrorTeacher,
  } = useGetData({
    queryKey: ["teacher-dashboard"],
    dataProtected: "dashboard/teacher",
  });

  const isLoading = externalLoading || loadingTeacher;

  const data = teacherData?.data?.data;

  const stats = data
    ? {
        totalCourses: data.total_courses ?? 0,
        activeCourses: data.active_courses ?? 0,
        activeStudents: data.active_students ?? 0,
        ongoingTasks: data.ongoing_tasks ?? 0,
        pendingGrading: data.pending_grading ?? 0,
        totalUpcoming: data.total_upcoming ?? 0,
        upcomingSchedules: (data.upcoming_schedules ?? []) as Array<{
          meeting_id: string;
          meeting_title: string;
          batch_slug: string;
          batch_title: string;
          course_title?: string;
          start_at: string;
          end_at: string;
          location?: string | null;
          meeting_link?: string | null;
        }>,
      }
    : null;

  if (isErrorTeacher) {
    return (
      <Card className="p-6">
        <p className="text-center text-destructive">
          Gagal memuat data dashboard. Silakan coba lagi nanti.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Kursus"
          icon={<BookOpen className="w-5 h-5" />}
          value={stats?.totalCourses ?? 0}
          subtitle="Kursus aktif"
          tone="primary"
          isLoading={isLoading}
        />
        <StatCard
          title="Mahasiswa"
          icon={<UserCheck className="w-5 h-5" />}
          value={stats?.activeStudents ?? 0}
          subtitle="Aktif di kursus Anda"
          tone="primary"
          isLoading={isLoading}
        />
        <StatCard
          title="Tugas Berjalan"
          icon={<ClipboardList className="w-5 h-5" />}
          value={stats?.ongoingTasks ?? 0}
          subtitle="Belum selesai"
          tone="warning"
          isLoading={isLoading}
        />
        <StatCard
          title="Butuh Dinilai"
          icon={<FileCheck2 className="w-5 h-5" />}
          value={stats?.pendingGrading ?? 0}
          subtitle="Submission menunggu"
          tone="danger"
          isLoading={isLoading}
        />
      </div>

      <Card className="relative overflow-hidden lg:col-span-2">
        <ToneBar tone="primary" />
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Jadwal Mengajar Terdekat</CardTitle>
            <CardDescription>
              {stats?.totalUpcoming ?? 0} jadwal berikutnya
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <>
              <ScheduleItemSkeleton />
              <ScheduleItemSkeleton />
            </>
          ) : stats?.upcomingSchedules.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Tidak ada jadwal mengajar mendatang.
            </p>
          ) : (
            stats?.upcomingSchedules.map((s) => (
              <div
                key={s.meeting_id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="space-y-0.5">
                  <div className="font-medium">
                    {s.course_title || s.batch_title} •{" "}
                    <span className="text-muted-foreground">{s.batch_title}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {fmtDate(s.start_at)} – {fmtDate(s.end_at)}
                    {s.location ? ` • ${s.location}` : ""}
                    {s.meeting_link ? ` • Online` : ""}
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  Masuk Kelas <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardRoleGuru;
