import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { openai } from '@/lib/openai';
import { ContentFormData } from '@/app/outils/content-system/page';

interface ContentRequestData extends ContentFormData {
  icpData?: any;
  uspData?: any;
  tunnelData?: any;
  emailData?: any;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const formData: ContentRequestData = await request.json();
    
    // Validation des données
    if (!formData.icpCible?.trim() || !formData.objectifBusiness?.trim()) {
      return NextResponse.json(
        { error: 'Les champs ICP et objectif business sont requis' },
        { status: 400 }
      );
    }

    // Prompt système optimisé pour le calendrier éditorial
    const systemPrompt = `Tu es un expert en content marketing, stratégie éditoriale et IA générative.
Génère un plan de contenu ultra-cohérent, varié et adapté à la cible suivante, sur 90 jours.
Pour chaque jour ou chaque semaine, propose des idées de posts, leur format (texte, image, carousel, vidéo, email…), le canal optimal (LinkedIn, Insta, TikTok, Newsletter, etc.), et une accroche/squelette de chaque contenu.

Tu dois répondre UNIQUEMENT avec un JSON valide suivant EXACTEMENT cette structure :

{
  "calendrierInfo": {
    "titre": "Titre du calendrier",
    "description": "Description de la stratégie",
    "dureeTotal": "90 jours",
    "nombrePosts": 120,
    "dateDebut": "2024-01-01",
    "dateFin": "2024-03-31"
  },
  "calendrierEditorial": [
    {
      "id": "unique-id",
      "date": "2024-01-01",
      "semaine": 1,
      "typeContenu": "Éducatif",
      "sujetTitre": "Titre du post",
      "format": "Carousel",
      "plateforme": "LinkedIn",
      "objectif": "Générer des leads",
      "callToAction": "Téléchargez notre guide gratuit",
      "contenuGenere": "Aperçu du contenu",
      "briefIAImage": "Instructions pour générer le visuel",
      "hashtags": ["hashtag1", "hashtag2"],
      "dureeEstimee": "5 min"
    }
  ],
  "exemplesPostsGeneres": [
    {
      "id": "ex1",
      "type": "Storytelling",
      "plateforme": "LinkedIn",
      "titre": "Comment j'ai...",
      "contenu": "Contenu complet du post avec emojis et structure",
      "instructionsVisuels": "Photo de moi travaillant, fond bureau moderne, lumière naturelle",
      "format": "Texte + Image"
    }
  ],
  "conseilsRecyclage": {
    "crossPlatform": ["Conseil 1", "Conseil 2"],
    "adaptation": ["Conseil 1", "Conseil 2"],
    "repurposing": ["Conseil 1", "Conseil 2"]
  },
  "metriques": {
    "postsParSemaine": 7,
    "diversiteFormats": 5,
    "tauxEngagementEstime": 5,
    "porteeEstimee": "10-50k"
  },
  "outilsRecommandes": ["Buffer", "Canva", "ChatGPT"],
  "prochainEtapes": ["Étape 1", "Étape 2", "Étape 3"]
}

Contraintes :
- Calendrier logique, pas de répétition inutile, montée en puissance dans la stratégie
- Ton et format adaptés à la cible/plateforme
- Ajoute une touche créative sur les posts "signature"
- Prépare une colonne "brief IA image" pour chaque post visuel
- Varie les formats : texte, carrousel, vidéo, storytelling, résultat client, news, etc.
- Intègre les événements/campagnes spécifiques mentionnés
- Génère MINIMUM 10 exemples de posts complets et variés`;

    // Construction du prompt utilisateur avec toutes les données
    let userPrompt = `Génère un calendrier éditorial de 90 jours pour ce business :

**ICP/CIBLE :** ${formData.icpCible}

**OBJECTIF BUSINESS :** ${formData.objectifBusiness}

**OFFRE PRINCIPALE :** ${formData.offrePrincipale}

**THÈMES/ANGLES :** ${formData.themesAngles}

**PLATEFORMES :** ${formData.plateformes.join(', ')}

**TON/STYLE :** ${formData.tonStyle}

**FRÉQUENCE :** ${formData.frequence}`;

    if (formData.ressourcesMedias?.trim()) {
      userPrompt += `\n\n**RESSOURCES MÉDIAS :** ${formData.ressourcesMedias}`;
    }

    if (formData.evenementsCampagnes?.trim()) {
      userPrompt += `\n\n**ÉVÉNEMENTS/CAMPAGNES CLÉS :** ${formData.evenementsCampagnes}`;
    }

    // Ajouter les données ICP si disponibles
    if (formData.icpData) {
      userPrompt += `\n\n**DONNÉES ICP DÉTAILLÉES :**
- Profil : ${formData.icpData.profilSociodemographique?.age}, ${formData.icpData.profilSociodemographique?.situationPro}
- Besoins : ${formData.icpData.psychologieMotivations?.besoins?.slice(0, 3).join(', ')}
- Peurs : ${formData.icpData.psychologieMotivations?.peurs?.slice(0, 3).join(', ')}
- Canaux préférés : ${formData.icpData.ouLesTrouver?.canauxDigitaux?.slice(0, 3).join(', ')}
- Expressions qui résonnent : ${formData.icpData.messagingImpactant?.expressions?.slice(0, 3).join(', ')}`;
    }

    // Ajouter les données USP si disponibles
    if (formData.uspData) {
      userPrompt += `\n\n**USP DISPONIBLE :**
- USP principale : ${formData.uspData.uspPrincipale}
- Angle émotionnel : ${formData.uspData.variantes?.emotionnel}
- Mots-clés puissants : ${formData.uspData.conseilUtilisation?.motsClePuissants?.join(', ')}`;
    }

