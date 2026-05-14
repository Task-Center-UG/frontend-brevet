"use client";

import * as React from "react";
import { ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToneBar } from "./_libs/tone-bar";
import { activityMap } from "./_libs/constants";
import { fmtIDR } from "./_libs/format";
import type { ActivityItem } from "./_types/admin-dashboard";
import { formatDistanceToNowStrict } from "date-fns";
import { id as localeID } from "date-fns/locale";

export default function RecentActivityCard({
  items,
}: {
  items: ActivityItem[];
}) {
  return (
    <Card className="relative overflow-hidden lg:col-span-2">
      <ToneBar tone="primary" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>
              Rangkaian peristiwa mutakhir di sistem
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" asChild>
            <a href="/dashboard/aktivitas">
              Lihat Semua
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="rounded-xl border p-6 text-center text-sm text-muted-foreground">
            Belum ada aktivitas.
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((act) => {
              const Cmp = activityMap[act.type];
              const Icon = Cmp.icon;
              return (
                <li
                  key={act.id}
                  className="flex items-start justify-between gap-3 rounded-xl border bg-background/60 p-3"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div
                      className={[
                        "mt-0.5 rounded-full bg-background p-2 ring-1 ring-border",
                        Cmp.tone,
                      ].join(" ")}
                      aria-hidden
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-tight">
                        {act.title}
                        {act.statusLabel && (
                          <span
                            className={[
                              "ml-2 rounded-full px-2 py-0.5 text-[11px]",
                              Cmp.pill,
                            ].join(" ")}
                          >
                            {act.statusLabel}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {act.by ? (
                          <span className="font-medium text-foreground/80">
                            {act.by}
                          </span>
                        ) : null}
                        {act.by && act.meta ? " • " : null}
                        {act.meta}
                        {typeof act.amount === "number" ? (
                          <>
                            {" "}
                            •{" "}
                            <span className="text-foreground/80">
                              {fmtIDR(act.amount)}
                            </span>
                          </>
                        ) : null}
                      </p>
                      {act.link && (
                        <div className="mt-1">
                          <a
                            href={act.link}
                            className="text-xs text-primary underline underline-offset-2"
                          >
                            Lihat detail
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDistanceToNowStrict(new Date(act.at), {
                      locale: localeID,
                    })}{" "}
                    lalu
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
