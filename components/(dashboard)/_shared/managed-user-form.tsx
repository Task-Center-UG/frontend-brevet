"use client";

import Link from "next/link";
import type { UseFormReturn } from "react-hook-form";
import {
  BadgeCheck,
  CalendarDays,
  Camera,
  FileCheck2,
  IdCard,
  Loader2,
  Mail,
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

type ManagedUserRole = "admin" | "guru" | "siswa";
type ManagedUserMode = "create" | "update";
type ManagedUserForm = UseFormReturn<any>;

const roleLabels: Record<ManagedUserRole, string> = {
  admin: "Admin",
  guru: "Pengajar",
  siswa: "Peserta",
};

const roleCopy: Record<
  ManagedUserRole,
  { titleCreate: string; titleUpdate: string; desc: string }
> = {
  admin: {
    titleCreate: "Tambah admin dengan data siap audit.",
    titleUpdate: "Perbarui profil admin dengan rapi.",
    desc: "Admin punya akses operasional luas. Pastikan kontak, institusi, dan identitas dasar benar sebelum disimpan.",
  },
  guru: {
    titleCreate: "Tambah pengajar dengan konteks kelas jelas.",
    titleUpdate: "Perbarui data pengajar tanpa form panjang.",
    desc: "Data pengajar dipakai untuk penugasan kelas, komunikasi, dan struktur pembelajaran di LMS.",
  },
  siswa: {
    titleCreate: "Tambah peserta dengan data verifikasi lengkap.",
    titleUpdate: "Perbarui data peserta dan kategori validasi.",
    desc: "Data peserta dipakai untuk pembayaran, akses kelas, nilai, dan penerbitan sertifikat.",
  },
};

type Props = {
  form: ManagedUserForm;
  role: ManagedUserRole;
  mode: ManagedUserMode;
  isPending: boolean;
  onSubmit: (values: any) => void;
  onInvalid: () => void;
  avatarUrl?: string;
  nimProofUrl?: string;
  handleFileChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "documents" | "images",
    field: string,
  ) => void;
};

