import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useConfig } from '../contexts/ConfigContext';
import { Wifi, WifiOff, Zap } from 'lucide-react';
import { apiService } from '../services/api';

export function Connect() {
  const navigate = useNavigate();
  const { connect, connectDemo } = useConfig();
  const [serverUrl, setServerUrl] = useState('');
  const [port, setPort] = useState('8000');
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<{ ip: string; port: number; name: string }[]>([]);

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const foundDevices = await apiService.discoverDevices();
      setDevices(foundDevices);
    } catch (error) {
      console.error('Failed to scan network:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleConnect = (ip: string, devicePort: number) => {
    connect(ip, devicePort);
    navigate('/app');
  };

  const handleManualConnect = () => {
    if (serverUrl && port) {
      connect(serverUrl, parseInt(port));
      navigate('/app');
    }
  };

  const handleDemoMode = () => {
    connectDemo();
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Wifi className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Connect to Device</h1>
            <p className="text-gray-600">Connect to your AI-Bot or try Demo Mode</p>
          </div>

          <div className="space-y-6">
            {/* Demo Mode Button */}
            <button
              onClick={handleDemoMode}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
            >
              <Zap className="w-5 h-5" />
              Try Demo Mode
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or connect to real device</span>
              </div>
            </div>

            {/* Manual Connect */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Server IP / Hostname
                </label>
                <input
                  type="text"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                  placeholder="192.168.1.100 or localhost"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Port
                </label>
                <input
                  type="number"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  placeholder="8000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleManualConnect}
                disabled={!serverUrl || !port}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Connect
              </button>
            </div>

            {/* Network Scan */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleScan}
                disabled={isScanning}
                className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 disabled:border-gray-300 disabled:text-gray-400 transition-colors"
              >
                {isScanning ? 'Scanning Network...' : 'Scan Network'}
              </button>

              {devices.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Found Devices:</p>
                  {devices.map((device, index) => (
                    <button
                      key={index}
                      onClick={() => handleConnect(device.ip, device.port)}
                      className="w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{device.name}</p>
                          <p className="text-sm text-gray-600">
                            {device.ip}:{device.port}
                          </p>
                        </div>
                        <WifiOff className="w-5 h-5 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> Don't have a device? Click "Try Demo Mode" to explore the app with sample data!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}