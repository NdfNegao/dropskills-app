import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Simuler la collecte de métriques de performance
    const performanceData = {
      timestamp: new Date().toISOString(),
      metrics: {
        fcp: Math.floor(Math.random() * 500) + 800, // 800-1300ms
        lcp: Math.floor(Math.random() * 700) + 1200, // 1200-1900ms
        fid: Math.floor(Math.random() * 50) + 20, // 20-70ms
        cls: (Math.random() * 0.05).toFixed(3), // 0-0.05
        ttfb: Math.floor(Math.random() * 100) + 120, // 120-220ms
      },
      optimizations: {
        edgeNetwork: true,
        compression: true,
        caching: true,
        imageOptimization: true,
        codeSplitting: true,
      },
      status: 'healthy',
      score: Math.floor(Math.random() * 10) + 90, // 90-100
    };

    // En production, ces données seraient sauvegardées en base
    console.log('📊 Performance Check:', performanceData);

    return NextResponse.json({
      success: true,
      data: performanceData,
      message: 'Performance metrics collected successfully'
    });

  } catch (error) {
    console.error('❌ Performance monitoring error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to collect performance metrics',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Recevoir des métriques de performance du client
    const clientMetrics = {
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      metrics: body.metrics,
      url: body.url,
      userId: body.userId || 'anonymous',
    };

    // En production, sauvegarder en base de données
    console.log('📈 Client Performance Metrics:', clientMetrics);

    return NextResponse.json({
      success: true,
      message: 'Client metrics received',
      timestamp: clientMetrics.timestamp
    });

  } catch (error) {
    console.error('❌ Client metrics error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process client metrics' 
      },
      { status: 500 }
    );
  }
} 