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
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostData } from "@/hooks/use-post-data";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MeetingFormData,
  MeetingFormSchema,
} from "./_schemas/meeting-create-schema";
import { useGetData } from "@/hooks/use-get-data";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { TCourseBatch } from "../_types/course-batch-type";
import * as React from "react";

const MeetingFormCreate = () => {
  const params = useParams();
  const courseSlug = params.slug as string;
  const batchSlug = params.batchSlug as string;

  const { data: batchResp, isLoading } = useGetData({
    queryKey: ["batchDetail", batchSlug],
    dataProtected: `batches/${batchSlug}`,
  });

  const batch: TCourseBatch | undefined = batchResp?.data?.data;

  const batchMinDate = React.useMemo(
    () => (batch?.start_at ? new Date(batch.start_at) : undefined),
    [batch?.start_at]
  );
  const batchMaxDate = React.useMemo(
    () => (batch?.end_at ? new Date(batch.end_at) : undefined),
    [batch?.end_at]
  );

  const form = useForm<MeetingFormData>({
    resolver: zodResolver(MeetingFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: undefined,
      start_at: undefined,
      end_at: undefined,
    },
  });

  const startValue = form.watch("start_at");

  const { mutate: createMeeting, isPending } = usePostData({
    queryKey: "meetings",
    dataProtected: `batches/${batch?.id}/meetings`,
    successMessage: "Pertemuan berhasil ditambahkan!",
    backUrl: `/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/builder?tab=pertemuan`,
  });

  const onSubmit = (values: MeetingFormData) => {
    if (values.start_at && values.end_at && values.end_at < values.start_at) {
      form.setError("end_at", {
        type: "manual",
        message: "Tanggal ditutup tidak boleh sebelum tanggal dibuka.",
      });
      return;
    }
    createMeeting({ ...values, is_open: true });
  };

  const endMinDate: Date | undefined = React.useMemo(() => {
    if (!startValue && !batchMinDate) return undefined;
    if (startValue && batchMinDate) {
      return new Date(Math.max(startValue.getTime(), batchMinDate.getTime()));
    }
    return startValue ?? batchMinDate;
  }, [startValue, batchMinDate]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Tambah Pertemuan</CardTitle>
            <CardDescription>
              Lengkapi informasi pertemuan yang ingin ditambahkan.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Judul pertemuan" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Deskripsi pertemuan" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="start_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Dibuka</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pilih tanggal dibuka"
                      hourCycle={24}
                      granularity="second"
                      defaultPopupValue={batchMinDate ?? new Date()}
                      minDate={batchMinDate}
                      maxDate={batchMaxDate}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Ditutup</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pilih tanggal ditutup"
                      hourCycle={24}
                      granularity="second"
                      defaultPopupValue={
                        field.value ?? startValue ?? batchMinDate ?? new Date()
                      }
                      minDate={endMinDate}
                      maxDate={batchMaxDate}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Pertemuan</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih tipe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="basic">Pembelajaran</SelectItem>
                      <SelectItem value="exam">Ujian</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              disabled={isPending || isLoading}
              className="w-full md:w-fit"
              variant="orange"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Data"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default MeetingFormCreate;
