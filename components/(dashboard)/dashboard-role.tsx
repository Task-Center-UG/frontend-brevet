"use client";

import { useGetData } from "@/hooks/use-get-data";
import React from "react";
import { TUser } from "./profile/_types/user-type";
import DashboardRoleAdmin from "./(role-admin)/dashboard-role-admin";
import DashboardRoleSiswa from "./(role-siswa)/dashboard-role-siswa";
import DashboardRoleGuru from "./(dashboard-guru)/dashboard-role-guru";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-28 mb-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-20 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-56" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="space-y-2 w-full">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-72" />
              </div>
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const DashboardRole = () => {
  const { data: myProfileData, isLoading } = useGetData({
    queryKey: ["me"],
    dataProtected: "users/me",
  });

  const user: TUser | undefined = myProfileData?.data?.data;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return <div>Data user tidak ditemukan</div>;
  }

  switch (user.role_type) {
    case "admin":
      return <DashboardRoleAdmin />;
    case "guru":
      return <DashboardRoleGuru isLoading={isLoading} />;
    case "siswa":
      return <DashboardRoleSiswa isLoading={isLoading} />;
    default:
      return <div>Role tidak dikenali</div>;
  }
};

export default DashboardRole;
