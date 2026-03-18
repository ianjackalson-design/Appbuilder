# AI 集成实例演示 (AI Integration Examples)

本文档提供了使用不同 AI 提供商的实际配置示例和对话演示。

## 目录

1. [OpenAI 示例](#openai-示例)
2. [Anthropic Claude 示例](#anthropic-claude-示例)
3. [Google Gemini 示例](#google-gemini-示例)
4. [本地部署示例（Ollama）](#本地部署示例ollama)

---

## OpenAI 示例

### 配置步骤

1. **获取 API Key**
   - 访问 https://platform.openai.com
   - 注册/登录账户
   - 进入 API Keys 页面
   - 点击 "Create new secret key"
   - 复制生成的密钥（格式：`sk-proj-...`）

2. **在应用中配置**
   - AI Provider: `OpenAI`
   - Model: `gpt-4o` (推荐) 或 `gpt-3.5-turbo` (经济版)
   - API Key: `sk-proj-your-key-here`
   - Base URL: (留空)

3. **测试连接**
   - 点击 "Test AI Connection"
   - 看到成功消息后保存

### 对话示例

**用户**: 你好，我需要帮助安排今天的任务

**GPT-4o**: 当然！我很乐意帮你安排今天的任务。为了更好地帮助你，我需要了解一些信息：

1. 你今天有多少空闲时间？
2. 有哪些必须完成的紧急任务？
3. 你倾向于先处理哪类任务（重要的、紧急的、还是简单的）？

请告诉我这些信息，我会帮你制定一个高效的任务计划。

### 成本参考

- **GPT-4o**: $2.50 / 1M input tokens, $10.00 / 1M output tokens
- **GPT-3.5 Turbo**: $0.50 / 1M input tokens, $1.50 / 1M output tokens
- 一次普通对话大约消耗 500-2000 tokens

---

## Anthropic Claude 示例

### 配置步骤

1. **获取 API Key**
   - 访问 https://console.anthropic.com
   - 注册/登录账户
   - 进入 API Keys 页面
   - 点击 "Create Key"
   - 复制生成的密钥（格式：`sk-ant-...`）

2. **在应用中配置**
   - AI Provider: `Anthropic Claude`
   - Model: `claude-3-5-sonnet-20241022` (推荐) 或 `claude-3-haiku-20240307` (经济版)
   - API Key: `sk-ant-your-key-here`
   - Base URL: (留空)

3. **测试连接**
   - 点击 "Test AI Connection"
   - 确认连接成功

### 对话示例

**用户**: 帮我分析一下这个项目提案的风险点

**Claude 3.5 Sonnet**: 我很乐意帮你分析项目提案的风险点。不过我需要先查看提案内容。你可以分享以下信息：

1. **项目基本信息**：
   - 项目目标和范围
   - 预期时间线
   - 预算规模

2. **关键要素**：
   - 涉及的技术栈
   - 团队规模和能力
   - 外部依赖

请分享这些信息，我将为你提供全面的风险分析，包括技术风险、资源风险、时间风险和业务风险等方面。

### 成本参考

- **Claude 3.5 Sonnet**: $3.00 / 1M input tokens, $15.00 / 1M output tokens
- **Claude 3 Haiku**: $0.25 / 1M input tokens, $1.25 / 1M output tokens
- Claude 通常在复杂推理任务上表现优秀

---

## Google Gemini 示例

### 配置步骤

1. **获取 API Key**
   - 访问 https://makersuite.google.com/app/apikey
   - 使用 Google 账户登录
   - 点击 "Create API Key"
   - 选择或创建 Google Cloud 项目
   - 复制生成的密钥（格式：`AIza...`）

2. **在应用中配置**
   - AI Provider: `Google Gemini`
   - Model: `gemini-1.5-pro` (推荐) 或 `gemini-1.5-flash` (快速版)
   - API Key: `AIzaYour-Key-Here`
   - Base URL: (留空)

3. **测试连接**
   - 点击 "Test AI Connection"
   - 验证连接成功

### 对话示例

**用户**: 我的设备电量只剩 20%，帮我规划一下如何优化使用

**Gemini 1.5 Pro**: 了解！设备电量 20% 需要谨慎管理。以下是我的优化建议：

**立即采取的措施**：
1. 🔆 降低屏幕亮度至 30-40%
2. 📶 关闭不必要的无线连接（蓝牙、WiFi）
3. 🔕 启用省电模式

**使用策略**：
1. **优先级排序**：只保留核心功能运行
2. **避免操作**：暂停后台应用、避免高负载任务
3. **充电计划**：建议在 1-2 小时内充电

**预计续航**：
- 待机模式：约 4-5 小时
- 轻度使用：约 2-3 小时
- 持续使用：约 1 小时

需要我帮你调整这些设置吗？

### 成本参考

- **Gemini 1.5 Pro**: $1.25 / 1M input tokens, $5.00 / 1M output tokens
- **Gemini 1.5 Flash**: $0.075 / 1M input tokens, $0.30 / 1M output tokens
- Gemini 有较大的免费额度，适合开发测试

---

## 本地部署示例（Ollama）

### 配置步骤

1. **安装 Ollama**
   ```bash
   # macOS/Linux
   curl -fsSL https://ollama.com/install.sh | sh
   
   # 或访问 https://ollama.com 下载安装包
   ```

2. **下载模型**
   ```bash
   # 下载 Llama 2 模型
   ollama pull llama2
   
   # 或者下载其他模型
   ollama pull mistral
   ollama pull codellama
   ```

3. **启动 Ollama 服务**
   ```bash
   ollama serve
   # 默认运行在 http://localhost:11434
   ```

4. **在应用中配置**
   - AI Provider: `Custom (OpenAI Compatible)`
   - Model: `llama2` (或您下载的其他模型)
   - API Key: `ollama` (任意值，本地不需要真实密钥)
   - Base URL: `http://localhost:11434/v1`

5. **测试连接**
   - 确保 Ollama 服务正在运行
   - 点击 "Test AI Connection"

### 对话示例

**用户**: 介绍一下你自己

**Llama 2**: 你好！我是 Llama 2，一个由 Meta AI 开发的大型语言模型。我可以帮助你完成各种任务：

🎯 **我能做什么**：
- 回答问题和提供信息
- 协助写作和编程
- 分析和总结文本
- 创意内容生成
- 多语言翻译

⚡ **我的特点**：
- 完全本地运行，保护隐私
- 无需网络连接
- 没有 API 调用费用
- 响应速度取决于你的硬件

有什么我可以帮助你的吗？

### 优势

✅ **完全免费**：无 API 费用  
✅ **隐私保护**：数据不离开本地  
✅ **离线可用**：无需互联网连接  
✅ **可定制**：可以微调自己的模型

### 注意事项

⚠️ **硬件要求**：
- 最少 8GB RAM（16GB 推荐）
- 最少 4GB 存储空间
- GPU 加速可显著提升性能

⚠️ **性能对比**：
- 本地模型通常不如云端大模型（GPT-4、Claude）强大
- 但对于日常对话和简单任务完全够用

---

## 混合使用策略

您可以根据不同场景选择不同的 AI 提供商：

### 📊 选择指南

| 场景 | 推荐提供商 | 原因 |
|------|-----------|------|
| 复杂推理任务 | Claude 3.5 Sonnet | 推理能力强 |
| 日常对话 | GPT-3.5 Turbo | 性价比高 |
| 编程辅助 | GPT-4o | 代码能力强 |
| 隐私敏感 | Ollama (本地) | 数据不外传 |
| 成本控制 | Gemini 1.5 Flash | 价格便宜 |
| 快速响应 | Gemini Flash / GPT-3.5 | 响应快 |

### 💡 成本优化建议

1. **开发测试阶段**：使用 Gemini（免费额度）或本地 Ollama
2. **生产环境**：
   - 简单任务：GPT-3.5 Turbo
   - 复杂任务：按需切换到 GPT-4 或 Claude
3. **混合方案**：日常用免费/便宜的，关键时刻用强大的

---

## 常见应用场景

### 1️⃣ 智能任务管理

**用户**: 帮我创建一个项目计划，包含设计、开发、测试三个阶段

**AI 回复**: 我来帮你创建一个完整的项目计划...

（AI 会提供详细的任务分解建议，您可以直接在任务管理界面创建）

### 2️⃣ 设备控制辅助

**用户**: 我要睡觉了，帮我准备一下设备

**AI 回复**: 好的，我建议执行以下操作：
1. 降低 LED 亮度至 10%
2. 切换到夜间模式
3. 设置勿扰模式
4. 关闭所有提醒

需要我执行这些操作吗？

### 3️⃣ 日程规划

**用户**: 明天我有三个会议，帮我安排中间的休息时间

**AI 回复**: 让我帮你优化日程...

（AI 会分析日程并给出合理的时间安排建议）

---

## 故障排除示例

### 问题：连接超时

```
错误信息: "Connection timeout"

解决方案:
1. 检查网络连接
2. 如果使用代理，在 Base URL 中配置代理地址
3. 尝试增加超时时间（需要修改代码）
```

### 问题：API Key 无效

```
错误信息: "Invalid API key"

解决方案:
1. 重新复制 API Key，确保没有多余空格
2. 检查 API Key 是否过期
3. 确认 API Key 对应的账户有足够余额
```

### 问题：模型不可用

```
错误信息: "Model not found"

解决方案:
1. 检查模型名称是否正确
2. 确认您的账户有访问该模型的权限
3. 某些模型可能需要申请访问权限
```

---

## 最佳实践总结

### ✅ 建议做法

1. **先测试后使用**：配置完成后务必测试连接
2. **保存敏感信息**：妥善保管 API Key，不要分享给他人
3. **监控使用量**：定期检查 API 使用情况和费用
4. **选择合适模型**：根据任务复杂度选择性价比最优的模型
5. **启用 AI 开关**：不需要时关闭 AI，避免误触发

### ❌ 避免做法

1. **不要分享 API Key**：泄露可能导致账户被盗用
2. **不要使用生产 Key 测试**：建议使用测试环境的 Key
3. **不要发送敏感信息**：所有对话都会发送到 AI 服务商
4. **不要过度调用**：注意成本控制，避免不必要的 API 调用

---

**最后更新**: 2026-03-18  
**需要帮助**: 如有问题，请查看 AI_INTEGRATION_GUIDE.md 或联系技术支持
