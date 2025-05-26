'use client';

import { useState } from 'react';
import Sidebar from '../../../components/Sidebar';
import { BookOpen, Users, Sparkles, Type, Lock } from 'lucide-react';

const TONES = [
  { label: 'Accrocheur', value: 'catchy' },
  { label: 'Professionnel', value: 'professional' },
  { label: 'Inspirant', value: 'inspiring' },
  { label: 'Mystérieux', value: 'mysterious' },
  { label: 'Drôle', value: 'funny' },
];

export default function BookTitleGenerator() {
  const [subject, setSubject] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('catchy');
  const [keyword, setKeyword] = useState('');
  const [titles, setTitles] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    // Simulation de génération de titres
    setTimeout(() => {
      const base = subject || 'Votre sujet';
      const aud = audience ? ` pour ${audience}` : '';
      const key = keyword ? ` avec "${keyword}"` : '';
      const toneLabel = TONES.find(t => t.value === tone)?.label || '';
      setTitles([
        `${base}${aud} : Le guide ultime${key}`,
        `${base}${aud} : Secrets et stratégies${key}`,
        `Réussir dans ${base}${aud} (${toneLabel})${key}`,
        `${base}${aud} : 10 étapes pour exceller${key}`,
        `Tout savoir sur ${base}${aud}${key}`,
        `${base}${aud} : Les clés du succès${key}`
      ]);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      {/* Bannière */}
      <div className="bg-[#ff0033] text-white text-center py-2 text-sm relative z-10">
        🎉 Offre de lancement 2025 ➜ -50% sur le Plan Pro
      </div>
      <Sidebar />
      <main className="ml-64 p-8 relative z-10 flex flex-col items-center">
        {/* En-tête */}
        <div className="mb-12 text-center">
          <div className="flex items-center gap-3 justify-center mb-4">
            <BookOpen className="text-[#ff0033] w-8 h-8" />
            <h1 className="text-4xl font-bold text-white">Book Title Generator</h1>
          </div>
          <p className="text-xl text-gray-400">Générez des titres accrocheurs pour vos ebooks et guides digitaux</p>
        </div>
        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="w-full max-w-xl bg-[#111111] rounded-xl p-8 mb-10 border border-gray-800 flex flex-col gap-6">
          <div>
            <label className="block text-gray-400 mb-2">Sujet du livre</label>
            <div className="flex items-center bg-[#1a1a1a] rounded-lg px-4 py-2">
              <Type className="text-gray-500 w-5 h-5 mr-2" />
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="ex: Productivité, Marketing Digital..."
                className="bg-transparent text-white w-full focus:outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Public cible (optionnel)</label>
            <div className="flex items-center bg-[#1a1a1a] rounded-lg px-4 py-2">
              <Users className="text-gray-500 w-5 h-5 mr-2" />
              <input
                type="text"
                value={audience}
                onChange={e => setAudience(e.target.value)}
                placeholder="ex: Entrepreneurs, Freelances..."
                className="bg-transparent text-white w-full focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2">Ton</label>
              <select
                value={tone}
                onChange={e => setTone(e.target.value)}
                className="w-full bg-[#1a1a1a] text-white p-3 rounded-lg focus:outline-none"
              >
                {TONES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Mot-clé à inclure (optionnel)</label>
              <div className="flex items-center bg-[#1a1a1a] rounded-lg px-4 py-2">
                <Sparkles className="text-gray-500 w-5 h-5 mr-2" />
                <input
                  type="text"
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  placeholder="ex: IA, Succès, 2025..."
                  className="bg-transparent text-white w-full focus:outline-none"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={isGenerating}
            className={`w-full mt-4 py-3 rounded-lg font-semibold transition-colors ${
              isGenerating
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : 'bg-[#ff0033] text-white hover:bg-[#cc0029]'
            }`}
          >
            {isGenerating ? 'Génération en cours...' : 'Générer des titres'}
          </button>
        </form>
        {/* Résultats */}
        <div className="w-full max-w-2xl flex flex-col gap-4">
          {titles.length > 0 && (
            <>
              <h2 className="text-white text-xl font-semibold mb-2">Titres générés</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {titles.map((title, i) => (
                  <div key={i} className="bg-[#111111] border border-gray-800 rounded-xl p-4 flex items-center justify-between gap-2">
                    <span className="text-white font-medium">{title}</span>
                    <button
                      className="ml-2 px-3 py-1 bg-[#ff0033] text-white rounded hover:bg-[#cc0029] text-xs font-semibold"
                      onClick={() => navigator.clipboard.writeText(title)}
                    >
                      Copier
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        {/* Section Pro */}
        <div className="mt-12 bg-gradient-to-r from-[#ff0033] to-[#cc0029] rounded-xl p-8 w-full max-w-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Version Pro</h2>
              <p className="text-white/80">Générez des variantes, titres SEO, slogans, et plus encore…</p>
            </div>
            <button className="bg-white text-[#ff0033] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2" disabled>
              <Lock className="w-4 h-4 mr-1" /> Débloquer les Options Pro
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 