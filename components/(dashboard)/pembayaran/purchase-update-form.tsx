"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePatchData } from "@/hooks/use-patch-data";
import { useFileUploader } from "@/hooks/use-file-uploader";
import { CreditCard, Landmark, Loader2, User2, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetData } from "@/hooks/use-get-data";
import {
  UploadPaymentFormData,
  UploadPaymentSchema,
} from "./_schemas/upload-proof-schema";
import { formatRupiah } from "./_libs/format-rupiah";

type Props = {
  purchaseId: string;
};

export default function PurchaseUpdateForm({ purchaseId }: Props) {
  const [isReady, setIsReady] = useState(false);
  const { uploadFile } = useFileUploader();

  const { data, isLoading: isFetching } = useGetData({
    queryKey: ["purchase", purchaseId],
    dataProtected: `me/purchases/${purchaseId}`,
    options: { refetchOnWindowFocus: false },
  });

  const form = useForm<UploadPaymentFormData>({
    resolver: zodResolver(UploadPaymentSchema),
    defaultValues: {
      payment_proof_url: "",
      buyer_bank_account_name: "",
      buyer_bank_account_number: "",
    },
  });

  const { mutate: uploadPaymentProof, isPending } = usePatchData({
    queryKey: "purchases",
    dataProtected: `me/purchases/${purchaseId}/pay`,
    successMessage: "Bukti pembayaran berhasil diunggah!",
    backUrl: "/dashboard/pembayaran",
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, "images");
    form.setValue("payment_proof_url", url || "", { shouldValidate: true });
  };

  const onSubmit = (values: UploadPaymentFormData) => {
    uploadPaymentProof(values);
  };

  useEffect(() => {
    if (data?.data?.data && !form.formState.isDirty) {
      form.reset({
        payment_proof_url: data.data.data.payment_proof_url || "",
        buyer_bank_account_name: data.data.data.buyer_bank_account_name || "",
        buyer_bank_account_number:
          data.data.data.buyer_bank_account_number || "",
      });
      setIsReady(true);
    }
  }, [data, form]);

  if (!isReady) return null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Unggah Bukti Pembayaran</CardTitle>
            <CardDescription>
              Silakan transfer terlebih dahulu ke rekening berikut sebelum
              mengunggah bukti pembayaran.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-6">
            <div className="bg-muted/50 p-4 rounded-lg border text-sm space-y-2">
              <p className="font-medium text-base text-primary">
                Silakan transfer ke rekening berikut:
              </p>

              <div className="flex items-center gap-2">
                <Landmark className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">BCA</span>
              </div>

              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono">1234567890</span>
              </div>

              <div className="flex items-center gap-2">
                <User2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Tax Center Gunadarma</span>
              </div>

              <div className="pt-2 text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <p>
                    Nominal yang harus ditransfer:{" "}
                    <span className="font-semibold text-primary">
                      {formatRupiah(
                        (data?.data?.data?.price?.price || 0) +
                          (data?.data?.data?.unique_code || 0)
                      )}
                    </span>
                  </p>
                </div>
                <p>
                  Gunakan nominal yang tepat agar pembayaran mudah diverifikasi.
                </p>
                <p>
                  Setelah transfer, unggah bukti pembayaran berupa gambar (.jpg
                  / .png).
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="buyer_bank_account_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Pemilik Rekening</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Contoh: Zidan Indratama"
                      disabled={isFetching}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="buyer_bank_account_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Rekening</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Contoh: 1234567890"
                      disabled={isFetching}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_proof_url"
              render={() => (
                <FormItem>
                  <FormLabel>Bukti Pembayaran</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={isFetching}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              disabled={isPending || isFetching}
              className="w-full md:w-fit"
              variant="orange"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengunggah...
                </>
              ) : (
                "Unggah Bukti Pembayaran"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
