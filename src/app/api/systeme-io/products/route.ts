import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Interface pour les produits Systeme.io
interface SystemeIoProduct {
  id: string;
  name: string;
  price: number;
  currency: string;
  status: 'active' | 'inactive';
  pack_id?: string; // ID du pack DropSkills correspondant
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const packId = searchParams.get('pack_id');

    // Si pack_id fourni, récupérer le mapping spécifique
    if (packId) {
      const { data: mapping, error } = await supabaseAdmin
        .from('systeme_io_products')
        .select(`
          *,
          pack:packs(
            id,
            title,
            slug,
            price,
            status
          )
        `)
        .eq('pack_id', packId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return NextResponse.json({
        success: true,
        data: mapping || null
      });
    }

    // Récupérer tous les mappings
    const { data: mappings, error } = await supabaseAdmin
      .from('systeme_io_products')
      .select(`
        *,
        pack:packs(
          id,
          title,
          slug,
          price,
          status
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: mappings || [],
      count: mappings?.length || 0
    });

  } catch (error) {
    console.error('❌ Erreur récupération produits Systeme.io:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      systeme_io_product_id,
      pack_id,
      product_name,
      product_price,
      currency = 'EUR',
      status = 'active'
    } = await request.json();

    if (!systeme_io_product_id || !pack_id) {
      return NextResponse.json({
        success: false,
        error: 'systeme_io_product_id et pack_id sont requis'
      }, { status: 400 });
    }

    // Vérifier que le pack existe
    const { data: pack, error: packError } = await supabaseAdmin
      .from('packs')
      .select('id, title, price')
      .eq('id', pack_id)
      .single();

    if (packError || !pack) {
      return NextResponse.json({
        success: false,
        error: 'Pack non trouvé'
      }, { status: 404 });
    }

    // Créer ou mettre à jour le mapping
    const { data: mapping, error } = await supabaseAdmin
      .from('systeme_io_products')
      .upsert({
        systeme_io_product_id,
        pack_id,
        product_name: product_name || pack.title,
        product_price: product_price || pack.price,
        currency,
        status,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'systeme_io_product_id'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log('✅ Mapping Systeme.io créé:', mapping);

    return NextResponse.json({
      success: true,
      message: 'Mapping créé avec succès',
      data: mapping
    });

  } catch (error) {
    console.error('❌ Erreur création mapping Systeme.io:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      systeme_io_product_id,
      pack_id,
      product_name,
      product_price,
      currency,
      status
    } = await request.json();

    if (!systeme_io_product_id) {
      return NextResponse.json({
        success: false,
        error: 'systeme_io_product_id requis'
      }, { status: 400 });
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (pack_id) updateData.pack_id = pack_id;
    if (product_name) updateData.product_name = product_name;
    if (product_price !== undefined) updateData.product_price = product_price;
    if (currency) updateData.currency = currency;
    if (status) updateData.status = status;

    const { data: mapping, error } = await supabaseAdmin
      .from('systeme_io_products')
      .update(updateData)
      .eq('systeme_io_product_id', systeme_io_product_id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Mapping mis à jour avec succès',
      data: mapping
    });

  } catch (error) {
    console.error('❌ Erreur mise à jour mapping Systeme.io:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const systemeIoProductId = searchParams.get('product_id');

    if (!systemeIoProductId) {
      return NextResponse.json({
        success: false,
        error: 'product_id requis'
      }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('systeme_io_products')
      .delete()
      .eq('systeme_io_product_id', systemeIoProductId);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Mapping supprimé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur suppression mapping Systeme.io:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
} 