"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePatchData } from "@/hooks/use-patch-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TFeedback } from "@/components/(dashboard)/umpan-balik/_types/umpan-balik-type";

const schema = z.object({
  rating: z.string().min(1, "Pilih rating"),
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().optional().nullable(),
});

export function UmpanBalikUpdateDialog({
  feedback,
  onSuccess,
}: {
  feedback: TFeedback;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      rating: String(feedback.rating ?? 5),
      title: feedback.title ?? "",
      description: feedback.description ?? "",
    },
  });

  const patchMutation = usePatchData({
    queryKey: "testimonials",
    dataProtected: `testimonials/${feedback.id}`,
    successMessage: "Perubahan disimpan!",
  });

  const isSubmitting = patchMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Ubah
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Ubah Umpan Balik</DialogTitle>
          <DialogDescription>
            Perbarui rating atau isi ulasanmu.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(async (values) => {
            const payload = {
              rating: Number(values.rating),
              title: values.title,
              description: values.description || undefined,
            };
            patchMutation.mutate(payload, {
              onSuccess: () => {
                setOpen(false);
                onSuccess?.();
              },
            });
          })}
        >
          <div className="grid gap-2">
            <label className="text-sm font-medium">Rating</label>
            <Select
              value={form.watch("rating")}
              onValueChange={(v) =>
                form.setValue("rating", v, { shouldValidate: true })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih rating" />
              </SelectTrigger>
              <SelectContent>
                {[5, 4, 3, 2, 1].map((r) => (
                  <SelectItem key={r} value={String(r)}>
                    {"★".repeat(r)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Judul</label>
            <Input {...form.register("title")} />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Deskripsi (opsional)</label>
            <Textarea rows={4} {...form.register("description")} />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button variant={"orange"} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan…" : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
