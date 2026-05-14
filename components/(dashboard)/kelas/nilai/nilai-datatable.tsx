"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useQueries } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetData } from "@/hooks/use-get-data";
import axiosInstance from "@/helpers/axios-instance";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { TBatchMeeting } from "../_types/kelas-pertemuan-type";
import type { TMember } from "../../member/_types/member-type";
import type { TAssignmentSubmission } from "./_types/assignment-submission-type";
import { AxiosError } from "axios";

type Props = { batchSlug: string; meetingId?: string };

type GradeRow = {
  user_id: string;
  submission_ids: (string | null)[];
  grades: (number | "")[];
};

type GradeFormData = { data: GradeRow[] };

function extractGrade(sub?: TAssignmentSubmission): number | "" {
  if (!sub) return "";

  const ag: unknown = sub.assignment_grade;

  if (ag == null) return "";

  if (typeof ag === "object" && ag !== null && "grade" in ag) {
    const g = (ag as { grade: unknown }).grade;
    if (g == null || g === "") return "";
    const num = typeof g === "number" ? g : Number(String(g).replace(",", "."));
    return Number.isFinite(num) ? num : "";
  }

  if (typeof ag === "number") return Number.isFinite(ag) ? ag : "";
  const num = Number(String(ag).replace(",", "."));
  return Number.isFinite(num) ? num : "";
}

