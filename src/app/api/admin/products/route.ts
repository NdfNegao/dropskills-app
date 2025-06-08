import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/admin/products - Lister tous les produits
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
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

    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';
    const isPremium = url.searchParams.get('is_premium');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    let query = supabaseAdmin
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    // Filtres
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (isPremium !== null && isPremium !== '') {
      query = query.eq('is_premium', isPremium === 'true');
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: products, error } = await query;

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des produits' },
        { status: 500 }
      );
    }

    // Statistiques
    const { data: stats } = await supabaseAdmin
      .from('products')
      .select('is_premium, category')
      .then(({ data }) => {
        if (!data) return { data: null };
        
        const total = data.length;
        const premium = data.filter(p => p.is_premium).length;
        const free = total - premium;
        const categories = [...new Set(data.map(p => p.category).filter(Boolean))];
        
        return {
          data: {
            total,
            premium,
            free,
            categories: categories.length
          }
        };
      });

    return NextResponse.json({
      success: true,
      products,
      stats,
      pagination: {
        limit,
        offset,
        hasMore: products.length === limit
      }
    });

  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST /api/admin/products - Créer un nouveau produit
export async function POST(request: NextRequest) {
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
    
    // Validation des champs requis
    const requiredFields = ['id', 'title', 'format'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Le champ ${field} est requis` },
          { status: 400 }
        );
      }
    }

    // Vérifier si l'ID existe déjà
    const { data: existing } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('id', body.id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Un produit avec cet ID existe déjà' },
        { status: 409 }
      );
    }

    // Préparer les données pour insertion
    const productData = {
      id: body.id,
      title: body.title,
      subtitle: body.subtitle || null,
      format: body.format,
      image: body.image || null,
      description: body.description || null,
      short_description: body.short_description || null,
      long_description: body.long_description || null,
      likes: parseInt(body.likes) || 0,
      file_url: body.file_url || null,
      tags: body.tags || [],
      pages: parseInt(body.pages) || null,
      words: parseInt(body.words) || null,
      size: body.size || null,
      file_type: body.file_type || null,
      images: body.images || [],
      details: body.details || [],
      rights: body.rights || [],
      is_premium: Boolean(body.is_premium),
      downloads: parseInt(body.downloads) || 0,
      rating: parseFloat(body.rating) || 0,
      category: body.category || null,
      instructor: body.instructor || null,
      duration: body.duration || null,
      features: body.features || [],
      permissions: body.permissions || [],
      preview_images: body.preview_images || [],
      download_url: body.download_url || null,
      students: parseInt(body.students) || 0
    };

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la création du produit' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Produit créé avec succès',
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