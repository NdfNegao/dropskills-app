import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.APIFY_API_TOKEN) {
      return NextResponse.json({ 
        success: false, 
        error: 'APIFY_API_TOKEN manquant dans .env.local' 
      }, { status: 400 });
    }
    
    // Test simple : récupérer les informations du compte
    const response = await fetch('https://api.apify.com/v2/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.APIFY_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ 
        success: false, 
        error: `Apify API Error: ${response.status}`,
        details: errorData
      }, { status: response.status });
    }
    
    const userData = await response.json();
    
    // Test listing des actors disponibles
    const actorsResponse = await fetch('https://api.apify.com/v2/acts?limit=5', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.APIFY_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    
    const actorsData = actorsResponse.ok ? await actorsResponse.json() : null;
    
    return NextResponse.json({
      success: true,
      user: {
        username: userData.data?.username,
        email: userData.data?.email,
        plan: userData.data?.plan,
        usageQuota: userData.data?.usageQuota
      },
      actors_available: actorsData?.data?.count || 'Non accessible',
      sample_actors: actorsData?.data?.items?.slice(0, 3)?.map((actor: any) => ({
        name: actor.name,
        id: actor.id,
        description: actor.description
      })) || [],
      connection_test: 'OK - Apify API accessible'
    });
    
  } catch (error) {
    console.error('Erreur test Apify:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 