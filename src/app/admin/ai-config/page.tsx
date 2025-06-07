'use client';

import { useState, useEffect } from 'react';
import { AI_PROVIDERS, AIProviderManager, TOOL_PROVIDER_MAPPING } from '@/lib/ai-providers';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';
import { Brain, Settings } from 'lucide-react';

interface ProviderStatus {
  name: string;
  available: boolean;
  cost: string;
  capabilities: string[];
  testResult?: string;
}

/**
 * Renders the AI configuration admin page for managing AI providers, environment variables, and tool-provider assignments.
 *
 * Provides interfaces to view and test provider availability, configure environment variables, assign providers to tools, and reset mappings to optimal defaults. Displays real-time status, cost, and capabilities for each provider and tool.
 */
export default function AIConfigPage() {
  const [providers, setProviders] = useState<ProviderStatus[]>([]);
  const [testing, setTesting] = useState<string | null>(null);
  const [envVars, setEnvVars] = useState<Record<string, boolean>>({});
  const [currentMapping, setCurrentMapping] = useState<Record<string, string>>({});
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string>('');

  useEffect(() => {
    loadData();
    loadCurrentConfig();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch('/api/admin/ai-config');
      if (response.ok) {
        const data = await response.json();
        
        // Utiliser les données de l'API pour déterminer la disponibilité
        const providerStatus = data.providers.map((provider: any) => ({
          name: provider.name,
          available: provider.available,
          cost: `$${provider.pricing.input}/$${provider.pricing.output} par 1M tokens`,
          capabilities: provider.capabilities
        }));
        setProviders(providerStatus);
        
        // Mettre à jour le statut des variables d'environnement
        setEnvVars(data.envStatus || {});
      }
    } catch (error) {
      console.error('Erreur chargement données:', error);
      // Fallback en cas d'erreur
      const providerStatus = Object.entries(AI_PROVIDERS).map(([key, provider]) => ({
        name: provider.name,
        available: false, // Par défaut false en cas d'erreur
        cost: `$${provider.pricing.input}/$${provider.pricing.output} par 1M tokens`,
        capabilities: provider.capabilities
      }));
      setProviders(providerStatus);
    }
  };

  const loadCurrentConfig = async () => {
    try {
      const response = await fetch('/api/admin/ai-config');
      if (response.ok) {
        const data = await response.json();
        setCurrentMapping(data.mapping || {});
      }
    } catch (error) {
      console.error('Erreur chargement config:', error);
    }
  };

  // Fonction pour déterminer la disponibilité d'un provider basée sur les données de l'API
  const getProviderAvailability = (providerId: string): boolean => {
    const provider = providers.find(p => {
      const providerEntry = Object.entries(AI_PROVIDERS).find(([key, prov]) => prov.name === p.name);
      return providerEntry && providerEntry[0] === providerId;
    });
    return provider?.available || false;
  };

  const updateToolProvider = async (toolId: string, providerId: string) => {
    setUpdating(true);
    setUpdateMessage('');
    
    try {
      const response = await fetch('/api/admin/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId, providerId })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setCurrentMapping(data.newMapping);
        setUpdateMessage(`✅ ${data.message}`);
        setTimeout(() => setUpdateMessage(''), 3000);
      } else {
        setUpdateMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setUpdateMessage('❌ Erreur lors de la mise à jour');
    } finally {
      setUpdating(false);
    }
  };

  const resetToOptimal = async () => {
    setUpdating(true);
    setUpdateMessage('');
    
    try {
      const response = await fetch('/api/admin/ai-config', {
        method: 'PUT'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setCurrentMapping(data.mapping);
        setUpdateMessage(`✅ ${data.message}`);
        setTimeout(() => setUpdateMessage(''), 3000);
      } else {
        setUpdateMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setUpdateMessage('❌ Erreur lors de la réinitialisation');
    } finally {
      setUpdating(false);
    }
  };

  const testToolProvider = async (toolId: string) => {
    const providerId = currentMapping[toolId];
    if (!providerId) return;
    
    setTesting(toolId);
    
    try {
      const response = await fetch('/api/admin/test-ai-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          provider: providerId, 
          prompt: `Test pour l'outil ${toolId}: Générez un court texte de test.` 
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setProviders(prev => prev.map(p => 
          p.name === AI_PROVIDERS[providerId]?.name 
            ? { ...p, testResult: `✅ ${data.responseTime} - ${data.text.substring(0, 100)}...` }
            : p
        ));
      } else {
        setProviders(prev => prev.map(p => 
          p.name === AI_PROVIDERS[providerId]?.name 
            ? { ...p, testResult: `❌ ${data.error}` }
            : p
        ));
      }
    } catch (error) {
      console.error('Erreur test provider:', error);
    } finally {
      setTesting(null);
    }
  };

  const testProvider = async (providerKey: string) => {
    setTesting(providerKey);
    try {
      const response = await fetch('/api/admin/test-ai-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          provider: providerKey,
          prompt: 'Écris une phrase courte et professionnelle pour tester la connexion API.'
        })
      });
      
      const result = await response.json();
      
      setProviders(prev => prev.map(p => 
        p.name === AI_PROVIDERS[providerKey].name 
          ? { ...p, testResult: result.success ? result.text : result.error }
          : p
      ));
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setTesting(null);
    }
  };

  const getOptimalMapping = () => {
    const toolsConfig = {
      'icp-generator': { name: 'ICP Generator', defaultProvider: 'deepseek-v3' },
      'offer-generator': { name: 'Générateur d\'Offres', defaultProvider: 'grok-3' },
      'title-generator': { name: 'Générateur de Titres', defaultProvider: 'deepseek-v3' },
      'description-generator': { name: 'Générateur de Descriptions', defaultProvider: 'deepseek-v3' },
      'content-system': { name: 'Content System 90J', defaultProvider: 'claude-3.5-sonnet' },
      'email-sequence': { name: 'CopyMoneyMail', defaultProvider: 'grok-3' },
      'lead-magnet': { name: 'Lead Magnet Creator', defaultProvider: 'grok-3' },
      'veille-strategique': { name: 'Veille Stratégique', defaultProvider: 'claude-3.5-sonnet' },
      'agent-veille': { name: 'Agent Veille IA', defaultProvider: 'claude-3.5-sonnet' },
      'tunnel-maker': { name: 'Tunnel Maker', defaultProvider: 'grok-3' },
      'usp-maker': { name: 'USP Maker', defaultProvider: 'deepseek-v3' },
      'calculateur': { name: 'Calculateur ROI', defaultProvider: 'deepseek-v3' },
      'pdf-rebrander': { name: 'PDF Rebrander', defaultProvider: 'deepseek-v3' },
      // Anciens noms pour compatibilité
      'titles': { name: 'Titres', defaultProvider: 'deepseek-v3' },
      'descriptions': { name: 'Descriptions', defaultProvider: 'deepseek-v3' },
      'emails': { name: 'Emails', defaultProvider: 'deepseek-v3' },
      'veille': { name: 'Veille', defaultProvider: 'deepseek-v3' },
      'content': { name: 'Contenu', defaultProvider: 'claude-3.5-sonnet' },
      'usp': { name: 'USP', defaultProvider: 'deepseek-v3' },
      'icp': { name: 'ICP', defaultProvider: 'deepseek-v3' }
    };
    
    return Object.entries(toolsConfig).map(([toolId, config]) => {
      const assignedProvider = currentMapping[toolId] || config.defaultProvider;
      const provider = AI_PROVIDERS[assignedProvider];
      
      return {
        tool: config.name,
        toolId,
        provider: provider?.name || 'Non configuré',
        providerId: assignedProvider,
        cost: provider?.pricing?.input || '0',
        available: getProviderAvailability(assignedProvider)
      };
    });
  };

  return (
    <AdminLayoutWithSidebar 
      title="Configuration IA" 
      icon={<Brain className="w-6 h-6" />}
      subtitle="Gérez les providers IA et leur attribution aux outils"
    >
      <div className="space-y-8">
        {/* Status des Variables d'Environnement */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#232323] p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Variables d'Environnement</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(envVars).map(([key, available]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-[#232323] rounded border border-[#333333]">
                <span className="font-mono text-sm text-gray-300">{key}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  available ? 'bg-green-900/50 text-green-400 border border-green-700' : 'bg-red-900/50 text-red-400 border border-red-700'
                }`}>
                  {available ? 'Configurée' : 'Manquante'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status des Providers */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#232323] p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Providers IA Disponibles</h3>
          <div className="space-y-4">
            {providers.map((provider) => (
              <div key={provider.name} className="border border-[#333333] rounded-lg p-4 bg-[#232323]">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-white">{provider.name}</h4>
                      <span className={`px-2 py-1 rounded text-xs border ${
                        provider.available ? 'bg-green-900/50 text-green-400 border-green-700' : 'bg-gray-800 text-gray-400 border-gray-600'
                      }`}>
                        {provider.available ? 'Disponible' : 'Non configuré'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{provider.cost}</p>
                    <div className="flex flex-wrap gap-1">
                      {provider.capabilities.map((cap) => (
                        <span key={cap} className="px-2 py-1 bg-blue-900/50 text-blue-400 border border-blue-700 text-xs rounded">
                          {cap}
                        </span>
                      ))}
                    </div>
                    {provider.testResult && (
                      <div className="mt-3 p-3 bg-[#1a1a1a] border border-[#333333] rounded text-sm">
                        <strong className="text-white">Test:</strong> <span className="text-gray-300">{provider.testResult}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      const providerKey = Object.keys(AI_PROVIDERS).find(k => AI_PROVIDERS[k].name === provider.name);
                      if (providerKey) testProvider(providerKey);
                    }}
                    disabled={!provider.available || testing !== null}
                    className="ml-4 px-3 py-1 bg-blue-600 text-white rounded text-sm disabled:bg-gray-600 disabled:text-gray-400 hover:bg-blue-700 transition-colors"
                  >
                    {testing === Object.keys(AI_PROVIDERS).find(k => AI_PROVIDERS[k].name === provider.name) 
                      ? 'Test...' : 'Tester'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mapping Outils → Providers */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#232323] p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Attribution des Providers par Outil</h3>
            <button
              onClick={resetToOptimal}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
            >
              Optimiser Automatiquement
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#333333]">
                  <th className="text-left py-2 text-gray-300">Outil</th>
                  <th className="text-left py-2 text-gray-300">Provider Assigné</th>
                  <th className="text-left py-2 text-gray-300">Coût (Input)</th>
                  <th className="text-left py-2 text-gray-300">Status</th>
                  <th className="text-left py-2 text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getOptimalMapping().map((mapping) => (
                  <tr key={mapping.toolId} className="border-b border-[#333333]">
                    <td className="py-2 font-medium text-white">{mapping.tool}</td>
                    <td className="py-2">
                      <select
                        value={mapping.providerId}
                        onChange={(e) => updateToolProvider(mapping.toolId, e.target.value)}
                        className="border border-[#333333] rounded px-2 py-1 text-sm bg-[#232323] text-white"
                        disabled={updating}
                      >
                        {Object.entries(AI_PROVIDERS).map(([key, provider]) => (
                          <option key={key} value={key} className="bg-[#232323] text-white">
                            {provider.name} {!provider.isAvailable() ? '(Non configuré)' : ''}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 text-gray-300">${mapping.cost}/1M tokens</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs border ${
                        mapping.available ? 'bg-green-900/50 text-green-400 border-green-700' : 'bg-red-900/50 text-red-400 border-red-700'
                      }`}>
                        {mapping.available ? 'Prêt' : 'Indisponible'}
                      </span>
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => testToolProvider(mapping.toolId)}
                        disabled={!mapping.available || testing !== null}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs disabled:bg-gray-600 disabled:text-gray-400 hover:bg-blue-700 transition-colors"
                      >
                        {testing === mapping.toolId ? 'Test...' : 'Tester'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {updateMessage && (
            <div className={`mt-4 p-3 rounded text-sm border ${
              updateMessage.includes('succès') ? 'bg-green-900/50 text-green-400 border-green-700' : 'bg-red-900/50 text-red-400 border-red-700'
            }`}>
              {updateMessage}
            </div>
          )}
        </div>

        {/* Guide Configuration */}
        <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-black flex items-center gap-2">
               <Settings className="w-5 h-5 text-blue-500" />
               Guide de Configuration
             </h3>
            <p className="text-sm text-gray-600 mt-1">Instructions pour configurer les providers IA</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <strong className="text-black">DeepSeek V3</strong>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium">Priorité 1 - Économique</span>
                </div>
                <p className="text-gray-700 text-sm ml-8">Ajoutez <code className="bg-gray-100 px-1 rounded text-xs">DEEPSEEK_API_KEY</code> dans .env.local</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <strong className="text-black">Gemini 2.0 Flash</strong>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium">Priorité 2 - Rapide</span>
                </div>
                <p className="text-gray-700 text-sm ml-8">Ajoutez <code className="bg-gray-100 px-1 rounded text-xs">GOOGLE_AI_API_KEY</code> dans .env.local</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <strong className="text-black">Grok 3</strong>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded font-medium">Créativité</span>
                </div>
                <p className="text-gray-700 text-sm ml-8">Ajoutez <code className="bg-gray-100 px-1 rounded text-xs">GROK_API_KEY</code> dans .env.local</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  <strong className="text-black">Claude 3.5 Sonnet</strong>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded font-medium">Premium</span>
                </div>
                <p className="text-gray-700 text-sm ml-8">Ajoutez <code className="bg-gray-100 px-1 rounded text-xs">ANTHROPIC_API_KEY</code> pour les cas complexes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayoutWithSidebar>
  );
}