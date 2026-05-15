"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AxiosError } from "axios";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  FileUp,
  IdCard,
  Landmark,
  Loader2,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/helpers/axios-instance";
import { toAssetUrl } from "@/helpers/api-config";
import { useFileUploader } from "@/hooks/use-file-uploader";
import { cn } from "@/lib/utils";
import { normalizeToUTCDateOnly } from "../(dashboard)/profile/_libs/normalize-to-utc-date";
import { SignUpSchema } from "./_schema/signup-schema";

type SignUpValues = z.infer<typeof SignUpSchema>;
type FieldName = keyof SignUpValues;

const groupOptions = [
  {
    id: "mahasiswa_gunadarma",
    name: "Mahasiswa Gunadarma",
    desc: "Gunakan NIM dan bukti mahasiswa.",
    icon: UsersRound,
  },
  {
    id: "mahasiswa_non_gunadarma",
    name: "Mahasiswa Non-Gunadarma",
    desc: "Gunakan NIM kampus asal.",
    icon: Landmark,
  },
  {
    id: "umum",
    name: "Umum",
    desc: "Gunakan NIK untuk identitas.",
    icon: UserRound,
  },
] as const;

const steps = [
  {
    title: "Kategori",
    desc: "Pilih jalur peserta.",
    fields: ["group_type"] satisfies FieldName[],
  },
  {
    title: "Akun",
    desc: "Data login dan kontak.",
    fields: ["name", "username", "email", "phone"] satisfies FieldName[],
  },
  {
    title: "Profil",
    desc: "Data peserta.",
    fields: [
      "institution",
      "origin",
      "birth_date",
      "address",
      "nim",
      "nim_proof",
      "nik",
    ] satisfies FieldName[],
  },
  {
    title: "Keamanan",
    desc: "Kata sandi akun.",
    fields: ["password", "confirm_password"] satisfies FieldName[],
  },
];

const groupStepSchema = z.object({
  group_type: z.enum([
    "mahasiswa_gunadarma",
    "mahasiswa_non_gunadarma",
    "umum",
  ]),
});

const accountStepSchema = z.object({
  name: z.string().min(3, "Nama lengkap wajib diisi"),
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().min(10, "Nomor telepon tidak valid"),
});

const profileStepSchema = z
  .object({
    group_type: z.enum([
      "mahasiswa_gunadarma",
      "mahasiswa_non_gunadarma",
      "umum",
    ]),
    institution: z.string().min(2, "Institusi wajib diisi"),
    origin: z.string().min(2, "Asal daerah wajib diisi"),
    birth_date: z.date({ required_error: "Tanggal lahir wajib diisi" }),
    address: z.string().min(5, "Alamat wajib diisi"),
    nim: z.string().optional(),
    nim_proof: z.string().optional(),
    nik: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.group_type === "umum") {
      if (!data.nik) {
        ctx.addIssue({
          path: ["nik"],
          code: z.ZodIssueCode.custom,
          message: "NIK wajib diisi untuk peserta umum.",
        });
      }
      return;
    }

    if (!data.nim) {
      ctx.addIssue({
        path: ["nim"],
        code: z.ZodIssueCode.custom,
        message: "NIM wajib diisi.",
      });
    }
    if (!data.nim_proof) {
      ctx.addIssue({
        path: ["nim_proof"],
        code: z.ZodIssueCode.custom,
        message: "Bukti NIM wajib diunggah.",
      });
    }
  });

const securityStepSchema = z
  .object({
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirm_password: z.string().min(6, "Konfirmasi password minimal 6 karakter"),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Password dan konfirmasi tidak cocok",
  });

const stepSchemas = [
  groupStepSchema,
  accountStepSchema,
  profileStepSchema,
  securityStepSchema,
] as const;

