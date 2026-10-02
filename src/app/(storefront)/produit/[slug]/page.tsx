import { Metadata } from "next";
import { DataService } from "@/lib/data-service";
import ProductClient from "./ProductClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await DataService.getProductBySlug(resolvedParams.slug);

  if (!product) {
    return {
      title: "Appareil d'Exception | Anis Phone",
      description: "Découvrez notre collection de smartphones et high-tech chez Anis Phone Algérie.",
    };
  }

  return {
    title: `${product.name} | Anis Phone`,
    description: product.description || `Découvrez et commandez ${product.name} chez Anis Phone Algérie. Livraison garantie 58 Wilayas.`,
    openGraph: {
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  return <ProductClient params={params} />;
}
