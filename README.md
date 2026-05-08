# ZenShorts AI - 无脸视频素材生成工具

一个由 AI 驱动的工具，帮助创作者快速生成 30 秒短视频素材。

## 功能特点

- 🎬 **智能脚本生成**: 使用 Google Gemini 1.5 Pro 生成 30 秒英文脚本
- 🖼️ **AI 图片生成**: 使用 Google Gemini 2.5 Flash 生成 4 张高清图片
- 📱 **响应式设计**: 完美适配桌面端和移动端
- ⬇️ **一键下载**: 快速下载脚本和图片素材

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件并添加你的 API 密钥:

```env
GEMINI_API_KEY=your-gemini-api-key
```

### 3. 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 技术栈

- **框架**: Next.js 14 (App Router)
- **UI**: Tailwind CSS
- **语言**: TypeScript
- **AI API**: Google Gemini (1.5 Pro + 2.5 Flash)
- **图标**: Lucide React

## 项目结构

```
zen-shorts-ai/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts       # AI 生成 API
│   ├── globals.css            # 全局样式
│   ├── layout.tsx             # 根布局
│   └── page.tsx              # 主页面
├── components/
│   ├── TopicInput.tsx        # 主题输入组件
│   ├── GenerateButton.tsx    # 生成按钮
│   ├── LoadingState.tsx      # 加载状态
│   ├── ScriptDisplay.tsx     # 脚本展示
│   ├── ImageGallery.tsx      # 图片画廊
│   └── DownloadButton.tsx    # 下载按钮
├── lib/
│   ├── types.ts              # TypeScript 类型
│   ├── prompts.ts            # AI 提示词模板
│   └── utils.ts              # 工具函数
└── package.json
```

## 使用流程

1. 输入视频主题（例如："The art of mindfulness"）
2. 点击 **Generate** 按钮
3. 等待 AI 生成脚本和图片
4. 查看生成的 4 个分镜脚本
5. 预览 4 张 AI 生成的图片
6. 点击 **Download All** 下载所有素材

## 获取 API 密钥

### Google Gemini API Key

1. 访问 [Google AI Studio](https://aistudio.google.com/)
2. 注册账号并登录
3. 获取 API Key

## 开发说明

### API 端点

- `POST /api/generate` - 生成脚本和图片

请求示例:
```json
{
  "topic": "The art of mindfulness in daily life"
}
```

响应示例:
```json
{
  "success": true,
  "data": {
    "script": {
      "topic": "The art of mindfulness in daily life",
      "total_duration": 30,
      "scenes": [...]
    },
    "images": ["base64_image_1", "base64_image_2", ...]
  }
}
```

## 许可证

MIT License

## 支持

如有问题或建议，请提交 Issue。
