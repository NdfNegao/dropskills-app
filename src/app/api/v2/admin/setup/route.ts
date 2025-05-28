import { NextRequest, NextResponse } from 'next/server'
import { supabase, SupabaseHelper } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

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

    // Vérifier si l'utilisateur existe dans auth.users
    const { data: authUsers } = await supabase.auth.admin.listUsers()
    let authUser = authUsers?.users?.find((u: any) => u.email === email)

    let userId: string

    if (!authUser) {
      // Créer l'utilisateur dans Supabase Auth
      const { data: newAuthUser, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: password || 'admin123',
        email_confirm: true,
        user_metadata: {
          first_name: firstName,
          last_name: lastName
        }
      })

      if (authError) {
        throw new Error(`Erreur création auth: ${authError.message}`)
      }

      userId = newAuthUser.user.id
      authUser = newAuthUser.user
    } else {
      userId = authUser.id
      
      // Mettre à jour le mot de passe si fourni
      if (password) {
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          userId,
          { password }
        )
        
        if (updateError) {
          console.warn('Erreur mise à jour mot de passe:', updateError.message)
        }
      }
    }

    // Vérifier si le profil existe
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    let profile
    if (existingProfile) {
      // Mettre à jour le profil existant
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          role: role,
          first_name: firstName || existingProfile.first_name,
          last_name: lastName || existingProfile.last_name,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()

      if (updateError) throw updateError
      profile = updatedProfile
    } else {
      // Créer un nouveau profil
      const { data: newProfile, error: createError } = await SupabaseHelper.createProfile({
        user_id: userId,
        role: role,
        first_name: firstName,
        last_name: lastName
      })

      if (createError) throw createError
      profile = newProfile
    }

    // Log de l'action admin
    try {
      await supabase
        .from('admin_logs')
        .insert({
          admin_id: userId,
          action: 'ADMIN_SETUP',
          resource_type: 'PROFILE',
          resource_id: profile.id
        })
    } catch (logError) {
      console.warn('Erreur création log:', logError)
    }

    return NextResponse.json({
      status: 'SUCCESS',
      message: `✅ Profil ${role} créé/mis à jour pour ${email}`,
      data: {
        user: {
          id: userId,
          email: authUser.email,
          firstName: firstName,
          lastName: lastName,
          hasPassword: true
        },
        profile: {
          id: profile.id,
          role: profile.role,
          firstName: profile.first_name,
          lastName: profile.last_name
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