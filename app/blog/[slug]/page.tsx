import { redirect } from "next/navigation";

type PageProps = { params: Promise<{ slug: string }> };

export default async function OldArticlePage({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/knowledge/${slug}`);
}
