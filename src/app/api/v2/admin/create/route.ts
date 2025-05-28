import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, role = 'ADMIN' } = await request.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email et mot de passe requis'
      }, { status: 400 });
    }

    console.log('🔧 Création admin sans contraintes FK...');

    // Générer un UUID pour l'utilisateur
    const userId = crypto.randomUUID();

    // Créer le profil directement (sans contraintes FK)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
        role: role
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Erreur création profil:', profileError);
      throw new Error(profileError.message);
    }

    // Créer un log d'administration
    const { error: logError } = await supabaseAdmin
      .from('admin_logs')
      .insert({
        admin_id: userId,
        action: 'ADMIN_CREATED',
        resource_type: 'PROFILE',
        resource_id: userId
      });

    if (logError) {
      console.warn('⚠️ Erreur création log (non critique):', logError);
    }

    console.log('✅ Admin créé avec succès:', profile);

    return NextResponse.json({
      success: true,
      message: 'Administrateur créé avec succès',
      data: {
        user_id: userId,
        email: email,
        first_name: firstName,
        last_name: lastName,
        role: role,
        profile: profile
      }
    });

  } catch (error) {
    console.error('❌ Erreur création admin:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
} 