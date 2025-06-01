'use client';

import { ReactNode } from 'react';
import AdminLayoutWithSidebar from './AdminLayoutWithSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface AdminDashboardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  children: ReactNode;
  actions?: ReactNode;
}

export function StatCard({ title, value, icon: Icon, color, trend }: StatCardProps) {
  return (
    <Card className="bg-[#111] border-[#232323]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            {trend && (
              <p className={`text-xs ${
                trend.isPositive ? 'text-green-400' : 'text-red-400'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}% vs mois dernier
              </p>
            )}
          </div>
          <Icon className={`h-8 w-8 ${color.replace('text-', 'text-').replace('-400', '-400/60')}`} />
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminDashboard({ title, description, icon: Icon, children, actions }: AdminDashboardProps) {
  return (
    <AdminLayoutWithSidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Icon className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              {description && (
                <p className="text-gray-400 mt-1">{description}</p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>

        {/* Content */}
        {children}
      </div>
    </AdminLayoutWithSidebar>
  );
}

export default AdminDashboard;