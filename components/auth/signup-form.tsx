"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  HiOutlineUser,
  HiOutlineUserGroup,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { SignUpSchema } from "./_schema/signup-schema";
import { DateTimePicker } from "../ui/date-time-picker";
import { Textarea } from "../ui/textarea";
import { useFileUploader } from "@/hooks/use-file-uploader";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import axiosInstance from "@/helpers/axios-instance";
import { toAssetUrl } from "@/helpers/api-config";
import { AxiosError } from "axios";
import { normalizeToUTCDateOnly } from "../(dashboard)/profile/_libs/normalize-to-utc-date";

const groupOptions = [
  { id: "mahasiswa_gunadarma", name: "Mahasiswa Gunadarma" },
  { id: "mahasiswa_non_gunadarma", name: "Mahasiswa Non-Gunadarma" },
  { id: "umum", name: "Umum" },
];

export function SignupForm({
  className,
}: React.ComponentPropsWithoutRef<"form">) {
  const [isPending, setIsPending] = useState(false);

  const { uploadFile } = useFileUploader();

  const getGroupIcon = (name: string) => {
    if (name.toLowerCase().includes("non-gunadarma")) {
      return <HiOutlineUser className="h-6 w-6 mb-2" />;
    } else if (name.toLowerCase().includes("gunadarma")) {
      return <HiOutlineUserGroup className="h-6 w-6 mb-2" />;
    } else if (name.toLowerCase().includes("umum")) {
      return <HiOutlineUserCircle className="h-6 w-6 mb-2" />;
    } else {
      return null;
    }
  };

  const form = useForm<z.infer<typeof SignUpSchema>>({
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
      nim_proof: undefined,
      nik: "",
    },
  });

  const group_type = useWatch({ control: form.control, name: "group_type" });
  const nimProofUrl = form.watch("nim_proof");
  const nimProofAssetUrl = toAssetUrl(nimProofUrl);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "documents" | "images",
    field: keyof z.infer<typeof SignUpSchema>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, type);
    form.setValue(field, url || "", { shouldValidate: true });
  };

  const onSubmit = async (values: z.infer<typeof SignUpSchema>) => {
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

      const response = await axiosInstance.post("/auth/register", payload);

      console.log("✅ Register sukses:", response.data);

      toast("Pendaftaran Berhasil!", {
        description: "Silahkan verifikasi email Kamu.",
      });

      form.reset();
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;

      console.error(
        "❌ Register gagal:",
        error.response?.data || error.message
      );

      toast("Terjadi kesalahan!", {
        description:
          error.response?.data?.message || "Gagal mendaftarkan akun.",
      });
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    form.setValue("nim", "");
    form.setValue("nim_proof", "");
    form.setValue("nik", "");
  }, [group_type]);

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(onSubmit, (errors) => {
            console.log("❌ Validation errors:", errors);
            toast.error("Ada isian yang belum benar.");
          })(e);
        }}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Daftar Akun Baru</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Masukkan data lengkap kamu untuk membuat akun
          </p>
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="group_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pilih Kategori Peserta</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    {groupOptions.map((group) => (
                      <div key={group.id}>
                        <RadioGroupItem
                          value={group.id}
                          id={group.id}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={group.id}
                          className="h-full min-h-[120px] flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 text-center hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          {getGroupIcon(group.name)}
                          {group.name}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: budisantoso" {...field} />
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
                  <Input
                    type="email"
                    placeholder="Contoh: budi@email.com"
                    {...field}
                  />
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
                  <Input placeholder="Contoh: 08123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <Input placeholder="Contoh: Jakarta" {...field} />
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
                <FormLabel htmlFor="datetime">Tanggal Lahir</FormLabel>
                <FormControl>
                  <DateTimePicker
                    placeholder="Contoh: 31/03/2003"
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
                    placeholder="Contoh: Jl. Merdeka No. 10, Jakarta"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {group_type !== "umum" && (
            <>
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
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange(e, "images", "nim_proof")
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {nimProofUrl && (
                <Link href={nimProofAssetUrl} target="_blank" className="mt-2">
                  <ImageWithFallback
                    width={400}
                    height={400}
                    src={nimProofAssetUrl}
                    alt="Preview Bukti NIM"
                    className="w-full rounded border"
                  />
                </Link>
              )}
            </>
          )}
          {group_type === "umum" && (
            <FormField
              control={form.control}
              name="nik"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIK</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: 3201234567890001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
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
          <Button
            type="submit"
            variant={"orange"}
            className="w-full dark:text-white"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Daftar"
            )}
          </Button>
        </div>

        <div className="text-center text-sm">
          Sudah punya akun?{" "}
          <Link href="/auth/sign-in" className="underline underline-offset-4">
            Masuk di sini
          </Link>
        </div>
      </form>
    </Form>
  );
}
