# 设计系统技术规范 (CSS 变量 + Tailwind CSS 兼容)

## 1. CSS 设计令牌 (CSS Custom Properties)

### 颜色系统
```css
:root {
  /* 品牌色 */
  --color-primary-50: #EEF2FF;
  --color-primary-100: #E0E7FF;
  --color-primary-200: #C7D2FE;
  --color-primary-300: #A5B4FC;
  --color-primary-400: #818CF8;
  --color-primary-500: #4F46E5; /* 主品牌色 */
  --color-primary-600: #4338CA;
  --color-primary-700: #3730A3;
  --color-primary-800: #312E81;
  --color-primary-900: #1E1B4B;
  
  /* 中性色 */
  --color-gray-50: #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-300: #D1D5DB;
  --color-gray-400: #9CA3AF;
  --color-gray-500: #6B7280;
  --color-gray-600: #4B5563;
  --color-gray-700: #374151;
  --color-gray-800: #1F2937;
  --color-gray-900: #111827;
  
  /* 功能色 */
  --color-success-500: #10B981;
  --color-warning-500: #F59E0B;
  --color-error-500: #EF4444;
  --color-info-500: #3B82F6;
  
  /* AI 状态色 */
  --color-ai-generating: #8B5CF6;
  --color-ai-thinking: #EC4899;
  --color-ai-ready: #10B981;
}
```

### 间距系统
```css
:root {
  /* 基础间距单位: 4px */
  --spacing-px: 1px;
  --spacing-0: 0;
  --spacing-1: 0.25rem;  /* 4px */
  --spacing-2: 0.5rem;   /* 8px */
  --spacing-3: 0.75rem;  /* 12px */
  --spacing-4: 1rem;     /* 16px */
  --spacing-5: 1.25rem;  /* 20px */
  --spacing-6: 1.5rem;   /* 24px */
  --spacing-8: 2rem;     /* 32px */
  --spacing-10: 2.5rem;  /* 40px */
  --spacing-12: 3rem;    /* 48px */
  --spacing-16: 4rem;    /* 64px */
  --spacing-20: 5rem;    /* 80px */
  --spacing-24: 6rem;    /* 96px */
  --spacing-32: 8rem;    /* 128px */
}
```

### 字体系统
```css
:root {
  /* 字体大小 */
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  --font-size-5xl: 3rem;      /* 48px */
  
  /* 行高 */
  --line-height-none: 1;
  --line-height-tight: 1.25;
  --line-height-snug: 1.375;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-loose: 2;
  
  /* 字重 */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

### 圆角系统
```css
:root {
  --radius-none: 0;
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-full: 9999px;
}
```

### 阴影系统
```css
:root {
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  
  /* 内阴影 */
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  
  /* 聚焦阴影 */
  --shadow-focus-primary: 0 0 0 3px rgba(79, 70, 229, 0.5);
  --shadow-focus-error: 0 0 0 3px rgba(239, 68, 68, 0.5);
}
```

## 2. Tailwind CSS 配置扩展

### tailwind.config.js 扩展配置
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#4F46E5', // 主品牌色
          600: '#4338CA',
          700: '#3730A3',
          800: '#312E81',
          900: '#1E1B4B',
        },
        ai: {
          generating: '#8B5CF6',
          thinking: '#EC4899',
          ready: '#10B981',
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      fontSize: {
        'xxs': '0.625rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'ai-pulse': 'ai-pulse 1.5s ease-in-out infinite',
        'ai-wave': 'ai-wave 2s linear infinite',
      },
      keyframes: {
        'ai-pulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        'ai-wave': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      }
    }
  }
}
```

## 3. 响应式断点设计规范

### 断点定义 (与 Tailwind 默认对齐)
```css
/* 断点映射 */
--breakpoint-sm: 640px;   /* 移动端 */
--breakpoint-md: 768px;   /* 平板端 */
--breakpoint-lg: 1024px;  /* 桌面端 */
--breakpoint-xl: 1280px;  /* 大桌面端 */
--breakpoint-2xl: 1536px; /* 超大桌面端 */

/* 媒体查询示例 */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### 响应式布局策略
```css
/* 移动端优先 CSS 示例 */
.container {
  width: 100%;
  padding: var(--spacing-4);
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
    padding: var(--spacing-6);
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
    padding: var(--spacing-8);
  }
}
```

### 组件响应式设计
```css
/* 导航组件响应式 */
.nav-desktop {
  display: none;
}

.nav-mobile {
  display: flex;
}

@media (min-width: 768px) {
  .nav-desktop {
    display: flex;
  }
  
  .nav-mobile {
    display: none;
  }
}

/* 网格系统响应式 */
.grid-responsive {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-4);
}

