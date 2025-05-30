import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "../components/SessionWrapper";
import Script from "next/script";
import { SavedProductsProvider } from "@/context/SavedProductsContext";
import PageTransitionClient from "@/components/PageTransitionClient";
import PostHogProvider from "@/components/PostHogProvider";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import PerformanceTracker from '@/components/PerformanceTracker';
import { LikedProductsProvider } from '@/context/LikedProductsContext';

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dropskills - Formation & Outils IA pour Entrepreneurs",
  description: "Plateforme SaaS de formation et outils IA pour entrepreneurs. Schéma V2 ultra-simplifié.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-MPCVDJ2G');
            `,
          }}
        />
      </head>
      <body className={inter.className + " bg-black text-white min-h-screen"}>
        <PostHogProvider />
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MPCVDJ2G"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <SessionWrapper>
          <LikedProductsProvider>
            <SavedProductsProvider>
              <PageTransitionClient>
                {children}
              </PageTransitionClient>
            </SavedProductsProvider>
          </LikedProductsProvider>
        </SessionWrapper>
        
        {/* Analytics Scripts */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-7QK9KQKQKQ" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7QK9KQKQKQ');
          `}
        </Script>
        
        {/* Vercel Analytics & Performance Monitoring */}
        <Analytics />
        <SpeedInsights />
        <PerformanceTracker />
      </body>
    </html>
  );
}
