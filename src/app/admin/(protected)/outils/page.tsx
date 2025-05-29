'use client';

import { useRouter } from 'next/navigation';

export default function AdminOutilsPage() {
  const router = useRouter();

  const handleAddTool = () => {
    router.push('/admin/outils/nouveau');
  };

  const handleViewTool = (toolId: number) => {
    router.push(`/admin/outils/${toolId}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Gestion des Outils</h1>
      <button 
        onClick={handleAddTool}
        className="mb-4 px-4 py-2 bg-[#ff0033] text-white rounded hover:bg-[#cc0029] transition-colors"
      >
        Ajouter un outil
      </button>
      
      <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#333]">
            <tr>
              <th className="text-left p-4 text-white">Nom</th>
              <th className="text-left p-4 text-white">Type</th>
              <th className="text-left p-4 text-white">Statut</th>
              <th className="text-left p-4 text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#333]">
              <td className="p-4 text-white">Générateur de Titres</td>
              <td className="p-4 text-neutral-400">IA</td>
              <td className="p-4 text-green-400">Actif</td>
              <td><button onClick={() => handleViewTool(1)} className="text-[#ff0033] hover:underline">Voir</button></td>
            </tr>
            <tr className="border-b border-[#333]">
              <td className="p-4 text-white">ICP Maker</td>
              <td className="p-4 text-neutral-400">IA</td>
              <td className="p-4 text-green-400">Actif</td>
              <td><button onClick={() => handleViewTool(2)} className="text-[#ff0033] hover:underline">Voir</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 