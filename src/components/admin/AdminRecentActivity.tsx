import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Webhook, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  User,
  CreditCard,
  RefreshCw
} from 'lucide-react';

interface WebhookEvent {
  id: string;
  eventType: string;
  provider: string;
  status: string;
  createdAt: Date;
  userEmail: string | null;
}

interface AdminRecentActivityProps {
  webhooks: WebhookEvent[];
}

const getEventIcon = (eventType: string) => {
  switch (eventType) {
    case 'USER_CREATED':
      return User;
    case 'PURCHASE_COMPLETED':
    case 'PACK_PURCHASED':
      return CreditCard;
    case 'PURCHASE_REFUNDED':
      return RefreshCw;
    default:
      return Webhook;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'PROCESSED':
      return CheckCircle;
    case 'ERROR':
    case 'FAILED':
      return XCircle;
    case 'PROCESSING':
      return Clock;
    default:
      return AlertCircle;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PROCESSED':
      return 'text-green-500';
    case 'ERROR':
    case 'FAILED':
      return 'text-red-500';
    case 'PROCESSING':
      return 'text-yellow-500';
    default:
      return 'text-gray-500';
  }
};

const getEventLabel = (eventType: string) => {
  switch (eventType) {
    case 'USER_CREATED':
      return 'Nouvel utilisateur';
    case 'PURCHASE_COMPLETED':
      return 'Achat effectué';
    case 'PACK_PURCHASED':
      return 'Pack acheté';
    case 'PURCHASE_REFUNDED':
      return 'Remboursement';
    case 'SUBSCRIPTION_CREATED':
      return 'Nouvel abonnement';
    default:
      return eventType.replace('_', ' ');
  }
};

export default function AdminRecentActivity({ webhooks }: AdminRecentActivityProps) {
  return (
    <div className="bg-[#111111] rounded-xl p-6 border border-[#232323]">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Webhook className="w-5 h-5 text-[#ff0033]" />
        Activité récente
      </h3>
      
      {webhooks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">Aucune activité récente</p>
        </div>
      ) : (
        <div className="space-y-3">
          {webhooks.map((webhook) => {
            const EventIcon = getEventIcon(webhook.eventType);
            const StatusIcon = getStatusIcon(webhook.status);
            const statusColor = getStatusColor(webhook.status);
            
            return (
              <div
                key={webhook.id}
                className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg border border-[#232323]"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#232323] rounded-lg">
                    <EventIcon className="w-4 h-4 text-[#ff0033]" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {getEventLabel(webhook.eventType)}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{webhook.provider}</span>
                      {webhook.userEmail && (
                        <>
                          <span>•</span>
                          <span>{webhook.userEmail}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1 ${statusColor}`}>
                    <StatusIcon className="w-4 h-4" />
                    <span className="text-sm capitalize">{webhook.status.toLowerCase()}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(webhook.createdAt), { 
                      addSuffix: true, 
                      locale: fr 
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 