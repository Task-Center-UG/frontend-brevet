import axiosInstance from "@/helpers/axios-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type fetchProps = {
  queryKey: string;
  dataProtected: string;
  backUrl?: string;
  successMessage?: string;
};

export const useDeleteData = ({
  queryKey,
  dataProtected,
  backUrl,
  successMessage = "Data berhasil dihapus.",
}: fetchProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: () => {
      return axiosInstance.delete(`/${dataProtected}`);
    },
    onMutate: () => {
      toast("Mohon menunggu sebentar!", {
        description: "Data sedang dihapus.",
      });
    },
    onError: (error: any) => {
      console.error(error);

      const msg =
        typeof error?.response?.data?.message === "string"
          ? error.response.data.message
          : error?.response?.data?.message?.message || "Gagal menghapus data.";

      toast("Terjadi kesalahan!", {
        description: msg,
      });
    },
    onSuccess: () => {
      toast("Berhasil!", {
        description: successMessage,
      });

      queryClient.invalidateQueries({ queryKey: [queryKey] });

      if (backUrl) {
        router.push(backUrl);
      }
    },
  });

  return mutation;
};
