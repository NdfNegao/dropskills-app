import { NextRequest, NextResponse } from 'next/server';
import { addDocument } from '@/lib/rag';
import { Translate } from '@google-cloud/translate/build/src/v2';

// Import dynamique de pdf-parse pour éviter les problèmes de build
let pdfParse: any = null;
const getPdfParse = async () => {
  if (!pdfParse) {
    try {
      pdfParse = (await import('pdf-parse')).default;
    } catch (error) {
      console.error('Erreur chargement pdf-parse:', error);
      throw new Error('Module pdf-parse non disponible');
    }
  }
  return pdfParse;
};

// Configuration pour l'upload de fichiers
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['application/pdf'];

// Initialiser Google Translate (optionnel)
let translate: Translate | null = null;
try {
  if (process.env.GOOGLE_TRANSLATE_API_KEY) {
    translate = new Translate({
      key: process.env.GOOGLE_TRANSLATE_API_KEY
    });
  }
} catch (error) {
  console.warn('Google Translate non configuré:', error);
}

// Fonction pour détecter la langue du texte
async function detectLanguage(text: string): Promise<string> {
  if (!translate) {
    // Détection simple basée sur des mots courants
    const frenchWords = ['le', 'la', 'les', 'de', 'du', 'des', 'et', 'ou', 'est', 'sont', 'avec', 'pour', 'dans', 'sur', 'par'];
    const englishWords = ['the', 'and', 'or', 'is', 'are', 'with', 'for', 'in', 'on', 'by', 'to', 'of', 'a', 'an'];
    
    const words = text.toLowerCase().split(/\s+/).slice(0, 100); // Analyser les 100 premiers mots
    
    let frenchScore = 0;
    let englishScore = 0;
    
    words.forEach(word => {
      if (frenchWords.includes(word)) frenchScore++;
      if (englishWords.includes(word)) englishScore++;
    });
    
    return frenchScore > englishScore ? 'fr' : 'en';
  }
  
  try {
    const [detection] = await translate.detect(text.substring(0, 1000));
    return detection.language || 'en';
  } catch (error) {
    console.error('Erreur détection langue:', error);
    return 'en';
  }
}

// Fonction pour traduire le texte
async function translateText(text: string, targetLang: string = 'fr'): Promise<string> {
  if (!translate) {
    console.warn('Traduction non disponible - Google Translate non configuré');
    return text;
  }
  
  try {
    // Diviser le texte en chunks pour éviter les limites d'API
    const chunks = [];
    const chunkSize = 4000; // Limite conservative
    
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.substring(i, i + chunkSize));
    }
    
    const translatedChunks = [];
    
    for (const chunk of chunks) {
      const [translation] = await translate.translate(chunk, targetLang);
      translatedChunks.push(translation);
      
      // Petite pause pour éviter les rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return translatedChunks.join('');
  } catch (error) {
    console.error('Erreur traduction:', error);
    return text;
  }
}

// Fonction pour nettoyer et formater le texte extrait
function cleanExtractedText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Normaliser les espaces
    .replace(/\n\s*\n/g, '\n\n') // Normaliser les sauts de ligne
    .replace(/[^\w\s\n\r\.,;:!?()\[\]{}"'-]/g, '') // Supprimer caractères spéciaux
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const sourceType = formData.get('sourceType') as string || 'document';
    const tags = formData.get('tags') as string || '';
    const sourceUrl = formData.get('sourceUrl') as string || '';
    const autoTranslate = formData.get('autoTranslate') === 'true';
    
    // Validation du fichier
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }
    
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Type de fichier non supporté. Seuls les PDF sont acceptés.' },
        { status: 400 }
      );
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `Fichier trop volumineux. Taille maximum: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }
    
    // Validation des métadonnées
    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Titre requis' },
        { status: 400 }
      );
    }
    
    // Convertir le fichier en buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Extraire le texte du PDF
    let extractedText: string;
    try {
      const pdf = await getPdfParse();
      const pdfData = await pdf(buffer);
      extractedText = cleanExtractedText(pdfData.text);
      
      if (extractedText.length < 100) {
        return NextResponse.json(
          { success: false, error: 'Le PDF ne contient pas assez de texte extractible (minimum 100 caractères)' },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('Erreur extraction PDF:', error);
      return NextResponse.json(
        { success: false, error: 'Erreur lors de l\'extraction du texte du PDF' },
        { status: 500 }
      );
    }
    
    // Détecter la langue et traduire si nécessaire
    let finalText = extractedText;
    let detectedLanguage = 'fr';
    let wasTranslated = false;
    
    try {
      detectedLanguage = await detectLanguage(extractedText);
      
      if (autoTranslate && detectedLanguage === 'en') {
        console.log('Document anglais détecté, traduction en cours...');
        finalText = await translateText(extractedText, 'fr');
        wasTranslated = true;
      }
    } catch (error) {
      console.error('Erreur traitement langue:', error);
      // Continuer avec le texte original en cas d'erreur
    }
    
    // Préparer les tags
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
    
    // Ajouter des tags automatiques
    tagArray.push('pdf');
    if (detectedLanguage === 'en') {
      tagArray.push('anglais');
    }
    if (wasTranslated) {
      tagArray.push('traduit');
    }
    
    // Préparer les métadonnées
    const metadata = {
      originalFileName: file.name,
      fileSize: file.size,
      detectedLanguage,
      wasTranslated,
      extractedAt: new Date().toISOString(),
      originalTextLength: extractedText.length,
      finalTextLength: finalText.length
    };
    
    // Ajouter le document à la base RAG
    const documentId = await addDocument(
      title.trim(),
      finalText,
      sourceUrl || undefined,
      sourceType,
      tagArray,
      metadata
    );
    
    return NextResponse.json({
      success: true,
      data: {
        id: documentId,
        title: title.trim(),
        detectedLanguage,
        wasTranslated,
        textLength: finalText.length,
        tags: tagArray
      },
      message: `PDF traité avec succès${wasTranslated ? ' et traduit' : ''}`
    });
    
  } catch (error) {
    console.error('Erreur upload PDF:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur interne lors du traitement du PDF' },
      { status: 500 }
    );
  }
}