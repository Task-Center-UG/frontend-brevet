type ItemType = "assignment" | "quiz";

export type UpcomingItem = {
  id: string;
  type: ItemType;
  title: string;
  course?: string;
  dueAt?: string | null;
};
