export type TQuiz = {
  id: string;
  meeting_id: string;
  title: string;
  description: string;
  type: "tf" | "mc" | string;
  is_open: boolean;
  start_time: Date;
  end_time: Date;
  duration_minute: number;
  max_attempts: number;
  created_at: Date;
  updated_at: Date;
};
