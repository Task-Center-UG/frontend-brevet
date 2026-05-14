export type TQuizAttempt = {
  id: string;
  quiz_id: string;
  user_id: string;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
};

export type TQuizAttemptStatus = "ongoing" | "finished";
