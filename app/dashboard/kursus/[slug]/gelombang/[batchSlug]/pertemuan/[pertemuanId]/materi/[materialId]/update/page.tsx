"use client";

import MateriFormUpdate from "@/components/(dashboard)/kursus/gelombang/pertemuan/materi/materi-form-update";
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
import { useParams } from "next/navigation";

const DashboardDatatableMateriPage = () => {
  const params = useParams();
  const courseSlug = params.slug as string;
  const batchSlug = params.batchSlug as string;
  const meetingId = params.pertemuanId as string;
  const materialId = params.materialId as string;

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
                <BreadcrumbLink href="/dashboard/kursus">Kursus</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink
                  href={`/dashboard/kursus/${courseSlug}/builder?tab=gelombang`}
                >
                  Gelombang
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink
                  href={`/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/builder?tab=pertemuan`}
                >
                  Pertemuan
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink
                  href={`/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/builder?tab=materi&meeting=${meetingId}`}
                >
                  Materi
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Update</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <MateriFormUpdate
          materialId={materialId}
          batchSlug={batchSlug}
          meetingId={meetingId}
          courseSlug={courseSlug}
        />
      </div>
    </section>
  );
};

export default DashboardDatatableMateriPage;
