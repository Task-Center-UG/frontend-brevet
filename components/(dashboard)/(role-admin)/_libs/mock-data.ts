import type { AdminDashboard, ActivityItem } from "../_types/admin-dashboard";

export const mockData = (range: "7d" | "30d" | "90d"): AdminDashboard => ({
  summary: {
    totalRevenue: 125_000_000,
    newPurchases: 84,
    activeBatches: 6,
    activeStudents: 312,
    completionRate: 0.41,
    range,
  },
  trends: {
    revenueByDay: Array.from({
      length: range === "7d" ? 7 : range === "30d" ? 30 : 90,
    }).map((_, i) => ({
      date: new Date(
        Date.now() -
          (range === "7d" ? 6 - i : range === "30d" ? 29 - i : 89 - i) *
            86400000
      ).toISOString(),
      amount: Math.max(0, Math.round(1_000_000 + Math.random() * 8_000_000)),
    })),
    purchasesByDay: Array.from({
      length: range === "7d" ? 7 : range === "30d" ? 30 : 90,
    }).map((_, i) => ({
      date: new Date(
        Date.now() -
          (range === "7d" ? 6 - i : range === "30d" ? 29 - i : 89 - i) *
            86400000
      ).toISOString(),
      count: Math.max(0, Math.round(2 + Math.random() * 10)),
    })),
  },
  batchHealth: [
    {
      batchSlug: "brevet-ab-2025",
      courseName: "Brevet A/B",
      quota: 50,
      enrolled: 47,
      remaining: 3,
      avgProgress: 0.63,
      nextEvent: {
        type: "meeting",
        title: "Pertemuan 3",
        startAt: new Date(Date.now() + 2 * 86400000).toISOString(),
      },
    },
    {
      batchSlug: "brevet-c-2025",
      courseName: "Brevet C",
      quota: 40,
      enrolled: 35,
      remaining: 5,
      avgProgress: 0.58,
      nextEvent: {
        type: "assignment",
        title: "Tugas 2 PPN",
        dueAt: new Date(Date.now() + 3 * 86400000).toISOString(),
      },
    },
  ],
  payments: [
    {
      purchaseId: "pur_123",
      user: { name: "Budi", email: "budi@example.com" },
      batchSlug: "brevet-ab-2025",
      amount: 2_500_000,
      proofUrl: "https://example.com/bukti-1",
      uploadedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      status: "pending",
    },
    {
      purchaseId: "pur_124",
      user: { name: "Sari", email: "sari@example.com" },
      batchSlug: "brevet-c-2025",
      amount: 2_500_000,
      proofUrl: "https://example.com/bukti-2",
      uploadedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
      status: "failed",
    },
  ],
  teacherWorkload: [
    { teacherId: "t_1", name: "Bu Arin", meetings: 4, toGrade: 18, hours: 6.5 },
    {
      teacherId: "t_2",
      name: "Pak Dimas",
      meetings: 3,
      toGrade: 5,
      hours: 4.0,
    },
  ],
  certInsights: {
    certGenerated: 54,
    publicVerifications: 17,
    latestChecks: [
      {
        certNo: "TCG-AB-2025-0012",
        checkedAt: new Date().toISOString(),
        result: "valid",
      },
      {
        certNo: "TCG-AB-2025-0013",
        checkedAt: new Date().toISOString(),
        result: "invalid",
      },
    ],
  },
});

export const mockActivities: ActivityItem[] = [
  {
    id: "a1",
    type: "purchase_verified",
    title: "Pembayaran terverifikasi",
    by: "Admin Rani",
    meta: "brevet-ab-2025",
    amount: 2_500_000,
    statusLabel: "Lunas",
    at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    link: "/dashboard/transaksi/pur_123",
  },
  {
    id: "a2",
    type: "assignment_submitted",
    title: "Pengumpulan tugas",
    by: "Satria",
    meta: "Tugas 2 PPN — brevet-c-2025",
    at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    link: "/dashboard/tugas/abc123",
  },
  {
    id: "a3",
    type: "material_uploaded",
    title: "Materi baru diunggah",
    by: "Bu Arin",
    meta: "PPh Badan — Pertemuan 3",
    at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    link: "/dashboard/materi/xyz789",
  },
  {
    id: "a4",
    type: "user_registered",
    title: "Pendaftaran peserta baru",
    by: "Dewi Laras",
    meta: "Kelompok: umum",
    at: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    link: "/dashboard/peserta",
  },
  {
    id: "a5",
    type: "quiz_graded",
    title: "Penilaian kuis selesai",
    by: "Pak Dimas",
    meta: "Kuis 1 — brevet-ab-2025",
    at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    link: "/dashboard/quiz/grade/qq1",
  },
];
