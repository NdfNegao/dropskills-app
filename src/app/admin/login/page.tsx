'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Identifiants invalides');
      } else {
        router.push('/admin');
      }
    } catch (error) {
      setError('Une erreur est survenue');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="bg-[#111111] p-8 rounded-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6">Administration DropSkills</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-gray-400 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1a1a1a] text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff0033]"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1a1a1a] text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff0033]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#ff0033] text-white py-3 rounded-lg hover:bg-[#cc0029] transition-colors"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
} 