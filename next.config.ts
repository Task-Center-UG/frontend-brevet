import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8083",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8083",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  async redirects() {
    return [
      {
        source: "/dashboard/kursus/:slug/gelombang",
        destination: "/dashboard/kursus/:slug/builder?tab=gelombang",
        permanent: false,
      },
      {
        source: "/dashboard/kursus/:slug/gelombang/:batchSlug/pertemuan",
        destination:
          "/dashboard/kursus/:slug/gelombang/:batchSlug/builder?tab=pertemuan",
        permanent: false,
      },
      {
        source:
          "/dashboard/kursus/:slug/gelombang/:batchSlug/pertemuan/:pertemuanId/materi",
        destination:
          "/dashboard/kursus/:slug/gelombang/:batchSlug/builder?tab=materi&meeting=:pertemuanId",
        permanent: false,
      },
      {
        source:
          "/dashboard/kursus/:slug/gelombang/:batchSlug/pertemuan/:pertemuanId/tugas",
        destination:
          "/dashboard/kursus/:slug/gelombang/:batchSlug/builder?tab=tugas&meeting=:pertemuanId",
        permanent: false,
      },
      {
        source:
          "/dashboard/kursus/:slug/gelombang/:batchSlug/pertemuan/:pertemuanId/quiz",
        destination:
          "/dashboard/kursus/:slug/gelombang/:batchSlug/builder?tab=quiz&meeting=:pertemuanId",
        permanent: false,
      },
      {
        source:
          "/dashboard/kursus/:slug/gelombang/:batchSlug/pertemuan/:pertemuanId/nilai",
        destination:
          "/dashboard/kursus/:slug/gelombang/:batchSlug/builder?tab=nilai&meeting=:pertemuanId",
        permanent: false,
      },
      {
        source: "/dashboard/kursus/:slug/gelombang/:batchSlug/absensi",
        destination:
          "/dashboard/kursus/:slug/gelombang/:batchSlug/builder?tab=absensi",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
