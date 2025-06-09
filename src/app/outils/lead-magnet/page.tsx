'use client';

import React, { useState } from 'react';
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
      <LeadMagnetResult 
        results={results} 
        onBack={() => setResults(null)}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
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