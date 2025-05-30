'use client';

import React from 'react';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Package, Users, TrendingUp, Star, Zap, Target, Mail, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { Sparkles, CheckCircle, ShoppingCart, Rocket, Lock } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#18181b] text-white flex flex-col">
      {/* HERO */}
      <section className="max-w-3xl mx-auto text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          Revendez des <span className="text-[#ff0033]">Produits Digitaux</span> <br />
          <span className="text-2xl md:text-3xl font-bold block mt-2">Sans Devoir les Créer</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Accédez instantanément à des e-books, cours vidéo, templates et plus encore. <br />
          Rebrandez, revendez ou utilisez-les comme bon vous semble, sans investissement ni création longue.
        </p>
        <Link href="/auth/signin">
          <button className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200">
            Recevoir mon pack gratuit
          </button>
        </Link>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-gray-400">
          <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" /> Validé par +300 entrepreneurs</span>
          <span className="flex items-center gap-1"><Lock className="w-4 h-4 text-green-400" /> 100% de profit pour vous</span>
        </div>
      </section>

      {/* BENEFICES */}
      <section className="max-w-4xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center text-center">
          <Rocket className="w-10 h-10 text-[#ff0033] mb-2" />
          <h3 className="font-bold text-lg mb-1">Marge Élevée</h3>
          <p className="text-gray-400">Jusqu'à 95% de marge sur chaque vente, sans stock ni logistique.</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <ShoppingCart className="w-10 h-10 text-[#ff0033] mb-2" />
          <h3 className="font-bold text-lg mb-1">Stock Illimité</h3>
          <p className="text-gray-400">Vendez autant que vous voulez, sans rupture ni frais cachés.</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <Sparkles className="w-10 h-10 text-[#ff0033] mb-2" />
          <h3 className="font-bold text-lg mb-1">Livraison Instantanée</h3>
          <p className="text-gray-400">Vos clients reçoivent leurs produits immédiatement, 24/7.</p>
        </div>
      </section>

      {/* COMMENT CA MARCHE */}
      <section className="max-w-5xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Comment ça marche ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#18181b] rounded-xl p-6 flex flex-col items-center text-center shadow">
            <CheckCircle className="w-8 h-8 text-[#ff0033] mb-2" />
            <h4 className="font-bold mb-1">1. Choisissez</h4>
            <p className="text-gray-400">Accédez à un large catalogue de produits digitaux prêts à l'emploi.</p>
          </div>
          <div className="bg-[#18181b] rounded-xl p-6 flex flex-col items-center text-center shadow">
            <Users className="w-8 h-8 text-[#ff0033] mb-2" />
            <h4 className="font-bold mb-1">2. Personnalisez</h4>
            <p className="text-gray-400">Ajoutez votre branding, modifiez les textes, fixez vos prix.</p>
          </div>
          <div className="bg-[#18181b] rounded-xl p-6 flex flex-col items-center text-center shadow">
            <Rocket className="w-8 h-8 text-[#ff0033] mb-2" />
            <h4 className="font-bold mb-1">3. Vendez</h4>
            <p className="text-gray-400">Lancez votre business et encaissez vos premiers revenus en quelques clics.</p>
          </div>
        </div>
      </section>

      {/* TEMOIGNAGES */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Ils ont lancé leur business avec DropSkills</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#18181b] rounded-xl p-6 shadow flex flex-col items-center text-center">
            <Star className="w-6 h-6 text-yellow-400 mb-2" />
            <p className="text-gray-300 italic mb-2">"Une dinguerie ! J'ai rentabilisé mon investissement en 2 ventes. DropSkills The Best !"</p>
            <span className="text-sm text-gray-400">— Moussa I.</span>
          </div>
          <div className="bg-[#18181b] rounded-xl p-6 shadow flex flex-col items-center text-center">
            <Star className="w-6 h-6 text-yellow-400 mb-2" />
            <p className="text-gray-300 italic mb-2">"Impressionné par la simplicité. J'ai fait mes premières ventes dès la première semaine."</p>
            <span className="text-sm text-gray-400">— Stéphanie P.</span>
          </div>
          <div className="bg-[#18181b] rounded-xl p-6 shadow flex flex-col items-center text-center">
            <Star className="w-6 h-6 text-yellow-400 mb-2" />
            <p className="text-gray-300 italic mb-2">"Tout est automatisé, équipe réactive, super opportunité !"</p>
            <span className="text-sm text-gray-400">— Fatou S.</span>
          </div>
        </div>
      </section>

      {/* TARIFS */}
      <section className="max-w-5xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Des tarifs simples, clairs et taillés pour ton succès</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#18181b] rounded-xl p-6 shadow flex flex-col items-center text-center border border-[#333]">
            <h3 className="font-bold text-lg mb-2">Plan Gratuit</h3>
            <p className="text-3xl font-extrabold text-[#ff0033] mb-2">0€</p>
            <ul className="text-gray-400 text-sm mb-4 space-y-1">
              <li>Accès à vie</li>
              <li>Pack de 27 formations offertes</li>
              <li>Découverte sans engagement</li>
            </ul>
            <Link href="/auth/signin">
              <button className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 w-full">Tester gratuitement</button>
            </Link>
          </div>
          <div className="bg-[#18181b] rounded-xl p-6 shadow flex flex-col items-center text-center border-2 border-[#ff0033]">
            <h3 className="font-bold text-lg mb-2">Plan Pro</h3>
            <p className="text-3xl font-extrabold text-[#ff0033] mb-2">27€ <span className="text-base font-normal line-through text-gray-400 ml-1">47€</span> <span className="text-base font-normal">/mois</span></p>
            <ul className="text-gray-400 text-sm mb-4 space-y-1">
              <li>Accès immédiat à tout le catalogue</li>
              <li>Droit de revente PLR illimité</li>
              <li>Templates tunnels & emails</li>
              <li>Accès à la communauté</li>
            </ul>
            <Link href="/auth/signin">
              <button className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 w-full">Lancer mon activité</button>
            </Link>
          </div>
          <div className="bg-[#18181b] rounded-xl p-6 shadow flex flex-col items-center text-center border border-[#333]">
            <h3 className="font-bold text-lg mb-2">Plan Master</h3>
            <p className="text-3xl font-extrabold text-[#ff0033] mb-2">697€ <span className="text-base font-normal line-through text-gray-400 ml-1">1497€</span></p>
            <ul className="text-gray-400 text-sm mb-4 space-y-1">
              <li>Accès à vie</li>
              <li>Catalogue complet + MRR</li>
              <li>Outils IA illimités</li>
              <li>Accès à la communauté</li>
            </ul>
            <Link href="/auth/signin">
              <button className="bg-[#ff0033] hover:bg-[#cc0029] text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 w-full">Accéder au premium</button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-gray-500 text-xs py-8 border-t border-[#232323] mt-8">
        <div className="mb-2">2025 - DropSkills.fr - Tous droits réservés.</div>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/cgv" className="hover:underline">CGV</Link>
          <Link href="/mentions-legales" className="hover:underline">Mentions légales</Link>
          <Link href="/confidentialite" className="hover:underline">Confidentialité</Link>
        </div>
      </footer>
    </div>
  );
}

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  color: 'blue' | 'yellow' | 'green' | 'purple';
}

