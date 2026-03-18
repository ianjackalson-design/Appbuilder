import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppConfig } from '../models/types';
import { wsService } from '../services/websocket';
import { apiService } from '../services/api';
import { toast } from 'sonner';
import { mockConfig } from '../utils/mockData';

interface ConfigContextType {
  config: AppConfig;
  updateConfig: (updates: Partial<AppConfig>) => Promise<void>;
  isConnected: boolean;
  isDemoMode: boolean;
  connect: (serverUrl: string, port: number) => void;
  connectDemo: () => void;
  disconnect: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return context;
};

const defaultConfig: AppConfig = {
  serverUrl: '',
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
  ledEnabled: true,
  ledBrightness: 50,
  wakeWord: 'Hey Assistant',
  autoListen: true,
};

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig>(defaultConfig);
  const [isConnected, setIsConnected] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const handleConfigUpdate = (data: AppConfig) => {
      setConfig(data);
    };

    wsService.on('config_update', handleConfigUpdate);

    // Check connection status periodically
    const interval = setInterval(() => {
      if (!isDemoMode) {
        setIsConnected(wsService.isConnected());
      }
    }, 1000);

    return () => {
      wsService.off('config_update', handleConfigUpdate);
      clearInterval(interval);
    };
  }, [isDemoMode]);

  const connect = (serverUrl: string, port: number) => {
    setIsDemoMode(false);
    apiService.setBaseUrl(serverUrl, port);
    wsService.connect(serverUrl, port);
    setConfig((prev) => ({ ...prev, serverUrl, serverPort: port }));
    toast.success('Connecting to device...');
    
    // Fetch config after connection with timeout
    const timeout = setTimeout(() => {
      if (!wsService.isConnected()) {
        toast.error('Connection failed. Please check if the server is running.');
        wsService.disconnect();
      }
    }, 5000);

    // Try to fetch config
    setTimeout(() => {
      apiService.getConfig()
        .then((data) => {
          setConfig(data);
          clearTimeout(timeout);
          toast.success('Connected successfully!');
        })
        .catch((error) => {
          console.error('Failed to fetch config:', error);
          clearTimeout(timeout);
          toast.error('Could not connect to server. Try Demo Mode instead.');
        });
    }, 1000);
  };

  const connectDemo = () => {
    setIsDemoMode(true);
    setIsConnected(true);
    setConfig(mockConfig);
    toast.success('Demo Mode activated! Using sample data.');
  };

  const disconnect = () => {
    if (!isDemoMode) {
      wsService.disconnect();
    }
    setIsConnected(false);
    setIsDemoMode(false);
    toast.info('Disconnected from device');
  };

  const updateConfig = async (updates: Partial<AppConfig>) => {
    if (isDemoMode) {
      setConfig((prev) => ({ ...prev, ...updates }));
      toast.success('Settings saved (Demo Mode)');
      return;
    }

    try {
      const updated = await apiService.updateConfig(updates);
      setConfig(updated);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
      throw error;
    }
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, isConnected, isDemoMode, connect, connectDemo, disconnect }}>
      {children}
    </ConfigContext.Provider>
  );
};