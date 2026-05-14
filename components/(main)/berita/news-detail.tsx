"use client";

import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useGetData } from "@/hooks/use-get-data";
import { Skeleton } from "@/components/ui/skeleton";
import NotFoundContent from "../not-found-content";

type Props = {
  newsSlug: string;
};

const NewsDetail = ({ newsSlug }: Props) => {
  const { data, isLoading } = useGetData({
    queryKey: ["blog-detail", newsSlug],
    dataProtected: `blogs/${newsSlug}`,
  });

  const news = data?.data?.data;

  if (isLoading) {
    return (
      <div className="max-w-screen-md mx-auto py-24 md:py-32 px-6">
        <Skeleton className="w-24 h-6 mb-4" />
        <Skeleton className="w-3/4 h-10 mb-4" />
        <Skeleton className="w-1/3 h-4 mb-8" />
        <Skeleton className="w-full aspect-[16/10] mb-8 rounded-2xl" />
        <Skeleton className="w-full h-80 rounded" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="max-w-screen-md mx-auto py-24 md:py-32 px-6">
        <NotFoundContent message="Berita tidak ditemukan." />
      </div>
    );
  }

  return (
    <div className="max-w-screen-md mx-auto py-24 md:py-32 px-6">
      <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f97316]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
        Artikel
      </span>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-4 !leading-[1.1]">
        {news.title}
      </h1>

      <div className="relative w-full aspect-[16/10] mt-6 mb-10 rounded-2xl overflow-hidden border">
        <ImageWithFallback
          src={news.image}
          alt={news.title}
          fill
          className="object-cover"
        />
      </div>

      <article
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: news.content }}
      />
    </div>
  );
};

export default NewsDetail;
