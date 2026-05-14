import { redirect } from "next/navigation";

export default async function MateriRedirectPage({
  params,
}: {
  params: Promise<{ slug: string; batchSlug: string; pertemuanId: string }>;
}) {
  const { slug, batchSlug, pertemuanId } = await params;

  redirect(
    `/dashboard/kursus/${slug}/gelombang/${batchSlug}/builder?tab=materi&meeting=${pertemuanId}`
  );
}
