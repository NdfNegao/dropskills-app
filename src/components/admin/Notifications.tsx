import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Bell, X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  timestamp: Date;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Écouter les changements sur la table ai_tool_logs
    const channel = supabase
      .channel('ai_tool_logs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_tool_logs'
        },
        (payload) => {
          const newLog = payload.new as any;
          let notification: Notification;

          switch (payload.eventType) {
            case 'INSERT':
              notification = {
                id: newLog.id,
                type: newLog.status === 'success' ? 'success' : 'error',
                message: `Nouvelle utilisation de ${newLog.ai_tools?.name || 'un outil'}`,
                timestamp: new Date()
              };
              break;
            case 'UPDATE':
              notification = {
                id: newLog.id,
                type: 'info',
                message: `Mise à jour du statut pour ${newLog.ai_tools?.name || 'un outil'}`,
                timestamp: new Date()
              };
              break;
            default:
              return;
          }

          setNotifications(prev => [notification, ...prev].slice(0, 5));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-[#111] border border-[#232323] rounded-lg p-4 shadow-lg flex items-start gap-3 min-w-[300px] max-w-md animate-slide-in"
        >
          {getIcon(notification.type)}
          <div className="flex-1">
            <p className="text-white text-sm">{notification.message}</p>
            <p className="text-gray-400 text-xs mt-1">
              {notification.timestamp.toLocaleTimeString('fr-FR')}
            </p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
} 