import { describe, it, expect } from '@jest/globals';
import { NextRequest } from 'next/server';

// Import des handlers API
import { GET as getDashboardStats } from '../../src/app/api/admin/dashboard/stats/route';
import { GET as getUsers } from '../../src/app/api/admin/users/route';
import { GET as getPacks } from '../../src/app/api/admin/packs/route';
import { GET as getSupport, POST as createSupportTicket } from '../../src/app/api/admin/support/route';
import { GET as getFeatureRequests, POST as createFeatureRequest } from '../../src/app/api/admin/feature-requests/route';

describe('APIs Admin DropSkills', () => {
  
  describe('Dashboard Stats API', () => {
    it('devrait retourner les statistiques du dashboard', async () => {
      const response = await getDashboardStats();
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('users');
      expect(data).toHaveProperty('packs');
      expect(data).toHaveProperty('tools');
      expect(data.users).toHaveProperty('total');
      expect(data.users).toHaveProperty('new_this_month');
    });
  });

  describe('Users API', () => {
    it('devrait retourner la liste des utilisateurs avec pagination', async () => {
      const request = new NextRequest('http://localhost:3001/api/admin/users?page=1&limit=5');
      
      const response = await getUsers(request);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('users');
      expect(data).toHaveProperty('pagination');
      expect(Array.isArray(data.users)).toBe(true);
      expect(data.pagination).toHaveProperty('page');
      expect(data.pagination).toHaveProperty('total');
    });

    it('devrait filtrer les utilisateurs par statut', async () => {
      const request = new NextRequest('http://localhost:3001/api/admin/users?status=premium&page=1');
      
      const response = await getUsers(request);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.users).toBeDefined();
      // Vérifier que tous les utilisateurs retournés ont le statut premium
      if (data.users.length > 0) {
        data.users.forEach((user: any) => {
          expect(user.subscription_status).toBe('premium');
        });
      }
    });
  });

  describe('Packs API', () => {
    it('devrait retourner la liste des packs', async () => {
      const response = await getPacks();
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      if (data.length > 0) {
        expect(data[0]).toHaveProperty('name');
        expect(data[0]).toHaveProperty('price');
        expect(data[0]).toHaveProperty('tools_included');
      }
    });
  });

  describe('Support API', () => {
    it('devrait retourner la liste des tickets de support', async () => {
      const request = new NextRequest('http://localhost:3001/api/admin/support');
      
      const response = await getSupport(request);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('tickets');
      expect(data).toHaveProperty('pagination');
      expect(Array.isArray(data.tickets)).toBe(true);
    });

    it('devrait filtrer les tickets par statut', async () => {
      const request = new NextRequest('http://localhost:3001/api/admin/support?status=open');
      
      const response = await getSupport(request);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      data.tickets.forEach((ticket: any) => {
        expect(ticket.status).toBe('open');
      });
    });

    it('devrait créer un nouveau ticket de support', async () => {
      const ticketData = {
        user_email: 'test@example.com',
        subject: 'Test ticket',
        message: 'Ceci est un ticket de test',
        status: 'open',
        priority: 'medium'
      };

      const request = new NextRequest('http://localhost:3001/api/admin/support', {
        method: 'POST',
        body: JSON.stringify(ticketData),
        headers: { 'Content-Type': 'application/json' }
      });
      
      const response = await createSupportTicket(request);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.subject).toBe(ticketData.subject);
      expect(data.user_email).toBe(ticketData.user_email);
    });
  });

  describe('Feature Requests API', () => {
    it('devrait retourner la liste des demandes de fonctionnalités', async () => {
      const request = new NextRequest('http://localhost:3001/api/admin/feature-requests');
      
      const response = await getFeatureRequests(request);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('features');
      expect(data).toHaveProperty('pagination');
      expect(Array.isArray(data.features)).toBe(true);
    });

    it('devrait trier les demandes par nombre de votes (décroissant)', async () => {
      const request = new NextRequest('http://localhost:3001/api/admin/feature-requests');
      
      const response = await getFeatureRequests(request);
      const data = await response.json();
      
      // Vérifier que les demandes sont triées par votes décroissants
      for (let i = 0; i < data.features.length - 1; i++) {
        expect(data.features[i].votes).toBeGreaterThanOrEqual(data.features[i + 1].votes);
      }
    });

    it('devrait filtrer par catégorie et statut', async () => {
      const request = new NextRequest('http://localhost:3001/api/admin/feature-requests?category=ai_tool&status=planned');
      
      const response = await getFeatureRequests(request);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      data.features.forEach((feature: any) => {
        expect(feature.category).toBe('ai_tool');
        expect(feature.status).toBe('planned');
      });
    });

    it('devrait créer une nouvelle demande de fonctionnalité', async () => {
      const featureData = {
        user_email: 'test@example.com',
        title: 'Nouvelle fonctionnalité test',
        description: 'Description détaillée de la nouvelle fonctionnalité à développer',
        category: 'new_feature',
        priority: 'medium',
        status: 'submitted'
      };

      const request = new NextRequest('http://localhost:3001/api/admin/feature-requests', {
        method: 'POST',
        body: JSON.stringify(featureData),
        headers: { 'Content-Type': 'application/json' }
      });
      
      const response = await createFeatureRequest(request);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.title).toBe(featureData.title);
      expect(data.user_email).toBe(featureData.user_email);
      expect(data.votes).toBe(1); // L'utilisateur qui créé vote automatiquement
    });
  });

  describe('Validation des données', () => {
    it('devrait rejeter un ticket avec des données invalides', async () => {
      const invalidTicketData = {
        user_email: 'email-invalide', // Email invalide
        subject: 'Test', // Sujet trop court
        message: 'Msg', // Message trop court
        status: 'invalid_status', // Statut invalide
        priority: 'invalid_priority' // Priorité invalide
      };

      const request = new NextRequest('http://localhost:3001/api/admin/support', {
        method: 'POST',
        body: JSON.stringify(invalidTicketData),
        headers: { 'Content-Type': 'application/json' }
      });
      
      const response = await createSupportTicket(request);
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.error).toBe('Données invalides');
      expect(data.details).toBeDefined();
    });

    it('devrait rejeter une feature request avec des données invalides', async () => {
      const invalidFeatureData = {
        user_email: 'email-invalide',
        title: 'Test', // Titre trop court
        description: 'Description courte', // Description trop courte
        category: 'invalid_category',
        priority: 'invalid_priority',
        status: 'invalid_status'
      };

      const request = new NextRequest('http://localhost:3001/api/admin/feature-requests', {
        method: 'POST',
        body: JSON.stringify(invalidFeatureData),
        headers: { 'Content-Type': 'application/json' }
      });
      
      const response = await createFeatureRequest(request);
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.error).toBe('Données invalides');
    });
  });

  describe('Performance et pagination', () => {
    it('devrait respecter les limites de pagination', async () => {
      const request = new NextRequest('http://localhost:3001/api/admin/users?page=1&limit=2');
      
      const response = await getUsers(request);
      const data = await response.json();
      
      expect(data.users.length).toBeLessThanOrEqual(2);
      expect(data.pagination.limit).toBe(2);
      expect(data.pagination.page).toBe(1);
    });

    it('devrait gérer les pages vides', async () => {
      const request = new NextRequest('http://localhost:3001/api/admin/users?page=999&limit=10');
      
      const response = await getUsers(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.users.length).toBe(0);
    });
  });
}); 