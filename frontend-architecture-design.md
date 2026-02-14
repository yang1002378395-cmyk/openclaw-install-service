# AI 内容生产平台 - 前端架构设计

## 1. 技术栈选型

### 1.1 前端框架选择

**选择：Next.js 15 (React 19)**
- **理由**：
  1. **AI 原生优势**：支持 React Server Components，减少客户端 bundle 大小
  2. **SEO 友好**：SSR/SSG 对内容平台至关重要
  3. **开发体验**：内置路由、API 路由、图片优化
  4. **性能优化**：自动代码分割、流式渲染
  5. **类型安全**：TypeScript 一流支持

**备选方案**：
- **Vue 3 + Nuxt 4**：适合偏好 Vue 的团队
- **Remix**：优秀的表单处理和错误边界

### 1.2 状态管理方案

**核心方案**：
1. **React Context + useReducer**：应用级状态（主题、用户偏好）
2. **TanStack Query (React Query v5)**：服务器状态管理
3. **Zustand**：客户端复杂状态（工作区状态、UI 状态）
4. **Jotai**：原子状态管理（参数调节、实时预览）

**选择理由**：
- **TanStack Query**：自动缓存、后台刷新、乐观更新
- **Zustand**：轻量级、TypeScript 友好、无样板代码
- **Jotai**：细粒度状态更新，适合实时交互

### 1.3 UI 组件库

**主选：shadcn/ui + Radix UI**
- **理由**：
  1. **无运行时依赖**：纯组件，无 bundle 膨胀
  2. **完全可定制**：基于 Tailwind CSS
  3. **无障碍支持**：Radix UI 提供优秀的 a11y
  4. **类型安全**：完整的 TypeScript 支持

**备选方案**：
- **MUI (Material-UI)**：企业级、功能完整
- **Ant Design**：中文文档完善、组件丰富
- **Headless UI**：完全无样式，最大灵活性

### 1.4 样式方案

**选择：Tailwind CSS v4**
- **理由**：
  1. **开发效率**：实用优先，快速原型
  2. **性能优化**：PurgeCSS 自动移除未使用样式
  3. **设计系统**：易于维护的设计 token
  4. **响应式**：内置响应式工具类

**补充方案**：
- **CSS Modules**：组件级样式隔离
- **Styled Components**：动态样式、主题切换
- **Vanilla Extract**：类型安全的 CSS-in-JS

### 1.5 图表和数据可视化库

**选择：Recharts + D3.js**
- **Recharts**：React 原生、简单易用、类型安全
- **D3.js**：复杂可视化、自定义图表

**具体用途**：
1. **用户分析仪表板**：Recharts
2. **生成进度可视化**：自定义 D3 组件
3. **数据趋势分析**：Recharts + D3 混合

### 1.6 表单处理

**选择：React Hook Form + Zod**
- **React Hook Form**：高性能、非受控组件
- **Zod**：运行时类型检查、表单验证
- **React Hook Form Resolvers**：集成验证

### 1.7 实时通信

**选择：Socket.io Client + TanStack Query WebSocket**
- **Socket.io**：实时双向通信
- **TanStack Query WebSocket**：服务器状态同步

### 1.8 文件处理

**选择：react-dropzone + filepond**
- **react-dropzone**：拖拽上传
- **filepond**：文件预览、处理队列

### 1.9 动画库

**选择：Framer Motion**
- **理由**：声明式 API、性能优秀、Spring 动画

### 1.10 测试框架

**选择：Vitest + Testing Library + Playwright**
- **Vitest**：Vite 原生、速度快
- **Testing Library**：用户行为测试
- **Playwright**：E2E 测试、跨浏览器

## 2. 项目架构设计

### 2.1 目录结构