export default function NilaiDatatable({ batchSlug, meetingId }: Props) {
  const { data: meetingsData, isLoading: isLoadingMeeting } = useGetData({
    queryKey: ["meetings", batchSlug],
    dataProtected: `batches/${batchSlug}/meetings?limit=30&sort=created_at&order=asc`,
  });
  const { data: studentsData, isLoading: isLoadingStudent } = useGetData({
    queryKey: ["students", batchSlug],
    dataProtected: `batches/${batchSlug}/students?limit=200&sort=name&order=asc`,
  });

  const meetings: TBatchMeeting[] = meetingsData?.data?.data ?? [];
  const students: TMember[] = studentsData?.data?.data ?? [];

  const activeMeeting = useMemo(() => {
    if (meetings.length === 0) return undefined;
    return meetingId
      ? (meetings.find((m) => m.id === meetingId) ?? meetings[0])
      : meetings[0];
  }, [meetings, meetingId]);

  const assignments = activeMeeting?.assignments ?? [];
  const assignmentIds = assignments.map((a) => a.id);

  const submissionQueries = useQueries({
    queries: assignmentIds.map((aid) => ({
      queryKey: ["submissions", aid],
      queryFn: async (): Promise<TAssignmentSubmission[]> => {
        const res = await axiosInstance.get(
          `assignments/${aid}/submissions?limit=10000&sort=name&order=asc`
        );
        return res?.data?.data ?? [];
      },
      enabled: !!aid,
      staleTime: 30000,
    })),
  });

  const isLoadingSubmissions = submissionQueries.some((q) => q.isLoading);
  const submissionsByAssignment: TAssignmentSubmission[][] =
    submissionQueries.map((q) => (q.data as TAssignmentSubmission[]) ?? []);

  const submissionMatrix = useMemo(() => {
    return submissionsByAssignment.map((subs) => {
      const m = new Map<string, TAssignmentSubmission>();
      subs.forEach((s) => m.set(s.user_id, s));
      return m;
    });
  }, [submissionsByAssignment]);

  const form = useForm<GradeFormData>({ defaultValues: { data: [] } });
  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "data",
  });

  const hasInitRef = useRef(false);
  const activeCellRef = useRef<{ r: number; c: number } | null>(null);
  const dirtyCellsRef = useRef<Set<string>>(new Set());

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<TAssignmentSubmission | null>(null);

  useEffect(() => {
    if (!students.length || !assignments.length) return;

    const serverRows: GradeRow[] = students.map((stu) => {
      const submission_ids = assignments.map(
        (_, colIdx) => submissionMatrix[colIdx]?.get(stu.id)?.id ?? null
      );
      const grades = assignments.map((_, colIdx) =>
        extractGrade(submissionMatrix[colIdx]?.get(stu.id))
      );
      return { user_id: stu.id, submission_ids, grades };
    });

    const curr = form.getValues().data;
    const structureChanged =
      curr.length !== serverRows.length ||
      (serverRows[0]?.grades.length ?? 0) !== (curr[0]?.grades.length ?? 0);

    if (!hasInitRef.current || structureChanged) {
      replace(serverRows);
      hasInitRef.current = true;
      return;
    }

    serverRows.forEach((row, rIdx) => {
      row.grades.forEach((g, cIdx) => {
        if (g === "") return;
        const key = `${rIdx}:${cIdx}`;
        const active = activeCellRef.current;
        if (dirtyCellsRef.current.has(key)) return;
        if (active && active.r === rIdx && active.c === cIdx) return;
        const currVal = form.getValues(`data.${rIdx}.grades.${cIdx}`);
        if (currVal !== g)
          form.setValue(`data.${rIdx}.grades.${cIdx}`, g, {
            shouldDirty: false,
          });
      });
      row.submission_ids.forEach((sid, cIdx) => {
        const currSid = form.getValues(`data.${rIdx}.submission_ids.${cIdx}`);
        if (sid && currSid !== sid)
          form.setValue(`data.${rIdx}.submission_ids.${cIdx}`, sid, {
            shouldDirty: false,
          });
      });
    });
  }, [students, assignments, submissionMatrix, form, replace]);

  const onSubmit = async (values: GradeFormData) => {
    const jobs: Array<{
      submission_id: string;
      grade: number;
      r: number;
      c: number;
    }> = [];
    values.data.forEach((row, rIdx) => {
      row.submission_ids.forEach((sid, cIdx) => {
        const gradeVal = row.grades[cIdx];
        if (sid && gradeVal !== "" && !Number.isNaN(Number(gradeVal))) {
          jobs.push({
            submission_id: sid,
            grade: Number(gradeVal),
            r: rIdx,
            c: cIdx,
          });
        }
      });
    });

    if (!jobs.length) {
      toast("Belum ada nilai yang bisa disimpan.", {
        description: "Pastikan peserta sudah submit.",
      });
      return;
    }

    toast("Mohon menunggu sebentar!", {
      description: "Data sedang dalam proses.",
    });

    try {
      await Promise.all(
        jobs.map((j) =>
          axiosInstance.put(`/submissions/${j.submission_id}/grade`, {
            grade: j.grade,
          })
        )
      );

      jobs.forEach((j) => {
        form.setValue(`data.${j.r}.grades.${j.c}`, j.grade, {
          shouldDirty: false,
        });
        dirtyCellsRef.current.delete(`${j.r}:${j.c}`);
      });

      toast("Berhasil!", { description: "Nilai berhasil disimpan!" });
      await Promise.all(submissionQueries.map((q) => q.refetch?.()));
    } catch (error: unknown) {
      const err = error as AxiosError<{
        message?: string | { message?: string };
      }>;
      const msg =
        typeof err.response?.data?.message === "string"
          ? err.response.data.message
          : err.response?.data?.message?.message || "Gagal mengubah data.";
      toast("Terjadi kesalahan!", { description: msg });
    }
  };

  if (isLoadingStudent || isLoadingMeeting || !activeMeeting) {
    return (
      <Card className="w-full overflow-x-auto">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl font-semibold">
            Memuat Penilaian…
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full overflow-x-auto">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl font-semibold">
            Penilaian Tugas ({activeMeeting.title})
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isLoadingSubmissions ? (
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="w-[50px] text-center">No</TableHead>
                      <TableHead className="min-w-[260px]">Identitas</TableHead>
                      {assignments.map((a) => (
                        <TableHead
                          key={a.id}
                          className="min-w-[220px] text-center"
                        >
                          <div className="flex flex-col items-center">
                            <span className="font-semibold">{a.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {a.type.toUpperCase()}
                            </span>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {fields.map((row, rowIdx) => {
                      const stu = students[rowIdx];
                      const nimNik = stu.profile.nim || stu.profile.nik || "-";
                      return (
                        <TableRow
                          key={row.user_id}
                          className="hover:bg-muted/50"
                        >
                          <TableCell className="text-center align-middle">
                            {rowIdx + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-4">
                              <ImageWithFallback
                                width={1200}
                                height={1200}
                                src={stu.avatar}
                                alt={stu.name}
                                className="h-12 w-12 rounded-full object-cover border"
                                fallbackClassName="rounded-full"
                              />
                              <div>
                                <p className="font-semibold">{stu.name}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  <Badge variant="outline">{nimNik}</Badge>
                                  <Badge variant="secondary">
                                    {stu.profile.institution}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </TableCell>

                          {assignments.map((a, colIdx) => {
                            const sub = submissionMatrix[colIdx]?.get(stu.id);
                            const submitted = !!sub;
                            const fieldPath =
                              `data.${rowIdx}.grades.${colIdx}` as const;
                            const watched = form.watch(fieldPath);
                            const key = `${rowIdx}:${colIdx}`;

                            return (
                              <TableCell
                                key={`${row.user_id}-${a.id}`}
                                className="text-center align-middle"
                              >
                                <div className="flex flex-col items-center gap-2">
                                  <div className="h-5">
                                    {submitted ? (
                                      <Badge variant="secondary">
                                        Sudah Mengumpulkan
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline">
                                        Belum Mengumpulkan
                                      </Badge>
                                    )}
                                    {submitted && sub?.is_late && (
                                      <Badge
                                        className="ml-2"
                                        variant="destructive"
                                      >
                                        Telat Mengumpulkan
                                      </Badge>
                                    )}
                                  </div>

                                  <div className="flex flex-col items-center gap-2">
                                    <Input
                                      type="number"
                                      step="1"
                                      min={0}
                                      max={100}
                                      inputMode="numeric"
                                      className="w-24 text-center"
                                      value={
                                        watched === "" ? "" : String(watched)
                                      }
                                      onFocus={() =>
                                        (activeCellRef.current = {
                                          r: rowIdx,
                                          c: colIdx,
                                        })
                                      }
                                      onBlur={() =>
                                        (activeCellRef.current = null)
                                      }
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        const num =
                                          val.trim() === ""
                                            ? ""
                                            : Math.max(
                                                0,
                                                Math.min(
                                                  100,
                                                  Number(val.replace(",", "."))
                                                )
                                              );
                                        dirtyCellsRef.current.add(key);
                                        form.setValue(
                                          fieldPath,
                                          num as number | "",
                                          { shouldDirty: true }
                                        );
                                      }}
                                      disabled={!submitted}
                                      placeholder="-"
                                    />

                                    <Button
                                      type="button"
                                      variant="outline"
                                      className="h-9"
                                      disabled={!submitted}
                                      onClick={() => {
                                        if (sub) {
                                          setSelectedSubmission(sub);
                                          setOpenDialog(true);
                                        }
                                      }}
                                    >
                                      Lihat jawaban
                                    </Button>
                                  </div>
                                </div>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 text-left">
                <Button type="submit" variant="orange">
                  Simpan Nilai
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>Lihat Jawaban</DialogTitle>
            <DialogDescription>
              Pratinjau jawaban peserta untuk tugas terpilih.
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission ? (
            <>
              {selectedSubmission.assignment?.type === "essay" ? (
                <div
                  className="prose max-w-none border rounded-md p-4 bg-muted/30"
                  dangerouslySetInnerHTML={{
                    __html: selectedSubmission.essay_text || "<p>(Kosong)</p>",
                  }}
                />
              ) : (
                <div className="space-y-3">
                  {selectedSubmission.submission_files?.length ? (
                    selectedSubmission.submission_files.map((f, idx) => {
                      const ext =
                        f.file_url.split(".").pop()?.toLowerCase() || "";
                      const studentName = selectedSubmission.user.name
                        .replace(/\s+/g, "_")
                        .toLowerCase();
                      const assignmentTitle =
                        selectedSubmission.assignment.title
                          .replace(/\s+/g, "_")
                          .toLowerCase();

                      const filename = `${studentName}_${assignmentTitle}_${idx + 1}.${ext}`;

                      return (
                        <div
                          key={f.id}
                          className="flex items-center justify-between gap-2"
                        >
                          <span className="text-sm">{filename}</span>
                          <Button asChild size="sm" variant="secondary">
                            <a
                              href={f.file_url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Lihat jawaban
                            </a>
                          </Button>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Tidak ada lampiran yang diunggah.
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Tidak ada data.</p>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenDialog(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
