"use client";

import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";

import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TMyCourse } from "../program-saya/_types/my-course-type";

const dayLabels: Record<string, string> = {
  monday: "Senin",
  tuesday: "Selasa",
  wednesday: "Rabu",
  thursday: "Kamis",
  friday: "Jumat",
  saturday: "Sabtu",
  sunday: "Minggu",
};

type Props = {
  course: TMyCourse;
};

export function KelaswSayaCard({ course }: Props) {
  const formattedStart = format(new Date(course.start_at), "dd MMM yyyy", {
    locale: id,
  });
  const formattedEnd = format(new Date(course.end_at), "dd MMM yyyy", {
    locale: id,
  });

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      <div className="relative h-44 w-full bg-muted">
        <ImageWithFallback
          src={course.batch_thumbnail}
          alt={course.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute left-3 top-3">
          <Badge className="rounded-full bg-background text-foreground shadow-sm">
            {course.course_type?.toUpperCase() ?? "KELAS"}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-col gap-2">
          <h3 className="line-clamp-2 min-h-11 text-base font-bold leading-snug text-foreground">
            {course.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className="size-4 shrink-0 text-primary" />
            <span>
              {formattedStart} - {formattedEnd}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="size-4 shrink-0 text-primary" />
            <span>
              {course.days
                .map((day) => dayLabels[day.day] || day.day)
                .join(", ")}
            </span>
          </div>
        </div>

        <Button className="mt-auto w-full gap-2" asChild>
          <Link href={`/dashboard/kelas/${course.slug}`}>
            Buka Kelas
            <ArrowRight className="size-4 shrink-0" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
