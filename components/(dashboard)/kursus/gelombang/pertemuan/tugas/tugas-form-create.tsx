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
import { useFileUploader } from "@/hooks/use-file-uploader";
import FileInput from "@/components/ui/file-input";
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
  CreateAssignmentFormData,
  CreateAssignmentSchema,
} from "@/components/(dashboard)/kelas/tugas/_schemas/assignment-create-schema";
import { useGetData } from "@/hooks/use-get-data";
import { TMeeting } from "../_types/meeting-type";
import { useMemo } from "react";

type Props = {
  courseSlug: string;
  batchSlug: string;
  meetingId?: string;
};

const TugasFormCreate = ({ meetingId, batchSlug, courseSlug }: Props) => {
  const { uploadFile } = useFileUploader();

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

  const form = useForm<CreateAssignmentFormData>({
    resolver: zodResolver(CreateAssignmentSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "file",
      start_at: undefined,
      end_at: undefined,
      assignment_files: [],
    },
  });

  const startValue = form.watch("start_at");

  const { mutate: submitAssignment, isPending } = usePostData({
    queryKey: "assignments",
    dataProtected: `meetings/${meetingId}/assignments`,
    successMessage: "Tugas berhasil ditambahkan!",
    backUrl: `/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/builder?tab=tugas&meeting=${meetingId}`,
  });

  const onSubmit = async (values: CreateAssignmentFormData) => {
    if (!meetingMinDate || !meetingMaxDate) {
      form.setError("start_at", {
        type: "manual",
        message: "Rentang tanggal pertemuan belum tersedia.",
      });
      return;
    }

    if (!values.start_at || !values.end_at) {
      if (!values.start_at)
        form.setError("start_at", {
          type: "manual",
          message: "Tanggal mulai wajib diisi.",
        });
      if (!values.end_at)
        form.setError("end_at", {
          type: "manual",
          message: "Tanggal selesai wajib diisi.",
        });
      return;
    }

    if (values.end_at < values.start_at) {
      form.setError("end_at", {
        type: "manual",
        message: "Tanggal selesai tidak boleh sebelum tanggal mulai.",
      });
      return;
    }

    if (values.start_at < meetingMinDate || values.start_at > meetingMaxDate) {
      form.setError("start_at", {
        type: "manual",
        message: "Tanggal mulai harus berada dalam rentang pertemuan.",
      });
      return;
    }

    const uploadedUrls: string[] = [];
    for (const file of values.assignment_files) {
      if (typeof file === "string") {
        uploadedUrls.push(file);
      } else {
        const isImage = file.type.startsWith("image/");
        const url = await uploadFile(file, isImage ? "images" : "documents");
        if (url) uploadedUrls.push(url);
      }
    }

    const payload = {
      ...values,
      start_at: values.start_at.toISOString(),
      end_at: values.end_at.toISOString(),
      assignment_files: uploadedUrls,
    };

    submitAssignment(payload);
  };

  const endMinDate = useMemo(() => {
    if (!meetingMinDate) return startValue ?? undefined;
    if (startValue)
      return new Date(Math.max(startValue.getTime(), meetingMinDate.getTime()));
    return meetingMinDate;
  }, [startValue, meetingMinDate]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Tambah Tugas</CardTitle>
            <CardDescription>
              Silakan isi detail tugas di bawah ini.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Tugas</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Contoh: Tugas Golang" />
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
                    <Input
                      {...field}
                      placeholder="Contoh: Kerjakan soal linked list dan concurrency"
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
                  <FormLabel>Tipe Tugas</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih tipe tugas" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="file">File</SelectItem>
                      <SelectItem value="essay">Essay</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mulai</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        placeholder="Pilih tanggal & waktu mulai"
                        value={field.value}
                        onChange={field.onChange}
                        granularity="minute"
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
                name="end_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selesai</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        placeholder="Pilih tanggal & waktu selesai"
                        value={field.value}
                        onChange={field.onChange}
                        granularity="minute"
                        minDate={endMinDate}
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

            <FormField
              control={form.control}
              name="assignment_files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Tugas</FormLabel>
                  <FormControl>
                    <FileInput onFilesChange={field.onChange} />
                  </FormControl>
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
                "Simpan"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default TugasFormCreate;
