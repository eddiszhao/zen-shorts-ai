# ZenShorts AI - 技术架构文档

## 1. 架构设计

### 1.1 系统架构概览

```
┌─────────────────────────────────────────────────────┐
│                    Frontend                          │
│                  Next.js 14 App Router               │
│  ┌─────────────────────────────────────────────┐    │
│  │              React Components                 │    │
│  │  • HomePage (主页面)                          │    │
│  │  • TopicInput (输入组件)                      │    │
│  │  • ScriptDisplay (脚本展示)                   │    │
│  │  • ImageGallery (图片画廊)                    │    │
│  │  • LoadingState (加载状态)                   │    │
│  └─────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────┐    │
│  │            State Management (useState)        │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                    API Routes                         │
│  /api/generate (POST) - 统一生成接口                  │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│               External AI Services                   │
│  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │ OpenAI GPT-4o    │  │ Google Gemini 2.5 Flash │  │
│  │ (脚本生成)        │  │ (图片生成 - Nano Banana) │  │
│  └──────────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### 1.2 技术栈

| 技术类别 | 技术选型 | 版本要求 |
|---------|---------|---------|
| 框架 | Next.js | 14.x |
| 路由 | App Router | 最新 |
| UI 库 | Tailwind CSS | 3.x |
| 语言 | TypeScript | 5.x |
| AI API (脚本) | OpenAI SDK | ^4.0 |
| AI API (图片) | Google Generative AI | ^0.8 |
| 运行时 | Node.js | 18.x+ |
| 包管理 | npm | 9.x+ |

### 1.3 项目结构

```
zen-shorts-ai/
├── app/
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 主页面
│   ├── globals.css             # 全局样式
│   └── api/
│       └── generate/
│           └── route.ts        # 生成 API 路由
├── components/
│   ├── TopicInput.tsx          # 主题输入组件
│   ├── GenerateButton.tsx      # 生成按钮组件
│   ├── ScriptDisplay.tsx       # 脚本展示组件
│   ├── ImageGallery.tsx        # 图片画廊组件
│   ├── LoadingState.tsx        # 加载状态组件
│   └── DownloadButton.tsx      # 下载按钮组件
├── lib/
│   ├── types.ts                # TypeScript 类型定义
│   ├── prompts.ts              # AI Prompt 模板
│   └── utils.ts                # 工具函数
├── public/
│   └── (静态资源)
├── .env.local                  # 环境变量
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── README.md
```

## 2. 路由定义

### 2.1 页面路由

| 路由 | 页面名称 | 功能描述 |
|-----|---------|---------|
| `/` | 首页/主界面 | 主题输入 → 素材生成 → 结果展示 |

### 2.2 API 路由

| 路由 | 方法 | 功能描述 |
|-----|------|---------|
| `/api/generate` | POST | 统一生成接口：调用 AI 生成脚本和图片 |

**请求格式:**
```typescript
// POST /api/generate
// Body: { topic: string }

interface GenerateRequest {
  topic: string;  // 用户输入的视频主题
}
```

**响应格式:**
```typescript
// Success Response
interface GenerateResponse {
  success: true;
  data: {
    script: Script;           // 生成的脚本
    images: string[];         // Base64 编码的图片数组
  };
}

// Error Response
interface GenerateError {
  success: false;
  error: string;              // 错误信息
  code: string;              // 错误代码
}
```

## 3. 数据模型

### 3.1 TypeScript 类型定义

```typescript
// lib/types.ts

// 单个分镜
export interface Scene {
  scene_number: number;      // 场景编号 (1-4)
  narration: string;         // 英文旁白文本
  image_prompt: string;      // 图片生成提示词
  duration: number;          // 持续时间（秒）
}

// 完整脚本
export interface Script {
  topic: string;             // 用户输入的主题
  total_duration: number;    // 总时长（30 秒）
  scenes: Scene[];           // 4 个分镜数组
}

// 应用状态
export interface AppState {
  topic: string;
  isLoading: boolean;
  currentStep: 'idle' | 'script' | 'images' | 'complete';
  error: string | null;
  script: Script | null;
  images: string[];
}

// API 请求响应
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}
```

### 3.2 数据流程图

```mermaid
flowchart LR
    A[用户输入主题] --> B[点击 Generate]
    B --> C[POST /api/generate]
    C --> D[调用 GPT-4o API]
    D --> E[解析 JSON 脚本]
    E --> F[遍历 4 个分镜]
    F --> G[调用 Gemini API]
    G --> H[生成 Base64 图片]
    H --> I[返回响应]
    I --> J[更新前端状态]
    J --> K[展示结果]
```

## 4. API 集成规范

### 4.1 OpenAI GPT-4o 集成

**文件位置:** `lib/openai.ts`

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateScript(topic: string): Promise<Script> {
  const prompt = `Create a 30-second English narration script...`;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are a professional scriptwriter...'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
  });

  return JSON.parse(response.choices[0].message.content);
}
```

**环境变量:**
```
OPENAI_API_KEY=sk-...
```

### 4.2 Google Gemini 2.5 Flash Image API 集成

**文件位置:** `lib/gemini.ts`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateImage(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ 
    model: 'flash-experimental',
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
    }
  });
  
  const result = await model.generateContent(prompt);
  const response = result.response;
  
  const imagePart = response.candidates?.[0]?.content?.parts?.find(
    (part) => part.inlineData?.mimeType?.startsWith('image/')
  );
  
  if (imagePart?.inlineData) {
    return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
  }
  
  throw new Error('No image generated');
}
```

**环境变量:**
```
GEMINI_API_KEY=AI...
```

**注意:** Gemini Nano Banana 是实验性模型，如果不可用，可回退到 `gemini-2.0-flash-exp` 或其他可用模型。

## 5. 核心组件设计

### 5.1 组件树结构

```
App
└── HomePage (主页面容器)
    ├── TopicInput (主题输入)
    ├── GenerateButton (生成按钮)
    ├── LoadingState (加载状态 - 条件渲染)
    │   └── StepIndicator (步骤指示器)
    ├── ScriptDisplay (脚本展示 - 条件渲染)
    │   └── SceneCard[] (分镜卡片)
    ├── ImageGallery (图片画廊 - 条件渲染)
    │   └── ImageCard[] (图片卡片)
    └── DownloadButton[] (下载按钮组 - 条件渲染)
