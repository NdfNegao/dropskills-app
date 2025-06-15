import { NextRequest, NextResponse } from 'next/server';
import { addDocument, listDocuments, deleteDocument } from '@/lib/rag';

// GET - Liste tous les documents
export async function GET() {
  try {
    const documents = await listDocuments();
    
    return NextResponse.json({
      success: true,
      data: documents,
      count: documents.length
    });
  } catch (error) {
    console.error('Erreur GET documents:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des documents' },
      { status: 500 }
    );
  }
}

// POST - Ajoute un nouveau document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, sourceUrl, sourceType, tags, metadata } = body;
    
    // Validation
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Titre et contenu requis' },
        { status: 400 }
      );
    }
    
    if (content.length < 100) {
      return NextResponse.json(
        { success: false, error: 'Le contenu doit faire au moins 100 caractères' },
        { status: 400 }
      );
    }
    
    const documentId = await addDocument(
      title,
      content,
      sourceUrl,
      sourceType || 'document',
      tags || [],
      metadata || {}
    );
    
    return NextResponse.json({
      success: true,
      data: { id: documentId },
      message: 'Document ajouté avec succès'
    });
    
  } catch (error) {
    console.error('Erreur POST document:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'ajout du document' },
      { status: 500 }
    );
  }
}

// DELETE - Supprime un document
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('id');
    
    if (!documentId) {
      return NextResponse.json(
        { success: false, error: 'ID du document requis' },
        { status: 400 }
      );
    }
    
    await deleteDocument(documentId);
    
    return NextResponse.json({
      success: true,
      message: 'Document supprimé avec succès'
    });
    
  } catch (error) {
    console.error('Erreur DELETE document:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression du document' },
      { status: 500 }
    );
  }
}