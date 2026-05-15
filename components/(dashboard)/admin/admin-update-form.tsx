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
import { TAdmin } from "./_types/admin-type";
import {
  TUpdateAdmin,
  updateAdminSchema,
} from "./_schemas/update-admin-schema";

type Props = {
  adminId: string;
};

const AdminUpdateForm = ({ adminId }: Props) => {
  const { uploadFile } = useFileUploader();

  const { data: adminData, isLoading } = useGetData({
    queryKey: ["admin-detail", adminId],
    dataProtected: `users/${adminId}`,
  });

  const admin: TAdmin = adminData?.data?.data;

  const form = useForm<TUpdateAdmin>({
    resolver: zodResolver(updateAdminSchema),
    defaultValues: {
      name: "",
      phone: "",
      avatar: "",
      institution: "",
      origin: "",
      birth_date: undefined,
      address: "",
      role_type: "admin",
      group_type: "umum",
    },
  });

  const mutation = usePutData({
    queryKey: "admin",
    dataProtected: `users/${adminId}`,
    successMessage: "Data admin berhasil diperbarui!",
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "documents" | "images",
    field: string,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, type);
    form.setValue(field as keyof TUpdateAdmin, url || "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = (values: TUpdateAdmin) => {
    const { birth_date, ...rest } = values;
    const birthDate = normalizeToUTCDateOnly(birth_date);

    mutation.mutate({ ...rest, birth_date: birthDate });
  };

  useEffect(() => {
    if (admin) {
      form.reset({
        name: admin.name,
        phone: admin.phone,
        avatar: admin.avatar,
        institution: admin.profile.institution,
        origin: admin.profile.origin,
        birth_date: new Date(admin.profile.birth_date),
        address: admin.profile.address,
        role_type: admin.role_type || "admin",
        group_type: admin.profile.group_type || "umum",
      });
    }
  }, [admin, form]);

  if (isLoading) return <ManagedUserFormSkeleton />;

  return (
    <ManagedUserForm
      form={form}
      role="admin"
      mode="update"
      isPending={mutation.isPending}
      onSubmit={onSubmit}
      onInvalid={() => toast.error("Ada isian yang belum benar.")}
      avatarUrl={toAssetUrl(form.watch("avatar") || admin?.avatar)}
      handleFileChange={handleFileChange}
    />
  );
};

export default AdminUpdateForm;
