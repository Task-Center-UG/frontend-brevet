export type Batch = {
  id: string;
  course_id: string;
  slug: string;
  title: string;
  description: string;
  batch_thumbnail: string;
  start_at: string | null;
  end_at: string | null;
  registration_start_at: string | null;
  registration_end_at: string | null;
  start_time: string | null;
  end_time: string | null;
  room: string | null;
  quota: number | null;
  days: unknown;
  batch_groups: unknown[];
  created_at: string;
  updated_at: string;
  course_type: "online" | "offline" | string;
};

export type UserMini = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  created_at: string;
  updated_at: string;
  role_type: string;
};

export type CertificateAPI = {
  id: string;
  batch_id: string;
  user_id: string;
  issued_at: string | null;
  url?: string;
  qr_code?: string;
  created_at: string;
  updated_at: string;
  number?: string;
  expires_at?: string | null;
  status?: "valid" | "revoked" | "expired" | "not-found";
  batch?: Batch | null;
  user?: UserMini | null;
};
