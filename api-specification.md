# AI 内容生产平台 - API 接口规范

## 概述
本文档定义了 AI Content Studio Platform 的 RESTful API 接口规范，包括认证、用户管理、项目管理、AI 生成等核心功能。

## 基础信息

### 基础 URL
```
https://api.aicontentstudio.com/v1
```

### 认证方式
所有 API 请求都需要在 Header 中包含认证令牌：
```
Authorization: Bearer {access_token}
```

### 响应格式
统一 JSON 响应格式：
```json
{
  "success": true,
  "data": {...},
  "error": null,
  "meta": {
    "request_id": "req_123456",
    "timestamp": "2026-02-14T10:30:00Z"
  }
}
```

### 错误响应
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "认证令牌无效或已过期",
    "details": {
      "expired_at": "2026-02-13T10:30:00Z"
    }
  },
  "meta": {
    "request_id": "req_123456",
    "timestamp": "2026-02-14T10:30:00Z"
  }
}
```

## 认证 API

### 用户注册
```
POST /auth/register
```

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "secure_password_123",
  "username": "creative_user",
  "full_name": "张三"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "username": "creative_user",
      "full_name": "张三",
      "avatar_url": null,
      "credits": 100,
      "created_at": "2026-02-14T10:30:00Z"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "error": null,
  "meta": {...}
}
```

### 用户登录
```
POST /auth/login
```

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "secure_password_123"
}
```

**响应**: 同注册响应

### 刷新令牌
```
POST /auth/refresh
```

**请求体**:
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**响应**: 返回新的 access_token

## 用户 API

### 获取当前用户信息
```
GET /users/me
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "username": "creative_user",
    "full_name": "张三",
    "avatar_url": "https://cdn.aicontentstudio.com/avatars/user_123.jpg",
    "credits": 95.50,
    "settings": {
      "language": "zh-CN",
      "theme": "dark",
      "notification_preferences": {
        "email": true,
        "push": true
      }
    },
    "stats": {
      "projects_count": 15,
      "generations_count": 128,
      "total_credits_used": 45.50
    },
    "created_at": "2026-02-01T10:30:00Z",
    "updated_at": "2026-02-14T09:15:00Z"
  },
  "error": null,
  "meta": {...}
}
```

### 更新用户信息
```
PUT /users/me
```

**请求体**:
```json
{
  "full_name": "李四",
  "avatar_url": "https://example.com/new-avatar.jpg",
  "settings": {
    "language": "en-US",
    "theme": "light"
  }
}
```

## 项目 API

### 获取项目列表
```
GET /projects
```

**查询参数**:
- `page`: 页码，默认 1
- `per_page`: 每页数量，默认 20
- `type`: 项目类型过滤 (ui_design, video, audio, document)
- `status`: 状态过滤 (draft, active, archived)
- `sort`: 排序字段 (created_at, updated_at, title)
- `order`: 排序顺序 (asc, desc)

**响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": "proj_123",
      "title": "产品介绍视频",
      "description": "为新产品制作介绍视频",
      "type": "video",
      "status": "active",
      "thumbnail_url": "https://cdn.aicontentstudio.com/thumbnails/proj_123.jpg",
      "created_at": "2026-02-10T10:30:00Z",
      "updated_at": "2026-02-14T09:15:00Z"
    },
    // ... 更多项目
  ],
  "error": null,
  "meta": {
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 45,
      "total_pages": 3
    },
    // ... 其他 meta
  }
}
```

### 创建新项目
```
POST /projects
```

**请求体**:
```json
{
  "title": "新UI设计项目",
  "description": "为移动应用设计新的用户界面",
  "type": "ui_design",
  "template_id": "template_ui_mobile", // 可选，使用模板
  "settings": {
    "canvas_size": "375x812",
    "style": "modern_minimal"
  }
}
```

