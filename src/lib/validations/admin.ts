import { z } from 'zod';

// Schémas de base
export const idSchema = z.string().uuid();
export const emailSchema = z.string().email();
export const dateSchema = z.string().datetime();

// Schéma utilisateur
export const userSchema = z.object({
  id: idSchema.optional(),
  email: emailSchema,
  name: z.string().min(1).max(100).optional(),
  subscription_status: z.enum(['free', 'premium', 'enterprise']).default('free'),
  is_active: z.boolean().default(true),
  created_at: dateSchema.optional(),
  updated_at: dateSchema.optional()
});

// Schéma pack
export const packSchema = z.object({
  id: idSchema.optional(),
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  price: z.number().positive().max(10000),
  tools_included: z.array(z.string()).min(1),
  is_active: z.boolean().default(true),
  created_at: dateSchema.optional(),
  updated_at: dateSchema.optional()
});

// Schéma outil IA amélioré
export const aiToolSchema = z.object({
  id: idSchema.optional(),
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  type: z.string().min(1),
  category: z.string().min(1),
  icon: z.string().min(1),
  color: z.string().min(1),
  is_premium: z.boolean().default(false),
  step: z.number().int().positive(),
  step_title: z.string().min(1).max(200),
  step_description: z.string().min(1).max(500),
  endpoint: z.string().url().optional().or(z.literal('')),
  model: z.string().min(1),
  temperature: z.number().min(0).max(2),
  max_tokens: z.number().int().positive().max(4000),
  system_prompt: z.string().min(1),
  created_at: dateSchema.optional(),
  updated_at: dateSchema.optional()
});

// Schéma ticket de support
export const supportTicketSchema = z.object({
  id: idSchema.optional(),
  user_id: idSchema.optional(),
  user_email: emailSchema,
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).default('open'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  assigned_to: z.string().optional(),
  response: z.string().optional(),
  created_at: dateSchema.optional(),
  updated_at: dateSchema.optional()
});

// Types TypeScript générés
export type User = z.infer<typeof userSchema>;
export type Pack = z.infer<typeof packSchema>;
export type AiTool = z.infer<typeof aiToolSchema>;
export type SupportTicket = z.infer<typeof supportTicketSchema>;

// Fonction utilitaire pour valider les données
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

// Middleware de validation pour les APIs
export function createValidationMiddleware<T>(schema: z.ZodSchema<T>) {
  return (data: unknown) => {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation échouée: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  };
} 