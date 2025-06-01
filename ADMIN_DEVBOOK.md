# DevBook - Modernisation Section Admin DropSkills

## 📋 Plan de Développement

### Phase 1 : Architecture et APIs de Base (3-4 jours)
- [x] 1.1 Audit de l'existant
- [ ] 1.2 Connecter Dashboard aux vraies données
- [ ] 1.3 APIs manquantes (utilisateurs, packs)
- [ ] 1.4 Validation de données

### Phase 2 : Finalisation des Sections (2-3 jours)
- [ ] 2.1 Support client opérationnel
- [ ] 2.2 Demandes de produits
- [ ] 2.3 Gestion des affiliés

### Phase 3 : Tests et Qualité (1-2 jours)
- [ ] 3.1 Tests unitaires APIs
- [ ] 3.2 Tests d'intégration
- [ ] 3.3 Documentation technique

## 🎯 Objectifs par Phase

### Phase 1 - Fondations Solides
**Objectif :** Transformer les données statiques en données dynamiques réelles

**Livrable :** Dashboard et APIs principales opérationnelles

### Phase 2 - Complétude Fonctionnelle
**Objectif :** Toutes les sections admin fonctionnelles

**Livrable :** Interface admin 100% opérationnelle

### Phase 3 - Robustesse
**Objectif :** Code testé, documenté et maintenable

**Livrable :** Base de code robuste et évolutive

---

## 📚 Phase 1 : Architecture et APIs de Base

### 1.1 Architecture des Données

#### Modèles de Données Manquants

```typescript
// Types à créer dans src/types/admin.ts
interface DashboardStats {
  users: {
    total: number;
    active: number;
    new_this_month: number;
  };
  packs: {
    total: number;
    sold: number;
    revenue: number;
  };
  tools: {
    total: number;
    premium: number;
    usage_today: number;
  };
  activity: {
    percentage: number;
    trend: 'up' | 'down' | 'stable';
  };
}

interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  subscription_status: 'free' | 'premium' | 'enterprise';
  last_login?: string;
  is_active: boolean;
}

interface Pack {
  id: string;
  name: string;
  description: string;
  price: number;
  tools_included: string[];
  is_active: boolean;
  created_at: string;
  sales_count: number;
}
```

### 1.2 Connecter Dashboard aux Vraies Données

#### Étape 1.2.1 : API Dashboard Stats

