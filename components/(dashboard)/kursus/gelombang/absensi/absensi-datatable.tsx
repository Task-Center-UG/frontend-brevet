"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useGetData } from "@/hooks/use-get-data";
import { usePutData } from "@/hooks/use-put-data";
import { AbsensiFormData, absensiSchema } from "./_schemas/absensi-schema";
import { TAttendance, TAttendanceUser } from "./_types/absensi-type";
import { TMeeting } from "../pertemuan/_types/meeting-type";

type Props = { batchSlug: string };

type TUserWithAttendances = TAttendanceUser & { attendances: TAttendance[] };

export function AbsensiDatatable({ batchSlug }: Props) {
  const { data: attendancesData, isLoading: isLoadingAttendance } = useGetData({
    queryKey: ["attendances", batchSlug],
    dataProtected: `batches/${batchSlug}/attendances?limit=200`,
  });

  const { data: meetingsData, isLoading: isLoadingMeeting } = useGetData({
    queryKey: ["meetings", batchSlug],
    dataProtected: `batches/${batchSlug}/meetings?limit=30`,
  });

  const users: TUserWithAttendances[] = attendancesData?.data.data ?? [];
  const meetings: TMeeting[] = meetingsData?.data.data ?? [];
  const batchId = meetings[0]?.batch_id;

  const groupedByStudent = useMemo(() => {
    const list = [...users].sort((a, b) => a.name.localeCompare(b.name));
    return list.map((user) => {
      const pertemuan = meetings.map((m) => {
        const a = user.attendances.find((x) => x.meeting_id === m.id);
        return a?.is_present ?? false;
      });
      return { user, pertemuan };
    });
  }, [users, meetings]);

  const form = useForm<AbsensiFormData>({
    resolver: zodResolver(absensiSchema),
    defaultValues: { data: [] },
  });

  const { fields } = useFieldArray({ control: form.control, name: "data" });

  const putAbsensi = usePutData({
    queryKey: ["attendances", batchSlug],
    dataProtected: `batches/${batchId}/attendances/bulk`,
    successMessage: "Absensi berhasil disimpan!",
  });

  useEffect(() => {
    if (groupedByStudent.length > 0) {
      const mapped = groupedByStudent.map((item) => ({
        id: item.user.id,
        pertemuan: item.pertemuan,
      }));
      form.reset({ data: mapped });
    }
  }, [groupedByStudent, form]);

  const onSubmit = (values: AbsensiFormData) => {
    const body = values.data.flatMap((siswa) =>
      meetings.map((meeting, idx) => ({
        user_id: siswa.id,
        meeting_id: meeting.id,
        is_present: siswa.pertemuan[idx],
        note: siswa.pertemuan[idx] ? "Hadir" : "Tidak hadir",
      }))
    );

    console.log(body);

    putAbsensi.mutate({ attendances: body });
  };

  if (isLoadingAttendance || isLoadingMeeting) {
    return (
      <Card className="w-full overflow-x-auto">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl font-semibold">
            Memuat Absensi Peserta...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-4 w-[60%]" />
                <Skeleton className="h-4 w-[40%]" />
              </div>
              <div className="flex space-x-2 ml-auto">
                {[...Array(4)].map((__, i) => (
                  <Skeleton key={i} className="h-5 w-5 rounded" />
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-x-auto">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl font-semibold">
          Absensi Peserta
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-[50px] text-center">No</TableHead>
                  <TableHead className="min-w-[250px]">Identitas</TableHead>
                  {meetings.map((_, idx) => (
                    <TableHead key={idx} className="text-center">
                      {idx + 1}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, idx) => {
                  const student = groupedByStudent[idx]?.user;
                  if (!student) return null;
                  return (
                    <TableRow
                      key={field.id}
                      className="hover:bg-muted/50 transition"
                    >
                      <TableCell className="text-center">{idx + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <ImageWithFallback
                            width={120}
                            height={120}
                            src={student.avatar}
                            alt={student.name}
                            className="h-12 w-12 rounded-full object-cover border"
                            fallbackClassName="rounded-full"
                          />
                          <div>
                            <p className="font-semibold">{student.name}</p>
                            <Badge variant="outline">{student.email}</Badge>
                          </div>
                        </div>
                      </TableCell>
                      {field.pertemuan.map((_, i) => (
                        <TableCell key={i} className="text-center">
                          <Checkbox
                            checked={form.watch(`data.${idx}.pertemuan.${i}`)}
                            onCheckedChange={(checked) =>
                              form.setValue(
                                `data.${idx}.pertemuan.${i}`,
                                !!checked
                              )
                            }
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="mt-6 text-left">
            <Button
              type="submit"
              variant="orange"
              disabled={putAbsensi.isPending}
            >
              {putAbsensi.isPending ? "Menyimpan..." : "Simpan Absensi"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
