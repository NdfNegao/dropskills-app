import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GROK_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: 'GROK_API_KEY manquante' 
      });
    }
    
    const apiKey = process.env.GROK_API_KEY;
    console.log('🔍 Diagnostic Grok API Key:', apiKey.substring(0, 15) + '...');
    
    // Test 1: Vérification format clé
    const keyFormat = {
      starts_with_xai: apiKey.startsWith('xai-'),
      length: apiKey.length,
      format_ok: apiKey.match(/^xai-[a-zA-Z0-9]{48,}$/)
    };
    
    // Test 2: Simple ping API
    const endpoints = [
      'https://api.x.ai/v1/models'
    ];
    
    // Test 3: Différents noms de modèles possibles
    const modelNames = [
      'grok-2',
      'grok-3',
      'grok-3',
      'grok-2-1212',
      'grok-3-mini'
    ];
    
    const results = {};
    
    // Test endpoint models d'abord
    for (const endpoint of endpoints) {
      try {
        const testResponse = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          }
        });
        
        results[endpoint] = {
          status: testResponse.status,
          ok: testResponse.ok,
          headers: Object.fromEntries(testResponse.headers.entries()),
          body: testResponse.ok ? await testResponse.json() : await testResponse.text()
        };
      } catch (error) {
        results[endpoint] = {
          error: error.message
        };
      }
    }
    
    // Test chaque nom de modèle
    for (const modelName of modelNames) {
      try {
        const testResponse = await fetch('https://api.x.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: modelName,
            messages: [{ role: 'user', content: 'Hi' }],
            max_tokens: 5
          })
        });
        
        results[`model_${modelName}`] = {
          status: testResponse.status,
          ok: testResponse.ok,
          body: testResponse.ok ? await testResponse.json() : await testResponse.text()
        };
      } catch (error) {
        results[`model_${modelName}`] = {
          error: error.message
        };
      }
    }
    
    return NextResponse.json({
      success: true,
      api_key_format: keyFormat,
      endpoint_tests: results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    });
  }
}