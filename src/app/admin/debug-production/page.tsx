'use client';

import { useSession } from 'next-auth/react';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';

export default function DebugProductionPage() {
  const { data: session, status } = useSession();
  const { user, canAccessPremium, isAdmin } = useAuth();
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [dbCheck, setDbCheck] = useState<any>(null);
  const [envCheck, setEnvCheck] = useState<any>(null);

  // Vérifier les variables d'environnement côté client
  useEffect(() => {
    setEnvCheck({
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      nodeEnv: process.env.NODE_ENV,
      url: typeof window !== 'undefined' ? window.location.href : 'N/A'
    });
  }, []);

  // Récupérer les infos du token via une API
  const checkToken = async () => {
    try {
      const response = await fetch('/api/debug/token');
      const result = await response.json();
      setTokenInfo(result);
    } catch (error) {
      setTokenInfo({ error: 'Erreur lors de la récupération du token' });
    }
  };

  // Vérifier la base de données
  const checkDatabase = async () => {
    try {
      const response = await fetch('/api/debug/database');
      const result = await response.json();
      setDbCheck(result);
    } catch (error) {
      setDbCheck({ error: 'Erreur lors de la vérification BDD' });
    }
  };

  // Simuler l'accès à un outil premium
  const testToolAccess = async (toolPath: string) => {
    try {
      const response = await fetch(toolPath, { method: 'HEAD' });
      return {
        path: toolPath,
        status: response.status,
        canAccess: response.status !== 404 && response.status !== 403
      };
    } catch (error) {
      return {
        path: toolPath,
        error: 'Erreur de requête'
      };
    }
  };

  const [toolTests, setToolTests] = useState<any[]>([]);

  const runToolTests = async () => {
    const tools = [
      '/outils/icp-maker',
      '/outils/content-system',
      '/outils/generateur-offre',
      '/outils/tunnel-maker'
    ];

    const results = await Promise.all(tools.map(testToolAccess));
    setToolTests(results);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🔧 Debug Production - Problème Premium</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Général */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-blue-400">📊 Status Général</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Auth Status:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  status === 'authenticated' ? 'bg-green-600' : 'bg-red-600'
                }`}>
                  {status}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Can Access Premium:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  canAccessPremium ? 'bg-green-600' : 'bg-red-600'
                }`}>
                  {canAccessPremium ? 'OUI' : 'NON'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Is Admin:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  isAdmin ? 'bg-purple-600' : 'bg-gray-600'
                }`}>
                  {isAdmin ? 'OUI' : 'NON'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>User Email:</span>
                <span className="text-yellow-400">{user?.email || 'null'}</span>
              </div>
              <div className="flex justify-between">
                <span>User Role:</span>
                <span className="text-yellow-400">{user?.role || 'null'}</span>
              </div>
              <div className="flex justify-between">
                <span>Is Premium:</span>
                <span className="text-yellow-400">{user?.isPremium ? 'true' : 'false'}</span>
              </div>
            </div>
          </div>

          {/* Environnement */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-green-400">🌍 Environnement</h2>
            <div className="space-y-2 text-sm">
              <div><strong>NODE_ENV:</strong> {envCheck?.nodeEnv}</div>
              <div><strong>Has Supabase URL:</strong> {envCheck?.hasSupabaseUrl ? '✅' : '❌'}</div>
              <div><strong>Current URL:</strong> {envCheck?.url}</div>
              <div><strong>User Agent:</strong> {typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 50) + '...' : 'N/A'}</div>
            </div>
          </div>

          {/* Session Raw Data */}
          <div className="bg-gray-900 p-6 rounded-lg lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-yellow-400">📄 Session Data (Raw)</h2>
            <pre className="text-xs bg-black p-4 rounded overflow-auto max-h-64 whitespace-pre-wrap">
              {session ? JSON.stringify(session, null, 2) : 'Session vide'}
            </pre>
          </div>

          {/* Token Debug */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-purple-400">🔐 Token Debug</h2>
              <button
                onClick={checkToken}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-sm"
              >
                Vérifier Token
              </button>
            </div>
            {tokenInfo && (
              <pre className="text-xs bg-black p-4 rounded overflow-auto max-h-48 whitespace-pre-wrap">
                {JSON.stringify(tokenInfo, null, 2)}
              </pre>
            )}
          </div>

          {/* Database Debug */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-orange-400">🗄️ Database Debug</h2>
              <button
                onClick={checkDatabase}
                className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded text-sm"
              >
                Vérifier BDD
              </button>
            </div>
            {dbCheck && (
              <pre className="text-xs bg-black p-4 rounded overflow-auto max-h-48 whitespace-pre-wrap">
                {JSON.stringify(dbCheck, null, 2)}
              </pre>
            )}
          </div>

          {/* Test Accès Outils */}
          <div className="bg-gray-900 p-6 rounded-lg lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-red-400">🛠️ Test Accès Outils</h2>
              <button
                onClick={runToolTests}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
              >
                Tester Outils
              </button>
            </div>
            {toolTests.length > 0 && (
              <div className="space-y-2">
                {toolTests.map((test, index) => (
                  <div key={index} className="flex justify-between items-center bg-black p-3 rounded">
                    <span className="text-sm">{test.path}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      test.canAccess ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                      {test.error ? 'ERREUR' : test.canAccess ? 'ACCESSIBLE' : 'BLOQUÉ'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions de Debug */}
          <div className="bg-gray-900 p-6 rounded-lg lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">⚡ Actions Debug</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a
                href="/outils/icp-maker"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded text-center font-medium"
              >
                ICP Maker
              </a>
              <a
                href="/outils/content-system"
                className="bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded text-center font-medium"
              >
                Content System
              </a>
              <a
                href="/premium"
                className="bg-yellow-600 hover:bg-yellow-700 px-4 py-3 rounded text-center font-medium"
              >
                Page Premium
              </a>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-3 rounded text-center font-medium"
              >
                Reload Page
              </button>
            </div>
          </div>

          {/* Simulation Middleware */}
          <div className="bg-gray-900 p-6 rounded-lg lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-pink-400">🎭 Simulation Middleware</h2>
            <div className="space-y-3 text-sm">
              <div>
                <strong>Condition middleware:</strong>
                <code className="ml-2 bg-black px-2 py-1 rounded">
                  token?.isPremium === true || token?.role === 'ADMIN'
                </code>
              </div>
              <div className="space-y-1">
                <div>• token?.isPremium: <span className="text-yellow-400">{user?.isPremium?.toString() || 'undefined'}</span></div>
                <div>• token?.role: <span className="text-yellow-400">{user?.role || 'undefined'}</span></div>
                <div>• token?.role === 'ADMIN': <span className="text-yellow-400">{(user?.role === 'ADMIN').toString()}</span></div>
                <div>• <strong>Résultat final:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded ${
                    (user?.isPremium === true || user?.role === 'ADMIN') ? 'bg-green-600' : 'bg-red-600'
                  }`}>
                    {(user?.isPremium === true || user?.role === 'ADMIN') ? 'ACCÈS AUTORISÉ' : 'REDIRECTION /premium'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 