### 获取项目详情
```
GET /projects/{project_id}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "proj_123",
    "title": "产品介绍视频",
    "description": "为新产品制作介绍视频",
    "type": "video",
    "status": "active",
    "settings": {
      "duration": 30,
      "aspect_ratio": "16:9",
      "style": "corporate"
    },
    "metadata": {
      "generation_count": 8,
      "last_generation_at": "2026-02-14T09:15:00Z",
      "total_credits_used": 12.75
    },
    "collaborators": [
      {
        "user_id": "user_123",
        "role": "owner",
        "joined_at": "2026-02-10T10:30:00Z"
      }
    ],
    "assets": [
      {
        "id": "asset_123",
        "type": "video",
        "url": "https://cdn.aicontentstudio.com/assets/proj_123/video_1.mp4",
        "thumbnail_url": "https://cdn.aicontentstudio.com/assets/proj_123/thumb_1.jpg",
        "created_at": "2026-02-14T09:15:00Z"
      }
    ],
    "created_at": "2026-02-10T10:30:00Z",
    "updated_at": "2026-02-14T09:15:00Z"
  },
  "error": null,
  "meta": {...}
}
```

### 更新项目
```
PUT /projects/{project_id}
```

**请求体**:
```json
{
  "title": "更新后的项目标题",
  "description": "更新后的项目描述",
  "status": "archived",
  "settings": {
    "duration": 45,
    "style": "cinematic"
  }
}
```

### 删除项目
```
DELETE /projects/{project_id}
```

## AI 生成 API

### 生成图像
```
POST /ai/generate/image
```

**请求体**:
```json
{
  "project_id": "proj_123",
  "prompt": "一个现代简约的移动应用界面，包含仪表板、图表和导航，蓝色主题，高清细节",
  "parameters": {
    "model": "stable-diffusion-3",
    "style": "ui_design",
    "size": "1024x1024",
    "num_images": 4,
    "steps": 30,
    "guidance_scale": 7.5,
    "negative_prompt": "模糊，低质量，文字"
  },
  "callback_url": "https://webhook.example.com/ai-callback" // 可选
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "task_id": "task_123456",
    "status": "queued",
    "estimated_time": 45,
    "estimated_cost": 0.25
  },
  "error": null,
  "meta": {...}
}
```

### 生成视频
```
POST /ai/generate/video
```

**请求体**:
```json
{
  "project_id": "proj_123",
  "prompt": "一个科技产品的介绍视频，展示产品功能和用户界面，动态转场，科技感音乐",
  "parameters": {
    "model": "runway-gen2",
    "duration": 15,
    "style": "corporate",
    "aspect_ratio": "16:9",
    "motion_intensity": 0.7,
    "include_audio": true
  }
}
```

### 生成音频
```
POST /ai/generate/audio
```

**请求体**:
```json
{
  "project_id": "proj_123",
  "prompt": "轻松愉快的背景音乐，适合科技产品演示，电子音乐风格，节奏适中",
  "parameters": {
    "type": "music", // music, sound_effect, voice
    "model": "musicgen",
    "duration": 30,
    "style": "electronic",
    "tempo": 120,
    "instruments": ["synth", "drums", "bass"]
  }
}
```

### 解析文档
```
POST /ai/parse/document
```

**请求体**:
```form-data
file: (二进制文件)
type: "pdf" // pdf, docx, pptx, image
options: {
  "extract_tables": true,
  "extract_images": true,
  "generate_summary": true,
  "suggest_visualizations": true
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "document_id": "doc_123",
    "original_filename": "sales_report.pdf",
    "file_size": 2048576,
    "pages": 24,
    "extracted_text": "...",
    "tables": [
      {
        "table_index": 1,
        "data": [[...]],
        "columns": ["月份", "销售额", "增长率"],
        "summary": "第一季度销售额增长15%"
      }
    ],
    "summary": "本报告显示公司第一季度业绩...",
    "visualization_suggestions": [
      {
        "type": "bar_chart",
        "title": "月度销售额趋势",
        "data_source": "table_1",
        "vega_spec": {...}
      }
    ],
    "processing_time": 3.5
  },
  "error": null,
  "meta": {...}
}
```

