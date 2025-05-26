import { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Produits Populaires | DropSkills",
  description: "Découvrez les produits digitaux les plus populaires sur DropSkills",
};

export default function PopulairePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenu principal */}
      <main className="ml-0 md:ml-64">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-white">Produits Populaires</h1>
          <ProductGrid />
        </div>
      </main>
    </div>
  );
} 