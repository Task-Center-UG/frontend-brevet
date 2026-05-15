"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  CreditCard,
  FileCheck2,
  Loader2,
  Mail,
  Phone,
  ReceiptText,
  UserRound,
  XCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useGetData } from "@/hooks/use-get-data";
import { usePatchData } from "@/hooks/use-patch-data";
import { cn } from "@/lib/utils";
import { formatDateIndo } from "../pembayaran/_libs/format-date-indo";
import { formatRupiah } from "../pembayaran/_libs/format-rupiah";
import { TTransaction } from "./_types/transaction-type";

const UpdateStatusSchema = z.object({
  payment_status: z.enum(["paid", "rejected"], {
    required_error: "Status pembayaran wajib dipilih.",
  }),
});
type UpdateStatusFormData = z.infer<typeof UpdateStatusSchema>;

type Props = {
  transactionId: string;
};

const statusLabel: Record<TTransaction["payment_status"], string> = {
  pending: "Menunggu Pembayaran",
  waiting_confirmation: "Menunggu Konfirmasi",
  paid: "Berhasil",
  rejected: "Ditolak",
  expired: "Kadaluarsa",
  cancelled: "Dibatalkan",
};

export default function TransactionUpdateForm({ transactionId }: Props) {
  const [isReady, setIsReady] = useState(false);

  const { data, isLoading: isFetching } = useGetData({
    queryKey: ["transaction", transactionId],
    dataProtected: `purchases/${transactionId}`,
    options: { refetchOnWindowFocus: false },
  });
  const transaction: TTransaction | undefined = data?.data?.data;

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

  if (isFetching || !isReady || !transaction) {
    return (
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Skeleton className="h-[520px] rounded-lg" />
        <Skeleton className="h-[520px] rounded-lg" />
      </div>
    );
  }

  const total = transaction.price.price + transaction.unique_code;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]"
      >
        <section className="rounded-lg border bg-card p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Review Pembayaran
              </p>
              <h1 className="mt-2 text-2xl font-extrabold tracking-normal">
                Bukti transfer
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Cocokkan nominal, pemilik rekening, dan bukti transfer sebelum
                mengubah status.
              </p>
            </div>
            <span className="inline-flex w-fit items-center rounded-full border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              {statusLabel[transaction.payment_status]}
            </span>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-md border bg-background p-4">
              <p className="text-sm font-bold">Bukti Pembayaran</p>
              {transaction.payment_proof ? (
                <Link
                  href={transaction.payment_proof}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ImageWithFallback
                    src={transaction.payment_proof}
                    alt="Bukti pembayaran"
                    width={720}
                    height={900}
                    className="mt-3 max-h-[520px] w-full rounded-md border object-contain"
                  />
                </Link>
              ) : (
                <div className="mt-3 flex min-h-[360px] flex-col items-center justify-center rounded-md border bg-muted/30 p-6 text-center">
                  <ReceiptText className="size-8 text-muted-foreground" />
                  <p className="mt-4 font-semibold">
                    Peserta belum mengunggah bukti
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Tunggu bukti transfer sebelum menyetujui pembayaran.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <InfoBlock
                icon={CreditCard}
                label="Total bayar"
                value={formatRupiah(total)}
                strong
              />
              <InfoBlock
                icon={UserRound}
                label="Nama rekening"
                value={transaction.buyer_bank_account_name || "-"}
              />
              <InfoBlock
                icon={ReceiptText}
                label="Nomor rekening"
                value={transaction.buyer_bank_account_number || "-"}
              />
              <InfoBlock
                icon={FileCheck2}
                label="Tanggal transaksi"
                value={formatDateIndo(transaction.created_at)}
              />
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-lg border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Peserta
            </p>
            <h2 className="mt-2 text-xl font-extrabold">
              {transaction.user.name}
            </h2>
            <div className="mt-4 grid gap-3 text-sm">
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <Mail className="size-4 text-primary" />
                {transaction.user.email}
              </span>
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <Phone className="size-4 text-primary" />
                {transaction.user.phone || "-"}
              </span>
            </div>
          </section>

          <section className="rounded-lg border bg-card p-5">
            <ImageWithFallback
              src={transaction.batch.batch_thumbnail}
              alt={transaction.batch.title}
              width={640}
              height={360}
              className="h-40 w-full rounded-md border object-cover"
            />
            <h2 className="mt-4 text-lg font-extrabold leading-6">
              {transaction.batch.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {formatDateIndo(transaction.batch.start_at)} sampai{" "}
              {formatDateIndo(transaction.batch.end_at)}
            </p>
          </section>

          <section className="rounded-lg border bg-card p-5">
            <FormField
              control={form.control}
              name="payment_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold">
                    Keputusan Admin
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="mt-3 grid gap-3"
                    >
                      {[
                        {
                          id: "paid",
                          label: "Konfirmasi berhasil",
                          desc: "Peserta mendapat akses kelas.",
                          icon: CheckCircle,
                          className:
                            "peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-500/10",
                        },
                        {
                          id: "rejected",
                          label: "Tolak pembayaran",
                          desc: "Peserta perlu mengunggah bukti baru.",
                          icon: XCircle,
                          className:
                            "peer-data-[state=checked]:border-destructive peer-data-[state=checked]:bg-destructive/10",
                        },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.id}>
                            <RadioGroupItem
                              value={item.id}
                              id={item.id}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={item.id}
                              className={cn(
                                "flex cursor-pointer items-start gap-3 rounded-md border bg-background p-4 transition hover:bg-muted/50",
                                item.className,
                              )}
                            >
                              <Icon className="mt-0.5 size-5 shrink-0 text-primary" />
                              <span>
                                <span className="block text-sm font-bold">
                                  {item.label}
                                </span>
                                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                                  {item.desc}
                                </span>
                              </span>
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending || isFetching}
              className="mt-5 w-full"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Menyimpan
                </>
              ) : (
                <>
                  <FileCheck2 />
                  Simpan Konfirmasi
                </>
              )}
            </Button>
          </section>
        </aside>
      </form>
    </Form>
  );
}

function InfoBlock({
  icon: Icon,
  label,
  value,
  strong,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="rounded-md border bg-background p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <Icon className="size-4 text-primary" />
        {label}
      </div>
      <p
        className={cn(
          "mt-2 break-words text-sm font-semibold",
          strong && "text-xl font-extrabold text-primary",
        )}
      >
        {value}
      </p>
    </div>
  );
}
