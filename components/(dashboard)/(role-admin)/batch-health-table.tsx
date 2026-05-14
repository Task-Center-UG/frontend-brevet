"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToneBar } from "./_libs/tone-bar";
import type { AdminDashboard } from "./_types/admin-dashboard";
import { formatPercent } from "./_libs/format";
import Link from "next/link";

export default function BatchHealthTable({
  items,
}: {
  items: AdminDashboard["batchHealth"];
}) {
  return (
    <Card className="relative overflow-hidden">
      <ToneBar tone="primary" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Kursus</CardTitle>
            <CardDescription>Rata-rata progress</CardDescription>
          </div>
          <Link
            href="/dashboard/kursus"
            className="text-sm underline underline-offset-4"
          >
            Lihat Semua
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch</TableHead>
                <TableHead>Kursus</TableHead>
                <TableHead className="text-right">Kuota</TableHead>
                <TableHead className="text-right">Terdaftar</TableHead>
                <TableHead className="text-right">Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((b) => (
                <TableRow key={b.batchSlug} className="hover:bg-muted/40">
                  <TableCell className="font-medium">{b.batchSlug}</TableCell>
                  <TableCell>{b.courseName}</TableCell>
                  <TableCell className="text-right">{b.quota}</TableCell>
                  <TableCell className="text-right">{b.enrolled}</TableCell>
                  <TableCell className="text-right">
                    {formatPercent(b.avgProgress)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
