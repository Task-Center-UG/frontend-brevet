"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Edit,
  Eye,
  Layers3,
  ListChecks,
  Plus,
  Route,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetData } from "@/hooks/use-get-data";
import { TCourse } from "@/components/(dashboard)/kursus/_types/couurse-type";
import { TCourseBatch } from "@/components/(dashboard)/kursus/gelombang/_types/course-batch-type";

type Props = {
  courseSlug: string;
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const dayLabels: Record<string, string> = {
  monday: "Sen",
  tuesday: "Sel",
  wednesday: "Rab",
  thursday: "Kam",
  friday: "Jum",
  saturday: "Sab",
  sunday: "Min",
};

export function CourseBuilder({ courseSlug }: Props) {
  const { data: courseResp, isLoading: isLoadingCourse } = useGetData({
    queryKey: ["course-builder-course", courseSlug],
    dataProtected: `courses/${courseSlug}`,
  });

  const { data: batchesResp, isLoading: isLoadingBatches } = useGetData({
    queryKey: ["course-builder-batches", courseSlug],
    dataProtected: `courses/${courseSlug}/batches?limit=100&sort=created_at&order=asc`,
  });

  const course: TCourse | undefined = courseResp?.data?.data;
  const batches: TCourseBatch[] = batchesResp?.data?.data ?? [];
  const isLoading = isLoadingCourse || isLoadingBatches;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-72 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Card className="rounded-lg shadow-none">
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <Link href="/dashboard/kursus">
                <ArrowLeft className="h-4 w-4" />
                Kursus
              </Link>
            </Button>
            <Badge variant="secondary">Builder</Badge>
            <Badge variant="outline">{batches.length} gelombang</Badge>
          </div>
          <div>
            <CardTitle className="text-2xl leading-tight">
              {course?.title ?? "Kursus"}
            </CardTitle>
            <CardDescription className="mt-2 max-w-3xl">
              {course?.short_description ?? "-"}
            </CardDescription>
          </div>
          <CardAction className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <Link href={`/program/${courseSlug}`}>
                <Eye className="h-4 w-4" />
                Publik
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <Link href={`/dashboard/kursus/${courseSlug}/update`}>
                <Edit className="h-4 w-4" />
                Ubah
              </Link>
            </Button>
            <Button variant="orange" size="sm" className="gap-2" asChild>
              <Link href={`/dashboard/kursus/${courseSlug}/gelombang/tambah`}>
                <Plus className="h-4 w-4" />
                Gelombang
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card className="rounded-lg shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Struktur</CardTitle>
            <CardDescription>Urutan pengelolaan LMS</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 rounded-md border p-3">
              <Layers3 className="h-4 w-4 text-muted-foreground" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">Kursus</p>
                <p className="text-xs text-muted-foreground">
                  Data utama dan landing program
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-md border p-3">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">Gelombang</p>
                <p className="text-xs text-muted-foreground">
                  Jadwal, kuota, akses grup
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-md border p-3">
              <Route className="h-4 w-4 text-muted-foreground" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">Pertemuan</p>
                <p className="text-xs text-muted-foreground">
                  Materi, tugas, quiz, nilai
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Gelombang</CardTitle>
            <CardDescription>
              Pilih gelombang, lalu kelola isi kelasnya.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {batches.length === 0 ? (
              <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed text-center">
                <p className="text-sm font-medium">Belum ada gelombang</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Buat gelombang pertama untuk mulai susun kelas.
                </p>
                <Button className="mt-4 gap-2" variant="orange" asChild>
                  <Link
                    href={`/dashboard/kursus/${courseSlug}/gelombang/tambah`}
                  >
                    <Plus className="h-4 w-4" />
                    Tambah Gelombang
                  </Link>
                </Button>
              </div>
            ) : (
              batches.map((batch) => (
                <div
                  key={batch.id}
                  className="grid gap-3 rounded-lg border p-4 lg:grid-cols-[1fr_auto]"
                >
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-sm font-semibold">
                        {batch.title}
                      </h3>
                      <Badge variant="outline">{batch.course_type}</Badge>
                      <Badge variant="secondary">{batch.quota} kuota</Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>
                        {formatDate(batch.start_at)} sampai{" "}
                        {formatDate(batch.end_at)}
                      </span>
                      <span>{batch.room}</span>
                      <span>
                        {batch.days
                          ?.map((d) => dayLabels[d.day] ?? d.day)
                          .join(", ") || "-"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" variant="orange" className="gap-2" asChild>
                      <Link
                        href={`/dashboard/kursus/${courseSlug}/gelombang/${batch.slug}/builder`}
                      >
                        <Route className="h-4 w-4" />
                        Builder
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2" asChild>
                      <Link
                        href={`/dashboard/kursus/${courseSlug}/gelombang/${batch.slug}/builder?tab=pertemuan`}
                      >
                        <ListChecks className="h-4 w-4" />
                        Pertemuan
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2" asChild>
                      <Link
                        href={`/dashboard/kursus/${courseSlug}/gelombang/${batch.slug}/builder?tab=absensi`}
                      >
                        <Users className="h-4 w-4" />
                        Absensi
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
