import { BadgeInfo } from "lucide-react";

export function Notice({
  text,
  tone = "warning",
}: {
  text: React.ReactNode;
  tone?: "success" | "warning" | "warningSoft" | "neutral";
}) {
  const map = {
    success:
      "border-green-200 bg-green-50 text-green-800 dark:border-green-900/60 dark:bg-green-950 dark:text-green-100",
    warning:
      "border-orange-300 bg-orange-50 text-orange-900 dark:border-orange-700 dark:bg-orange-950 dark:text-orange-100",
    warningSoft:
      "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-900/60 dark:bg-orange-950 dark:text-orange-100",
    neutral:
      "border-gray-300 bg-gray-50 text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100",
  } as const;

  return (
    <div
      className={`mt-4 flex items-start gap-3 rounded-md border p-4 text-sm ${map[tone]}`}
    >
      <BadgeInfo className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <p className="leading-relaxed">{text}</p>
    </div>
  );
}
