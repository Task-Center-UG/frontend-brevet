"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetData } from "@/hooks/use-get-data";
import DataRow from "@/components/ui/data-row";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TAdmin } from "./_types/admin-type";

type Props = {
  adminId: string;
};

const AdminDetail = ({ adminId }: Props) => {
  const { data: adminDetailData } = useGetData({
    queryKey: ["admin-detail", adminId],
    dataProtected: `users/${adminId}`,
  });

  const admin: TAdmin = adminDetailData?.data?.data;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Informasi Admin</CardTitle>
        <CardDescription>Detail profil admin yang terdaftar</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <Avatar className="w-24 h-24 md:w-32 md:h-32 aspect-square">
            <AvatarImage
              src={admin?.avatar}
              className="object-cover w-full h-full"
            />
            <AvatarFallback className="text-xl">
              {admin?.name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
              {admin?.name}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-300">
              {admin?.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 text-sm border border-border divide-x divide-y rounded overflow-hidden">
          <DataRow label="Nomor Telepon">{admin?.phone}</DataRow>
          <DataRow label="Role">
            <Badge variant="outline">{admin?.role_type}</Badge>
          </DataRow>
          <DataRow label="Institusi">{admin?.profile.institution}</DataRow>
          <DataRow label="Asal Daerah">{admin?.profile.origin}</DataRow>
          <DataRow label="Tanggal Lahir">{admin?.profile.birth_date}</DataRow>
          <DataRow label="Alamat">{admin?.profile.address}</DataRow>
          <DataRow label="NIK">
            {admin?.profile.nik || (
              <span className="text-muted-foreground">Tidak tersedia</span>
            )}
          </DataRow>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDetail;
