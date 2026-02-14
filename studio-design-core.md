# 创作工作室核心设计规范

## 概述
**设计状态**: 核心最小可行版本  
**创建时间**: 2026-02-14T23:20:00+08:00  
**设计者**: UX/UI Designer Agent  
**紧急状态**: 第二阶段紧急重启核心交付物

## 设计目标

### 核心目标
1. **高效创作**: 提供流畅的AI内容创作体验
2. **多模态支持**: 统一界面支持图像、视频、音频、文档生成
3. **实时反馈**: 即时预览生成结果
4. **参数控制**: 精细调节AI生成参数

### 设计原则
- **专注创作**: 减少干扰，聚焦创作流程
- **直观操作**: 降低学习成本
- **灵活切换**: 不同创作模式间无缝切换
- **状态透明**: 清晰显示生成进度和状态

## 页面结构

### 桌面端布局 (1440px)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 工作室导航栏 (高度: 64px)                                                   │
│ ┌─────┐ 我的项目 > AI图像生成工作室                   保存 🔄 分享 👤      │
│ │←返回│                                                                     │
│ └─────┘                                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 创作模式切换 (高度: 60px)                                                   │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                       │
│ │ 🖼️ 图像  │ │ 🎬 视频  │ │ 🎵 音频  │ │ 📄 文档  │                       │
│ │ 生成     │ │ 生成     │ │ 生成     │ │ 解析     │                       │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ 主工作区                                                                   │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │
│ │ 左侧面板        │ │ 中央创作区      │ │ 右侧控制面板    │               │
│ │ (宽度: 280px)   │ │ (宽度: 720px)   │ │ (宽度: 360px)   │               │
│ │                 │ │                 │ │                 │               │
│ │ 项目文件        │ │ 实时预览        │ │ 生成参数        │               │
│ │ 历史版本        │ │ 尺寸: 640×360px │ │ 风格: [写实]    │               │
│ │ 资源库          │ │ 背景: #F9FAFB   │ │ 质量: ▮▮▮▮▮▯▯▯  │               │
│ │                 │ │ 边框: 1px solid │ │ 数量: [1]       │               │
│ │                 │ │ #E5E7EB         │ │                 │               │
│ │                 │ │ 圆角: 8px       │ │ [🎨 立即生成]   │               │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘               │
├─────────────────────────────────────────────────────────────────────────────┤
│ 底部状态栏 (高度: 48px)                                                     │
│ 状态: 就绪 | 提示词: "一只在星空下飞翔的猫" | 预计时间: 15秒               │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 核心组件设计

### 1. 工作室导航栏 (Studio Navigation)

#### 设计规范
```css
.studio-navbar {
  height: 64px;
  background: white;
  border-bottom: 1px solid #E5E7EB;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.back-button {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F3F4F6;
  color: #374151;
  cursor: pointer;
}

.back-button:hover {
  background: #E5E7EB;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6B7280;
}

.breadcrumb-separator {
  color: #D1D5DB;
}

.breadcrumb-current {
  color: #111827;
  font-weight: 500;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-action {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.save-button {
  background: #F3F4F6;
  color: #374151;
}

.save-button:hover {
  background: #E5E7EB;
}

.generate-button {
  background: #3B82F6;
  color: white;
}

.generate-button:hover {
  background: #2563EB;
}

.share-button {
  background: transparent;
  color: #374151;
  border: 1px solid #D1D5DB;
}

.share-button:hover {
  background: #F9FAFB;
}
```

### 2. 创作模式切换 (Creation Mode Tabs)

#### 设计规范
```css
.mode-tabs {
  height: 60px;
  background: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
  display: flex;
  padding: 0 24px;
  gap: 1px;
}

.mode-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-tab:hover {
  background: #F3F4F6;
}

.mode-tab.active {
  border-bottom-color: #3B82F6;
  background: white;
}

.mode-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.mode-name {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.mode-tab.active .mode-name {
  color: #3B82F6;
  font-weight: 600;
}

.mode-description {
  font-size: 12px;
  color: #9CA3AF;
  margin-top: 2px;
}

/* 不同模式的颜色标识 */
.mode-image.active {
  border-bottom-color: #8B5CF6;
}

.mode-image.active .mode-name {
  color: #8B5CF6;
}

.mode-video.active {
  border-bottom-color: #EC4899;
}

.mode-video.active .mode-name {
  color: #EC4899;
}

.mode-audio.active {
  border-bottom-color: #10B981;
}

.mode-audio.active .mode-name {
  color: #10B981;
}

.mode-document.active {
  border-bottom-color: #3B82F6;
}

.mode-document.active .mode-name {
  color: #3B82F6;
}
```

