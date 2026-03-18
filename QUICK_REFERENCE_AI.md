# AI 功能快速参考卡 🚀

## 一分钟快速启用

```
1. Demo Mode → Settings → AI Configuration
2. 选择提供商 → 输入 API Key → 测试 → 保存
3. Conversation → 开启 AI 开关 (✨) → 开始对话
```

## API Key 获取地址

| 提供商 | 获取地址 | Key 格式 |
|--------|----------|----------|
| **OpenAI** | platform.openai.com | `sk-proj-...` |
| **Claude** | console.anthropic.com | `sk-ant-...` |
| **Gemini** | makersuite.google.com | `AIza...` |
| **Ollama** | ollama.com (本地) | 任意值 |

## 推荐配置

### 🆓 零成本方案
```
Provider: Google Gemini
Model: gemini-1.5-flash
免费额度: 每天 1500 请求
```

### 💰 经济型方案
```
Provider: OpenAI
Model: gpt-3.5-turbo
成本: ~$0.002/次对话
```

### 🎯 性能型方案
```
Provider: Anthropic Claude
Model: claude-3-5-sonnet-20241022
适合: 复杂任务、推理分析
```

### 🔒 隐私型方案
```
Provider: Custom (Ollama)
Model: llama2
Base URL: http://localhost:11434/v1
完全本地、免费、离线
```

## 常用命令

### Ollama 本地部署
```bash
# 安装
curl -fsSL https://ollama.com/install.sh | sh

# 下载模型
ollama pull llama2

# 启动服务
ollama serve
```

## 功能位置

| 功能 | 位置 |
|------|------|
| **配置 AI** | Settings → AI Configuration |
| **测试连接** | Settings → Test AI Connection |
| **启用 AI** | Conversation → 右上角开关 |
| **切换模型** | Settings → Model 下拉菜单 |

## 成本对比

### 每 1000 次普通对话成本估算

| 提供商 | 模型 | 估算成本 |
|--------|------|----------|
| Gemini | Flash | ~$0.15 |
| OpenAI | GPT-3.5 | ~$2.00 |
| OpenAI | GPT-4o | ~$12.00 |
| Claude | Haiku | ~$1.50 |
| Claude | 3.5 Sonnet | ~$18.00 |
| Ollama | 任意 | **$0** |

## 故障速查

| 问题 | 解决方法 |
|------|----------|
| 连接失败 | 检查 API Key / 网络 / 余额 |
| 回复慢 | 切换更快的模型 |
| 成本高 | 使用 GPT-3.5 / Gemini Flash |
| 隐私担忧 | 使用 Ollama 本地部署 |
| 无法访问 | 配置代理 Base URL |

## 切换场景建议

```
日常闲聊     → Gemini Flash / GPT-3.5
代码编程     → GPT-4o / Claude 3.5 Sonnet
复杂分析     → Claude 3.5 Sonnet
快速问答     → Gemini Flash
隐私对话     → Ollama (本地)
预算有限     → Gemini (免费额度)
```

## 开关状态

```
✨ AI ON  (黄色) = 使用真实 AI
✨ AI OFF (灰色) = 使用模拟响应
```

## 必读文档

- **完整指南**: `AI_INTEGRATION_GUIDE.md`
- **配置示例**: `AI_EXAMPLES.md`
- **更新说明**: `AI_INTEGRATION_SUMMARY.md`

---

**提示**: 首次使用建议选择 Gemini Flash（有免费额度）进行测试！
