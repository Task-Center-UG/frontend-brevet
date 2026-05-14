export type AdminDashboard = {
  summary: {
    totalRevenue: number;
    newPurchases: number;
    activeBatches: number;
    activeStudents: number;
    completionRate: number; // 0..1
    range: "7d" | "30d" | "90d";
  };
  trends: {
    revenueByDay: { date: string; amount: number }[];
    purchasesByDay: { date: string; count: number }[];
  };
  batchHealth: {
    batchSlug: string;
    courseName: string;
    quota: number;
    enrolled: number;
    remaining: number;
    avgProgress: number; // 0..1
    nextEvent?: {
      type: "meeting" | "assignment" | "quiz";
      title: string;
      startAt?: string;
      dueAt?: string;
    };
  }[];
  payments: {
    purchaseId: string;
    user: { name: string; email: string };
    batchSlug: string;
    amount: number;
    proofUrl?: string;
    uploadedAt: string;
    status?: "pending" | "failed" | "paid";
  }[];
  teacherWorkload: {
    teacherId: string;
    name: string;
    meetings: number;
    toGrade: number;
    hours: number;
  }[];
  certInsights: {
    certGenerated: number;
    publicVerifications: number;
    latestChecks: {
      certNo: string;
      checkedAt: string;
      result: "valid" | "invalid";
    }[];
  };
};

export type ActivityItem = {
  id: string;
  type:
    | "purchase_verified"
    | "purchase_uploaded"
    | "user_registered"
    | "material_uploaded"
    | "assignment_submitted"
    | "quiz_graded"
    | "batch_created";
  title: string;
  by?: string;
  meta?: string;
  at: string; // ISO string
  link?: string;
  amount?: number;
  statusLabel?: string;
};
