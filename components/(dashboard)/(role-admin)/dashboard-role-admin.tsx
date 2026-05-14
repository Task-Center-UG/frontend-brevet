"use client";

import * as React from "react";
import HeaderRangeFilter from "./header-range-filter";
import KpiCards from "./kpi-cards";
import ComposedTrend from "./composed-trend";
import PaymentsWatchlist from "./payments-watchlist";
import BatchHealthTable from "./batch-health-table";
import TeacherWorkloadCard from "./teacher-workload-card";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { mockData } from "./_libs/mock-data";
import { dateToLabel } from "./_libs/format";
import type { AdminDashboard } from "./_types/admin-dashboard";
import { useGetData } from "@/hooks/use-get-data";

export default function DashboardRoleAdmin() {
  const [range, setRange] = React.useState<"7d" | "30d" | "90d">("30d");

  const baseData: AdminDashboard | undefined = mockData(range);

  const {
    data: adminStatsData,
    isLoading: loadingAdminStats,
    isError: isErrorStats,
  } = useGetData({
    queryKey: ["admin-stats", range],
    dataProtected: `dashboard/admin?range=${range}`,
  });

  const {
    data: pendingPaymentsData,
    isLoading: loadingPendingPayments,
    isError: isErrorPayments,
  } = useGetData({
    queryKey: ["admin-pending-payments", range],
    dataProtected: `dashboard/admin/pending-payments?range=${range}`,
  });

  const {
    data: batchProgressData,
    isLoading: loadingBatchProgress,
    isError: isErrorBatchProgress,
  } = useGetData({
    queryKey: ["admin-batch-progress", range],
    dataProtected: `dashboard/admin/batch-progress?range=${range}`,
  });

  const {
    data: teacherWorkloadData,
    isLoading: loadingTeacherWorkload,
    isError: isErrorTeacherWorkload,
  } = useGetData({
    queryKey: ["dashboard/admin/teacher-workload", range],
    dataProtected: `dashboard/admin/teacher-workload?range=${range}`,
  });

  const {
    data: revenueChartData,
    isLoading: loadingRevenueChart,
    isError: isErrorRevenueChart,
  } = useGetData({
    queryKey: ["dashboard/admin/revenue-chart", range],
    dataProtected: `dashboard/admin/revenue-chart?range=${range}`,
  });

  if (
    loadingAdminStats ||
    loadingPendingPayments ||
    loadingBatchProgress ||
    loadingTeacherWorkload ||
    loadingRevenueChart
  ) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="relative overflow-hidden p-4">
              <Skeleton className="mb-4 h-5 w-24" />
              <Skeleton className="h-8 w-32" />
            </Card>
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="p-4 lg:col-span-2">
            <Skeleton className="h-64 w-full" />
          </Card>
          <Card className="p-4">
            <Skeleton className="h-64 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  if (
    isErrorStats ||
    isErrorPayments ||
    isErrorBatchProgress ||
    isErrorTeacherWorkload ||
    isErrorRevenueChart
  ) {
    return (
      <Card className="p-6">
        <p className="text-center text-destructive">
          Gagal memuat data dashboard. Silakan coba lagi nanti.
        </p>
      </Card>
    );
  }

  if (!baseData) return null;

  const summaryApiData = adminStatsData?.data?.data;

  const summary: AdminDashboard["summary"] = summaryApiData
    ? {
        totalRevenue: summaryApiData.total_revenue,
        newPurchases: summaryApiData.new_purchases,
        activeBatches: summaryApiData.active_batches,
        activeStudents: summaryApiData.active_participants,
        completionRate: summaryApiData.completion_rate / 100,
        range: summaryApiData.period as "7d" | "30d" | "90d",
      }
    : baseData.summary;

  const paymentsApiData = pendingPaymentsData?.data?.data?.data;

  const payments: AdminDashboard["payments"] = paymentsApiData
    ? (paymentsApiData as any[]).map((p: any) => ({
        purchaseId: p.purchase_id,
        user: {
          name: p.user_name,
          email: p.user_email,
        },
        batchSlug: p.batch_slug,
        amount: p.amount,
        proofUrl: p.payment_proof ?? undefined,
        uploadedAt: p.created_at,
        status: p.payment_status,
      }))
    : baseData.payments;

  const batchHealthApiData = batchProgressData?.data?.data?.data;

  const batchHealth: AdminDashboard["batchHealth"] = batchHealthApiData
    ? (batchHealthApiData as any[]).map((b: any) => ({
        batchSlug: b.batch_slug,
        courseName: b.course_title,
        quota: b.quota,
        enrolled: b.enrolled,
        remaining: b.quota - b.enrolled,
        avgProgress: (b.avg_progress ?? 0) / 100,
        nextEvent:
          b.next_activity_type && b.next_activity_title
            ? {
                type: b.next_activity_type as "meeting" | "assignment" | "quiz",
                title: b.next_activity_title,
                dueAt: b.next_activity_date ?? undefined,
              }
            : undefined,
      }))
    : baseData.batchHealth;

  const teacherWorkloadApiData = teacherWorkloadData?.data?.data?.data;

  const teacherWorkload: AdminDashboard["teacherWorkload"] =
    teacherWorkloadApiData
      ? (teacherWorkloadApiData as any[]).map((t: any) => ({
          teacherId: t.teacher_id,
          name: t.teacher_name,
          meetings: t.meeting_count,
          toGrade: t.pending_grading_count,
          hours: t.total_hours,
        }))
      : baseData.teacherWorkload;

  const revenueChartApiData = revenueChartData?.data?.data?.data;

  const mergedTrend = revenueChartApiData
    ? (revenueChartApiData as any[]).map((r: any) => ({
        date: dateToLabel(r.date),
        amount: r.revenue,
        count: 0,
      }))
    : baseData.trends.revenueByDay.map((r, i) => ({
        date: dateToLabel(r.date),
        amount: r.amount,
        count: baseData.trends.purchasesByDay[i]?.count ?? 0,
      }));

  return (
    <div className="space-y-6">
      <HeaderRangeFilter range={range} onChange={setRange} />

      <KpiCards summary={summary} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ComposedTrend data={mergedTrend} rangeLabel={summary.range} />
        </div>
        <PaymentsWatchlist payments={payments} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BatchHealthTable items={batchHealth} />
        </div>
        <TeacherWorkloadCard items={teacherWorkload} />
      </div>
    </div>
  );
}