```
ai-content-platform-frontend/
├── public/                    # 静态资源
│   ├── images/
│   ├── fonts/
│   └── favicon.ico
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/          # 认证相关路由组
│   │   ├── (dashboard)/     # 仪表板路由组
│   │   ├── (workspace)/     # 工作区路由组
│   │   ├── api/             # API 路由
│   │   ├── layout.tsx       # 根布局
│   │   └── page.tsx         # 首页
│   ├── components/          # 通用组件
│   │   ├── ui/              # 基础 UI 组件 (shadcn/ui)
│   │   ├── layout/          # 布局组件
│   │   ├── forms/           # 表单组件
│   │   ├── charts/          # 图表组件
│   │   └── shared/          # 共享组件
│   ├── features/            # 功能模块
│   │   ├── auth/            # 认证功能
│   │   ├── workspace/       # 工作区功能
│   │   ├── generation/      # 内容生成功能
│   │   ├── projects/        # 项目管理功能
│   │   └── settings/        # 设置功能
│   ├── hooks/               # 自定义 Hooks
│   │   ├── use-media-upload.ts
│   │   ├── use-ai-generation.ts
│   │   ├── use-real-time-preview.ts
│   │   └── use-parameter-adjustment.ts
│   ├── lib/                 # 工具库
│   │   ├── api/             # API 客户端
│   │   ├── utils/           # 工具函数
│   │   ├── constants/       # 常量定义
│   │   └── types/           # TypeScript 类型
│   ├── stores/              # 状态管理
│   │   ├── auth.store.ts
│   │   ├── workspace.store.ts
│   │   ├── ui.store.ts
│   │   └── index.ts
│   ├── styles/              # 样式文件
│   │   ├── globals.css      # 全局样式
│   │   ├── tokens.css       # 设计 token
│   │   └── animations.css   # 动画定义
│   └── types/               # 全局类型定义
│       ├── api.ts
│       ├── components.ts
│       └── index.ts
├── tests/                   # 测试文件
│   ├── unit/               # 单元测试
│   ├── integration/        # 集成测试
│   └── e2e/                # E2E 测试
├── config/                 # 配置文件
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── tsconfig.json
├── scripts/                # 构建脚本
├── .env.example           # 环境变量示例
├── package.json
├── README.md
└── LICENSE
```

### 2.2 组件架构模式

#### 原子设计原则
1. **Atoms**：基础组件 (Button, Input, Card)
2. **Molecules**：组合组件 (SearchBar, MediaUploader)
3. **Organisms**：功能组件 (WorkspacePanel, ParameterControls)
4. **Templates**：页面模板 (DashboardLayout, WorkspaceLayout)
5. **Pages**：具体页面

#### 组件设计规范
```typescript
// 组件接口设计
interface ComponentProps {
  // 必需属性
  requiredProp: string;
  
  // 可选属性
  optionalProp?: number;
  
  // 事件回调
  onChange?: (value: any) => void;
  
  // 样式类
  className?: string;
  
  // 子元素
  children?: React.ReactNode;
}

// 组件实现示例
const Component: React.FC<ComponentProps> = ({
  requiredProp,
  optionalProp,
  onChange,
  className,
  children
}) => {
  // 组件逻辑
  return (
    <div className={className}>
      {children}
    </div>
  );
};
```

### 2.3 状态管理策略

#### 状态分类
1. **服务器状态**：用户数据、项目数据、生成结果
   - 管理工具：TanStack Query
   - 缓存策略：stale-while-revalidate

2. **客户端状态**：UI 状态、表单状态、工作区状态
   - 管理工具：Zustand + Jotai
   - 持久化：localStorage + Zustand middleware

3. **URL 状态**：路由参数、查询参数
   - 管理工具：Next.js Router

#### 状态流设计
```
用户操作 → 触发 Action → 更新 Store → 通知组件 → 渲染更新
        ↓
    可选：发送 API 请求 → 更新服务器状态 → 同步到客户端
```

### 2.4 路由和导航方案

#### 路由结构
```typescript
// 路由配置
const routes = {
  // 公开路由
  public: [
    '/',
    '/login',
    '/register',
    '/pricing',
    '/docs'
  ],
  
  // 需要认证的路由
  protected: [
    '/dashboard',
    '/workspace',
    '/projects',
    '/settings'
  ],
  
  // API 路由
  api: [
    '/api/auth',
    '/api/projects',
    '/api/generation'
  ]
};
```

#### 路由守卫
```typescript
// 认证守卫组件
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    redirect('/login');
    return null;
  }
  
  return <>{children}</>;
};
```

### 2.5 API 客户端层

#### API 客户端设计
```typescript
// lib/api/client.ts
import axios from 'axios';
import { setupInterceptors } from './interceptors';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 设置拦截器
setupInterceptors(apiClient);

// API 服务封装
export const apiService = {
  // 认证相关
  auth: {
    login: (credentials: LoginCredentials) => 
      apiClient.post('/auth/login', credentials),
    register: (userData: RegisterData) => 
      apiClient.post('/auth/register', userData),
    logout: () => apiClient.post('/auth/logout'),
  },
  
  // 项目相关
  projects: {
    list: (params?: PaginationParams) => 
      apiClient.get('/projects', { params }),
    create: (projectData: ProjectCreateData) => 
      apiClient.post('/projects', projectData),
    update: (id: string, updates: ProjectUpdateData) => 
      apiClient.patch(`/projects/${id}`, updates),
  },
  
  // 生成相关
  generation: {
    createTask: (taskData: GenerationTaskData) => 
      apiClient.post('/generation/tasks', taskData),
    getStatus: (taskId: string) => 
      apiClient.get(`/generation/tasks/${taskId}/status`),
    streamResult: (taskId: string) => 
      apiClient.get(`/generation/tasks/${taskId}/stream`, {
        responseType: 'stream',
      }),
  },
};

// React Query 集成
export const queryKeys = {
  projects: ['projects'] as const,
  project: (id: string) => [...queryKeys.projects, id] as const,
  generationTasks: ['generation-tasks'] as const,
  generationTask: (id: string) => [...queryKeys.generationTasks, id] as const,
};

export default apiClient;
```

