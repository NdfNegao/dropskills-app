import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, role = 'ADMIN' } = body;

    if (!email) {
      return NextResponse.json({
        status: 'ERROR',
        message: 'Email requis'
      }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe
    let user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    // Créer l'utilisateur s'il n'existe pas
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          password: password || 'admin123', // Password par défaut
          firstName,
          lastName
        },
        include: { profile: true }
      });
    } else if (password) {
      // Mettre à jour le password si fourni
      user = await prisma.user.update({
        where: { id: user.id },
        data: { password },
        include: { profile: true }
      });
    }

    // Créer ou mettre à jour le profil admin
    let profile;
    if (user.profile) {
      profile = await prisma.profile.update({
        where: { userId: user.id },
        data: {
          role: role as any,
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName
        }
      });
    } else {
      profile = await prisma.profile.create({
        data: {
          userId: user.id,
          role: role as any,
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName
        }
      });
    }

    // Log de l'action admin
    await prisma.adminLog.create({
      data: {
        adminId: user.id,
        action: 'ADMIN_SETUP',
        resourceType: 'PROFILE',
        resourceId: profile.id
      }
    });

    return NextResponse.json({
      status: 'SUCCESS',
      message: `✅ Profil ${role} créé/mis à jour pour ${email}`,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          hasPassword: !!user.password
        },
        profile: {
          id: profile.id,
          role: profile.role,
          firstName: profile.firstName,
          lastName: profile.lastName
        }
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur setup admin:', error);
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Erreur lors de la création du profil admin',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
} 