@media (min-width: 768px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## 4. 核心 AI 组件交互状态规范

### AI 按钮组件状态
```css
/* 基础按钮 */
.ai-button {
  /* 默认状态 */
  background-color: var(--color-primary-500);
  color: white;
  border-radius: var(--radius-md);
  padding: var(--spacing-2) var(--spacing-4);
  transition: all 0.2s ease;
}

/* 悬停状态 */
.ai-button:hover {
  background-color: var(--color-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* 激活/按下状态 */
.ai-button:active {
  background-color: var(--color-primary-700);
  transform: translateY(0);
}

/* 禁用状态 */
.ai-button:disabled {
  background-color: var(--color-gray-300);
  color: var(--color-gray-500);
  cursor: not-allowed;
  opacity: 0.6;
}

/* 加载状态 */
.ai-button.loading {
  position: relative;
  color: transparent;
}

.ai-button.loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin: -8px 0 0 -8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

### AI 输入框组件状态
```css
/* 基础输入框 */
.ai-input {
  /* 默认状态 */
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  padding: var(--spacing-2) var(--spacing-3);
  transition: all 0.2s ease;
}

/* 聚焦状态 */
.ai-input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: var(--shadow-focus-primary);
}

/* 错误状态 */
.ai-input.error {
  border-color: var(--color-error-500);
}

.ai-input.error:focus {
  box-shadow: var(--shadow-focus-error);
}

/* 成功状态 */
.ai-input.success {
  border-color: var(--color-success-500);
}

/* 禁用状态 */
.ai-input:disabled {
  background-color: var(--color-gray-100);
  color: var(--color-gray-500);
  cursor: not-allowed;
}
```

### AI 生成状态指示器
```css
/* 生成中状态 */
.ai-generating {
  position: relative;
  overflow: hidden;
}

.ai-generating::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-ai-generating), transparent);
  animation: ai-wave 2s linear infinite;
}

/* 思考中状态 */
.ai-thinking {
  animation: ai-pulse 1.5s ease-in-out infinite;
}

/* 就绪状态 */
.ai-ready {
  background-color: var(--color-ai-ready);
  color: white;
}
```

## 5. 组件尺寸规范

### 按钮尺寸
```css
/* 小尺寸按钮 */
.btn-sm {
  height: 32px;
  padding: var(--spacing-1) var(--spacing-3);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-sm);
}

/* 中尺寸按钮 (默认) */
.btn-md {
  height: 40px;
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-base);
  border-radius: var(--radius-md);
}

/* 大尺寸按钮 */
.btn-lg {
  height: 48px;
  padding: var(--spacing-3) var(--spacing-6);
  font-size: var(--font-size-lg);
  border-radius: var(--radius-lg);
}
```

### 输入框尺寸
```css
/* 小尺寸输入框 */
.input-sm {
  height: 32px;
  padding: var(--spacing-1) var(--spacing-2);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-sm);
}

/* 中尺寸输入框 (默认) */
.input-md {
  height: 40px;
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-size-base);
  border-radius: var(--radius-md);
}

/* 大尺寸输入框 */
.input-lg {
  height: 48px;
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--font-size-lg);
  border-radius: var(--radius-lg);
}
```

### 卡片尺寸
```css
/* 小卡片 */
.card-sm {
  padding: var(--spacing-3);
  border-radius: var(--radius-md);
}

/* 中卡片 (默认) */
.card-md {
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
}

/* 大卡片 */
.card-lg {
  padding: var(--spacing-6);
  border-radius: var(--radius-xl);
}
```

## 6. 错误状态和空状态设计

### 错误状态设计
```css
/* 错误容器 */
.error-container {
  border: 1px solid var(--color-error-500);
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  color: var(--color-error-700);
}

/* 错误图标 */
.error-icon {
  color: var(--color-error-500);
  font-size: var(--font-size-2xl);
}

/* 错误消息 */
.error-message {
  margin-top: var(--spacing-2);
  font-size: var(--font-size-sm);
}

/* 错误按钮 */
.error-button {
  margin-top: var(--spacing-3);
  background-color: var(--color-error-500);
  color: white;
}

.error-button:hover {
  background-color: var(--color-error-600);
}
```

### 空状态设计
```css
/* 空状态容器 */
.empty-state {
  text-align: center;
  padding: var(--spacing-8) var(--spacing-4);
  color: var(--color-gray-500);
}

/* 空状态图标 */
.empty-icon {
  font-size: var(--font-size-5xl);
  color: var(--color-gray-300);
  margin-bottom: var(--spacing-4);
}

/* 空状态标题 */
.empty-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-700);
  margin-bottom: var(--spacing-2);
}

/* 空状态描述 */
.empty-description {
  font-size: var(--font-size-base);
  color: var(--color-gray-600);
  margin-bottom: var(--spacing-4);
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

/* 空状态操作按钮 */
.empty-action {
  background-color: var(--color-primary-500);
  color: white;
}

.empty-action:hover {
  background-color: var(--color-primary-600);
}
```

### AI 特定空状态
```css
/* AI 生成空状态 */
.ai-empty-generating {
  background: linear-gradient(135deg, 
    var(--color-ai-generating) 0%, 
