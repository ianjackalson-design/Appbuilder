import { useState } from 'react';
import { 
  Bell, 
  Mic, 
  Smartphone, 
  Volume2, 
  Lightbulb, 
  RotateCw,
  Power,
  Zap,
  Palette,
  Clock,
  Plus,
  X,
  Check
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Slider } from '../components/ui/slider';
import { useNotifications } from '../contexts/NotificationContext';
import { useVoice } from '../contexts/VoiceContext';
import { useDevice } from '../contexts/DeviceContext';
import { toast } from 'sonner';
import { Reminder } from '../models/notifications';

export function ControlCenter() {
  const { notifications, reminders, unreadCount, markAsRead, deleteNotification, createReminder, toggleReminder, deleteReminder } = useNotifications();
  const { isListening, currentTranscript, startListening, stopListening, commands } = useVoice();
  const { deviceStatus, muteDevice, toggleLED, restartDevice } = useDevice();
  
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [reminderForm, setReminderForm] = useState({
    title: '',
    message: '',
    time: '',
    repeat: 'once' as 'once' | 'daily' | 'weekly' | 'monthly',
  });

  // Phone command states
  const [volume, setVolume] = useState(75);
  const [ledColor, setLedColor] = useState('#0000ff');
  const [ledBrightness, setLedBrightness] = useState(50);

  const handleCreateReminder = async () => {
    if (!reminderForm.title || !reminderForm.time) {
      toast.error('Please fill in required fields');
      return;
    }

    await createReminder({
      title: reminderForm.title,
      message: reminderForm.message,
      time: reminderForm.time,
      repeat: reminderForm.repeat,
      enabled: true,
    });

    setReminderForm({ title: '', message: '', time: '', repeat: 'once' });
    setReminderDialogOpen(false);
  };

  const sendPhoneCommand = (command: string, params?: any) => {
    toast.success('Command sent', {
      description: `${command} command executed`,
      duration: 2000,
    });
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900">Control Center</h1>
        <p className="text-sm text-gray-600">全功能控制中心</p>
      </div>

      <Tabs defaultValue="notifications" className="p-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications" className="text-xs">
            <Bell className="w-4 h-4 mr-1" />
            通知
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="voice" className="text-xs">
            <Mic className="w-4 h-4 mr-1" />
            语音
          </TabsTrigger>
          <TabsTrigger value="remote" className="text-xs">
            <Smartphone className="w-4 h-4 mr-1" />
            远程
          </TabsTrigger>
          <TabsTrigger value="reminders" className="text-xs">
            <Clock className="w-4 h-4 mr-1" />
            提醒
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">通知中心</CardTitle>
                <Badge variant="secondary">{notifications.length} 条通知</Badge>
              </div>
              <CardDescription>查看和管理所有通知</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>暂无通知</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${
                      notification.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <Badge 
                            variant={
                              notification.priority === 'urgent' ? 'destructive' :
                              notification.priority === 'high' ? 'default' :
                              'secondary'
                            }
                            className="text-xs"
                          >
                            {notification.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.timestamp).toLocaleString('zh-CN')}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Voice Tab */}
        <TabsContent value="voice" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">语音交互</CardTitle>
              <CardDescription>使用语音控制设备和创建任务</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-4 py-6">
                <Button
                  size="lg"
                  variant={isListening ? 'destructive' : 'default'}
                  onClick={isListening ? stopListening : startListening}
                  className="w-32 h-32 rounded-full"
                >
                  <Mic className={`w-12 h-12 ${isListening ? 'animate-pulse' : ''}`} />
                </Button>
                <div className="text-center">
                  <p className="text-sm font-medium">
                    {isListening ? '正在聆听...' : '点击开始语音输入'}
                  </p>
                  {currentTranscript && (
                    <p className="text-xs text-gray-600 mt-2 max-w-md">
                      "{currentTranscript}"
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">语音命令历史</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {commands.slice(0, 5).map(command => (
                    <div key={command.id} className="p-2 bg-gray-50 rounded text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{command.text}</span>
                        <Badge variant="outline" className="text-xs">
                          {command.type}
                        </Badge>
                      </div>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(command.timestamp).toLocaleString('zh-CN')}
                      </p>
                    </div>
                  ))}
                  {commands.length === 0 && (
                    <p className="text-center text-gray-500 py-4">暂无语音命令记录</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">常用语音指令</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-blue-50 rounded text-xs">
                <p className="font-medium">创建任务</p>
                <p className="text-gray-600">"创建任务..."</p>
              </div>
              <div className="p-2 bg-blue-50 rounded text-xs">
                <p className="font-medium">设置提醒</p>
                <p className="text-gray-600">"提醒我..."</p>
              </div>
              <div className="p-2 bg-blue-50 rounded text-xs">
                <p className="font-medium">控制设备</p>
                <p className="text-gray-600">"静音设备"</p>
              </div>
              <div className="p-2 bg-blue-50 rounded text-xs">
                <p className="font-medium">查询信息</p>
                <p className="text-gray-600">"今天有什么任务"</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Remote Control Tab */}
        <TabsContent value="remote" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">手机远程控制</CardTitle>
              <CardDescription>远程控制设备和调整设置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Device Status */}
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">设备状态</h4>
                  <Badge variant={deviceStatus.online ? 'default' : 'destructive'} className="bg-white/20">
                    {deviceStatus.online ? '在线' : '离线'}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-xs opacity-80">电量</p>
                    <p className="text-lg font-bold">{deviceStatus.battery}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs opacity-80">WiFi</p>
                    <p className="text-lg font-bold">{deviceStatus.wifiSignal}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs opacity-80">状态</p>
                    <p className="text-lg font-bold capitalize">{deviceStatus.state}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h4 className="text-sm font-medium mb-3">快速操作</h4>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="flex flex-col h-auto py-4"
                    onClick={() => {
                      muteDevice();
                      sendPhoneCommand('mute');
                    }}
                  >
                    <Volume2 className="w-6 h-6 mb-2" />
                    <span className="text-xs">静音</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex flex-col h-auto py-4"
                    onClick={() => {
                      toggleLED();
                      sendPhoneCommand('led_toggle');
                    }}
                  >
                    <Lightbulb className="w-6 h-6 mb-2" />
                    <span className="text-xs">LED</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex flex-col h-auto py-4"
                    onClick={() => {
                      restartDevice();
                      sendPhoneCommand('restart');
                    }}
                  >
                    <RotateCw className="w-6 h-6 mb-2" />
                    <span className="text-xs">重启</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex flex-col h-auto py-4"
                    onClick={() => sendPhoneCommand('wake')}
                  >
                    <Power className="w-6 h-6 mb-2" />
                    <span className="text-xs">唤醒</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex flex-col h-auto py-4"
                    onClick={() => sendPhoneCommand('sleep')}
                  >
                    <Zap className="w-6 h-6 mb-2" />
                    <span className="text-xs">休眠</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex flex-col h-auto py-4"
                    onClick={() => sendPhoneCommand('led_color', { color: ledColor })}
                  >
                    <Palette className="w-6 h-6 mb-2" />
                    <span className="text-xs">颜色</span>
                  </Button>
                </div>
              </div>

              {/* Volume Control */}
              <div>
                <Label className="text-sm">音量: {volume}%</Label>
                <Slider
                  value={[volume]}
                  onValueChange={([value]) => {
                    setVolume(value);
                    sendPhoneCommand('volume', { level: value });
                  }}
                  min={0}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>

              {/* LED Control */}
              <div className="space-y-3">
                <div>
                  <Label className="text-sm">LED 颜色</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="color"
                      value={ledColor}
                      onChange={(e) => setLedColor(e.target.value)}
                      className="w-20 h-10"
                    />
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => sendPhoneCommand('led_color', { color: ledColor })}
                    >
                      应用颜色
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm">LED 亮度: {ledBrightness}%</Label>
                  <Slider
                    value={[ledBrightness]}
                    onValueChange={([value]) => {
                      setLedBrightness(value);
                      sendPhoneCommand('led_brightness', { level: value });
                    }}
                    min={0}
                    max={100}
                    step={10}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reminders Tab */}
        <TabsContent value="reminders" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">定时提醒</CardTitle>
                  <CardDescription>管理您的提醒和通知</CardDescription>
                </div>
                <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      新建
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>创建提醒</DialogTitle>
                      <DialogDescription>设置定时提醒通知</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="reminder-title">标题</Label>
                        <Input
                          id="reminder-title"
                          value={reminderForm.title}
                          onChange={(e) => setReminderForm({ ...reminderForm, title: e.target.value })}
                          placeholder="输入提醒标题"
                        />
                      </div>
                      <div>
                        <Label htmlFor="reminder-message">消息（可选）</Label>
                        <Input
                          id="reminder-message"
                          value={reminderForm.message}
                          onChange={(e) => setReminderForm({ ...reminderForm, message: e.target.value })}
                          placeholder="输入提醒消息"
                        />
                      </div>
                      <div>
                        <Label htmlFor="reminder-time">时间</Label>
                        <Input
                          id="reminder-time"
                          type="time"
                          value={reminderForm.time}
                          onChange={(e) => setReminderForm({ ...reminderForm, time: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="reminder-repeat">重复</Label>
                        <Select
                          value={reminderForm.repeat}
                          onValueChange={(value: any) => setReminderForm({ ...reminderForm, repeat: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="once">仅一次</SelectItem>
                            <SelectItem value="daily">每天</SelectItem>
                            <SelectItem value="weekly">每周</SelectItem>
                            <SelectItem value="monthly">每月</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleCreateReminder} className="w-full">
                        创建提醒
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {reminders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>暂无提醒</p>
                </div>
              ) : (
                reminders.map(reminder => (
                  <div
                    key={reminder.id}
                    className="p-3 rounded-lg border bg-white flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{reminder.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {reminder.repeat === 'once' ? '一次' : 
                           reminder.repeat === 'daily' ? '每天' :
                           reminder.repeat === 'weekly' ? '每周' : '每月'}
                        </Badge>
                      </div>
                      {reminder.message && (
                        <p className="text-xs text-gray-600 mt-1">{reminder.message}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        🕐 {reminder.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={reminder.enabled}
                        onCheckedChange={() => toggleReminder(reminder.id)}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteReminder(reminder.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