export function ManagedUserForm({
  form,
  role,
  mode,
  isPending,
  onSubmit,
  onInvalid,
  avatarUrl,
  nimProofUrl,
  handleFileChange,
}: Props) {
  const groupType = form.watch("group_type");
  const name = form.watch("name");
  const email = form.watch("email");
  const phone = form.watch("phone");
  const origin = form.watch("origin");
  const institution = form.watch("institution");
  const showAccountFields = mode === "create";
  const showParticipantFields = role === "siswa";
  const showStudentProof =
    showParticipantFields &&
    (groupType === "mahasiswa_gunadarma" ||
      groupType === "mahasiswa_non_gunadarma");
  const showNik = showParticipantFields && groupType === "umum";
  const title =
    mode === "create" ? roleCopy[role].titleCreate : roleCopy[role].titleUpdate;

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit(onSubmit, onInvalid)(event);
        }}
        className="min-w-0 space-y-5 overflow-x-hidden"
      >
        <section className="min-w-0 overflow-hidden rounded-lg border bg-card p-5">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0">
              <Badge variant="outline" className="mb-4 gap-2">
                <UserRound className="size-3" />
                {mode === "create" ? "Tambah Akun" : "Update Akun"}
              </Badge>
              <h1 className="text-2xl font-extrabold tracking-normal">
                {title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {roleCopy[role].desc}
              </p>
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Menyimpan
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  {mode === "create" ? "Simpan Data" : "Simpan Perubahan"}
                </>
              )}
            </Button>
          </div>
        </section>

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
          <aside className="min-w-0 space-y-5">
            <section className="min-w-0 overflow-hidden rounded-lg border bg-card p-5">
              <div className="flex items-center gap-4">
                <Avatar className="size-20 border">
                  <AvatarImage src={avatarUrl} className="object-cover" />
                  <AvatarFallback className="text-xl font-bold">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-lg font-extrabold">
                    {name || "Nama belum diisi"}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {email || "Email mengikuti akun"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="secondary">{roleLabels[role]}</Badge>
                    {showParticipantFields && (
                      <Badge variant="outline">
                        {getGroupLabel(groupType)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <FormFact
                  icon={<Phone className="size-4" />}
                  label="Telepon"
                  value={phone || "-"}
                />
                <FormFact
                  icon={<MapPin className="size-4" />}
                  label="Asal"
                  value={origin || "-"}
                />
                <FormFact
                  icon={<ShieldCheck className="size-4" />}
                  label="Institusi"
                  value={institution || "-"}
                />
              </div>
            </section>

            <section className="min-w-0 overflow-hidden rounded-lg border bg-card p-5">
              <div className="flex items-start gap-3">
                <BadgeCheck className="mt-0.5 size-5 text-primary" />
                <div>
                  <h2 className="font-bold">Data resmi dulu.</h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Form dipisah sesuai fungsi supaya admin bisa mengecek akun,
                    identitas, dan dokumen tanpa membaca satu blok panjang.
                  </p>
                </div>
              </div>
            </section>
          </aside>

          <main className="min-w-0 space-y-5">
            {showAccountFields && (
              <FormSection
                icon={<Mail className="size-5" />}
                title="Akses akun"
                description="Email dan kata sandi awal untuk masuk ke dashboard."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Contoh: budi@email.com"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kata Sandi</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Minimal 6 karakter"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Konfirmasi Kata Sandi</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Ulangi kata sandi"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormSection>
            )}

            <FormSection
              icon={<UserRound className="size-5" />}
              title="Identitas dasar"
              description="Nama, kontak, dan foto profil untuk pengenalan akun."
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
                      <FormLabel>Avatar</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FormSection>

            <FormSection
              icon={<CalendarDays className="size-5" />}
              title="Data administratif"
              description="Informasi asal dan alamat untuk kebutuhan arsip LMS."
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

                {showParticipantFields && (
                  <FormField
                    control={form.control}
                    name="group_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategori Peserta</FormLabel>
                        <Select
                          onValueChange={field.onChange}
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
                )}

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

            {showParticipantFields && (
              <FormSection
                icon={<IdCard className="size-5" />}
                title="Identitas peserta"
                description="Data pembeda untuk verifikasi kategori harga dan sertifikat."
              >
                {showStudentProof ? (
                  <div className="grid gap-5">
                    <FormField
                      control={form.control}
                      name="nim"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NIM</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Contoh: 123456789"
                              {...field}
                            />
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
                                  handleFileChange(
                                    event,
                                    "images",
                                    "nim_proof",
                                  )
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
                        href={nimProofUrl}
                        target="_blank"
                        className="block overflow-hidden rounded-lg border bg-muted"
                      >
                        <ImageWithFallback
                          src={nimProofUrl}
                          alt="Bukti NIM"
                          width={1200}
                          height={720}
                          className="max-h-[360px] w-full object-cover"
                        />
                      </Link>
                    )}
                  </div>
                ) : showNik ? (
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
                  <div className="rounded-md border bg-background p-4 text-sm text-muted-foreground">
                    Identitas peserta belum diperlukan untuk konfigurasi ini.
                  </div>
                )}
              </FormSection>
            )}

            <div className="sticky bottom-3 z-10 min-w-0 overflow-hidden rounded-lg border bg-card/95 p-3 shadow-sm backdrop-blur">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Simpan setelah data akun dan administrasi sudah benar.
                </p>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Menyimpan
                    </>
                  ) : (
                    <>
                      <Save className="size-4" />
                      {mode === "create" ? "Simpan Data" : "Simpan Perubahan"}
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
}

export function ManagedUserFormSkeleton() {
  return (
    <div className="space-y-5">
      <section className="rounded-lg border bg-card p-5">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-4 h-8 w-2/3" />
        <Skeleton className="mt-3 h-5 w-1/2" />
      </section>
      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
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
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-28 w-full md:col-span-2" />
          </div>
        </section>
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

function FormFact({
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
        <p className="mt-1 truncate text-sm font-semibold">{value}</p>
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

function getGroupLabel(groupType: string) {
  if (groupType === "mahasiswa_gunadarma") return "Mahasiswa Gunadarma";
  if (groupType === "mahasiswa_non_gunadarma") {
    return "Mahasiswa Non Gunadarma";
  }
  return "Umum";
}
