# 首页设计核心规范

## 概述
**设计状态**: 核心最小可行版本  
**创建时间**: 2026-02-14T23:00:00+08:00  
**设计者**: UX/UI Designer Agent  
**紧急状态**: 第二阶段紧急重启核心交付物

## 设计目标

### 核心目标
1. **第一印象**: 展示平台AI能力和专业性
2. **快速入口**: 用户能立即开始创作
3. **价值传达**: 清晰传达平台核心价值
4. **信任建立**: 通过设计和内容建立信任

### 设计原则
- **简洁明了**: 避免信息过载
- **视觉层次**: 清晰的视觉引导
- **行动导向**: 突出主要行动按钮
- **响应式**: 适配所有设备尺寸

## 页面结构

### 桌面端布局 (1440px)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 顶部导航栏 (高度: 72px)                                                     │
│ ┌─────┐                                                                     │
│ │Logo│ 首页 创作 项目 模板 学习 社区                搜索 🔔 👤            │
│ └─────┘                                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 英雄区域 (高度: 600px)                                                      │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 主标题: 释放创造力，AI助你创作无限内容                              │   │
│  │ 副标题: 图像、视频、音频、文档 - 一站式AI内容生产平台               │   │
│  │                                                                     │   │
│  │ [🎨 开始免费创作]  [📚 查看示例]                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ AI创作工具展示区 (高度: 400px)                                             │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                           │
│ │ 图像生成│ │ 视频生成│ │ 音频生成│ │ 文档解析│                           │
│ │  🖼️     │ │  🎬     │ │  🎵     │ │  📄     │                           │
│ │ AI绘画  │ │ AI视频  │ │ AI音乐  │ │ AI分析  │                           │
│ │ 艺术、设计│ 动画、剪辑│ 配乐、音效│ 提取、总结│                           │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ 特色项目展示区 (高度: 500px)                                               │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │
│ │ 项目1:          │ │ 项目2:          │ │ 项目3:          │               │
│ │ AI生成概念艺术  │ │ 营销视频制作    │ │ 个性化配乐      │               │
│ │                 │ │                 │ │                 │               │
│ │ 查看详情 →      │ │ 查看详情 →      │ │ 查看详情 →      │               │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘               │
├─────────────────────────────────────────────────────────────────────────────┤
│ 数据统计区 (高度: 200px)                                                   │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                                       │
│ │10K+  │ │50K+  │ │95%   │ │4.8/5 │                                       │
│ │用户   │ │项目   │ │满意度│ │评分   │                                       │
│ └──────┘ └──────┘ └──────┘ └──────┘                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ 页脚 (高度: 300px)                                                         │
│ 关于我们 帮助中心 条款隐私 联系我们                                       │
│ © 2026 AI内容生产平台. 保留所有权利.                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 核心组件设计

### 1. 顶部导航栏 (Navigation Bar)

#### 设计规范
```css
/* 样式规范 */
.navbar {
  height: 72px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #E5E7EB;
  position: sticky;
  top: 0;
  z-index: 1000;
}

/* Logo区域 */
.logo {
  font-size: 24px;
  font-weight: 700;
  color: #3B82F6;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 导航菜单 */
.nav-menu {
  display: flex;
  gap: 32px;
}

.nav-item {
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  padding: 8px 0;
  position: relative;
}

.nav-item.active {
  color: #3B82F6;
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #3B82F6;
  border-radius: 1px;
}

/* 用户操作区域 */
.user-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-button, .notification-button {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F3F4F6;
  color: #374151;
  cursor: pointer;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: linear-gradient(135deg, #3B82F6, #8B5CF6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}
```

#### 交互状态
- **悬停效果**: 导航项颜色变深，轻微放大
- **激活状态**: 蓝色下划线指示
- **搜索展开**: 点击搜索图标展开搜索框
- **通知提示**: 有新通知时显示红点

### 2. 英雄区域 (Hero Section)

