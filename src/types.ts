export type AIMode = 'chat' | 'create' | 'search' | 'code' | 'learn';

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
