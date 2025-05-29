'use client';

import { useRouter } from 'next/navigation';

export default function AdminProduitsPage() {
  const router = useRouter();

  const handleAddProduct = () => {
    router.push('/admin/produits/nouveau');
  };

  const handleViewProduct = (productId: number) => {
    router.push(`/admin/produits/${productId}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Gestion des Produits</h1>
      <button 
        onClick={handleAddProduct}
        className="mb-4 px-4 py-2 bg-[#ff0033] text-white rounded hover:bg-[#cc0029] transition-colors"
      >
        Ajouter un produit
      </button>
      
      <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#333]">
            <tr>
              <th className="text-left p-4 text-white">Nom</th>
              <th className="text-left p-4 text-white">Type</th>
              <th className="text-left p-4 text-white">Prix</th>
              <th className="text-left p-4 text-white">Statut</th>
              <th className="text-left p-4 text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#333]">
              <td className="p-4 text-white">Pack Business IA</td>
              <td className="p-4 text-neutral-400">Premium</td>
              <td className="p-4 text-neutral-400">€97</td>
              <td className="p-4 text-green-400">Actif</td>
              <td><button onClick={() => handleViewProduct(1)} className="text-[#ff0033] hover:underline">Voir</button></td>
            </tr>
            <tr className="border-b border-[#333]">
              <td className="p-4 text-white">Guide IA Gratuit</td>
              <td className="p-4 text-neutral-400">Gratuit</td>
              <td className="p-4 text-neutral-400">€0</td>
              <td className="p-4 text-green-400">Actif</td>
              <td><button onClick={() => handleViewProduct(2)} className="text-[#ff0033] hover:underline">Voir</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 