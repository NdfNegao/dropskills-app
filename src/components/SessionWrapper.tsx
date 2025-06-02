"use client";
import { SessionProvider } from "next-auth/react";

export default function SessionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider 
      refetchInterval={5 * 60} // Rafraîchir la session toutes les 5 minutes
      refetchOnWindowFocus={true} // Rafraîchir quand la fenêtre reprend le focus
    >
      {children}
    </SessionProvider>
  );
}