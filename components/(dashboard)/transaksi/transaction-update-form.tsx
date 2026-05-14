"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useGetData } from "@/hooks/use-get-data";
import { usePatchData } from "@/hooks/use-patch-data";
import { TTransaction } from "./_types/transaction-type";
import { formatRupiah } from "../pembayaran/_libs/format-rupiah";
import { formatDateIndo } from "../pembayaran/_libs/format-date-indo";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Schema dan Tipe Zod
const UpdateStatusSchema = z.object({
  payment_status: z.enum(["paid", "rejected"], {
    required_error: "Status pembayaran wajib dipilih.",
  }),
});
type UpdateStatusFormData = z.infer<typeof UpdateStatusSchema>;

type Props = {
  transactionId: string;
};

export default function TransactionUpdateForm({ transactionId }: Props) {
  const [isReady, setIsReady] = useState(false);

  const { data, isLoading: isFetching } = useGetData({
    queryKey: ["transaction", transactionId],
    dataProtected: `purchases/${transactionId}`,
    options: { refetchOnWindowFocus: false },
  });

  const transaction: TTransaction = data?.data?.data;

  const form = useForm<UpdateStatusFormData>({
    resolver: zodResolver(UpdateStatusSchema),
    defaultValues: {
      payment_status: undefined,
    },
  });

  const { mutate: updateStatus, isPending } = usePatchData({
    queryKey: "transactions",
    dataProtected: `purchases/${transactionId}/status`,
    successMessage: "Status pembayaran berhasil diperbarui!",
    backUrl: "/dashboard/transaksi",
  });

  const onSubmit = (values: UpdateStatusFormData) => {
    updateStatus(values);
  };

  useEffect(() => {
    if (transaction && !form.formState.isDirty) {
      const allowed = ["paid", "rejected"];
      const status = allowed.includes(transaction.payment_status)
        ? (transaction.payment_status as "paid" | "rejected")
        : undefined;
      form.reset({ payment_status: status });
      setIsReady(true);
    }
  }, [transaction, form]);

  if (!isReady) return null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Detail Transaksi</CardTitle>
            <CardDescription>
              Lihat data pendaftaran, bukti bayar, dan ubah status transaksi.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-2">
                  Program
                </p>
                <div className="flex items-center gap-4">
                  <ImageWithFallback
                    src={transaction.batch.batch_thumbnail}
                    alt={transaction.batch.title}
                    width={100}
                    height={100}
                    className="rounded-lg border object-cover h-24 w-36"
                  />
                  <div className="space-y-1">
                    <p className="font-semibold text-base">
                      {transaction.batch.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateIndo(transaction.batch.start_at)} -{" "}
                      {formatDateIndo(transaction.batch.end_at)}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      Tipe: {transaction.batch.course_type}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-2">
                  Mahasiswa
                </p>
                <div className="space-y-1">
                  <p className="text-base font-semibold">
                    {transaction.user.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.user.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.user.phone}
                  </p>
                </div>
              </div>
            </div>

            <hr />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground mb-1">
                  Bukti Pembayaran
                </p>
                {transaction?.payment_status === "pending" ? (
                  <p className="text-sm text-destructive">
                    Belum ada bukti pembayaran.
                  </p>
                ) : (
                  <Link
                    href={transaction?.payment_proof || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ImageWithFallback
                      src={transaction?.payment_proof || "/placeholder.svg"}
                      alt="Bukti Pembayaran"
                      width={500}
                      height={300}
                      className="rounded-lg border max-h-60 object-contain"
                    />
                  </Link>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground mb-1">
                  Total Harga
                </p>
                <p className="text-lg font-bold text-primary">
                  {formatRupiah(
                    transaction.price.price + transaction.unique_code
                  )}
                </p>
              </div>
            </div>

            <hr />

            <FormField
              control={form.control}
              name="payment_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Status Pembayaran
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {[
                        {
                          id: "paid",
                          label: "Berhasil",
                          icon: (
                            <CheckCircle className="w-6 h-6 text-green-500 mb-2" />
                          ),
                        },
                        {
                          id: "rejected",
                          label: "Ditolak",
                          icon: (
                            <XCircle className="w-6 h-6 text-red-500 mb-2" />
                          ),
                        },
                      ].map((item) => (
                        <div key={item.id}>
                          <RadioGroupItem
                            value={item.id}
                            id={item.id}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={item.id}
                            className="h-full min-h-[120px] flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-background p-4 text-center cursor-pointer transition-all duration-200 hover:bg-muted/60 peer-data-[state=checked]:border-primary"
                          >
                            {item.icon}
                            <span className="text-sm font-medium">
                              {item.label}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <Button
              variant={"orange"}
              type="submit"
              disabled={isPending || isFetching}
              className="w-full md:w-fit"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
