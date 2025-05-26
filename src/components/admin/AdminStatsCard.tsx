import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface AdminStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export default function AdminStatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp = true 
}: AdminStatsCardProps) {
  return (
    <div className="bg-[#111111] border border-[#232323] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-[#1a1a1a] rounded-lg">
          <Icon className="w-6 h-6 text-[#ff0033]" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${
            trendUp ? 'text-green-500' : 'text-red-500'
          }`}>
            {trendUp ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        {trend && (
          <p className={`text-sm ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
            {trend}
          </p>
        )}
      </div>
    </div>
  );
} 