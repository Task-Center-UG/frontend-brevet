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
import { TUpdateGuru, updateGuruSchema } from "./_schemas/update-guru-schema";
import { TGuru } from "./_types/guru-type";

type Props = {
  guruId: string;
};

const GuruUpdateForm = ({ guruId }: Props) => {
  const { uploadFile } = useFileUploader();

  const { data: memberData, isLoading } = useGetData({
    queryKey: ["guru-detail", guruId],
    dataProtected: `users/${guruId}`,
  });

  const member: TGuru = memberData?.data?.data;

  const form = useForm<TUpdateGuru>({
    resolver: zodResolver(updateGuruSchema),
    defaultValues: {
      name: "",
      phone: "",
      avatar: "",
      institution: "",
      origin: "",
      birth_date: undefined,
      address: "",
      role_type: "guru",
      group_type: "umum",
    },
  });

  const mutation = usePutData({
    queryKey: "guru",
    dataProtected: `users/${guruId}`,
    successMessage: "Data guru berhasil diperbarui!",
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "documents" | "images",
    field: string,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, type);
    form.setValue(field as keyof TUpdateGuru, url || "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = (values: TUpdateGuru) => {
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
        role_type: member.role_type || "guru",
        group_type: member.profile.group_type || "umum",
      });
    }
  }, [member, form]);

  if (isLoading) return <ManagedUserFormSkeleton />;

  return (
    <ManagedUserForm
      form={form}
      role="guru"
      mode="update"
      isPending={mutation.isPending}
      onSubmit={onSubmit}
      onInvalid={() => toast.error("Ada isian yang belum benar.")}
      avatarUrl={toAssetUrl(form.watch("avatar") || member?.avatar)}
      handleFileChange={handleFileChange}
    />
  );
};

export default GuruUpdateForm;
