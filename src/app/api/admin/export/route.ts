import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Vérification des permissions admin
const isAdmin = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) return false;
  return true;
};

// GET /api/admin/export - Exporter les données du dashboard
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const format = searchParams.get('format') || 'json';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let exportData: any = {};

    // Définir la plage de dates
    const dateFilter = {
      start: startDate ? new Date(startDate).toISOString() : 
             new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end: endDate ? new Date(endDate).toISOString() : new Date().toISOString()
    };

    // Exporter selon le type demandé
    switch (type) {
      case 'analytics':
        exportData = await exportAnalytics(dateFilter);
        break;
      case 'tools':
        exportData = await exportTools();
        break;
      case 'prompts':
        exportData = await exportPrompts();
        break;
      case 'configs':
        exportData = await exportConfigs();
        break;
      case 'usage':
        exportData = await exportUsageLogs(dateFilter);
        break;
      case 'all':
      default:
        exportData = {
          analytics: await exportAnalytics(dateFilter),
          tools: await exportTools(),
          prompts: await exportPrompts(),
          configs: await exportConfigs(),
          usage: await exportUsageLogs(dateFilter),
          exportInfo: {
            exportedAt: new Date().toISOString(),
            exportedBy: session.user.email,
            dateRange: dateFilter,
            type
          }
        };
        break;
    }

    // Formater la réponse selon le format demandé
    if (format === 'csv') {
      const csv = convertToCSV(exportData, type);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="ai-dashboard-export-${type}-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    // Format JSON par défaut
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="ai-dashboard-export-${type}-${new Date().toISOString().split('T')[0]}.json"`
      }
    });
  } catch (error) {
    console.error('Erreur export données:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'export' },
      { status: 500 }
    );
  }
}

// Fonction pour exporter les analytics
async function exportAnalytics(dateFilter: { start: string; end: string }) {
  const { data: usageLogs } = await supabaseAdmin
    .from('ai_usage_logs')
    .select(`
      *,
      ai_tools(name, category),
      users(email)
    `)
    .gte('created_at', dateFilter.start)
    .lte('created_at', dateFilter.end)
    .order('created_at', { ascending: false });

  // Calculer les métriques agrégées
  const metrics = {
    totalRequests: usageLogs?.length || 0,
    successfulRequests: usageLogs?.filter(log => log.success).length || 0,
    failedRequests: usageLogs?.filter(log => !log.success).length || 0,
    totalTokens: usageLogs?.reduce((sum, log) => sum + (log.tokens_used || 0), 0) || 0,
    totalCost: usageLogs?.reduce((sum, log) => sum + (log.cost || 0), 0) || 0,
    avgResponseTime: usageLogs?.length ? 
      usageLogs.reduce((sum, log) => sum + (log.response_time || 0), 0) / usageLogs.length : 0,
    uniqueUsers: new Set(usageLogs?.map(log => log.user_id)).size,
    uniqueTools: new Set(usageLogs?.map(log => log.tool_id)).size
  };

  return {
    metrics,
    logs: usageLogs,
    dateRange: dateFilter
  };
}

// Fonction pour exporter les outils
async function exportTools() {
  const { data: tools } = await supabaseAdmin
    .from('ai_tools')
    .select(`
      *,
      ai_tool_configs(
        provider,
        model,
        parameters,
        is_active,
        created_at
      ),
      ai_prompts(
        name,
        description,
        ai_prompt_versions(
          version,
          content,
          is_active
        )
      )
    `)
    .order('created_at', { ascending: false });

  return tools || [];
}

// Fonction pour exporter les prompts
async function exportPrompts() {
  const { data: prompts } = await supabaseAdmin
    .from('ai_prompts')
    .select(`
      *,
      ai_prompt_versions(
        version,
        content,
        system_prompt,
        parameters,
        changelog,
        is_active,
        created_at
      )
    `)
    .order('created_at', { ascending: false });

  return prompts || [];
}

// Fonction pour exporter les configurations
async function exportConfigs() {
  const { data: configs } = await supabaseAdmin
    .from('ai_tool_configs')
    .select(`
      *,
      ai_tools(name, category)
    `)
    .order('created_at', { ascending: false });

  return configs || [];
}

// Fonction pour exporter les logs d'usage
async function exportUsageLogs(dateFilter: { start: string; end: string }) {
  const { data: logs } = await supabaseAdmin
    .from('ai_usage_logs')
    .select(`
      *,
      ai_tools(name, category),
      users(email)
    `)
    .gte('created_at', dateFilter.start)
    .lte('created_at', dateFilter.end)
    .order('created_at', { ascending: false })
    .limit(10000); // Limiter pour éviter les exports trop volumineux

  return logs || [];
}

// Fonction pour convertir en CSV
function convertToCSV(data: any, type: string): string {
  if (type === 'analytics' && data.logs) {
    return convertLogsToCSV(data.logs);
  }
  
  if (type === 'usage' && Array.isArray(data)) {
    return convertLogsToCSV(data);
  }
  
  if (type === 'tools' && Array.isArray(data)) {
    return convertToolsToCSV(data);
  }
  
  if (type === 'prompts' && Array.isArray(data)) {
    return convertPromptsToCSV(data);
  }
  
  // Fallback: convertir en CSV générique
  return convertGenericToCSV(data);
}

function convertLogsToCSV(logs: any[]): string {
  if (!logs || logs.length === 0) return 'Aucune donnée à exporter';
  
  const headers = [
    'Date',
    'Outil',
    'Catégorie',
    'Utilisateur',
    'Succès',
    'Temps de réponse (ms)',
    'Tokens utilisés',
    'Coût ($)',
    'Modèle',
    'Provider'
  ];
  
  const rows = logs.map(log => [
    new Date(log.created_at).toLocaleString(),
    log.ai_tools?.name || 'N/A',
    log.ai_tools?.category || 'N/A',
    log.users?.email || 'N/A',
    log.success ? 'Oui' : 'Non',
    log.response_time || 0,
    log.tokens_used || 0,
    log.cost || 0,
    log.model || 'N/A',
    log.provider || 'N/A'
  ]);
  
  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
}

function convertToolsToCSV(tools: any[]): string {
  if (!tools || tools.length === 0) return 'Aucune donnée à exporter';
  
  const headers = [
    'Nom',
    'Description',
    'Catégorie',
    'Chemin',
    'Actif',
    'Date de création',
    'Provider actuel',
    'Modèle actuel'
  ];
  
  const rows = tools.map(tool => {
    const activeConfig = tool.ai_tool_configs?.find((c: any) => c.is_active);
    return [
      tool.name,
      tool.description || '',
      tool.category || '',
      tool.path || '',
      tool.is_active ? 'Oui' : 'Non',
      new Date(tool.created_at).toLocaleString(),
      activeConfig?.provider || 'N/A',
      activeConfig?.model || 'N/A'
    ];
  });
  
  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
}

function convertPromptsToCSV(prompts: any[]): string {
  if (!prompts || prompts.length === 0) return 'Aucune donnée à exporter';
  
  const headers = [
    'Nom',
    'Description',
    'Catégorie',
    'Actif',
    'Versions totales',
    'Version active',
    'Date de création'
  ];
  
  const rows = prompts.map(prompt => {
    const activeVersion = prompt.ai_prompt_versions?.find((v: any) => v.is_active);
    return [
      prompt.name,
      prompt.description || '',
      prompt.category || '',
      prompt.is_active ? 'Oui' : 'Non',
      prompt.ai_prompt_versions?.length || 0,
      activeVersion?.version || 'N/A',
      new Date(prompt.created_at).toLocaleString()
    ];
  });
  
  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
}

function convertGenericToCSV(data: any): string {
  return JSON.stringify(data, null, 2);
}
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