import { Metadata } from "next";
import { DataService } from "@/lib/data-service";
import CategoryClient from "./CategoryClient";

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.slug?.[0] || "smartphones";
  const brandSlug = resolvedParams.slug?.[1];

  const categories = await DataService.getCategories();
  const category = categories.find((c) => c.slug === categorySlug);

  const titlePrefix = category ? category.name : "Catalogue";
  const title = brandSlug ? `${titlePrefix} ${brandSlug.toUpperCase()} | Anis Phone` : `${titlePrefix} | Anis Phone`;

  return {
    title,
    description: `Découvrez notre collection ${titlePrefix} chez Anis Phone Algérie. Produits neufs scellés et certifiés Héritage A+. Livraison 58 Wilayas.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <CategoryClient params={params} />;
}
