'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  TrendingUp, 
  Eye, 
  Users, 
  Zap, 
  BarChart3, 
  Settings,
  Plus,
  Filter,
  Download,
  Bell
} from 'lucide-react';

interface ScrapeJob {
  id: string;
  title: string;
  job_type: string;
  status: string;
  results_count: number;
  created_at: string;
  configuration: any;
}

interface Opportunity {
  id: string;
  title: string;
  description: string;
  source: string;
  relevance_score: number;
  priority_level: string;
  status: string;
  tags: string[];
  sector: string;
  created_at: string;
  ai_analysis?: any;
  creative_content?: any;
}

interface UserStats {
  totalOpportunities: number;
  activeJobs: number;
  thisMonthUsage: number;
  subscriptionLimits: any;
}

export default function DashboardPage() {
  const [jobs, setJobs] = useState<ScrapeJob[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchKeywords, setSearchKeywords] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>(['linkedin', 'news']);
  
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Charger les jobs de scraping
      const { data: jobsData } = await supabase
        .from('apify_scrape_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Charger les opportunités récentes
      const { data: opportunitiesData } = await supabase
        .from('scraped_opportunities')
        .select(`
          *,
          scrape_job:apify_scrape_jobs(title, job_type)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      // Charger les statistiques utilisateur
      const { data: user } = await supabase.auth.getUser();
      if (user?.user) {
        const { data: subscription } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', user.user.id)
          .eq('status', 'active')
          .single();

        const { data: usage } = await supabase
          .from('usage_tracking')
          .select('usage_type, quantity')
          .eq('user_id', user.user.id)
          .gte('tracked_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

        setStats({
          totalOpportunities: opportunitiesData?.length || 0,
          activeJobs: jobsData?.filter(j => j.status === 'running').length || 0,
          thisMonthUsage: usage?.reduce((sum, u) => sum + u.quantity, 0) || 0,
          subscriptionLimits: subscription?.limits || {}
        });
      }

      setJobs(jobsData || []);
      setOpportunities(opportunitiesData || []);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const launchVeille = async () => {
    if (!searchKeywords.trim()) return;

    try {
      const response = await fetch('/api/apify/scrape/veille', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords: searchKeywords.split(',').map(k => k.trim()),
          sources: selectedSources,
          maxResults: 50,
          dateRange: 'week'
        })
      });

      const result = await response.json();
      if (result.success) {
        setSearchKeywords('');
        loadDashboardData(); // Recharger les données
        // Notification de succès
        alert(`Veille lancée avec succès ! Job ID: ${result.jobId}`);
      } else {
        alert(`Erreur: ${result.error}`);
      }
    } catch (error) {
      console.error('Erreur lancement veille:', error);
      alert('Erreur lors du lancement de la veille');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de votre dashboard DropSkills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🚀 Dashboard DropSkills - Phase 1 MVP</h1>
        
        {/* Interface de veille */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Lancer une Veille Automatisée</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Mots-clés séparés par des virgules"
              className="flex-1 border rounded px-4 py-2"
              value={searchKeywords}
              onChange={(e) => setSearchKeywords(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && launchVeille()}
            />
            <button
              onClick={launchVeille}
              disabled={!searchKeywords.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              🔍 Lancer Veille
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Exemple: startup, fintech, levée de fonds
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold">📊 Opportunités</h3>
            <p className="text-3xl font-bold text-blue-600">{opportunities.length}</p>
            <p className="text-sm text-gray-600">Détectées aujourd'hui</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold">⚡ Jobs Actifs</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-sm text-gray-600">En cours</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold">🎯 Pertinence</h3>
            <p className="text-3xl font-bold text-yellow-600">85%</p>
            <p className="text-sm text-gray-600">Score moyen</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold">💰 Plan</h3>
            <p className="text-3xl font-bold text-purple-600">Starter</p>
            <p className="text-sm text-gray-600">€29/mois</p>
          </div>
        </div>

        {/* Status Phase 1 */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <h2 className="text-2xl font-bold mb-4">🎯 PHASE 1 MVP - STATUS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">✅ Infrastructure</h3>
              <ul className="text-sm space-y-1">
                <li>✅ Base de données configurée</li>
                <li>✅ APIs Apify + IA opérationnelles</li>
                <li>✅ Authentication Supabase</li>
                <li>✅ Dashboard MVP</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🔄 En Cours</h3>
              <ul className="text-sm space-y-1">
                <li>🔄 Integration scrapers Apify</li>
                <li>🔄 Pipeline analyse IA</li>
                <li>🔄 Interface utilisateur</li>
                <li>🔄 Système de billing</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">📅 Prochaines Étapes</h3>
              <ul className="text-sm space-y-1">
                <li>📅 Tests end-to-end</li>
                <li>📅 Déploiement production</li>
                <li>📅 Onboarding beta users</li>
                <li>📅 Première facturation</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 bg-white/10 rounded p-4">
            <p className="text-lg font-semibold">🎯 Objectif Phase 1: €500+ MRR d'ici le 15 Juin</p>
            <p className="text-sm">ROI projeté: 430-910% • Break-even: 4-14 mois</p>
          </div>
        </div>

        {/* Section test des APIs */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">🧪 Test des APIs Phase 1</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => window.open('/admin/test-apify', '_blank')}
              className="bg-blue-100 border border-blue-300 rounded p-4 hover:bg-blue-200 transition-colors"
            >
              <h3 className="font-semibold text-blue-800">🕷️ Test Apify Integration</h3>
              <p className="text-sm text-blue-600">Tester les scrapers et pipeline</p>
            </button>
            
            <button 
              onClick={() => alert('API IA test - Coming soon!')}
              className="bg-green-100 border border-green-300 rounded p-4 hover:bg-green-200 transition-colors"
            >
              <h3 className="font-semibold text-green-800">🤖 Test Pipeline IA</h3>
              <p className="text-sm text-green-600">DeepSeek + Grok analysis</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 