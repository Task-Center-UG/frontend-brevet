export type TMyCourse = {
  id: string;
  course_id: string;
  slug: string;
  title: string;
  description: string;
  batch_thumbnail: string;
  start_at: Date;
  end_at: Date;
  start_time: Date;
  end_time: Date;
  room: string;
  quota: number;
  days: {
    id: string;
    batch_id: string;
    day: string;
  }[];
  created_at: Date;
  updated_at: Date;
  course_type: "offline" | "online";
};
