"use client";

import { z } from "zod";
import Link from "next/link";
import Cookies from "js-cookie";
import { AxiosError } from "axios";
import { Loader2, LogIn, Mail, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/helpers/axios-instance";
import { cn } from "@/lib/utils";
import { SignInSchema } from "./_schema/signin-schema";

export function SignInForm({
  className,
}: React.ComponentPropsWithoutRef<"form">) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SignInSchema>) => {
    setIsPending(true);
    toast("Memeriksa akun...");

    try {
      const res = await axiosInstance.post("/auth/login", values);
      const token = res.data.data.access_token;
      Cookies.set("access_token", token, { expires: 7 });
      toast.success("Berhasil masuk.");
      router.push("/dashboard");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error("Gagal masuk", {
        description:
          error.response?.data?.message || "Email atau kata sandi belum sesuai.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-6", className)}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Dashboard Brevet
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-normal">
            Masuk ke akun
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Gunakan email terdaftar untuk melanjutkan ke kelas dan pembayaran.
          </p>
        </div>

        <div className="rounded-md border bg-background p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-5 text-primary" />
            <div>
              <p className="text-sm font-bold">Akses aman</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Sesi login dipakai untuk dashboard siswa, guru, dan admin.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
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
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="animate-spin" />
              Masuk
            </>
          ) : (
            <>
              <LogIn />
              Masuk
            </>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link
            href="/auth/sign-up"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Daftar
          </Link>
        </p>
      </form>
    </Form>
  );
}
