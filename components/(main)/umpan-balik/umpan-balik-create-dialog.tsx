"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilLine } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { TCourseBatch } from "@/components/(dashboard)/kursus/gelombang/_types/course-batch-type";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL } from "@/helpers/api-config";

const schema = z.object({
  batch_id: z.string().min(1, "Pilih kelas terlebih dahulu"),
  rating: z.string().min(1, "Pilih rating"),
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().optional().nullable(),
});

type BatchOption = { id: string; title: string };

export function UmpanBalikCreateDialog({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isLoadingBatches, setIsLoadingBatches] = useState(false);
  const [batchOptions, setBatchOptions] = useState<BatchOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { rating: "5" },
  });

  useEffect(() => {
    let cancelled = false;

    const fetchBatches = async () => {
      setIsLoadingBatches(true);
      try {
        const token = Cookies.get("access_token");

        const res = await axios.get(`${API_BASE_URL}/me/batches`, {
          params: { limit: 100 },
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        const arr = res?.data?.data ?? [];
        const mapped: BatchOption[] = arr.map((batch: TCourseBatch) => ({
          id: batch.id,
          title: batch.title ?? batch.slug ?? "Tanpa Judul",
        }));

        if (!cancelled) setBatchOptions(mapped);
      } catch {
        if (!cancelled) setBatchOptions([]);
      } finally {
        if (!cancelled) setIsLoadingBatches(false);
      }
    };

    if (open && batchOptions.length === 0) {
      fetchBatches();
    }

    return () => {
      cancelled = true;
    };
  }, [open, batchOptions.length]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-full">
          <PencilLine className="size-4 shrink-0" />
          Buat Umpan Balik
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Buat Umpan Balik</DialogTitle>
          <DialogDescription>
            Berikan penilaian untuk kelas yang sudah kamu ikuti.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(async (values) => {
            setIsSubmitting(true);
            try {
              const token = Cookies.get("access_token");

              await axios.post(
                `${API_BASE_URL}/batches/${values.batch_id}/testimonials`,
                {
                  rating: Number(values.rating),
                  title: values.title,
                  description: values.description || undefined,
                },
                {
                  withCredentials: true,
                  headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : undefined,
                },
              );

              setOpen(false);
              onSuccess?.();
              form.reset({ rating: "5" });
            } finally {
              setIsSubmitting(false);
            }
          })}
        >
          <div className="grid gap-2">
            <label className="text-sm font-medium">Kelas</label>
            <Select
              value={form.watch("batch_id")}
              onValueChange={(value) =>
                form.setValue("batch_id", value, { shouldValidate: true })
              }
              disabled={isLoadingBatches}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    isLoadingBatches ? "Memuat kelas..." : "Pilih kelas"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {batchOptions.length === 0 && !isLoadingBatches ? (
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    Tidak ada kelas tersedia
                  </div>
                ) : (
                  batchOptions.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id}>
                      {batch.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {form.formState.errors.batch_id && (
              <p className="text-xs text-red-600">
                {form.formState.errors.batch_id.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Rating</label>
            <Select
              value={form.watch("rating")}
              onValueChange={(value) =>
                form.setValue("rating", value, { shouldValidate: true })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih rating" />
              </SelectTrigger>
              <SelectContent>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <SelectItem key={rating} value={String(rating)}>
                    {rating} bintang
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.rating && (
              <p className="text-xs text-red-600">
                {form.formState.errors.rating.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Judul</label>
            <Input
              {...form.register("title")}
              placeholder="Ringkas dan jelas"
            />
            {form.formState.errors.title && (
              <p className="text-xs text-red-600">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Deskripsi (opsional)</label>
            <Textarea
              rows={4}
              {...form.register("description")}
              placeholder="Ceritakan pengalamanmu"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan Umpan Balik"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
