"use client";

import { useRouter, useSearchParams } from "next/navigation";

export const useDataTableQueryParams = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";

  const filters: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (!["page", "limit", "search", "tab", "meeting"].includes(key)) {
      filters[key] = value;
    }
  });

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (key !== "page") {
      params.set("page", "1");
    }

    router.replace(`?${params.toString()}`);
  };

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");

    Object.keys(filters).forEach((key) => {
      params.delete(key);
    });

    params.set("page", "1");
    router.replace(`?${params.toString()}`);
  };

  return {
    page,
    limit,
    search,
    filters,
    updateQuery,
    resetFilters,
  };
};
