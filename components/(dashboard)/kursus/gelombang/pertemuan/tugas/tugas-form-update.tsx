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
import { useGetData } from "@/hooks/use-get-data";
import { useEffect, useMemo, useState } from "react";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePatchData } from "@/hooks/use-patch-data";
import {
  CreateAssignmentFormData,
  CreateAssignmentSchema,
} from "@/components/(dashboard)/kelas/tugas/_schemas/assignment-create-schema";
import { TAssignment } from "@/components/(dashboard)/kelas/tugas/_types/tugas-type";
import { TMeeting } from "../_types/meeting-type";

type Props = {
  assignmentId: string;
  meetingId?: string;
  courseSlug: string;
  batchSlug: string;
};

const TugasFormUpdate = ({
  assignmentId,
  meetingId,
  batchSlug,
  courseSlug,
}: Props) => {
  const { uploadFile } = useFileUploader();
  const [initialUrls, setInitialUrls] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  const { data, isLoading: isFetching } = useGetData({
    queryKey: ["assignment", assignmentId],
    dataProtected: `assignments/${assignmentId}`,
    options: { refetchOnWindowFocus: false },
  });

  const { data: meetingData, isLoading: isMeetingLoading } = useGetData({
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

  const { mutate: updateAssignment, isPending } = usePatchData({
    queryKey: "assignments",
    dataProtected: `assignments/${assignmentId}`,
    successMessage: "Tugas berhasil diperbarui!",
    backUrl: `/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/builder?tab=tugas&meeting=${meetingId}`,
  });

  const handleRemoveInitial = (index: number) => {
    setInitialUrls((prev) => {
      const newUrls = prev.filter((_, i) => i !== index);
      const currentFiles = form.getValues("assignment_files") as (
        | string
        | File
      )[];
      const updatedFiles = currentFiles.filter((file) =>
        typeof file === "string" ? newUrls.includes(file) : true
      );
      form.setValue("assignment_files", updatedFiles);
      return newUrls;
    });
  };

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

    const newUrls: string[] = [];
    const existingUrls: string[] = [];

    for (const file of values.assignment_files) {
      if (typeof file === "string") {
        existingUrls.push(file);
      } else {
        const isImage = file.type.startsWith("image/");
        const url = await uploadFile(file, isImage ? "images" : "documents");
        if (url) newUrls.push(url);
      }
    }

    const payload = {
      ...values,
      assignment_id: assignmentId,
      start_at: values.start_at.toISOString(),
      end_at: values.end_at.toISOString(),
      assignment_files: [...existingUrls, ...newUrls],
    };

    updateAssignment(payload);
  };

  useEffect(() => {
    if (data?.data?.data && !form.formState.isDirty) {
      const tugas = data.data.data as TAssignment;
      const oldUrls = tugas.assignment_files.map((f) => f.file_url);
      form.reset({
        title: tugas.title ?? "",
        description: tugas.description ?? "",
        type: tugas.type ?? "file",
        start_at: tugas.start_at ? new Date(tugas.start_at) : undefined,
        end_at: tugas.end_at ? new Date(tugas.end_at) : undefined,
        assignment_files: oldUrls,
      });
      setInitialUrls(oldUrls);
      setIsReady(true);
    }
  }, [data, form]);

  const endMinDate = useMemo(() => {
    if (!meetingMinDate) return startValue ?? undefined;
    if (startValue)
      return new Date(Math.max(startValue.getTime(), meetingMinDate.getTime()));
    return meetingMinDate;
  }, [startValue, meetingMinDate]);

  if (!isReady) return null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Perbarui Tugas</CardTitle>
            <CardDescription>
              Ubah informasi tugas di bawah ini.
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
                    <Input {...field} disabled={isFetching} />
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
                    <Input {...field} disabled={isFetching} />
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
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isFetching}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
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
                        value={field.value}
                        onChange={field.onChange}
                        granularity="minute"
                        minDate={meetingMinDate}
                        maxDate={meetingMaxDate}
                        defaultPopupValue={
                          field.value ?? meetingMinDate ?? undefined
                        }
                        disabled={isMeetingLoading || isFetching}
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
                        disabled={isMeetingLoading || isFetching}
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
              render={() => (
                <FormItem>
                  <FormLabel>File Tugas</FormLabel>
                  <FormControl>
                    <FileInput
                      onFilesChange={(newFiles) => {
                        const currentFiles = form.getValues(
                          "assignment_files"
                        ) as (string | File)[];
                        const currentFileUrls = currentFiles.filter(
                          (file) => typeof file === "string"
                        ) as string[];
                        const remainingInitialUrls = initialUrls.filter((url) =>
                          currentFileUrls.includes(url)
                        );
                        form.setValue("assignment_files", [
                          ...remainingInitialUrls,
                          ...newFiles,
                        ]);
                      }}
                      initialUrls={initialUrls}
                      onRemoveInitial={handleRemoveInitial}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              disabled={isPending || isFetching}
              className="w-full md:w-fit"
              variant="orange"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Perbarui Tugas"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default TugasFormUpdate;