**Fichier :** `src/app/api/admin/dashboard/stats/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Statistiques utilisateurs
    const { count: totalUsers } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: activeUsers } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { count: newUsers } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString());

    // Statistiques packs
    const { count: totalPacks } = await supabaseAdmin
      .from('packs')
      .select('*', { count: 'exact', head: true });

    const { data: packSales } = await supabaseAdmin
      .from('pack_purchases')
      .select('pack_id, price');

    const soldPacks = packSales?.length || 0;
    const revenue = packSales?.reduce((sum, sale) => sum + sale.price, 0) || 0;

    // Statistiques outils IA
    const { count: totalTools } = await supabaseAdmin
      .from('ai_tools')
      .select('*', { count: 'exact', head: true });

    const { count: premiumTools } = await supabaseAdmin
      .from('ai_tools')
      .select('*', { count: 'exact', head: true })
      .eq('is_premium', true);

    const today = new Date().toISOString().split('T')[0];
    const { count: usageToday } = await supabaseAdmin
      .from('ai_tool_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${today}T00:00:00`);

    // Calcul activité
    const { count: recentActivity } = await supabaseAdmin
      .from('ai_tool_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    const activityPercentage = totalUsers > 0 ? (recentActivity / totalUsers * 100) : 0;

    return NextResponse.json({
      users: {
        total: totalUsers || 0,
        active: activeUsers || 0,
        new_this_month: newUsers || 0
      },
      packs: {
        total: totalPacks || 0,
        sold: soldPacks,
        revenue
      },
      tools: {
        total: totalTools || 0,
        premium: premiumTools || 0,
        usage_today: usageToday || 0
      },
      activity: {
        percentage: Math.round(activityPercentage),
        trend: activityPercentage > 50 ? 'up' : activityPercentage > 25 ? 'stable' : 'down'
      }
    });
  } catch (error) {
    console.error('Erreur dashboard stats:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
```

#### Étape 1.2.2 : Modification du Dashboard

**Fichier :** `src/app/admin/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';
import { Users, Package, Bot, Activity, BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DashboardStats {
  users: { total: number; active: number; new_this_month: number };
  packs: { total: number; sold: number; revenue: number };
  tools: { total: number; premium: number; usage_today: number };
  activity: { percentage: number; trend: 'up' | 'down' | 'stable' };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const statsData = stats ? [
    {
      icon: <Users className="w-5 h-5" />,
      label: "Utilisateurs",
      value: stats.users.total.toLocaleString(),
      subValue: `${stats.users.active} actifs`,
      color: "text-blue-400"
    },
    {
      icon: <Package className="w-5 h-5" />,
      label: "Packs Vendus",
      value: stats.packs.sold.toLocaleString(),
      subValue: `${stats.packs.revenue.toLocaleString()}€`,
      color: "text-green-400"
    },
    {
      icon: <Bot className="w-5 h-5" />,
      label: "Outils IA",
      value: stats.tools.total.toString(),
      subValue: `${stats.tools.usage_today} utilisations`,
      color: "text-purple-400"
    },
    {
      icon: <Activity className="w-5 h-5" />,
      label: "Activité",
      value: `${stats.activity.percentage}%`,
      subValue: getTrendIcon(stats.activity.trend),
      color: "text-red-400"
    }
  ] : [];

  if (loading) {
    return (
      <AdminLayoutWithSidebar
        icon={<BarChart3 className="w-5 h-5" />}
        title="Dashboard Admin"
        subtitle="Chargement..."
        statsData={[]}
      >
        <div className="animate-pulse bg-gray-200 rounded-lg h-32"></div>
      </AdminLayoutWithSidebar>
    );
  }

  return (
    <AdminLayoutWithSidebar
      icon={<BarChart3 className="w-5 h-5" />}
      title="Dashboard Admin"
      subtitle="Vue d'ensemble de la plateforme DropSkills"
      statsData={statsData}
    >
      {/* Actions rapides avec navigation réelle */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-black mb-6">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a 
            href="/admin/utilisateurs"
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Users className="w-5 h-5 text-blue-600 mr-3" />
            <span className="text-blue-700 font-medium">Gérer les utilisateurs</span>
          </a>
          <a 
            href="/admin/packs/nouveau"
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Package className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-green-700 font-medium">Ajouter un pack</span>
          </a>
          <a 
            href="/admin/outils-ia"
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Bot className="w-5 h-5 text-purple-600 mr-3" />
            <span className="text-purple-700 font-medium">Configurer IA</span>
          </a>
        </div>
      </div>

      {/* Graphiques récents */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-black mb-4">Nouveaux utilisateurs</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.users.new_this_month}</p>
            <p className="text-gray-600 text-sm">Ce mois-ci</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-black mb-4">Revenus packs</h3>
            <p className="text-3xl font-bold text-green-600">{stats.packs.revenue.toLocaleString()}€</p>
            <p className="text-gray-600 text-sm">Total</p>
          </div>
        </div>
      )}
    </AdminLayoutWithSidebar>
  );
}
```

### 1.3 APIs Manquantes

#### API Utilisateurs

**Fichier :** `src/app/api/admin/users/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  subscription_status: z.enum(['free', 'premium', 'enterprise']).optional(),
  is_active: z.boolean().optional()
});

// GET : Liste des utilisateurs avec pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');

    let query = supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
    }

    if (status && status !== 'all') {
      query = query.eq('subscription_status', status);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query.range(from, to);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      users: data,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT : Mettre à jour un utilisateur
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    
    if (!userId) {
      return NextResponse.json({ error: 'ID utilisateur requis' }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = userSchema.partial().parse(body);

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(validatedData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
```

#### API Packs

**Fichier :** `src/app/api/admin/packs/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const packSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  tools_included: z.array(z.string()),
  is_active: z.boolean().optional().default(true)
});

// GET : Liste des packs
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('packs')
      .select(`
        *,
        pack_purchases(count)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Ajouter les statistiques de vente
    const packsWithStats = data.map(pack => ({
      ...pack,
      sales_count: pack.pack_purchases?.[0]?.count || 0
    }));

    return NextResponse.json(packsWithStats);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST : Créer un nouveau pack
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = packSchema.parse(body);

    const { data, error } = await supabaseAdmin
      .from('packs')
      .insert(validatedData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
```

### 1.4 Validation de Données

#### Schémas de Validation Centralisés

**Fichier :** `src/lib/validations/admin.ts`

```typescript
import { z } from 'zod';

// Schémas de base
export const idSchema = z.string().uuid();
export const emailSchema = z.string().email();
export const dateSchema = z.string().datetime();

// Schéma utilisateur
export const userSchema = z.object({
  id: idSchema.optional(),
  email: emailSchema,
  name: z.string().min(1).max(100).optional(),
  subscription_status: z.enum(['free', 'premium', 'enterprise']).default('free'),
  is_active: z.boolean().default(true),
  created_at: dateSchema.optional(),
  updated_at: dateSchema.optional()
});

// Schéma pack
export const packSchema = z.object({
  id: idSchema.optional(),
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  price: z.number().positive().max(10000),
  tools_included: z.array(z.string()).min(1),
  is_active: z.boolean().default(true),
  created_at: dateSchema.optional(),
  updated_at: dateSchema.optional()
});

// Schéma outil IA (amélioration de l'existant)
export const aiToolSchema = z.object({
  id: idSchema.optional(),
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  type: z.string().min(1),
  category: z.string().min(1),
  icon: z.string().min(1),
  color: z.string().min(1),
  is_premium: z.boolean().default(false),
  step: z.number().int().positive(),
  step_title: z.string().min(1).max(200),
  step_description: z.string().min(1).max(500),
  endpoint: z.string().url().optional().or(z.literal('')),
  model: z.string().min(1),
  temperature: z.number().min(0).max(2),
  max_tokens: z.number().int().positive().max(4000),
  system_prompt: z.string().min(1),
  created_at: dateSchema.optional(),
  updated_at: dateSchema.optional()
});

// Types TypeScript générés
export type User = z.infer<typeof userSchema>;
export type Pack = z.infer<typeof packSchema>;
export type AiTool = z.infer<typeof aiToolSchema>;

// Validateur helper
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}
```

---

## 📚 Phase 2 : Finalisation des Sections

### 2.1 Support Client Opérationnel

#### Base de Données Support

```sql
-- Table pour les tickets de support
CREATE TABLE support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to TEXT,
  response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_user_email ON support_tickets(user_email);
CREATE INDEX idx_support_tickets_created_at ON support_tickets(created_at);
```

#### API Support

**Fichier :** `src/app/api/admin/support/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { z } from 'zod';

const supportTicketSchema = z.object({
  user_email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).default('open'),
  assigned_to: z.string().optional(),
  response: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    let query = supabaseAdmin
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (priority && priority !== 'all') {
      query = query.eq('priority', priority);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = supportTicketSchema.parse(body);

    const { data, error } = await supabaseAdmin
      .from('support_tickets')
      .insert(validatedData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
```

### 2.2 Interface Support Mise à Jour

**Fichier :** `src/app/admin/support/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';
import { HeadphonesIcon, Clock, CheckCircle, AlertTriangle, User } from 'lucide-react';

interface SupportTicket {
  id: string;
  user_email: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  response?: string;
}

export default function AdminSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter]);

  const fetchTickets = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);

      const response = await fetch(`/api/admin/support?${params}`);
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Erreur chargement tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/support/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchTickets();
      }
    } catch (error) {
      console.error('Erreur mise à jour ticket:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const avgResponseTime = '2h 15min'; // À calculer réellement

  const statsData = [
    {
      title: "Tickets ouverts",
      value: openTickets.toString(),
      icon: <AlertTriangle size={24} />
    },
    {
      title: "En cours",
      value: inProgressTickets.toString(),
      icon: <Clock size={24} />
    },
    {
      title: "Résolus",
      value: tickets.filter(t => t.status === 'resolved').length.toString(),
      icon: <CheckCircle size={24} />
    },
    {
      title: "Temps moyen",
      value: avgResponseTime,
      icon: <HeadphonesIcon size={24} />
    }
  ];

  return (
    <AdminLayoutWithSidebar
      icon={<HeadphonesIcon size={24} />}
      title="Support Client"
      subtitle="Gestion des demandes et tickets de support"
      stats={statsData}
    >
      {/* Filtres */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">Tous les statuts</option>
            <option value="open">Ouvert</option>
            <option value="in_progress">En cours</option>
            <option value="resolved">Résolu</option>
            <option value="closed">Fermé</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">Toutes les priorités</option>
            <option value="urgent">Urgent</option>
            <option value="high">Élevée</option>
            <option value="medium">Moyenne</option>
            <option value="low">Faible</option>
          </select>
        </div>
      </div>

      {/* Liste des tickets */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Tickets de Support</h3>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(ticket.priority)}`}></div>
                        <h4 className="font-medium text-black">{ticket.subject}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <User className="w-4 h-4" />
                        <span>{ticket.user_email}</span>
                        <span>•</span>
                        <span>{new Date(ticket.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                      
                      <p className="text-gray-700 text-sm line-clamp-2">{ticket.message}</p>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      {ticket.status === 'open' && (
                        <button
                          onClick={() => updateTicketStatus(ticket.id, 'in_progress')}
                          className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                        >
                          Prendre en charge
                        </button>
                      )}
                      {ticket.status === 'in_progress' && (
                        <button
                          onClick={() => updateTicketStatus(ticket.id, 'resolved')}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                        >
                          Résoudre
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {tickets.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucun ticket trouvé
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayoutWithSidebar>
  );
}
```

---

## 📚 Phase 3 : Tests et Qualité

### 3.1 Tests Unitaires pour les APIs

#### Configuration des Tests

**Fichier :** `jest.config.js`

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/*.test.ts'
  ],
  collectCoverageFrom: [
    'src/app/api/**/*.ts',
    '!src/app/api/**/*.d.ts',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

**Fichier :** `jest.setup.js`

```javascript
import { jest } from '@jest/globals';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}));

// Variables d'environnement pour les tests
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
```

#### Tests APIs

**Fichier :** `src/app/api/admin/__tests__/dashboard.test.ts`

```typescript
import { GET } from '../dashboard/stats/route';
import { supabaseAdmin } from '@/lib/supabase';

// Mock Supabase
jest.mock('@/lib/supabase');
const mockSupabase = supabaseAdmin as jest.Mocked<typeof supabaseAdmin>;

describe('/api/admin/dashboard/stats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return dashboard statistics', async () => {
    // Mock des réponses Supabase
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          gte: jest.fn().mockResolvedValue({ count: 100 })
        })
      })
    } as any);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('users');
    expect(data).toHaveProperty('packs');
    expect(data).toHaveProperty('tools');
    expect(data).toHaveProperty('activity');
  });

  it('should handle database errors', async () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockRejectedValue(new Error('Database error'))
      })
    } as any);

    const response = await GET();

    expect(response.status).toBe(500);
  });
});
```

### 3.2 Documentation Technique

#### Documentation API

**Fichier :** `API_DOCUMENTATION.md`

```markdown
# Documentation API Admin - DropSkills