    // Ajouter les données Tunnel si disponibles
    if (formData.tunnelData) {
      userPrompt += `\n\n**TUNNEL DE VENTE :**
- Étapes : ${formData.tunnelData.schemaTunnel?.etapes?.join(' > ')}
- Messages clés par étape : ${formData.tunnelData.etapesDetaillees?.map((e: any) => e.messageCle).slice(0, 3).join(', ')}`;
    }

    // Ajouter les données Email si disponibles
    if (formData.emailData) {
      userPrompt += `\n\n**SÉQUENCE EMAIL :**
- Thèmes abordés : ${formData.emailData.emails?.map((e: any) => e.objectifEmail).slice(0, 3).join(', ')}
- Ton utilisé : ${formData.emailData.emails?.[0]?.conseilsEnvoi}`;
    }

    userPrompt += `\n\nGénère un calendrier éditorial complet de 90 jours avec au minimum 10 exemples de posts détaillés.
Assure-toi de varier les formats et les approches pour maintenir l'engagement.
Les dates doivent commencer à partir d'aujourd'hui.`;

    try {
      const openaiClient = openai();
      
      const completion = await openaiClient.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 4000,
        response_format: { type: "json_object" }
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('Aucune réponse reçue de OpenAI');
      }

      const analysis = JSON.parse(response);

      // Validation de la structure de réponse
      if (!analysis.calendrierInfo || !analysis.calendrierEditorial || !Array.isArray(analysis.calendrierEditorial)) {
        throw new Error('Format de réponse invalide');
      }

      // Générer les dates réelles à partir d'aujourd'hui
      const today = new Date();
      const startDate = new Date(today);
      
      // Mettre à jour les dates dans le calendrier
      analysis.calendrierEditorial = analysis.calendrierEditorial.map((post: any, index: number) => {
        const postDate = new Date(startDate);
        postDate.setDate(startDate.getDate() + Math.floor(index * 90 / analysis.calendrierEditorial.length));
        
        const weekNumber = Math.ceil((postDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
        
        return {
          ...post,
          id: `post-${index + 1}`,
          date: postDate.toISOString().split('T')[0],
          semaine: weekNumber || 1
        };
      });

      // Mettre à jour les dates de début et fin
      analysis.calendrierInfo.dateDebut = startDate.toISOString().split('T')[0];
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 90);
      analysis.calendrierInfo.dateFin = endDate.toISOString().split('T')[0];

      // Validation des exemples de posts
      if (!Array.isArray(analysis.exemplesPostsGeneres) || analysis.exemplesPostsGeneres.length < 10) {
        // Générer des exemples supplémentaires si nécessaire
        const exemplesManquants = 10 - (analysis.exemplesPostsGeneres?.length || 0);
        if (exemplesManquants > 0) {
          analysis.exemplesPostsGeneres = analysis.exemplesPostsGeneres || [];
          // Ajouter des exemples basiques
          for (let i = 0; i < exemplesManquants; i++) {
            analysis.exemplesPostsGeneres.push({
              id: `ex${analysis.exemplesPostsGeneres.length + i + 1}`,
              type: 'Éducatif',
              plateforme: formData.plateformes[0] || 'LinkedIn',
              titre: `Post exemple ${i + 1}`,
              contenu: 'Contenu à générer',
              format: 'Texte'
            });
          }
        }
      }

      // Validation des conseils de recyclage
      if (!analysis.conseilsRecyclage) {
        analysis.conseilsRecyclage = {
          crossPlatform: ["Adaptez le format selon la plateforme", "Réutilisez les visuels"],
          adaptation: ["Modifiez le ton selon l'audience", "Ajustez la longueur"],
          repurposing: ["Transformez un post en newsletter", "Créez une série à partir d'un contenu"]
        };
      }

      // Validation des métriques
      if (!analysis.metriques) {
        const postsParSemaine = Math.round(analysis.calendrierEditorial.length / 13);
        analysis.metriques = {
          postsParSemaine: postsParSemaine,
          diversiteFormats: new Set(analysis.calendrierEditorial.map((p: any) => p.format)).size,
          tauxEngagementEstime: 5,
          porteeEstimee: "10-50k"
        };
      }

      // Validation des outils et prochaines étapes
      if (!Array.isArray(analysis.outilsRecommandes)) {
        analysis.outilsRecommandes = ["Buffer", "Canva", "Later", "Hootsuite"];
      }

      if (!Array.isArray(analysis.prochainEtapes)) {
        analysis.prochainEtapes = [
          "Configurer votre calendrier dans un outil de planification",
          "Créer les visuels pour le premier mois",
          "Préparer les templates réutilisables"
        ];
      }

      return NextResponse.json({
        success: true,
        analysis,
        processingTime: Date.now()
      });

    } catch (error) {
      console.error('Erreur OpenAI lors de la génération du calendrier:', error);
      
      // Gestion spécifique des erreurs de quota
      if (error instanceof Error && error.message.includes('429')) {
        return NextResponse.json(
          { 
            error: 'Quota OpenAI dépassé. Veuillez réessayer plus tard.',
            details: 'Limite d\'utilisation atteinte'
          },
          { status: 429 }
        );
      }
      
      // Gestion des erreurs de parsing JSON
      if (error instanceof Error && error.message.includes('JSON')) {
        return NextResponse.json(
          { 
            error: 'Erreur de format dans la réponse IA. Veuillez réessayer.',
            details: 'Format de réponse invalide'
          },
          { status: 500 }
        );
      }
      
      throw new Error(`Erreur lors de la génération du calendrier avec OpenAI: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }

  } catch (error) {
    console.error('Erreur lors de la génération du calendrier éditorial:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la génération du calendrier éditorial',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
} 