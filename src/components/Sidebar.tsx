'use client';

import { Home, Star, MessageSquarePlus, FileText, Bookmark, GraduationCap, Layout, FileCode, BrainCircuit, Calculator, Lock, Sparkles, BookOpen, User, Download, Gift, Users, LogOut, ChevronDown, ChevronUp, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = {
    name: 'cyril.iriebi',
    email: 'cyril.iriebi@gmail.com',
  };

  const isActive = (path: string) => pathname === path;

  // Fermer la sidebar au clic sur un lien (mobile)
  const handleLinkClick = () => setSidebarOpen(false);

  return (
    <>
      {/* Bouton hamburger mobile */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-[#111111] p-2 rounded-lg shadow-lg border border-[#232323]"
        aria-label="Ouvrir le menu"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={28} className="text-white" />
      </button>
      
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
          aria-label="Fermer le menu"
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`
          w-64 bg-[#111111] h-screen
          fixed left-0 top-0 pt-6 p-4 pb-6 flex flex-col justify-between text-[15px] overflow-y-auto
          z-50 transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:block
        `}
        tabIndex={-1}
        aria-label="Sidebar navigation"
      >
        {/* Logo */}
        <Link href="/" className="block mb-6" onClick={handleLinkClick}>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            DROP<span className="text-[#ff0033]">SKILLS</span>
          </h1>
        </Link>

        {/* Menu principal */}
        <div className="space-y-1 mb-6">
          <h2 className="text-[11px] font-semibold text-gray-400 uppercase mb-3 tracking-widest">MASTER LIBRARY</h2>
          <Link 
            href="/" 
            onClick={handleLinkClick}
            className={`flex items-center text-gray-300 hover:text-white py-2 px-3 rounded-lg transition-all duration-200 hover:bg-[#1a1a1a] group ${
              isActive('/') ? 'bg-[#1a1a1a] text-white' : ''
            }`}
          >
            <Home size={20} className={`mr-3 ${isActive('/') ? 'text-[#ff0033]' : 'group-hover:text-[#ff0033]'} transition-colors`} />
            <span className="group-hover:translate-x-1 transition-transform">Accueil</span>
          </Link>
          <Link 
            href="/populaire" 
            onClick={handleLinkClick}
            className={`flex items-center text-gray-300 hover:text-white py-2 px-3 rounded-lg transition-all duration-200 hover:bg-[#1a1a1a] group ${
              isActive('/populaire') ? 'bg-[#1a1a1a] text-white' : ''
            }`}
          >
            <Star size={20} className={`mr-3 ${isActive('/populaire') ? 'text-[#ff0033]' : 'group-hover:text-[#ff0033]'} transition-colors`} />
            <span className="group-hover:translate-x-1 transition-transform">Populaire</span>
          </Link>
          <Link 
            href="/demandes" 
            onClick={handleLinkClick}
            className={`flex items-center text-gray-300 hover:text-white py-2 px-3 rounded-lg transition-all duration-200 hover:bg-[#1a1a1a] group ${
              isActive('/demandes') ? 'bg-[#1a1a1a] text-white' : ''
            }`}
          >
            <MessageSquarePlus size={20} className={`mr-3 ${isActive('/demandes') ? 'text-[#ff0033]' : 'group-hover:text-[#ff0033]'} transition-colors`} />
            <span className="group-hover:translate-x-1 transition-transform">Demandes de Produits</span>
          </Link>
          <Link 
            href="/echantillons" 
            onClick={handleLinkClick}
            className={`flex items-center text-gray-300 hover:text-white py-2 px-3 rounded-lg transition-all duration-200 hover:bg-[#1a1a1a] group ${
              isActive('/echantillons') ? 'bg-[#1a1a1a] text-white' : ''
            }`}
          >
            <FileText size={20} className={`mr-3 ${isActive('/echantillons') ? 'text-[#ff0033]' : 'group-hover:text-[#ff0033]'} transition-colors`} />
            <span className="group-hover:translate-x-1 transition-transform">Échantillons</span>
          </Link>
          <Link 
            href="/sauvegardes" 
            onClick={handleLinkClick}
            className={`flex items-center text-gray-300 hover:text-white py-2 px-3 rounded-lg transition-all duration-200 hover:bg-[#1a1a1a] group ${
              isActive('/sauvegardes') ? 'bg-[#1a1a1a] text-white' : ''
            }`}
          >
            <Bookmark size={20} className={`mr-3 ${isActive('/sauvegardes') ? 'text-[#ff0033]' : 'group-hover:text-[#ff0033]'} transition-colors`} />
            <span className="group-hover:translate-x-1 transition-transform">Sauvegardés</span>
          </Link>
        </div>

        {/* Section Learning */}
        <div className="space-y-1 mb-6">
          <h2 className="text-[11px] font-semibold text-gray-400 uppercase mb-3 tracking-widest">LEARNING</h2>
          <Link 
            href="/universite" 
            onClick={handleLinkClick}
            className={`flex items-center text-gray-300 hover:text-white py-2 px-3 rounded-lg transition-all duration-200 hover:bg-[#1a1a1a] group ${
              isActive('/universite') ? 'bg-[#1a1a1a] text-white' : ''
            }`}
          >
            <GraduationCap size={20} className={`mr-3 ${isActive('/universite') ? 'text-[#ff0033]' : 'group-hover:text-[#ff0033]'} transition-colors`} />
            <span className="group-hover:translate-x-1 transition-transform">Université des Produits</span>
          </Link>
        </div>

        {/* Section Outils */}
        <div className="space-y-1 mb-6">
          <h2 className="text-[11px] font-extrabold tracking-widest text-gray-300 uppercase mb-3">OUTILS IA</h2>
          <Link 
            href="/outils" 
            onClick={handleLinkClick}
            className={`flex items-center text-gray-300 hover:text-white py-2 px-3 rounded-lg transition-all duration-200 hover:bg-[#1a1a1a] group ${
              isActive('/outils') ? 'bg-[#1a1a1a] text-white' : ''
            }`}
          >
            <Sparkles size={20} className={`mr-3 ${isActive('/outils') ? 'text-[#ff0033]' : 'group-hover:text-[#ff0033]'} transition-colors`} />
            <span className="group-hover:translate-x-1 transition-transform font-bold">Tous les Outils</span>
          </Link>
          <Link 
            href="/outils/titres" 
            onClick={handleLinkClick}
            className={`flex items-center text-gray-300 hover:text-white py-2 px-3 rounded-lg transition-all duration-200 hover:bg-[#1a1a1a] group ${
              isActive('/outils/titres') ? 'bg-[#1a1a1a] text-white' : ''
            }`}
          >
            <BookOpen size={20} className={`mr-3 ${isActive('/outils/titres') ? 'text-[#ff0033]' : 'group-hover:text-[#ff0033]'} transition-colors`} />
            <span className="group-hover:translate-x-1 transition-transform">Générateur de Titres</span>
          </Link>
        </div>

        {/* Footer latéral moderne */}
        <div className="w-full flex flex-col items-center mt-6 pb-2">
          {/* Bloc Upgrade */}
          <div className="w-11/12 bg-gradient-to-br from-[#1a1a1a] to-[#232323] rounded-2xl shadow-lg mb-3 p-3 flex flex-col items-center border border-[#222]">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={18} className="text-[#ff0033]" />
              <span className="font-bold text-white text-[15px]">Débloquer la bibliothèque</span>
            </div>
            <span className="text-[12px] text-gray-300 mb-2 text-center">Accède à tous les outils premium et contenus exclusifs.</span>
            <button className="w-full bg-[#ff0033] text-white py-2 rounded-lg flex items-center justify-center hover:bg-[#cc0029] transition-all duration-200 font-semibold text-[14px] shadow-md">
              <Lock size={14} className="mr-2" /> Débloquer / Upgrade
            </button>
          </div>
          {/* Bloc utilisateur */}
          <div className="w-11/12 bg-[#181818] rounded-2xl shadow flex flex-col items-center border border-[#232323]">
            <button onClick={() => setUserMenuOpen(v => !v)} className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#222] rounded-t-2xl transition">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#ff0033] flex items-center justify-center text-white font-bold text-[15px]">C</div>
                <div className="flex flex-col items-start">
                  <span className="font-bold text-white text-[14px]">{user.name}</span>
                  <span className="text-[11px] text-gray-400">{user.email}</span>
                </div>
              </div>
              {userMenuOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>
            {userMenuOpen && (
              <div className="w-full px-3 pb-2 pt-1 flex flex-col gap-2 border-t border-[#232323] bg-[#191919] rounded-b-2xl animate-fade-in">
                <button className="flex items-center gap-2 text-[13px] text-white hover:text-[#ff0033] transition"><Sparkles size={14} /> Débloquer tous les produits</button>
                <button className="flex items-center gap-2 text-[13px] text-white hover:text-[#ff0033] transition"><Users size={14} /> Devenir affilié</button>
                <button className="flex items-center gap-2 text-[13px] text-white hover:text-[#ff0033] transition"><Gift size={14} /> Obtenir un cadeau</button>
                <Link href="/compte" onClick={handleLinkClick} className="flex items-center gap-2 text-[13px] text-white hover:text-[#ff0033] transition"><User size={14} /> Mon compte</Link>
                <button className="flex items-center gap-2 text-[13px] text-white hover:text-[#ff0033] transition"><LogOut size={14} /> Déconnexion</button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
} 