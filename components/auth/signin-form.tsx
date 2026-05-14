"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "./_schema/signin-schema";
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
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axiosInstance from "@/helpers/axios-instance";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { AxiosError } from "axios";

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
    toast("Mencoba login...");

    try {
      const res = await axiosInstance.post("/auth/login", values);

      const token = res.data.data.access_token;
      Cookies.set("access_token", token, { expires: 7 });

      toast.success("Berhasil login!");
      router.push("/dashboard");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      console.error("❌ Login error:", error.response?.data || error.message);

      toast.error("Gagal login!", {
        description:
          error.response?.data?.message || "Terjadi kesalahan pada server.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Masuk ke Akun Kamu</h1>
          <p className="text-sm text-muted-foreground">
            Gunakan email dan password untuk masuk
          </p>
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

        <Button
          type="submit"
          variant="orange"
          disabled={isPending}
          className="w-full dark:text-white"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Masuk...
            </>
          ) : (
            "Masuk"
          )}
        </Button>

        <div className="text-center text-sm">
          Belum punya akun?{" "}
          <Link href="/auth/sign-up" className="underline underline-offset-4">
            Daftar di sini
          </Link>
        </div>
      </form>
    </Form>
  );
}
