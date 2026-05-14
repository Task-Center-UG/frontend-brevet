"use client";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "@radix-ui/react-icons";
import { navLinks } from "@/lib/data/nav-links";
import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useDecodedToken } from "@/hooks/use-decoded-token";
import { TUser } from "../(dashboard)/profile/_types/user-type";
import axiosInstance from "@/helpers/axios-instance";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const mobileLinks = [
  { label: "Beranda", href: "/" },
  { label: "Jadwal Program", href: "/jadwal-program" },
  { label: "Jadwal Workshop", href: "/jadwal-workshop" },
  { label: "Berita", href: "/berita" },
  { label: "Umpan Balik", href: "/umpan-balik" },
  { label: "Validasi Sertifikat", href: "/sertifikat" },
  { label: "Bantuan", href: "/bantuan" },
  { label: "DB-Tax", href: "https://database-pajak.tcugapps.com/", external: true },
];

export default function Navbar() {
  const decodedToken = useDecodedToken();
  const [user, setUser] = useState<TUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const accessToken = Cookies.get("access_token");

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLogout = async () => {
    const toastId = toast.loading("Sedang logout...");
    try {
      await axiosInstance.delete("/auth/logout");
      Cookies.remove("access_token");
      setUser(null);
      toast.success("Berhasil logout!");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error("Gagal logout", {
        description: error.response?.data?.message || "Terjadi kesalahan saat logout.",
      });
    } finally {
      toast.dismiss(toastId);
    }
  };

  useEffect(() => {
    if (!accessToken) { setUser(null); setIsLoading(false); return; }
    const fetchUser = async () => {
      try { const res = await axiosInstance.get("/users/me"); setUser(res.data.data); }
      catch { setUser(null); }
      finally { setIsLoading(false); }
    };
    fetchUser();
  }, [accessToken]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-background border-b">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ImageWithFallback src="/logo-tc.png" alt="Logo Tax Center" width={150} height={50} className="block dark:hidden h-8 w-auto" priority />
            <ImageWithFallback src="/logo-dark-tc.png" alt="Logo Tax Center Dark" width={150} height={50} className="hidden dark:block h-8 w-auto" priority />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-accent/60 data-[state=open]:bg-accent/60 transition-colors text-sm font-medium">Tentang Kami</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <div className="flex h-full w-full select-none flex-col justify-end rounded-md bg-muted p-6 no-underline outline-none focus:shadow-md">
                            <HomeIcon className="h-6 w-6" />
                            <div className="mb-2 mt-4 text-lg font-medium">Tentang Kami</div>
                            <p className="text-sm leading-tight text-muted-foreground">Informasi seputar Tax Center, bantuan pengguna, dan FAQ.</p>
                          </div>
                        </NavigationMenuLink>
                      </li>
                      {navLinks.about.map((link) => (
                        <ListItem key={link.href} href={link.href} title={link.title}>{link.description}</ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-accent/60 data-[state=open]:bg-accent/60 transition-colors text-sm font-medium">Jadwal</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {navLinks.schedule.map((component) => (
                        <ListItem key={component.title} title={component.title} href={component.href}>{component.description}</ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="https://database-pajak.tcugapps.com/" target="_blank" className="px-4 py-2 text-sm font-medium hover:bg-accent/60 rounded-md transition-colors inline-flex">DB-Tax</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/berita" className="px-4 py-2 text-sm font-medium hover:bg-accent/60 rounded-md transition-colors inline-flex">Berita</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/umpan-balik" className="px-4 py-2 text-sm font-medium hover:bg-accent/60 rounded-md transition-colors inline-flex">Umpan Balik</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/sertifikat" className="px-4 py-2 text-sm font-medium hover:bg-accent/60 rounded-md transition-colors inline-flex">Validasi Sertifikat</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ModeToggle />
            {isLoading ? (
              <div className="h-9 w-20 bg-muted rounded-md animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="size-8 cursor-pointer ring-2 ring-transparent hover:ring-primary/30 transition-all">
                    <AvatarImage src={user.avatar} className="object-cover" />
                    <AvatarFallback>{user.name?.charAt(0).toUpperCase() || "UG"}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[10rem]">
                  <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link href="/dashboard/profile">Profil</Link></DropdownMenuItem>
                  {decodedToken?.role !== "siswa" && (
                    <DropdownMenuItem asChild><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Signout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="rounded-full" asChild><Link href="/auth/sign-in">Masuk</Link></Button>
                <Button size="sm" className="rounded-full px-5" asChild><Link href="/auth/sign-up">Daftar</Link></Button>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ModeToggle />
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setMobileOpen(true)} aria-label="Buka menu">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="fixed inset-0 z-[60] bg-background flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-16 border-b shrink-0">
              <Link href="/" onClick={() => setMobileOpen(false)}>
                <ImageWithFallback src="/logo-tc.png" alt="Logo Tax Center" width={150} height={50} className="block dark:hidden h-8 w-auto" priority />
                <ImageWithFallback src="/logo-dark-tc.png" alt="Logo Tax Center Dark" width={150} height={50} className="hidden dark:block h-8 w-auto" priority />
              </Link>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setMobileOpen(false)} aria-label="Tutup menu">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <motion.nav
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } },
              }}
              className="flex-1 overflow-y-auto px-6 py-10"
            >
              <ul className="space-y-1">
                {mobileLinks.map((link, idx) => (
                  <motion.li
                    key={link.href}
                    variants={{
                      hidden: { opacity: 0, y: 18 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOutExpo } },
                    }}
                  >
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      onClick={() => !link.external && setMobileOpen(false)}
                      className="flex items-center justify-between py-4 border-b border-border/50 text-2xl font-semibold tracking-tight text-foreground hover:text-[#f97316] transition-colors"
                    >
                      <span className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground font-normal tabular-nums">{String(idx + 1).padStart(2, "0")}</span>
                        {link.label}
                      </span>
                      <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOutExpo } },
                }}
                className="mt-10 flex flex-col gap-3"
              >
                {isLoading ? (
                  <div className="h-10 w-full bg-muted rounded-md animate-pulse" />
                ) : user ? (
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarImage src={user.avatar} className="object-cover" />
                      <AvatarFallback>{user.name?.charAt(0).toUpperCase() || "UG"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Button variant="outline" className="w-full rounded-full" asChild><Link href="/auth/sign-in" onClick={() => setMobileOpen(false)}>Masuk</Link></Button>
                    <Button className="w-full rounded-full" asChild><Link href="/auth/sign-up" onClick={() => setMobileOpen(false)}>Daftar</Link></Button>
                  </>
                )}
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a ref={ref} className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground", className)} {...props}>
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
