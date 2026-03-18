// Message model for chat conversations
export interface Message {
  id: string;
  text: string;
  source: 'device' | 'app' | 'assistant' | 'system';
  timestamp: string;
  toolResult?: ToolResult;
}

// Tool execution result
export interface ToolResult {
  toolName: string;
  status: 'success' | 'error' | 'pending';
  result: string;
}

// Task model
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate?: string;
  createdAt: string;
}

// Event/Calendar model
export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  createdAt: string;
}

// Device status model
export interface DeviceStatus {
  online: boolean;
  battery: number;
  wifiSignal: number;
  state: 'idle' | 'recording' | 'playing' | 'processing';
  lastSeen?: string;
}

// App configuration model
export interface AppConfig {
  serverUrl: string;
  serverPort: number;
  llmProvider: string;
  llmModel: string;
  llmApiKey?: string;
  llmBaseUrl?: string;
  sttProvider: string;
  sttModel: string;
  sttLanguage: string;
  ttsProvider: string;
  ttsModel: string;
  ttsVoice: string;
  ttsSpeed?: number;
  deviceVolume?: number;
  ledEnabled: boolean;
  ledBrightness: number;
  ledMode?: 'off' | 'breathing' | 'rainbow' | 'solid';
  ledColor?: string;
  wakeWord: string;
  autoListen: boolean;
}

// WebSocket message types
export type WSMessageType = 
  | 'device_status'
  | 'chat_message'
  | 'task_update'
  | 'event_update'
  | 'config_update'
  | 'ping'
  | 'pong';

export interface WSMessage {
  type: WSMessageType;
  data: any;
  timestamp: number;
}