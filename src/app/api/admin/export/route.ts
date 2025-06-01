import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';

// Vérification des permissions admin
const isAdmin = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return false;
  
  const supabase = createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('can_access_admin, is_super_admin')
    .eq('email', session.user.email)
    .single();
    
  return profile?.can_access_admin || profile?.is_super_admin;
};

export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'csv';
  const type = searchParams.get('type') || 'tools';
  const period = searchParams.get('period') || '7d';

  const supabase = createClient();

  try {
    let data;
    let filename;
    let contentType;

    // Récupérer les données selon le type demandé
    if (type === 'tools') {
      const { data: tools, error } = await supabase
        .from('ai_tools')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      data = tools;
      filename = `ai-tools-export-${new Date().toISOString().split('T')[0]}`;
    } else if (type === 'logs') {
      const { data: logs, error } = await supabase
        .from('ai_tool_logs')
        .select(`
          *,
          ai_tools (name),
          profiles (email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      data = logs;
      filename = `ai-logs-export-${new Date().toISOString().split('T')[0]}`;
    }

    // Générer le fichier selon le format demandé
    if (format === 'csv') {
      const parser = new Parser();
      const csv = parser.parse(data);
      contentType = 'text/csv';
      filename += '.csv';

      return new NextResponse(csv, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    } else if (format === 'pdf') {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      
      // En-tête du PDF
      doc.fontSize(20).text('Rapport DropSkills', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, { align: 'center' });
      doc.moveDown();

      // Contenu du PDF
      if (type === 'tools') {
        doc.fontSize(16).text('Liste des outils IA');
        doc.moveDown();
        data.forEach((tool: any) => {
          doc.fontSize(14).text(tool.name);
          doc.fontSize(12).text(tool.description);
          doc.fontSize(10).text(`Catégorie: ${tool.category}`);
          doc.fontSize(10).text(`Modèle: ${tool.model}`);
          doc.moveDown();
        });
      } else if (type === 'logs') {
        doc.fontSize(16).text('Logs d\'utilisation');
        doc.moveDown();
        data.forEach((log: any) => {
          doc.fontSize(12).text(`Outil: ${log.ai_tools.name}`);
          doc.fontSize(10).text(`Utilisateur: ${log.profiles.email}`);
          doc.fontSize(10).text(`Date: ${new Date(log.created_at).toLocaleString('fr-FR')}`);
          doc.fontSize(10).text(`Statut: ${log.status}`);
          doc.moveDown();
        });
      }

      doc.end();

      return new Promise((resolve) => {
        doc.on('end', () => {
          const pdf = Buffer.concat(chunks);
          resolve(new NextResponse(pdf, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="${filename}.pdf"`,
            },
          }));
        });
      });
    }

    return new NextResponse('Format non supporté', { status: 400 });
  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
    return new NextResponse('Erreur lors de l\'export', { status: 500 });
  }
}