### 3. 左侧面板 (Left Panel - 项目文件)

#### 设计规范
```css
.left-panel {
  width: 280px;
  background: white;
  border-right: 1px solid #E5E7EB;
  display: flex;
  flex-direction: column;
}

.panel-section {
  padding: 20px;
  border-bottom: 1px solid #F3F4F6;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-action {
  font-size: 12px;
  color: #3B82F6;
  cursor: pointer;
}

/* 项目文件列表 */
.project-files {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.file-item:hover {
  background: #F9FAFB;
}

.file-item.active {
  background: #EFF6FF;
  border-left: 3px solid #3B82F6;
}

.file-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.file-image .file-icon {
  background: rgba(139, 92, 246, 0.1);
  color: #8B5CF6;
}

.file-video .file-icon {
  background: rgba(236, 72, 153, 0.1);
  color: #EC4899;
}

.file-info {
  flex: 1;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 2px;
}

.file-meta {
  font-size: 12px;
  color: #6B7280;
}

/* 历史版本 */
.version-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.version-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.version-item:hover {
  background: #F9FAFB;
}

.version-preview {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background: #F3F4F6;
  overflow: hidden;
}

.version-info {
  flex: 1;
}

.version-name {
  font-size: 13px;
  color: #374151;
}

.version-time {
  font-size: 11px;
  color: #9CA3AF;
}
```

### 4. 中央创作区 (Central Workspace)

#### 设计规范
```css
.central-workspace {
  flex: 1;
  background: #F9FAFB;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.preview-container {
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.preview-header {
  padding: 16px 24px;
  border-bottom: 1px solid #E5E7EB;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.preview-actions {
  display: flex;
  gap: 12px;
}

.preview-action {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.download-button {
  background: #3B82F6;
  color: white;
}

.download-button:hover {
  background: #2563EB;
}

.fullscreen-button {
  background: #F3F4F6;
  color: #374151;
}

.fullscreen-button:hover {
  background: #E5E7EB;
}

.preview-content {
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

/* 不同模式的预览内容 */
.image-preview {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
}

.video-preview {
  width: 640px;
  height: 360px;
  background: #111827;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.audio-preview {
  width: 100%;
  max-width: 600px;
}

.document-preview {
  width: 100%;
  max-width: 600px;
  background: white;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 生成中的状态 */
.generating-state {
  text-align: center;
  padding: 60px 40px;
}

.generating-icon {
  font-size: 48px;
  margin-bottom: 20px;
  animation: pulse 2s infinite;
}

.generating-text {
  font-size: 18px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 12px;
}

.generating-subtext {
  font-size: 14px;
  color: #6B7280;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### 5. 右侧控制面板 (Right Control Panel)

#### 设计规范
```css
.right-panel {
  width: 360px;
  background: white;
  border-left: 1px solid #E5E7EB;
  display: flex;
  flex-direction: column;
}

.control-section {
  padding: 24px;
  border-bottom: 1px solid #F3F4F6;
}

.control-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 提示词输入 */
.prompt-input-container {
  position: relative;
}

.prompt-textarea {
  width: 100%;
  min-height: 120px;
  padding: 16px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  background: #F9FAFB;
}

.prompt-textarea:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.prompt-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
}

.prompt-count {
  font-size: 12px;
  color: #6B7280;
}

.prompt-suggestions {
  font-size: 12px;
  color: #3B82F6;
  cursor: pointer;
}

/* 参数控制 */
.parameter-group {
  margin-bottom: 24px;
}

.parameter-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.parameter-name {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.parameter-value {
  font-size: 13px;
  color: #6B7280;
}

/* 选择器参数 */
.select-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.select-control:focus {
  outline: none;
  border-color: #3B82F6;
}

/* 滑块参数 */
.slider-control {
  width: 100%;
  height: 6px;
  background: #E5E7EB;
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
}

.slider-control::-webkit-slider-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3B82F6;
  cursor: pointer;
  -webkit-appearance: none;
}

/* 数字输入 */
.number-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}

/* 生成按钮 */
.generate-action {
  padding: 16px;
  text-align: center;
}

.generate-button {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #3B82F6, #8B5CF6);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.generate-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
}

.generate-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* 高级参数 */
.advanced-