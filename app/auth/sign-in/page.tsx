import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/signin-form";

const SignInPage = () => {
  return (
    <AuthShell
      eyebrow="Masuk"
      title="Lanjutkan kelas brevet."
      description="Masuk untuk melihat kelas aktif, pembayaran, tugas, quiz, nilai, dan progres sertifikat."
    >
      <SignInForm />
    </AuthShell>
  );
};

export default SignInPage;
