require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const https = require('https');
const http = require('http');

const APIs = {
  'Supabase': {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY,
    test: async () => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return { status: 'ERREUR', message: 'Variables manquantes' };
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
          headers: {
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
          }
        });
        return response.ok ? 
          { status: 'FONCTIONNEL', message: `Status: ${response.status}` } : 
          { status: 'ERREUR', message: `HTTP ${response.status}` };
      } catch (error) {
        return { status: 'ERREUR', message: error.message };
      }
    }
  },
  'OpenAI': {
    url: 'https://api.openai.com/v1/chat/completions',
    key: process.env.OPENAI_API_KEY,
    test: async () => {
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key') {
        return { status: 'NON CONFIGURÉ', message: 'Clé API manquante ou placeholder' };
      }
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: 'Test' }],
            max_tokens: 5
          })
        });
        if (response.ok) {
          return { status: 'FONCTIONNEL', message: 'API accessible' };
        } else {
          const error = await response.json();
          return { status: 'ERREUR', message: error.error?.message || `HTTP ${response.status}` };
        }
      } catch (error) {
        return { status: 'ERREUR', message: error.message };
      }
    }
  },
  'DeepSeek V3': {
    url: 'https://api.deepseek.com/v1/chat/completions',
    key: process.env.DEEPSEEK_API_KEY,
    test: async () => {
      if (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY === 'your_deepseek_api_key') {
        return { status: 'NON CONFIGURÉ', message: 'Clé API manquante ou placeholder' };
      }
      try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [{ role: 'user', content: 'Test' }],
            max_tokens: 5
          })
        });
        if (response.ok) {
          return { status: 'FONCTIONNEL', message: 'API accessible' };
        } else {
          const error = await response.json();
          return { status: 'ERREUR', message: error.error?.message || `HTTP ${response.status}` };
        }
      } catch (error) {
        return { status: 'ERREUR', message: error.message };
      }
    }
  },
  'DeepSeek R1 (Reasoner)': {
    url: 'https://api.deepseek.com/v1/chat/completions',
    key: process.env.DEEPSEEK_API_KEY,
    test: async () => {
      if (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY === 'your_deepseek_api_key') {
        return { status: 'NON CONFIGURÉ', message: 'Clé API manquante ou placeholder' };
      }
      try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'deepseek-reasoner',
            messages: [{ role: 'user', content: 'Solve: 2+2=' }],
            max_tokens: 10
          })
        });
        if (response.ok) {
          return { status: 'FONCTIONNEL', message: 'API R1 accessible' };
        } else {
          const error = await response.json();
          return { status: 'ERREUR', message: error.error?.message || `HTTP ${response.status}` };
        }
      } catch (error) {
        return { status: 'ERREUR', message: error.message };
      }
    }
  },
  'Grok (xAI)': {
    url: 'https://api.x.ai/v1/chat/completions',
    key: process.env.GROK_API_KEY,
    test: async () => {
      if (!process.env.GROK_API_KEY || process.env.GROK_API_KEY === 'your_grok_api_key') {
        return { status: 'NON CONFIGURÉ', message: 'Clé API manquante ou placeholder' };
      }
      try {
        const response = await fetch('https://api.x.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'grok-2-1212',
            messages: [{ role: 'user', content: 'Test' }],
            max_tokens: 5
          })
        });
        if (response.ok) {
          return { status: 'FONCTIONNEL', message: 'API accessible' };
        } else {
          const error = await response.json();
          return { status: 'ERREUR', message: error.error?.message || `HTTP ${response.status}` };
        }
      } catch (error) {
        return { status: 'ERREUR', message: error.message };
      }
    }
  },
  'Claude (Anthropic)': {
    url: 'https://api.anthropic.com/v1/messages',
    key: process.env.ANTHROPIC_API_KEY,
    test: async () => {
      if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_claude_api_key') {
        return { status: 'NON CONFIGURÉ', message: 'Clé API manquante ou placeholder' };
      }
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 5,
            messages: [{ role: 'user', content: 'Test' }]
          })
        });
        if (response.ok) {
          return { status: 'FONCTIONNEL', message: 'API accessible' };
        } else {
          const error = await response.json();
          return { status: 'ERREUR', message: error.error?.message || `HTTP ${response.status}` };
        }
      } catch (error) {
        return { status: 'ERREUR', message: error.message };
      }
    }
  },
  'Gemini': {
    url: 'https://generativelanguage.googleapis.com/v1beta/models',
    key: process.env.GEMINI_API_KEY,
    test: async () => {
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key') {
        return { status: 'NON CONFIGURÉ', message: 'Clé API manquante ou placeholder' };
      }
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        if (response.ok) {
          return { status: 'FONCTIONNEL', message: 'API accessible' };
        } else {
          const error = await response.json();
          return { status: 'ERREUR', message: error.error?.message || `HTTP ${response.status}` };
        }
      } catch (error) {
        return { status: 'ERREUR', message: error.message };
      }
    }
  },
  'Stripe': {
    url: 'https://api.stripe.com/v1/account',
    key: process.env.STRIPE_SECRET_KEY,
    test: async () => {
      if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_...') {
        return { status: 'NON CONFIGURÉ', message: 'Clé secrète manquante ou placeholder' };
      }
      try {
        const response = await fetch('https://api.stripe.com/v1/account', {
          headers: {
            'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`
          }
        });
        if (response.ok) {
          return { status: 'FONCTIONNEL', message: 'API accessible' };
        } else {
          const error = await response.json();
          return { status: 'ERREUR', message: error.error?.message || `HTTP ${response.status}` };
        }
      } catch (error) {
        return { status: 'ERREUR', message: error.message };
      }
    }
  },
  'N8N': {
    url: process.env.N8N_BASE_URL,
    key: process.env.N8N_API_KEY,
    test: async () => {
      if (!process.env.N8N_BASE_URL || !process.env.N8N_API_KEY || 
          process.env.N8N_BASE_URL === 'https://your-n8n-instance.com' ||
          process.env.N8N_API_KEY === 'your_n8n_api_key') {
        return { status: 'NON CONFIGURÉ', message: 'URL ou clé API manquante/placeholder' };
      }
      try {
        const response = await fetch(`${process.env.N8N_BASE_URL}/api/v1/workflows`, {
          headers: {
            'X-N8N-API-KEY': process.env.N8N_API_KEY
          }
        });
        if (response.ok) {
          return { status: 'FONCTIONNEL', message: 'API accessible' };
        } else {
          return { status: 'ERREUR', message: `HTTP ${response.status}` };
        }
      } catch (error) {
        return { status: 'ERREUR', message: error.message };
      }
    }
  },
  'Systeme.io': {
    url: 'https://api.systeme.io/api/v1/contacts',
    key: process.env.SYSTEME_IO_API_KEY,
    test: async () => {
      if (!process.env.SYSTEME_IO_API_KEY || process.env.SYSTEME_IO_API_KEY === 'your_systeme_io_api_key') {
        return { status: 'NON CONFIGURÉ', message: 'Clé API manquante ou placeholder' };
      }
      try {
        const response = await fetch('https://api.systeme.io/api/v1/contacts', {
          headers: {
            'X-API-Key': process.env.SYSTEME_IO_API_KEY
          }
        });
        if (response.ok) {
          return { status: 'FONCTIONNEL', message: 'API accessible' };
        } else {
          return { status: 'ERREUR', message: `HTTP ${response.status}` };
        }
      } catch (error) {
        return { status: 'ERREUR', message: error.message };
      }
    }
  },
  'PostHog': {
    url: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    key: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    test: async () => {
      if (!process.env.NEXT_PUBLIC_POSTHOG_KEY || !process.env.NEXT_PUBLIC_POSTHOG_HOST ||
          process.env.NEXT_PUBLIC_POSTHOG_KEY === 'your_posthog_key') {
        return { status: 'NON CONFIGURÉ', message: 'Clé ou host manquant/placeholder' };
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_POSTHOG_HOST}/api/projects/`, {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_POSTHOG_KEY}`
          }
        });
        if (response.ok) {
          return { status: 'FONCTIONNEL', message: 'API accessible' };
        } else {
          return { status: 'ERREUR', message: `HTTP ${response.status}` };
        }
      } catch (error) {
        return { status: 'ERREUR', message: error.message };
      }
    }
  }
};

