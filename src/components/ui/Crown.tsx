'use client';

import React from 'react';
import { Crown as LucideCrown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CrownProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  color?: 'yellow' | 'white' | 'orange' | 'red';
  className?: string;
}

const sizeClasses = {
  xs: 'w-3 h-3 xs:w-4 xs:h-4 sm:w-4 sm:h-4',
  sm: 'w-4 h-4 xs:w-4 xs:h-4 sm:w-4 sm:h-4 md:w-5 md:h-5',
  md: 'w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 md:w-6 md:h-6',
  lg: 'w-5 h-5 xs:w-6 xs:h-6 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8',
  xl: 'w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10',
  '2xl': 'w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12'
};

const colorClasses = {
  yellow: 'text-yellow-400',
  white: 'text-white',
  orange: 'text-orange-600',
  red: 'text-[#ff0033]'
};

export function Crown({ 
  size = 'sm', 
  color = 'yellow', 
  className 
}: CrownProps) {
  return (
    <LucideCrown 
      className={cn(
        sizeClasses[size],
        colorClasses[color],
        'flex-shrink-0',
        className
      )} 
    />
  );
}

export default Crown;