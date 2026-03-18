import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event } from '../models/types';
import { wsService } from '../services/websocket';
import { apiService } from '../services/api';
import { toast } from 'sonner';
import { useConfig } from './ConfigContext';
import { mockEvents, generateId, simulateDelay } from '../utils/mockData';

interface EventContextType {
  events: Event[];
  createEvent: (event: Omit<Event, 'id' | 'createdAt'>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within EventProvider');
  }
  return context;
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const config = useConfig();
  const [events, setEvents] = useState<Event[]>([]);

  // Destructure after ensuring config exists
  const isDemoMode = config?.isDemoMode ?? false;
  const isConnected = config?.isConnected ?? false;

  useEffect(() => {
    if (isDemoMode) {
      setEvents(mockEvents);
      return;
    }

    const handleEventUpdate = (data: Event) => {
      setEvents((prev) => {
        const index = prev.findIndex((e) => e.id === data.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = data;
          return updated;
        }
        return [...prev, data];
      });
    };

    wsService.on('event_update', handleEventUpdate);

    if (isConnected && wsService.isConnected()) {
      apiService.getEvents()
        .then(setEvents)
        .catch((error) => {
          console.error('Failed to fetch events:', error);
        });
    }

    return () => {
      wsService.off('event_update', handleEventUpdate);
    };
  }, [isDemoMode, isConnected]);

  const createEvent = async (event: Omit<Event, 'id' | 'createdAt'>) => {
    if (isDemoMode) {
      await simulateDelay();
      const newEvent: Event = {
        ...event,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      setEvents((prev) => [...prev, newEvent]);
      toast.success('Event created (Demo Mode)');
      return;
    }

    try {
      const newEvent = await apiService.createEvent(event);
      setEvents((prev) => [...prev, newEvent]);
      toast.success('Event created successfully');
    } catch (error) {
      toast.error('Failed to create event');
      throw error;
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    if (isDemoMode) {
      await simulateDelay(300);
      setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
      return;
    }

    try {
      const updated = await apiService.updateEvent(id, updates);
      setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
    } catch (error) {
      toast.error('Failed to update event');
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    if (isDemoMode) {
      await simulateDelay(300);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success('Event deleted (Demo Mode)');
      return;
    }

    try {
      await apiService.deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success('Event deleted');
    } catch (error) {
      toast.error('Failed to delete event');
      throw error;
    }
  };

  return (
    <EventContext.Provider value={{ events, createEvent, updateEvent, deleteEvent }}>
      {children}
    </EventContext.Provider>
  );
};