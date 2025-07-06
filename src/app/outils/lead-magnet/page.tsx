'use client';

import React, { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import PremiumGuard from '@/components/auth/PremiumGuard';
import { LeadMagnetWizard } from '@/components/LeadMagnetWizard';
import { LeadMagnetFormData, LeadMagnetAnalysis } from '@/types/lead-magnet';
import LeadMagnetResult from '@/components/LeadMagnetResult';
import { Magnet, TrendingUp, Users, BarChart3, Copy, RefreshCw, Download, Eye, Gift, Lightbulb, Brain } from 'lucide-react';

function LeadMagnetGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [lastFormData, setLastFormData] = useState<LeadMagnetFormData | null>(null);

  // Charger les données sauvegardées au démarrage
  useEffect(() => {
    const savedResult = localStorage.getItem('dropskills_lead_magnet_data');
    const savedFormData = localStorage.getItem('dropskills_lead_magnet_form_data');
    
    if (savedResult && savedFormData) {
      try {
        setResults(JSON.parse(savedResult));
        setLastFormData(JSON.parse(savedFormData));
      } catch (error) {
        console.error('Erreur lors du chargement des données sauvegardées:', error);
        localStorage.removeItem('dropskills_lead_magnet_data');
        localStorage.removeItem('dropskills_lead_magnet_form_data');
      }
    }
  }, []);

  const handleGenerate = async (formData: LeadMagnetFormData) => {
    setLastFormData(formData);
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
      
      // Sauvegarder les données dans le localStorage
      localStorage.setItem('dropskills_lead_magnet_data', JSON.stringify(data));
      localStorage.setItem('dropskills_lead_magnet_form_data', JSON.stringify(formData));
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRestart = () => {
    setResults(null);
    setLastFormData(null);
    
    // Nettoyer le localStorage
    localStorage.removeItem('dropskills_lead_magnet_data');
    localStorage.removeItem('dropskills_lead_magnet_form_data');
  };

  if (results) {
    return (
      <LeadMagnetResult 
        results={results} 
        onBack={handleRestart}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-8">
      {/* Wizard Component */}
       <LeadMagnetWizard 
         onComplete={handleGenerate}
         isLoading={isGenerating}
       />
     </div>
  );
}

export default function LeadMagnetPage() {
  const stats = [
    {
      icon: <Magnet className="w-5 h-5" />,
      label: "Lead magnets",
      value: "9,847"
    },
    {
      icon: <Download className="w-5 h-5" />,
      label: "Téléchargements",
      value: "247K+"
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Conversion",
      value: "34.7%"
    },
    {
      icon: <Eye className="w-5 h-5" />,
      label: "Engagement",
      value: "4.8/5"
    }
  ];

  return (
    <ToolLayout toolId="lead-magnet" stats={stats}>
      <PremiumGuard>
        <LeadMagnetGenerator />
      </PremiumGuard>
    </ToolLayout>
  );
}