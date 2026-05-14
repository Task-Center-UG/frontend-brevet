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
import { usePostData } from "@/hooks/use-post-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  CreateQuizFormData,
  CreateQuizSchema,
} from "@/components/(dashboard)/kelas/quiz/_schemas/quiz-create-schema";
import { useGetData } from "@/hooks/use-get-data";
import { useMemo } from "react";
import { TMeeting } from "../_types/meeting-type";

const toIsoUtc = (d?: Date) =>
  d
    ? new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .replace(/\.\d{3}Z$/, "Z")
    : undefined;

type Props = {
  courseSlug: string;
  batchSlug: string;
  meetingId?: string;
};

const QuizFormCreate = ({ meetingId, batchSlug, courseSlug }: Props) => {
  const { data: meetingData, isLoading } = useGetData({
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

  const endMinDate = useMemo(() => {
    if (!meetingMinDate) return startValue ?? undefined;
    if (startValue)
      return new Date(Math.max(startValue.getTime(), meetingMinDate.getTime()));
    return meetingMinDate;
  }, [startValue, meetingMinDate]);

  const { mutate: submitQuiz, isPending } = usePostData({
    queryKey: "quizzes",
    dataProtected: `meetings/${meetingId}/quizzes`,
    successMessage: "Quiz berhasil ditambahkan!",
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

    if (
      values.start_time < meetingMinDate ||
      values.start_time > meetingMaxDate
    ) {
      form.setError("start_time", {
        type: "manual",
        message: "Waktu mulai harus berada dalam rentang pertemuan.",
      });
      return;
    }

    if (values.end_time < meetingMinDate || values.end_time > meetingMaxDate) {
      form.setError("end_time", {
        type: "manual",
        message: "Waktu selesai harus berada dalam rentang pertemuan.",
      });
      return;
    }

    const payload = {
      ...values,
      duration_minute: Number(values.duration_minute),
      max_attempts: Number(values.max_attempts),
      start_time: toIsoUtc(values.start_time),
      end_time: toIsoUtc(values.end_time),
      is_open: true,
    };

    submitQuiz(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Tambah Quiz</CardTitle>
            <CardDescription>Isi detail quiz di bawah ini.</CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Quiz</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Contoh: Quiz Pertemuan 2" />
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
                    <Input {...field} placeholder="Materi Bab 2" />
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
                          <SelectValue placeholder="Pilih tipe quiz" />
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
                        placeholder="30"
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
                        placeholder="1"
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
                        placeholder="Pilih tanggal & waktu mulai"
                        value={field.value}
                        onChange={field.onChange}
                        granularity="minute"
                        displayFormat={{ hour24: "PPPp" }}
                        minDate={meetingMinDate}
                        maxDate={meetingMaxDate}
                        defaultPopupValue={
                          field.value ?? meetingMinDate ?? undefined
                        }
                        disabled={isLoading}
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
                        placeholder="Pilih tanggal & waktu selesai"
                        value={field.value}
                        onChange={field.onChange}
                        granularity="minute"
                        displayFormat={{ hour24: "PPPp" }}
                        minDate={endMinDate}
                        maxDate={meetingMaxDate}
                        defaultPopupValue={
                          field.value ??
                          startValue ??
                          meetingMinDate ??
                          undefined
                        }
                        disabled={isLoading}
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
                "Simpan"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default QuizFormCreate;