```

### 5.2 组件职责

| 组件名称 | 文件位置 | 职责 |
|---------|---------|------|
| TopicInput | components/TopicInput.tsx | 接收用户输入，处理验证 |
| GenerateButton | components/GenerateButton.tsx | 触发生成流程，状态管理 |
| LoadingState | components/LoadingState.tsx | 显示生成进度 |
| ScriptDisplay | components/ScriptDisplay.tsx | 渲染脚本内容 |
| ImageGallery | components/ImageGallery.tsx | 渲染图片画廊 |
| DownloadButton | components/DownloadButton.tsx | 处理文件下载 |

## 6. 状态管理

### 6.1 组件状态 (useState)

```typescript
// app/page.tsx
'use client';

export default function HomePage() {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'idle' | 'script' | 'images' | 'complete'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [script, setScript] = useState<Script | null>(null);
  const [images, setImages] = useState<string[]>([]);

  // ... handlers
}
```

### 6.2 状态转换逻辑

```
idle → (点击生成) → script (正在生成脚本)
script → (脚本完成) → images (正在生成图片)
images → (图片完成) → complete (展示结果)

任意状态 → (出错) → idle (显示错误)
complete → (重新生成) → idle
```

## 7. 环境配置

### 7.1 .env.local 示例

```env
# OpenAI API Key
OPENAI_API_KEY=sk-your-openai-api-key

# Google Gemini API Key
GEMINI_API_KEY=your-gemini-api-key

# 应用配置
NEXT_PUBLIC_APP_NAME=ZenShorts AI
```

### 7.2 .gitignore 配置

```
# Environment variables
.env
.env.local
.env.*.local

# Next.js
.next/
out/

# Dependencies
node_modules/

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.idea/
.vscode/
*.swp
*.swo
```

## 8. 错误处理策略

### 8.1 错误类型定义

```typescript
enum ErrorCode {
  INVALID_TOPIC = 'INVALID_TOPIC',           // 无效主题
  OPENAI_ERROR = 'OPENAI_ERROR',              // OpenAI API 错误
  GEMINI_ERROR = 'GEMINI_ERROR',              // Gemini API 错误
  NETWORK_ERROR = 'NETWORK_ERROR',           // 网络错误
  RATE_LIMIT = 'RATE_LIMIT',                  // API 限流
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',            // 未知错误
}
```

### 8.2 错误响应格式

```typescript
// API 错误响应
{
  success: false,
  error: '错误描述信息',
  code: 'ERROR_CODE'
}

// 前端错误展示
{
  // 友好的用户提示
  message: '哎呀，出了点小问题...',
  action: '重试' | '检查网络' | '联系支持'
}
```

### 8.3 重试机制

```typescript
// 指数退避重试
async function retryWithBackoff(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000);
    }
  }
  throw new Error('Max retries exceeded');
}
```

## 9. 性能优化

### 9.1 前端优化

- **图片懒加载**: 使用 Next.js Image 组件
- **组件分割**: 动态导入大型组件
- **状态缓存**: 避免不必要的重新渲染
- **防抖处理**: 输入框防抖 300ms

### 9.2 API 优化

- **并发请求**: 同时调用 4 个图片生成 API
- **流式响应**: 考虑使用 Server-Sent Events (SSE)
- **错误边界**: 隔离单个图片失败，不影响其他

### 9.3 Next.js 配置

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['generativelanguage.googleapis.com'],
    formats: ['image/png', 'image/jpeg'],
  },
  experimental: {
    serverActions: true,
  },
}
```

## 10. 安全考虑

### 10.1 API 密钥保护

- 所有 API 密钥存储在服务端 `.env.local`
- 绝不暴露到客户端
- 使用环境变量而非硬编码

### 10.2 输入验证

```typescript
// 主题验证
function validateTopic(topic: string): boolean {
  const trimmed = topic.trim();
  return trimmed.length >= 3 && trimmed.length <= 200;
}
```

### 10.3 速率限制

- 前端: 防抖 + 禁用按钮防止重复提交
- API: Next.js API Routes 可集成 Vercel 速率限制

## 11. 开发规范

### 11.1 代码风格

- 使用 TypeScript strict 模式
- 组件使用箭头函数
- 优先使用 Tailwind CSS
- 遵循 ESLint 规则

### 11.2 提交规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具相关
```

### 11.3 分支策略

```
main (生产环境)
  └── develop (开发分支)
        └── feature/* (功能分支)
```

## 12. 部署方案

### 12.1 部署平台

推荐使用 **Vercel** 部署 Next.js 应用：
- 原生支持 Next.js App Router
- 内置边缘网络
- 自动 HTTPS
- 集成环境变量管理

### 12.2 环境变量配置

在 Vercel 控制台配置：
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`

### 12.3 构建命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 启动生产服务器
npm start
```

## 13. 测试策略

### 13.1 单元测试

使用 **Jest** + **React Testing Library**：

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
```

测试覆盖：
- 组件渲染
- 用户交互
- 状态更新
- 错误处理

### 13.2 E2E 测试

使用 **Playwright**：

```bash
npm install -D @playwright/test
```

测试场景：
- 完整生成流程
- 错误恢复
- 下载功能
