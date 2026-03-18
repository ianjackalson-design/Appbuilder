# AI 集成使用指南 (AI Integration Guide)

## 概述

您的智能设备控制应用现在已经集成了完整的 AI 对话服务，支持多个主流 AI 提供商。您可以在聊天界面中与真实的 AI 模型进行对话。

## 支持的 AI 提供商

### 1. **OpenAI**
- **模型**: GPT-4, GPT-4 Turbo, GPT-4o, GPT-3.5 Turbo
- **获取 API Key**: [platform.openai.com](https://platform.openai.com)
- **定价**: 按 token 计费，具体请查看官网

### 2. **Anthropic Claude**
- **模型**: Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku
- **获取 API Key**: [console.anthropic.com](https://console.anthropic.com)
- **定价**: 按 token 计费，具体请查看官网

### 3. **Google Gemini**
- **模型**: Gemini 1.5 Pro, Gemini 1.5 Flash, Gemini Pro
- **获取 API Key**: [makersuite.google.com](https://makersuite.google.com)
- **定价**: 免费额度 + 按使用计费

### 4. **自定义 (OpenAI 兼容)**
- 支持任何与 OpenAI API 兼容的服务
- 例如: Ollama, LocalAI, vLLM 等本地部署方案

## 快速开始

### 步骤 1: 进入 Demo Mode

1. 在连接页面点击 **"Use Demo Mode"**
2. 进入主应用界面

### 步骤 2: 配置 AI 服务

1. 点击底部导航栏的 **"设置" (Settings)** 标签
2. 找到 **"AI Configuration"** 部分
3. 选择您想使用的 AI 提供商
4. 输入对应的 API Key
5. (可选) 对于自定义提供商，输入 Base URL
6. 点击 **"Test AI Connection"** 测试连接
7. 点击底部的 **"Save Settings"** 保存配置

### 步骤 3: 启用 AI 对话

1. 进入 **"对话" (Conversation)** 页面
2. 在右上角找到 AI 开关（带 ✨ 图标）
3. 启用开关（变为黄色表示已启用）
4. 开始与 AI 助手对话！

## 功能特性

### ✅ 支持的功能

- **多提供商支持**: 无缝切换不同的 AI 服务
- **实时对话**: 即时获得 AI 回复
- **上下文记忆**: AI 会记住整个对话历史
- **错误处理**: 自动回退到模拟响应（如果 API 调用失败）
- **Demo Mode 兼容**: 即使在 Demo Mode 也可以使用真实 AI
- **连接测试**: 保存前测试 API 配置

### 🎯 使用场景

1. **智能对话**: 与 AI 助手进行自然对话
2. **任务协助**: 让 AI 帮你规划任务和日程
3. **设备控制**: 通过自然语言控制智能设备
4. **信息查询**: 询问各类问题获得智能回答

## 配置示例

### OpenAI 配置

```
AI Provider: OpenAI
Model: gpt-4o
API Key: sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxx
Base URL: (留空，使用默认)
```

### Anthropic Claude 配置

```
AI Provider: Anthropic Claude
Model: claude-3-5-sonnet-20241022
API Key: sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxx
Base URL: (留空，使用默认)
```

### Google Gemini 配置

```
AI Provider: Google Gemini
Model: gemini-1.5-pro
API Key: AIzaxxxxxxxxxxxxxxxxxxxxxxxxxx
Base URL: (留空，使用默认)
```

### 自定义本地服务 (Ollama 示例)

```
AI Provider: Custom (OpenAI Compatible)
Model: llama2 (或您本地部署的模型)
API Key: ollama (任意值，Ollama 不需要密钥)
Base URL: http://localhost:11434/v1
```

## 注意事项

### 🔒 安全提示

- **API Key 安全**: API Key 存储在本地，但建议定期更换
- **成本控制**: 注意 API 调用会产生费用，建议设置使用限额
- **隐私保护**: 对话内容会发送到第三方 AI 服务，请勿发送敏感信息

### 💡 最佳实践

1. **先测试**: 配置后先使用"Test AI Connection"测试
2. **选择合适的模型**: 
   - GPT-3.5/Claude Haiku: 快速、便宜，适合日常对话
   - GPT-4/Claude Opus: 强大、昂贵，适合复杂任务
3. **启用/禁用控制**: 不需要 AI 时可以关闭，节省费用
4. **Demo Mode 优势**: 在 Demo Mode 下测试 AI 功能，无需连接设备

### ⚠️ 故障排除

**问题**: Test Connection 失败
- 检查 API Key 是否正确
- 检查网络连接
- 确认 API 账户有足够余额

**问题**: AI 回复失败
- 查看浏览器控制台错误信息
- 尝试切换到其他模型
- 检查 API 服务状态

**问题**: 回复很慢
- 某些模型（如 GPT-4）响应较慢，属正常现象
- 可以尝试使用更快的模型（GPT-3.5, Claude Haiku）

## 技术架构

### 代码结构

```
src/app/
├── services/
│   └── aiService.ts          # AI 服务核心逻辑
├── contexts/
│   ├── ConfigContext.tsx     # 配置管理（包含 AI 配置）
│   └── ChatContext.tsx       # 聊天逻辑（集成 AI 服务）
└── screens/
    ├── Settings.tsx          # 设置页面（AI 配置 UI）
    └── Chat.tsx              # 对话页面（AI 开关）
```

### API 调用流程

1. 用户发送消息 → ChatContext
2. ChatContext 检查是否启用 AI
3. 如果启用 AI，调用 aiService.sendMessage()
4. aiService 根据配置调用对应的 AI 提供商 API
5. 收到回复后显示在聊天界面

## 扩展开发

### 添加新的 AI 提供商

编辑 `/src/app/services/aiService.ts`：

```typescript
// 1. 添加到 provider 类型
export interface AIServiceConfig {
  provider: 'openai' | 'anthropic' | 'gemini' | 'custom' | 'your-provider';
  // ...
}

// 2. 在 sendMessage 中添加 case
case 'your-provider':
  return this.sendYourProviderMessage(messages, systemPrompt);

// 3. 实现对应的方法
private async sendYourProviderMessage(
  messages: Message[],
  systemPrompt?: string
): Promise<AIResponse> {
  // 实现您的 API 调用逻辑
}
```

### 自定义系统提示词

编辑 `/src/app/contexts/ChatContext.tsx`，修改 `sendMessage` 中的系统提示词：

```typescript
const response = await aiService.sendMessage(
  [...messages, userMessage],
  'Your custom system prompt here'  // 在这里修改
);
```

## 许可与致谢

- OpenAI API: [openai.com/policies](https://openai.com/policies)
- Anthropic API: [anthropic.com/legal](https://www.anthropic.com/legal)
- Google Gemini: [ai.google.dev/terms](https://ai.google.dev/terms)

---

**版本**: 1.0.0  
**更新日期**: 2026-03-18  
**作者**: AI-Bot Team