## Vue d'ensemble

Cette documentation couvre toutes les APIs d'administration de DropSkills.

### Base URL
```
/api/admin
```

### Authentification
Toutes les APIs admin nécessitent une authentification avec rôle administrateur.

## Endpoints

### Dashboard

#### GET /api/admin/dashboard/stats
Récupère les statistiques du dashboard.

**Réponse :**
```json
{
  "users": {
    "total": 1234,
    "active": 890,
    "new_this_month": 45
  },
  "packs": {
    "total": 12,
    "sold": 567,
    "revenue": 15600
  },
  "tools": {
    "total": 28,
    "premium": 12,
    "usage_today": 456
  },
  "activity": {
    "percentage": 78,
    "trend": "up"
  }
}
```

### Utilisateurs

#### GET /api/admin/users
Liste les utilisateurs avec pagination.

**Paramètres :**
- `page` (number, default: 1): Page actuelle
- `limit` (number, default: 20): Nombre d'éléments par page
- `search` (string): Recherche dans email/nom
- `status` (string): Filtrer par statut d'abonnement

**Réponse :**
```json
{
  "users": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1234,
    "pages": 62
  }
}
```

### Packs

#### GET /api/admin/packs
Liste tous les packs avec statistiques de vente.

#### POST /api/admin/packs
Crée un nouveau pack.

