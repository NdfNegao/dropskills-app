import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ApifyClient } from 'apify-client';

// Interface pour la configuration de veille
interface VeilleConfiguration {
  keywords: string[];
  sources: string[]; // 'linkedin', 'twitter', 'news', 'websites'
  sectors?: string[];
  excludeKeywords?: string[];
  maxResults?: number;
  dateRange?: 'today' | 'week' | 'month';
  priority?: 'low' | 'medium' | 'high';
}

// Mapping des actors Apify par source
const APIFY_ACTORS = {
  linkedin: 'apify/linkedin-company-scraper',
  twitter: 'apify/twitter-scraper',
  news: 'apify/google-news-scraper',
  websites: 'apify/web-scraper'
};

const apifyClient = new ApifyClient({
  token: process.env.APIFY_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    const userId = session.user.id;

    // Parser la configuration
    const config: VeilleConfiguration = await request.json();
    
    // Validation des données
    if (!config.keywords || config.keywords.length === 0) {
      return NextResponse.json({ 
        error: 'Au moins un mot-clé est requis' 
      }, { status: 400 });
    }

    if (!config.sources || config.sources.length === 0) {
      return NextResponse.json({ 
        error: 'Au moins une source est requise' 
      }, { status: 400 });
    }

    // Vérifier les limites utilisateur
    const { data: usageCheck } = await supabase.rpc('check_user_usage_limit', {
      p_user_id: userId,
      p_usage_type: 'veille_scraping',
      p_quantity: 1
    });

    if (!usageCheck) {
      return NextResponse.json({ 
        error: 'Limite de scraping atteinte pour ce mois' 
      }, { status: 429 });
    }

    // Créer le job de scraping
    const { data: scrapeJob, error: jobError } = await supabase
      .from('apify_scrape_jobs')
      .insert({
        user_id: userId,
        job_type: 'veille',
        title: `Veille: ${config.keywords.join(', ')}`,
        description: `Scraping automatisé pour les mots-clés: ${config.keywords.join(', ')}`,
        configuration: config,
        status: 'pending'
      })
      .select()
      .single();

    if (jobError) {
      console.error('Erreur création job:', jobError);
      return NextResponse.json({ 
        error: 'Erreur lors de la création du job' 
      }, { status: 500 });
    }

    // Lancer les scrapers pour chaque source
    const scrapePromises = config.sources.map(async (source) => {
      const actorId = APIFY_ACTORS[source as keyof typeof APIFY_ACTORS];
      if (!actorId) {
        console.warn(`Source non supportée: ${source}`);
        return null;
      }

      try {
        // Configuration spécifique par actor
        const actorInput = buildActorInput(source, config);
        
        // Lancer l'actor Apify
        const run = await apifyClient.actor(actorId).call(actorInput);
        
        // Mettre à jour le job avec l'ID Apify
        await supabase
          .from('apify_scrape_jobs')
          .update({
            apify_run_id: run.id,
            apify_actor_id: actorId,
            apify_actor_name: source,
            status: 'running',
            started_at: new Date().toISOString()
          })
          .eq('id', scrapeJob.id);

        return {
          source,
          runId: run.id,
          actorId,
          status: 'started'
        };
      } catch (error) {
        console.error(`Erreur lancement ${source}:`, error);
        return {
          source,
          error: error instanceof Error ? error.message : 'Erreur inconnue',
          status: 'failed'
        };
      }
    });

    const results = await Promise.all(scrapePromises);
    const successfulRuns = results.filter(r => r && r.status === 'started');

    if (successfulRuns.length === 0) {
      // Aucun scraper n'a pu être lancé
      await supabase
        .from('apify_scrape_jobs')
        .update({
          status: 'failed',
          error_message: 'Aucun scraper n\'a pu être lancé'
        })
        .eq('id', scrapeJob.id);

      return NextResponse.json({ 
        error: 'Impossible de lancer le scraping' 
      }, { status: 500 });
    }

    // Enregistrer l'usage
    await supabase.from('usage_tracking').insert({
      user_id: userId,
      usage_type: 'veille_scraping',
      action: 'scrape_job_created',
      quantity: 1,
      resource_type: 'scrape_job',
      resource_id: scrapeJob.id,
      metadata: {
        sources: config.sources,
        keywords_count: config.keywords.length,
        successful_runs: successfulRuns.length
      }
    });

    return NextResponse.json({
      success: true,
      jobId: scrapeJob.id,
      message: `Scraping lancé pour ${successfulRuns.length} source(s)`,
      details: {
        jobId: scrapeJob.id,
        sources: successfulRuns,
        failedSources: results.filter(r => r && r.status === 'failed')
      }
    });

  } catch (error) {
    console.error('Erreur API veille:', error);
    return NextResponse.json({ 
      error: 'Erreur serveur lors du lancement de la veille' 
    }, { status: 500 });
  }
}

// Fonction pour construire la configuration d'actor selon la source
function buildActorInput(source: string, config: VeilleConfiguration) {
  const maxResults = config.maxResults || 50;
  const keywords = config.keywords.join(' OR ');

  switch (source) {
    case 'linkedin':
      return {
        searchKeywords: keywords,
        maxResults,
        includeContactInfo: true,
        language: 'fr',
        geoLocation: 'France'
      };

    case 'twitter':
      return {
        searchTerms: config.keywords,
        maxTweets: maxResults,
        language: 'fr',
        includeReplies: false,
        addUserInfo: true
      };

    case 'news':
      return {
        queries: config.keywords,
        maxResults,
        country: 'FR',
        language: 'fr',
        timeRange: config.dateRange || 'week'
      };

    case 'websites':
      return {
        startUrls: [
          { url: `https://www.google.com/search?q=${encodeURIComponent(keywords)}` }
        ],
        maxResults,
        extractText: true,
        extractLinks: true
      };

    default:
      return {
        query: keywords,
        maxResults
      };
  }
} 