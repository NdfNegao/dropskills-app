import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt = "Bonjour Claude, pouvez-vous confirmer que vous fonctionnez correctement ?" } = await req.json();
    
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { success: false, error: "ANTHROPIC_API_KEY non configurée" },
        { status: 400 }
      );
    }

    console.log('Testing Claude API with key:', process.env.ANTHROPIC_API_KEY.substring(0, 10) + '...');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    console.log('Claude API Response Status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.log('Claude API Error:', errorData);
      return NextResponse.json(
        { 
          success: false, 
          error: `Claude API Error: ${response.status}`,
          details: errorData
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Claude API Success:', data);
    
    return NextResponse.json({
      success: true,
      response: data.content[0].text,
      usage: data.usage,
      model: data.model,
      cost_estimate: ((data.usage?.input_tokens || 0) * 3.00 / 1000000 + (data.usage?.output_tokens || 0) * 15.00 / 1000000).toFixed(6),
      performance: {
        reasoning_model: 'claude-3.5-sonnet',
        model_type: 'claude-3.5-sonnet-20241022',
        use_case: 'Premium reasoning and analysis',
        endpoint: 'api.anthropic.com'
      }
    });

  } catch (error) {
    console.error('Erreur test Claude:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors du test Claude',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
} 