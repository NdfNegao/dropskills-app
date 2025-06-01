'use client';
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StatCardData {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
}

interface ActionData {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  icon?: React.ReactNode;
  loading?: boolean;
}

interface AdminPageLayoutProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  stats?: StatCardData[];
  actions?: ActionData[] | React.ReactNode;
  children: React.ReactNode;
}

export default function AdminPageLayout({
  icon,
  title,
  subtitle,
  stats = [],
  actions,
  children
}: AdminPageLayoutProps) {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-lg text-gray-700">
              {icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black">{title}</h1>
              {subtitle && (
                <p className="text-gray-600 mt-1 text-lg">{subtitle}</p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {Array.isArray(actions) ? (
                actions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={action.onClick}
                    variant={action.variant || 'default'}
                    disabled={action.loading}
                    className="flex items-center gap-2"
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                ))
              ) : (
                actions
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {stats.length > 0 && (
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 px-6 pb-6">
        {children}
      </div>
    </div>
  );
}

function StatCard({ title, value, change, changeType = 'neutral', icon }: StatCardData) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return '↗';
      case 'negative':
        return '↘';
      default:
        return '→';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-black">{value}</p>
          {change && (
            <p className={`text-sm mt-2 flex items-center gap-1 ${getChangeColor()}`}>
              <span>{getChangeIcon()}</span>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-gray-500 ml-4">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}