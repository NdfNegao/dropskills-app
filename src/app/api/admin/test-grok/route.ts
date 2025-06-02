import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    
    if (!process.env.GROK_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: 'GROK_API_KEY manquante dans .env.local' 
      }, { status: 400 });
    }
    
    console.log('Testing Grok API with key:', process.env.GROK_API_KEY?.substring(0, 10) + '...');
    
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant créatif et informatif. Réponds de manière concise et utile.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'grok-3',
        stream: false,
        temperature: 0.8,
        max_tokens: 150
      }),
    });
    
    console.log('Grok API Response Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.log('Grok API Error:', errorData);
      
      return NextResponse.json({ 
        success: false, 
        error: `Grok API Error: ${response.status}`,
        details: errorData,
        debug: {
          url: 'https://api.x.ai/v1/chat/completions',
          status: response.status,
          headers: response.headers
        }
      }, { status: response.status });
    }
    
    const data = await response.json();
    console.log('Grok API Success:', data);
    
    return NextResponse.json({
      success: true,
      response: data.choices[0]?.message?.content || 'Pas de réponse',
      usage: data.usage,
      model: data.model || 'grok-3',
      cost_estimate: data.usage ? (data.usage.total_tokens * 2.0 / 1000000).toFixed(6) : 'N/A',
      performance: {
        creative_temperature: 0.8,
        model_type: 'grok-3',
        use_case: 'Creative content generation',
        endpoint: 'api.x.ai'
      }
    });
    
  } catch (error) {
    console.error('Erreur test Grok:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 