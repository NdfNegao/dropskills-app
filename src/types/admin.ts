// Types pour l'administration DropSkills
export interface DashboardStats {
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

export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  subscription_status: 'free' | 'premium' | 'enterprise';
  last_login?: string;
  is_active: boolean;
}

export interface Pack {
  id: string;
  name: string;
  description: string;
  price: number;
  tools_included: string[];
  is_active: boolean;
  created_at: string;
  sales_count: number;
}

export interface SupportTicket {
  id: string;
  user_email: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  response?: string;
  created_at: string;
  updated_at: string;
}

export interface FeatureRequest {
  id: string;
  user_email: string;
  title: string;
  description: string;
  category: 'ai_tool' | 'ui_improvement' | 'new_feature' | 'integration' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'submitted' | 'under_review' | 'planned' | 'in_development' | 'completed' | 'rejected';
  votes: number;
  estimated_effort?: 'small' | 'medium' | 'large' | 'xl';
  target_version?: string;
  assigned_to?: string;
  business_value?: 'low' | 'medium' | 'high' | 'critical';
  technical_complexity?: 'low' | 'medium' | 'high' | 'complex';
  created_at: string;
  updated_at: string;
}

export interface AiToolLog {
  id: string;
  tool_id: string;
  user_id?: string;
  user_email?: string;
  tokens_used: number;
  cost_estimate: number;
  status: 'success' | 'error';
  created_at: string;
} 