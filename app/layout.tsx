import { ThemeProvider } from "@/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AccessTokenDialog } from "@/components/access-token-dialog";
import { Toaster } from "@/components/ui/sonner";
import TanStackProvider from "@/providers/tanstack-query-provider";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Tax Center — Brevet Pajak Universitas Gunadarma",
  description: "Pelatihan brevet pajak resmi Universitas Gunadarma. Kurikulum praktis, pengajar berpengalaman, dan sertifikasi diakui industri.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning={true}>
      <body
        suppressHydrationWarning={true}
        className={`${jakarta.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <TanStackProvider>{children}</TanStackProvider>
            <AccessTokenDialog />
          </TooltipProvider>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
