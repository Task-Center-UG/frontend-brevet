import { AuthShell } from "@/components/auth/auth-shell";
import VerifyCodeForm from "@/components/auth/verify-code-form";
import { Suspense } from "react";

const VerifyCodePage = () => {
  return (
    <AuthShell
      eyebrow="Verifikasi"
      title="Aktifkan akun kamu."
      description="Masukkan kode dari email untuk membuka akses dashboard dan melanjutkan pendaftaran program."
    >
      <Suspense>
        <VerifyCodeForm />
      </Suspense>
    </AuthShell>
  );
};

export default VerifyCodePage;
