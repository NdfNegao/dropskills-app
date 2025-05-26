import { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";

export const metadata: Metadata = {
  title: "Produits Populaires | DropSkills",
  description: "Découvrez les produits digitaux les plus populaires sur DropSkills",
};

export default function PopulairePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Produits Populaires</h1>
      <ProductGrid />
    </div>
  );
} 