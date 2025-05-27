import React, { useEffect, useState } from 'react';
import { getIaToolStats, getUserIaToolHistory, updateIaToolStatus } from '@/lib/ia-tools';
import { IaToolStatus } from '@/generated/prisma';

interface IaToolAdminModalProps {
  tool: any;
  onClose: () => void;
  onStatusChange?: () => void;
}

export default function IaToolAdminModal({ tool, onClose, onStatusChange }: IaToolAdminModalProps) {
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tool) {
      fetchData();
    }
    // eslint-disable-next-line
  }, [tool]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [toolStats, toolLogs] = await Promise.all([
        getIaToolStats(tool.id),
        getUserIaToolHistory(tool.id), // À adapter si besoin pour filtrer par outil
      ]);
      setStats(toolStats);
      setLogs(toolLogs);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    setStatusLoading(true);
    try {
      await updateIaToolStatus(tool.id, tool.status === IaToolStatus.ACTIVE ? IaToolStatus.INACTIVE : IaToolStatus.ACTIVE);
      if (onStatusChange) onStatusChange();
      fetchData();
    } catch (err) {
      setError('Erreur lors du changement de statut');
      console.error(err);
    } finally {
      setStatusLoading(false);
    }
  };

  if (!tool) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">✕</button>
        <h2 className="text-2xl font-bold mb-2">{tool.name}</h2>
        <p className="text-gray-600 mb-4">{tool.description}</p>
        <div className="mb-4 flex gap-4 items-center">
          <span className={`px-2 py-1 rounded text-sm ${tool.status === IaToolStatus.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{tool.status}</span>
          <button
            onClick={handleStatusToggle}
            disabled={statusLoading}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
          >
            {tool.status === IaToolStatus.ACTIVE ? 'Désactiver' : 'Activer'}
          </button>
        </div>
        {loading ? (
          <div>Chargement...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Statistiques</h3>
              <ul className="text-sm text-gray-700">
                <li>Total utilisations : {stats?.totalUsage}</li>
                <li>Utilisations aujourd'hui : {stats?.todayUsage}</li>
                <li>Coût moyen : {stats?.averageCost} €</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Logs récents</h3>
              <div className="max-h-48 overflow-y-auto border rounded">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2">Utilisateur</th>
                      <th className="p-2">Date</th>
                      <th className="p-2">Prompt</th>
                      <th className="p-2">Coût</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.length === 0 ? (
                      <tr><td colSpan={4} className="text-center p-2">Aucun log</td></tr>
                    ) : logs.slice(0, 10).map((log, idx) => (
                      <tr key={idx}>
                        <td className="p-2">{log.userId}</td>
                        <td className="p-2">{new Date(log.createdAt).toLocaleString()}</td>
                        <td className="p-2 truncate max-w-xs">{log.prompt}</td>
                        <td className="p-2">{log.cost ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 