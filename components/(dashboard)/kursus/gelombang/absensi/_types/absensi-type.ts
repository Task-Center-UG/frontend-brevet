type RoleType = "siswa" | "guru" | "admin";

export type TAttendanceUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  created_at: string;
  updated_at: string;
  role_type: RoleType;
};

export type TAttendance = {
  id: string;
  meeting_id: string;
  user_id: string;
  is_present: boolean;
  note: string;
  attendance_time: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  user?: TAttendanceUser;
};
