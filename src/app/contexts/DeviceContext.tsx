import React, { createContext, useContext, useState, useEffect } from 'react';
import { DeviceStatus } from '../models/types';
import { wsService } from '../services/websocket';
import { apiService } from '../services/api';
import { toast } from 'sonner';
import { useConfig } from './ConfigContext';
import { mockDeviceStatus } from '../utils/mockData';

interface DeviceContextType {
  deviceStatus: DeviceStatus;
  muteDevice: () => Promise<void>;
  toggleLED: () => Promise<void>;
  restartDevice: () => Promise<void>;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within DeviceProvider');
  }
  return context;
};

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const config = useConfig();
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>({
    online: false,
    battery: 0,
    wifiSignal: 0,
    state: 'idle',
  });

  // Destructure after ensuring config exists
  const isDemoMode = config?.isDemoMode ?? false;
  const isConnected = config?.isConnected ?? false;

  useEffect(() => {
    if (isDemoMode) {
      setDeviceStatus(mockDeviceStatus);
      // Simulate battery drain
      const interval = setInterval(() => {
        setDeviceStatus((prev) => ({
          ...prev,
          battery: Math.max(0, prev.battery - 1),
        }));
      }, 60000);
      return () => clearInterval(interval);
    }

    const handleDeviceStatus = (data: DeviceStatus) => {
      setDeviceStatus(data);
    };

    wsService.on('device_status', handleDeviceStatus);

    if (isConnected && wsService.isConnected()) {
      apiService.getDeviceStatus()
        .then(setDeviceStatus)
        .catch((error) => {
          console.error('Failed to fetch device status:', error);
        });
    }

    return () => {
      wsService.off('device_status', handleDeviceStatus);
    };
  }, [isDemoMode, isConnected]);

  const muteDevice = async () => {
    if (isDemoMode) {
      toast.success('Device muted (Demo Mode)');
      return;
    }
    try {
      await apiService.muteDevice();
      toast.success('Device muted');
    } catch (error) {
      toast.error('Failed to mute device');
    }
  };

  const toggleLED = async () => {
    if (isDemoMode) {
      toast.success('LED toggled (Demo Mode)');
      return;
    }
    try {
      await apiService.toggleLED();
      toast.success('LED toggled');
    } catch (error) {
      toast.error('Failed to toggle LED');
    }
  };

  const restartDevice = async () => {
    if (isDemoMode) {
      toast.success('Device restarting... (Demo Mode)');
      return;
    }
    try {
      await apiService.restartDevice();
      toast.success('Device restarting...');
    } catch (error) {
      toast.error('Failed to restart device');
    }
  };

  return (
    <DeviceContext.Provider value={{ deviceStatus, muteDevice, toggleLED, restartDevice }}>
      {children}
    </DeviceContext.Provider>
  );
};