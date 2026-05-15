"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  BadgeCheck,
  CalendarDays,
  Camera,
  FileCheck2,
  IdCard,
  Loader2,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toAssetUrl } from "@/helpers/api-config";
import { useFileUploader } from "@/hooks/use-file-uploader";
import { useGetData } from "@/hooks/use-get-data";
import { usePatchData } from "@/hooks/use-patch-data";
import { normalizeToUTCDateOnly } from "./_libs/normalize-to-utc-date";
import {
  TUpdateProfile,
  updateProfileSchema,
} from "./_schemas/update-profile-schema";
import { TUpdateProfilePayload } from "./_types/update-profile-payload-type";
import { TUser } from "./_types/user-type";

const groupLabels: Record<TUpdateProfile["group_type"], string> = {
  mahasiswa_gunadarma: "Mahasiswa Gunadarma",
  mahasiswa_non_gunadarma: "Mahasiswa Non Gunadarma",
  umum: "Umum",
};

const roleLabels: Record<TUpdateProfile["role_type"], string> = {
  admin: "Admin",
  guru: "Guru",
  siswa: "Siswa",
};

const MyProfileForm = () => {
  const { uploadFile } = useFileUploader();

  const { data: myProfileData, isLoading } = useGetData({
    queryKey: ["me"],
    dataProtected: "users/me",
  });

  const user: TUser | undefined = myProfileData?.data?.data;

  const form = useForm<TUpdateProfile>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      phone: "",
      avatar: "",
      institution: "",
      origin: "",
      birth_date: undefined,
      address: "",
      group_type: "umum",
      role_type: "siswa",
      nim: "",
      nim_proof: "",
      nik: "",
    },
  });

  const group_type = useWatch({ control: form.control, name: "group_type" });
  const role_type = form.watch("role_type");
  const nimProofUrl = form.watch("nim_proof");
  const avatarUrl = toAssetUrl(form.watch("avatar") || user?.avatar);
  const nimProofAssetUrl = toAssetUrl(nimProofUrl);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "documents" | "images",
    field: keyof TUpdateProfile,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await uploadFile(file, type);
    form.setValue(field, url || "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const mutation = usePatchData({
    queryKey: "me",
    dataProtected: "me",
    successMessage: "Profil berhasil diperbarui!",
  });

  const onSubmit = (values: TUpdateProfile) => {
    const birthDate = normalizeToUTCDateOnly(values.birth_date);

    const payload: TUpdateProfilePayload = {
      name: values.name,
      phone: values.phone,
      avatar: values.avatar,
      institution: values.institution,
      origin: values.origin,
      birth_date: birthDate!,
      address: values.address,
      group_type: values.group_type,
    };

    if (values.group_type === "umum") {
      payload.nik = values.nik;
    } else if (
      values.group_type === "mahasiswa_gunadarma" ||
      values.group_type === "mahasiswa_non_gunadarma"
    ) {
      payload.nim = values.nim;
      payload.nim_proof = values.nim_proof;
    }

    mutation.mutate(payload);
  };

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        institution: user.profile.institution,
        origin: user.profile.origin,
        birth_date: new Date(user.profile.birth_date),
        address: user.profile.address,
        group_type: user.profile.group_type ?? "umum",
        role_type: user.role_type,
        nim: user.profile.nim ?? "",
        nim_proof: user.profile.nim_proof ?? "",
        nik: user.profile.nik ?? "",
      });
    }
  }, [user, form]);

  if (isLoading) return <ProfileSkeleton />;

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit(onSubmit, () => {
            toast.error("Ada isian yang belum benar.");
          })(event);
        }}
        className="min-w-0 space-y-5 overflow-x-hidden"
      >
        <section className="min-w-0 overflow-hidden rounded-lg border bg-card p-5">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0">
              <Badge variant="outline" className="mb-4 gap-2">
                <UserRound className="size-3" />
                Pengaturan Profil
              </Badge>
              <h1 className="text-2xl font-extrabold tracking-normal">
                Lengkapi data yang dipakai di kelas dan sertifikat.
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Data profil membantu admin memverifikasi kategori peserta,
                pembayaran, akses kelas, dan penerbitan sertifikat.
              </p>
            </div>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Menyimpan
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </section>

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <aside className="min-w-0 space-y-5">
            <section className="min-w-0 overflow-hidden rounded-lg border bg-card p-5">
              <div className="flex items-center gap-4">
                <Avatar className="size-20 border">
                  <AvatarImage src={avatarUrl} className="object-cover" />
                  <AvatarFallback className="text-xl font-bold">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-lg font-extrabold">
                    {user?.name || "Pengguna"}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {user?.email}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {roleLabels[role_type] ?? role_type}
                    </Badge>
                    <Badge variant="outline">
                      {groupLabels[group_type] ?? group_type}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 text-sm">
                <ProfileFact
                  icon={<Phone className="size-4" />}
                  label="Telepon"
                  value={form.watch("phone") || "-"}
                />
                <ProfileFact
                  icon={<MapPin className="size-4" />}
                  label="Asal"
                  value={form.watch("origin") || "-"}
                />
                <ProfileFact
                  icon={<ShieldCheck className="size-4" />}
                  label="Verifikasi Grup"
                  value={user?.profile.group_verified ? "Terverifikasi" : "Belum diverifikasi"}
                />
              </div>
            </section>

            <section className="min-w-0 overflow-hidden rounded-lg border bg-card p-5">
              <div className="flex items-start gap-3">
                <BadgeCheck className="mt-0.5 size-5 text-primary" />
                <div>
                  <h2 className="font-bold">Pastikan data resmi.</h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Nama, kategori peserta, NIK atau NIM akan dipakai sebagai
                    acuan administrasi. Periksa sebelum menyimpan.
                  </p>
                </div>
              </div>
            </section>
          </aside>

          <main className="min-w-0 space-y-5">
            <FormSection
              icon={<UserRound className="size-5" />}
              title="Identitas dasar"
              description="Data kontak utama untuk akun dan komunikasi admin."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Budi Santoso" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No. Telepon</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: 081234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="avatar"
                  render={() => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Foto Profil</FormLabel>
                      <FormControl>
                        <label className="flex cursor-pointer items-center gap-3 rounded-md border bg-background px-4 py-3 text-sm transition hover:bg-accent">
                          <Camera className="size-4 text-primary" />
                          <span className="min-w-0 truncate font-medium">
                            Pilih gambar profil
                          </span>
                          <Input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(event) =>
                              handleFileChange(event, "images", "avatar")
                            }
                          />
                        </label>
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Gunakan gambar wajah yang jelas agar mudah dikenali
                        admin dan pengajar.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FormSection>

            <FormSection
              icon={<CalendarDays className="size-5" />}
              title="Data asal dan domisili"
              description="Informasi administratif untuk pengelompokan peserta."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="institution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asal Institusi</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: Universitas Gunadarma"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asal Daerah</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Depok" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birth_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Lahir</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Pilih tanggal lahir"
                          granularity="day"
                          displayFormat={{ hour24: "PPP" }}
                          className="min-w-0 overflow-hidden"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="group_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori Peserta</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih kategori peserta" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="umum">Umum</SelectItem>
                          <SelectItem value="mahasiswa_gunadarma">
                            Mahasiswa Gunadarma
                          </SelectItem>
                          <SelectItem value="mahasiswa_non_gunadarma">
                            Mahasiswa Non Gunadarma
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Alamat</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Contoh: Jl. Mawar No. 10, Depok"
                          className="min-h-28"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FormSection>

            <FormSection
              icon={<IdCard className="size-5" />}
              title="Identitas pendukung"
              description="Isi sesuai kategori peserta agar verifikasi lebih mudah."
            >
              {group_type !== "umum" ? (
                <div className="grid gap-5">
                  <FormField
                    control={form.control}
                    name="nim"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIM</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: 123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nim_proof"
                    render={() => (
                      <FormItem>
                        <FormLabel>Bukti NIM</FormLabel>
                        <FormControl>
                          <label className="flex cursor-pointer items-center gap-3 rounded-md border bg-background px-4 py-3 text-sm transition hover:bg-accent">
                            <FileCheck2 className="size-4 text-primary" />
                            <span className="min-w-0 truncate font-medium">
                              Upload kartu mahasiswa
                            </span>
                            <Input
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={(event) =>
                                handleFileChange(event, "images", "nim_proof")
                              }
                            />
                          </label>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {nimProofUrl && (
                    <Link
                      href={nimProofAssetUrl}
                      target="_blank"
                      className="block overflow-hidden rounded-lg border bg-muted"
                    >
                      <ImageWithFallback
                        src={nimProofAssetUrl}
                        alt="Bukti NIM"
                        width={1200}
                        height={720}
                        className="max-h-[360px] w-full object-cover"
                      />
                    </Link>
                  )}
                </div>
              ) : role_type === "siswa" ? (
                <FormField
                  control={form.control}
                  name="nik"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIK</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: 3201234567890001"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <div className="rounded-md border bg-background p-4 text-sm leading-6 text-muted-foreground">
                  Identitas pendukung tidak wajib untuk role ini.
                </div>
              )}
            </FormSection>

            <div className="sticky bottom-3 z-10 min-w-0 overflow-hidden rounded-lg border bg-card/95 p-3 shadow-sm backdrop-blur">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Simpan setelah semua data resmi sudah benar.
                </p>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Menyimpan
                    </>
                  ) : (
                    <>
                      <Save className="size-4" />
                      Simpan Perubahan
                    </>
                  )}
                </Button>
              </div>
            </div>
          </main>
        </div>
      </form>
    </Form>
  );
};

function ProfileFact({
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

function FormSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-lg border bg-card p-5 md:p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="min-w-0">
          <h2 className="break-words text-lg font-extrabold">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-5">
      <section className="rounded-lg border bg-card p-5">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-4 h-8 w-2/3" />
        <Skeleton className="mt-3 h-5 w-1/2" />
      </section>
      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <section className="min-w-0 overflow-hidden rounded-lg border bg-card p-5">
          <div className="flex items-center gap-4">
            <Skeleton className="size-20 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-4 h-6 w-32" />
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </section>
        <section className="min-w-0 overflow-hidden rounded-lg border bg-card p-6">
          <Skeleton className="h-10 w-60" />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full md:col-span-2" />
            <Skeleton className="h-28 w-full md:col-span-2" />
          </div>
        </section>
      </div>
    </div>
  );
}

function getInitials(name?: string) {
  if (!name) return "UG";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default MyProfileForm;
