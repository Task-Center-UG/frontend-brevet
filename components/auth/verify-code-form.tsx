"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { VerifyCodeSchema } from "./_schema/verify-code-schema";
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
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { usePostData } from "@/hooks/use-post-data";

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
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Verifikasi Email</h1>
          <p className="text-sm text-muted-foreground">
            Masukkan kode OTP yang dikirim ke email Kamu.
          </p>
        </div>

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kode OTP</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field} className="w-full">
                  <InputOTPGroup className="w-full flex justify-between gap-2">
                    <InputOTPSlot index={0} className="w-full" />
                    <InputOTPSlot index={1} className="w-full" />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup className="w-full flex justify-between gap-2">
                    <InputOTPSlot index={2} className="w-full" />
                    <InputOTPSlot index={3} className="w-full" />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup className="w-full flex justify-between gap-2">
                    <InputOTPSlot index={4} className="w-full" />
                    <InputOTPSlot index={5} className="w-full" />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant="orange"
          disabled={isVerifying}
          className="w-full"
        >
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memverifikasi...
            </>
          ) : (
            "Verifikasi Sekarang"
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Tidak menerima kode?{" "}
          <button
            type="button"
            onClick={onResend}
            disabled={isResending}
            className="text-orange-600 hover:underline font-medium inline-flex items-center"
          >
            {isResending ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-1 h-4 w-4" />
            )}
            Kirim Ulang Kode
          </button>
        </div>
      </form>
    </Form>
  );
};

export default VerifyCodeForm;
