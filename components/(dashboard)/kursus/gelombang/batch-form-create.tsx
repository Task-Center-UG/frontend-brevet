"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, MapPin, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { Badge } from "@/components/ui/badge";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Input } from "@/components/ui/input";
import MultipleSelector from "@/components/ui/multiple-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFileUploader } from "@/hooks/use-file-uploader";
import { useGetData } from "@/hooks/use-get-data";
import { usePostData } from "@/hooks/use-post-data";

import {
  DashboardFormActions,
  DashboardFormHeader,
  DashboardFormSection,
} from "../_components/dashboard-form-shell";
import { normalizeToUTCDateOnly } from "../../profile/_libs/normalize-to-utc-date";
import { DAY_OPTIONS } from "./_constants/day-options";
import { GROUP_TYPE_OPTIONS } from "./_constants/group-type-options";
import {
  CreateBatchFormData,
  CreateBatchSchema,
} from "./_schemas/batch-create-schema";
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

  const title = form.watch("title");
  const room = form.watch("room");
  const quota = form.watch("quota");
  const courseType = form.watch("course_type");
  const startTime = form.watch("start_time");
  const endTime = form.watch("end_time");
  const thumbnail = form.watch("batch_thumbnail");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="min-w-0 space-y-5"
      >
        <DashboardFormHeader
          eyebrow="Manajemen Gelombang"
          title="Tambah gelombang dengan jadwal dan kuota yang mudah dipindai."
          description="Kelompokkan data pendaftaran, jadwal kelas, kapasitas, peserta, dan thumbnail agar admin tidak membaca satu blok panjang."
        />

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <main className="min-w-0 space-y-5">
            <DashboardFormSection
              step="01"
              title="Identitas gelombang"
              description="Judul dan deskripsi jadi konteks utama calon peserta."
            >
              <div className="grid gap-5">
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
                          editable
                          output="html"
                          className="w-full max-w-full overflow-hidden"
                          editorContentClassName="prose max-w-none p-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </DashboardFormSection>

            <DashboardFormSection
              step="02"
              title="Periode pendaftaran dan kelas"
              description="Pisahkan tanggal pendaftaran dari tanggal kelas agar tidak tertukar."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <FormDate
                  name="registration_start_at"
                  label="Mulai Pendaftaran"
                  control={form.control}
                />
                <FormDate
                  name="registration_end_at"
                  label="Akhir Pendaftaran"
                  control={form.control}
                />
                <FormDate
                  name="start_at"
                  label="Tanggal Mulai Kelas"
                  control={form.control}
                />
                <FormDate
                  name="end_at"
                  label="Tanggal Selesai Kelas"
                  control={form.control}
                />
              </div>
            </DashboardFormSection>

            <DashboardFormSection
              step="03"
              title="Waktu dan lokasi"
              description="Jam, ruangan, dan tipe kelas menentukan ekspektasi peserta."
            >
              <div className="grid gap-5 md:grid-cols-2">
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
              </div>
            </DashboardFormSection>

            <DashboardFormSection
              step="04"
              title="Kapasitas dan peserta"
              description="Tentukan kuota, hari aktif, dan kategori peserta yang boleh mendaftar."
            >
              <div className="grid gap-5">
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
                            <p className="text-center text-sm text-muted-foreground">
                              Tidak ada hari ditemukan.
                            </p>
                          }
                          defaultOptions={DAY_OPTIONS}
                          value={DAY_OPTIONS.filter((opt) =>
                            field.value.includes(opt.value),
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
                            <p className="text-center text-sm text-muted-foreground">
                              Tidak ada opsi ditemukan.
                            </p>
                          }
                          defaultOptions={GROUP_TYPE_OPTIONS}
                          value={GROUP_TYPE_OPTIONS.filter((opt) =>
                            (field.value as TGroupType[]).includes(
                              opt.value as TGroupType,
                            ),
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
              </div>
            </DashboardFormSection>

            <DashboardFormSection
              step="05"
              title="Thumbnail"
              description="Gambar ini membantu gelombang terlihat jelas di halaman publik."
            >
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
            </DashboardFormSection>
          </main>

          <BatchPreview
            title={title}
            thumbnail={thumbnail}
            courseType={courseType}
            quota={quota}
            room={room}
            startTime={startTime}
            endTime={endTime}
          />
        </div>

        <DashboardFormActions
          disabled={isPending}
          pending={isPending}
          label="Simpan Data"
          note="Simpan setelah jadwal, kuota, dan kategori peserta sudah benar."
        />
      </form>
    </Form>
  );
};

function FormDate({
  control,
  name,
  label,
}: {
  control: any;
  name: keyof CreateBatchFormData;
  label: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-2">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <DateTimePicker
              placeholder="Pilih tanggal"
              value={field.value as Date | undefined}
              onChange={field.onChange}
              granularity="day"
              displayFormat={{ hour24: "PPP" }}
              className="min-w-0 overflow-hidden"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function BatchPreview({
  title,
  thumbnail,
  courseType,
  quota,
  room,
  startTime,
  endTime,
}: {
  title?: string;
  thumbnail?: string;
  courseType?: string;
  quota?: number;
  room?: string;
  startTime?: string;
  endTime?: string;
}) {
  return (
    <aside className="min-w-0 space-y-5 xl:sticky xl:top-24 xl:h-fit">
      <section className="overflow-hidden rounded-lg border bg-card">
        <div className="relative aspect-[4/3] bg-muted">
          <ImageWithFallback
            src={thumbnail || "/placeholder.jpeg"}
            alt="Pratinjau thumbnail gelombang"
            fill
            className="object-cover"
          />
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {courseType === "online" ? "Online" : "Offline"}
            </Badge>
            <Badge variant="outline">{quota || 0} peserta</Badge>
          </div>
          <h2 className="mt-4 text-xl font-bold leading-7">
            {title || "Judul gelombang akan tampil di sini"}
          </h2>
          <div className="mt-4 grid gap-3 text-sm">
            <PreviewFact
              icon={<Clock className="size-4" />}
              label="Jam"
              value={`${startTime || "--:--"} - ${endTime || "--:--"}`}
            />
            <PreviewFact
              icon={<MapPin className="size-4" />}
              label="Lokasi"
              value={room || "Belum diisi"}
            />
            <PreviewFact
              icon={<Users className="size-4" />}
              label="Kapasitas"
              value={`${quota || 0} peserta`}
            />
          </div>
        </div>
      </section>
    </aside>
  );
}

function PreviewFact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md border bg-background p-3">
      <span className="mt-0.5 text-primary">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 truncate font-semibold">{value}</p>
      </div>
    </div>
  );
}

export default BatchFormCreate;
