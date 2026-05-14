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
import { TGuru } from "./_types/guru-type";
import { TUpdateGuru, updateGuruSchema } from "./_schemas/update-guru-schema";
import { normalizeToUTCDateOnly } from "../profile/_libs/normalize-to-utc-date";

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

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "documents" | "images",
    field: keyof TUpdateGuru
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, type);
    form.setValue(field, url || "", { shouldValidate: true });
  };

  const mutation = usePutData({
    queryKey: "guru",
    dataProtected: `users/${guruId}`,
    successMessage: "Data guru berhasil diperbarui!",
  });

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
            <CardTitle>Update Pengajar</CardTitle>
            <CardDescription>
              Admin dapat memperbarui data pengajar berikut.
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

export default GuruUpdateForm;
