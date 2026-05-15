"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, RefreshCw, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { usePostData } from "@/hooks/use-post-data";
import { VerifyCodeSchema } from "./_schema/verify-code-schema";

const VerifyCodeForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof VerifyCodeSchema>>({
    resolver: zodResolver(VerifyCodeSchema),
    defaultValues: {
      code: "",
      token: token || "",
    },
  });

  useEffect(() => {
    if (token) {
      form.setValue("token", token);
    }
  }, [token, form]);

  const { mutate: submitVerification, isPending: isVerifying } = usePostData({
    queryKey: "verify-code",
    dataProtected: "auth/verify",
    backUrl: "/auth/sign-in",
    successMessage: "Email berhasil diverifikasi!",
  });

  const { mutate: resendCode, isPending: isResending } = usePostData({
    queryKey: "resend-code",
    dataProtected: "auth/resend-verification",
    successMessage: "Kode verifikasi berhasil dikirim ulang!",
  });

  const onSubmit = (values: z.infer<typeof VerifyCodeSchema>) => {
    submitVerification(values);
  };

  const onResend = () => {
    if (!token) return;
    resendCode({ token });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            OTP Email
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-normal">
            Verifikasi email
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Masukkan 6 digit kode dari email. Setelah valid, kamu bisa masuk ke
            dashboard.
          </p>
        </div>

        <div className="rounded-md border bg-background p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-5 text-primary" />
            <div>
              <p className="text-sm font-bold">Kode hanya untuk akun ini</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Jika kode tidak masuk, gunakan kirim ulang tanpa mengubah data
                pendaftaran.
              </p>
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kode OTP</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field} className="w-full">
                  <InputOTPGroup className="w-full justify-between gap-2">
                    <InputOTPSlot index={0} className="h-12 w-full" />
                    <InputOTPSlot index={1} className="h-12 w-full" />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup className="w-full justify-between gap-2">
                    <InputOTPSlot index={2} className="h-12 w-full" />
                    <InputOTPSlot index={3} className="h-12 w-full" />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup className="w-full justify-between gap-2">
                    <InputOTPSlot index={4} className="h-12 w-full" />
                    <InputOTPSlot index={5} className="h-12 w-full" />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isVerifying} className="w-full">
          {isVerifying ? (
            <>
              <Loader2 className="animate-spin" />
              Memverifikasi
            </>
          ) : (
            <>
              <ShieldCheck />
              Verifikasi Sekarang
            </>
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Tidak menerima kode?{" "}
          <button
            type="button"
            onClick={onResend}
            disabled={isResending || !token}
            className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline disabled:pointer-events-none disabled:opacity-50"
          >
            {isResending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
            Kirim ulang
          </button>
        </div>
      </form>
    </Form>
  );
};

export default VerifyCodeForm;
