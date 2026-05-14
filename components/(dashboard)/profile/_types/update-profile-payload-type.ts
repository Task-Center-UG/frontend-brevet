export type TUpdateProfilePayload = {
  name: string;
  phone: string;
  avatar?: string;
  institution: string;
  origin: string;
  birth_date: Date;
  address: string;
  group_type: "mahasiswa_gunadarma" | "mahasiswa_non_gunadarma" | "umum";
  nim?: string;
  nim_proof?: string;
  nik?: string;
};
