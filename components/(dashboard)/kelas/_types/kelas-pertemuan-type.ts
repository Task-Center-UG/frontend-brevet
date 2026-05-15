export type TMeetingType = "basic" | "exam";
export type TQuizType = "tf" | "mc";

export type TQuizOption = {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  created_at: string;
  updated_at: string;
};

export type TQuizQuestion = {
  id: string;
  quiz_id: string;
  question: string;
  options: TQuizOption[];
  created_at: string;
  updated_at: string;
};

export type TQuiz = {
  id: string;
  meeting_id: string;
  title: string;
  description: string;
  type: TQuizType | string;
  is_open: boolean;
  start_time: string;
  end_time: string;
  duration_minute: number;
  max_attempts: number;
  created_at: string;
  updated_at: string;
};

export type TQuizDetail = TQuiz & {
  questions?: TQuizQuestion[];
};

export type TBatchMeeting = {
  id: string;
  batch_id: string;
  title: string;
  description: string;
  meeting_type: TMeetingType;
  start_at: string;
  end_at: string;
  is_open: boolean;
  teachers: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    created_at: string;
    updated_at: string;
    role_type: "guru" | string;
  }[];
  assignments: {
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
    assignment_files: {
      id: string;
      assignment_id: string;
      file_url: string;
      created_at: string;
      updated_at: string;
    }[];
    assignment_submissions: {
      id: string;
      assignment_id: string;
    }[];
  }[];
  materials: {
    id: string;
    meeting_id: string;
    title: string;
    description: string;
    url: string;
    created_at: string;
    updated_at: string;
  }[];
  quizzes: TQuiz[];
  created_at: string;
  updated_at: string;
};
