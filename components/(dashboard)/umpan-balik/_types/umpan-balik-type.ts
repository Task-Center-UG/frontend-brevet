export type Rating = 1 | 2 | 3 | 4 | 5;

export interface TFeedbackUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  created_at: string;
  updated_at: string;
  role_type: "siswa" | "admin" | "guru" | string;
}

export interface TFeedbackBatchDay {
  id: string;
  batch_id: string;
  day: string;
}

export interface TFeedbackBatch {
  id: string;
  course_id: string;
  slug: string;
  title: string;
  description: string;
  batch_thumbnail: string | null;
  start_at: string;
  end_at: string;
  start_time: string;
  end_time: string;
  room: string;
  quota: number;
  days: TFeedbackBatchDay[] | null;
  batch_groups: unknown[];
  created_at: string;
  updated_at: string;
  course_type: "online" | "offline";
}

export interface TFeedback {
  id: string;
  user_id: string;
  batch_id: string;
  rating: Rating | number;
  title: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
  user: TFeedbackUser;
  batch: TFeedbackBatch;
}
