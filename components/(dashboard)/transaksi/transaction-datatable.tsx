"use client";

import * as React from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  FileCheck2,
  Mail,
  Search,
  UserRound,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useDataTableQueryParams } from "@/hooks/use-data-table-query-params";
import { useGetData } from "@/hooks/use-get-data";
import { cn } from "@/lib/utils";
import { formatDateIndo } from "../pembayaran/_libs/format-date-indo";
import { formatRupiah } from "../pembayaran/_libs/format-rupiah";
import { TTransaction } from "../transaksi/_types/transaction-type";

const statusOptions = [
  { label: "Menunggu Pembayaran", value: "pending" },
  { label: "Menunggu Konfirmasi", value: "waiting_confirmation" },
  { label: "Berhasil", value: "paid" },
  { label: "Ditolak", value: "rejected" },
  { label: "Kadaluarsa", value: "expired" },
  { label: "Dibatalkan", value: "cancelled" },
];

const statusMeta = {
  paid: {
    label: "Berhasil",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
  },
  pending: {
    label: "Menunggu Pembayaran",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-700",
  },
  waiting_confirmation: {
    label: "Menunggu Konfirmasi",
    className: "border-sky-500/20 bg-sky-500/10 text-sky-700",
  },
  rejected: {
    label: "Ditolak",
    className: "border-destructive/20 bg-destructive/10 text-destructive",
  },
  expired: {
    label: "Kadaluarsa",
    className: "border-muted bg-muted text-muted-foreground",
  },
  cancelled: {
    label: "Dibatalkan",
    className: "border-orange-500/20 bg-orange-500/10 text-orange-700",
  },
} satisfies Record<TTransaction["payment_status"], { label: string; className: string }>;

const TransactionDataTable = () => {
  const { page, limit, search, filters, updateQuery, resetFilters } =
    useDataTableQueryParams();
  const [searchInput, setSearchInput] = React.useState(search);

  React.useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const queryParams = new URLSearchParams({
    ...(search && { q: search }),
    page: String(page),
    limit: String(limit),
    ...filters,
  });
  const queryString = queryParams.toString();

  const { data, isLoading } = useGetData({
    queryKey: ["transactions", queryString],
    dataProtected: `purchases?${queryString}`,
  });

  const transactions: TTransaction[] = (data?.data?.data ?? []).filter(
    (trx: TTransaction) =>
      trx.batch_id && trx.batch_id !== "00000000-0000-0000-0000-000000000000",
  );
  const meta = data?.data?.meta ?? {
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  };

  const counts = transactions.reduce(
    (acc, transaction) => {
      acc[transaction.payment_status] =
        (acc[transaction.payment_status] ?? 0) + 1;
      return acc;
    },
    {} as Partial<Record<TTransaction["payment_status"], number>>,
  );

  function submitSearch() {
    updateQuery("search", searchInput.trim());
  }

  return (
    <section className="space-y-5">
      <div className="rounded-lg border bg-card p-5">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Verifikasi Admin
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-normal">
              Konfirmasi pembayaran
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Prioritaskan transaksi yang sudah mengunggah bukti, cek data
              peserta, lalu konfirmasi atau tolak dari halaman detail.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <SummaryTile
              icon={FileCheck2}
              label="Perlu dicek"
              value={counts.waiting_confirmation ?? 0}
            />
            <SummaryTile
              icon={CheckCircle2}
              label="Berhasil"
              value={counts.paid ?? 0}
            />
            <SummaryTile
              icon={CreditCard}
              label="Belum bayar"
              value={counts.pending ?? 0}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_240px_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") submitSearch();
              }}
              placeholder="Cari nama, email, atau status"
              className="pl-9"
            />
          </div>
          <Select
            value={filters.payment_status ?? "all"}
            onValueChange={(value) =>
              updateQuery("payment_status", value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua status</SelectItem>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button onClick={submitSearch} className="flex-1 lg:flex-none">
              Cari
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSearchInput("");
                resetFilters();
              }}
              aria-label="Reset filter"
            >
              <X />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-48 rounded-lg" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center">
          <FileCheck2 className="mx-auto size-8 text-primary" />
          <h2 className="mt-4 text-xl font-bold">
            Tidak ada transaksi di filter ini
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Ubah pencarian atau status untuk melihat transaksi lain.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {transactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>
          Halaman {meta.page} dari {meta.total_pages}, {meta.total} transaksi
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={meta.page <= 1}
            onClick={() => updateQuery("page", String(meta.page - 1))}
          >
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            disabled={meta.page >= meta.total_pages}
            onClick={() => updateQuery("page", String(meta.page + 1))}
          >
            Berikutnya
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TransactionDataTable;

function TransactionCard({ transaction }: { transaction: TTransaction }) {
  const meta = statusMeta[transaction.payment_status];
  const total = transaction.price.price + transaction.unique_code;

  return (
    <article className="rounded-lg border bg-card p-4 transition hover:border-primary/25 hover:bg-muted/20">
      <div className="grid gap-4 xl:grid-cols-[180px_minmax(0,1fr)_260px] xl:items-center">
        <ImageWithFallback
          src={transaction.batch.batch_thumbnail || "/placeholder.svg"}
          alt={transaction.batch.title}
          width={360}
          height={220}
          className="h-36 w-full rounded-md border object-cover xl:h-28"
        />

        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
                meta.className,
              )}
            >
              {meta.label}
            </span>
            <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize text-muted-foreground">
              {transaction.batch.course_type}
            </span>
          </div>
          <h2 className="mt-3 line-clamp-2 text-lg font-extrabold leading-6">
            {transaction.batch.title}
          </h2>
          <div className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
            <span className="inline-flex items-center gap-2">
              <UserRound className="size-4 text-primary" />
              {transaction.user.name}
            </span>
            <span className="inline-flex items-center gap-2">
              <Mail className="size-4 text-primary" />
              {transaction.user.email}
            </span>
            <span className="inline-flex items-center gap-2 md:col-span-2">
              <CalendarDays className="size-4 text-primary" />
              {formatDateIndo(transaction.batch.start_at)} sampai{" "}
              {formatDateIndo(transaction.batch.end_at)}
            </span>
          </div>
        </div>

        <div className="rounded-md border bg-background p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Total bayar
          </p>
          <p className="mt-2 text-xl font-extrabold text-primary">
            {formatRupiah(total)}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/kursus/${transaction.batch.slug}`} target="_blank">
                <ExternalLink />
                Program
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={`/dashboard/transaksi/${transaction.id}`}>
                <FileCheck2 />
                Konfirmasi
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function SummaryTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-md border bg-background p-3">
      <Icon className="size-4 text-primary" />
      <p className="mt-2 text-xl font-extrabold">{value}</p>
      <p className="text-xs leading-4 text-muted-foreground">{label}</p>
    </div>
  );
}
