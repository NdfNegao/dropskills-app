import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { openai } from '@/lib/openai';
import { ICPFormData } from '@/app/outils/icp-maker/page';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // TEMPORAIRE : Bypass auth pour test
    // const session = await getServerSession(authOptions);
    
    // if (!session?.user?.email) {
    //   return NextResponse.json(
    //     { error: 'Non autorisé' },
    //     { status: 401 }
    //   );
    // }

    const formData: ICPFormData = await request.json();
    
    // Validation des données
    if (!formData.secteur?.trim() || !formData.produitService?.trim()) {
      return NextResponse.json(
        { error: 'Les champs secteur et produit/service sont requis' },
        { status: 400 }
      );
    }

    // DONNÉES FICTIVES POUR TEST
    const fakeAnalysis = {
      "profilSociodemographique": {
        "age": "35-50 ans",
        "sexe": "60% hommes, 40% femmes",
        "localisation": "Grandes métropoles françaises (Paris, Lyon, Marseille)",
        "situationPro": "Dirigeants de PME, entrepreneurs, cadres supérieurs",
        "niveauRevenus": "80k-200k€ annuels"
      },
      "psychologieMotivations": {
        "besoins": [
          "Optimiser sa productivité et ses processus",
          "Prendre des décisions éclairées rapidement",
          "Automatiser les tâches répétitives"
        ],
        "desirs": [
          "Être reconnu comme un leader innovant",
          "Avoir plus de temps pour la stratégie",
          "Maximiser la croissance de son business"
        ],
        "peurs": [
          "Être dépassé par la concurrence",
          "Perdre du temps avec des solutions complexes",
          "Investir dans des outils qui ne fonctionnent pas"
        ],
        "objections": [
          "C'est trop compliqué à mettre en place",
          "Le ROI n'est pas garanti",
          "Mon équipe ne saura pas l'utiliser"
        ]
      },
      "problemePrincipaux": [
        "Manque de temps pour analyser les données business",
        "Difficulté à identifier le client idéal",
        "Processus marketing inefficaces et chronophages"
      ],
      "ouLeTrouver": {
        "canaux": ["LinkedIn", "Forums spécialisés", "Événements business"],
        "plateformes": ["LinkedIn Sales Navigator", "Twitter", "Reddit r/entrepreneur"],
        "groupes": ["Groupes LinkedIn PME", "CCI locales", "Réseaux d'entrepreneurs"],
        "evenements": ["Salons d'entrepreneurs", "Webinaires business", "Meetups startup"]
      },
      "messagingImpactant": {
        "expressions": [
          "Gagnez du temps sur vos analyses",
          "Boostez votre croissance avec l'IA",
          "Des insights business en quelques clics"
        ],
        "accroches": [
          "Et si vous pouviez identifier votre client idéal en 5 minutes ?",
          "Stop aux analyses business qui prennent des heures",
          "L'IA qui transforme vos données en décisions"
        ],
        "styleDiscours": "Direct, orienté résultats, avec des preuves concrètes et du ROI"
      },
      "budgetPouvoirAchat": {
        "budgetTypique": "500-2000€/mois pour les outils business",
        "frequenceAchat": "Mensuel ou annuel",
        "facteursPrix": ["ROI démontrable", "Facilité d'utilisation", "Support client"]
      },
      "segments": {
        "principal": {
          "nom": "Dirigeants PME Tech-Savvy",
          "description": "Entrepreneurs et dirigeants de PME (10-100 employés) du secteur services, ouverts aux nouvelles technologies",
          "pourcentage": "70%"
        },
        "variantes": [
          {
            "nom": "Consultants Solo",
            "description": "Consultants indépendants cherchant à professionnaliser leurs approches",
            "pourcentage": "20%"
          },
          {
            "nom": "Cadres Grandes Entreprises",
            "description": "Managers en charge d'innovation ou de transformation digitale",
            "pourcentage": "10%"
          }
        ]
      },
      "ficheActionable": {
        "resumeExecutif": "Cible principale : dirigeants PME 35-50 ans, tech-savvy, revenus 80-200k€, cherchant productivité et croissance via l'IA.",
        "prioritesMarketing": [
          "Content marketing sur LinkedIn avec cas d'usage concrets",
          "Démonstrations produit lors d'événements business",
          "Partenariats avec consultants et CCI"
        ],
        "prochainEtapes": [
          "Créer du contenu éducatif sur l'IA business",
          "Développer des cas clients détaillés",
          "Lancer des webinaires démonstratifs"
        ],
        "metriquesACles": [
          "Taux de conversion demo → client",
          "Coût d'acquisition client (CAC)",
          "Net Promoter Score (NPS)"
        ]
      }
    };

    return NextResponse.json({
      success: true,
      analysis: fakeAnalysis,
      processingTime: Date.now(),
      mode: "TEST_FICTIF"
    });

  } catch (error) {
    console.error('Erreur lors de la génération ICP:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la génération de l\'ICP',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
} 