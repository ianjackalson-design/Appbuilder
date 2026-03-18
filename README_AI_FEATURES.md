# 🤖 AI 对话功能 - 使用说明

欢迎使用智能设备控制应用的 AI 对话功能！本文档将帮助您快速上手。

---

## 📋 目录

1. [功能亮点](#功能亮点)
2. [5分钟快速开始](#5分钟快速开始)
3. [详细配置指南](#详细配置指南)
4. [常见问题](#常见问题)
5. [文档索引](#文档索引)

---

## ✨ 功能亮点

### 🌟 核心特性

- ✅ **多 AI 提供商支持**  
  OpenAI、Anthropic Claude、Google Gemini、本地 Ollama

- ✅ **即开即用**  
  在 Demo Mode 下无需后端服务器即可使用 AI

- ✅ **智能开关**  
  随时启用/禁用 AI 功能，节省成本

- ✅ **完整上下文**  
  AI 记住整个对话历史，提供连贯回复

- ✅ **错误保护**  
  API 失败时自动回退到模拟响应

- ✅ **配置简单**  
  友好的图形界面，一键测试连接

### 🎯 适用场景

| 场景 | AI 能帮你做什么 |
|------|----------------|
| 📝 **任务规划** | 分析需求，建议任务分解和优先级 |
| 📅 **日程管理** | 优化时间安排，避免冲突 |
| 💡 **决策支持** | 提供分析和建议 |
| 🤖 **设备控制** | 理解自然语言指令 |
| 💬 **智能对话** | 回答问题，提供信息 |

---

## 🚀 5分钟快速开始

### 方案 A: 使用 Google Gemini（推荐新手）

**为什么选择 Gemini?**
- ✅ 有免费额度（每天 1500 次请求）
- ✅ 注册简单（使用 Google 账号）
- ✅ 性能优秀

**步骤**：

#### 1️⃣ 获取 API Key (2分钟)

访问 https://makersuite.google.com/app/apikey

```
1. 用 Google 账号登录
2. 点击 "Create API Key"
3. 选择或创建一个 Google Cloud 项目
4. 复制生成的 API Key (格式: AIza...)
```

#### 2️⃣ 配置应用 (2分钟)

在应用中操作：

```
1. 首页点击 "Use Demo Mode"
2. 进入 "Settings" (设置) 标签
3. 找到 "AI Configuration" 部分
4. 配置如下：
   - AI Provider: Google Gemini
   - Model: gemini-1.5-flash
   - API Key: [粘贴您的 Key]
5. 点击 "Test AI Connection" 测试
6. 看到成功消息后，点击 "Save Settings"
```

#### 3️⃣ 开始对话 (1分钟)

```
1. 进入 "Conversation" (对话) 标签
2. 点击右上角的 AI 开关（✨ 图标）
3. 确认开关变为黄色（表示 AI 已启用）
4. 在输入框输入消息，开始对话！
```

### 方案 B: 使用本地 Ollama（隐私优先）

**为什么选择 Ollama?**
- ✅ 完全免费
- ✅ 100% 隐私保护（数据不离开本地）
- ✅ 离线可用

**步骤**：

#### 1️⃣ 安装 Ollama (5分钟)

macOS / Linux:
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Windows:  
访问 https://ollama.com 下载安装包

#### 2️⃣ 下载 AI 模型

```bash
ollama pull llama2
# 或者其他模型：mistral, codellama 等
```

#### 3️⃣ 启动服务

```bash
ollama serve
# 服务将运行在 http://localhost:11434
```

#### 4️⃣ 配置应用

```
1. Demo Mode → Settings → AI Configuration
2. 配置如下：
   - AI Provider: Custom (OpenAI Compatible)
   - Model: llama2
   - API Key: ollama (任意值)
   - Base URL: http://localhost:11434/v1
3. Test AI Connection → Save Settings
4. 进入 Conversation 启用 AI 开关
```

---

## 📖 详细配置指南

### OpenAI (GPT-4, GPT-3.5)

#### 获取 API Key
1. 访问 https://platform.openai.com
2. 注册并充值账户（最少 $5）
3. 创建 API Key

#### 配置
```
Provider: OpenAI
Model: gpt-4o (推荐) 或 gpt-3.5-turbo (经济)
API Key: sk-proj-...
Base URL: (留空)
```

#### 成本参考
- **GPT-3.5**: ~$0.002/次对话（约 1000 次对话 $2）
- **GPT-4o**: ~$0.012/次对话（约 100 次对话 $1.2）

### Anthropic Claude

#### 获取 API Key
1. 访问 https://console.anthropic.com
2. 注册并充值账户
3. 创建 API Key

#### 配置
```
Provider: Anthropic Claude
Model: claude-3-5-sonnet-20241022 (推荐)
API Key: sk-ant-...
Base URL: (留空)
```

#### 成本参考
- **Claude 3.5 Sonnet**: ~$0.018/次对话
- **Claude 3 Haiku**: ~$0.0015/次对话（经济版）

### 对比表格

| 提供商 | 经济型 | 性能型 | 优势 | 适合场景 |
|--------|--------|--------|------|----------|
| **Gemini** | Flash | 1.5 Pro | 免费额度 | 新手、测试 |
| **OpenAI** | GPT-3.5 | GPT-4o | 综合最强 | 通用场景 |
| **Claude** | Haiku | 3.5 Sonnet | 推理强 | 复杂分析 |
| **Ollama** | - | - | 免费隐私 | 隐私优先 |

---

## ❓ 常见问题

### Q1: 如何知道 AI 是否已启用？

**A**: 查看对话页面右上角的 AI 开关：
- ✨ **黄色 "AI ON"** = 已启用，使用真实 AI
- ✨ **灰色 "AI OFF"** = 未启用，使用模拟响应

### Q2: 为什么测试连接失败？

**A**: 检查以下几点：
1. ✅ API Key 是否正确（没有多余空格）
2. ✅ 网络连接是否正常
3. ✅ API 账户是否有余额
4. ✅ 是否选择了正确的提供商

### Q3: AI 回复很慢怎么办？

**A**: 
- GPT-4、Claude 3.5 等强大模型响应较慢（10-30秒）属正常
- 可以切换到更快的模型：
  - GPT-3.5 Turbo
  - Claude 3 Haiku  
  - Gemini 1.5 Flash

### Q4: 如何控制 API 使用成本？

**A**: 
1. 📊 **选择经济型模型**（GPT-3.5, Gemini Flash, Claude Haiku）
2. 🔄 **不用时关闭 AI 开关**
3. 📈 **定期检查 API 使用量**（在提供商控制台）
4. 💰 **设置使用限额**（在提供商账户设置）

### Q5: 数据安全吗？

**A**: 
- ⚠️ 使用云端 AI（OpenAI/Claude/Gemini）时，对话会发送到第三方服务器
- ✅ **建议**：不要发送敏感信息（密码、个人隐私等）
- 🔒 **隐私优先方案**：使用本地 Ollama，数据完全不离开您的设备

### Q6: 可以同时使用多个 AI 吗？

**A**: 
- 目前每次只能使用一个 AI 提供商
- 但您可以随时在设置中切换
- 建议配置：日常用 Gemini/GPT-3.5，复杂任务临时切换到 GPT-4/Claude

### Q7: Ollama 需要什么配置？

**A**: 
- **最低**: 8GB RAM + 4GB 磁盘
- **推荐**: 16GB RAM + GPU（显著提升速度）
- **模型大小**: 
  - llama2: ~4GB
  - mistral: ~4GB
  - codellama: ~4GB

### Q8: 如何查看 API 使用量？

**A**: 
- **OpenAI**: https://platform.openai.com/usage
- **Claude**: https://console.anthropic.com/settings/usage
- **Gemini**: https://makersuite.google.com/app/usage

---

## 📚 文档索引

### 必读文档

1. **[AI_INTEGRATION_SUMMARY.md](./AI_INTEGRATION_SUMMARY.md)**  
   📋 完整功能概览和架构说明

2. **[AI_INTEGRATION_GUIDE.md](./AI_INTEGRATION_GUIDE.md)**  
   📖 详细使用指南，包含所有配置步骤

3. **[AI_EXAMPLES.md](./AI_EXAMPLES.md)**  
   💡 实际配置示例和对话演示

4. **[QUICK_REFERENCE_AI.md](./QUICK_REFERENCE_AI.md)**  
   ⚡ 快速参考卡片，一页查阅所有信息

### 其他文档

- **[APP_README.md](./APP_README.md)** - 应用总体说明
- **[DEMO_MODE_GUIDE.md](./DEMO_MODE_GUIDE.md)** - Demo 模式使用指南
- **[TROUBLESHOOTING_CN.md](./TROUBLESHOOTING_CN.md)** - 故障排除

---

## 🎓 学习路径

### 初级用户 (第1天)
1. ✅ 阅读本文档的"5分钟快速开始"
2. ✅ 使用 Gemini 免费额度体验 AI 功能
3. ✅ 尝试不同类型的对话

### 中级用户 (第2-3天)
1. ✅ 阅读 AI_EXAMPLES.md 了解不同提供商
2. ✅ 对比不同模型的表现和成本
3. ✅ 根据使用场景选择最优方案

### 高级用户 (第4-7天)
1. ✅ 尝试本地 Ollama 部署
2. ✅ 配置多个 API Key，灵活切换
3. ✅ 阅读 AI_INTEGRATION_GUIDE.md 了解扩展开发

---

## 💡 使用技巧

### ✅ 最佳实践

1. **新手阶段**
   - 使用 Gemini（免费额度充足）
   - 多尝试不同类型的问题
   - 熟悉 AI 开关的使用

2. **日常使用**
   - 简单对话：Gemini Flash / GPT-3.5
   - 复杂任务：临时切换到 GPT-4 / Claude
   - 隐私对话：使用本地 Ollama

3. **成本控制**
   - 设置月度预算上限
   - 定期检查使用量
   - 不用时关闭 AI 开关

### ❌ 避免误区

1. ❌ 把 API Key 分享给他人
2. ❌ 在对话中输入密码等敏感信息
3. ❌ 忘记关闭 AI 导致不必要的费用
4. ❌ 一直使用最贵的模型（GPT-4、Claude Opus）

---

## 🆘 需要帮助？

### 遇到问题时的检查清单

```
□ 已进入 Demo Mode
□ 已在设置中配置 AI Provider 和 API Key
□ 已点击 "Test AI Connection" 并成功
□ 已点击 "Save Settings" 保存
□ 已在对话页面启用 AI 开关（变为黄色）
□ API 账户有足够余额（云端 AI）
□ 网络连接正常
```

### 获取更多帮助

1. 📖 查看 [AI_INTEGRATION_GUIDE.md](./AI_INTEGRATION_GUIDE.md) 的故障排除章节
2. 🔍 查看浏览器控制台的错误信息（F12 → Console）
3. 🌐 访问对应 AI 提供商的状态页面
4. 📧 联系技术支持

---

## 🎉 开始您的 AI 之旅

现在您已经了解了所有必要信息，准备好了吗？

**推荐第一步**：
```
1. 访问 https://makersuite.google.com/app/apikey
2. 5分钟获取免费的 Gemini API Key
3. 回到应用，按照"5分钟快速开始"配置
4. 开始与 AI 对话！
```

祝您使用愉快！🚀

---

**文档版本**: 1.0.0  
**最后更新**: 2026-03-18  
**适用于**: 智能设备控制应用 v1.0+
