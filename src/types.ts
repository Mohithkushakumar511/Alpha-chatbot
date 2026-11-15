export type AIMode = 'chat' | 'create' | 'search' | 'code' | 'learn';
export type ResponseLengthMode = 'quick' | 'balanced' | 'detailed';

export interface SearchSource {
  title: string;
  url: string;
  snippet: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  mode?: AIMode;
  responseLength?: ResponseLengthMode;
  sources?: SearchSource[];
}

export interface Conversation {
  id: string;
  title: string;
  mode: AIMode;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
}

export interface SystemStatus {
  server: {
    online: boolean;
    label: string;
  };
  groq: {
    connected: boolean;
    configured?: boolean;
    model?: string;
    label: string;
  };
  langSearch: {
    connected: boolean;
    configured?: boolean;
    label: string;
  };
  voice: {
    available: boolean;
    fishAudio?: boolean;
    browserSpeechFallback?: boolean;
    label: string;
  };
}
