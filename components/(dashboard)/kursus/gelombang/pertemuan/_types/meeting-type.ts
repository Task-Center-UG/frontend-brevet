export type TMeeting = {
  id: string;
  batch_id: string;
  title: string;
  description: string;
  meeting_type: "basic" | "exam";
  start_at: string;
  end_at: string;
  created_at: Date;
  updated_at: Date;
};
