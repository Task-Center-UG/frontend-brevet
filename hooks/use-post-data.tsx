import axiosInstance from "@/helpers/axios-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AxiosError } from "axios";

type FetchProps = {
  queryKey: string;
  dataProtected: string;
  backUrl?: string;
  multipart?: boolean;
  successMessage?: string;
};

function isPlainObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

export const usePostData = ({
  queryKey,
  dataProtected,
  backUrl,
  multipart = false,
  successMessage = "Data berhasil diproses.",
}: FetchProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: unknown) => {
      const contentType = multipart
        ? "multipart/form-data"
        : "application/json";
      return axiosInstance.post(`/${dataProtected}`, data, {
        headers: { "Content-Type": contentType },
      });
    },
    onMutate: () => {
      toast("Mohon menunggu sebentar!", {
        description: "Data sedang dalam proses.",
      });
    },
    onError: (error: unknown) => {
      let description = "Gagal memproses data.";

      const axErr = error as AxiosError<unknown>;
      const respData = axErr?.response?.data;

      if (isPlainObject(respData)) {
        const msgFromError =
          typeof respData.error === "string" ? respData.error : null;
        const msgFromMessage =
          typeof respData.message === "string"
            ? respData.message
            : isPlainObject(respData.message) &&
                typeof respData.message.message === "string"
              ? (respData.message.message as string)
              : null;

        description = msgFromError || msgFromMessage || description;
      }

      toast("Terjadi kesalahan!", { description });
    },
    onSuccess: () => {
      toast("Berhasil!", { description: successMessage });
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      if (backUrl) router.push(backUrl);
    },
  });

  return mutation;
};
