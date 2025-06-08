'use client';

import { useState, useEffect } from 'react';
import { AI_PROVIDERS, AIProviderManager, TOOL_PROVIDER_MAPPING } from '@/lib/ai-providers';
import AdminPageLayout from '@/components/admin/AdminPageLayout';

interface ProviderStatus {
  name: string;
  available: boolean;
  cost: string;
  capabilities: string[];
  testResult?: string;
}

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

  const loadData = () => {
    // Vérifier l'état des providers
    const providerStatus = Object.entries(AI_PROVIDERS).map(([key, provider]) => ({
      name: provider.name,
      available: provider.isAvailable(),
      cost: `$${provider.pricing.input}/$${provider.pricing.output} par 1M tokens`,
      capabilities: provider.capabilities
    }));
    setProviders(providerStatus);

    // Vérifier les variables d'environnement
    setEnvVars({
      DEEPSEEK_API_KEY: !!process.env.NEXT_PUBLIC_DEEPSEEK_AVAILABLE,
      XAI_API_KEY: !!process.env.NEXT_PUBLIC_XAI_AVAILABLE,
      ANTHROPIC_API_KEY: !!process.env.NEXT_PUBLIC_ANTHROPIC_AVAILABLE,
      GOOGLE_AI_API_KEY: !!process.env.NEXT_PUBLIC_GOOGLE_AI_AVAILABLE
    });
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
      'titles': { name: 'Titres', defaultProvider: 'deepseek-v3' },
      'descriptions': { name: 'Descriptions', defaultProvider: 'deepseek-v3' },
      'emails': { name: 'Emails', defaultProvider: 'deepseek-v3' },
      'veille': { name: 'Veille', defaultProvider: 'deepseek-v3' },
      'content': { name: 'Contenu', defaultProvider: 'openai' },
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
        available: provider?.isAvailable() || false
      };
    });
  };

  return (
    <AdminPageLayout title="Configuration IA" icon="⚙️">
      <div className="space-y-8">
        {/* Status des Variables d'Environnement */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Variables d'Environnement</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(envVars).map(([key, available]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-mono text-sm">{key}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {available ? 'Configurée' : 'Manquante'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status des Providers */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Providers IA Disponibles</h3>
          <div className="space-y-4">
            {providers.map((provider) => (
              <div key={provider.name} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{provider.name}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${
                        provider.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {provider.available ? 'Disponible' : 'Non configuré'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{provider.cost}</p>
                    <div className="flex flex-wrap gap-1">
                      {provider.capabilities.map((cap) => (
                        <span key={cap} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {cap}
                        </span>
                      ))}
                    </div>
                    {provider.testResult && (
                      <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                        <strong>Test:</strong> {provider.testResult}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => testProvider(
                      Object.keys(AI_PROVIDERS).find(k => AI_PROVIDERS[k].name === provider.name)!
                    )}
                    disabled={!provider.available || testing !== null}
                    className="ml-4 px-3 py-1 bg-blue-600 text-white rounded text-sm disabled:bg-gray-300"
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
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Attribution des Providers par Outil</h3>
            <button
              onClick={resetToOptimal}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              Optimiser Automatiquement
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Outil</th>
                  <th className="text-left py-2">Provider Assigné</th>
                  <th className="text-left py-2">Coût (Input)</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getOptimalMapping().map((mapping) => (
                  <tr key={mapping.toolId} className="border-b">
                    <td className="py-2 font-medium">{mapping.tool}</td>
                    <td className="py-2">
                      <select
                        value={mapping.providerId}
                        onChange={(e) => updateToolProvider(mapping.toolId, e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                        disabled={updating}
                      >
                        {Object.entries(AI_PROVIDERS).map(([key, provider]) => (
                          <option key={key} value={key} disabled={!provider.isAvailable()}>
                            {provider.name} {!provider.isAvailable() ? '(Non configuré)' : ''}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2">${mapping.cost}/1M tokens</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        mapping.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {mapping.available ? 'Prêt' : 'Indisponible'}
                      </span>
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => testToolProvider(mapping.toolId)}
                        disabled={!mapping.available || testing !== null}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs disabled:bg-gray-300"
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
            <div className={`mt-4 p-3 rounded text-sm ${
              updateMessage.includes('succès') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {updateMessage}
            </div>
          )}
        </div>

        {/* Guide Configuration */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">🚀 Guide de Configuration</h3>
          <div className="space-y-3 text-sm">
            <div>
              <strong>1. DeepSeek V3</strong> (Priorité 1 - Économique)
              <p className="text-gray-600">Ajoutez DEEPSEEK_API_KEY dans .env.local</p>
            </div>
            <div>
              <strong>2. Gemini 2.0 Flash</strong> (Priorité 2 - Rapide)
              <p className="text-gray-600">Ajoutez GOOGLE_AI_API_KEY dans .env.local</p>
            </div>
            <div>
              <strong>3. Grok 3</strong> (Créativité)
              <p className="text-gray-600">Ajoutez XAI_API_KEY quand disponible</p>
            </div>
            <div>
              <strong>4. Claude 3.5 Sonnet</strong> (Premium)
              <p className="text-gray-600">Ajoutez ANTHROPIC_API_KEY pour les cas complexes</p>
            </div>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
}