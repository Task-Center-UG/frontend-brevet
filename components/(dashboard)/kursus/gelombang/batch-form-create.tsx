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
import { useFileUploader } from "@/hooks/use-file-uploader";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  CreateBatchFormData,
  CreateBatchSchema,
} from "./_schemas/batch-create-schema";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import MultipleSelector from "@/components/ui/multiple-selector";
import { DAY_OPTIONS } from "./_constants/day-options";
import { useGetData } from "@/hooks/use-get-data";
import { normalizeToUTCDateOnly } from "../../profile/_libs/normalize-to-utc-date";
import { GROUP_TYPE_OPTIONS } from "./_constants/group-type-options";
import { TGroupType } from "./_types/group-type";

const BatchFormCreate = () => {
  const { uploadFile } = useFileUploader();
  const params = useParams();
  const courseSlug = params.slug as string;

  const { data } = useGetData({
    queryKey: ["courses", courseSlug],
    dataProtected: `courses/${courseSlug}`,
    options: {
      refetchOnWindowFocus: false,
    },
  });

  const form = useForm<CreateBatchFormData>({
    resolver: zodResolver(CreateBatchSchema),
    defaultValues: {
      title: "",
      description: "",
      start_at: undefined,
      end_at: undefined,
      registration_start_at: undefined,
      registration_end_at: undefined,
      room: "",
      quota: 50,
      batch_thumbnail: "",
      days: [],
      group_types: [],
      course_type: "offline",
      start_time: "",
      end_time: "",
    },
  });

  const { mutate: submitBatch, isPending } = usePostData({
    queryKey: "batches",
    dataProtected: `courses/${data?.data?.data.id}/batches`,
    successMessage: "Gelombang berhasil ditambahkan!",
    backUrl: `/dashboard/kursus/${courseSlug}/builder?tab=gelombang`,
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, "images");
    form.setValue("batch_thumbnail", url || "", { shouldValidate: true });
  };

  const onSubmit = (values: CreateBatchFormData) => {
    const { start_at, end_at, ...rest } = values;
    const startAt = normalizeToUTCDateOnly(start_at);
    const endAt = normalizeToUTCDateOnly(end_at);

    submitBatch({ ...rest, start_at: startAt, end_at: endAt });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Tambah Gelombang</CardTitle>
            <CardDescription>
              Lengkapi informasi gelombang/batch baru.
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
                    <Input {...field} placeholder="Judul gelombang" />
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
                    <MinimalTiptapEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Masukkan deskripsi gelombang"
                      autofocus={false}
                      editable={true}
                      output="html"
                      className="w-full max-w-full overflow-hidden"
                      editorContentClassName="prose max-w-none p-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="registration_start_at"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel htmlFor="registration_start_at">
                      Tanggal Mulai Pendaftaran
                    </FormLabel>
                    <FormControl>
                      <DateTimePicker
                        placeholder="Pilih tanggal mulai pendaftaran"
                        value={field.value}
                        onChange={field.onChange}
                        granularity="day"
                        displayFormat={{ hour24: "PPP" }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="registration_end_at"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel htmlFor="registration_end_at">
                      Tanggal Akhir Pendaftaran
                    </FormLabel>
                    <FormControl>
                      <DateTimePicker
                        placeholder="Pilih tanggal akhir pendaftaran"
                        value={field.value}
                        onChange={field.onChange}
                        granularity="day"
                        displayFormat={{ hour24: "PPP" }}
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
                name="start_at"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel htmlFor="start_at">Tanggal Mulai</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        placeholder="Pilih tanggal mulai"
                        value={field.value}
                        onChange={field.onChange}
                        granularity="day"
                        displayFormat={{ hour24: "PPP" }}
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
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel htmlFor="end_at">Tanggal Selesai</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        placeholder="Pilih tanggal selesai"
                        value={field.value}
                        onChange={field.onChange}
                        granularity="day"
                        displayFormat={{ hour24: "PPP" }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="room"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ruangan</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nama ruangan" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jam Mulai</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        placeholder="08:00"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
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
                    <FormLabel>Jam Selesai</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        placeholder="10:00"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="quota"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kuota</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      placeholder="Jumlah peserta"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hari</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      placeholder="Pilih hari"
                      emptyIndicator={
                        <p className="text-center text-sm text-gray-500">
                          Tidak ada hari ditemukan.
                        </p>
                      }
                      defaultOptions={DAY_OPTIONS}
                      value={DAY_OPTIONS.filter((opt) =>
                        field.value.includes(opt.value)
                      )}
                      onChange={(selected) =>
                        field.onChange(selected.map((item) => item.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="group_types"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Peserta</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      placeholder="Pilih jenis peserta"
                      emptyIndicator={
                        <p className="text-center text-sm text-gray-500">
                          Tidak ada opsi ditemukan.
                        </p>
                      }
                      defaultOptions={GROUP_TYPE_OPTIONS}
                      value={GROUP_TYPE_OPTIONS.filter((opt) =>
                        (field.value as TGroupType[]).includes(
                          opt.value as TGroupType
                        )
                      )}
                      onChange={(selected) =>
                        field.onChange(selected.map((item) => item.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="course_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Kursus</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih tipe kursus" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="batch_thumbnail"
              render={() => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
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
              disabled={isPending}
              className="w-full md:w-fit"
              variant={"orange"}
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

export default BatchFormCreate;
