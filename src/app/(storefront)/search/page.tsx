import { redirect } from "next/navigation";

export default async function SearchRedirect({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = params.q ? `?q=${encodeURIComponent(params.q)}` : "";
  redirect(`/recherche${q}`);
}
