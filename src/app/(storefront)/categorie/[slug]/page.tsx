import { Metadata } from "next";
import { DataService } from "@/lib/data-service";
import CategoryClient from "./CategoryClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const categories = await DataService.getCategories();
  const category = categories.find((c) => c.slug === resolvedParams.slug);

  if (!category) {
    return {
      title: "Catégorie | Anis Phone",
      description: "Découvrez notre catalogue exclusif chez Anis Phone.",
    };
  }

  return {
    title: `${category.name} | Anis Phone`,
    description: category.description || `Découvrez notre sélection de ${category.name} chez Anis Phone Algérie. Livraison 58 Wilayas.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  // Pass the promise directly to the client component to be unwrapped with React.use()
  return <CategoryClient params={params} />;
}
