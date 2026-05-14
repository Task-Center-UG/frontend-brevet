import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import Link from "next/link";
import React from "react";

const AccessDeniedPage = () => {
  return (
    <div className="flex flex-col gap-5 md:gap-10 max-w-7xl p-6 mx-auto items-center justify-center h-screen">
      <div className="">
        <ImageWithFallback
          src={"/errors/access-denied.gif"}
          alt="not-found"
          width={1000}
          height={1000}
          className="w-[30rem]"
        />
      </div>
      <div className="flex flex-col gap-5 text-center justify-center items-center">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-5xl">Akses Ditolak</h1>
          <h3 className="font-semibold text-2xl">
            Kamu tidak memiliki izin untuk mengakses halaman ini.
          </h3>
          <h5 className="md:max-w-xl text-center mx-auto">
            Kamu tidak memiliki hak akses untuk membuka halaman ini. Silakan
            kembali ke halaman utama atau periksa kembali kredensial Kamu.
          </h5>
        </div>
        <Button className="w-fit" variant={"orange"} asChild>
          <Link href={"/"}>Kembali</Link>
        </Button>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
