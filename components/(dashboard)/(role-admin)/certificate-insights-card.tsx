"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { ToneBar } from "./_libs/tone-bar";
import type { AdminDashboard } from "./_types/admin-dashboard";

export default function CertificateInsightsCard({
  data,
}: {
  data: AdminDashboard["certInsights"];
}) {
  return (
    <Card className="relative overflow-hidden">
      <ToneBar tone="primary" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sertifikat & Verifikasi</CardTitle>
            <CardDescription>Aktivitas 30 hari terakhir</CardDescription>
          </div>
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">Diterbitkan</p>
            <p className="text-2xl font-bold">{data.certGenerated}</p>
          </div>
          <div className="rounded-xl border p-3">
            <p className="text-xs text-muted-foreground">Pemeriksaan Publik</p>
            <p className="text-2xl font-bold">{data.publicVerifications}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
