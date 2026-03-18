import React, { createContext, useContext, useState, useEffect } from 'react';
import { Message } from '../models/types';
import { wsService } from '../services/websocket';
import { apiService } from '../services/api';
import { toast } from 'sonner';
import { useConfig } from './ConfigContext';
import { mockMessages, generateId, simulateDelay } from '../utils/mockData';

interface ChatContextType {
  messages: Message[];
  sendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const config = useConfig();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Destructure after ensuring config exists
  const isDemoMode = config?.isDemoMode ?? false;
  const isConnected = config?.isConnected ?? false;

  useEffect(() => {
    if (isDemoMode) {
      setMessages(mockMessages);
      return;
    }

    const handleChatMessage = (data: Message) => {
      setMessages((prev) => [...prev, data]);
    };

    wsService.on('chat_message', handleChatMessage);

    if (isConnected && wsService.isConnected()) {
      apiService.getChatHistory()
        .then(setMessages)
        .catch((error) => {
          console.error('Failed to fetch chat history:', error);
        });
    }

    return () => {
      wsService.off('chat_message', handleChatMessage);
    };
  }, [isDemoMode, isConnected]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    setIsLoading(true);

    // Demo Mode - handle locally
    if (isDemoMode) {
      try {
        const userMessage: Message = {
          id: generateId(),
          text,
          source: 'app',
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, userMessage]);

        await simulateDelay(1000);

        const responses = [
          "That's an interesting question! In demo mode, I can show you how the chat interface works.",
          "I'm running in demo mode, so this is a simulated response. Connect to a real device for actual AI assistance!",
          "Demo mode is great for exploring the interface. The real assistant has much more capabilities!",
          "Thanks for trying the demo! To unlock full features, connect to your AI-Bot device.",
        ];

        const assistantMessage: Message = {
          id: generateId(),
          text: responses[Math.floor(Math.random() * responses.length)],
          source: 'assistant',
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        toast.error('Failed to send message');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Real mode - use API
    if (!isConnected) {
      toast.error('Not connected to server. Please connect first or use Demo Mode.');
      setIsLoading(false);
      return;
    }

    try {
      const message = await apiService.sendChatMessage(text);
      setMessages((prev) => [...prev, message]);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, isLoading }}>
      {children}
    </ChatContext.Provider>
  );
};