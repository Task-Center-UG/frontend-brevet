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
import { usePostData } from "@/hooks/use-post-data";
import {
  CreateMaterialFormData,
  CreateMaterialSchema,
} from "./_schemas/material-create-schema";

type Props = {
  batchSlug: string;
  meetingId?: string;
};

const MateriFormCreate = ({ meetingId, batchSlug }: Props) => {
  const { uploadFile } = useFileUploader();

  const form = useForm<CreateMaterialFormData>({
    resolver: zodResolver(CreateMaterialSchema),
    defaultValues: {
      title: "",
      description: "",
      url: "",
    },
  });

  const { mutate: submitMaterial, isPending } = usePostData({
    queryKey: "materials",
    dataProtected: `meetings/${meetingId}/materials`,
    successMessage: "Materi berhasil ditambahkan!",
    backUrl: `/dashboard/kelas/${batchSlug}/materi?${meetingId}`,
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
    submitMaterial({
      title: values.title,
      description: values.description,
      url: values.url,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Tambah Materi</CardTitle>
            <CardDescription>
              Silakan isi detail materi dan unggah file materi (PDF/Gambar).
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
                    <Input {...field} placeholder="Contoh: Materi Pajak" />
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
                    <Input
                      {...field}
                      placeholder="Contoh: Bacalah materi dan kerjakan soal"
                    />
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
              disabled={isPending}
              className="w-full md:w-fit"
              variant="orange"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Materi"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default MateriFormCreate;