**Body :**
```json
{
  "name": "Pack Premium",
  "description": "Description du pack",
  "price": 99.99,
  "tools_included": ["tool1", "tool2"],
  "is_active": true
}
```

### Support

#### GET /api/admin/support
Liste les tickets de support.

**Paramètres :**
- `status` (string): Filtrer par statut
- `priority` (string): Filtrer par priorité

#### POST /api/admin/support
Crée un nouveau ticket.

#### PUT /api/admin/support/:id
Met à jour un ticket existant.

## Codes d'erreur

- `400` - Données invalides
- `401` - Non authentifié
- `403` - Accès refusé (non admin)
- `404` - Ressource non trouvée
- `500` - Erreur serveur

## Exemples de validation

Tous les endpoints utilisent Zod pour la validation des données :

```typescript
const userSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  subscription_status: z.enum(['free', 'premium', 'enterprise'])
});
```
```

## 🎯 Plan d'Exécution Recommandé

### Semaine 1 : Phase 1 (3-4 jours)
1. **Jour 1 :** Créer les APIs manquantes et la validation
2. **Jour 2 :** Connecter le dashboard aux vraies données
3. **Jour 3 :** Tests et debugging des nouvelles APIs
4. **Jour 4 :** Documentation et finalisation

### Semaine 2 : Phase 2 (2-3 jours)
1. **Jour 5 :** Support client fonctionnel
2. **Jour 6 :** Demandes de produits et affiliés
3. **Jour 7 :** Tests d'intégration et polish

### Semaine 3 : Phase 3 (1-2 jours)
1. **Jour 8 :** Tests unitaires complets
2. **Jour 9 :** Documentation technique finale

## 📋 Checklist de Validation

- [ ] Dashboard affiche des données réelles
- [ ] APIs utilisateurs/packs opérationnelles
- [ ] Support client fonctionnel
- [ ] Validation des données implémentée
- [ ] Tests unitaires passent
- [ ] Documentation à jour
- [ ] Interface responsive et accessible
- [ ] Gestion d'erreurs robuste
- [ ] Performance optimisée
- [ ] Sécurité validée

---

*Ce DevBook est un plan évolutif. N'hésitez pas à l'adapter selon les priorités business et les contraintes techniques.* 