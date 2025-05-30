import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { supabase } from '../../../../lib/supabase';

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
    const user = session.user as any;
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    const requests = await supabase.from('product_requests').select('*');

    return NextResponse.json(requests);

  } catch (error) {
    console.error('Erreur API admin product-requests:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des demandes' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Vérifier les permissions admin
    const user = session.user as any;
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    const { id, status, priority, admin_notes, estimated_completion } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID de la demande requis' },
        { status: 400 }
      );
    }

    const updates: any = {};
    
    if (status) {
      if (!['pending', 'in_progress', 'completed', 'rejected'].includes(status)) {
        return NextResponse.json(
          { error: 'Statut invalide' },
          { status: 400 }
        );
      }
      updates.status = status;
    }

    if (priority) {
      if (!['low', 'medium', 'high'].includes(priority)) {
        return NextResponse.json(
          { error: 'Priorité invalide' },
          { status: 400 }
        );
      }
      updates.priority = priority;
    }

    if (admin_notes !== undefined) {
      updates.admin_notes = admin_notes;
    }

    if (estimated_completion) {
      updates.estimated_completion = estimated_completion;
    }

    const updatedRequest = await supabase.from('product_requests').update(updates).eq('id', id).select();

    // Log de l'action admin
    await supabase.from('admin_logs').insert({
      admin_id: user.id || user.email,
      action: 'UPDATE_PRODUCT_REQUEST',
      resource_type: 'product_request',
      resource_id: id
    });

    return NextResponse.json({
      success: true,
      message: 'Demande mise à jour avec succès',
      request: updatedRequest
    });

  } catch (error) {
    console.error('Erreur API admin product-requests PUT:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la demande' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Vérifier les permissions admin
    const user = session.user as any;
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID de la demande requis' },
        { status: 400 }
      );
    }

    await supabase.from('product_requests').delete().eq('id', id);

    // Log de l'action admin
    await supabase.from('admin_logs').insert({
      admin_id: user.id || user.email,
      action: 'DELETE_PRODUCT_REQUEST',
      resource_type: 'product_request',
      resource_id: id
    });

    return NextResponse.json({
      success: true,
      message: 'Demande supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur API admin product-requests DELETE:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la demande' },
      { status: 500 }
    );
  }
} 