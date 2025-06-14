// Types pour le système AI Mentor

export interface AIMentor {
  id: string;
  name: string;
  description: string;
  expertise: string[];
  icon: string;
  theme: string;
  link: string;
  popular?: boolean;
  estimatedResponseTime: string;
  conversationCount: number;
  suggestedPrompts: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  mentorId: string;
  userId: string;
}

export interface Conversation {
  id: string;
  userId: string;
  mentorId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  title?: string;
}

export interface MentorStats {
  totalConversations: number;
  activeUsers: number;
  averageResponseTime: string;
  popularMentors: string[];
}

export interface ChatInterfaceProps {
  mentorId: string;
  mentor: AIMentor;
  initialMessages?: ChatMessage[];
}

export interface MentorCardProps {
  mentor: AIMentor;
  variant?: 'default' | 'compact';
  showStats?: boolean;
}

export interface MentorGridProps {
  mentors: AIMentor[];
  stats: MentorStats;
  searchQuery?: string;
  selectedCategory?: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ChatAPIRequest {
  message: string;
  userId: string;
  conversationId?: string;
}

export interface ChatAPIResponse {
  response: string;
  mentorId: string;
  timestamp: string;
  conversationId?: string;
}

export interface ConversationHistory {
  conversations: Conversation[];
  totalCount: number;
  hasMore: boolean;
}

// Types pour les filtres et la recherche
export interface MentorFilters {
  category?: string;
  expertise?: string[];
  popular?: boolean;
  responseTime?: 'fast' | 'medium' | 'slow';
}

export interface SearchState {
  query: string;
  filters: MentorFilters;
  results: AIMentor[];
  loading: boolean;
}

// Types pour les thèmes et styles
export interface MentorTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface ThemeConfig {
  [key: string]: MentorTheme;
}

// Types pour les prompts système
export interface SystemPrompt {
  mentorId: string;
  prompt: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PromptConfig {
  [mentorId: string]: string;
}

// Types pour les statistiques d'utilisation
export interface UsageStats {
  mentorId: string;
  totalMessages: number;
  uniqueUsers: number;
  averageSessionLength: number;
  popularPrompts: string[];
  lastUsed: Date;
}

// Types pour les erreurs
export interface MentorError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Types pour les événements
export interface MentorEvent {
  type: 'message_sent' | 'conversation_started' | 'conversation_ended' | 'error_occurred';
  mentorId: string;
  userId: string;
  data?: any;
  timestamp: Date;
}

// Types pour la configuration
export interface MentorConfig {
  maxMessageLength: number;
  maxConversationHistory: number;
  responseTimeout: number;
  enabledFeatures: string[];
  premiumRequired: boolean;
}

// Types pour les hooks React
export interface UseChatReturn {
  messages: ChatMessage[];
  sendMessage: (content: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  clearMessages: () => void;
}

export interface UseMentorsReturn {
  mentors: AIMentor[];
  loading: boolean;
  error: string | null;
  searchMentors: (query: string) => void;
  filterMentors: (filters: MentorFilters) => void;
  getMentorById: (id: string) => AIMentor | undefined;
}

// Types pour les composants de layout
export interface MentorLayoutProps {
  children: React.ReactNode;
  mentor?: AIMentor;
  showSidebar?: boolean;
  showHeader?: boolean;
}

// Types pour les animations et transitions
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

export interface TransitionProps {
  show: boolean;
  enter?: string;
  enterFrom?: string;
  enterTo?: string;
  leave?: string;
  leaveFrom?: string;
  leaveTo?: string;
}