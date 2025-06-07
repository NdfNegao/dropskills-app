'use client';

import { useSession } from 'next-auth/react';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export default function DebugProdPage() {
  const { data: session, status } = useSession();
  const { user, canAccessPremium, isAdmin } = useAuth();
  const [dbCheck, setDbCheck] = useState<any>(null);

  const checkDatabase = async () => {
    try {
      const response = await fetch('/api/admin/users?email=cyril.iriebi@gmail.com');
      const result = await response.json();
      setDbCheck(result);
    } catch (error) {
      setDbCheck({ error: 'Erreur lors de la vérification' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🔧 Debug Production Vercel</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Environnement */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-blue-400">🌍 Environnement</h2>
            <div className="space-y-2 text-sm">
              <div><strong>Mode:</strong> {process.env.NODE_ENV}</div>
              <div><strong>URL actuelle:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</div>
              <div><strong>Timestamp:</strong> {new Date().toISOString()}</div>
            </div>
          </div>

          {/* Auth Status */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-yellow-400">🔐 Auth Status</h2>
            <div className="space-y-2 text-sm">
              <div><strong>Status:</strong> <span className={`px-2 py-1 rounded ${status === 'authenticated' ? 'bg-green-600' : 'bg-red-600'}`}>{status}</span></div>
              <div><strong>isAdmin:</strong> {isAdmin ? '✅ OUI' : '❌ NON'}</div>
              <div><strong>canAccessPremium:</strong> {canAccessPremium ? '✅ OUI' : '❌ NON'}</div>
              <div><strong>Email:</strong> {user?.email || 'null'}</div>
              <div><strong>Role:</strong> <span className={`px-2 py-1 rounded ${user?.role === 'ADMIN' ? 'bg-purple-600' : 'bg-gray-600'}`}>{user?.role || 'null'}</span></div>
              <div><strong>isPremium:</strong> {user?.isPremium ? '✅ OUI' : '❌ NON'}</div>
            </div>
          </div>

          {/* Session Data */}
          <div className="bg-gray-900 p-6 rounded-lg md:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-green-400">📄 Session Data</h2>
            <pre className="text-xs bg-black p-4 rounded overflow-auto max-h-64 whitespace-pre-wrap">
              {session ? JSON.stringify(session, null, 2) : 'Session vide'}
            </pre>
          </div>

          {/* Database Check */}
          <div className="bg-gray-900 p-6 rounded-lg md:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-purple-400">🗄️ Database Check</h2>
            <button
              onClick={checkDatabase}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-medium mb-4"
            >
              Vérifier BDD Supabase
            </button>
            
            {dbCheck && (
              <pre className="text-xs bg-black p-4 rounded overflow-auto max-h-64 whitespace-pre-wrap">
                {JSON.stringify(dbCheck, null, 2)}
              </pre>
            )}
          </div>

          {/* Middleware Test */}
          <div className="bg-gray-900 p-6 rounded-lg md:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-red-400">⚙️ Test Middleware</h2>
            <div className="space-y-3">
              <div className="text-sm">
                <strong>Simulation middleware conditions :</strong>
                <div className="mt-2 space-y-1">
                  <div>• <code>token?.isPremium</code>: {user?.isPremium ? '✅ true' : '❌ false'}</div>
                  <div>• <code>token?.role === 'ADMIN'</code>: {user?.role === 'ADMIN' ? '✅ true' : '❌ false'}</div>
                  <div>• <strong>Résultat attendu:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded ${(user?.isPremium || user?.role === 'ADMIN') ? 'bg-green-600' : 'bg-red-600'}`}>
                      {(user?.isPremium || user?.role === 'ADMIN') ? 'ACCÈS AUTORISÉ' : 'REDIRECTION /premium'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-300">Test direct d'accès aux outils :</p>
                <div className="space-x-2">
                  <a href="/outils/icp-generator" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-medium inline-block text-sm">
                    🎯 ICP Generator
                  </a>
                  <a href="/outils/content-system" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white font-medium inline-block text-sm">
                    📝 Content System
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-900 p-6 rounded-lg md:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-orange-400">🔄 Actions de Correction</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-300 mb-2">1. Forcer la déconnexion/reconnexion :</p>
                <a href="/api/auth/signout" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-medium inline-block">
                  🚪 Se déconnecter
                </a>
              </div>
              
              <div>
                <p className="text-sm text-gray-300 mb-2">2. Si les données sont incorrectes, vérifier les variables d'environnement Vercel</p>
                <p className="text-xs text-yellow-400">Les variables NEXTAUTH_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY doivent être identiques à votre .env.local</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 