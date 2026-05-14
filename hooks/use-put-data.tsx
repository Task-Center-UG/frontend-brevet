import axiosInstance from "@/helpers/axios-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AxiosError } from "axios";

type QueryKeyType = string | Array<string | number>;

type FetchProps = {
  queryKey: QueryKeyType;
  dataProtected?: string;
  backUrl?: string;
  multipart?: boolean;
  successMessage?: string;
};

function isPlainObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function extractErrorMessage(
  error: unknown,
  fallback = "Gagal mengubah data."
): string {
  const axErr = error as AxiosError<unknown>;
  const data = axErr?.response?.data;

  if (isPlainObject(data)) {
    if (typeof data.error === "string") return data.error;

    if (typeof data.message === "string") return data.message;

    if (
      isPlainObject(data.message) &&
      typeof data.message.message === "string"
    ) {
      return data.message.message as string;
    }
  }
  return fallback;
}

function toQueryKeyArray(key: QueryKeyType): (string | number)[] {
  return Array.isArray(key) ? key : [key];
}

export const usePutData = ({
  queryKey,
  dataProtected,
  backUrl,
  multipart = false,
  successMessage = "Data berhasil diperbarui.",
}: FetchProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: unknown) => {
      const contentType = multipart
        ? "multipart/form-data"
        : "application/json";
      const path = dataProtected
        ? dataProtected.startsWith("/")
          ? dataProtected
          : `/${dataProtected}`
        : "/";

      return axiosInstance.put(path, data, {
        headers: { "Content-Type": contentType },
      });
    },

    onMutate: () => {
      toast("Mohon menunggu sebentar!", {
        description: "Data sedang dalam proses.",
      });
    },

    onError: (error: unknown) => {
      const msg = extractErrorMessage(error);
      toast("Terjadi kesalahan!", { description: msg });
    },

    onSuccess: () => {
      toast("Berhasil!", { description: successMessage });

      queryClient.invalidateQueries({ queryKey: toQueryKeyArray(queryKey) });

      if (backUrl) {
        router.push(backUrl);
      }
    },
  });

  return mutation;
};
