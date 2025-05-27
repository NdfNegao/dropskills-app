import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Les 6 outils IA Dropskills
const DEFAULT_AI_TOOLS = [
  {
    name: "ICP Maker",
    description: "Créateur de profil client idéal avec IA",
    toolType: "GENERATOR"
  },
  {
    name: "Générateur d'Offre",
    description: "Générateur d'offres irrésistibles automatisé",
    toolType: "GENERATOR"
  },
  {
    name: "Tunnel de Vente IA",
    description: "Assistant pour créer des tunnels de vente optimisés",
    toolType: "ASSISTANT"
  },
  {
    name: "CopyMoneyMail",
    description: "Optimiseur d'emails de vente haute conversion",
    toolType: "OPTIMIZER"
  },
  {
    name: "Content System 90J",
    description: "Analyseur et planificateur de contenu sur 90 jours",
    toolType: "ANALYZER"
  },
  {
    name: "Lead Magnet Creator",
    description: "Générateur de lead magnets attractifs",
    toolType: "GENERATOR"
  }
];

export async function GET(request: NextRequest) {
  try {
    const aiTools = await prisma.aiTool.findMany({
      include: {
        _count: {
          select: {
            aiUsage: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json({
      status: 'SUCCESS',
      data: aiTools,
      count: aiTools.length,
      message: `${aiTools.length} outil(s) IA disponible(s)`
    });

  } catch (error) {
    console.error('Erreur récupération outils IA:', error);
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Erreur lors de la récupération des outils IA',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Si action = "init", créer les 6 outils par défaut
    if (body.action === 'init') {
      // Vérifier si des outils existent déjà
      const existingTools = await prisma.aiTool.count();
      
      if (existingTools > 0) {
        return NextResponse.json({
          status: 'INFO',
          message: `${existingTools} outil(s) IA déjà présent(s)`,
          data: await prisma.aiTool.findMany()
        });
      }

      // Créer les 6 outils par défaut
      const createdTools = await Promise.all(
        DEFAULT_AI_TOOLS.map(tool => 
          prisma.aiTool.create({
            data: {
              name: tool.name,
              description: tool.description,
              toolType: tool.toolType as any,
              isActive: true
            }
          })
        )
      );

      return NextResponse.json({
        status: 'SUCCESS',
        message: '✅ 6 outils IA Dropskills créés avec succès !',
        data: createdTools,
        count: createdTools.length
      }, { status: 201 });
    }

    // Création d'un outil individuel
    const { name, description, toolType, isActive = true } = body;

    if (!name || !toolType) {
      return NextResponse.json({
        status: 'ERROR',
        message: 'Nom et type d\'outil requis'
      }, { status: 400 });
    }

    const aiTool = await prisma.aiTool.create({
      data: {
        name,
        description,
        toolType,
        isActive
      }
    });

    return NextResponse.json({
      status: 'SUCCESS',
      data: aiTool,
      message: 'Outil IA créé avec succès'
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur création outil IA:', error);
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Erreur lors de la création de l\'outil IA',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
} 