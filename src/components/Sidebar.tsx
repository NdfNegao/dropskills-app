'use client';

import { Home, Star, MessageSquarePlus, FileText, Bookmark, GraduationCap, Layout, FileCode, BrainCircuit, Calculator, Lock, Sparkles, BookOpen, User, Download, Gift, Users, LogOut, ChevronDown, ChevronUp, Menu, Target, Rocket, FolderKanban, Mail, CalendarCheck, PenTool, Eye, TrendingUp, DollarSign, Palette } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(true);
  const user = {
    name: 'cyril.iriebi',
    email: 'cyril.iriebi@gmail.com',
  };

  const isActive = (path: string) => pathname === path;

  // Fermer la sidebar au clic sur un lien (mobile)
  const handleLinkClick = () => setSidebarOpen(false);

  const handleLogout = () => {
    // Logique de déconnexion
    router.push('/login');
  };

  const handleUnlockProducts = () => {
    router.push('/unlock-products');
  };

  const handleAffiliate = () => {
    router.push('/affiliate');
  };

  const handleGift = () => {
    router.push('/gift');
  };

  // Nouvelle organisation par catégories logiques
  const toolsCategories = [
    {
      id: 'strategy',
      title: "STRATÉGIE & ANALYSE",
      icon: <Target size={16} />,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      isPremium: true,
      tools: [
        { name: "ICP Maker", href: "/outils/icp-maker", icon: <Target size={16} />, isPremium: true },
        { name: "USP Maker", href: "/outils/usp-maker", icon: <Rocket size={16} />, isPremium: true },
        { name: "Agent Veille IA", href: "/outils/agent-veille", icon: <Eye size={16} />, isPremium: true }
      ]
    },
    {
      id: 'sales',
      title: "VENTE & CONVERSION",
      icon: <DollarSign size={16} />,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      isPremium: true,
      tools: [
        { name: "Générateur d'Offre", href: "/outils/generateur-offre", icon: <Sparkles size={16} />, isPremium: true },
        { name: "Tunnel Maker", href: "/outils/tunnel-maker", icon: <FolderKanban size={16} />, isPremium: true },
        { name: "Calculateur ROI", href: "/outils/calculateur", icon: <Calculator size={16} />, isPremium: true }
      ]
    },
    {
      id: 'email',
      title: "EMAIL MARKETING",
      icon: <Mail size={16} />,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      isPremium: true,
      tools: [
        { name: "CopyMoneyMail", href: "/outils/copymoneymail", icon: <Mail size={16} />, isPremium: true },
        { name: "Lead Magnet Creator", href: "/outils/lead-magnet", icon: <Users size={16} />, isPremium: true }
      ]
    },
    {
      id: 'content',
      title: "CONTENU & COPYWRITING",
      icon: <PenTool size={16} />,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      isPremium: false,
      tools: [
        { name: "Content System 90J", href: "/outils/content-system", icon: <CalendarCheck size={16} />, isPremium: true },
        { name: "Générateur de Titres", href: "/outils/titres", icon: <PenTool size={16} />, isPremium: false },
        { name: "Générateur de Descriptions", href: "/outils/descriptions", icon: <FileText size={16} />, isPremium: false }
      ]
    },
    {
      id: 'creation',
      title: "CRÉATION & DESIGN",
      icon: <Palette size={16} />,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/20",
      isPremium: true,
      tools: [
        { name: "PDF Rebrander", href: "/outils/pdf-rebrander", icon: <BookOpen size={16} />, isPremium: true }
      ]
    }
  ];

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

        {/* Section Outils IA - Nouvelle organisation */}
        <div className="space-y-1 mb-6 flex-1">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] font-extrabold tracking-widest text-gray-300 uppercase">OUTILS IA DROPSKILLS</h2>
            <button
              onClick={() => setToolsMenuOpen(!toolsMenuOpen)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {toolsMenuOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
          
          <Link 
            href="/outils" 
            onClick={handleLinkClick}
            className={`flex items-center text-gray-300 hover:text-white py-2 px-3 rounded-lg transition-all duration-200 hover:bg-[#1a1a1a] group ${
              isActive('/outils') ? 'bg-[#1a1a1a] text-white' : ''
            }`}
          >
            <Sparkles size={20} className={`mr-3 ${isActive('/outils') ? 'text-[#ff0033]' : 'group-hover:text-[#ff0033]'} transition-colors`} />
            <span className="group-hover:translate-x-1 transition-transform font-bold">📊 Tous les Outils IA</span>
          </Link>

          {toolsMenuOpen && (
            <div className="space-y-3 mt-3">
              {toolsCategories.map((category) => (
                <div key={category.id} className="space-y-2">
                  {/* En-tête de catégorie */}
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${category.bgColor} border ${category.borderColor}`}>
                    <span className={category.color}>
                      {category.icon}
                    </span>
                    <span className={`text-xs font-bold ${category.color} uppercase tracking-wide flex-1`}>
                      {category.title}
                    </span>
                    <div className="flex items-center gap-1">
                      {category.isPremium ? (
                        <span className="text-yellow-400 text-xs">👑</span>
                      ) : (
                        <span className="text-green-400 text-xs">🆓</span>
                      )}
                      <span className="text-xs text-gray-400">({category.tools.length})</span>
                    </div>
                  </div>
                  
                  {/* Outils de la catégorie */}
                  <div className="ml-4 space-y-1">
                    {category.tools.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={handleLinkClick}
                        className={`flex items-center text-gray-400 hover:text-white py-1.5 px-3 rounded-lg transition-all duration-200 hover:bg-[#1a1a1a] group text-sm ${
                          isActive(tool.href) ? 'bg-[#1a1a1a] text-white' : ''
                        }`}
                      >
                        <span className={`mr-2 ${isActive(tool.href) ? category.color : 'group-hover:' + category.color} transition-colors`}>
                          {tool.icon}
                        </span>
                        <span className="group-hover:translate-x-1 transition-transform flex-1">
                          {tool.name}
                        </span>
                        {tool.isPremium && (
                          <span className="text-yellow-400 text-xs">👑</span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
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
                <button onClick={handleUnlockProducts} className="flex items-center gap-2 text-[13px] text-white hover:text-[#ff0033] transition"><Sparkles size={14} /> Débloquer tous les produits</button>
                <button onClick={handleAffiliate} className="flex items-center gap-2 text-[13px] text-white hover:text-[#ff0033] transition"><Users size={14} /> Devenir affilié</button>
                <button onClick={handleGift} className="flex items-center gap-2 text-[13px] text-white hover:text-[#ff0033] transition"><Gift size={14} /> Obtenir un cadeau</button>
                <Link href="/compte" onClick={handleLinkClick} className="flex items-center gap-2 text-[13px] text-white hover:text-[#ff0033] transition"><User size={14} /> Mon compte</Link>
                <div className="border-t border-neutral-700 my-2"></div>
                <button onClick={handleLogout} className="flex items-center gap-2 text-[13px] text-white hover:text-[#ff0033] transition"><LogOut size={14} /> Déconnexion</button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
} 