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
import { TMember } from "./_types/member-type";

type Props = {
  memberId: string;
};

const MemberDetail = ({ memberId }: Props) => {
  const { data: memberDetailData } = useGetData({
    queryKey: ["member-detail"],
    dataProtected: `users/${memberId}`,
  });

  const member: TMember = memberDetailData?.data?.data;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Informasi Peserta</CardTitle>
        <CardDescription>Detail terkait peserta yang terdaftar</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <Avatar className="w-24 h-24 md:w-32 md:h-32 aspect-square">
            <AvatarImage
              src={member?.avatar}
              className="object-cover w-full h-full"
            />
            <AvatarFallback className="text-xl">
              {member?.name?.charAt(0) || "M"}
            </AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
              {member?.name}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-300">
              {member?.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 text-sm border border-border divide-x divide-y rounded overflow-hidden">
          <DataRow label="Nomor Telepon">{member?.phone}</DataRow>
          <DataRow label="Role">
            <Badge variant="outline">{member?.role_type}</Badge>
          </DataRow>
          <DataRow label="Institusi">{member?.profile.institution}</DataRow>
          <DataRow label="Asal Daerah">{member?.profile.origin}</DataRow>
          <DataRow label="Tanggal Lahir">{member?.profile.birth_date}</DataRow>
          <DataRow label="Alamat">{member?.profile.address}</DataRow>
          <DataRow label="NIM">{member?.profile.nim || "-"}</DataRow>
          <DataRow label="Bukti NIM">
            {member?.profile.nim_proof ? (
              <a
                href={member.profile.nim_proof}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Lihat Bukti
              </a>
            ) : (
              <span className="text-muted-foreground">Belum diunggah</span>
            )}
          </DataRow>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberDetail;
