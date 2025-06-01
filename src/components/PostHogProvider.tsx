"use client";

import { ReactNode } from 'react';

interface PostHogProviderProps {
  children: ReactNode;
}

export default function PostHogProvider({ children }: PostHogProviderProps) {
  // PostHog analytics désactivé - dépendance supprimée pour optimisation
  return <>{children}</>;
} 