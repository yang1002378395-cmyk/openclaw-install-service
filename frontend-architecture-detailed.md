# 前端架构详细设计文档

## 🎯 概述
**文档类型**: 前端架构详细设计  
**阶段**: 第三阶段 - 技术架构设计  
**负责代理**: Frontend Developer  
**开始时间**: 2026-02-14T23:15:00+08:00  
**预计完成**: 2026-02-14T23:45:00+08:00  
**状态**: 🚀 进行中

## 📊 技术栈确定

### 核心框架
```
✅ Next.js 14 (App Router)
  - 原因: React全栈框架，SSR/SSG/CSR支持
  - 版本: 14.2+ (稳定版)
  - 特性: App Router, Server Actions, 流式渲染

✅ TypeScript 5.5+
  - 原因: 类型安全，提高代码质量
  - 配置: 严格模式，ES2022目标

✅ React 18
  - 原因: 并发特性，性能优化
  - 特性: Suspense, Transitions, 流式SSR
```

### UI框架和样式
```
✅ Tailwind CSS 3.4+
  - 原因: 实用优先，开发效率高
  - 配置: JIT模式，自定义设计系统

✅ shadcn/ui
  - 原因: 可访问性优秀，定制灵活
  - 组件: 基于Radix UI的可复用组件

✅ Framer Motion
  - 原因: 高性能动画库
  - 用途: 页面过渡，微交互，加载状态
```

### 状态管理
```
✅ Zustand
  - 原因: 轻量级，TypeScript友好
  - 用途: 客户端状态，UI状态

✅ TanStack Query (React Query)
  - 原因: 服务器状态管理，缓存，同步
  - 用途: API数据获取，缓存，乐观更新

✅ React Hook Form
  - 原因: 高性能表单库
  - 特性: 非受控组件，验证集成
```

### 工具和构建
```
✅ Vite (开发环境)
  - 原因: 极速HMR，构建速度快

✅ ESLint + Prettier
  - 配置: Next.js推荐配置，自定义规则

✅ Husky + lint-staged
  - 用途: Git钩子，代码质量保证

✅ Vitest + Testing Library
  - 用途: 单元测试，组件测试

✅ Playwright
  - 用途: E2E测试，跨浏览器测试
```

## 🏗️ 项目结构

### 目录结构
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 认证相关路由组
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── (dashboard)/       # 仪表板路由组
│   │   ├── projects/
│   │   ├── studio/
│   │   └── layout.tsx
│   ├── api/              # API路由 (Server Actions)
│   │   ├── auth/
│   │   ├── projects/
│   │   └── generate/
│   ├── layout.tsx        # 根布局
│   └── page.tsx          # 首页
├── components/           # 可复用组件
│   ├── ui/              # 基础UI组件 (shadcn/ui)
│   ├── layout/          # 布局组件
│   ├── forms/           # 表单组件
│   ├── editor/          # 编辑器组件
│   └── shared/          # 共享组件
├── lib/                 # 工具函数和库
│   ├── api/             # API客户端
│   ├── utils/           # 工具函数
│   ├── constants/       # 常量定义
│   └── types/           # TypeScript类型
├── hooks/               # 自定义Hooks
│   ├── useAuth.ts
│   ├── useProjects.ts
│   └── useWebSocket.ts
├── stores/              # Zustand状态存储
│   ├── auth.store.ts
│   ├── ui.store.ts
│   └── editor.store.ts
├── styles/              # 全局样式
│   ├── globals.css
│   └── design-tokens.css
└── public/              # 静态资源
    ├── images/
    └── fonts/
```

### 模块化设计
```
功能模块划分:
1. 认证模块: 登录、注册、密码重置
2. 仪表板模块: 项目列表、统计、设置
3. 工作室模块: 编辑器、预览、工具
4. 协作模块: 实时协作、聊天、评论
5. 生成模块: AI生成界面、任务管理
6. 文件模块: 文件管理、预览、分享
7. 团队模块: 团队管理、成员、权限
```

## 🎨 设计系统实现

### 色彩系统 (基于color-system-core.json)
```css
/* styles/design-tokens.css */
:root {
  /* 品牌色 */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;
  
  /* 功能色 */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  
  /* 中性色 */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-900: #111827;
  
  /* 语义色 */
  --color-background: var(--color-gray-50);
  --color-surface: white;
  --color-text-primary: var(--color-gray-900);
  --color-text-secondary: var(--color-gray-600);
  
  /* 阴影 */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  /* 圆角 */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  
  /* 间距 */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}
