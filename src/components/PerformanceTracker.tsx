'use client';

import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';

export default function PerformanceTracker() {
  usePerformanceTracking();
  return null; // Ce composant ne rend rien, il fait juste du tracking
} 