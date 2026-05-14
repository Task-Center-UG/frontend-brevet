import { redirect } from "next/navigation";

export default async function GelombangRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  redirect(`/dashboard/kursus/${slug}/builder?tab=gelombang`);
}
