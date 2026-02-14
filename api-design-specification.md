# API设计规范文档

## 🎯 概述
**文档类型**: API设计规范  
**阶段**: 第三阶段 - 技术架构设计  
**负责代理**: Backend Architect  
**开始时间**: 2026-02-14T23:15:00+08:00  
**预计完成**: 2026-02-14T23:45:00+08:00  
**状态**: 🚀 进行中

## 📊 设计原则

### RESTful API设计原则
```
1. 资源导向: 所有端点围绕资源设计
2. HTTP方法语义: GET(读), POST(创建), PUT(更新), DELETE(删除)
3. 无状态: 每个请求包含所有必要信息
4. 统一接口: 一致的命名和响应格式
5. 分层系统: 客户端不直接访问后端服务
6. 按需代码: 可选的客户端代码扩展
```

### 版本控制策略
```
URL路径版本: /api/v1/
请求头版本: Accept: application/vnd.api.v1+json
默认版本: v1 (最新稳定版)
弃用策略: 旧版本支持6个月
迁移指南: 提供版本迁移文档
```

### 认证和授权
```
认证方式:
  - Bearer Token: JWT访问令牌
  - API Key: 服务间通信
  - OAuth 2.0: 第三方集成

授权模型:
  - 基于角色的访问控制(RBAC)
  - 资源级权限检查
  - 团队和项目权限继承
```

## 🗂️ API端点设计

### 认证API (Authentication)
```
POST   /api/v1/auth/register        # 用户注册
POST   /api/v1/auth/login           # 用户登录
POST   /api/v1/auth/refresh         # 刷新令牌
POST   /api/v1/auth/logout          # 用户登出
POST   /api/v1/auth/forgot-password # 忘记密码
POST   /api/v1/auth/reset-password  # 重置密码
GET    /api/v1/auth/me              # 获取当前用户信息
```

### 用户API (Users)
```
GET    /api/v1/users                # 获取用户列表(管理员)
POST   /api/v1/users                # 创建用户(管理员)
GET    /api/v1/users/{id}           # 获取用户详情
PUT    /api/v1/users/{id}           # 更新用户信息
DELETE /api/v1/users/{id}           # 删除用户(管理员)
GET    /api/v1/users/{id}/teams     # 获取用户的团队
GET    /api/v1/users/{id}/projects  # 获取用户的项目
```

### 团队API (Teams)
```
GET    /api/v1/teams                # 获取团队列表
POST   /api/v1/teams                # 创建团队
GET    /api/v1/teams/{id}           # 获取团队详情
PUT    /api/v1/teams/{id}           # 更新团队信息
DELETE /api/v1/teams/{id}           # 删除团队
GET    /api/v1/teams/{id}/members   # 获取团队成员
POST   /api/v1/teams/{id}/members   # 添加团队成员
DELETE /api/v1/teams/{id}/members/{userId} # 移除成员
GET    /api/v1/teams/{id}/projects  # 获取团队项目
```

### 项目API (Projects)
```
GET    /api/v1/projects             # 获取项目列表
POST   /api/v1/projects             # 创建项目
GET    /api/v1/projects/{id}        # 获取项目详情
PUT    /api/v1/projects/{id}        # 更新项目信息
DELETE /api/v1/projects/{id}        # 删除项目
GET    /api/v1/projects/{id}/files  # 获取项目文件
POST   /api/v1/projects/{id}/files  # 上传文件
GET    /api/v1/projects/{id}/members # 获取项目成员
POST   /api/v1/projects/{id}/members # 添加项目成员
```

### 文件API (Files)
```
GET    /api/v1/files/{id}           # 获取文件详情
PUT    /api/v1/files/{id}           # 更新文件信息
DELETE /api/v1/files/{id}           # 删除文件
GET    /api/v1/files/{id}/versions  # 获取文件版本
POST   /api/v1/files/{id}/versions  # 创建新版本
GET    /api/v1/files/{id}/download  # 下载文件
POST   /api/v1/files/{id}/share     # 分享文件
GET    /api/v1/files/{id}/preview   # 获取文件预览
```

### 内容生成API (Content Generation)
```
POST   /api/v1/generate/image       # 生成图像
POST   /api/v1/generate/video       # 生成视频
POST   /api/v1/generate/audio       # 生成音频
POST   /api/v1/generate/document    # 解析文档
GET    /api/v1/generate/tasks       # 获取生成任务列表
GET    /api/v1/generate/tasks/{id}  # 获取任务详情
DELETE /api/v1/generate/tasks/{id}  # 取消任务
GET    /api/v1/generate/tasks/{id}/progress # 获取任务进度
```

