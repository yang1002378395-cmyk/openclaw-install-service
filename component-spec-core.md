# AI内容生产平台 - 核心组件规范

## 概述
**文档状态**: 核心最小可行版本  
**创建时间**: 2026-02-14T22:35:00+08:00  
**创建者**: UX/UI Designer Agent + Frontend Developer Agent  
**紧急状态**: 第二阶段紧急重启后核心交付物

## 设计原则

### 核心原则 (紧急简化版)
1. **AI原生**: 为AI内容创作专门优化
2. **一致性**: 在整个平台保持统一体验
3. **响应式**: 支持桌面和移动设备
4. **可访问性**: 基础无障碍支持
5. **性能优先**: 轻量级实现

## 基础组件规范

### 1. 按钮组件 (Button)

#### 1.1 主要按钮 (Primary Button)
```typescript
// 使用示例
<Button variant="primary" size="medium">
  生成内容
</Button>

// 规范
- 背景色: 品牌蓝 (#3B82F6)
- 文字色: 白色 (#FFFFFF)
- 圆角: 8px
- 内边距: 12px 24px
- 悬停效果: 背景色加深 (#1D4ED8)
- 禁用状态: 透明度50%，不可点击
```

#### 1.2 次要按钮 (Secondary Button)
```typescript
<Button variant="secondary" size="medium">
  取消
</Button>

// 规范
- 背景色: 透明
- 边框: 1px solid #D1D5DB
- 文字色: #374151
- 悬停效果: 背景色 #F9FAFB
```

#### 1.3 AI功能按钮 (AI Action Button)
```typescript
<Button variant="ai" aiType="image">
  🖼️ 生成图像
</Button>

// 规范
- 背景色: 根据AI类型变化
  - 图像: #8B5CF6 (紫色)
  - 视频: #EC4899 (粉色)
  - 音频: #10B981 (绿色)
  - 文档: #3B82F6 (蓝色)
- 图标: 对应AI功能图标
- 特效: 轻微发光效果
```

### 2. 输入组件 (Input)

#### 2.1 文本输入 (Text Input)
```typescript
<Input 
  placeholder="请输入提示词..."
  value={prompt}
  onChange={handleChange}
/>

// 规范
- 高度: 44px
- 边框: 1px solid #D1D5DB
- 圆角: 8px
- 内边距: 0 12px
- 焦点状态: 边框颜色 #3B82F6，阴影效果
- 错误状态: 边框颜色 #EF4444
```

#### 2.2 AI提示词输入 (AI Prompt Input)
```typescript
<AIPromptInput
  placeholder="描述你想要生成的内容..."
  suggestions={aiSuggestions}
  onGenerate={handleGenerate}
/>

// 规范
- 高度: 120px (多行)
- 智能提示: 实时AI建议
- 生成按钮: 集成在输入框内
- 字数统计: 实时显示
```

### 3. 卡片组件 (Card)

#### 3.1 基础卡片 (Base Card)
```typescript
<Card>
  <CardHeader>
    <CardTitle>项目标题</CardTitle>
    <CardDescription>项目描述</CardDescription>
  </CardHeader>
  <CardContent>
    卡片内容
  </CardContent>
  <CardFooter>
    卡片底部操作
  </CardFooter>
</Card>

// 规范
- 背景色: 白色 (#FFFFFF)
- 边框: 1px solid #E5E7EB
- 圆角: 12px
- 阴影: 轻微阴影 (0 1px 3px rgba(0,0,0,0.1))
- 内边距: 24px
```

#### 3.2 AI内容卡片 (AI Content Card)
```typescript
<AIContentCard
  type="image"
  title="生成的图像"
  previewUrl={imageUrl}
  status="completed"
  actions={['下载', '重新生成', '编辑']}
/>

// 规范
- 类型标识: 左上角类型图标和颜色
- 预览区域: 固定比例 (16:9)
- 状态指示: 生成中/完成/失败
- 操作按钮: 上下文相关操作
```

### 4. 进度指示器 (Progress Indicator)

#### 4.1 AI生成进度 (AI Generation Progress)
```typescript
<AIGenerationProgress
  progress={75}
  currentStep="图像渲染"
  estimatedTime="30秒"
  type="image"
/>

// 规范
- 进度条: 线性进度条，根据AI类型着色
- 步骤显示: 当前处理步骤
- 时间估计: 预计剩余时间
- 取消按钮: 可中断生成过程
```

## AI专用组件

### 1. 多模态创作区域 (Multimodal Creation Area)
```typescript
<MultimodalCreationArea
  modes={['text', 'image', 'video', 'audio']}
  activeMode="image"
  onModeChange={handleModeChange}
>
  {/* 模式特定内容 */}
</MultimodalCreationArea>

// 规范
- 模式切换: 标签式切换，颜色标识
- 内容区域: 自适应布局
- 工具栏: 模式特定工具
- 实时预览: 生成结果预览
```

