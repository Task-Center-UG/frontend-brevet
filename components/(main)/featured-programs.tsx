"use client";

import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import Link from "next/link";
import { useGetData } from "@/hooks/use-get-data";
import { TCourse } from "@/components/(dashboard)/kursus/_types/couurse-type";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

function ProgramCard({ course, index }: { course: TCourse; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-80px" });
  const imageUrl = course.course_images?.[0]?.image_url;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: easeOutExpo }}
    >
      <Link href={`/program/${course.slug}`} className="group block">
        <div className="relative rounded-2xl border bg-card overflow-hidden transition-all duration-300 hover:border-[#f97316]/30 hover:shadow-xl hover:-translate-y-1.5">
          <div className="relative aspect-[16/10] bg-muted overflow-hidden">
            <ImageWithFallback
              src={imageUrl}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold tracking-tight group-hover:text-[#f97316] transition-colors truncate">
                {course.title}
              </h3>
              <div className="shrink-0 mt-0.5 w-7 h-7 rounded-full bg-muted flex items-center justify-center group-hover:bg-[#f97316] group-hover:text-white transition-all duration-300">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {course.short_description}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function FeaturedPrograms() {
  const { data, isLoading, isError } = useGetData({
    queryKey: ["featured-programs"],
    dataProtected: "courses?limit=6&sort=popular&order=desc",
    options: { refetchOnWindowFocus: false },
  });

  const courses: TCourse[] = data?.data?.data ?? [];
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: false, margin: "-60px" });

  return (
    <section className="w-full py-24 md:py-32">
      <div className="max-w-screen-xl mx-auto px-6">
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: easeOutExpo }}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f97316]"
            >
              Katalog Program
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}
              className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight !leading-[1.1]"
            >
              Program Unggulan{" "}
              <span className="text-muted-foreground">Kami</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: easeOutExpo }}
            className="text-muted-foreground max-w-sm md:text-right leading-relaxed"
          >
            Pilih program sesuai kebutuhan karir perpajakan Anda.
          </motion.p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border bg-card overflow-hidden">
                <Skeleton className="aspect-[16/10] w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border bg-card p-12 text-center">
            <p className="text-destructive">Gagal memuat data kursus.</p>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, i) => (
              <ProgramCard key={course.id} course={course} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