### 实时协作API (Real-time Collaboration)
```
WebSocket连接: /ws/v1/projects/{id}
消息类型:
  - join: 加入项目
  - leave: 离开项目
  - cursor: 光标位置
  - selection: 文本选择
  - edit: 编辑操作
  - chat: 聊天消息
  - presence: 在线状态
```

## 📋 请求和响应格式

### 通用请求头
```http
Authorization: Bearer {jwt_token}
Content-Type: application/json
Accept: application/json
X-Request-ID: {uuid}  # 请求追踪ID
X-Client-Version: 1.0.0
```

### 成功响应格式
```json
{
  "success": true,
  "data": {
    // 实际数据
  },
  "meta": {
    "timestamp": "2026-02-14T23:15:00Z",
    "requestId": "req_123456",
    "page": 1,
    "pageSize": 20,
    "total": 100
  }
}
```

### 错误响应格式
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "输入验证失败",
    "details": [
      {
        "field": "email",
        "message": "邮箱格式不正确"
      }
    ],
    "requestId": "req_123456",
    "timestamp": "2026-02-14T23:15:00Z"
  }
}
```

### 分页响应格式
```json
{
  "success": true,
  "data": [
    // 数据数组
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    },
    "links": {
      "first": "/api/v1/users?page=1",
      "prev": null,
      "next": "/api/v1/users?page=2",
      "last": "/api/v1/users?page=5"
    }
  }
}
```

## 🔧 详细端点设计

### 1. 用户注册端点
```http
POST /api/v1/auth/register
Content-Type: application/json

请求体:
{
  "email": "user@example.com",
  "username": "username",
  "password": "SecurePassword123!",
  "displayName": "用户显示名"
}

响应体 (成功):
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "username",
      "displayName": "用户显示名",
      "avatarUrl": null,
      "emailVerified": false,
      "createdAt": "2026-02-14T23:15:00Z"
    },
    "tokens": {
      "accessToken": "jwt_token",
      "refreshToken": "refresh_token",
      "expiresIn": 900,
      "refreshExpiresIn": 604800
    }
  }
}

错误码:
- 400: 输入验证失败
- 409: 邮箱或用户名已存在
- 429: 请求过于频繁
```

### 2. 用户登录端点
```http
POST /api/v1/auth/login
Content-Type: application/json

请求体:
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

响应体:
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "username",
      "displayName": "用户显示名",
      "avatarUrl": "https://...",
      "emailVerified": true
    },
    "tokens": {
      "accessToken": "jwt_token",
      "refreshToken": "refresh_token",
      "expiresIn": 900,
      "refreshExpiresIn": 604800
    }
  }
}

错误码:
- 400: 输入验证失败
- 401: 认证失败
- 429: 请求过于频繁
```

### 3. 创建项目端点
```http
POST /api/v1/projects
Authorization: Bearer {jwt_token}
Content-Type: application/json

请求体:
{
  "name": "我的AI项目",
  "description": "这是一个AI内容生成项目",
  "teamId": "team_uuid",  // 可选，不传则为个人项目
  "visibility": "private",  // private, team, public
  "settings": {
    "defaultModel": "firefly",
    "autoSave": true,
    "collaboration": true
  }
}

响应体:
{
  "success": true,
  "data": {
    "id": "project_uuid",
    "name": "我的AI项目",
    "slug": "my-ai-project",
    "description": "这是一个AI内容生成项目",
    "teamId": "team_uuid",
    "userId": "user_uuid",
    "visibility": "private",
    "settings": {
      "defaultModel": "firefly",
      "autoSave": true,
      "collaboration": true
    },
    "avatarUrl": null,
    "fileCount": 0,
    "totalSizeMb": 0,
    "memberCount": 1,
    "createdAt": "2026-02-14T23:15:00Z",
    "updatedAt": "2026-02-14T23:15:00Z"
  }
}

错误码:
- 400: 输入验证失败
- 403: 没有权限创建团队项目
- 404: 团队不存在
```

### 4. 生成图像端点
```http
POST /api/v1/generate/image
Authorization: Bearer {jwt_token}
Content-Type: application/json

请求体:
{
  "projectId": "project_uuid",
  "prompt": "一只在星空下飞翔的猫，赛博朋克风格",
  "model": "firefly",  // firefly, stable-diffusion, dalle
  "parameters": {
    "width": 1024,
    "height": 1024,
    "style": "cyberpunk",
    "numImages": 1,
    "quality": "standard"  // standard, hd
  },
  "metadata": {
    "purpose": "项目封面",
    "tags": ["猫", "星空", "赛博朋克"]
  }
}

响应体:
{
  "success": true,
  "data": {
    "taskId": "task_uuid",
    "status": "pending",
    "estimatedTime": 30,  // 秒
    "estimatedCost": 0.02,  // 美元
    "webhookUrl": "https://api.example.com/webhooks/tasks/{taskId}",
    "pollUrl": "/api/v1/generate/tasks/{taskId}"
  }
}

