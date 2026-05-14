"use client";

import { TAssignmentSubmission } from "@/components/(dashboard)/program-saya/tugas/_types/submission-type";
import UpdatePengumpulanEssay from "@/components/(dashboard)/program-saya/tugas/update-pengumpulan-essay";
import UpdatePengumpulanFile from "@/components/(dashboard)/program-saya/tugas/update-pengumpulan-file";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useGetData } from "@/hooks/use-get-data";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardUpdateKerjakanTugasPage = () => {
  const params = useParams();
  const batchSlug = params.batchSlug as string;
  const assignmentId = params.assignmentId as string;
  const submissionId = params.submissionId as string;

  const { data, isLoading, isError } = useGetData({
    queryKey: ["submission", submissionId],
    dataProtected: `submissions/${submissionId}`,
  });

  if (isLoading) {
    return (
      <section>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <div className="flex items-center gap-2 w-full">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid gap-4">
            <div className="rounded-xl border bg-card">
              <div className="h-1.5 w-full bg-primary/70 rounded-t-xl" />
              <div className="p-5 md:p-6 border-b">
                <Skeleton className="h-5 w-64 mb-2" />
                <Skeleton className="h-4 w-72" />
              </div>
              <div className="p-5 md:p-6 grid gap-3">
                <div className="flex flex-wrap gap-3">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-56" />
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card">
              <div className="p-5 md:p-6 border-b">
                <Skeleton className="h-5 w-52 mb-2" />
                <Skeleton className="h-4 w-60" />
              </div>
              <div className="p-5 md:p-6 grid gap-4">
                <Skeleton className="h-4 w-28" />
                <div className="rounded-md border p-4">
                  <Skeleton className="h-10 w-full mb-4" />
                  <div className="grid gap-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-[85%]" />
                    <Skeleton className="h-8 w-[70%]" />
                  </div>
                </div>
              </div>
              <div className="p-5 md:p-6 flex gap-2">
                <Skeleton className="h-9 w-36" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const submission: TAssignmentSubmission | undefined = data?.data?.data;

  if (isError || !submission) {
    return (
      <section>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Jawaban</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="text-sm text-destructive">Gagal memuat jawaban.</div>
        </div>
      </section>
    );
  }

  const type = (submission.assignment?.type || "").toLowerCase();

  return (
    <section>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard/program-saya">
                  Kursus Saya
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={`/dashboard/program-saya/${batchSlug}`}>
                  Pertemuan
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink
                  href={`/dashboard/program-saya/${batchSlug}/tugas/${assignmentId}`}
                >
                  Tugas
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Jawaban</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {type === "file" ? (
          <UpdatePengumpulanFile
            batchSlug={batchSlug}
            assignmentId={assignmentId}
            submissionId={submissionId}
          />
        ) : (
          <UpdatePengumpulanEssay
            batchSlug={batchSlug}
            assignmentId={assignmentId}
            submissionId={submissionId}
          />
        )}
      </div>
    </section>
  );
};

export default DashboardUpdateKerjakanTugasPage;
