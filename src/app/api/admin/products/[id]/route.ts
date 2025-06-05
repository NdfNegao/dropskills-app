import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/admin/products/[id] - Récupérer un produit spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Vérifier les permissions admin
    if (session.user.email !== 'cyril.iriebi@gmail.com') {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Produit non trouvé' },
          { status: 404 }
        );
      }
      
      console.error('Erreur Supabase:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération du produit' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/products/[id] - Mettre à jour un produit
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Vérifier les permissions admin
    if (session.user.email !== 'cyril.iriebi@gmail.com') {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Vérifier si le produit existe
    const { data: existing, error: existError } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('id', params.id)
      .single();

    if (existError) {
      if (existError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Produit non trouvé' },
          { status: 404 }
        );
      }
      
      console.error('Erreur Supabase:', existError);
      return NextResponse.json(
        { error: 'Erreur lors de la vérification du produit' },
        { status: 500 }
      );
    }

    // Préparer les données pour mise à jour (on ne met à jour que les champs fournis)
    const updateData: any = {};
    
    // Champs simples
    const simpleFields = [
      'title', 'subtitle', 'format', 'image', 'description', 
      'short_description', 'long_description', 'file_url', 
      'size', 'file_type', 'category', 'instructor', 'duration',
      'download_url'
    ];
    
    simpleFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field] || null;
      }
    });

    // Champs numériques
    const numericFields = ['likes', 'pages', 'words', 'downloads', 'students'];
    numericFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = parseInt(body[field]) || 0;
      }
    });

    // Rating (décimal)
    if (body.rating !== undefined) {
      updateData.rating = parseFloat(body.rating) || 0;
    }

    // Champs boolean
    if (body.is_premium !== undefined) {
      updateData.is_premium = Boolean(body.is_premium);
    }

    // Champs array
    const arrayFields = ['tags', 'images', 'details', 'rights', 'permissions', 'preview_images'];
    arrayFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = Array.isArray(body[field]) ? body[field] : [];
      }
    });

    // Champs JSON
    if (body.features !== undefined) {
      updateData.features = Array.isArray(body.features) ? body.features : [];
    }

    // Mettre à jour le produit
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du produit' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Produit mis à jour avec succès',
      product
    });

  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] - Supprimer un produit
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Vérifier les permissions admin
    if (session.user.email !== 'cyril.iriebi@gmail.com') {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    // Vérifier si le produit existe
    const { data: existing, error: existError } = await supabaseAdmin
      .from('products')
      .select('id, title')
      .eq('id', params.id)
      .single();

    if (existError) {
      if (existError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Produit non trouvé' },
          { status: 404 }
        );
      }
      
      console.error('Erreur Supabase:', existError);
      return NextResponse.json(
        { error: 'Erreur lors de la vérification du produit' },
        { status: 500 }
      );
    }

    // Supprimer le produit
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression du produit' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Produit "${existing.title}" supprimé avec succès`
    });

  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 