"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  ManagedUserForm,
  ManagedUserFormSkeleton,
} from "@/components/(dashboard)/_shared/managed-user-form";
import { toAssetUrl } from "@/helpers/api-config";
import { useFileUploader } from "@/hooks/use-file-uploader";
import { useGetData } from "@/hooks/use-get-data";
import { usePutData } from "@/hooks/use-put-data";
import { normalizeToUTCDateOnly } from "../profile/_libs/normalize-to-utc-date";
import {
  TUpdateMember,
  updateMemberSchema,
} from "./_schemas/update-member-schema";
import { TMember } from "./_types/member-type";

type Props = {
  memberId: string;
};

const MemberUpdateForm = ({ memberId }: Props) => {
  const { uploadFile } = useFileUploader();

  const { data: memberData, isLoading } = useGetData({
    queryKey: ["member-detail", memberId],
    dataProtected: `users/${memberId}`,
  });

  const member: TMember = memberData?.data?.data;

  const form = useForm<TUpdateMember>({
    resolver: zodResolver(updateMemberSchema),
    defaultValues: {
      name: "",
      phone: "",
      avatar: "",
      institution: "",
      origin: "",
      birth_date: undefined,
      address: "",
      group_type: "umum",
      role_type: "siswa",
      nim: "",
      nim_proof: "",
      nik: "",
    },
  });

  const mutation = usePutData({
    queryKey: "member",
    dataProtected: `users/${memberId}`,
    successMessage: "Data peserta berhasil diperbarui!",
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "documents" | "images",
    field: string,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, type);
    form.setValue(field as keyof TUpdateMember, url || "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = (values: TUpdateMember) => {
    const { birth_date, ...rest } = values;
    const birthDate = normalizeToUTCDateOnly(birth_date);

    mutation.mutate({ ...rest, birth_date: birthDate });
  };

  useEffect(() => {
    if (member) {
      form.reset({
        name: member.name,
        phone: member.phone,
        avatar: member.avatar,
        institution: member.profile.institution,
        origin: member.profile.origin,
        birth_date: new Date(member.profile.birth_date),
        address: member.profile.address,
        group_type: member.profile.group_type || "umum",
        role_type: member.role_type || "siswa",
        nim: member.profile.nim || "",
        nim_proof: member.profile.nim_proof || "",
        nik: member.profile.nik || "",
      });
    }
  }, [member, form]);

  if (isLoading) return <ManagedUserFormSkeleton />;

  return (
    <ManagedUserForm
      form={form}
      role="siswa"
      mode="update"
      isPending={mutation.isPending}
      onSubmit={onSubmit}
      onInvalid={() => toast.error("Ada isian yang belum benar.")}
      avatarUrl={toAssetUrl(form.watch("avatar") || member?.avatar)}
      nimProofUrl={toAssetUrl(form.watch("nim_proof"))}
      handleFileChange={handleFileChange}
    />
  );
};

export default MemberUpdateForm;
