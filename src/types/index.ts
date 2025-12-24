export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  contextRefs?: ContextReference[];
  isLoading?: boolean;
}

export interface ContextReference {
  fileId: string;
  fileName: string;
  startLine?: number;
  endLine?: number;
  snippet?: string;
}

export interface ContextFile {
  id: string;
  name: string;
  path: string;
  size: number;
  type: string;
  content?: string;
  lastModified: Date;
  isLoading?: boolean;
  isSelected?: boolean;
}

export interface ServerStatus {
  isConnected: boolean;
  isChecking: boolean;
  lastChecked: Date | null;
  ollamaVersion?: string;
  availableModels?: string[];
  error?: string | null;
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
}

export type Language = 'en' | 'ar';

export interface AppState {
  language: Language;
  sidebarOpen: boolean;
  contextPreviewOpen: boolean;
  selectedContext: ContextFile | null;
  messages: Message[];
  contextFiles: ContextFile[];
  serverStatus: ServerStatus;
}
