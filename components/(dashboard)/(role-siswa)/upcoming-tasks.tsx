"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, ClipboardList, Timer } from "lucide-react";
import { ToneBar } from "../(role-admin)/_libs/tone-bar";

type ItemType = "assignment" | "quiz";

export type UpcomingItem = {
  id: string;
  type: ItemType;
  title: string;
  course?: string;
  dueAt?: string | null;
};

const MOCK: UpcomingItem[] = [
  {
    id: "1",
    type: "assignment",
    title: "Tugas 3 - PPh Badan",
    course: "Brevet AB 2025",
    dueAt: addDaysISO(2),
  },
  {
    id: "2",
    type: "quiz",
    title: "Kuis 2 - PPN Dasar",
    course: "Brevet AB 2025",
    dueAt: addDaysISO(4),
  },
  {
    id: "3",
    type: "assignment",
    title: "Resume Materi",
    course: "Brevet C 2025",
    dueAt: null,
  },
  {
    id: "4",
    type: "quiz",
    title: "Kuis 1 - PPh 21",
    course: "Brevet C 2025",
    dueAt: addDaysISO(9),
  },
];

function addDaysISO(days: number) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}
function startOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
function endOfWeek(date = new Date()) {
  const s = startOfWeek(date);
  const e = new Date(s);
  e.setDate(s.getDate() + 6);
  e.setHours(23, 59, 59, 999);
  return e;
}
function isBetween(d: Date, from: Date, to: Date) {
  return d.getTime() >= from.getTime() && d.getTime() <= to.getTime();
}
function formatDayLabel(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "2-digit",
  });
}

type GroupKey = "noDue" | "thisWeek" | "nextWeek" | "later";
function groupUpcoming(items: UpcomingItem[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thisStart = startOfWeek(today);
  const thisEnd = endOfWeek(today);
  const nextStart = new Date(thisStart);
  nextStart.setDate(thisStart.getDate() + 7);
  const nextEnd = new Date(thisEnd);
  nextEnd.setDate(thisEnd.getDate() + 7);

  const groups: Record<GroupKey, UpcomingItem[]> = {
    noDue: [],
    thisWeek: [],
    nextWeek: [],
    later: [],
  };
  for (const it of items) {
    if (!it.dueAt) {
      groups.noDue.push(it);
      continue;
    }
    const due = new Date(it.dueAt);
    if (isBetween(due, thisStart, thisEnd)) groups.thisWeek.push(it);
    else if (isBetween(due, nextStart, nextEnd)) groups.nextWeek.push(it);
    else if (due.getTime() > nextEnd.getTime()) groups.later.push(it);
    else groups.thisWeek.push(it);
  }
  return groups;
}

function Row({ item }: { item: UpcomingItem }) {
  const Icon = item.type === "assignment" ? ClipboardList : Timer;
  const label = item.type === "assignment" ? "Tugas" : "Kuis";
  return (
    <div className="flex items-center justify-between py-3 px-4">
      <div className="flex items-center gap-3 min-w-0">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-muted shrink-0">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium truncate">{item.title}</p>
            <Badge variant="secondary" className="shrink-0">
              {label}
            </Badge>
          </div>
          {item.course && (
            <p className="text-xs text-muted-foreground truncate">
              {item.course}
            </p>
          )}
        </div>
      </div>
      {item.dueAt ? (
        <p className="text-sm font-medium text-green-600 whitespace-nowrap">
          {formatDayLabel(item.dueAt)}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground whitespace-nowrap">—</p>
      )}
    </div>
  );
}

function Section({
  title,
  items,
  defaultOpen = false,
}: {
  title: string;
  items: UpcomingItem[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="border-t first:border-t-0">
      <button
        className="w-full flex items-center justify-between py-3 px-4 hover:bg-muted/40 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-3">
          {open ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <span className="font-medium">{title}</span>
        </div>
        <span className="text-sm text-muted-foreground">{items.length}</span>
      </button>

      {open && (
        <div className="divide-y">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground px-4 py-3">
              Tidak ada item.
            </p>
          ) : (
            items.map((it) => <Row key={it.id} item={it} />)
          )}
        </div>
      )}
    </div>
  );
}

export default function UpcomingTasksCard({
  items = MOCK,
  title = "Tugas & Kuis Mendatang",
  description = "Jadwal 7 hari ke depan",
}: {
  items?: UpcomingItem[];
  title?: string;
  description?: string;
}) {
  const groups = React.useMemo(() => groupUpcoming(items), [items]);

  return (
    <Card className="relative overflow-hidden">
      {" "}
      {/* ← penting */}
      <ToneBar tone="danger" />
      <CardHeader className="py-4 px-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-0.5">
            <CardTitle className="leading-tight">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 rounded-b-xl overflow-hidden">
        <Section title="No due date" items={groups.noDue} />
        <Section title="This week" items={groups.thisWeek} />
        <Section title="Next week" items={groups.nextWeek} defaultOpen />
        <Section title="Later" items={groups.later} />
      </CardContent>
    </Card>
  );
}