#### 设计规范
```css
.hero-section {
  height: 600px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 20px;
}

.hero-content {
  max-width: 800px;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 24px;
}

.hero-subtitle {
  font-size: 20px;
  opacity: 0.9;
  margin-bottom: 40px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.primary-action {
  padding: 16px 32px;
  background: white;
  color: #3B82F6;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.primary-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.secondary-action {
  padding: 16px 32px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.secondary-action:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}
```

#### 内容策略
- **主标题**: 简短有力，突出AI和创造力
- **副标题**: 具体说明平台功能
- **行动按钮**: 主要按钮突出，次要按钮补充
- **视觉元素**: 可考虑添加动态AI生成效果预览

### 3. AI创作工具展示区

#### 设计规范
```css
.tools-section {
  padding: 80px 20px;
  background: #F9FAFB;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  color: #111827;
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: 18px;
  text-align: center;
  color: #6B7280;
  margin-bottom: 60px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.tool-card {
  background: white;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  border: 1px solid #E5E7EB;
  transition: all 0.3s ease;
}

.tool-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: transparent;
}

.tool-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  margin: 0 auto 24px;
}

/* 不同类型工具的颜色 */
.tool-image .tool-icon {
  background: rgba(139, 92, 246, 0.1);
  color: #8B5CF6;
}

.tool-video .tool-icon {
  background: rgba(236, 72, 153, 0.1);
  color: #EC4899;
}

.tool-audio .tool-icon {
  background: rgba(16, 185, 129, 0.1);
  color: #10B981;
}

.tool-document .tool-icon {
  background: rgba(59, 130, 246, 0.1);
  color: #3B82F6;
}

.tool-name {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
}

.tool-description {
  font-size: 16px;
  color: #6B7280;
  line-height: 1.5;
}
```

### 4. 特色项目展示区

#### 设计规范
```css
.projects-section {
  padding: 80px 20px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.project-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #E5E7EB;
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.project-image {
  height: 200px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  position: relative;
  overflow: hidden;
}

.project-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #3B82F6;
}

.project-content {
  padding: 24px;
}

.project-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
}

.project-description {
  font-size: 15px;
  color: #6B7280;
  line-height: 1.5;
  margin-bottom: 20px;
}

.project-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #3B82F6;
  text-decoration: none;
}

.project-link:hover {
  color: #1D4ED8;
}
```

### 5. 数据统计区

#### 设计规范
```css
.stats-section {
  padding: 60px 20px;
  background: linear-gradient(135deg, #3B82F6, #8B5CF6);
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 16px;
  opacity: 0.9;
}
```

### 6. 页脚 (Footer)

#### 设计规范
```css
.footer {
  padding: 60px 20px 40px;
  background: #111827;
  color: white;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 60px;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.footer-logo {
  font-size: 24px;
  font-weight: 700;
  color: white;
}

.footer-description {
  font-size: 16px;
  color: #9CA3AF;
  line-height: 1.6;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.footer-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.footer-link {
  font-size: 15px;
  color: #9CA3AF;
  text-decoration: none;
}

.footer-link:hover {
  color: white;
}

.footer-bottom {
  max-width: 1200px;
  margin: 60px auto 0;
  padding-top: 40px;
  border-top: 1px solid #374151;
  text-align: center;
  color: #9CA3AF;
  font-size: 14px;
}
```

## 响应式设计

### 平板设备 (768px-1024px)
```css
@media (max-width: 1024px) {
  .tools-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }
  
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }
}
```

### 移动设备 (<768px)
```css
@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }
  
  .hero-subtitle {
    font-size: 18px;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .tools-grid {
    grid-template-columns: 1fr;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .nav-menu {
    display: none; /* 移动端使用汉堡菜单 */
  }
}
```

## 交互设计