async function auditAPIs() {
  console.log('🔍 AUDIT DES APIs - DROPSKILLS\n');
  console.log('=' .repeat(60));
  
  const results = {};
  
  for (const [name, api] of Object.entries(APIs)) {
    console.log(`\n🔧 Test de ${name}...`);
    
    try {
      const result = await api.test();
      results[name] = result;
      
      const statusIcon = {
        'FONCTIONNEL': '✅',
        'ERREUR': '❌',
        'NON CONFIGURÉ': '⚠️'
      }[result.status] || '❓';
      
      console.log(`   ${statusIcon} ${result.status}: ${result.message}`);
      
      if (api.key && result.status !== 'NON CONFIGURÉ') {
        const keyPreview = api.key.substring(0, 10) + '...' + api.key.slice(-4);
        console.log(`   🔑 Clé: ${keyPreview}`);
      }
      
    } catch (error) {
      results[name] = { status: 'ERREUR', message: error.message };
      console.log(`   ❌ ERREUR: ${error.message}`);
    }
  }
  
  // Résumé
  console.log('\n' + '=' .repeat(60));
  console.log('📊 RÉSUMÉ DE L\'AUDIT\n');
  
  const fonctionnelles = Object.values(results).filter(r => r.status === 'FONCTIONNEL').length;
  const erreurs = Object.values(results).filter(r => r.status === 'ERREUR').length;
  const nonConfigurees = Object.values(results).filter(r => r.status === 'NON CONFIGURÉ').length;
  
  console.log(`✅ APIs fonctionnelles: ${fonctionnelles}`);
  console.log(`❌ APIs en erreur: ${erreurs}`);
  console.log(`⚠️  APIs non configurées: ${nonConfigurees}`);
  
  console.log('\n🎯 RECOMMANDATIONS:');
  
  if (fonctionnelles > 0) {
    console.log('• Vous avez au moins une API IA fonctionnelle pour les mentors');
  }
  
  if (erreurs > 0) {
    console.log('• Vérifiez les clés API en erreur sur les plateformes respectives');
  }
  
  if (nonConfigurees > 0) {
    console.log('• Configurez les APIs manquantes selon vos besoins');
  }
  
  console.log('\n' + '=' .repeat(60));
}

auditAPIs().catch(console.error);