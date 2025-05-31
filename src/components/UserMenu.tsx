"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  User, 
  ChevronDown, 
  Lock, 
  Users, 
  Gift, 
  Settings, 
  LogOut,
  Sparkles
} from "lucide-react";
import Link from "next/link";

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
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors"
      >
        {/* Avatar ou initiales */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] flex items-center justify-center text-white font-semibold">
          {user.avatar_url ? (
            <img 
              src={user.avatar_url} 
              alt={getDisplayName()} 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials()
          )}
        </div>
        
        {/* Nom et email */}
        <div className="text-left hidden md:block">
          <p className="text-white font-medium text-sm">{getDisplayName()}</p>
          <p className="text-gray-400 text-xs">{user.email}</p>
        </div>
        
        {/* Chevron */}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Menu dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-[#111111] rounded-xl border border-[#232323] shadow-xl overflow-hidden z-50">
          {/* Header du menu */}
          <div className="p-4 border-b border-[#232323]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] flex items-center justify-center text-white font-semibold">
                {user.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={getDisplayName()} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials()
                )}
              </div>
              <div>
                <p className="text-white font-medium">{getDisplayName()}</p>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Liens du menu */}
          <div className="py-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#1a1a1a] transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className={`w-5 h-5 ${item.className || "text-gray-400"} group-hover:text-[#00D2FF]`} />
                <span className="text-gray-300 group-hover:text-white">{item.label}</span>
              </Link>
            ))}
            
            {/* Séparateur */}
            <div className="my-2 border-t border-[#232323]" />
            
            {/* Déconnexion */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 w-full hover:bg-[#1a1a1a] transition-colors group"
            >
              <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
              <span className="text-gray-300 group-hover:text-red-400">Déconnexion</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 