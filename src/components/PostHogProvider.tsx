'use client';

import { ReactNode } from 'react';

interface PostHogProviderProps {
  children: ReactNode;
}

export default function PostHogProvider({ children }: PostHogProviderProps) {
  // Provider vide pour éviter les erreurs de compilation
  return <>{children}</>;
} 