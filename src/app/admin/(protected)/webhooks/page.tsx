'use client';

import { useState } from 'react';
import { Webhook, Plus, Edit, Trash2, Activity, AlertCircle } from 'lucide-react';

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  lastTriggered?: string;
}

const mockWebhooks: WebhookConfig[] = [
  {
    id: '1',
    name: 'N8N Automation',
    url: 'https://n8n.dropskills.com/webhook/products',
    events: ['product.created', 'product.updated'],
    active: true,
    lastTriggered: '2024-01-15 14:30:00'
  },
  {
    id: '2',
    name: 'Analytics Tracker',
    url: 'https://analytics.dropskills.com/webhook/events',
    events: ['user.registered', 'product.downloaded'],
    active: false,
    lastTriggered: '2024-01-10 09:15:00'
  }
];

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>(mockWebhooks);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Webhooks</h1>
          <p className="text-gray-400 mt-2">Gérez les webhooks pour l'automatisation et les intégrations</p>
        </div>
        <button className="bg-[#ff0033] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#cc0029] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouveau Webhook
        </button>
      </div>

      {/* Liste des webhooks */}
      <div className="bg-[#111111] rounded-xl border border-[#232323]">
        <div className="p-6 border-b border-[#232323]">
          <h3 className="text-lg font-semibold text-white">Webhooks configurés</h3>
        </div>
        
        <div className="divide-y divide-[#232323]">
          {webhooks.map((webhook) => (
            <div key={webhook.id} className="p-6 hover:bg-[#1a1a1a] transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${webhook.active ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
                    <Webhook className={`w-5 h-5 ${webhook.active ? 'text-green-400' : 'text-gray-400'}`} />
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium">{webhook.name}</h4>
                    <p className="text-sm text-gray-400 mt-1">{webhook.url}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">Événements:</span>
                      {webhook.events.map((event, index) => (
                        <span key={index} className="text-xs bg-[#232323] text-gray-300 px-2 py-1 rounded">
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`flex items-center gap-1 ${webhook.active ? 'text-green-400' : 'text-gray-400'}`}>
                      <Activity className="w-4 h-4" />
                      <span className="text-sm">{webhook.active ? 'Actif' : 'Inactif'}</span>
                    </div>
                    {webhook.lastTriggered && (
                      <p className="text-xs text-gray-500 mt-1">
                        Dernier: {webhook.lastTriggered}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration des événements */}
      <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
        <h3 className="text-lg font-semibold text-white mb-4">Événements disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            'product.created',
            'product.updated', 
            'product.deleted',
            'user.registered',
            'user.updated',
            'product.downloaded',
            'request.created',
            'sample.downloaded'
          ].map((event) => (
            <div key={event} className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg">
              <AlertCircle className="w-4 h-4 text-[#ff0033]" />
              <span className="text-sm text-gray-300">{event}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 