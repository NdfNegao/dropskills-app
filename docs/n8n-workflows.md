# 🔄 Workflows n8n pour DropSkills

## 📋 Vue d'ensemble

Ce document décrit les workflows n8n recommandés pour automatiser les processus de DropSkills.

## 🚀 Workflow 1 : Traitement des ventes Systeme.io

### Description
Automatise le traitement des ventes provenant de Systeme.io : création d'utilisateur, attribution de pack, envoi d'email de bienvenue.

### Configuration

```json
{
  "name": "DropSkills - Systeme.io Sales Processing",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "systeme-io-webhook",
        "responseMode": "responseNode"
      },
      "id": "webhook-trigger",
      "name": "Webhook Systeme.io",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.event_type}}",
              "operation": "equal",
              "value2": "order.completed"
            }
          ]
        }
      },
      "id": "filter-order-completed",
      "name": "Filter Order Completed",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "url": "={{$env.DROPSKILLS_API_URL}}/api/n8n/users",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "x-api-key",
              "value": "={{$env.N8N_API_KEY}}"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "email",
              "value": "={{$json.customer.email}}"
            },
            {
              "name": "firstName",
              "value": "={{$json.customer.first_name}}"
            },
            {
              "name": "lastName",
              "value": "={{$json.customer.last_name}}"
            },
            {
              "name": "provider",
              "value": "SYSTEME_IO"
            }
          ]
        }
      },
      "id": "create-user",
      "name": "Create/Update User",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 3,
      "position": [680, 200]
    },
    {
      "parameters": {
        "url": "={{$env.DROPSKILLS_API_URL}}/api/n8n/pack-access",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "x-api-key",
              "value": "={{$env.N8N_API_KEY}}"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "userEmail",
              "value": "={{$json.customer.email}}"
            },
            {
              "name": "productId",
              "value": "={{$json.product.id}}"
            },
            {
              "name": "transactionId",
              "value": "={{$json.order.id}}"
            },
            {
              "name": "amount",
              "value": "={{$json.order.total_amount}}"
            }
          ]
        }
      },
      "id": "grant-pack-access",
      "name": "Grant Pack Access",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 3,
      "position": [900, 200]
    },
    {
      "parameters": {
        "fromEmail": "noreply@dropskills.com",
        "toEmail": "={{$json.customer.email}}",
        "subject": "Bienvenue sur DropSkills ! Votre pack est prêt",
        "text": "Bonjour {{$json.customer.first_name}},\n\nMerci pour votre achat ! Votre pack est maintenant disponible dans votre espace membre.\n\nConnectez-vous sur https://dropskills.com pour y accéder.\n\nL'équipe DropSkills"
      },
      "id": "send-welcome-email",
      "name": "Send Welcome Email",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2,
      "position": [1120, 200]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={\"success\": true, \"message\": \"Order processed successfully\"}"
      },
      "id": "webhook-response",
      "name": "Webhook Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [1340, 300]
    }
  ],
  "connections": {
    "Webhook Systeme.io": {
      "main": [
        [
          {
            "node": "Filter Order Completed",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Filter Order Completed": {
      "main": [
        [
          {
            "node": "Create/Update User",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Create/Update User": {
      "main": [
        [
          {
            "node": "Grant Pack Access",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Grant Pack Access": {
      "main": [
        [
          {
            "node": "Send Welcome Email",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Send Welcome Email": {
      "main": [
        [
          {
            "node": "Webhook Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## 🚀 Workflow 2 : Synchronisation quotidienne des métriques

### Description
Collecte et synchronise les métriques quotidiennes depuis différentes sources.

### Configuration

```json
{
  "name": "DropSkills - Daily Metrics Sync",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "expression": "0 2 * * *"
            }
          ]
        }
      },
      "id": "cron-trigger",
      "name": "Daily at 2 AM",
      "type": "n8n-nodes-base.cron",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "url": "={{$env.DROPSKILLS_API_URL}}/api/n8n/analytics/daily",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "x-api-key",
              "value": "={{$env.N8N_API_KEY}}"
            }
          ]
        }
      },
      "id": "get-daily-metrics",
      "name": "Get Daily Metrics",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 3,
      "position": [460, 300]
    },
    {
      "parameters": {
        "url": "={{$env.ANALYTICS_WEBHOOK_URL}}",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "date",
              "value": "={{$json.date}}"
            },
            {
              "name": "metrics",
              "value": "={{$json}}"
            }
          ]
        }
      },
      "id": "send-to-analytics",
      "name": "Send to Analytics Platform",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 3,
      "position": [680, 300]
    }
  ],
  "connections": {
    "Daily at 2 AM": {
      "main": [
        [
          {
            "node": "Get Daily Metrics",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Get Daily Metrics": {
      "main": [
        [
          {
            "node": "Send to Analytics Platform",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## 🚀 Workflow 3 : Gestion des tickets de support

### Description
Automatise la gestion des nouveaux tickets de support : assignation, notifications, escalade.

### Configuration

```json
{
  "name": "DropSkills - Support Ticket Management",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "support-ticket-webhook",
        "responseMode": "responseNode"
      },
      "id": "webhook-new-ticket",
      "name": "New Ticket Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.priority}}",
              "operation": "equal",
              "value2": "URGENT"
            }
          ]
        }
      },
      "id": "check-priority",
      "name": "Check if Urgent",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "url": "={{$env.DROPSKILLS_API_URL}}/api/n8n/users?role=SUPPORT&status=ACTIVE",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "x-api-key",
              "value": "={{$env.N8N_API_KEY}}"
            }
          ]
        }
      },
      "id": "get-support-agents",
      "name": "Get Available Support Agents",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 3,
      "position": [680, 200]
    },
    {
      "parameters": {
        "url": "={{$env.DROPSKILLS_API_URL}}/api/n8n/tickets/{{$json.id}}/assign",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "x-api-key",
              "value": "={{$env.N8N_API_KEY}}"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "assignedToId",
              "value": "={{$json.users[0].id}}"
            }
          ]
        }
      },
      "id": "assign-ticket",
      "name": "Assign Ticket",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 3,
      "position": [900, 200]
    },
    {
      "parameters": {
        "fromEmail": "support@dropskills.com",
        "toEmail": "={{$json.users[0].email}}",
        "subject": "🚨 Ticket urgent assigné - #{{$json.id}}",
        "text": "Un nouveau ticket urgent vous a été assigné :\n\nSujet : {{$json.subject}}\nUtilisateur : {{$json.user.email}}\nPriorité : {{$json.priority}}\n\nVeuillez traiter ce ticket en priorité.\n\nAccéder au ticket : {{$env.DROPSKILLS_URL}}/admin/tickets/{{$json.id}}"
      },
      "id": "notify-urgent",
      "name": "Notify Urgent Assignment",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2,
      "position": [1120, 200]
    },
    {
      "parameters": {
        "fromEmail": "support@dropskills.com",
        "toEmail": "={{$json.user.email}}",
        "subject": "Votre demande de support a été reçue - #{{$json.id}}",
        "text": "Bonjour {{$json.user.firstName}},\n\nNous avons bien reçu votre demande de support. Notre équipe va traiter votre demande dans les plus brefs délais.\n\nNuméro de ticket : #{{$json.id}}\nSujet : {{$json.subject}}\n\nVous pouvez suivre l'évolution de votre demande dans votre espace membre.\n\nCordialement,\nL'équipe DropSkills"
      },
      "id": "send-confirmation",
      "name": "Send Confirmation to User",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2,
      "position": [680, 400]
    }
  ],
  "connections": {
    "New Ticket Webhook": {
      "main": [
        [
          {
            "node": "Check if Urgent",
            "type": "main",
            "index": 0
          },
          {
            "node": "Send Confirmation to User",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Check if Urgent": {
      "main": [
        [
          {
            "node": "Get Available Support Agents",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Get Available Support Agents": {
      "main": [
        [
          {
            "node": "Assign Ticket",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Assign Ticket": {
      "main": [
        [
          {
            "node": "Notify Urgent Assignment",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## 🚀 Workflow 4 : Monitoring des outils IA

### Description
Surveille l'usage des outils IA et envoie des alertes en cas de dépassement de quotas.

### Configuration

```json
{
  "name": "DropSkills - IA Tools Monitoring",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "expression": "0 */6 * * *"
            }
          ]
        }
      },
      "id": "cron-every-6h",
      "name": "Every 6 Hours",
      "type": "n8n-nodes-base.cron",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "url": "={{$env.DROPSKILLS_API_URL}}/api/n8n/ia-tools/usage-stats",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "x-api-key",
              "value": "={{$env.N8N_API_KEY}}"
            }
          ]
        }
      },
      "id": "get-usage-stats",
      "name": "Get IA Usage Stats",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 3,
      "position": [460, 300]
    },
    {
      "parameters": {
        "conditions": {
          "number": [
            {
              "value1": "={{$json.dailyUsagePercentage}}",
              "operation": "larger",
              "value2": 80
            }
          ]
        }
      },
      "id": "check-quota-usage",
      "name": "Check if > 80% Quota",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [680, 300]
    },
    {
      "parameters": {
        "fromEmail": "alerts@dropskills.com",
        "toEmail": "admin@dropskills.com",
        "subject": "⚠️ Alerte quota IA - {{$json.toolName}}",
        "text": "L'outil IA {{$json.toolName}} a atteint {{$json.dailyUsagePercentage}}% de son quota quotidien.\n\nUtilisation actuelle : {{$json.currentUsage}} / {{$json.dailyLimit}}\nTokens consommés : {{$json.tokensUsed}}\n\nVeuillez vérifier et ajuster les limites si nécessaire."
      },
      "id": "send-quota-alert",
      "name": "Send Quota Alert",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2,
      "position": [900, 300]
    }
  ],
  "connections": {
    "Every 6 Hours": {
      "main": [
        [
          {
            "node": "Get IA Usage Stats",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Get IA Usage Stats": {
      "main": [
        [
          {
            "node": "Check if > 80% Quota",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Check if > 80% Quota": {
      "main": [
        [
          {
            "node": "Send Quota Alert",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## 🔧 Configuration des variables d'environnement n8n

```bash
# Variables à configurer dans n8n
DROPSKILLS_API_URL=https://your-dropskills-domain.com
N8N_API_KEY=your-n8n-api-key
DROPSKILLS_URL=https://your-dropskills-domain.com
ANALYTICS_WEBHOOK_URL=https://your-analytics-platform.com/webhook
```

## 📚 Endpoints API supplémentaires nécessaires

Pour que ces workflows fonctionnent, vous devrez créer ces endpoints supplémentaires :

- `POST /api/n8n/pack-access` - Accorder l'accès à un pack
- `GET /api/n8n/analytics/daily` - Récupérer les métriques quotidiennes
- `POST /api/n8n/tickets/[id]/assign` - Assigner un ticket
- `GET /api/n8n/ia-tools/usage-stats` - Statistiques d'usage IA

## 🚀 Déploiement

1. **Importer les workflows** dans votre instance n8n
2. **Configurer les variables d'environnement**
3. **Tester chaque workflow** individuellement
4. **Activer les webhooks** dans vos services externes
5. **Monitorer les logs** pour s'assurer du bon fonctionnement

## 📊 Monitoring

Surveillez ces métriques dans n8n :
- Taux de succès des workflows
- Temps d'exécution moyen
- Erreurs et échecs
- Volume de données traitées 