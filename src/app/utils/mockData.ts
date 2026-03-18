import { AppConfig, DeviceStatus, Message, Task, Event } from '../models/types';

export const mockConfig: AppConfig = {
  serverUrl: 'localhost',
  serverPort: 8000,
  llmProvider: 'openai',
  llmModel: 'gpt-4',
  llmApiKey: '',
  llmBaseUrl: '',
  sttProvider: 'openai',
  sttModel: 'whisper-1',
  sttLanguage: 'en',
  ttsProvider: 'openai',
  ttsModel: 'tts-1',
  ttsVoice: 'alloy',
  ttsSpeed: 1.0,
  deviceVolume: 75,
  ledEnabled: true,
  ledBrightness: 80,
  ledMode: 'breathing',
  ledColor: '#0000ff',
  wakeWord: 'Hey Assistant',
  autoListen: true,
};

export const mockDeviceStatus: DeviceStatus = {
  online: true,
  battery: 85,
  wifiSignal: 75,
  state: 'idle',
};

export const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Hello! How can I help you today?',
    source: 'assistant',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    text: 'What\'s the weather like?',
    source: 'app',
    timestamp: new Date(Date.now() - 3500000).toISOString(),
  },
  {
    id: '3',
    text: 'The weather is sunny with a high of 72°F today.',
    source: 'assistant',
    timestamp: new Date(Date.now() - 3400000).toISOString(),
  },
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Review project proposal',
    completed: false,
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    title: 'Update documentation',
    completed: true,
    priority: 'medium',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '3',
    title: 'Team meeting preparation',
    completed: false,
    priority: 'high',
    dueDate: new Date(Date.now() + 43200000).toISOString(),
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Team Standup',
    startTime: new Date(Date.now() + 3600000).toISOString(),
    endTime: new Date(Date.now() + 5400000).toISOString(),
    description: 'Daily team standup meeting',
    location: 'Conference Room A',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    title: 'Project Review',
    startTime: new Date(Date.now() + 86400000).toISOString(),
    endTime: new Date(Date.now() + 90000000).toISOString(),
    description: 'Q1 project review with stakeholders',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '3',
    title: 'Lunch with Client',
    startTime: new Date(Date.now() + 172800000).toISOString(),
    endTime: new Date(Date.now() + 176400000).toISOString(),
    location: 'Downtown Restaurant',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

// Helper to generate unique IDs
let idCounter = 1000;
export const generateId = () => `mock-${idCounter++}`;

// Helper to simulate API delay
export const simulateDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));