错误码:
- 400: 输入验证失败
- 402: 额度不足
- 403: 项目访问权限不足
- 429: 速率限制
```

### 5. 获取任务进度端点
```http
GET /api/v1/generate/tasks/{taskId}
Authorization: Bearer {jwt_token}

响应体:
{
  "success": true,
  "data": {
    "id": "task_uuid",
    "projectId": "project_uuid",
    "userId": "user_uuid",
    "taskType": "image",
    "serviceProvider": "firefly",
    "modelName": "firefly-v2",
    "status": "processing",
    "progressPercent": 65,
    "prompt": "一只在星空下飞翔的猫，赛博朋克风格",
    "parameters": {
      "width": 1024,
      "height": 1024
    },
    "outputFiles": [
      {
        "id": "file_uuid",
        "url": "https://storage.example.com/files/{fileId}",
        "type": "image",
        "sizeBytes": 1048576,
        "width": 1024,
        "height": 1024
      }
    ],
    "estimatedCostUsd": 0.02,
    "actualCostUsd": 0.018,
    "queueTimeMs": 1200,
    "processingTimeMs": 45000,
    "createdAt": "2026-02-14T23:15:00Z",
    "startedAt": "2026-02-14T23:15:01Z",
    "updatedAt": "2026-02-14T23:15:45Z"
  }
}

错误码:
- 403: 任务访问权限不足
- 404: 任务不存在
```

## 🛡️ 安全设计

### 输入验证
```
所有输入必须验证:
1. 类型验证: 确保数据类型正确
2. 范围验证: 数值在合理范围内
3. 格式验证: 邮箱、URL等格式正确
4. 业务验证: 符合业务规则
5. 大小限制: 防止过大请求

验证库: Pydantic (Python) / class-validator (TypeScript)
```

### 输出过滤
```
敏感信息过滤:
- 密码哈希不返回
- API密钥不返回
- 内部错误详情不暴露
- 用户隐私信息限制

数据脱敏:
- 邮箱: us***@example.com
- 手机: 138****1234
- 身份证: 1101**********1234
```

### 速率限制
```
基于令牌的速率限制:
- 认证端点: 5次/分钟
- 普通端点: 60次/分钟
- 文件上传: 10次/分钟
- AI生成: 根据用户等级限制

基于IP的速率限制:
- 公共端点: 100次/分钟
- 防止DDoS攻击
```

### 防刷策略
```
注册限制:
- 同一IP: 3个账号/天
- 同一邮箱: 1个账号

登录保护:
- 失败次数: 5次锁定15分钟
- 可疑登录: 异地登录验证
- 设备管理: 新设备验证
```

## 📈 性能优化

### 缓存策略
```
响应缓存:
- 公共数据: CDN缓存
- 用户数据: Redis缓存
- 列表查询: 查询结果缓存
- 文件元数据: 内存缓存

缓存失效:
- TTL过期: 自动失效
- 写时失效: 数据变更时失效
- 手动刷新: 管理员刷新
```

### 批量操作
```
批量查询:
- 获取多个资源详情
- 减少HTTP请求数量
- 优化数据库查询

批量操作:
- 批量创建文件
- 批量更新权限
- 批量删除资源
```

### 异步处理
```
长时间操作:
- 文件上传: 分片上传
- 内容生成: 异步任务
- 数据处理: 后台处理
- 邮件发送: 队列处理

Webhook通知:
- 任务完成通知
- 文件处理完成
- 协作事件通知
```

## 🔄 错误处理

### 错误码定义
```
HTTP状态码:
- 200: 成功
- 201: 创建成功
- 400: 客户端错误
- 401: 未认证
- 403: 无权限
- 404: 资源不存在
- 409: 资源冲突
- 422: 输入验证失败
- 429: 请求过多
- 500: 服务器错误
- 502: 网关错误
- 503: 服务不可用

业务错误码:
- AUTH_*: 认证相关错误
- USER_*: 用户相关错误
- TEAM_*: 团队相关错误
- PROJECT_*: 项目相关错误
- FILE_*: 文件相关错误
- GENERATION_*: 生成相关错误
- PAYMENT_*: 支付相关错误
```

### 错误响应标准化
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "输入验证失败",
    "details": [
      {
        "field": "email",
        "message": "邮箱格式不正确",
        "code": "INVALID_EMAIL"
      }
    ],
    "requestId": "req_123456",
    "timestamp": "2026-02-14T23:15:00Z",
    "documentationUrl": "https://docs.example.com/errors/VALIDATION_ERROR"
  }
}
```

### 错误