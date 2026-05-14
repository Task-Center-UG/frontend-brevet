export type TAdmin = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  created_at: string;
  updated_at: string;
  role_type: "admin" | "siswa" | "guru";
  profile: {
    nik?: string;
    nim?: string;
    nim_proof?: string;
    group_type: "mahasiswa_gunadarma" | "mahasiswa_non_gunadarma" | "umum";
    institution: string;
    origin: string;
    birth_date: string;
    address: string;
  };
};
