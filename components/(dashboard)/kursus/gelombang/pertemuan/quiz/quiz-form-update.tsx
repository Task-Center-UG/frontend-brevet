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
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useGetData } from "@/hooks/use-get-data";
import { usePatchData } from "@/hooks/use-patch-data";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreateQuizFormData,
  CreateQuizSchema,
} from "@/components/(dashboard)/kelas/quiz/_schemas/quiz-create-schema";
import { TQuiz } from "@/components/(dashboard)/kelas/quiz/_types/quiz-type";
import { fromIsoUtcToLocalDate } from "@/components/(dashboard)/kelas/quiz/_utils/utils";
import { TMeeting } from "../_types/meeting-type";

const toIsoUtc = (d?: Date) =>
  d
    ? new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .replace(/\.\d{3}Z$/, "Z")
    : undefined;

type Props = {
  quizId: string;
  courseSlug: string;
  batchSlug: string;
  meetingId?: string;
};

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());
const endOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

const QuizFormUpdate = ({
  quizId,
  batchSlug,
  meetingId,
  courseSlug,
}: Props) => {
  const [isReady, setIsReady] = useState(false);

  const { data } = useGetData({
    queryKey: ["quiz", quizId],
    dataProtected: `quizzes/${quizId}`,
    options: { refetchOnWindowFocus: false },
  });

  const { data: meetingData } = useGetData({
    queryKey: ["meetings", meetingId!],
    dataProtected: `meetings/${meetingId}`,
  });

  const meeting: TMeeting | undefined = meetingData?.data?.data;

  const meetingMinDate = useMemo(
    () => (meeting?.start_at ? new Date(meeting.start_at) : undefined),
    [meeting?.start_at]
  );
  const meetingMaxDate = useMemo(
    () => (meeting?.end_at ? new Date(meeting.end_at) : undefined),
    [meeting?.end_at]
  );

  const minDay = useMemo(
    () => (meetingMinDate ? startOfDay(meetingMinDate) : undefined),
    [meetingMinDate]
  );
  const maxDay = useMemo(
    () => (meetingMaxDate ? endOfDay(meetingMaxDate) : undefined),
    [meetingMaxDate]
  );

  const form = useForm<CreateQuizFormData>({
    resolver: zodResolver(CreateQuizSchema),
    defaultValues: {
      title: "",
      description: "",
      quiz_type: undefined,
      duration_minute: 30,
      start_time: undefined,
      end_time: undefined,
      max_attempts: 1,
      is_open: true,
    },
  });

  const startValue = form.watch("start_time");

  const { mutate: updateQuiz, isPending } = usePatchData({
    queryKey: "quizzes",
    dataProtected: `quizzes/${quizId}`,
    successMessage: "Quiz berhasil diperbarui!",
    backUrl: `/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/builder?tab=quiz&meeting=${meetingId}`,
  });

  const onSubmit = (values: CreateQuizFormData) => {
    if (!meetingMinDate || !meetingMaxDate) {
      form.setError("start_time", {
        type: "manual",
        message: "Rentang tanggal pertemuan belum tersedia.",
      });
      return;
    }
    if (!values.start_time || !values.end_time) {
      if (!values.start_time)
        form.setError("start_time", {
          type: "manual",
          message: "Waktu mulai wajib diisi.",
        });
      if (!values.end_time)
        form.setError("end_time", {
          type: "manual",
          message: "Waktu selesai wajib diisi.",
        });
      return;
    }
    if (values.end_time < values.start_time) {
      form.setError("end_time", {
        type: "manual",
        message: "Waktu selesai tidak boleh sebelum waktu mulai.",
      });
      return;
    }
    const startClamped =
      values.start_time < meetingMinDate
        ? new Date(meetingMinDate)
        : values.start_time > meetingMaxDate
          ? new Date(meetingMaxDate)
          : values.start_time;

    const endClamped =
      values.end_time < meetingMinDate
        ? new Date(meetingMinDate)
        : values.end_time > meetingMaxDate
          ? new Date(meetingMaxDate)
          : values.end_time;

    if (
      startClamped.getTime() !== values.start_time.getTime() ||
      endClamped.getTime() !== values.end_time.getTime()
    ) {
      form.setValue("start_time", startClamped, { shouldValidate: true });
      form.setValue("end_time", endClamped, { shouldValidate: true });
    }

    const payload = {
      ...values,
      duration_minute: Number(values.duration_minute),
      max_attempts: Number(values.max_attempts),
      start_time: toIsoUtc(startClamped),
      end_time: toIsoUtc(endClamped),
      is_open: true,
    };
    updateQuiz(payload);
  };

  useEffect(() => {
    const raw = data?.data?.data as TQuiz | undefined;
    if (raw && !form.formState.isDirty) {
      form.reset({
        title: raw.title ?? "",
        description: raw.description ?? "",
        quiz_type: (raw.type as CreateQuizFormData["quiz_type"]) ?? "tf",
        duration_minute: raw.duration_minute ?? 30,
        start_time: fromIsoUtcToLocalDate(raw.start_time),
        end_time: fromIsoUtcToLocalDate(raw.end_time),
        max_attempts: raw.max_attempts ?? 1,
        is_open: !!raw.is_open,
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
            <CardTitle>Perbarui Quiz</CardTitle>
            <CardDescription>Ubah informasi quiz di bawah ini.</CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Quiz</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="quiz_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipe Quiz</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="tf">True / False</SelectItem>
                        <SelectItem value="mc">Pilihan Ganda</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_minute"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durasi (menit)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        step={1}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_attempts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maks. Percobaan</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        step={1}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mulai</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={(d) => field.onChange(d || undefined)}
                        granularity="minute"
                        displayFormat={{ hour24: "PPPp" }}
                        minDate={minDay}
                        maxDate={maxDay}
                        defaultPopupValue={
                          field.value ?? meetingMinDate ?? undefined
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selesai</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={(d) => field.onChange(d || undefined)}
                        granularity="minute"
                        displayFormat={{ hour24: "PPPp" }}
                        minDate={minDay}
                        defaultPopupValue={
                          field.value ??
                          startValue ??
                          meetingMinDate ??
                          undefined
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full md:w-fit"
              variant="orange"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Perbarui Quiz"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default QuizFormUpdate;
