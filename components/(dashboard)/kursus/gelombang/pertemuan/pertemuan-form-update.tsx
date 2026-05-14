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
import { useGetData } from "@/hooks/use-get-data";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
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
import { TMeeting } from "./_types/meeting-type";
import { TGuru } from "@/components/(dashboard)/guru/_types/guru-type";
import MultipleSelector from "@/components/ui/multiple-selector";
import { usePatchData } from "@/hooks/use-patch-data";
import { useAssignUnassignTeachersToMeeting } from "./_hooks/use-assign-unassign-teachers";
import axiosInstance from "@/helpers/axios-instance";
import { useQueryClient } from "@tanstack/react-query";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { parseUTCStringToDate } from "./_libs";
import { TCourseBatch } from "../_types/course-batch-type";

const handleSearchTeachers = async (value: string) => {
  const queryParams = new URLSearchParams({
    q: value,
    page: "1",
    limit: "10",
    role_type: "guru",
  });
  const res = await axiosInstance.get(`/users?${queryParams.toString()}`);
  const data = res.data?.data ?? [];
  return data.map((g: TGuru) => ({
    label: g.name,
    value: g.id,
  }));
};

const MeetingFormUpdate = () => {
  const params = useParams();
  const courseSlug = params.slug as string;
  const batchSlug = params.batchSlug as string;
  const pertemuanId = params.pertemuanId as string;

  const [isReady, setIsReady] = useState(false);
  const [formDisplayTeachers, setFormDisplayTeachers] = useState<TGuru[]>([]);
  const hasInitialized = useRef(false);
  const selectedTeachersRef = useRef<TGuru[]>([]);
  const queryClient = useQueryClient();

  const form = useForm<MeetingFormData>({
    resolver: zodResolver(MeetingFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: undefined,
      start_at: undefined,
      end_at: undefined,
      assigned_teacher_ids: [],
    },
  });

  const { data: meetingData, isLoading } = useGetData({
    queryKey: ["meetings", pertemuanId],
    dataProtected: `meetings/${pertemuanId}`,
  });

  const { data: assignedTeacherData } = useGetData({
    queryKey: ["assigned-teachers", pertemuanId],
    dataProtected: `meetings/${pertemuanId}/teachers`,
  });

  const { data: teacherData } = useGetData({
    queryKey: ["guru", "all"],
    dataProtected: `users?role_type=guru&page=1&limit=15`,
  });

  const { data: batchResp } = useGetData({
    queryKey: ["batchDetail", batchSlug],
    dataProtected: `batches/${batchSlug}`,
  });

  const batch: TCourseBatch | undefined = batchResp?.data?.data;
  const batchMinDate = batch?.start_at ? new Date(batch.start_at) : undefined;
  const batchMaxDate = batch?.end_at ? new Date(batch.end_at) : undefined;

  const teachers: TGuru[] = teacherData?.data?.data ?? [];
  const assignedTeachers: TGuru[] = assignedTeacherData?.data?.data ?? [];

  const { mutate: updateMeeting, isPending } = usePatchData({
    queryKey: "meetings",
    dataProtected: `meetings/${pertemuanId}`,
    successMessage: "Pertemuan berhasil diperbarui!",
    backUrl: `/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/builder?tab=pertemuan`,
  });

  const { sync: syncTeachers } = useAssignUnassignTeachersToMeeting();

  useEffect(() => {
    if (
      !hasInitialized.current &&
      meetingData?.data?.data &&
      assignedTeacherData?.data?.data
    ) {
      const meeting: TMeeting = meetingData.data.data;
      const ids = assignedTeachers.map((g) => g.id);

      form.reset({
        title: meeting.title || "",
        description: meeting.description || "",
        start_at: parseUTCStringToDate(meeting.start_at),
        end_at: parseUTCStringToDate(meeting.end_at),
        type: meeting.meeting_type || "basic",
        assigned_teacher_ids: ids,
      });

      const seen = new Set();
      const allTeachers = [...assignedTeachers, ...teachers].filter((t) => {
        if (seen.has(t.id)) return false;
        seen.add(t.id);
        return true;
      });

      const fromBackend = allTeachers.filter((t) => ids.includes(t.id));
      selectedTeachersRef.current = fromBackend;
      setFormDisplayTeachers(fromBackend);

      hasInitialized.current = true;
      setIsReady(true);
    }
  }, [meetingData, assignedTeacherData, teachers, form]);

  const onSubmit = async (values: MeetingFormData) => {
    if (values.start_at && values.end_at && values.end_at < values.start_at) {
      form.setError("end_at", {
        type: "manual",
        message: "Tanggal ditutup tidak boleh sebelum tanggal dibuka.",
      });
      return;
    }

    const newIds = values.assigned_teacher_ids || [];
    const oldIds = selectedTeachersRef.current.map((g) => g.id);

    await syncTeachers({
      meetingId: pertemuanId,
      oldTeacherIds: oldIds,
      newTeacherIds: newIds,
    });

    queryClient.invalidateQueries({
      queryKey: ["assigned-teachers", pertemuanId],
    });

    const { title, description, type, start_at, end_at } = values;
    updateMeeting({
      title,
      description,
      type,
      start_at,
      end_at,
      is_open: true,
    });
  };

  if (!isReady) return null;

  const allTeachers = [
    ...teachers,
    ...assignedTeachers,
    ...formDisplayTeachers,
  ];
  const uniqueTeachers = allTeachers.filter(
    (g, i, self) => self.findIndex((x) => x.id === g.id) === i
  );

  const startValue = form.watch("start_at");
  const endMinDate =
    startValue && batchMinDate
      ? new Date(Math.max(startValue.getTime(), batchMinDate.getTime()))
      : (startValue ?? batchMinDate);

  return (
    <Form key={pertemuanId} {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Perbarui Pertemuan</CardTitle>
            <CardDescription>Perbarui informasi pertemuan.</CardDescription>
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
                      hourCycle={12}
                      granularity="minute"
                      defaultPopupValue={
                        field.value ?? batchMinDate ?? new Date()
                      }
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
                      hourCycle={12}
                      granularity="minute"
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

            <FormField
              control={form.control}
              name="assigned_teacher_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pengajar</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      key={uniqueTeachers.length}
                      placeholder="Pilih pengajar"
                      onSearch={handleSearchTeachers}
                      emptyIndicator={
                        <p className="text-center text-sm text-gray-500">
                          Tidak ada pengajar ditemukan.
                        </p>
                      }
                      value={(field.value || []).map((id) => {
                        const guru = uniqueTeachers.find((g) => g.id === id);
                        return guru
                          ? { label: guru.name, value: guru.id }
                          : { label: id, value: id };
                      })}
                      defaultOptions={uniqueTeachers.map((g) => ({
                        label: g.name,
                        value: g.id,
                      }))}
                      onChange={(val) => {
                        field.onChange(val.map((v) => v.value));
                      }}
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
                "Perbarui Data"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default MeetingFormUpdate;
