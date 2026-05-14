"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import NotFoundContent from "@/components/(main)/not-found-content";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { workshopSchedules } from "@/lib/data/workshop-schedule";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Search, X, ArrowUpRight, MapPin, Monitor } from "lucide-react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

function WorkshopCard({
  course,
  index,
}: {
  course: (typeof workshopSchedules)[0];
  index: number;
}) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: easeOutExpo }}
    >
      <Link href={`/workshop/${course.slug}`} className="group block">
        <div className="relative rounded-2xl border bg-card overflow-hidden transition-all duration-500 hover:border-[#f97316]/30 hover:shadow-xl hover:-translate-y-1.5">
          <div className="relative aspect-[3/2] bg-muted overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm font-medium px-4 text-center">
              {course.title}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="absolute top-4 left-4">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border shadow-sm ${
                  course.method === "online"
                    ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800"
                    : "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-800"
                }`}
              >
                {course.method === "online" ? (
                  <Monitor className="h-3.5 w-3.5" />
                ) : (
                  <MapPin className="h-3.5 w-3.5" />
                )}
                {course.method === "online" ? "Online" : "Offline"}
              </span>
            </div>

            <div className="absolute bottom-4 right-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center text-foreground shadow-lg">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="p-6">
            <Badge
              variant="outline"
              className="mb-3 w-fit rounded-full text-xs font-medium capitalize"
            >
              {course.category}
            </Badge>

            <h3 className="text-lg md:text-xl font-semibold tracking-tight leading-snug group-hover:text-[#f97316] transition-colors duration-300 truncate">
              {course.title}
            </h3>

            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p>
                {format(new Date(course.date), "EEEE, dd MMMM yyyy", {
                  locale: id,
                })}
              </p>
              <p>
                {course.method === "online" ? "Online" : "Offline"},{" "}
                {course.platform}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

const WorkshopSchedule = () => {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [search, setSearch] = useState("");

  const filteredWorkshops = workshopSchedules.filter((course) => {
    const matchesCategory =
      categoryFilter === "" ||
      categoryFilter === "semua" ||
      course.category.toLowerCase() === categoryFilter;

    const matchesMethod =
      methodFilter === "" ||
      methodFilter === "semua" ||
      course.method === methodFilter;

    const matchesSearch = course.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesMethod && matchesSearch;
  });

  const headerRef = React.useRef(null);
  const headerInView = useInView(headerRef, { once: false, margin: "-60px" });

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="w-full bg-background border-b">
        <div className="max-w-screen-xl mx-auto px-6 py-16 md:py-24">
          <div
            ref={headerRef}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          >
            <div className="max-w-xl">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: easeOutExpo }}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f97316]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
                Jadwal Workshop
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}
                className="mt-4 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight !leading-[1.05]"
              >
                Informasi{" "}
                <span className="text-muted-foreground">Workshop</span>
              </motion.h1>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: easeOutExpo }}
              className="text-muted-foreground max-w-md md:text-right leading-relaxed text-lg"
            >
              Temukan berbagai jadwal workshop terkini yang relevan dengan
              akuntansi, perpajakan, audit, dan topik profesional lainnya.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-10 md:py-14">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-foreground mb-2">
              Cari Workshop
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Judul workshop..."
                className="pl-9 h-11 rounded-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="w-full md:w-56">
            <label className="block text-sm font-medium text-foreground mb-2">
              Kategori
            </label>
            <Select onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-11 w-full rounded-full">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="semua">Semua Kategori</SelectItem>
                  <SelectItem value="perpajakan">Perpajakan</SelectItem>
                  <SelectItem value="akuntansi keuangan">
                    Akuntansi Keuangan
                  </SelectItem>
                  <SelectItem value="psak">PSAK</SelectItem>
                  <SelectItem value="audit">Audit</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-56">
            <label className="block text-sm font-medium text-foreground mb-2">
              Metode
            </label>
            <Select onValueChange={setMethodFilter}>
              <SelectTrigger className="h-11 w-full rounded-full">
                <SelectValue placeholder="Semua Metode" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="semua">Semua Metode</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        <div className="mt-10">
          {filteredWorkshops.length === 0 ? (
            <div className="rounded-2xl border bg-card p-16 text-center">
              <NotFoundContent message="Tidak ada workshop yang ditemukan." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredWorkshops.map((course, index) => (
                <WorkshopCard
                  key={course.id}
                  course={course}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkshopSchedule;
