"use client";

import React from "react";
import { useGetData } from "@/hooks/use-get-data";
import type { TBatchMeeting } from "./_types/kelas-pertemuan-type";
import type { TUser } from "../profile/_types/user-type";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import KelasCard from "./kelas-card";

type Props = { batchSlug: string };

const KelasPertemuan = ({ batchSlug }: Props) => {
  const { data: myProfileData } = useGetData({
    queryKey: ["me"],
    dataProtected: "users/me",
  });
  const user: TUser | undefined = myProfileData?.data?.data;

  const { data, isLoading } = useGetData({
    queryKey: ["meetings", batchSlug],
    dataProtected: `batches/${batchSlug}/meetings?limit=30&sort=created_at&order=asc`,
  });

  const meetings: TBatchMeeting[] = data?.data?.data ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-foreground">Pertemuan</h1>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border border-border">
              <CardHeader className="pb-2 space-y-2">
                <Skeleton className="h-4 w-2/3 bg-muted/50 dark:bg-muted/30" />
                <Skeleton className="h-3 w-1/2 bg-muted/50 dark:bg-muted/30" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-1/2 bg-muted/50 dark:bg-muted/30" />
                <Skeleton className="h-4 w-1/3 bg-muted/50 dark:bg-muted/30" />
                <Skeleton className="h-8 w-24 ml-auto bg-muted/50 dark:bg-muted/30" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : meetings.length === 0 ? (
        <p className="text-muted-foreground">Belum ada pertemuan tersedia.</p>
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <KelasCard
              key={meeting.id}
              meeting={meeting}
              batchSlug={batchSlug}
              currentUser={user}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default KelasPertemuan;