#### 拦截器配置
```typescript
// lib/api/interceptors.ts
import { AxiosInstance } from 'axios';
import { authStore } from '@/stores/auth.store';

export const setupInterceptors = (instance: AxiosInstance) => {
  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      const token = authStore.getState().token;
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // 添加请求 ID 用于追踪
      config.headers['X-Request-ID'] = crypto.randomUUID();
      
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // 响应拦截器
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // 处理 401 错误，尝试刷新 token
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          const newToken = await refreshToken();
          authStore.getState().setToken(newToken);
          
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          // 刷新失败，跳转到登录页
          authStore.getState().logout();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      
      // 统一错误处理
      return Promise.reject(error);
    }
  );
};
```

## 3. 核心组件设计

### 3.1 AI 工作区组件

#### WorkspaceLayout
```typescript
// features/workspace/components/WorkspaceLayout.tsx
interface WorkspaceLayoutProps {
  projectId?: string;
  children: React.ReactNode;
}

const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  projectId,
  children
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* 左侧工具栏 */}
      <WorkspaceSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      {/* 主工作区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航 */}
        <WorkspaceHeader projectId={projectId} />
        
        {/* 内容区域 */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
        {/* 底部状态栏 */}
        <WorkspaceStatusBar />
      </div>
      
      {/* 右侧面板 */}
      <WorkspaceRightPanel />
    </div>
  );
};
```

#### WorkspaceCanvas
```typescript
// features/workspace/components/WorkspaceCanvas.tsx
interface WorkspaceCanvasProps {
  mediaItems: MediaItem[];
  onMediaSelect: (item: MediaItem) => void;
  onMediaUpload: (files: File[]) => void;
}

const WorkspaceCanvas: React.FC<WorkspaceCanvasProps> = ({
  mediaItems,
  onMediaSelect,
  onMediaUpload
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onMediaUpload,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi'],
      'audio/*': ['.mp3', '.wav', '.m4a']
    },
    multiple: true
  });
  
  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative border-2 border-dashed rounded-lg p-8',
        'min-h-[400px] flex flex-col items-center justify-center',
        'transition-colors duration-200',
        isDragActive
          ? 'border-primary bg-primary/5'
          : 'border-gray-300 hover:border-gray-400'
      )}
    >
      <input {...getInputProps()} />
      
      {isDragActive ? (
        <div className="text-center">
          <Upload className="h-12 w-12 mx-auto text-primary mb-4" />
          <p className="text-lg font-medium">释放文件以上传</p>
        </div>
      ) : (
        <>
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-lg font-medium mb-2">
            拖放文件或点击上传
          </p>
          <p className="text-sm text-gray-500 mb-6">
            支持图片、视频、音频文件
          </p>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            选择文件
          </Button>
        </>
      )}
      
      {/* 媒体网格 */}
      {mediaItems.length > 0 && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaItems.map((item) => (
            <MediaThumbnail
              key={item.id}
              item={item}
              onClick={() => onMediaSelect(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
```

### 3.2 媒体上传组件

