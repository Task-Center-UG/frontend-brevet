"use client";

import MemberDataTable from "@/components/(dashboard)/member/member-data-table";
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
import { Suspense } from "react";

export default function DashboardPesertaDatatablePage() {
  return (
    <section className="min-w-0">
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
                <BreadcrumbPage>Peserta</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex min-w-0 flex-1 flex-col gap-5 p-4 pt-0 lg:p-6 lg:pt-0">
        <div className="rounded-lg border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Manajemen Pengguna
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-normal">Peserta</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Cek data peserta, kategori verifikasi, dan identitas administrasi
            untuk pembayaran, kelas, dan sertifikat.
          </p>
        </div>
        <Suspense>
          <MemberDataTable />
        </Suspense>
      </div>
    </section>
  );
}
