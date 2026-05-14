import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "@/helpers/axios-instance";
import { useState } from "react";
import { debounce } from "lodash";

type FetchParams = {
  endpoint: string;
  queryKey: string;
  searchParam?: string;
  initialParams?: Record<string, any>;
};

export const useInfiniteFetcher = ({
  endpoint,
  queryKey,
  searchParam = "search",
  initialParams = {},
}: FetchParams) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleSearch = debounce((val: string) => {
    setDebouncedSearch(val);
  }, 500);

  const query = useInfiniteQuery({
    queryKey: [queryKey, debouncedSearch],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosInstance.get(endpoint, {
        params: {
          page: pageParam,
          ...initialParams,
          ...(debouncedSearch ? { [searchParam]: debouncedSearch } : {}),
        },
      });
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = lastPage.meta;
      return meta.page < meta.total_pages ? meta.page + 1 : undefined;
    },
  });

  return {
    ...query,
    search,
    setSearch: (val: string) => {
      setSearch(val);
      handleSearch(val);
    },
  };
};
