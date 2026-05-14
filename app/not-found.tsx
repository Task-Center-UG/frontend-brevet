import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import Link from "next/link";
import React from "react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col gap-5 md:gap-10 md:flex-row max-w-7xl p-6 mx-auto items-center justify-center h-screen">
      <div className="">
        <ImageWithFallback
          src={"/errors/not-found.gif"}
          alt="not-found"
          width={1000}
          height={1000}
          className="w-[30rem]"
        />
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-5xl">Oops....</h1>
          <h3 className="font-semibold text-2xl">Halaman Tidak Ditemukan</h3>
          <h5>
            Halaman ini tidak ada atau telah dihapus! Kami sarankan Anda
            kembali.
          </h5>
        </div>
        <Button className="w-fit" variant={"orange"} asChild>
          <Link href={"/"}>Kembali</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
