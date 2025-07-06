'use client';

import { useState, useEffect } from 'react';
import AdminLayoutWithSidebar from '@/components/admin/AdminLayoutWithSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, Search, BookOpen, Database, Zap, Upload } from 'lucide-react';
import { toast } from 'sonner';
import PDFUpload from '@/components/rag/PDFUpload';

interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  source_url?: string;
  source_type: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface SearchResult {
  id: string;
  document_id: string;
  chunk_text: string;
  document_title: string;
  source_url?: string;
  tags: string[];
  similarity: number;
}

export default function RAGAdminPage() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Formulaire d'ajout de document
  const [newDoc, setNewDoc] = useState({
    title: '',
    content: '',
    sourceUrl: '',
    sourceType: 'document',
    tags: ''
  });

  // Charger les documents au montage
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/rag/documents');
      const data = await response.json();
      
      if (data.success) {
        setDocuments(data.data);
      } else {
        toast.error('Erreur lors du chargement des documents');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const addDocument = async () => {
    if (!newDoc.title || !newDoc.content) {
      toast.error('Titre et contenu requis');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/rag/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newDoc.title,
          content: newDoc.content,
          sourceUrl: newDoc.sourceUrl || undefined,
          sourceType: newDoc.sourceType,
          tags: newDoc.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Document ajouté avec succès');
        setNewDoc({ title: '', content: '', sourceUrl: '', sourceType: 'document', tags: '' });
        loadDocuments();
      } else {
        toast.error(data.error || 'Erreur lors de l\'ajout');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/rag/documents?id=${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Document supprimé');
        loadDocuments();
      } else {
        toast.error(data.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const searchKnowledge = async () => {
    if (!searchQuery.trim()) {
      toast.error('Veuillez saisir une requête');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/rag/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: searchQuery,
          mode: 'search',
          limit: 10
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.data.results);
        toast.success(`${data.data.results.length} résultats trouvés`);
      } else {
        toast.error(data.error || 'Erreur lors de la recherche');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const getSourceTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      document: 'bg-blue-100 text-blue-800',
      article: 'bg-green-100 text-green-800',
      guide: 'bg-purple-100 text-purple-800',
      faq: 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const statsData = [
    {
      title: "Documents",
      value: documents.length.toString(),
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      title: "Base de données",
      value: "Active",
      icon: <Database className="w-5 h-5" />
    },
    {
      title: "Recherche",
      value: searchResults.length.toString(),
      icon: <Search className="w-5 h-5" />
    },
    {
      title: "Upload PDF",
      value: "Disponible",
      icon: <Upload className="w-5 h-5" />
    }
  ];

  return (
    <AdminLayoutWithSidebar
      icon={<Database className="w-5 h-5" />}
      title="Administration RAG"
      subtitle="Gestion de la base de connaissances du Master Mentor"
      stats={statsData}
    >

      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Recherche
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload PDF
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ajouter
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents de la base de connaissances</CardTitle>
              <CardDescription>
                Liste de tous les documents indexés avec leurs métadonnées
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Chargement...</p>
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucun document dans la base de connaissances</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{doc.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {doc.content.substring(0, 200)}...
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteDocument(doc.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={getSourceTypeColor(doc.source_type)}>
                          {doc.source_type}
                        </Badge>
                        {doc.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      {doc.source_url && (
                        <p className="text-xs text-muted-foreground">
                          Source: {doc.source_url}
                        </p>
                      )}
                      
                      <p className="text-xs text-muted-foreground">
                        Créé le {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test de recherche vectorielle</CardTitle>
              <CardDescription>
                Testez la recherche dans la base de connaissances
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Posez une question..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchKnowledge()}
                />
                <Button onClick={searchKnowledge} disabled={loading}>
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
              </div>
              
              {searchResults.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Résultats ({searchResults.length})</h3>
                  {searchResults.map((result) => (
                    <div key={result.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{result.document_title}</h4>
                        <Badge variant="outline">
                          {(result.similarity * 100).toFixed(1)}% similaire
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {result.chunk_text.substring(0, 300)}...
                      </p>
                      <div className="flex gap-1">
                        {result.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload de documents PDF</CardTitle>
              <CardDescription>
                Uploadez des fichiers PDF qui seront automatiquement traités et ajoutés à la base de connaissances.
                Les documents en anglais peuvent être traduits automatiquement en français.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PDFUpload 
                onUploadSuccess={(result) => {
                  console.log('PDF uploadé:', result);
                  loadDocuments(); // Recharger la liste des documents
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ajouter un document</CardTitle>
              <CardDescription>
                Ajoutez un nouveau document à la base de connaissances
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    placeholder="Titre du document"
                    value={newDoc.title}
                    onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sourceType">Type de source</Label>
                  <Select value={newDoc.sourceType} onValueChange={(value) => setNewDoc({ ...newDoc, sourceType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="guide">Guide</SelectItem>
                      <SelectItem value="faq">FAQ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sourceUrl">URL source (optionnel)</Label>
                <Input
                  id="sourceUrl"
                  placeholder="https://..."
                  value={newDoc.sourceUrl}
                  onChange={(e) => setNewDoc({ ...newDoc, sourceUrl: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                <Input
                  id="tags"
                  placeholder="marketing, copywriting, ia"
                  value={newDoc.tags}
                  onChange={(e) => setNewDoc({ ...newDoc, tags: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Contenu *</Label>
                <Textarea
                  id="content"
                  placeholder="Contenu du document (minimum 100 caractères)"
                  value={newDoc.content}
                  onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
                  rows={10}
                />
                <p className="text-xs text-muted-foreground">
                  {newDoc.content.length} caractères
                </p>
              </div>
              
              <Button onClick={addDocument} disabled={loading} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter le document
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayoutWithSidebar>
  );
}