"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ManagedUserForm } from "@/components/(dashboard)/_shared/managed-user-form";
import { toAssetUrl } from "@/helpers/api-config";
import { useFileUploader } from "@/hooks/use-file-uploader";
import { usePostData } from "@/hooks/use-post-data";
import { normalizeToUTCDateOnly } from "../profile/_libs/normalize-to-utc-date";
import { createGuruSchema, TCreateGuru } from "./_schemas/create-guru-schema";

const GuruCreateForm = () => {
  const { uploadFile } = useFileUploader();

  const form = useForm<TCreateGuru>({
    resolver: zodResolver(createGuruSchema),
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      avatar: "",
      institution: "",
      origin: "",
      birth_date: undefined,
      address: "",
      role_type: "guru",
      group_type: "umum",
      password: "",
      confirm_password: "",
    },
  });

  const mutation = usePostData({
    queryKey: "guru-create",
    dataProtected: "users",
    successMessage: "Pengajar berhasil ditambahkan!",
    backUrl: "/dashboard/pengajar",
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "documents" | "images",
    field: string,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, type);
    form.setValue(field as keyof TCreateGuru, url || "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = (values: TCreateGuru) => {
    const { birth_date, ...rest } = values;
    const birthDate = normalizeToUTCDateOnly(birth_date);

    mutation.mutate({ ...rest, birth_date: birthDate });
  };

  return (
    <ManagedUserForm
      form={form}
      role="guru"
      mode="create"
      isPending={mutation.isPending}
      onSubmit={onSubmit}
      onInvalid={() => toast.error("Ada isian yang belum benar.")}
      avatarUrl={toAssetUrl(form.watch("avatar"))}
      handleFileChange={handleFileChange}
    />
  );
};

export default GuruCreateForm;
