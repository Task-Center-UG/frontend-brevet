import {
  CheckCircle2,
  ReceiptText as ReceiptIcon,
  Upload,
  UserPlus,
  FileCheck2,
  BookOpen,
  Bell,
} from "lucide-react";
import type { ActivityItem } from "../_types/admin-dashboard";

export const statusLabel: Record<"pending" | "failed" | "paid", string> = {
  pending: "Menunggu",
  failed: "Gagal",
  paid: "Lunas",
};

export const verificationLabel: Record<"valid" | "invalid", string> = {
  valid: "Valid",
  invalid: "Tidak Valid",
};

export const activityMap: Record<
  ActivityItem["type"],
  { icon: React.ElementType; tone: string; pill?: string }
> = {
  purchase_verified: {
    icon: CheckCircle2,
    tone: "text-green-600",
    pill: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  },
  purchase_uploaded: {
    icon: ReceiptIcon,
    tone: "text-amber-600",
    pill: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  user_registered: {
    icon: UserPlus,
    tone: "text-blue-600",
    pill: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  material_uploaded: {
    icon: Upload,
    tone: "text-indigo-600",
    pill: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  },
  assignment_submitted: {
    icon: FileCheck2,
    tone: "text-orange-600",
    pill: "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  },
  quiz_graded: {
    icon: BookOpen,
    tone: "text-purple-600",
    pill: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
  batch_created: {
    icon: Bell,
    tone: "text-cyan-600",
    pill: "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  },
};