```

### 组件库设计
```typescript
// components/ui/button.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### 响应式设计
```typescript
// 断点定义 (Tailwind默认)
const breakpoints = {
  sm: '640px',    // 手机横屏/小平板
  md: '768px',    // 平板竖屏
  lg: '1024px',   // 平板横屏/小桌面
  xl: '1280px',   // 桌面
  '2xl': '1536px', // 大桌面
}

// 响应式工具函数
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = React.useState(false)
  
  React.useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)
    
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener('change', listener)
    
    return () => media.removeEventListener('change', listener)
  }, [query])
  
  return matches
}

// 组件使用示例
const Component = () => {
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.md})`)
  
  return (
    <div className={cn(
      "grid",
      isMobile ? "grid-cols-1" : "grid-cols-3"
    )}>
      {/* 内容 */}
    </div>
  )
}
```

## 🔧 核心功能实现

### 1. 认证系统
```typescript
// hooks/useAuth.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: User | null
  tokens: {
    accessToken: string | null
    refreshToken: string | null
  }
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: { accessToken: null, refreshToken: null },
      isAuthenticated: false,
      isLoading: false,
      
      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const response = await api.auth.login({ email, password })
          set({
            user: response.data.user,
            tokens: response.data.tokens,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      
      // 其他方法...
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// 组件使用
const LoginForm = () => {
  const { login, isLoading } = useAuth()
  const form = useForm<LoginFormData>({/* ... */})
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password)
      router.push('/dashboard')
    } catch (error) {
      // 错误处理
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField name="email" control={form.control} render={/* ... */} />
        <FormField name="password" control={form.control} render={/* ... */} />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '登录中...' : '登录'}
        </Button>
      </form>
    </Form>
  )
}
```

### 2. 项目管理
```typescript
// hooks/useProjects.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const useProjects = () => {
  const queryClient = useQueryClient()
  
  // 获取项目列表
  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.projects.list(),
    staleTime: 5 * 60 * 1000, // 5分钟
  })
  
  // 创建项目
  const createProject = useMutation({
    mutationFn: (data: CreateProjectData) => api.projects.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
  
  // 更新项目
  const updateProject = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectData }) =>
      api.projects.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project', variables.id] })
    },
  })
  
  // 删除项目
  const deleteProject = useMutation({
    mutationFn: (id: string) => api.projects.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
  
  return {
    projects: projectsQuery.data?.data || [],
    isLoading: projectsQuery.isLoading,
    createProject,
    updateProject,
    deleteProject,
  }
}

// 项目列表组件
const ProjectList = () => {
  const { projects, isLoading, deleteProject } = useProjects()
  
  if (isLoading) return <ProjectListSkeleton />
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onDelete={() => deleteProject.mutate(project.id)}
        />
      ))}
    </div>
  )
}
```

### 3. 实时协作
```typescript
// hooks/useWebSocket.ts
import { useEffect, useRef, useCallback } from 'react'
import { useAuth } from './useAuth'

interface WebSocketMessage {
  type: string
  payload: any
  timestamp: number
  userId?: string
}

export const useWebSocket = (projectId: string) => {
  const { tokens } = useAuth()
  const wsRef = useRef<WebSocket | null>(null)
  const [messages, setMessages] = useState<WebSocketMessage[]>([])
  const [connected, setConnected] = useState(false)
  
  // 连接WebSocket
  useEffect(() => {
    if (!tokens.accessToken || !projectId) return
    
    const wsUrl = `wss://api.example.com/ws/v1/projects/${projectId}?token=${tokens.accessToken}`
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws
    
    ws.onopen = () => {
      setConnected(true)
      // 发送加入消息
      ws.send(JSON.stringify({
        type: 'join',
        payload: { projectId },
        timestamp: Date.now(),
      }))
    }
    
    ws.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data)
      setMessages(prev => [...prev, message])
      
      // 根据消息类型处理
      switch (message.type) {
        case 'cursor':
          // 更新其他用户的光标位置
          break
        case 'edit':
          // 应用其他用户的编辑
          break
        case 'chat':
          // 显示聊天消息
          break
        case 'presence':
          // 更新在线用户列表
          break
      }
    }
    
    ws.onclose = () => {
      setConnected(false)
    }
    
    return () => {
      ws.close()
    }
  }, [tokens.accessToken, projectId])
  
  // 发送消息
  const sendMessage = useCallback((type: string, payload: any) => {
    if (!wsRef.current || !connected) return
    
    const message: WebSocketMessage = {
      type,
      payload,
      timestamp: Date.now(),
    }
    
    wsRef.current.send(JSON.stringify(message))
  }, [connected])
  
  // 发送光标位置
  const sendCursorPosition = useCallback((position: { x: number; y: number }) => {
    sendMessage('cursor', { position })
  }, [sendMessage])
  
  // 发送编辑操作
  const sendEdit = useCallback((operation: EditorOperation) => {
    sendMessage('edit', { operation })
  }, [sendMessage])
  
  // 发送聊天消息
  const sendChat = useCallback((content: string) => {
    sendMessage('chat', { content })
  }, [sendMessage])
  
  return {
    connected,
    messages,
    sendCursorPosition,
    sendEdit,
    sendChat,
  }
}
```

### 4. AI内容生成
```typescript
// components/generation/ImageGenerator.tsx
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { Progress } from '@/components/ui/progress'

interface GenerationForm {
  prompt: string
  model: 'firefly' |