#### MediaUploader
```typescript
// components/forms/MediaUploader.tsx
interface MediaUploaderProps {
  maxFiles?: number;
  maxSize?: number; // MB
  accept?: Record<string, string[]>;
  onUploadComplete: (files: UploadedFile[]) => void;
  onUploadError?: (error: UploadError) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  maxFiles = 10,
  maxSize = 100,
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    'video/*': ['.mp4', '.mov', '.avi', '.mkv'],
    'audio/*': ['.mp3', '.wav', '.m4a', '.flac'],
    'application/pdf': ['.pdf'],
    'text/*': ['.txt', '.md', '.json']
  },
  onUploadComplete,
  onUploadError
}) => {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileDrop,
    accept,
    maxFiles,
    maxSize: maxSize * 1024 * 1024,
    disabled: isUploading
  });
  
  const handleFileDrop = async (acceptedFiles: File[]) => {
    setIsUploading(true);
    const uploadPromises = acceptedFiles.map((file, index) => 
      uploadFile(file, index)
    );
    
    try {
      const results = await Promise.allSettled(uploadPromises);
      const successfulUploads = results
        .filter((r): r is PromiseFulfilledResult<UploadedFile> => r.status === 'fulfilled')
        .map(r => r.value);
      
      onUploadComplete(successfulUploads);
    } catch (error) {
      onUploadError?.({
        message: '上传过程中发生错误',
        code: 'UPLOAD_FAILED'
      });
    } finally {
      setIsUploading(false);
      setUploads([]);
    }
  };
  
  const uploadFile = async (file: File, index: number): Promise<UploadedFile> => {
    const uploadId = crypto.randomUUID();
    const progressItem: UploadProgress = {
      id: uploadId,
      fileName: file.name,
      progress: 0,
      status: 'uploading'
    };
    
    setUploads(prev => [...prev, progressItem]);
    
    // 创建 FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('fileType', file.type);
    formData.append('fileSize', file.size.toString());
    
    try {
      const response = await apiClient.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          
          setUploads(prev => prev.map(item =>
            item.id === uploadId
              ? { ...item, progress }
              : item
          ));
        }
      });
      
      // 更新上传状态
      setUploads(prev => prev.map(item =>
        item.id === uploadId
          ? { ...item, status: 'completed', progress: 100 }
          : item
      ));
      
      return {
        id: response.data.id,
        url: response.data.url,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        thumbnailUrl: response.data.thumbnailUrl,
        metadata: response.data.metadata
      };
    } catch (error) {
      setUploads(prev => prev.map(item =>
        item.id === uploadId
          ? { ...item, status: 'error', error: '上传失败' }
          : item
      ));
      throw error;
    }
  };
  
  return (
    <div className="space-y-4">
      {/* 拖放区域 */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center',
          'transition-colors duration-200 cursor-pointer',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-gray-400',
          isUploading && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-2">
          <Upload className="h-12 w-12 mx-auto text-gray-400" />
          <div>
            <p className="text-sm font-medium">
              {isDragActive ? '释放文件以上传' : '拖放文件或点击上传'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              支持 {Object.keys(accept).map(type => type.split('/')[0]).join(', ')} 格式
            </p>
            <p className="text-xs text-gray-500">
              最多 {maxFiles} 个文件，单个文件不超过 {maxSize}MB
            </p>
          </div>
        </div>
      </div>
      
      {/* 上传进度 */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">上传进度</h4>
          {uploads.map((upload) => (
            <UploadProgressItem key={upload.id} upload={upload} />
          ))}
        </div>
      )}
    </div>
  );
};

// 上传进度组件
const UploadProgressItem: React.FC<{ upload: UploadProgress }> = ({ upload }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className={cn(
          'h-8 w-8 rounded-full flex items-center justify-center',
          upload.status === 'completed' && 'bg-green-100 text-green-600',
          upload.status === 'uploading' && 'bg-blue-100 text-blue-600',
          upload.status === 'error' && 'bg-red-100 text-red-600'
        )}>
          {upload.status === 'completed' && <Check className="h-4 w-4" />}
          {upload.status === 'uploading' && <Loader2 className="h-4 w-4 animate-spin" />}
          {upload.status === 'error' && <X className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{upload.fileName}</p>
          <p className="text-xs text-gray-500">
            {upload.status === 'uploading' && `${upload.progress}%`}
            {upload.status === 'completed' && '上传完成'}
            {upload.status === 'error' && upload.error}
          </p>
        </div>
      </div>
      
      {upload.status === 'uploading' && (
        <div className="w-24">
          <Progress value={upload.progress} className="h-2" />
        </div>
      )}
    </div>
  );
};
```

### 3.3 参数调节组件

