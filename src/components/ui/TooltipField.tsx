import React from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipFieldProps {
  label: string;
  tooltip: string;
  icon?: React.ComponentType<any>;
  children: React.ReactNode;
  required?: boolean;
}

export function TooltipField({ 
  label, 
  tooltip, 
  icon: Icon, 
  children, 
  required = false 
}: TooltipFieldProps) {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
        {required && <span className="text-red-400">*</span>}
        <div className="group relative">
          <HelpCircle className="w-4 h-4 text-gray-500 cursor-help hover:text-gray-400 transition-colors" />
          <div className="absolute bottom-6 left-0 bg-[#232323] text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg border border-[#333333] max-w-xs">
            {tooltip}
          </div>
        </div>
      </label>
      {children}
    </div>
  );
}

export default TooltipField;