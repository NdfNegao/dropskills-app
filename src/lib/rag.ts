import OpenAI from 'openai';
import { supabaseAdmin } from './supabase';

// Configuration OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Types pour le RAG
export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  source_url?: string;
  source_type: string;
  tags: string[];
  metadata?: Record<string, any>;
}

export interface KnowledgeChunk {
  id: string;
  document_id: string;
  chunk_text: string;
  chunk_index: number;
  token_count?: number;
}

export interface SearchResult {
  id: string;
  document_id: string;
  chunk_text: string;
  document_title: string;
  source_url?: string;
  tags: string[];
  similarity: number;
}

export interface RAGResponse {
  answer: string;
  sources: SearchResult[];
  confidence: number;
}

/**
 * Génère un embedding pour un texte donné
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text.replace(/\n/g, ' '), // Nettoie le texte
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Erreur génération embedding:', error);
    throw new Error('Impossible de générer l\'embedding');
  }
}

/**
 * Découpe un texte en chunks de taille optimale
 */
export function chunkText(text: string, maxTokens: number = 500): string[] {
  // Estimation simple : ~4 caractères par token
  const maxChars = maxTokens * 4;
  const chunks: string[] = [];
  
  // Découpe par paragraphes d'abord
  const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
  
  let currentChunk = '';
  
  for (const paragraph of paragraphs) {
    if ((currentChunk + paragraph).length <= maxChars) {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      
      // Si le paragraphe est trop long, le découper par phrases
      if (paragraph.length > maxChars) {
        const sentences = paragraph.split(/[.!?]+/).filter(s => s.trim().length > 0);
        let sentenceChunk = '';
        
        for (const sentence of sentences) {
          if ((sentenceChunk + sentence).length <= maxChars) {
            sentenceChunk += (sentenceChunk ? '. ' : '') + sentence.trim();
          } else {
            if (sentenceChunk) {
              chunks.push(sentenceChunk.trim() + '.');
            }
            sentenceChunk = sentence.trim();
          }
        }
        
        if (sentenceChunk) {
          chunks.push(sentenceChunk.trim() + '.');
        }
        currentChunk = '';
      } else {
        currentChunk = paragraph;
      }
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks.filter(chunk => chunk.length > 50); // Évite les chunks trop petits
}

/**
 * Ajoute un document à la base de connaissances
 */
export async function addDocument(
  title: string,
  content: string,
  sourceUrl?: string,
  sourceType: string = 'document',
  tags: string[] = [],
  metadata: Record<string, any> = {}
): Promise<string> {
  try {
    // 1. Insérer le document
    const { data: document, error: docError } = await supabaseAdmin
      .from('knowledge_documents')
      .insert({
        title,
        content,
        source_url: sourceUrl,
        source_type: sourceType,
        tags,
        metadata
      })
      .select('id')
      .single();
    
    if (docError) throw docError;
    
    // 2. Découper le contenu en chunks
    const chunks = chunkText(content);
    
    // 3. Générer les embeddings et insérer les chunks
    const chunkInserts = [];
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await generateEmbedding(chunk);
      
      chunkInserts.push({
        document_id: document.id,
        chunk_text: chunk,
        chunk_index: i,
        embedding: JSON.stringify(embedding), // Supabase attend une string pour les vecteurs
        token_count: Math.ceil(chunk.length / 4) // Estimation
      });
    }
    
    const { error: chunksError } = await supabaseAdmin
      .from('knowledge_chunks')
      .insert(chunkInserts);
    
    if (chunksError) throw chunksError;
    
    console.log(`Document ajouté: ${title} (${chunks.length} chunks)`);
    return document.id;
    
  } catch (error) {
    console.error('Erreur ajout document:', error);
    throw error;
  }
}

/**
 * Recherche les chunks les plus pertinents pour une question
 */
export async function searchKnowledge(
  query: string,
  limit: number = 5,
  threshold: number = 0.7
): Promise<SearchResult[]> {
  try {
    // 1. Générer l'embedding de la question
    const queryEmbedding = await generateEmbedding(query);
    
    // 2. Rechercher les chunks similaires
    const { data, error } = await supabaseAdmin
      .rpc('search_knowledge_chunks', {
        query_embedding: JSON.stringify(queryEmbedding),
        match_threshold: threshold,
        match_count: limit
      });
    
    if (error) throw error;
    
    return data || [];
    
  } catch (error) {
    console.error('Erreur recherche knowledge:', error);
    return [];
  }
}

/**
 * Génère une réponse RAG complète
 */
export async function generateRAGResponse(
  question: string,
  systemPrompt?: string
): Promise<RAGResponse> {
  try {
    // 1. Rechercher les passages pertinents
    const searchResults = await searchKnowledge(question, 3, 0.6);
    
    // 2. Préparer le contexte
    const context = searchResults
      .map(result => `**${result.document_title}**\n${result.chunk_text}`)
      .join('\n\n---\n\n');
    
    // 3. Préparer le prompt système
    const defaultSystemPrompt = `Tu es Master Mentor AI, l'expert Dropskills en marketing digital, copywriting et intelligence artificielle.

Tu disposes d'une base de connaissances documentaire pour répondre aux questions.

Règles importantes :
- Utilise UNIQUEMENT les informations de la base documentaire ci-dessous
- Si l'information n'est pas dans les documents, dis-le clairement
- Reste pragmatique, orienté résultats et data-driven
- Adapte ton ton selon le niveau de l'utilisateur
- Propose des actions concrètes quand c'est pertinent

Base documentaire :`;
    
    const finalSystemPrompt = systemPrompt || defaultSystemPrompt;
    
    // 4. Générer la réponse
    const messages = [
      {
        role: 'system' as const,
        content: `${finalSystemPrompt}\n\n${context}`
      },
      {
        role: 'user' as const,
        content: question
      }
    ];
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      presence_penalty: 0.1
    });
    
    const answer = response.choices[0]?.message?.content || 'Désolé, je n\'ai pas pu générer une réponse.';
    
    // 5. Calculer la confiance basée sur la similarité moyenne
    const avgSimilarity = searchResults.length > 0 
      ? searchResults.reduce((sum, r) => sum + r.similarity, 0) / searchResults.length
      : 0;
    
    return {
      answer,
      sources: searchResults,
      confidence: avgSimilarity
    };
    
  } catch (error) {
    console.error('Erreur génération RAG:', error);
    return {
      answer: 'Désolé, une erreur est survenue lors de la génération de la réponse.',
      sources: [],
      confidence: 0
    };
  }
}

/**
 * Supprime un document et tous ses chunks
 */
export async function deleteDocument(documentId: string): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from('knowledge_documents')
      .delete()
      .eq('id', documentId);
    
    if (error) throw error;
    
    console.log(`Document supprimé: ${documentId}`);
  } catch (error) {
    console.error('Erreur suppression document:', error);
    throw error;
  }
}

/**
 * Liste tous les documents de la base de connaissances
 */
export async function listDocuments(): Promise<KnowledgeDocument[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('knowledge_documents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Erreur liste documents:', error);
    return [];
  }
}