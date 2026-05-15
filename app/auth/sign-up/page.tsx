import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

const SignupPage = () => {
  return (
    <AuthShell
      eyebrow="Pendaftaran"
      title="Buat akun tanpa formulir panjang."
      description="Data dipisah per langkah supaya peserta bisa fokus: kategori, identitas, profil, lalu keamanan akun."
    >
      <SignupForm />
    </AuthShell>
  );
};

export default SignupPage;
