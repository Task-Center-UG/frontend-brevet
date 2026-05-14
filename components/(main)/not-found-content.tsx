"use client";

import type { ReactNode } from "react";
import { SearchX } from "lucide-react";

import { cn } from "@/lib/utils";

type NotFoundContentProps = {
  message?: string;
  title?: string;
  icon?: ReactNode;
  className?: string;
};

const NotFoundContent = ({
  message = "Data tidak ditemukan.",
  title = "Belum ada data",
  icon,
  className,
}: NotFoundContentProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-5 rounded-xl border bg-card px-6 py-12 text-center",
        className,
      )}
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon ?? <SearchX className="size-7" />}
      </div>
      <div className="max-w-md">
        <h2 className="text-2xl font-extrabold tracking-normal text-foreground">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {message}
        </p>
      </div>
    </div>
  );
};

export default NotFoundContent;
