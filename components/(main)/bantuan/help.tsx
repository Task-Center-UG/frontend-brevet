"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Instagram, MailIcon, MapPinIcon, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ContactSchema = z.object({
  firstName: z.string().min(2, "Nama depan minimal 2 karakter"),
  lastName: z.string().min(2, "Nama belakang minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  message: z.string().min(10, "Pesan minimal 10 karakter"),
  acceptTerms: z.boolean(),
});

const Help = () => {
  const form = useForm<z.infer<typeof ContactSchema>>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
      acceptTerms: false,
    },
  });

  const onSubmit = (data: z.infer<typeof ContactSchema>) => {
    console.log(data);
  };

  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-full max-w-screen-xl mx-auto px-6 xl:px-0">
        <b className="text-muted-foreground">Hubungi Kami</b>
        <h2 className="text-3xl xs:text-4xl md:text-5xl !leading-[1.15] font-bold tracking-tighter">
          Layanan Kontak Tax Center Gunadarma
        </h2>
        <p className="mt-3 text-base sm:text-lg">
          Silakan isi formulir di bawah ini atau kirimkan email kepada kami
          apabila Kamu memiliki pertanyaan terkait program atau layanan yang
          tersedia.
        </p>
        <div className="mt-24 grid lg:grid-cols-2 gap-16 md:gap-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
            <div>
              <div className="h-12 w-12 flex items-center justify-center bg-primary/10 text-primary rounded-full">
                <MailIcon />
              </div>
              <h3 className="mt-6 font-semibold text-xl">Email</h3>
              <p className="my-2.5 text-muted-foreground">
                Admin kami siap membantu setiap hari.
              </p>
              <Link
                className="font-medium text-primary"
                href="mailto:zidanindratama03@gmail.com"
              >
                zidanindratama03@gmail.com
              </Link>
            </div>

            <div>
              <div className="h-12 w-12 flex items-center justify-center bg-primary/10 text-primary rounded-full">
                <MessageCircle />
              </div>
              <h3 className="mt-6 font-semibold text-xl">WhatsApp</h3>
              <p className="my-2.5 text-muted-foreground">
                Admin selalu siap menjawab pesan Kamu.
              </p>
              <Link
                className="font-medium text-primary"
                href="https://wa.me/6285141760017"
                target="_blank"
              >
                +62 851 4176 0017
              </Link>
            </div>

            <div>
              <div className="h-12 w-12 flex items-center justify-center bg-primary/10 text-primary rounded-full">
                <MapPinIcon />
              </div>
              <h3 className="mt-6 font-semibold text-xl">Kantor</h3>
              <p className="my-2.5 text-muted-foreground">
                Silakan kunjungi kami di kampus.
              </p>
              <Link
                className="font-medium text-primary"
                href="https://g.co/kgs/hNhkaiy"
                target="_blank"
              >
                Kampus F4 Universitas Gunadarma <br />
                Jl. Raya Bogor No. 28, Depok 16951, Jawa Barat
              </Link>
            </div>

            <div>
              <div className="h-12 w-12 flex items-center justify-center bg-primary/10 text-primary rounded-full">
                <Instagram />
              </div>
              <h3 className="mt-6 font-semibold text-xl">Instagram</h3>
              <p className="my-2.5 text-muted-foreground">
                Ikuti kami untuk informasi terbaru seputar program & kegiatan.
              </p>
              <Link
                className="font-medium text-primary"
                href="https://instagram.com/taxcenter.ug"
                target="_blank"
              >
                @taxcenter.ug
              </Link>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card className="bg-accent shadow-none">
                <CardContent className="p-6 md:p-10">
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={6}
                              placeholder="Tulis pesan Kamu..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="acceptTerms"
                      render={({ field }) => (
                        <FormItem className="col-span-2 flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Saya menyetujui{" "}
                            <a href="#" className="underline text-primary">
                              syarat & ketentuan
                            </a>
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full mt-6"
                    variant="orange"
                  >
                    Kirim Pesan
                  </Button>
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Help;
