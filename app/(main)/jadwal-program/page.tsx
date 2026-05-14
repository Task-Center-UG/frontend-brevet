import Footer from "@/components/(main)/footer";
import CourseScheduleTable from "@/components/(main)/jadwal-program/course-schedule-table";
import Navbar from "@/components/(main)/navbar";
import React, { Suspense } from "react";

const ProgramSchedulePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="max-w-screen-xl mx-auto px-6 py-20">
              <div className="h-8 w-64 bg-muted rounded animate-pulse mb-4" />
              <div className="h-4 w-96 bg-muted rounded animate-pulse" />
            </div>
          }
        >
          <CourseScheduleTable />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default ProgramSchedulePage;
