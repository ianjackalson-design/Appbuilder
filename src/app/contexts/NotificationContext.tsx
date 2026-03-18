import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification, Reminder } from '../models/notifications';
import { toast } from 'sonner';
import { useConfig } from './ConfigContext';

interface NotificationContextType {
  notifications: Notification[];
  reminders: Reminder[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  
  // Reminders
  createReminder: (reminder: Omit<Reminder, 'id' | 'createdAt'>) => Promise<void>;
  updateReminder: (id: string, updates: Partial<Reminder>) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  toggleReminder: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

// Mock data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'task_due',
    priority: 'high',
    title: 'Task Due Soon',
    message: 'Review project proposal is due in 1 hour',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    read: false,
    metadata: { taskId: '1' },
  },
  {
    id: '2',
    type: 'event_starting',
    priority: 'medium',
    title: 'Event Starting',
    message: 'Team Standup starts in 15 minutes',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    read: false,
    metadata: { eventId: '1' },
  },
  {
    id: '3',
    type: 'system',
    priority: 'low',
    title: 'Device Updated',
    message: 'Your device firmware has been updated successfully',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: true,
  },
];

const mockReminders: Reminder[] = [
  {
    id: '1',
    title: 'Morning Standup',
    message: 'Daily team standup meeting',
    time: '09:00',
    repeat: 'daily',
    enabled: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    title: 'Take a Break',
    message: 'Time to stretch and rest your eyes',
    time: '15:00',
    repeat: 'daily',
    enabled: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

let notificationIdCounter = 1000;
const generateId = () => `notif-${notificationIdCounter++}`;

let reminderIdCounter = 2000;
const generateReminderId = () => `reminder-${reminderIdCounter++}`;

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isDemoMode } = useConfig();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Initialize with mock data in demo mode
  useEffect(() => {
    if (isDemoMode) {
      setNotifications(mockNotifications);
      setReminders(mockReminders);
    }
  }, [isDemoMode]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = React.useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast for high/urgent priority
    if (notification.priority === 'high' || notification.priority === 'urgent') {
      toast.warning(notification.title, {
        description: notification.message,
        duration: 5000,
      });
    }
  }, []);

  // Check for due reminders
  useEffect(() => {
    if (!isDemoMode) return; // Only run in demo mode
    
    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      reminders.forEach(reminder => {
        if (reminder.enabled && reminder.time === currentTime) {
          addNotification({
            type: 'reminder',
            priority: 'medium',
            title: reminder.title,
            message: reminder.message || 'Reminder triggered',
          });
          toast(reminder.title, {
            description: reminder.message,
            duration: 5000,
          });
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => {
      clearInterval(interval);
    };
  }, [reminders, isDemoMode, addNotification]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Reminder management
  const createReminder = async (reminder: Omit<Reminder, 'id' | 'createdAt'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: generateReminderId(),
      createdAt: new Date().toISOString(),
    };
    
    setReminders(prev => [...prev, newReminder]);
    toast.success('Reminder created successfully');
  };

  const updateReminder = async (id: string, updates: Partial<Reminder>) => {
    setReminders(prev =>
      prev.map(r => r.id === id ? { ...r, ...updates } : r)
    );
    toast.success('Reminder updated');
  };

  const deleteReminder = async (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    toast.success('Reminder deleted');
  };

  const toggleReminder = async (id: string) => {
    setReminders(prev =>
      prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r)
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        reminders,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        createReminder,
        updateReminder,
        deleteReminder,
        toggleReminder,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};