export function SignupForm({
  className,
}: React.ComponentPropsWithoutRef<"form">) {
  const [isPending, setIsPending] = useState(false);
  const [step, setStep] = useState(0);
  const [nimProofName, setNimProofName] = useState("");
  const { uploadFile } = useFileUploader();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      username: "",
      phone: "",
      email: "",
      password: "",
      confirm_password: "",
      group_type: "mahasiswa_gunadarma",
      institution: "",
      origin: "",
      birth_date: undefined,
      address: "",
      nim: "",
      nim_proof: "",
      nik: "",
    },
  });

  const groupType = useWatch({ control: form.control, name: "group_type" });
  const nimProofUrl = form.watch("nim_proof");
  const activeGroup = useMemo(
    () => groupOptions.find((item) => item.id === groupType) ?? groupOptions[0],
    [groupType],
  );
  const ActiveGroupIcon = activeGroup.icon;

  useEffect(() => {
    form.setValue("nim", "");
    form.setValue("nim_proof", "");
    form.setValue("nik", "");
    setNimProofName("");
  }, [groupType, form]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNimProofName(file.name);
    const url = await uploadFile(file, "images");
    form.setValue("nim_proof", url || "", { shouldValidate: true });
  };

  function setStepErrors(result: z.SafeParseError<unknown>) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as FieldName | undefined;
      if (!field) continue;
      form.setError(field, { type: "manual", message: issue.message });
    }
  }

  async function validateStep(targetStep = step) {
    const fields = steps[targetStep].fields;
    form.clearErrors(fields);
    const result = stepSchemas[targetStep].safeParse(form.getValues());
    if (result.success) return true;
    setStepErrors(result);
    toast.error("Lengkapi langkah ini dulu.");
    return false;
  }

  async function goNext() {
    const valid = await validateStep(step);
    if (!valid) return;
    setStep((value) => Math.min(value + 1, steps.length - 1));
  }

  function goPrev() {
    setStep((value) => Math.max(value - 1, 0));
  }

  const onSubmit = async (values: SignUpValues) => {
    const valid = await validateStep(steps.length - 1);
    if (!valid) return;

    setIsPending(true);
    try {
      const payload: Record<string, unknown> = {
        ...values,
        birth_date: normalizeToUTCDateOnly(values.birth_date),
      };

      if (values.group_type === "umum") {
        delete payload.nim;
        delete payload.nim_proof;
      } else {
        delete payload.nik;
      }

      await axiosInstance.post("/auth/register", payload);
      toast("Pendaftaran berhasil", {
        description: "Silakan verifikasi email kamu.",
      });

      form.reset();
      setStep(0);
      setNimProofName("");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast("Terjadi kesalahan", {
        description:
          error.response?.data?.message || "Gagal mendaftarkan akun.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form
        className={cn("space-y-6", className)}
        onSubmit={form.handleSubmit(onSubmit, () => {
          toast.error("Ada isian yang belum benar.");
        })}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Langkah {step + 1} dari {steps.length}
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-normal">
            {steps[step].title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {steps[step].desc}
          </p>
        </div>

        <StepRail current={step} />

        <div className="min-h-[420px]">
          {step === 0 ? <GroupStep form={form} /> : null}
          {step === 1 ? <AccountStep form={form} /> : null}
          {step === 2 ? (
            <ProfileStep
              form={form}
              groupType={groupType}
              nimProofName={nimProofName}
              nimProofUrl={nimProofUrl}
              onFileChange={handleFileChange}
            />
          ) : null}
          {step === 3 ? (
            <SecurityStep
              form={form}
              activeGroup={activeGroup.name}
              ActiveGroupIcon={ActiveGroupIcon}
            />
          ) : null}
        </div>

        <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={goPrev}
            disabled={step === 0 || isPending}
            className="sm:w-fit"
          >
            <ArrowLeft />
            Sebelumnya
          </Button>

          {step < steps.length - 1 ? (
            <Button type="button" onClick={goNext} className="sm:w-fit">
              Lanjut
              <ArrowRight />
            </Button>
          ) : (
            <Button type="submit" disabled={isPending} className="sm:w-fit">
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Memproses
                </>
              ) : (
                <>
                  <Check />
                  Daftar
                </>
              )}
            </Button>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link
            href="/auth/sign-in"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Masuk
          </Link>
        </p>
      </form>
    </Form>
  );
}

function StepRail({ current }: { current: number }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {steps.map((item, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <div
            key={item.title}
            className={cn(
              "rounded-md border bg-background p-3",
              active && "border-primary bg-primary/10",
              done && "border-emerald-500/20 bg-emerald-500/10",
            )}
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full border text-xs font-bold",
                  active && "border-primary bg-primary text-primary-foreground",
                  done &&
                    "border-emerald-500 bg-emerald-500 text-primary-foreground",
                )}
              >
                {done ? <Check className="size-3.5" /> : index + 1}
              </span>
              <span className="hidden min-w-0 text-xs font-bold sm:block">
                {item.title}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GroupStep({ form }: { form: ReturnType<typeof useForm<SignUpValues>> }) {
  return (
    <FormField
      control={form.control}
      name="group_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Kategori Peserta</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="grid gap-3"
            >
              {groupOptions.map((group) => {
                const Icon = group.icon;
                return (
                  <div key={group.id}>
                    <RadioGroupItem
                      value={group.id}
                      id={group.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={group.id}
                      className="flex cursor-pointer items-start gap-4 rounded-md border bg-background p-4 transition hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                    >
                      <Icon className="mt-1 size-5 shrink-0 text-primary" />
                      <span>
                        <span className="block text-sm font-bold">
                          {group.name}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                          {group.desc}
                        </span>
                      </span>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function AccountStep({
  form,
}: {
  form: ReturnType<typeof useForm<SignUpValues>>;
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="Budi Santoso" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="budisantoso" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="nama@email.com"
                  className="pl-9"
                  {...field}
                />
              </div>
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
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="08123456789" className="pl-9" {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function ProfileStep({
  form,
  groupType,
  nimProofName,
  nimProofUrl,
  onFileChange,
}: {
  form: ReturnType<typeof useForm<SignUpValues>>;
  groupType: SignUpValues["group_type"];
  nimProofName: string;
  nimProofUrl?: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="institution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asal Institusi</FormLabel>
              <FormControl>
                <div className="relative">
                  <Landmark className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Universitas Gunadarma"
                    className="pl-9"
                    {...field}
                  />
                </div>
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
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Depok" className="pl-9" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="birth_date"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2">
            <FormLabel>Tanggal Lahir</FormLabel>
            <FormControl>
              <DateTimePicker
                placeholder="Pilih tanggal lahir"
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
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alamat</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Jl. Merdeka No. 10, Depok"
                className="min-h-24 resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {groupType === "umum" ? (
        <FormField
          control={form.control}
          name="nik"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIK</FormLabel>
              <FormControl>
                <div className="relative">
                  <IdCard className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="3201234567890001"
                    className="pl-9"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="nim"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIM</FormLabel>
                <FormControl>
                  <div className="relative">
                    <IdCard className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="123456789" className="pl-9" {...field} />
                  </div>
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
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed bg-background p-5 text-center transition hover:border-primary/40 hover:bg-muted/40">
                    <FileUp className="size-6 text-primary" />
                    <span className="mt-2 text-sm font-bold">
                      Upload bukti mahasiswa
                    </span>
                    <span className="mt-1 text-xs leading-5 text-muted-foreground">
                      Kartu mahasiswa atau bukti aktif kuliah.
                    </span>
                    {nimProofName ? (
                      <span className="mt-3 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {nimProofName}
                      </span>
                    ) : null}
                    {nimProofUrl ? (
                      <Link
                        href={toAssetUrl(nimProofUrl)}
                        target="_blank"
                        className="mt-2 text-xs font-semibold text-primary underline-offset-4 hover:underline"
                      >
                        Lihat file terunggah
                      </Link>
                    ) : null}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={onFileChange}
                      className="sr-only"
                    />
                  </label>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}

function SecurityStep({
  form,
  activeGroup,
  ActiveGroupIcon,
}: {
  form: ReturnType<typeof useForm<SignUpValues>>;
  activeGroup: string;
  ActiveGroupIcon: React.ElementType;
}) {
  return (
    <div className="grid gap-4">
      <div className="rounded-md border bg-background p-4">
        <div className="flex items-start gap-3">
          <ActiveGroupIcon className="mt-0.5 size-5 text-primary" />
          <div>
            <p className="text-sm font-bold">{activeGroup}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Setelah daftar, sistem mengirim kode verifikasi ke email.
            </p>
          </div>
        </div>
      </div>

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kata Sandi</FormLabel>
            <FormControl>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Minimal 6 karakter"
                  className="pl-9"
                  {...field}
                />
              </div>
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
              <div className="relative">
                <BadgeCheck className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Ulangi kata sandi"
                  className="pl-9"
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