function StatsCard({ icon, title, value, description, color }: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/10 border-blue-500/20',
    yellow: 'bg-yellow-500/10 border-yellow-500/20',
    green: 'bg-green-500/10 border-green-500/20',
    purple: 'bg-purple-500/10 border-purple-500/20'
  };

  return (
    <div className={`${colorClasses[color]} rounded-xl p-6 border bg-[#111111]`}>
      <div className="flex items-center justify-between mb-4">
        {icon}
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <h3 className="font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}

interface ActivityItemProps {
  action: string;
  item: string;
  time: string;
  icon: React.ReactNode;
}

function ActivityItem({ action, item, time, icon }: ActivityItemProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#232323] last:border-0">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#1a1a1a] rounded-lg">
          {icon}
        </div>
        <div>
          <p className="font-medium text-white">{action}</p>
          <p className="text-sm text-gray-400">{item}</p>
        </div>
      </div>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  color: 'blue' | 'purple' | 'green';
  icon: React.ReactNode;
}

function QuickActionCard({ title, description, href, color, icon }: QuickActionCardProps) {
  const colorClasses = {
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    purple: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    green: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
  };

  return (
    <a
      href={href}
      className={`${colorClasses[color]} text-white p-4 rounded-lg transition-all duration-200 block hover:scale-105 hover:shadow-lg`}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm opacity-90">{description}</p>
    </a>
  );
}
