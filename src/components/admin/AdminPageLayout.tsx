'use client';
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardData {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
}

interface AdminPageLayoutProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  stats?: StatCardData[];
  actions?: React.ReactNode;
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
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              {icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
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
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm mt-1 flex items-center gap-1 ${getChangeColor()}`}>
              <span>{getChangeIcon()}</span>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-gray-400 ml-4">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}