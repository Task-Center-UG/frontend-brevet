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
import { TAdmin } from "./_types/admin-type";
import {
  TUpdateAdmin,
  updateAdminSchema,
} from "./_schemas/update-admin-schema";
import { normalizeToUTCDateOnly } from "../profile/_libs/normalize-to-utc-date";

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

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "documents" | "images",
    field: keyof TUpdateAdmin
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, type);
    form.setValue(field, url || "", { shouldValidate: true });
  };

  const mutation = usePutData({
    queryKey: "admin",
    dataProtected: `users/${adminId}`,
    successMessage: "Data admin berhasil diperbarui!",
  });

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
            <CardTitle>Update Admin</CardTitle>
            <CardDescription>
              Admin dapat memperbarui datanya di bawah ini.
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
                    <Input placeholder="Contoh: Ahmad Rafi" {...field} />
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
                      placeholder="Contoh: Universitas Gunadarma"
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
                    <Input placeholder="Contoh: Jakarta" {...field} />
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
                      placeholder="Contoh: Jl. Kenanga No. 88, Jakarta"
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

export default AdminUpdateForm;
