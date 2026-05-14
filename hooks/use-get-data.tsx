import axiosInstance from "@/helpers/axios-instance";
import {
  keepPreviousData,
  QueryKey,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

type FetchProps = {
  queryKey: QueryKey;
  dataProtected: string;
  requestConfig?: AxiosRequestConfig<any>;
  options?: Partial<UseQueryOptions<AxiosResponse<any>, Error, any>>;
};

export const useGetData = ({
  queryKey,
  dataProtected,
  requestConfig,
  options,
}: FetchProps) => {
  const query = useQuery<AxiosResponse<any>, Error, any>({
    queryKey,
    queryFn: async () =>
      await axiosInstance.get(`/${dataProtected}`, requestConfig),
    placeholderData: keepPreviousData,
    refetchIntervalInBackground: true,
    ...options,
  });

  const isRefetching = query.fetchStatus === "fetching" && !query.isLoading;

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
    isStale: query.isStale,
    refetch: query.refetch,
    isRefetching,
  };
};
