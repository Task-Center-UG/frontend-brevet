"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { formatRupiah } from "./_libs/format";
import { statusLabel } from "./_libs/constants";
import { ToneBar } from "./_libs/tone-bar";
import type { AdminDashboard } from "./_types/admin-dashboard";
import Link from "next/link";

export default function PaymentsWatchlist({
  payments,
}: {
  payments: AdminDashboard["payments"];
}) {
  return (
    <Card className="relative overflow-hidden">
      <ToneBar tone="warning" />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Daftar Pantauan Pembayaran</CardTitle>
            <CardDescription>Perlu verifikasi/tindak lanjut</CardDescription>
          </div>
          <Button size="sm" variant="outline" className="gap-1" asChild>
            <Link href="/dashboard/transaksi">
              Lihat Semua <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {payments.map((p) => (
            <li
              key={p.purchaseId}
              className="flex items-start justify-between gap-3 rounded-xl border bg-background/60 p-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium leading-tight">
                  {p.user.name}{" "}
                  <span className="text-muted-foreground">• {p.batchSlug}</span>
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {p.user.email}
                </p>
                <div className="mt-1 text-xs text-foreground/80">
                  {formatRupiah(p.amount)}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge
                  className={[
                    "rounded-full px-2.5 py-0.5 text-[11px]",
                    p.status === "failed" && "bg-destructive text-white",
                    p.status === "paid" && "bg-green-500 text-white",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {statusLabel[p.status ?? "pending"]}
                </Badge>
                <div className="flex gap-2">
                  <Button size="xs" variant="outline" asChild>
                    <Link
                      href={`/dashboard/transaksi/${p.purchaseId}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Lihat Bukti
                    </Link>
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
