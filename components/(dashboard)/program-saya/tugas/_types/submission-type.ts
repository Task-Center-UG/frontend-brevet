export type TAssignmentFile = {
  id: string;
  assignment_id: string;
  file_url: string;
  created_at: string;
  updated_at: string;
};

export type TUserMinimal = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  created_at: string;
  updated_at: string;
  role_type: string;
};

export type TAssignmentGrade = {
  id: string;
  assignment_submission_id: string;
  grade: number | null;
  feedback: string;
  graded_by: string;
  created_at: string;
  updated_at: string;
  graded_by_user: TUserMinimal;
};

export type TAssignmentMinimal = {
  id: string;
  meeting_id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  type: "essay" | "file" | string;
  start_at: string;
  end_at: string;
  created_at: string;
  updated_at: string;
  assignment_files: TAssignmentFile[];
  assignment_submissions?: TAssignmentSubmission[];
};

export type TAssignmentSubmission = {
  id: string;
  assignment_id: string;
  user_id: string;
  note: string | null;
  essay_text: string | null;
  is_late: boolean;
  created_at: string;
  updated_at: string;
  submission_files: TAssignmentFile[];
  assignment_grade: TAssignmentGrade | null;
  assignment: TAssignmentMinimal;
  user: TUserMinimal;
};

export type TAssignmentDetail = {
  id: string;
  meeting_id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  type: "essay" | "file" | string;
  start_at: string;
  end_at: string;
  created_at: string;
  updated_at: string;
  assignment_files: TAssignmentFile[];
  assignment_submissions: TAssignmentSubmission[];
};
