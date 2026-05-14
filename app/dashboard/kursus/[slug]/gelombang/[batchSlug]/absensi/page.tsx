import { redirect } from "next/navigation";

export default async function AbsensiRedirectPage({
  params,
}: {
  params: Promise<{ slug: string; batchSlug: string }>;
}) {
  const { slug, batchSlug } = await params;

  redirect(`/dashboard/kursus/${slug}/gelombang/${batchSlug}/builder?tab=absensi`);
}
