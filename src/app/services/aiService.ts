import { Message } from '../models/types';

export interface AIServiceConfig {
  provider: 'openai' | 'anthropic' | 'gemini' | 'custom';
  model: string;
  apiKey: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model?: string;
}

class AIService {
  private config: AIServiceConfig | null = null;

  setConfig(config: AIServiceConfig) {
    this.config = config;
  }

  getConfig(): AIServiceConfig | null {
    return this.config;
  }

  /**
   * Send a chat message to the AI service
   */
  async sendMessage(
    messages: Message[],
    systemPrompt?: string
  ): Promise<AIResponse> {
    if (!this.config) {
      throw new Error('AI service not configured. Please set API credentials in Settings.');
    }

    if (!this.config.apiKey || this.config.apiKey.trim() === '') {
      throw new Error('API key is required. Please configure it in Settings.');
    }

    switch (this.config.provider) {
      case 'openai':
        return this.sendOpenAIMessage(messages, systemPrompt);
      case 'anthropic':
        return this.sendAnthropicMessage(messages, systemPrompt);
      case 'gemini':
        return this.sendGeminiMessage(messages, systemPrompt);
      case 'custom':
        return this.sendCustomMessage(messages, systemPrompt);
      default:
        throw new Error(`Unsupported AI provider: ${this.config.provider}`);
    }
  }

  /**
   * OpenAI API integration
   */
  private async sendOpenAIMessage(
    messages: Message[],
    systemPrompt?: string
  ): Promise<AIResponse> {
    const baseUrl = this.config!.baseUrl || 'https://api.openai.com/v1';
    
    const formattedMessages = [
      ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
      ...messages.map(msg => ({
        role: msg.source === 'app' ? 'user' : 'assistant',
        content: msg.text
      }))
    ];

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config!.apiKey}`
      },
      body: JSON.stringify({
        model: this.config!.model || 'gpt-4',
        messages: formattedMessages,
        temperature: this.config!.temperature || 0.7,
        max_tokens: this.config!.maxTokens || 2000
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
      throw new Error(error.error?.message || `OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0]?.message?.content || '',
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0
      },
      model: data.model
    };
  }

  /**
   * Anthropic Claude API integration
   */
  private async sendAnthropicMessage(
    messages: Message[],
    systemPrompt?: string
  ): Promise<AIResponse> {
    const baseUrl = this.config!.baseUrl || 'https://api.anthropic.com/v1';
    
    const formattedMessages = messages.map(msg => ({
      role: msg.source === 'app' ? 'user' : 'assistant',
      content: msg.text
    }));

    const response = await fetch(`${baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config!.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.config!.model || 'claude-3-5-sonnet-20241022',
        messages: formattedMessages,
        max_tokens: this.config!.maxTokens || 2000,
        temperature: this.config!.temperature || 0.7,
        ...(systemPrompt && { system: systemPrompt })
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
      throw new Error(error.error?.message || `Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      content: data.content[0]?.text || '',
      usage: {
        promptTokens: data.usage?.input_tokens || 0,
        completionTokens: data.usage?.output_tokens || 0,
        totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
      },
      model: data.model
    };
  }

  /**
   * Google Gemini API integration
   */
  private async sendGeminiMessage(
    messages: Message[],
    systemPrompt?: string
  ): Promise<AIResponse> {
    const baseUrl = this.config!.baseUrl || 'https://generativelanguage.googleapis.com/v1beta';
    const model = this.config!.model || 'gemini-1.5-pro';
    
    // Gemini uses a different format - alternating user/model messages
    const contents = messages.map(msg => ({
      role: msg.source === 'app' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Add system instruction if provided
    const requestBody: any = {
      contents,
      generationConfig: {
        temperature: this.config!.temperature || 0.7,
        maxOutputTokens: this.config!.maxTokens || 2000
      }
    };

    if (systemPrompt) {
      requestBody.systemInstruction = {
        parts: [{ text: systemPrompt }]
      };
    }

    const response = await fetch(
      `${baseUrl}/models/${model}:generateContent?key=${this.config!.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
      throw new Error(error.error?.message || `Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      content: data.candidates[0]?.content?.parts[0]?.text || '',
      usage: {
        promptTokens: data.usageMetadata?.promptTokenCount || 0,
        completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: data.usageMetadata?.totalTokenCount || 0
      },
      model: model
    };
  }

  /**
   * Custom API endpoint (OpenAI-compatible)
   */
  private async sendCustomMessage(
    messages: Message[],
    systemPrompt?: string
  ): Promise<AIResponse> {
    if (!this.config!.baseUrl) {
      throw new Error('Base URL is required for custom provider');
    }

    // Use OpenAI-compatible format for custom endpoints
    return this.sendOpenAIMessage(messages, systemPrompt);
  }

  /**
   * Test the API connection
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.config) {
      return { success: false, message: 'AI service not configured' };
    }

    try {
      const testMessage: Message = {
        id: 'test',
        text: 'Hello',
        source: 'app',
        timestamp: new Date().toISOString()
      };

      await this.sendMessage([testMessage], 'Respond with just "OK"');
      
      return { 
        success: true, 
        message: `Successfully connected to ${this.config.provider}` 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Connection test failed' 
      };
    }
  }
}

export const aiService = new AIService();
