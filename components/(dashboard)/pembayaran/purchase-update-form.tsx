"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  CreditCard,
  Landmark,
  Loader2,
  ReceiptText,
  Upload,
  User2,
  Wallet,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useFileUploader } from "@/hooks/use-file-uploader";
import { useGetData } from "@/hooks/use-get-data";
import { usePatchData } from "@/hooks/use-patch-data";
import { formatDateIndo } from "./_libs/format-date-indo";
import { formatRupiah } from "./_libs/format-rupiah";
import {
  UploadPaymentFormData,
  UploadPaymentSchema,
} from "./_schemas/upload-proof-schema";
import { TPurchase } from "./_types/purchase-type";

type Props = {
  purchaseId: string;
};

export default function PurchaseUpdateForm({ purchaseId }: Props) {
  const [isReady, setIsReady] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const { uploadFile } = useFileUploader();

  const { data, isLoading: isFetching } = useGetData({
    queryKey: ["purchase", purchaseId],
    dataProtected: `me/purchases/${purchaseId}`,
    options: { refetchOnWindowFocus: false },
  });
  const purchase: TPurchase | undefined = data?.data?.data;
  const proofUrl = purchase?.payment_proof || data?.data?.data?.payment_proof_url;
  const total =
    (purchase?.price?.price || 0) + (purchase?.unique_code || 0);

  const form = useForm<UploadPaymentFormData>({
    resolver: zodResolver(UploadPaymentSchema),
    defaultValues: {
      payment_proof_url: "",
      buyer_bank_account_name: "",
      buyer_bank_account_number: "",
    },
  });

  const currentProof = form.watch("payment_proof_url") || proofUrl;

  const { mutate: uploadPaymentProof, isPending } = usePatchData({
    queryKey: "purchases",
    dataProtected: `me/purchases/${purchaseId}/pay`,
    successMessage: "Bukti pembayaran berhasil diunggah!",
    backUrl: "/dashboard/pembayaran",
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFileName(file.name);
    const url = await uploadFile(file, "images");
    form.setValue("payment_proof_url", url || "", { shouldValidate: true });
  };

  const onSubmit = (values: UploadPaymentFormData) => {
    uploadPaymentProof(values);
  };

  useEffect(() => {
    if (data?.data?.data && !form.formState.isDirty) {
      form.reset({
        payment_proof_url: proofUrl || "",
        buyer_bank_account_name: data.data.data.buyer_bank_account_name || "",
        buyer_bank_account_number:
          data.data.data.buyer_bank_account_number || "",
      });
      setIsReady(true);
    }
  }, [data, form, proofUrl]);

  if (isFetching || !isReady || !purchase) {
    return (
      <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
        <Skeleton className="h-96 rounded-lg" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5 lg:grid-cols-[380px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <section className="rounded-lg border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Tagihan
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-normal">
              Instruksi transfer
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Transfer sesuai nominal sampai digit terakhir agar verifikasi
              admin lebih cepat.
            </p>

            <div className="mt-5 rounded-md border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Nominal tepat
              </p>
              <p className="mt-2 text-2xl font-extrabold text-primary">
                {formatRupiah(total)}
              </p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Termasuk kode unik {formatRupiah(purchase.unique_code)}.
              </p>
            </div>

            <div className="mt-5 grid gap-3 text-sm">
              <InfoLine icon={Landmark} label="Bank" value="BCA" />
              <InfoLine icon={CreditCard} label="Nomor" value="1234567890" />
              <InfoLine
                icon={User2}
                label="Atas nama"
                value="Tax Center Gunadarma"
              />
            </div>
          </section>

          <section className="rounded-lg border bg-card p-5">
            <div className="flex items-start gap-3">
              <ReceiptText className="mt-0.5 size-5 text-primary" />
              <div>
                <h2 className="font-bold">{purchase.batch.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDateIndo(purchase.batch.start_at)} sampai{" "}
                  {formatDateIndo(purchase.batch.end_at)}
                </p>
              </div>
            </div>
          </section>
        </aside>

        <section className="rounded-lg border bg-card p-5">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Bukti Pembayaran
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-normal">
                Data pengirim
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Isi nama pemilik rekening, nomor rekening, lalu unggah gambar
                bukti transfer berformat JPG atau PNG.
              </p>

              <div className="mt-6 grid gap-5">
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
                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-background p-6 text-center transition hover:border-primary/40 hover:bg-muted/40">
                          <Upload className="size-6 text-primary" />
                          <span className="mt-3 text-sm font-semibold">
                            Pilih gambar bukti transfer
                          </span>
                          <span className="mt-1 text-xs text-muted-foreground">
                            JPG, PNG, atau WEBP. Maksimal mengikuti batas
                            upload server.
                          </span>
                          {selectedFileName ? (
                            <span className="mt-3 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                              {selectedFileName}
                            </span>
                          ) : null}
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={isFetching}
                            className="sr-only"
                          />
                        </label>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="rounded-md border bg-background p-4">
              <p className="text-sm font-bold">Pratinjau bukti</p>
              {currentProof ? (
                <ImageWithFallback
                  src={currentProof}
                  alt="Bukti pembayaran"
                  width={480}
                  height={640}
                  className="mt-3 max-h-80 w-full rounded-md border object-contain"
                />
              ) : (
                <div className="mt-3 flex min-h-64 flex-col items-center justify-center rounded-md border bg-muted/30 p-5 text-center">
                  <Wallet className="size-7 text-muted-foreground" />
                  <p className="mt-3 text-sm font-semibold">
                    Belum ada bukti dipilih
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Pratinjau muncul setelah gambar berhasil diunggah.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BadgeCheck className="size-4 text-primary" />
              Status akan berubah menjadi menunggu konfirmasi admin.
            </div>
            <Button
              type="submit"
              disabled={isPending || isFetching}
              className="w-full sm:w-fit"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Mengunggah
                </>
              ) : (
                <>
                  <Upload />
                  Upload Bukti
                </>
              )}
            </Button>
          </div>
        </section>
      </form>
    </Form>
  );
}

function InfoLine({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2">
      <span className="inline-flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4 text-primary" />
        {label}
      </span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
