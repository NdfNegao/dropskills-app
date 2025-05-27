import React, { useState, useEffect } from 'react';
import { 
  createIaTool, 
  trackIaToolUsage, 
  getIaToolStats, 
  listActiveIaTools,
  getUserIaToolHistory,
  updateIaToolStatus,
  getMostUsedIaTools
} from '@/lib/ia-tools';
import { IaToolType, IaToolStatus } from '@/generated/prisma';

export default function IaToolUsage() {
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      const activeTools = await listActiveIaTools();
      setTools(activeTools);
    } catch (err) {
      setError('Erreur lors du chargement des outils');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToolUsage = async (toolId: string) => {
    try {
      // Exemple d'utilisation d'un outil
      await trackIaToolUsage({
        userId: 'user-id', // À remplacer par l'ID de l'utilisateur connecté
        toolId,
        prompt: 'Exemple de prompt',
        response: 'Réponse de l\'IA',
        tokensUsed: 100,
        cost: 0.002,
        userAgent: navigator.userAgent,
        ipAddress: '127.0.0.1', // À remplacer par l'IP réelle
      });

      // Recharger les outils pour mettre à jour les statistiques
      await loadTools();
    } catch (err) {
      setError('Erreur lors de l\'utilisation de l\'outil');
      console.error(err);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Outils IA</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div key={tool.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{tool.name}</h2>
              <span className={`px-2 py-1 rounded text-sm ${
                tool.status === IaToolStatus.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {tool.status}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{tool.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {tool.tags?.split(',').map((tag: string) => (
                <span key={tag} className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Utilisations: {tool._count.usage}
              </div>
              <button
                onClick={() => handleToolUsage(tool.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Utiliser
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 