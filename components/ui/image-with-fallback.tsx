"use client";

import Image from "next/image";
import { useState } from "react";

type ImageWithFallbackProps = React.ComponentProps<typeof Image> & {
  fallbackClassName?: string;
};

export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackClassName,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    const isFill = "fill" in props && props.fill;
    const baseClasses = [
      "bg-muted flex items-center justify-center text-muted-foreground",
      isFill ? "absolute inset-0" : "w-full h-full",
      fallbackClassName || "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={baseClasses}>
        <span className="px-4 text-center text-sm font-medium line-clamp-2">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
