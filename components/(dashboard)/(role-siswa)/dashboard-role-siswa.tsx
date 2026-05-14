"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import UpcomingTasksCard from "./upcoming-tasks";
import { ToneBar } from "../(role-admin)/_libs/tone-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetData } from "@/hooks/use-get-data";

function KPIStatSkeleton() {
  return (
    <Card className="relative overflow-hidden">
      <ToneBar tone="primary" />
      <CardHeader>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-40 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20 mb-2" />
      </CardContent>
    </Card>
  );
}

function ChartSkeleton() {
  return (
    <Card className="relative overflow-hidden">
      <ToneBar tone="primary" />
      <CardHeader>
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-3 w-52 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[400px] w-full" />
      </CardContent>
    </Card>
  );
}

function UpcomingSkeletonCard() {
  return (
    <Card className="relative overflow-hidden">
      <ToneBar tone="danger" />
      <CardHeader>
        <Skeleton className="h-5 w-56" />
        <Skeleton className="h-3 w-40 mt-2" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

const DashboardRoleSiswa = ({ isLoading: externalLoading = false }: { isLoading?: boolean }) => {
  const {
    data: studentData,
    isLoading: loadingStudent,
  } = useGetData({
    queryKey: ["student-dashboard"],
    dataProtected: "dashboard/student",
  });

  const isLoading = externalLoading || loadingStudent;

  const student = studentData?.data?.data;

  const stats = student
    ? {
        totalCourses: student.total_courses ?? 0,
        activeCourses: student.active_courses ?? 0,
        avgProgress: student.avg_progress ?? 0,
        totalCertificates: student.total_certificates ?? 0,
        upcomingTasks: student.upcoming_tasks ?? 0,
      }
    : null;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {isLoading ? (
          <>
            <KPIStatSkeleton />
            <KPIStatSkeleton />
            <KPIStatSkeleton />
            <KPIStatSkeleton />
          </>
        ) : (
          <>
            <Card className="relative overflow-hidden">
              <ToneBar tone="primary" />
              <CardHeader>
                <CardTitle>Total Kursus</CardTitle>
                <CardDescription>Kelas aktif saat ini</CardDescription>
              </CardHeader>
              <CardContent className="text-3xl font-semibold">
                {stats?.totalCourses ?? 0}
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <ToneBar tone="primary" />
              <CardHeader>
                <CardTitle>Progress Rata-rata</CardTitle>
                <CardDescription>Dari seluruh kursus</CardDescription>
              </CardHeader>
              <CardContent className="text-3xl font-semibold">
                {Math.round(stats?.avgProgress ?? 0)}%
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <ToneBar tone="warning" />
              <CardHeader>
                <CardTitle>Sertifikat</CardTitle>
                <CardDescription>Telah diverifikasi</CardDescription>
              </CardHeader>
              <CardContent className="text-3xl font-semibold">
                {stats?.totalCertificates ?? 0}
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <ToneBar tone="danger" />
              <CardHeader>
                <CardTitle>Tugas / Kuis Mendatang</CardTitle>
                <CardDescription>Dalam 7 hari</CardDescription>
              </CardHeader>
              <CardContent className="text-3xl font-semibold">
                {stats?.upcomingTasks ?? 0}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <Card className="relative overflow-hidden">
          <ToneBar tone="primary" />
          <CardHeader>
            <CardTitle>Perkembangan Nilai per Pertemuan</CardTitle>
            <CardDescription>Perbandingan nilai tugas dan kuis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">
              Belum ada data nilai untuk ditampilkan.
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <UpcomingSkeletonCard />
      ) : (
        <UpcomingTasksCard
          items={[]}
          title="Tugas & Kuis Mendatang"
          description="Jadwal 7 hari ke depan"
        />
      )}
    </div>
  );
};

export default DashboardRoleSiswa;
