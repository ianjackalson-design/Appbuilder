import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VoiceCommand } from '../models/notifications';
import { toast } from 'sonner';
import { useConfig } from './ConfigContext';

interface VoiceContextType {
  isListening: boolean;
  isProcessing: boolean;
  currentTranscript: string;
  commands: VoiceCommand[];
  startListening: () => void;
  stopListening: () => void;
  processVoiceCommand: (text: string) => Promise<void>;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within VoiceProvider');
  }
  return context;
};

let commandIdCounter = 3000;
const generateCommandId = () => `voice-${commandIdCounter++}`;

export const VoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { config } = useConfig();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [commands, setCommands] = useState<VoiceCommand[]>([]);
  const [recognition, setRecognition] = useState<any>(null);

  const processVoiceCommand = React.useCallback(async (text: string) => {
    setIsProcessing(true);
    
    try {
      // Analyze command type
      let commandType: VoiceCommand['type'] = 'other';
      
      const lowerText = text.toLowerCase();
      if (lowerText.includes('create task') || lowerText.includes('add task') || lowerText.includes('new task')) {
        commandType = 'create_task';
      } else if (lowerText.includes('create event') || lowerText.includes('add event') || lowerText.includes('schedule')) {
        commandType = 'create_event';
      } else if (lowerText.includes('remind') || lowerText.includes('reminder')) {
        commandType = 'create_reminder';
      } else if (lowerText.includes('mute') || lowerText.includes('led') || lowerText.includes('restart')) {
        commandType = 'control_device';
      } else if (lowerText.includes('what') || lowerText.includes('when') || lowerText.includes('how')) {
        commandType = 'query';
      }
      
      const command: VoiceCommand = {
        id: generateCommandId(),
        text,
        type: commandType,
        timestamp: new Date().toISOString(),
        processed: true,
        result: `Command recognized: ${commandType}`,
      };
      
      setCommands(prev => [command, ...prev]);
      
      toast.success('Voice command processed', {
        description: text,
        duration: 3000,
      });
      
    } catch (error) {
      console.error('Error processing voice command:', error);
      toast.error('Failed to process voice command');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = config?.sttLanguage || 'en-US';
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        setCurrentTranscript(transcript);
        
        // If final result
        if (event.results[0].isFinal) {
          processVoiceCommand(transcript);
        }
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'no-speech') {
          toast.error('No speech detected');
        } else if (event.error === 'audio-capture') {
          toast.error('Microphone not accessible');
        } else {
          toast.error('Speech recognition error');
        }
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
        setCurrentTranscript('');
      };
      
      setRecognition(recognitionInstance);
      
      // Cleanup
      return () => {
        if (recognitionInstance) {
          try {
            recognitionInstance.stop();
          } catch (e) {
            // Ignore errors on cleanup
          }
        }
      };
    }
  }, [config?.sttLanguage, processVoiceCommand]);

  const startListening = () => {
    if (!recognition) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }
    
    try {
      recognition.start();
      setIsListening(true);
      setCurrentTranscript('');
      toast.info('Listening...', { duration: 2000 });
    } catch (error) {
      console.error('Error starting recognition:', error);
      toast.error('Failed to start listening');
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <VoiceContext.Provider
      value={{
        isListening,
        isProcessing,
        currentTranscript,
        commands,
        startListening,
        stopListening,
        processVoiceCommand,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};