#### ParameterControls
```typescript
// features/generation/components/ParameterControls.tsx
interface ParameterControlsProps {
  modelType: ModelType;
  parameters: GenerationParameters;
  onParametersChange: (parameters: GenerationParameters) => void;
}

const ParameterControls: React.FC<ParameterControlsProps> = ({
  modelType,
  parameters,
  onParametersChange
}) => {
  const modelConfig = MODEL_CONFIGS[modelType];
  
  const handleParameterChange = (key: keyof GenerationParameters, value: any) => {
    onParametersChange({
      ...parameters,
      [key]: value
    });
  };
  
  return (
    <div className="space-y-6">
      {/* 模型选择 */}
      <div className="space-y-2">
        <Label htmlFor="model">模型选择</Label>
        <Select
          value={parameters.model}
          onValueChange={(value) => handleParameterChange('model', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择模型" />
          </SelectTrigger>
          <SelectContent>
            {modelConfig.availableModels.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* 温度调节 */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="temperature">温度 (Temperature)</Label>
          <span className="text-sm text-gray-500">{parameters.temperature}</span>
        </div>
        <Slider
          id="temperature"
          min={0}
          max={2}
          step={0.1}
          value={[parameters.temperature]}
          onValueChange={([value]) => handleParameterChange('temperature', value)}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>确定性高</span>
          <span>创造性高</span>
        </div>
      </div>
      
      {/* 最大长度 */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="maxLength">最大长度</Label>
          <span className="text-sm text-gray-500">{parameters.maxLength}</span>
        </div>
        <Slider
          id="maxLength"
          min={100}
          max={4000}
          step={100}
          value={[parameters.maxLength]}
          onValueChange={([value]) => handleParameterChange('maxLength', value)}
        />
      </div>
      
      {/* 高级参数 */}
      <Collapsible>
        <CollapsibleTrigger className="flex items-center text-sm font-medium">
          <ChevronRight className="h-4 w-4 mr-1 transition-transform data-[state=open]:rotate-90" />
          高级参数
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          {/* Top P */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="topP">Top P</Label>
              <span className="text-sm text-gray-500">{parameters.topP}</span>
            </div>
            <Slider
              id="topP"
              min={0}
              max={1}
              step={0.05}
              value={[parameters.topP]}
              onValueChange={([value]) => handleParameterChange('topP', value)}
            />
          </div>
          
          {/* Frequency Penalty */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="frequencyPenalty">频率惩罚</Label>
              <span className="text-sm text-gray-500">{parameters.frequencyPenalty}</span>
            </div>
            <Slider
              id="frequencyPenalty"
              min={-2}
              max={2}
              step={0.1}
              value={[parameters.frequencyPenalty]}
              onValueChange={([value]) => handleParameterChange('frequencyPenalty', value)}
            />
          </div>
          
          {/* Presence Penalty */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="presencePenalty">存在惩罚</Label>
              <span className="text-sm text-gray-500">{parameters.presencePenalty}</span>
            </div>
            <Slider
              id="presencePenalty"
              min={-2}
              max={2}
              step={0.1}
              value={[parameters.presencePenalty]}
              onValueChange={([value]) => handleParameterChange('presencePenalty', value)}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {/* 预设参数 */}
      <div className="space-y-2">
        <Label>预设参数</Label>
        <div className="flex flex-wrap gap-2">
          {PRESET_PARAMETERS.map((preset) => (
            <Button
              key={preset.id}
              variant="outline"
              size="sm"
              onClick={() => onParametersChange(preset.parameters)}
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
```

### 3.4 实时预览组件

#### RealTimePreview
```typescript
// features/generation/components/RealTimePreview.tsx
interface RealTimePreviewProps {
  taskId: string;
  mediaType: MediaType;
  onPreviewReady?: (previewUrl: string) => void;
}

const RealTimePreview: React.FC<RealTimePreviewProps> = ({
  taskId,
  mediaType,
  onPreviewReady
}) => {
  const [previewData, setPreviewData] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!taskId) return;
    
    const startStreaming = async () => {
      setIsStreaming(true);
      
      try {
        const response = await fetch(`/api/generation/tasks/${taskId}/stream`);
        const reader = response.body?.getReader();
        
        if (!reader) {
          throw new Error('无法获取流数据');
        }
        
        const decoder = new TextDecoder();
        let accumulatedData = '';
        
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            setIsStreaming(false);
            break;
          }
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              
              try {
                const parsed = JSON.parse(data);
                
                if (parsed.type === 'progress') {
                  setProgress(parsed.value);
                } else if (parsed.type === 'chunk') {
                  accumulatedData += parsed.data;
                  setPreviewData(accumulatedData);
                } else if (parsed.type === 'complete') {
                  onPreviewReady?.(parsed.url);
                  setIsStreaming(false);
                }
              } catch (e) {
                console.error('解析流数据失败:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('流式请求失败:', error);
        setIsStreaming(false);
      }
    };
    
    startStreaming();
    
    return () => {
      setIsStreaming(false);
    };
  }, [taskId, onPreviewReady]);
  
  const renderPreview = () => {
    switch (mediaType) {
      case 'text':
        return (
          <div className="prose prose-sm max-w-none p-4">
            <pre className="whitespace-pre-wrap">{previewData}</pre>
          </div>
        );
        
      case 'image':
        return previewData ? (
          <div className="relative aspect-square">
            <img
              src={`data:image/png;base64,${previewData}`}
              alt="实时预览"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-400">
            等待生成...
          </div>
        );
        
      case 'audio':
        return previewData ? (
          <div className="p-4">
            <audio
              src={`data:audio/mp3;base64,${previewData}`}
              controls
              className="w-full"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-400">
            等待音频生成...
          </div>
        );
        
      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-400">
            不支持该媒体类型的实时预览
          </div>
        );
    }
  };
  
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* 预览头部 */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-2">
          <Eye className="h-4 w-4 text-gray-500" />
          <span className="font-medium">实时预览</span>
        </div>
        
        {isStreaming && (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-sm text-gray-600">生成中...</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
        )}
      </div>
      
      {/* 预览内容 */}
      <div className="p-4">
        {renderPreview()}
      </div>
      
      {/* 进度条 */}
      {isStreaming && (
        <div className="px-4 pb-4">
          <Progress value={progress} className="h-2" />
        </div>
      )}
    </div>
  );
};
```

