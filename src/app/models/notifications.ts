// Notification types and models

export type NotificationType = 
  | 'reminder'        // 提醒
  | 'task_due'        // 任务到期
  | 'event_starting'  // 事件即将开始
  | 'device_alert'    // 设备警报
  | 'system'          // 系统通知
  | 'message';        // 消息通知

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    taskId?: string;
    eventId?: string;
    deviceCommand?: string;
  };
}

export interface Reminder {
  id: string;
  title: string;
  message?: string;
  time: string;
  repeat?: 'once' | 'daily' | 'weekly' | 'monthly';
  enabled: boolean;
  createdAt: string;
}

// Voice command types
export type VoiceCommandType = 
  | 'create_task'
  | 'create_event'
  | 'create_reminder'
  | 'control_device'
  | 'query'
  | 'other';

export interface VoiceCommand {
  id: string;
  text: string;
  type: VoiceCommandType;
  timestamp: string;
  processed: boolean;
  result?: string;
}

// Phone command types
export type PhoneCommandType =
  | 'mute'
  | 'unmute'
  | 'led_on'
  | 'led_off'
  | 'led_color'
  | 'restart'
  | 'volume'
  | 'wake'
  | 'sleep';

export interface PhoneCommand {
  id: string;
  type: PhoneCommandType;
  parameters?: Record<string, any>;
  timestamp: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: string;
}

// Smart todo with AI enhancement
export interface SmartTodo {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate?: string;
  createdAt: string;
  
  // Smart features
  suggestedTime?: string;         // AI 建议的最佳完成时间
  estimatedDuration?: number;     // 预计耗时（分钟）
  dependencies?: string[];        // 依赖的其他任务ID
  tags?: string[];                // 标签
  aiGenerated?: boolean;          // 是否由AI生成
  aiSuggestion?: string;          // AI的建议
}
