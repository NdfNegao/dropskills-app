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

  const isPremium = true;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      className: "text-yellow-500",
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
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-2 rounded-xl border border-border hover:bg-background-secondary transition-all focus:outline-none focus:ring-2 focus:ring-primary/30"
        style={{ backgroundColor: 'var(--card)' }}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm border-2 border-border flex-shrink-0">
          {user.avatar_url ? (
            <Image 
              src={user.avatar_url} 
              alt={getDisplayName() || 'Utilisateur'} 
              className="w-full h-full rounded-full object-cover"
              width={32}
              height={32}
            />
          ) : (
            getInitials()
          )}
        </div>
        {/* Name + email */}
        <div className="text-left hidden md:block">
          <div className="flex items-center gap-1.5">
            <p className="text-foreground font-semibold text-sm leading-none">
              {getDisplayName()}
            </p>
            {isPremium && (
              <span className="px-1.5 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-[10px] font-bold text-gray-900">PRO</span>
            )}
          </div>
          <p className="text-muted-foreground text-xs mt-0.5">{user.email}</p>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-72 rounded-xl border border-border shadow-xl overflow-hidden z-50 animate-fade-in"
          style={{ backgroundColor: 'var(--card)' }}
        >
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center gap-3" style={{ backgroundColor: 'var(--background-secondary)' }}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-base shadow border-2 border-border flex-shrink-0">
              {user.avatar_url ? (
                <Image 
                  src={user.avatar_url} 
                  alt={getDisplayName() || 'Utilisateur'} 
                  className="w-full h-full rounded-full object-cover"
                  width={48}
                  height={48}
                />
              ) : (
                getInitials()
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-foreground font-semibold text-sm truncate">{getDisplayName()}</span>
                {isPremium && (
                  <span className="flex-shrink-0 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-[10px] font-bold text-gray-900">PRO</span>
                )}
              </div>
              <p className="text-muted-foreground text-xs truncate">{user.email}</p>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-background-secondary transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 ${item.className || "text-muted-foreground"} group-hover:text-foreground transition-colors`} />
                <span className="text-foreground/80 group-hover:text-foreground font-medium text-sm">{item.label}</span>
              </Link>
            ))}

            <div className="my-1 border-t border-border" />

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-2.5 w-full hover:bg-red-500/10 transition-colors group"
            >
              <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-red-500 transition-colors flex-shrink-0" />
              <span className="text-foreground/80 group-hover:text-red-500 font-medium text-sm">Déconnexion</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
