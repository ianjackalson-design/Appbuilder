import { useState } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { Settings2, Wifi, Brain, Volume2, Lightbulb, Info, Sparkles, TestTube } from 'lucide-react';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Slider } from '../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { aiService } from '../services/aiService';
import { toast } from 'sonner';

export function Settings() {
  const { config, updateConfig, isConnected, disconnect } = useConfig();
  const [formData, setFormData] = useState(config);
  const [isTesting, setIsTesting] = useState(false);

  const handleSave = async () => {
    await updateConfig(formData);
  };

  const handleTestAI = async () => {
    if (!formData.llmApiKey?.trim()) {
      toast.error('Please enter an API key first');
      return;
    }

    setIsTesting(true);
    
    // Configure AI service with current form data
    aiService.setConfig({
      provider: formData.llmProvider as 'openai' | 'anthropic' | 'gemini' | 'custom',
      model: formData.llmModel,
      apiKey: formData.llmApiKey,
      baseUrl: formData.llmBaseUrl,
    });

    const result = await aiService.testConnection();
    
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    
    setIsTesting(false);
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Server Connection */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Wifi className="w-5 h-5 text-gray-700" />
            <h3 className="font-semibold text-gray-900">Server Connection</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Status</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm font-medium text-gray-900">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
            <div>
              <Label>Server URL</Label>
              <Input
                value={formData.serverUrl}
                onChange={(e) => setFormData({ ...formData, serverUrl: e.target.value })}
                placeholder="192.168.1.100"
                disabled
              />
            </div>
            <div>
              <Label>Port</Label>
              <Input
                type="number"
                value={formData.serverPort}
                onChange={(e) => setFormData({ ...formData, serverPort: parseInt(e.target.value) })}
                placeholder="8000"
                disabled
              />
            </div>
            {isConnected && (
              <Button onClick={disconnect} variant="outline" className="w-full">
                Disconnect
              </Button>
            )}
          </div>
        </div>

        {/* LLM Configuration */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-gray-700" />
            <h3 className="font-semibold text-gray-900">AI Configuration</h3>
            <Sparkles className="w-4 h-4 text-yellow-500 ml-auto" />
          </div>
          <div className="space-y-3">
            <div>
              <Label>AI Provider</Label>
              <Select
                value={formData.llmProvider}
                onValueChange={(value) => {
                  setFormData({ 
                    ...formData, 
                    llmProvider: value,
                    // Set default models for each provider
                    llmModel: value === 'openai' ? 'gpt-4' 
                      : value === 'anthropic' ? 'claude-3-5-sonnet-20241022'
                      : value === 'gemini' ? 'gemini-1.5-pro'
                      : formData.llmModel
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                  <SelectItem value="custom">Custom (OpenAI Compatible)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Model</Label>
              <Select
                value={formData.llmModel}
                onValueChange={(value) => setFormData({ ...formData, llmModel: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formData.llmProvider === 'openai' && (
                    <>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    </>
                  )}
                  {formData.llmProvider === 'anthropic' && (
                    <>
                      <SelectItem value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</SelectItem>
                      <SelectItem value="claude-3-opus-20240229">Claude 3 Opus</SelectItem>
                      <SelectItem value="claude-3-sonnet-20240229">Claude 3 Sonnet</SelectItem>
                      <SelectItem value="claude-3-haiku-20240307">Claude 3 Haiku</SelectItem>
                    </>
                  )}
                  {formData.llmProvider === 'gemini' && (
                    <>
                      <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                      <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                      <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                    </>
                  )}
                  {formData.llmProvider === 'custom' && (
                    <SelectItem value="custom-model">Custom Model</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                {formData.llmProvider === 'openai' && 'OpenAI models for chat and completion'}
                {formData.llmProvider === 'anthropic' && 'Anthropic Claude AI models'}
                {formData.llmProvider === 'gemini' && 'Google Gemini AI models'}
                {formData.llmProvider === 'custom' && 'OpenAI-compatible API endpoint'}
              </p>
            </div>

            <div>
              <Label>API Key</Label>
              <Input
                type="password"
                value={formData.llmApiKey || ''}
                onChange={(e) => setFormData({ ...formData, llmApiKey: e.target.value })}
                placeholder={
                  formData.llmProvider === 'openai' ? 'sk-••••••••••••••••'
                  : formData.llmProvider === 'anthropic' ? 'sk-ant-••••••••••••••••'
                  : formData.llmProvider === 'gemini' ? 'AI••••••••••••••••'
                  : 'Your API key'
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.llmProvider === 'openai' && 'Get your API key from platform.openai.com'}
                {formData.llmProvider === 'anthropic' && 'Get your API key from console.anthropic.com'}
                {formData.llmProvider === 'gemini' && 'Get your API key from makersuite.google.com'}
                {formData.llmProvider === 'custom' && 'Enter your custom API key'}
              </p>
            </div>

            {(formData.llmProvider === 'custom' || formData.llmBaseUrl) && (
              <div>
                <Label>Base URL (Optional)</Label>
                <Input
                  value={formData.llmBaseUrl || ''}
                  onChange={(e) => setFormData({ ...formData, llmBaseUrl: e.target.value })}
                  placeholder="https://api.example.com/v1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Custom API endpoint for proxies or compatible services
                </p>
              </div>
            )}

            <Button 
              onClick={handleTestAI} 
              variant="outline" 
              className="w-full"
              disabled={isTesting || !formData.llmApiKey?.trim()}
            >
              <TestTube className="w-4 h-4 mr-2" />
              {isTesting ? 'Testing Connection...' : 'Test AI Connection'}
            </Button>
          </div>
        </div>

        {/* Voice Configuration */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Volume2 className="w-5 h-5 text-gray-700" />
            <h3 className="font-semibold text-gray-900">Voice Configuration</h3>
          </div>
          <div className="space-y-3">
            <div>
              <Label>TTS Voice</Label>
              <Select
                value={formData.ttsVoice}
                onValueChange={(value) => setFormData({ ...formData, ttsVoice: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US-AriaNeural">Aria (Female, US)</SelectItem>
                  <SelectItem value="en-US-GuyNeural">Guy (Male, US)</SelectItem>
                  <SelectItem value="en-GB-SoniaNeural">Sonia (Female, UK)</SelectItem>
                  <SelectItem value="en-GB-RyanNeural">Ryan (Male, UK)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Speech Speed: {formData.ttsSpeed}x</Label>
              <Slider
                value={[formData.ttsSpeed]}
                onValueChange={([value]) => setFormData({ ...formData, ttsSpeed: value })}
                min={0.5}
                max={2}
                step={0.1}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Device Volume: {formData.deviceVolume}%</Label>
              <Slider
                value={[formData.deviceVolume]}
                onValueChange={([value]) => setFormData({ ...formData, deviceVolume: value })}
                min={0}
                max={100}
                step={5}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        {/* Device Configuration */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-gray-700" />
            <h3 className="font-semibold text-gray-900">LED Configuration</h3>
          </div>
          <div className="space-y-3">
            <div>
              <Label>LED Mode</Label>
              <Select
                value={formData.ledMode}
                onValueChange={(value) => setFormData({ ...formData, ledMode: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="off">Off</SelectItem>
                  <SelectItem value="breathing">Breathing</SelectItem>
                  <SelectItem value="rainbow">Rainbow</SelectItem>
                  <SelectItem value="solid">Solid Color</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.ledMode === 'solid' && (
              <div>
                <Label>LED Color</Label>
                <Input
                  type="color"
                  value={formData.ledColor || '#0000ff'}
                  onChange={(e) => setFormData({ ...formData, ledColor: e.target.value })}
                />
              </div>
            )}
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-gray-700" />
            <h3 className="font-semibold text-gray-900">About</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Version</span>
              <span className="font-medium text-gray-900">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Device</span>
              <span className="font-medium text-gray-900">AI-Bot Desktop Assistant</span>
            </div>
            <div className="flex justify-between">
              <span>Hardware</span>
              <span className="font-medium text-gray-900">ESP32-S3</span>
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Settings
        </Button>
      </div>
    </div>
  );
}