### 3.5 进度指示组件

#### ProgressIndicator
```typescript
// components/shared/ProgressIndicator.tsx
interface ProgressIndicatorProps {
  steps: ProgressStep[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick
}) => {
  return (
    <div className="w-full">
      {/* 桌面版进度条 */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;
          
          return (
            <React.Fragment key={step.id}>
              {/* 步骤节点 */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => onStepClick?.(index)}
                  disabled={!step.clickable || isUpcoming}
                  className={cn(
                    'relative flex items-center justify-center',
                    'h-10 w-10 rounded-full border-2 transition-all',
                    isCompleted && 'bg-primary border-primary text-white',
                    isCurrent && 'border-primary bg-white text-primary',
                    isUpcoming && 'border-gray-300 bg-white text-gray-400',
                    step.clickable && !isUpcoming && 'hover:scale-105 cursor-pointer',
                    !step.clickable && 'cursor-default'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="font-medium">{index + 1}</span>
                  )}
                </button>
                
                {/* 步骤标签 */}
                <div className="mt-2 text-center">
                  <p className={cn(
                    'text-sm font-medium',
                    isCompleted && 'text-primary',
                    isCurrent && 'text-primary',
                    isUpcoming && 'text-gray-500'
                  )}>
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
              
              {/* 连接线 */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4">
                  <div className={cn(
                    'h-full transition-all duration-300',
                    isCompleted ? 'bg-primary' : 'bg-gray-300'
                  )} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* 移动版进度条 */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-500">当前步骤</p>
            <p className="text-lg font-semibold">
              {steps[currentStep]?.title || '未知步骤'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">
              步骤 {currentStep + 1} / {steps.length}
            </p>
            <p className="text-xs text-gray-500">
              {steps[currentStep]?.description || ''}
            </p>
          </div>
        </div>
        
        {/* 进度条 */}
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`
            }}
          />
        </div>
        
        {/* 步骤指示器 */}
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                'h-2 w-2 rounded-full',
                index <= currentStep ? 'bg-primary' : 'bg-gray-300'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// 使用示例