### 1. 滚动动画
```javascript
// 滚动时显示动画效果
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

// 观察需要动画的元素
document.querySelectorAll('.tool-card, .project-card').forEach(el => {
  observer.observe(el);
});
```

### 2. 搜索功能
```javascript
// 搜索框交互
const searchButton = document.querySelector('.search-button');
const searchOverlay = document.querySelector('.search-overlay');

searchButton.addEventListener('click', () => {
  searchOverlay.classList.add('active');
});

// 搜索建议
const searchInput = document.querySelector('.search-input');
searchInput.addEventListener('input', async (e) => {
  const query = e.target.value;
  if (query.length > 2) {
    const suggestions = await fetchSearchSuggestions(query);
    showSearchSuggestions(suggestions);
  }
});
```

### 3. 工具卡片悬停效果
```css
.tool-card {
  transition: all 0.3s ease;
}

.tool-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.tool-card:hover .tool-icon {
  transform: scale(1.1);
}
```

## 内容策略

### 文案规范
1. **标题**: 简洁有力，突出价值主张
2. **描述**: 具体说明功能好处
3. **行动号召**: 明确告诉用户该做什么
4. **信任元素**: 数据统计、用户评价等

### 视觉内容
1. **高质量图片**: 展示AI生成效果
2. **动态元素**: 微动画增加活力
3. **品牌一致性**: 使用设计系统颜色
4. **空白空间**: 合理留白，避免拥挤

## 无障碍设计

### 键盘导航
- 所有交互元素支持键盘访问
- 清晰的焦点状态
- 合理的Tab顺序

### 屏幕阅读器
- 语义化HTML结构
- 适当的ARIA标签
- 图片alt文本

### 颜色对比
- 所有文本满足WCAG AA标准
- 重要元素满足AAA标准
- 色盲友好颜色选择

## 性能优化

### 图片优化
- 使用WebP格式
- 懒加载非首屏图片
- 响应式图片尺寸

### 代码优化
- 按需加载JavaScript
- CSS代码分割
- 字体子集化

### 缓存策略
- 静态资源长期缓存
- API响应适当缓存
- 服务端渲染优化

## 测试要求

### 功能测试
1. 所有链接正常工作
2. 表单提交正确
3. 搜索功能准确
4. 响应式布局正确

### 兼容性测试
- Chrome, Firefox, Safari, Edge
- iOS, Android
- 不同屏幕尺寸

### 性能测试
- Lighthouse评分 > 90
- 首屏加载时间 < 3秒
- 交互响应时间 < 100ms

## 实施计划

### 第一阶段 (核心实现)
1. 基础布局和结构
2. 导航栏和英雄区域
3. 工具展示区
4. 页脚

### 第二阶段 (增强功能)
1. 搜索功能
2. 项目展示动态加载
3. 动画效果
4. 性能优化

### 第三阶段 (高级功能)
1. 个性化内容推荐
2. 实时数据更新
3. A/B测试集成
4. 分析跟踪

## 成功指标

### 业务指标
- 用户注册转化率
- 工具使用率
- 用户留存率
- 客户满意度

### 技术指标
- 页面加载速度
- 错误率
- API响应时间
- 核心Web指标

## 维护计划

### 日常维护
- 内容更新
- 链接检查
- 性能监控
- 安全更新

### 定期优化
- 每季度设计评审
- 每半年性能审计
- 每年大版本更新
- 用户反馈收集

## 紧急状态说明
此设计规范为紧急重启后的核心最小可行版本，包含首页完整的设计规范和实现指导。由于时间限制，Figma设计文件将以详细的设计规范替代，确保开发团队能够准确实现。

实际Figma文件将包含：
1. 完整的页面布局
2. 所有组件的设计细节
3. 交互状态设计
4. 响应式断点设计

---
**设计状态**: 核心规范完成  
**下一步**: 开发团队根据此规范实现首页  
**预计实现时间**: 2-3天 (正常开发速度)  
**紧急实现时间**: 1天 (加速开发)
