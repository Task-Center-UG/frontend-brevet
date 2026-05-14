"use client";

import { useGetData } from "@/hooks/use-get-data";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TCourseBatch } from "../(dashboard)/kursus/gelombang/_types/course-batch-type";
import { Calendar, Monitor, MapPin, ArrowUpRight } from "lucide-react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

function BatchCard({ batch, index }: { batch: TCourseBatch; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: easeOutExpo }}
    >
      <Link href={`/kursus/${batch.slug}`} className="group block">
        <div className="relative rounded-2xl border bg-card overflow-hidden transition-all duration-500 hover:border-[#f97316]/40 hover:shadow-2xl hover:-translate-y-2">
          <div className="relative aspect-[3/2] bg-muted overflow-hidden">
            <ImageWithFallback
              src={batch.batch_thumbnail}
              alt={batch.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Overlay gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Badge */}
            <div className="absolute top-4 left-4">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border shadow-sm ${
                  batch.course_type === "online"
                    ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800"
                    : "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-800"
                }`}
              >
                {batch.course_type === "online" ? (
                  <Monitor className="h-3.5 w-3.5" />
                ) : (
                  <MapPin className="h-3.5 w-3.5" />
                )}
                {batch.course_type === "online" ? "Online" : "Offline"}
              </span>
            </div>

            {/* Arrow icon bottom-right on hover */}
            <div className="absolute bottom-4 right-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center text-foreground shadow-lg">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="p-6 md:p-7">
            <div className="flex items-start justify-between gap-4">
              <h4 className="text-lg md:text-xl font-semibold tracking-tight leading-snug group-hover:text-[#f97316] transition-colors duration-300 truncate">
                {batch.title}
              </h4>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>
                {new Date(batch.start_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function FeaturedCourses() {
  const { data, isLoading, isError } = useGetData({
    queryKey: ["featured-batches"],
    dataProtected: "batches?limit=6&sort=popular&order=desc",
  });

  const batches: TCourseBatch[] = data?.data?.data || [];
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: false, margin: "-60px" });

  return (
    <section className="w-full py-24 md:py-32 bg-muted/20">
      <div className="max-w-screen-xl mx-auto px-6">
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: easeOutExpo }}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f97316]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
              Jadwal Terdekat
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}
              className="mt-4 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight !leading-[1.05]"
            >
              Gelombang{" "}
              <span className="text-muted-foreground">Kursus Terbaru</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: easeOutExpo }}
            className="text-muted-foreground max-w-sm md:text-right leading-relaxed text-lg"
          >
            Jadwal kelas yang sedang dibuka pendaftarannya. Pilih jadwal yang sesuai dengan waktu Anda.
          </motion.p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border bg-card overflow-hidden">
                <Skeleton className="aspect-[3/2] w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border bg-card p-12 text-center">
            <p className="text-destructive">Gagal memuat data jadwal.</p>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {batches.map((batch, index) => (
              <BatchCard key={batch.id ?? index} batch={batch} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
