"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  ChevronDown, 
  Users, 
  Gift, 
  Settings, 
  LogOut,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import Image from 'next/image';

interface UserMenuProps {
  user: {
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    avatar_url?: string | null;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Simuler premium (à remplacer par user.isPremium si dispo)
  const isPremium = true;

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Obtenir les initiales de l'utilisateur
  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    } else if (user.firstName) {
      return user.firstName.substring(0, 2).toUpperCase();
    } else if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  // Obtenir le nom complet
  const getDisplayName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    }
    return user.email.split("@")[0];
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/auth/signin");
  };

  const menuItems = [
    {
      icon: Sparkles,
      label: "Débloquer tous les produits",
      href: "/unlock-products",
      className: "text-yellow-400",
    },
    {
      icon: Users,
      label: "Devenir affilié",
      href: "/affiliate",
      className: "",
    },
    {
      icon: Gift,
      label: "Obtenir un cadeau",
      href: "/gift",
      className: "",
    },
    {
      icon: Settings,
      label: "Mon compte",
      href: "/compte",
      className: "",
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Bouton du menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-xl bg-gradient-to-r from-[#232a3a]/60 to-[#1a1a1a]/80 shadow-lg hover:from-[#2e3a5a]/80 hover:to-[#232323]/90 transition-all focus:outline-none focus:ring-2 focus:ring-[#00D2FF]"
        aria-haspopup="true"
        aria-expanded={isOpen}
        tabIndex={0}
      >
        {/* Avatar ou initiales */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] flex items-center justify-center text-white font-semibold shadow-md border-2 border-[#232a3a]">
          {user.avatar_url ? (
            <Image 
              src={user.avatar_url} 
              alt={getDisplayName() || 'Utilisateur'} 
              className="w-full h-full rounded-full object-cover"
              width={40}
              height={40}
            />
          ) : (
            getInitials()
          )}
        </div>
        {/* Nom, email, badge premium */}
        <div className="text-left hidden md:block">
          <div className="flex items-center gap-2">
            <p className="text-white font-semibold text-sm tracking-tight">
              {getDisplayName()}
            </p>
            {isPremium && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-xs font-bold text-gray-900 shadow border border-yellow-300 animate-pulse">Premium</span>
            )}
          </div>
          <p className="text-gray-400 text-xs">{user.email}</p>
        </div>
        {/* Chevron */}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Menu dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gradient-to-br from-[#232a3a]/80 to-[#181c22]/90 backdrop-blur-xl rounded-2xl border border-[#2e3a5a]/60 shadow-2xl overflow-hidden z-50 animate-fade-in">
          {/* Header du menu */}
          <div className="p-5 border-b border-[#232a3a]/60 flex items-center gap-4 bg-gradient-to-r from-[#232a3a]/60 to-[#1a1a1a]/80">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] flex items-center justify-center text-white font-bold text-lg shadow border-2 border-[#232a3a]">
              {user.avatar_url ? (
                <Image 
                  src={user.avatar_url} 
                  alt={getDisplayName() || 'Utilisateur'} 
                  className="w-full h-full rounded-full object-cover"
                  width={56}
                  height={56}
                />
              ) : (
                getInitials()
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-semibold text-base">{getDisplayName()}</span>
                {isPremium && (
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-xs font-bold text-gray-900 shadow border border-yellow-300 animate-pulse">Premium</span>
                )}
              </div>
              <p className="text-gray-400 text-xs">{user.email}</p>
            </div>
          </div>

          {/* Liens du menu */}
          <div className="py-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-5 py-3 rounded-lg group transition-all focus:outline-none focus:ring-2 focus:ring-[#00D2FF] hover:bg-gradient-to-r hover:from-[#232a3a]/60 hover:to-[#232323]/80 ${item.className ? '' : 'hover:scale-[1.03]'}`}
                onClick={() => setIsOpen(false)}
                tabIndex={0}
              >
                <item.icon className={`w-5 h-5 ${item.className || "text-gray-400"} group-hover:text-[#00D2FF] transition-colors`} />
                <span className="text-gray-200 group-hover:text-white font-medium text-sm tracking-tight">{item.label}</span>
              </Link>
            ))}
            {/* Séparateur */}
            <div className="my-2 border-t border-[#232a3a]/60" />
            {/* Déconnexion */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-5 py-3 w-full rounded-lg hover:bg-gradient-to-r hover:from-[#2e3a5a]/60 hover:to-[#232323]/80 transition-all group focus:outline-none focus:ring-2 focus:ring-red-400"
              tabIndex={0}
            >
              <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
              <span className="text-gray-300 group-hover:text-red-400 font-medium text-sm">Déconnexion</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}