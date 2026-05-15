import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex w-full overflow-hidden">
        <AppSidebar />
        <SidebarInset className="overflow-auto">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
