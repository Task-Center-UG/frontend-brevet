export type TCourseImage = {
  id: string;
  course_id: string;
  image_url: string;
  created_at: string;
  updated_at: string;
};

export type TCourse = {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  learning_outcomes: string;
  achievements: string;
  course_images: TCourseImage[];
  created_at: string;
  updated_at: string;
};
