export type TAssignmentSubmissionFile = {
  id: string;
  assignment_submission_id: string;
  file_url: string;
  created_at: string;
  updated_at: string;
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
  submission_files: TAssignmentSubmissionFile[];
  assignment_grade: number | null;
  assignment: {
    id: string;
    meeting_id: string;
    teacher_id: string;
    title: string;
    description: string;
    type: "essay" | "file";
    start_at: string;
    end_at: string;
    created_at: string;
    updated_at: string;
    assignment_files:
      | {
          id: string;
          assignment_id: string;
          file_url: string;
          created_at: string;
          updated_at: string;
        }[]
      | null;
  };
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    created_at: string;
    updated_at: string;
    role_type: "siswa" | string;
  };
};
