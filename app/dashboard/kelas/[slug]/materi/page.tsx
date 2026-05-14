"use client";

import MateriDatatable from "@/components/(dashboard)/kelas/materi/materi-datatable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const DashboardMateriPage = () => {
  const params = useParams();
  const batchSlug = params.slug as string;

  const searchParams = useSearchParams();
  const meetingId = searchParams?.keys().next().value;

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
                <BreadcrumbLink href="/dashboard/kelas">Kelas</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={`/dashboard/kelas/${batchSlug}`}>
                  Pertemuan
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Materi</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex flex-row justify-end">
          <Button variant={"orange"} className="w-fit" asChild>
            <Link
              href={`/dashboard/kelas/${batchSlug}/materi/tambah?${meetingId}`}
            >
              Tambah Materi
            </Link>
          </Button>
        </div>
        <Suspense>
          <MateriDatatable batchSlug={batchSlug} meetingId={meetingId} />
        </Suspense>
      </div>
    </section>
  );
};

export default DashboardMateriPage;
