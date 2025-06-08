'use client';

import React, { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import PremiumGuard from '@/components/auth/PremiumGuard';
import { LeadMagnetWizard, LeadMagnetFormData } from '@/components/LeadMagnetWizard';
import LeadMagnetResult from '@/components/LeadMagnetResult';
import { Gift, Users, TrendingUp, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeadMagnetGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showLogs, setShowLogs] = useState(false);

  const handleGenerate = async (formData: LeadMagnetFormData) => {
    setIsGenerating(true);
    setShowLogs(true);
    
    try {
      const response = await fetch('/api/generate-lead-magnet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (results) {
    return (
      <ToolLayout
        title="Générateur de Lead Magnet"
        description="Créez des lead magnets irrésistibles qui convertissent vos visiteurs en prospects qualifiés"
        icon={<Gift className="w-8 h-8" />}
      >
        <PremiumGuard>
          <LeadMagnetResult 
            results={results} 
            onBack={() => setResults(null)}
          />
        </PremiumGuard>
      </ToolLayout>
    );
  }
  return (
    <ToolLayout
      title="Générateur de Lead Magnet"
      description="Créez des lead magnets irrésistibles qui convertissent vos visiteurs en prospects qualifiés"
      icon={<Gift className="w-8 h-8" />}
    >
      <PremiumGuard>
        <div className="max-w-6xl mx-auto">
          {/* Header avec stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#111111] rounded-xl p-6 border border-[#232323]"
            >
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-blue-400" />
                <h3 className="text-white font-semibold">Conversion</h3>
              </div>
              <p className="text-2xl font-bold text-blue-400">+340%</p>
              <p className="text-gray-400 text-sm">Taux de conversion moyen</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#111111] rounded-xl p-6 border border-[#232323]"
            >
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <h3 className="text-white font-semibold">ROI</h3>
              </div>
              <p className="text-2xl font-bold text-green-400">850%</p>
              <p className="text-gray-400 text-sm">Retour sur investissement</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#111111] rounded-xl p-6 border border-[#232323]"
            >
              <div className="flex items-center gap-3 mb-2">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                <h3 className="text-white font-semibold">Leads</h3>
              </div>
              <p className="text-2xl font-bold text-yellow-400">12K+</p>
              <p className="text-gray-400 text-sm">Générés ce mois</p>
            </motion.div>
          </div>

          {/* Wizard Component */}
           <LeadMagnetWizard 
             onComplete={handleGenerate}
             isLoading={isGenerating}
           />
         </div>
       </PremiumGuard>
     </ToolLayout>
   );
 }