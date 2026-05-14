export type TUserProfile = {
  group_type: "mahasiswa_gunadarma" | "mahasiswa_non_gunadarma" | "umum";
  group_verified: boolean;
  nim: string;
  nim_proof: string;
  nik: string | null;
  institution: string;
  origin: string;
  birth_date: Date;
  address: string;
  created_at: string;
  updated_at: string;
};

export type TUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  created_at: string;
  updated_at: string;
  role_type: "admin" | "siswa" | "guru";
  profile: TUserProfile;
};
