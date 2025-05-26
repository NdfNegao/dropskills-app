import { Metadata } from "next";
import Sidebar from '../../components/Sidebar';

export const metadata: Metadata = {
  title: "Produits Populaires | DropSkills",
  description: "Découvrez les produits digitaux les plus populaires sur DropSkills",
};

export default function PopulairePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Produits Populaires</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Contenu à venir */}
        <p className="text-gray-500">Les produits populaires seront affichés ici.</p>
      </div>
    </div>
  );
} 