const GenerationProgress: React.FC<{ taskId: string }> = ({ taskId }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps: ProgressStep[] = [
    {
      id: 'upload',
      title: '上传素材',
      description: '准备生成素材',
      status: 'completed',
      clickable: true
    },
    {
      id: 'processing',
      title: 'AI 处理中',
      description: '正在生成内容',
      status: 'in-progress',
      clickable: false
    },
    {
      id: 'review',
      title: '结果预览',
      description: '查看生成结果',
      status: 'pending',
      clickable: false
    },
    {
      id: 'export',
      title: '导出结果',
      description: '保存或分享',
      status: 'pending',
      clickable: false
    }
  ];
  
  // 模拟进度更新
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="p-6 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-4">生成进度</h3>
      <ProgressIndicator
        steps={steps}
        currentStep={currentStep}
        onStepClick={(index) => {
          if (steps[index].clickable) {
            setCurrentStep(index);
          }
        }}
      />
      
      {/* 详细进度信息 */}
      <div className="mt-6 space-y-3">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              'flex items-center justify-between p-3 rounded-lg',
              index === currentStep && 'bg-primary/5 border border-primary/20'
            )}
          >
            <div className="flex items-center space-x-3">
              <div className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center',
                step.status === 'completed' && 'bg-green-100 text-green-600',
                step.status === 'in-progress' && 'bg-blue-100 text-blue-600',
                step.status === 'pending' && 'bg-gray-100 text-gray-600'
              )}>
                {step.status === 'completed' && <Check className="h-4 w-4" />}
                {step.status === 'in-progress' && <Loader2 className="h-4 w-4 animate-spin" />}
                {step.status === 'pending' && <Clock className="h-4 w-4" />}
              </div>
              <div>
                <p className="font-medium">{step.title}</p>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            </div>
            
            {index === currentStep && (
              <div className="text-sm text-primary font-medium">
                进行中...
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 4. 开发环境配置

### 4.1 构建工具配置

#### package.json
```json
{
  "name": "ai-content-platform-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "prepare": "husky",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.2",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-collapsible": "^1.0.3",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-radio-group": "^1.1.3",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-tooltip": "^1.0.7",
    "@tanstack/react-query": "^5.17.0",
    "@tanstack/react-query-devtools": "^5.17.0",
    "axios": "^1.6.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "date-fns": "^3.0.6",
    "framer-motion": "^10.16.4",
    "jotai": "^2.4.0",
    "lucide-react": "^0.309.0",
    "next": "15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-dropzone": "^14.2.13",
    "react-hook-form": "^7.48.2",
    "recharts": "^2.10.3",
    "socket.io-client": "^4.7.2",
    "tailwind-merge": "^2.2.0",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.22.4",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@next/eslint-plugin-next": "^15.0.0",
    "@playwright/test": "^1.40.0",
    "@storybook/addon-essentials": "^7.6.0",
    "@storybook/addon-interactions": "^7.6.0",
    "@storybook/addon-links": "^7.6.0",
    "@storybook/addon-onboarding": "^1.0.8",
    "@storybook/blocks": "^7.6.0",
    "@storybook/nextjs": "^7.6.0",
    "@storybook/react": "^7.6.0",
    "@storybook/test": "^7.6.0",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/react": "^14.1.2",
    "@testing-library/user-event": "^14.5.1",
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-config-next": "15.0.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-storybook": "^0.6.15",
    "eslint-plugin-tailwindcss": "^3.13.0",
    "jsdom": "^23.0.1",
    "postcss": "^8.4.32",
    "prettier": "^3.1.1",
    "prettier-plugin-tailwindcss": "^0.5.9",
    "storybook": "^7.6.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.8",
    "vitest": "^1.1.0"
  },
  "engines": {
    "node": ">=18.17.0",
    "npm": ">=9.0.0"
  }
}
```

#### tailwind.config.ts
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // AI 平台专用颜色
        ai: {
          blue: '#3B82F6',
          purple: '#8B5CF6',
          pink: '#EC4899',
          green: '#10B981',
          orange: '#F59E0B',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'progress': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'progress': 'progress 2s linear infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-ai': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};

export default config;
```

#### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    optimizeCss: true,
    scrollRestoration: true,
  },
  webpack: (config, { isServer }) => {
    // 优化 moment.js
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      })
    );
    
    // 添加 SVG 支持
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### 4.2 代码质量工具配置

#### .eslintrc.json
```json
{
  "extends": [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:tailwindcss/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint", "react", "react-hooks", "tailwindcss"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "tailwindcss/classnames-order": "error",
    "tailwindcss/no-custom-classname": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  },
  "settings": {
    "react": {
      "version": "detect"
    },
    "tailwindcss": {
      "callees": ["cn", "cva"],
      "config": "tailwind.config.ts"
    }
  },
  "ignorePatterns": [
    "node_modules/",
    ".next/",
    "out/",
    "public/",
    "*.config.js",
    "*.config.ts"
  ]
}
```

#### .prettierrc.json
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 100,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

#### .prettierignore
```
node_modules
.next
out
public
*.log
*.svg
*.ico
*.png
*.jpg
*.jpeg
*.gif
*.webp
*.mp4
*.mov
*.avi
*.mp3
*.wav
```

### 4.3 测试环境配置

#### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/setup.ts',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

#### tests/setup.ts
```typescript
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// 清理测试环境
afterEach(() => {
  cleanup();
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};
```

#### playwright.config.ts
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

### 4.4 开发服务器配置

#### .env.example
```env
# API 配置
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# 认证配置
NEXT_PUBLIC_AUTH0_DOMAIN=your-domain.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id

# 功能开关
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=true

# 第三方服务
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxx
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXX

# 开发配置
NEXT_PUBLIC_APP_ENV=development
```

#### .gitignore
```gitignore
# 依赖
node_modules/
.pnp
.pnp.js
.yarn/install-state.gz

# 构建输出
.next/
out/
dist/
build/

# 环境变量
.env*.local
.env

# 日志
*.log
logs/

# 运行时数据
.DS_Store
*.pid
*.seed
*.pid.lock

# 编辑器
.vscode/
.idea/
*.swp
*.swo

# 测试
coverage/
.nyc_output/

# 缓存
.cache/

# 临时文件
tmp/
temp/

# 操作系统
Thumbs.db
```

## 5. 性能优化策略

### 5.1 代码分割和懒加载策略

#### 路由级代码分割
```typescript
// 使用 Next.js 动态导入
import dynamic from 'next/dynamic';

// 懒加载重组件
const HeavyComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false, // 仅在客户端加载
  }
);

// 懒加载功能模块
const Workspace = dynamic(
  () => import('@/features/workspace/Workspace'),
  {
    loading: () => <WorkspaceSkeleton />,
  }
);

// 按条件懒加载
const LazyFeature = dynamic(
  () => import('@/features/advanced/Feature'),
  {
    loading: () => <FeatureSkeleton />,
    suspense: true, // 使用 React Suspense
  }
);
```

#### 组件级代码分割
```typescript
// 使用 React.lazy
const MediaEditor = React.lazy(() => import('@/components/MediaEditor'));
const ChartVisualization = React.lazy(() => import('@/components/ChartVisualization'));

// 使用 Suspense 包裹
const App = () => (
  <React.Suspense fallback={<FullPageLoader />}>
    <Router>
      <Routes>
        <Route path="/workspace" element={
          <React.Suspense fallback={<WorkspaceLoader />}>
            <Workspace />
          </React.Suspense>
        } />
      </Routes>
    </Router>
  </React.Suspense>
);
```

### 5.2 图片和媒体优化

#### Next.js 图片优化
```typescript
// 使用 Next.js Image 组件
import Image from 'next/image';

const OptimizedImage = ({ src, alt, width, height }) => (
  <Image
    src={src}
    alt={alt}
    width={width}
    height={height}
    placeholder="blur" // 模糊占位符
    blurDataURL="data:image/jpeg;base64,..." // 小图 base64
    quality={85} // 图片质量
    priority={false} // 仅关键图片设为 true
    loading="lazy" // 懒加载
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
);

// 响应式图片
const ResponsiveImage = () => (
  <Image
    src="/hero.jpg"
    alt="Hero image"
    fill // 填充容器
    className="object-cover"
    sizes="100vw"
    priority // 首屏图片优先加载
  />
);
```

#### 视频优化策略
```typescript
// 视频懒加载
const LazyVideo = ({ src, poster }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div className="relative aspect-video">
      {!isLoaded && (
        <Image
          src={poster}
          alt="视频预览"
          fill
          className="object-cover"
        />
      )}
      <video
        src={src}
        controls
        preload="metadata" // 仅加载元数据
        onLoadedData={() => setIsLoaded(true)}
        className={cn(
          'w-full h-full object-cover',
          !isLoaded && 'hidden'
        )}
      >
        <source src={src} type="video/mp4" />
        <track kind="captions" srcLang="zh" label="中文" />
      </video>
    </div>
  );
};

