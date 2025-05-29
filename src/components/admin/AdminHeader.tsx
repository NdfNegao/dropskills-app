'use client';

import { signOut } from 'next-auth/react';
import { Bell, LogOut, User, Settings } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/router';

interface AdminHeaderProps {
  user: {
    id: string;
    role: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/auth/signin");
  };

  return (
    <header className="bg-[#111111] border-b border-[#232323] px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Administration</h2>
          <p className="text-sm text-gray-400">Gestion de la plateforme DropSkills</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#ff0033] rounded-full text-xs"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors"
            >
              <div className="w-8 h-8 bg-[#ff0033] rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                </span>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">{displayName}</p>
                <p className="text-xs text-gray-400">{user.role}</p>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-[#232323] rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#232323] rounded">
                    <User className="w-4 h-4" />
                    Mon profil
                  </button>
                  <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#232323] rounded">
                    <Settings className="w-4 h-4" />
                    Paramètres
                  </button>
                  <hr className="my-2 border-[#232323]" />
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-[#232323] rounded"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 