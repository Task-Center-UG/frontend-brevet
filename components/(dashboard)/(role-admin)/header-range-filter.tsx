"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

type Props = {
  range: "7d" | "30d" | "90d";
  onChange: (r: "7d" | "30d" | "90d") => void;
  title?: string;
};

export default function HeaderRangeFilter({
  range,
  onChange,
  title = "Dasbor Administrator",
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant={range === "7d" ? "default" : "outline"}
          size="sm"
          onClick={() => onChange("7d")}
        >
          7 Hari
        </Button>
        <Button
          variant={range === "30d" ? "default" : "outline"}
          size="sm"
          onClick={() => onChange("30d")}
        >
          30 Hari
        </Button>
        <Button
          variant={range === "90d" ? "default" : "outline"}
          size="sm"
          onClick={() => onChange("90d")}
        >
          90 Hari
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>
    </div>
  );
}
