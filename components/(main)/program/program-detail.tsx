"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import Link from "next/link";
import { useGetData } from "@/hooks/use-get-data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { TCourseImage } from "@/components/(dashboard)/kursus/_types/couurse-type";
import NotFoundContent from "../not-found-content";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  courseSlug: string;
};

export default function CourseDetailPage({ courseSlug }: Props) {
  const { data, isLoading } = useGetData({
    queryKey: ["courses", courseSlug],
    dataProtected: `courses/${courseSlug}`,
  });

  const course = data?.data?.data;

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);

  if (isLoading) {
    return (
      <section className="w-full py-24 md:py-32 dark:bg-background transition-colors">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div className="space-y-4">
              <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-16 rounded-xl" />
                ))}
              </div>
              <Skeleton className="h-8 w-3/4 rounded" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-12 w-full rounded-full" />
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 border-b">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-32 rounded-none" />
                ))}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!course) {
    return (
      <div className="max-w-screen-md mx-auto py-24 md:py-32 px-6">
        <NotFoundContent message="Kursus tidak ditemukan." />
      </div>
    );
  }

  const images = course.course_images?.length
    ? course.course_images
    : [{ image_url: "/placeholder-course.png" }];

  return (
    <section className="w-full py-24 md:py-32 dark:bg-background transition-colors">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <Carousel
              setApi={setApi}
              className="w-full rounded-2xl overflow-hidden border"
            >
              <CarouselContent>
                {images.map((img: TCourseImage, index: number) => (
                  <CarouselItem key={index}>
                    <div className="relative w-full aspect-[4/3]">
                      <ImageWithFallback
                        src={img.image_url}
                        alt={`${course.title} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {images.length > 1 && (
              <Carousel className="mt-4 w-full">
                <CarouselContent className="flex my-1">
                  {images.map((img: TCourseImage, index: number) => (
                    <CarouselItem
                      key={index}
                      className={`basis-1/5 cursor-pointer ${
                        current === index + 1 ? "opacity-100" : "opacity-50"
                      }`}
                      onClick={() => api?.scrollTo(index)}
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden border">
                        <ImageWithFallback
                          src={img.image_url}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            )}

            <div className="space-y-1">
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <p className="text-muted-foreground">
                {course.short_description}
              </p>
            </div>

            <Button variant="orange" className="w-full rounded-full h-12" asChild>
              <Link href={`/jadwal-program?slug=${courseSlug}`}>
                Lihat Jadwal Kursus
              </Link>
            </Button>
          </div>

          <Tabs defaultValue="tentang" className="w-full">
            <ScrollArea className="w-full overflow-auto whitespace-nowrap">
              <TabsList className="w-full p-0 bg-background justify-start border-b rounded-none mb-4">
                <TabsTrigger
                  value="tentang"
                  className="rounded-none bg-background h-full data-[state=active]:shadow-none border border-b-[3px] border-transparent data-[state=active]:border-primary px-4 py-2 text-sm"
                >
                  Tentang Kursus
                </TabsTrigger>
                <TabsTrigger
                  value="learning"
                  className="rounded-none bg-background h-full data-[state=active]:shadow-none border border-b-[3px] border-transparent data-[state=active]:border-primary px-4 py-2 text-sm"
                >
                  Hasil Pembelajaran
                </TabsTrigger>
                <TabsTrigger
                  value="achievements"
                  className="rounded-none bg-background h-full data-[state=active]:shadow-none border border-b-[3px] border-transparent data-[state=active]:border-primary px-4 py-2 text-sm"
                >
                  Pencapaian
                </TabsTrigger>
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <TabsContent value="tentang">
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            </TabsContent>
            <TabsContent value="learning">
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: course.learning_outcomes }}
              />
            </TabsContent>
            <TabsContent value="achievements">
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: course.achievements }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
