'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { ArrowRight } from 'lucide-react';

export default function ComptePage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <LayoutWithSidebar>
      <div className="max-w-4xl mx-auto">
        {/* Header avec avatar et informations utilisateur */}
        <div className="bg-[#111111] rounded-xl p-8 border border-[#232323] mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#ff0033] flex items-center justify-center text-white font-bold text-2xl">
                C
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">cyril.iriebi</h1>
                <p className="text-gray-400">cyril.iriebi@gmail.com</p>
              </div>
            </div>
            <div className="bg-[#1a1a1a] border border-[#232323] rounded-lg px-4 py-2">
              <span className="text-white font-medium">Free Plan</span>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-[#111111] rounded-xl p-8 border border-[#232323]">
          <h2 className="text-2xl font-bold text-white mb-8">Account Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Full Name
              </label>
              <div className="text-white text-lg">
                cyril.iriebi
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email
              </label>
              <div className="text-white text-lg">
                cyril.iriebi@gmail.com
              </div>
            </div>

            {/* Subscription */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Subscription
              </label>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 border border-gray-400 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-400 rounded"></div>
                </div>
                <span className="text-white font-medium">Free Plan</span>
              </div>
              <p className="text-gray-400 text-sm">
                Upgrade to one of our paid plans to access more features.
              </p>
            </div>

            {/* Member Since */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Member Since
              </label>
              <div className="text-white text-lg">
                5/24/2025
              </div>
            </div>
          </div>

          {/* See Pricing Plans Button */}
          <button className="bg-[#ff0033] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors flex items-center gap-2">
            See Pricing Plans
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </LayoutWithSidebar>
  );
} 