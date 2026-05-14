"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToneBar } from "./_libs/tone-bar";
import type { AdminDashboard } from "./_types/admin-dashboard";
import Link from "next/link";

export default function TeacherWorkloadCard({
  items,
}: {
  items: AdminDashboard["teacherWorkload"];
}) {
  return (
    <Card className="relative overflow-hidden">
      <ToneBar tone="primary" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Beban Pengajar</CardTitle>
            <CardDescription>Minggu ini</CardDescription>
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link href="/dashboard/pengajar">Kelola</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {items.map((t) => (
            <li
              key={t.teacherId}
              className="flex items-center justify-between rounded-xl border bg-background/60 p-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium leading-tight">{t.name}</p>
                <p className="text-xs text-muted-foreground">
                  {t.meetings} pertemuan • {t.hours} jam
                </p>
              </div>
              <Badge className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] text-primary">
                {t.toGrade} perlu dinilai
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
