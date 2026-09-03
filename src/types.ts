export type TabMode = 'all' | 'chat' | 'docs';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isError?: boolean;
}

export interface ApiStatus {
  success: boolean;
  name: string;
  assistant: string;
  developer: string;
  status: string;
}

export interface ConfigStatus {
  success: boolean;
  provider: string;
  model: string;
  baseUrl: string;
  isKeyConfigured: boolean;
  assistant: string;
  developer: string;
}

export interface IdentityInfo {
  success: boolean;
  name: string;
  developer: string;
  tiktok: string;
  role: string;
  exact_response: string;
  description: string;
}

export interface ApiDocEndpoint {
  id: string;
  method: 'GET' | 'POST';
  path: string;
  title: string;
  description: string;
  requestBodyExample?: string;
  responseExample: string;
  curlSnippet: string;
}
