"use client";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useFileUploader } from "@/hooks/use-file-uploader";
import { useGetData } from "@/hooks/use-get-data";
import { usePatchData } from "@/hooks/use-patch-data";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CreateMaterialFormData,
  CreateMaterialSchema,
} from "@/components/(dashboard)/kelas/materi/_schemas/material-create-schema";
import { toAssetUrl } from "@/helpers/api-config";

interface Props {
  courseSlug: string;
  materialId: string;
  batchSlug: string;
  meetingId?: string;
}

const MateriFormUpdate = ({
  courseSlug,
  materialId,
  batchSlug,
  meetingId,
}: Props) => {
  const { uploadFile } = useFileUploader();
  const [isReady, setIsReady] = useState(false);

  const { data, isLoading: isFetching } = useGetData({
    queryKey: ["material", materialId],
    dataProtected: `materials/${materialId}`,
    options: { refetchOnWindowFocus: false },
  });

  const form = useForm<CreateMaterialFormData>({
    resolver: zodResolver(CreateMaterialSchema),
    defaultValues: {
      title: "",
      description: "",
      url: "",
    },
  });

  const { mutate: updateMaterial, isPending } = usePatchData({
    queryKey: "materials",
    dataProtected: `materials/${materialId}`,
    successMessage: "Materi berhasil diperbarui!",
    backUrl: `/dashboard/kursus/${courseSlug}/gelombang/${batchSlug}/builder?tab=materi&meeting=${meetingId}`,
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const uploadedUrl = await uploadFile(
      file,
      isImage ? "images" : "documents"
    );

    if (uploadedUrl) {
      form.setValue("url", uploadedUrl, { shouldValidate: true });
    }
  };

  const onSubmit = (values: CreateMaterialFormData) => {
    updateMaterial({
      title: values.title,
      description: values.description,
      url: values.url,
    });
  };

  useEffect(() => {
    if (data?.data?.data && !form.formState.isDirty) {
      const material = data.data.data;
      form.reset({
        title: material.title,
        description: material.description,
        url: material.url,
      });
      setIsReady(true);
    }
  }, [data, form]);

  if (!isReady) return null;

  const materialUrl = toAssetUrl(form.watch("url"));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Perbarui Materi</CardTitle>
            <CardDescription>
              Ubah informasi materi dan unggah file baru jika diperlukan.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Materi</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isFetching} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isFetching} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={() => (
                <FormItem>
                  <FormLabel>File Materi</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      disabled={isFetching}
                    />
                  </FormControl>
                  {typeof form.watch("url") === "string" &&
                    form.watch("url") !== "" && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground mb-1">
                          Materi saat ini:
                        </p>
                        {materialUrl.endsWith(".pdf") ? (
                          <a
                            href={materialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Lihat PDF
                          </a>
                        ) : (
                          <Link
                            href={materialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={materialUrl}
                              alt="Materi"
                              className="max-w-xs rounded border"
                            />
                          </Link>
                        )}
                      </div>
                    )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              disabled={isPending || isFetching}
              className="w-full md:w-fit"
              variant="orange"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Perbarui Materi"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default MateriFormUpdate;
