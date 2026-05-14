"use client";

import { ImageWithFallback } from "@/components/ui/image-with-fallback";

type NotFoundContentProps = {
  message?: string;
  imageSrc?: string;
  altText?: string;
};

const NotFoundContent = ({
  message = "Data tidak ditemukan.",
  imageSrc = "/errors/not-found.png",
  altText = "not-found",
}: NotFoundContentProps) => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 py-5">
      <ImageWithFallback
        src={imageSrc}
        alt={altText}
        width={1000}
        height={1000}
        className="w-[30rem] max-w-full"
      />
      <p className="text-center text-lg text-muted-foreground font-medium">
        {message}
      </p>
    </div>
  );
};

export default NotFoundContent;