### 获取生成任务状态
```
GET /ai/tasks/{task_id}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "task_id": "task_123456",
    "project_id": "proj_123",
    "type": "image_generation",
    "status": "completed",
    "progress": 100,
    "parameters": {
      "prompt": "...",
      "model": "stable-diffusion-3",
      // ... 其他参数
    },
    "result": {
      "output_urls": [
        "https://cdn.aicontentstudio.com/generations/task_123456_1.jpg",
        "https://cdn.aicontentstudio.com/generations/task_123456_2.jpg",
        "https://cdn.aicontentstudio.com/generations/task_123456_3.jpg",
        "https://cdn.aicontentstudio.com/generations/task_123456_4.jpg"
      ],
      "metadata": {
        "seed": 123456789,
        "steps": 30,
        "guidance_scale": 7.5,
        "model_version": "sd3-5b"
      }
    },
    "cost": 0.25,
    "started_at": "2026-02-14T10:30:00Z",
    "completed_at": "2026-02-14T10:30:45Z",
    "created_at": "2026-02-14T10:29:55Z"
  },
  "error": null,
  "meta": {...}
}
```

### 获取项目生成历史
```
GET /projects/{project_id}/generations
```

**查询参数**:
- `type`: 过滤生成类型
- `status`: 过滤状态
- `page`, `per_page`: 分页参数

## 文件上传 API

### 初始化分片上传
```
POST /uploads/initialize
```

**请求体**:
```json
{
  "file_name": "design_concept.jpg",
  "file_size": 5242880,
  "file_type": "image/jpeg",
  "project_id": "proj_123"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "upload_id": "upload_123",
    "chunk_size": 1048576,
    "chunks_required": 5
  },
  "error": null,
  "meta": {...}
}
```

### 上传分片
```
POST /uploads/{upload_id}/chunks/{chunk_index}
```

**请求体**:
```
Content-Type: application/octet-stream

(二进制分片数据)
```

### 完成上传
```
POST /uploads/{upload_id}/complete
```

**请求体**:
```json
{
  "chunks_received": [0, 1, 2, 3, 4]
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "file_id": "file_123",
    "url": "https://cdn.aicontentstudio.com/uploads/file_123.jpg",
    "thumbnail_url": "https://cdn.aicontentstudio.com/uploads/thumb_file_123.jpg",
    "metadata": {
      "file_name": "design_concept.jpg",
      "file_size": 5242880,
      "file_type": "image/jpeg",
      "dimensions": "1920x1080"
    }
  },
  "error": null,
  "meta": {...}
}
```

## 计费 API

### 获取用户点数余额
```
GET /billing/balance
```

**响应**:
```json
{
  "success": true,
  "data": {
    "credits": 95.50,
    "currency": "USD",
    "lifetime_credits_used": 45.50,
    "current_plan": {
      "name": "Pro",
      "monthly_credits": 1000,
      "price": 29.99,
      "renews_on": "2026-03-01"
    },
    "recent_transactions": [
      {
        "id": "txn_123",
        "type": "generation",
        "amount": -0.25,
        "description": "图像生成 - 4张图片",
        "timestamp": "2026-02-14T10:30:45Z",
        "balance_after": 95.50
      }
    ]
  },
  "error": null,
  "meta": {...}
}
```

### 估算生成成本
```
POST /billing/estimate
```

**请求体**:
```json
{
  "generation_type": "image",
  "parameters": {
    "model": "stable-diffusion-3",
    "size": "1024x1024",
    "num_images": 4,
    "steps": 30
  }
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "estimated_cost": 0.25,
    "currency": "USD",
    "breakdown": {
      "base_cost": 0.20,
      "size_multiplier": 1.0,
      "steps_multiplier": 1.0,
      "quantity_multiplier": 1.0
    },
    "user_credits_after": 95.25,
    "cost_saving_tips": [
      "使用512x512尺寸可节省50%成本",
      "减少采样步骤到20步可节省33%成本"
    ]
  },
  "error": null,
  "meta": {...}
}
```

## 实时通知 API

### 建立 WebSocket 连接
```
wss://api.aicontentstudio.com/v1/ws
```

**连接参数**:
```
?token={access_token}
```

### 消息格式
```json
{
  "type": "generation_update",
  "data": {
    "task_id": "task_123456",
    "status": "completed",
    "progress": 100,
    "result_urls": [...]
  },
  "timestamp": "2026-02-14T10:30:45Z"
}
```

### 通知类型:
- `generation_update`: AI 生成任务状态更新
- `project_update`: 项目更新（协作）
- `system_notification`: 系统通知
- `credit_alert`: 点数不足提醒

## 错误码参考

|