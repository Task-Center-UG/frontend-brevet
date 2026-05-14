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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePutData } from "@/hooks/use-put-data";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { useForm } from "react-hook-form";
import { useFileUploader } from "@/hooks/use-file-uploader";
import {
  CreateNewsFormData,
  CreateNewsSchema,
} from "./_schemas/news-create-schema";
import { useGetData } from "@/hooks/use-get-data";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  newsSlug: string;
};

const NewsUpdateForm = ({ newsSlug }: Props) => {
  const [isReady, setIsReady] = useState(false);

  const { uploadFile } = useFileUploader();

  const { data, isLoading: isFetching } = useGetData({
    queryKey: ["news", newsSlug],
    dataProtected: `blogs/${newsSlug}`,
    options: {
      refetchOnWindowFocus: false,
    },
  });

  const form = useForm<CreateNewsFormData>({
    resolver: zodResolver(CreateNewsSchema),
    defaultValues: {
      title: "",
      short_description: "",
      full_description: "",
      image: "",
    },
  });

  const { mutate: updateNews, isPending } = usePutData({
    queryKey: "news",
    dataProtected: `blogs/${data?.data?.data?.id}`,
    successMessage: "Berita berhasil diperbarui!",
    backUrl: "/dashboard/berita",
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, "images");
    form.setValue("image", url || "", { shouldValidate: true });
  };

  const onSubmit = (values: CreateNewsFormData) => {
    const payload = {
      title: values.title,
      description: values.short_description,
      content: values.full_description,
      image: values.image,
    };
    updateNews(payload);
  };

  useEffect(() => {
    if (data?.data?.data && !form.formState.isDirty) {
      form.reset({
        title: data.data.data.title || "",
        short_description: data.data.data.description || "",
        full_description: data.data.data.content || "",
        image: data.data.data.image || "",
      });
      setIsReady(true);
    }
  }, [data, form]);

  if (!isReady) return null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Update Berita</CardTitle>
            <CardDescription>
              Perbarui informasi berita di sini.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Judul berita"
                      disabled={isFetching}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="short_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi Singkat</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Deskripsi singkat"
                      disabled={isFetching}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="full_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Isi Berita</FormLabel>
                  <FormControl>
                    <MinimalTiptapEditor
                      key={newsSlug}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Masukkan isi lengkap berita..."
                      autofocus={false}
                      editable={!isFetching}
                      output="html"
                      className="w-full max-w-full overflow-hidden"
                      editorContentClassName="prose max-w-none p-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Gambar Berita</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={isFetching}
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
              disabled={isPending || isFetching}
              className="w-full md:w-fit"
              variant={"orange"}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Perbarui Data"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default NewsUpdateForm;
