'use client';

import { useEffect } from 'react';

interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
}

export function usePerformanceTracking() {
  useEffect(() => {
    // Attendre que la page soit complètement chargée
    if (typeof window === 'undefined') return;

    const collectMetrics = () => {
      const metrics: PerformanceMetrics = {};

      // Collecter les Core Web Vitals
      if ('PerformanceObserver' in window) {
        // First Contentful Paint
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcp) {
            metrics.fcp = fcp.startTime;
          }
        });
        fcpObserver.observe({ entryTypes: ['paint'] });

        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            metrics.lcp = lastEntry.startTime;
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (entry.processingStart && entry.startTime) {
              metrics.fid = entry.processingStart - entry.startTime;
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          metrics.cls = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // Time to First Byte (via Navigation Timing)
        const navigationEntries = performance.getEntriesByType('navigation');
        if (navigationEntries.length > 0) {
          const nav = navigationEntries[0] as PerformanceNavigationTiming;
          metrics.ttfb = nav.responseStart - nav.requestStart;
        }

        // Envoyer les métriques après 5 secondes
        setTimeout(() => {
          sendMetrics(metrics);
          
          // Nettoyer les observers
          fcpObserver.disconnect();
          lcpObserver.disconnect();
          fidObserver.disconnect();
          clsObserver.disconnect();
        }, 5000);
      }
    };

    const sendMetrics = async (metrics: PerformanceMetrics) => {
      try {
        // Ne pas envoyer si aucune métrique n'est collectée
        if (Object.keys(metrics).length === 0) return;

        await fetch('/api/v2/performance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            metrics,
            url: window.location.pathname,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
          }),
        });

        console.log('📊 Performance metrics sent:', metrics);
      } catch (error) {
        console.error('❌ Failed to send performance metrics:', error);
      }
    };

    // Démarrer la collecte après le chargement
    if (document.readyState === 'complete') {
      collectMetrics();
    } else {
      window.addEventListener('load', collectMetrics);
      return () => window.removeEventListener('load', collectMetrics);
    }
  }, []);
}

export default usePerformanceTracking; 