// 自适应视频源
const AdaptiveVideo = () => (
  <video controls preload="metadata">
    <source src="/video-1080p.mp4" type="video/mp4" media="(min-width: 1024px)" />
    <source src="/video-720p.mp4" type="video/mp4" media="(min-width: 768px)" />
    <source src="/video-480p.mp4" type="video/mp4" />
    <p>您的浏览器不支持视频播放</p>
  </video>
);
```

### 5.3 缓存策略设计

#### 客户端缓存
```typescript
// React Query 缓存配置
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分钟
      gcTime: 10 * 60 * 1000, // 10分钟
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// 自定义缓存策略
const cacheConfig = {
  // 用户数据：缓存 10 分钟
  user: {
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  },
  // 项目列表：缓存 2 分钟
  projects: {
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  },
  // 实时数据：不缓存
  realtime: {
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 5000, // 5秒轮询
  },
};

// 使用示例
const { data: projects } = useQuery({
  queryKey: ['projects'],
  queryFn: fetchProjects,
  ...cacheConfig.projects,
});
```

#### 浏览器缓存
```typescript
// Service Worker 缓存策略
const CACHE_NAME = 'ai-platform-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  // 其他静态资源
];

// 注册 Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('ServiceWorker 注册成功:', registration.scope);
      },
      (error) => {
        console.log('ServiceWorker 注册失败:', error);
      }
    );
  });
}

// 缓存策略实现
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 返回缓存或网络请求
      return response || fetch(event.request);
    })
  );
});
```

### 5.4 加载性能优化

#### 关键 CSS 内联
```typescript
// 使用 Next.js 内联关键 CSS
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={inter.className}>
      <head>
        {/* 内联关键 CSS */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --primary: 222.2 47.4% 11.2%;
                /* 其他设计 token */
              }
              
              /* 首屏关键样式 */
              .critical-styles {
                display: block;
                visibility: visible;
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

#### 资源预加载
```typescript
