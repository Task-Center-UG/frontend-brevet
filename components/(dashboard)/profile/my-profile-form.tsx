"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "sonner";
import { useGetData } from "@/hooks/use-get-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { TUser } from "./_types/user-type";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { useFileUploader } from "@/hooks/use-file-uploader";
import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TUpdateProfile,
  updateProfileSchema,
} from "./_schemas/update-profile-schema";
import { TUpdateProfilePayload } from "./_types/update-profile-payload-type";
import { usePatchData } from "@/hooks/use-patch-data";
import { normalizeToUTCDateOnly } from "./_libs/normalize-to-utc-date";
import { toAssetUrl } from "@/helpers/api-config";

const MyProfileForm = () => {
  const { uploadFile } = useFileUploader();

  const { data: myProfileData, isLoading } = useGetData({
    queryKey: ["me"],
    dataProtected: "users/me",
  });

  const user: TUser | undefined = myProfileData?.data?.data;

  const form = useForm<TUpdateProfile>({
    resolver: zodResolver(updateProfileSchema),
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

  const group_type = useWatch({ control: form.control, name: "group_type" });
  const role_type = form.watch("role_type");
  const nimProofUrl = form.watch("nim_proof");
  const avatarUrl = toAssetUrl(form.watch("avatar") || user?.avatar);
  const nimProofAssetUrl = toAssetUrl(nimProofUrl);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "documents" | "images",
    field: keyof TUpdateProfile
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, type);
    form.setValue(field, url || "", { shouldValidate: true });
  };

  const mutation = usePatchData({
    queryKey: "me",
    dataProtected: "me",
    successMessage: "Profil berhasil diperbarui!",
  });

  const onSubmit = (values: TUpdateProfile) => {
    const birthDate = normalizeToUTCDateOnly(values.birth_date);

    const payload: TUpdateProfilePayload = {
      name: values.name,
      phone: values.phone,
      avatar: values.avatar,
      institution: values.institution,
      origin: values.origin,
      birth_date: birthDate!,
      address: values.address,
      group_type: values.group_type,
    };

    if (values.group_type === "umum") {
      payload.nik = values.nik;
    } else if (
      values.group_type === "mahasiswa_gunadarma" ||
      values.group_type === "mahasiswa_non_gunadarma"
    ) {
      payload.nim = values.nim;
      payload.nim_proof = values.nim_proof;
    }

    mutation.mutate(payload);
  };

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        institution: user.profile.institution,
        origin: user.profile.origin,
        birth_date: new Date(user.profile.birth_date),
        address: user.profile.address,
        group_type: user.profile.group_type ?? "umum",
        role_type: user.role_type,
        nim: user.profile.nim ?? "",
        nim_proof: user.profile.nim_proof ?? "",
        nik: user.profile.nik ?? "",
      });
    }
  }, [user, form]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(onSubmit, (errors) => {
            console.log("❌ Validation errors:", errors);
            toast.error("Ada isian yang belum benar.");
          })(e);
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Perbarui Profil</CardTitle>
            <CardDescription>
              Silakan ubah data profil Kamu di bawah ini.
            </CardDescription>
            <CardAction />
          </CardHeader>
          <CardContent className="space-y-6">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 aspect-square">
              <AvatarImage
                src={avatarUrl}
                className="object-cover w-full h-full"
              />
              <AvatarFallback className="text-xl">UG</AvatarFallback>
            </Avatar>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Budi Santoso" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Telepon</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: 081234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="avatar"
                render={() => (
                  <FormItem>
                    <FormLabel>Avatar</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange(e, "images", "avatar")
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asal Institusi</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: SMA Negeri 1 Depok"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asal Daerah</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Depok" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birth_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Lahir</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Pilih tanggal lahir"
                        granularity="day"
                        displayFormat={{ hour24: "PPP" }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Contoh: Jl. Mawar No. 10, Depok"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {group_type !== "umum" && (
                <>
                  <FormField
                    control={form.control}
                    name="nim"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIM</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: 123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nim_proof"
                    render={() => (
                      <FormItem>
                        <FormLabel>Bukti NIM</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileChange(e, "images", "nim_proof")
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {nimProofUrl && (
                    <Link
                      href={nimProofAssetUrl}
                      target="_blank"
                      className="mt-2 block"
                    >
                      <ImageWithFallback
                        src={nimProofAssetUrl}
                        alt="Bukti NIM"
                        width={1800}
                        height={1800}
                        className="w-full object-cover rounded border"
                      />
                    </Link>
                  )}
                </>
              )}

              {role_type === "siswa" && group_type === "umum" && (
                <FormField
                  control={form.control}
                  name="nik"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIK</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: 3201234567890001"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full md:w-fit"
              variant={"orange"}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default MyProfileForm;
