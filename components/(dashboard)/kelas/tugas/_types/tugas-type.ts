export type TAssignmentFile = {
  id: string;
  assignment_id: string;
  file_url: string;
  created_at: string;
  updated_at: string;
};

export type TAssignment = {
  id: string;
  meeting_id: string;
  teacher_id: string;
  title: string;
  description: string;
  type: "file" | "essay";
  start_at: string;
  end_at: string;
  created_at: string;
  updated_at: string;
  assignment_files: TAssignmentFile[];
};
