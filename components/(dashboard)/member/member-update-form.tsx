"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useGetData } from "@/hooks/use-get-data";
import { usePutData } from "@/hooks/use-put-data";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
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
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { useFileUploader } from "@/hooks/use-file-uploader";
import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { TMember } from "./_types/member-type";
import {
  TUpdateMember,
  updateMemberSchema,
} from "./_schemas/update-member-schema";
import { normalizeToUTCDateOnly } from "../profile/_libs/normalize-to-utc-date";
import { toAssetUrl } from "@/helpers/api-config";

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

  const roleType = form.watch("role_type");
  const groupType = form.watch("group_type");
  const nimProofUrl = form.watch("nim_proof");
  const nimProofAssetUrl = toAssetUrl(nimProofUrl);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "documents" | "images",
    field: keyof TUpdateMember
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, type);
    form.setValue(field, url || "", { shouldValidate: true });
  };

  const mutation = usePutData({
    queryKey: "member",
    dataProtected: `users/${memberId}`,
    successMessage: "Data peserta berhasil diperbarui!",
  });

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

  if (isLoading) return <p>Loading...</p>;

  const showNimAndProof =
    roleType === "siswa" &&
    (groupType === "mahasiswa_gunadarma" ||
      groupType === "mahasiswa_non_gunadarma");

  const showNik = roleType === "siswa" && groupType === "umum";

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
            <CardTitle>Update Peserta</CardTitle>
            <CardDescription>
              Admin dapat memperbarui data profil peserta berikut.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
                      onChange={(e) => handleFileChange(e, "images", "avatar")}
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

            {showNimAndProof && (
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

            {showNik && (
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

export default MemberUpdateForm;
