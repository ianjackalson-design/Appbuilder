import { useDevice } from '../contexts/DeviceContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useTasks } from '../contexts/TaskContext';
import { useEvents } from '../contexts/EventContext';
import { DeviceCard } from '../components/DeviceCard';
import { Volume2, Lightbulb, RotateCw, Bell, CheckSquare, Calendar, TrendingUp } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Link } from 'react-router';

export function Home() {
  const { deviceStatus, muteDevice, toggleLED, restartDevice } = useDevice();
  const { unreadCount, notifications } = useNotifications();
  const { tasks } = useTasks();
  const { events } = useEvents();

  const activeTasks = tasks.filter(t => !t.completed).length;
  const upcomingEvents = events.filter(e => new Date(e.startTime) >= new Date()).length;
  const recentNotifications = notifications.slice(0, 3);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <DeviceCard status={deviceStatus} />

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Link to="/app/control">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <Bell className="w-6 h-6 text-blue-600" />
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              <p className="text-xs text-gray-600">通知</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/app/tasks">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <CheckSquare className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{activeTasks}</p>
              <p className="text-xs text-gray-600">待办任务</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/app/tasks">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{upcomingEvents}</p>
              <p className="text-xs text-gray-600">日程安排</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Notifications */}
      {recentNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center justify-between">
              <span>最近通知</span>
              <Link to="/app/control" className="text-blue-600 text-xs">查看全部 →</Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentNotifications.map(notification => (
              <div
                key={notification.id}
                className={`p-2 rounded border text-xs ${
                  notification.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <p className="font-medium">{notification.title}</p>
                <p className="text-gray-600 text-xs">{notification.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={muteDevice}
            className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Volume2 className="w-6 h-6 text-gray-700" />
            <span className="text-xs font-medium text-gray-700">Mute</span>
          </button>

          <button
            onClick={toggleLED}
            className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Lightbulb className="w-6 h-6 text-gray-700" />
            <span className="text-xs font-medium text-gray-700">LED</span>
          </button>

          <button
            onClick={restartDevice}
            className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <RotateCw className="w-6 h-6 text-gray-700" />
            <span className="text-xs font-medium text-gray-700">Restart</span>
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-6 h-6 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold mb-2">AI-Bot 智能助手</h3>
            <p className="text-sm text-blue-50">
              您的语音控制桌面 AI 助手，支持电脑自动化控制。
              管理任务、控制设备、AI 对话、语音交互—一站式智能体验。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}