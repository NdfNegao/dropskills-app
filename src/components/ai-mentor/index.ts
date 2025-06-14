// Export des composants AI Mentor
export { ChatInterface } from './ChatInterface';
export { MentorCard } from './MentorCard';
export { MentorGrid } from './MentorGrid';

// Export des types
export type {
  AIMentor,
  ChatMessage,
  Conversation,
  MentorStats,
  ChatInterfaceProps,
  MentorCardProps,
  MentorGridProps
} from '@/types/ai-mentor';

// Export des hooks
export { useChat, useConversationHistory } from '@/hooks/useChat';

// Export des données
export { AI_MENTORS, MENTOR_PROMPTS } from '@/data/ai-mentors';