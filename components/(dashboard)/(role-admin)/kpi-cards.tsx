"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity as ActivityIcon,
  Banknote,
  ReceiptText,
  Users,
} from "lucide-react";
import { formatPercent, formatRupiah } from "./_libs/format";
import { ToneBar } from "./_libs/tone-bar";
import type { AdminDashboard } from "./_types/admin-dashboard";

export default function KpiCards({
  summary,
}: {
  summary: AdminDashboard["summary"];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="relative overflow-hidden">
        <ToneBar tone="warning" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Pendapatan
          </CardTitle>
          <Banknote className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatRupiah(summary.totalRevenue)}
          </div>
          <p className="text-xs text-muted-foreground">
            Akumulasi {summary.range}
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <ToneBar tone="warning" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Peserta Aktif</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.activeStudents}</div>
          <p className="text-xs text-muted-foreground">
            Dalam {summary.activeBatches} batch
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <ToneBar tone="warning" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pembelian Baru</CardTitle>
          <ReceiptText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.newPurchases}</div>
          <p className="text-xs text-muted-foreground">Dalam {summary.range}</p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <ToneBar tone="warning" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tingkat Penyelesaian
          </CardTitle>
          <ActivityIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatPercent(summary.completionRate)}
          </div>
          <p className="text-xs text-muted-foreground">
            Kelulusan dari total peserta aktif
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
