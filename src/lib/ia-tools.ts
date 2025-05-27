import { prisma } from './prisma';
import { IaToolType, IaToolStatus, UsageStatus } from '@/generated/prisma';

// Types pour la création et la mise à jour d'outils IA
type CreateIaToolInput = {
  name: string;
  description?: string;
  category?: string;
  endpoint: string;
  apiKey?: string;
  type: IaToolType;
  maxUsagePerDay?: number;
  costPerUse?: number;
  icon?: string;
  color?: string;
  tags?: string[];
};

type TrackUsageInput = {
  userId: string;
  toolId: string;
  prompt?: string;
  response?: string;
  tokensUsed?: number;
  cost?: number;
  userAgent?: string;
  ipAddress?: string;
};

// Fonction pour créer un nouvel outil IA
export async function createIaTool(input: CreateIaToolInput) {
  return prisma.iaTool.create({
    data: {
      ...input,
      tags: input.tags ? input.tags.join(',') : null,
      isActive: true,
    },
  });
}

// Fonction pour suivre l'utilisation d'un outil IA
export async function trackIaToolUsage(input: TrackUsageInput) {
  // Vérifier si l'utilisateur a atteint sa limite quotidienne
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const usageCount = await prisma.iaToolUsage.count({
    where: {
      userId: input.userId,
      toolId: input.toolId,
      createdAt: {
        gte: today,
      },
    },
  });

  const tool = await prisma.iaTool.findUnique({
    where: { id: input.toolId },
  });

  if (tool?.maxUsagePerDay && usageCount >= tool.maxUsagePerDay) {
    throw new Error('Limite d\'utilisation quotidienne atteinte');
  }

  // Créer l'enregistrement d'utilisation
  return prisma.iaToolUsage.create({
    data: {
      ...input,
      status: UsageStatus.SUCCESS,
    },
  });
}

// Fonction pour obtenir les statistiques d'utilisation d'un outil
export async function getIaToolStats(toolId: string) {
  const [totalUsage, todayUsage, averageCost] = await Promise.all([
    prisma.iaToolUsage.count({
      where: { toolId },
    }),
    prisma.iaToolUsage.count({
      where: {
        toolId,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    prisma.iaToolUsage.aggregate({
      where: { toolId },
      _avg: { cost: true },
    }),
  ]);

  return {
    totalUsage,
    todayUsage,
    averageCost: averageCost._avg.cost || 0,
  };
}

// Fonction pour lister tous les outils IA actifs
export async function listActiveIaTools() {
  return prisma.iaTool.findMany({
    where: {
      isActive: true,
      status: IaToolStatus.ACTIVE,
    },
    include: {
      _count: {
        select: { usage: true },
      },
    },
  });
}

// Fonction pour obtenir l'historique d'utilisation d'un utilisateur
export async function getUserIaToolHistory(userId: string) {
  return prisma.iaToolUsage.findMany({
    where: { userId },
    include: {
      tool: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50, // Limiter aux 50 dernières utilisations
  });
}

// Fonction pour mettre à jour le statut d'un outil
export async function updateIaToolStatus(toolId: string, status: IaToolStatus) {
  return prisma.iaTool.update({
    where: { id: toolId },
    data: { status },
  });
}

// Fonction pour obtenir les outils les plus utilisés
export async function getMostUsedIaTools(limit = 5) {
  const tools = await prisma.iaTool.findMany({
    include: {
      _count: {
        select: { usage: true },
      },
    },
    orderBy: {
      usage: {
        _count: 'desc',
      },
    },
    take: limit,
  });

  return tools.map(tool => ({
    ...tool,
    usageCount: tool._count.usage,
  }));
} 