'use client';

import { useState } from 'react';
import Sidebar from '../../../components/Sidebar';
import { Target, User, Users, TrendingUp, Zap, Gift, Info } from 'lucide-react';

const PROFILES = [
  {
    label: 'Débutant',
    value: 'debutant',
    conversion: 0.02,
    avgPrice: 20,
    desc: 'Tu débutes dans la vente de produits digitaux. Objectif : premiers clients et premiers euros.'
  },
  {
    label: 'Actif Réseaux Sociaux',
    value: 'social',
    conversion: 0.04,
    avgPrice: 35,
    desc: 'Tu as une audience sur les réseaux et tu veux monétiser plus efficacement.'
  },
  {
    label: 'Créateur régulier',
    value: 'createur',
    conversion: 0.06,
    avgPrice: 50,
    desc: 'Tu vends déjà régulièrement et tu veux scaler tes revenus.'
  },
  {
    label: 'Tunnel + Ads',
    value: 'tunnel',
    conversion: 0.08,
    avgPrice: 70,
    desc: "Tu maîtrises l'automatisation, les tunnels de vente et la publicité."
  },
];

function getBadge(ventes: number) {
  if (ventes < 10) return { label: 'Starter', color: 'bg-yellow-400', icon: <Zap className="w-5 h-5" /> };
  if (ventes < 30) return { label: 'Pro', color: 'bg-orange-500', icon: <TrendingUp className="w-5 h-5" /> };
  return { label: 'Expert', color: 'bg-red-600', icon: <Users className="w-5 h-5" /> };
}

function getTip(profile: string, ventes: number) {
  if (profile === 'debutant') return "Commence par une offre irrésistible et récolte tes premiers avis clients !";
  if (profile === 'social') return "Utilise ta communauté pour faire des préventes et tester tes idées.";
  if (profile === 'createur') return "Automatise tes relances et propose des upsells pour booster ton panier moyen.";
  if (profile === 'tunnel') return "Optimise tes tunnels et investis dans la pub pour scaler rapidement.";
  return '';
}

export default function RevenueCalculator() {
  const [ventes, setVentes] = useState(5);
  const [profile, setProfile] = useState(PROFILES[0]);
  const [customPrice, setCustomPrice] = useState(profile.avgPrice);

  // Met à jour le prix moyen si le profil change
  const handleProfileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const p = PROFILES.find(p => p.value === e.target.value)!;
    setProfile(p);
    setCustomPrice(p.avgPrice);
  };

  // Calculs
  const revenuMensuel = ventes * customPrice;
  const revenuAnnuel = revenuMensuel * 12;
  const badge = getBadge(ventes);
  const tip = getTip(profile.value, ventes);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Bannière */}
      <div className="bg-[#ff0033] text-white text-center py-2 text-sm">
        🎉 Offre de lancement 2025 ➜ -50% sur le Plan Pro
      </div>
      <Sidebar />
      <main className="ml-64 p-8 flex flex-col items-center">
        <div className="w-full max-w-xl bg-white/95 rounded-2xl shadow-xl p-8 border border-gray-200 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <Target className="text-[#ff0033] w-8 h-8" />
            <h1 className="text-3xl font-bold text-[#0a0a0a]">Simulateur de Gains DropSkills</h1>
          </div>
          {/* Slider ventes */}
          <label className="block font-semibold text-[#0a0a0a] mb-2">Combien de ventes mensuelles tu vises ?</label>
          <input
            type="range"
            min={1}
            max={100}
            value={ventes}
            onChange={e => setVentes(Number(e.target.value))}
            className="w-full accent-[#ff0033] mb-2"
          />
          <div className="text-center text-lg font-bold text-[#ff0033] mb-4">{ventes} vente{ventes > 1 ? 's' : ''}/mois</div>
          {/* Profil */}
          <label className="block font-semibold text-[#0a0a0a] mb-2">Ton profil</label>
          <select
            value={profile.value}
            onChange={handleProfileChange}
            className="w-full bg-[#f5f5f5] border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:outline-none"
          >
            {PROFILES.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          <div className="text-gray-500 text-sm mb-4">{profile.desc}</div>
          {/* Prix moyen */}
          <label className="block font-semibold text-[#0a0a0a] mb-2">Prix moyen de ton produit (€)</label>
          <input
            type="number"
            min={1}
            max={1000}
            value={customPrice}
            onChange={e => setCustomPrice(Number(e.target.value))}
            className="w-full bg-[#f5f5f5] border border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none"
          />
          {/* Résultats */}
          <div className="bg-[#111111] rounded-xl p-6 mb-6 flex flex-col gap-2 items-center">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-white font-semibold text-sm flex items-center gap-2 ${badge.color}`}>{badge.icon} {badge.label} MRR</span>
            </div>
            <div className="flex items-center gap-2 text-white text-lg">
              <span>💶 Revenu mensuel :</span>
              <span className="font-bold">{revenuMensuel.toLocaleString()} €</span>
            </div>
            <div className="flex items-center gap-2 text-white text-lg">
              <span>📅 Revenu annuel :</span>
              <span className="font-bold">{revenuAnnuel.toLocaleString()} €</span>
            </div>
          </div>
          {/* Astuce */}
          <div className="flex items-center gap-2 bg-[#ff0033]/10 border-l-4 border-[#ff0033] text-[#ff0033] p-4 rounded mb-6">
            <Info className="w-5 h-5" />
            <span>{tip}</span>
          </div>
          {/* Bouton */}
          <button className="w-full bg-[#ff0033] text-white py-3 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors flex items-center justify-center gap-2 text-lg">
            <Gift className="w-5 h-5 mr-1" /> Recevoir mon plan d'action personnalisé
          </button>
        </div>
      </main>
    </div>
  );
} 