### 2. 参数调节面板 (Parameter Control Panel)
```typescript
<ParameterControlPanel
  parameters={[
    { name: '风格', type: 'select', options: ['写实', '卡通', '艺术'] },
    { name: '质量', type: 'slider', min: 1, max: 10, value: 8 },
    { name: '数量', type: 'number', min: 1, max: 4, value: 1 }
  ]}
  onParameterChange={handleParameterChange}
/>

// 规范
- 分组显示: 相关参数分组
- 实时反馈: 参数调整实时生效
- 预设选项: 常用参数组合
- 重置功能: 恢复默认参数
```

### 3. 实时预览组件 (Live Preview)
```typescript
<LivePreview
  content={generatedContent}
  type="image"
  size="medium"
  interactive={true}
  onInteraction={handleInteraction}
/>

// 规范
- 自适应尺寸: 根据容器调整
- 交互支持: 缩放、旋转、查看详情
- 加载状态: 生成中的占位符
- 错误处理: 生成失败的显示
```

## 布局组件

### 1. 响应式网格 (Responsive Grid)
```typescript
<ResponsiveGrid
  columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
  gap={4}
  items={contentItems}
  renderItem={renderContentItem}
/>

// 规范
- 断点定义:
  - sm: 640px (1列)
  - md: 768px (2列)
  - lg: 1024px (3列)
  - xl: 1280px (4列)
- 间距系统: 基于8px倍数
- 项目高度: 自适应或固定比例
```

### 2. 侧边栏布局 (Sidebar Layout)
```typescript
<SidebarLayout
  sidebarWidth={240}
  sidebarContent={<Navigation />}
  mainContent={<MainWorkspace />}
  collapsible={true}
/>

// 规范
- 侧边栏宽度: 240px (可折叠)
- 响应式: 移动端隐藏侧边栏
- 过渡动画: 平滑展开/收起
- 状态持久化: 记住用户偏好
```

## 状态组件

### 1. 空状态 (Empty State)
```typescript
<EmptyState
  icon="🖼️"
  title="还没有生成内容"
  description="开始你的第一次AI创作吧！"
  action={
    <Button variant="primary">
      开始创作
    </Button>
  }
/>
```

### 2. 加载状态 (Loading State)
```typescript
<LoadingState
  message="AI正在思考..."
  type="ai"
  progress={true}
/>
```

### 3. 错误状态 (Error State)
```typescript
<ErrorState
  title="生成失败"
  description="AI遇到了一些问题，请重试"
  errorCode="AI_500"
  retryAction={handleRetry}
/>
```

## 实现要求

### 技术栈
- **框架**: React 18 + TypeScript
- **样式**: Tailwind CSS + CSS Modules
- **状态管理**: Zustand (轻量级)
- **图标**: Lucide React
- **动画**: Framer Motion (基础动画)

### 代码规范
```typescript
// 组件接口定义
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ai';
  size: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  aiType?: 'image' | 'video' | 'audio' | 'document';
}

// 组件实现示例
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  onClick,
  disabled = false,
  loading = false,
  aiType
}) => {
  // 实现逻辑
};
```

### 文件结构
```
src/components/
├── ui/                    # 基础UI组件
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.module.css
│   │   └── index.ts
│   ├── Input/
│   └── Card/
├── ai/                    # AI专用组件
│   ├── AIPromptInput/
│   ├── AIContentCard/
│   └── AIGenerationProgress/
└── layout/               # 布局组件
    ├── ResponsiveGrid/
    └── SidebarLayout/
```

## 下一步计划

### 立即实现 (第二阶段核心)
1. ✅ 按钮组件 (基础+AI变体)
2. ✅ 输入组件 (基础+AI提示词)
3. ✅ 卡片组件 (基础+AI内容)
4. ✅ AI进度指示器

### 后续扩展 (第二阶段补充)
1. ⏳ 多模态创作区域
2. ⏳ 参数调节面板
3. ⏳ 实时预览组件
4. ⏳ 完整布局系统

### 质量保证
1. **单元测试**: 核心组件100%覆盖率
2. **Storybook**: 组件文档和示例
3. **设计验证**: 与设计系统对齐
4. **性能测试**: 确保渲染性能

## 紧急状态说明
此规范为紧急重启后的核心最小可行版本，包含最基本但完整的组件定义，满足第二阶段核心要求。完整规范将在后续补充。

---
**文档状态**: 核心完成  
**评审状态**: 待评审  
**下一步**: 开始组件实现