"use client";

import { Separator } from "@/components/ui/separator";
import { navLinks } from "@/lib/data/nav-links";
import { Instagram, Linkedin, Mail } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const footerSections = [
  { title: "Tentang", links: navLinks.about },
  { title: "Jadwal", links: navLinks.schedule },
  { title: "DB-Tax", links: navLinks.db_tax },
  { title: "Berita", links: navLinks.news },
];

const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-60px" });

  return (
    <footer className="relative mt-12 xs:mt-20 border-t">
      <div
        ref={ref}
        className="max-w-screen-xl mx-auto pt-16 pb-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-x-6 gap-y-10 px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0, ease: easeOutExpo }}
          className="col-span-full sm:col-span-3 md:col-span-4 lg:col-span-2"
        >
          <Link href="/" className="inline-block">
            <ImageWithFallback
              src="/logo-tc.png"
              alt="Logo Tax Center"
              width={150}
              height={50}
              className="block dark:hidden h-8 w-auto"
              priority
            />
            <ImageWithFallback
              src="/logo-dark-tc.png"
              alt="Logo Tax Center Dark"
              width={150}
              height={50}
              className="hidden dark:block h-8 w-auto"
              priority
            />
          </Link>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
            Platform edukasi dan pelatihan perpajakan Universitas Gunadarma.
          </p>
          <div className="mt-6 flex items-center gap-4 text-muted-foreground">
            <Link href="https://www.instagram.com/taxcenter.ug" target="_blank" className="hover:text-foreground hover:scale-110 transition-all duration-200">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="https://www.linkedin.com/company/taxcenter-ug" target="_blank" className="hover:text-foreground hover:scale-110 transition-all duration-200">
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link href="mailto:zidanindratama03@gmail.com" target="_blank" className="hover:text-foreground hover:scale-110 transition-all duration-200">
              <Mail className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.08, ease: easeOutExpo }}
        >
          <h6 className="font-semibold text-foreground mb-5 text-sm">Alamat</h6>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li>
              <span className="font-medium text-foreground block mb-1 text-sm">Kampus D</span>
              <p className="leading-relaxed text-sm">Jl. Margonda Raya No. 100, Depok, Jawa Barat</p>
            </li>
            <li>
              <span className="font-medium text-foreground block mb-1 text-sm">Kampus F4</span>
              <p className="leading-relaxed text-sm">Jl. Raya Bogor No. 28, Depok 16951, Jawa Barat</p>
            </li>
          </ul>
        </motion.div>

        {footerSections.map(({ title, links }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.12 + index * 0.06, ease: easeOutExpo }}
          >
            <h6 className="font-semibold text-foreground mb-5 text-sm">{title}</h6>
            <ul className="space-y-2.5">
              {links.map(({ title: linkTitle, href }) => (
                <li key={linkTitle}>
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm inline-block"
                  >
                    {linkTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <Separator />

      <div className="max-w-screen-xl mx-auto py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6">
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: easeOutExpo }}
          className="text-muted-foreground text-center xs:text-start text-sm"
        >
          &copy; {new Date().getFullYear()}{" "}
          <Link href="#" target="_blank" className="hover:text-foreground transition-colors">
            Tim IT Tax Center
          </Link>
          . All rights reserved.
        </motion.span>
      </div>
    </footer>
  );
};

export default Footer;
