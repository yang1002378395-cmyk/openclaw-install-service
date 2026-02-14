# API 接口规范

## 1. 概述

### 1.1 API 设计原则
- **RESTful 风格**：资源导向，HTTP方法语义化
- **版本控制**：URL路径包含版本号
- **统一响应格式**：标准化成功/错误响应
- **文档完善**：OpenAPI 3.0规范
- **向后兼容**：确保API变更不影响现有客户端

### 1.2 基础信息
- **基础URL**：`https://api.ai-content-platform.com/v1`
- **认证方式**：Bearer Token (JWT) 或 API Key
- **内容类型**：`application/json`
- **字符编码**：UTF-8

## 2. 认证与授权

### 2.1 认证方式
```http
# Header认证
Authorization: Bearer {jwt_token}
# 或
X-API-Key: {api_key}
```

### 2.2 获取Token
```http
POST /auth/token
Content-Type: application/json

{
  "api_key": "your_api_key",
  "api_secret": "your_api_secret"
}
```

**响应：**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "def50200..."
}
```

## 3. 统一AI生成API

### 3.1 通用生成接口
```http
POST /generate
Content-Type: application/json
Authorization: Bearer {token}
```

**请求参数：**
```json
{
  "model_type": "image|video|audio|document",
  "prompt": "生成内容的描述",
  "options": {
    "model": "dall-e-3|runway-gen2|elevenlabs|claude-3",
    "quality": "standard|hd|premium",
    "style": "realistic|artistic|cartoon",
    "aspect_ratio": "1:1|16:9|9:16",
    "duration": 30,
    "format": "png|mp4|mp3|json"
  },
  "callback_url": "https://your-callback.com/webhook"
}
```

**响应：**
```json
{
  "task_id": "task_1234567890",
  "status": "pending|processing|completed|failed",
  "estimated_time": 30,
  "result_url": "https://storage.ai-content.com/results/task_1234567890.png",
  "cost_estimate": {
    "credits": 10,
    "currency": "USD",
    "amount": 0.15
  }
}
```

## 4. 任务状态查询API

### 4.1 查询单个任务
```http
GET /tasks/{task_id}
Authorization: Bearer {token}
```

**响应：**
```json
{
  "task_id": "task_1234567890",
  "status": "completed",
  "progress": 100,
  "created_at": "2024-01-15T10:30:00Z",
  "started_at": "2024-01-15T10:30:05Z",
  "completed_at": "2024-01-15T10:30:35Z",
  "result": {
    "url": "https://storage.ai-content.com/results/task_1234567890.png",
    "size": 1024576,
    "format": "png",
    "dimensions": {
      "width": 1024,
      "height": 1024
    }
  },
  "cost": {
    "credits_used": 8,
    "amount": 0.12
  },
  "error": null
}
```

### 4.2 批量查询任务
```http
GET /tasks
Authorization: Bearer {token}
Query Parameters:
  - status: pending|processing|completed|failed
  - limit: 50 (默认)
  - offset: 0
  - start_date: 2024-01-01
  - end_date: 2024-01-31
```

## 5. 批量处理API

### 5.1 创建批量任务
```http
POST /batch
Content-Type: application/json
Authorization: Bearer {token}
```

**请求参数：**
```json
{
  "name": "产品图片批量生成",
  "tasks": [
    {
      "prompt": "现代风格的产品展示图",
      "options": {
        "model": "dall-e-3",
        "quality": "hd",
        "aspect_ratio": "16:9"
      }
    },
    {
      "prompt": "产品细节特写",
      "options": {
        "model": "dall-e-3",
        "quality": "standard",
        "aspect_ratio": "1:1"
      }
    }
  ],
  "concurrency": 5,
  "notify_email": "user@example.com"
}
```

**响应：**
```json
{
  "batch_id": "batch_1234567890",
  "total_tasks": 2,
  "estimated_completion_time": 120,
  "total_cost_estimate": {
    "credits": 15,
    "amount": 0.25
  }
}
```

### 5.2 批量任务状态
```http
GET /batch/{batch_id}
Authorization: Bearer {token}
```

**响应：**
```json
{
  "batch_id": "batch_1234567890",
  "status": "processing",
  "progress": {
    "total": 2,
    "completed": 1,
    "failed": 0,
    "pending": 1
  },
  "tasks": [
    {
      "task_id": "task_1234567891",
      "status": "completed",
      "result_url": "https://storage.ai-content.com/results/task_1234567891.png"
    },
    {
      "task_id": "task_1234567892",
      "status": "pending"
    }
  ],
  "download_url": "https://storage.ai-content.com/batches/batch_1234567890.zip"
}
```

## 6. 模型管理API

### 6.1 获取可用模型
```http
GET /models
Authorization: Bearer {token}
```

**响应：**
```json
{
  "models": [
    {
      "id": "dall-e-3",
      "name": "DALL-E 3",
      "type": "image",
      "capabilities": ["text-to-image", "image-variation"],
      "formats": ["png", "jpeg", "webp"],
      "limits": {
        "max_resolution": "1792x1024",
        "max_prompt_length": 4000
      },
      "cost_per_unit": 0.04,
      "status": "available",
      "latency": {
        "p50": 2.5,
        "p95": 5.0
      }
    },
    {
      "id": "elevenlabs",
      "name": "ElevenLabs",
      "type": "audio",
      "capabilities": ["text-to-speech", "voice-cloning"],
      "formats": ["mp3", "wav"],
      "limits": {
        "max_duration": 300,
        "max_text_length": 5000
      },
      "cost_per_unit": 0.24,
      "status": "available"
    }
  ]
}
```

### 6.2 模型健康检查
```http
GET /models/{model_id}/health
Authorization: Bearer {token}
```

**响应：**
```json
{
  "model_id": "dall-e-3",
  "status": "healthy",
  "last_check": "2024-01-15T10:30:00Z",
  "response_time": 2.3,
  "success_rate": 99.8,
  "current_load": 65
}
```

## 7. 用户配额API

### 7.1 获取配额信息
```http
GET /quota
Authorization: Bearer {token}
```

**响应：**
```json
{
  "plan": "professional",
  "limits": {
    "monthly_credits": 5000,
    "concurrent_tasks": 10,
    "max_file_size": 104857600
  },
  "usage": {
    "credits_used": 1250,
    "credits_remaining": 3750,
    "reset_date": "2024-02-01T00:00:00Z"
  },
  "costs": {
    "this_month": 18.75,
    "last_month": 15.50
  }
}
```

### 7.2 实时用量监控
```http
GET /usage/realtime
Authorization: Bearer {token}
```

**响应：**
```json
{
  "current_minute": {
    "requests": 45,
    "credits": 67.5
  },
  "current_hour": {
    "requests": 1200,
    "credits": 1800
  },
  "alerts": [
    {
      "level": "warning",
      "message": "接近小时限额",
      "threshold": 2000,
      "current": 1800
    }
  ]
}
```

## 8. Webhook 通知

### 8.1 Webhook 配置
```http
POST /webhooks
Content-Type: application/json
Authorization: Bearer {token}
```

**请求参数：**
```json
{
  "url": "https://your-server.com/webhook",
  "events": ["task.completed", "task.failed", "batch.completed"],
  "secret": "your_webhook_secret"
}
```

### 8.2 Webhook 事件格式
```json
{
  "event": "task.completed",
  "timestamp": "2024-01-15T10:30:35Z",
  "data": {
    "task_id": "task_1234567890",
    "status": "completed",
    "result_url": "https://storage.ai-content.com/results/task_1234567890.png",
    "cost": {
      "credits": 8,
      "amount": 0.12
    }
  },
  "signature": "sha256=..."
}
```

## 9. 错误处理

### 9.1 错误响应格式
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "请求频率超过限制",
    "details": {
      "limit": 100,
      "remaining": 0,
      "reset_at": "2024-01-15T11:00:00Z"
    },
    "request_id": "req_1234567890",
    "timestamp": "2024-01-15T10:45:00Z"
  }
}
```

### 9.2 常见错误码
| 错误码 | HTTP状态 | 描述 |
|--------|----------|------|
| `INVALID_API_KEY` | 401 | API密钥无效 |
| `INSUFFICIENT_CREDITS` | 402 | 额度不足 |
| `RATE_LIMIT_EXCEEDED` | 429 | 请求频率超限 |
| `MODEL_UNAVAILABLE` | 503 | 模型暂时不可用 |
| `INVALID_PARAMETERS` | 400 | 参数错误 |
| `TASK_NOT_FOUND` | 404 | 任务不存在 |

## 10. 流式响应API

### 10.1 流式生成（SSE）
```http
GET /generate/stream
Authorization: Bearer {token}
Accept: text/event-stream
```

**事件流：**
```
event: status
data: {"progress": 10, "status": "processing"}

event: progress
data: {"progress": 50, "stage": "generating"}

event: result
data: {"url": "https://storage.ai-content.com/results/task_1234567890.png"}

event: complete
data: {"task_id": "task_1234567890", "cost": 0.12}
```

## 11. 文件上传API

### 11.1 上传参考文件
```http
POST /uploads
Content-Type: multipart/form-data
Authorization: Bearer {token}
```

**表单字段：**
- `file`: 上传的文件
- `purpose`: `reference|style|voice_sample`
- `metadata`: JSON字符串

**响应：**
```json
{
  "upload_id": "upload_1234567890",
  "url": "https://storage.ai-content.com/uploads/upload_1234567890.jpg",
  "size": 2048576,
  "content_type": "image/jpeg"
}
```

## 12. API 限流策略

### 12.1 限流头信息
```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705312800
Retry-After: 60
```

### 12.2 限流规则
| 用户层级 | 每分钟请求数 | 每小时请求数 | 并发任务数 |
|----------|--------------|--------------|------------|
| 免费层 | 10 | 100 | 1 |
| 基础层 | 60 | 1000 | 5 |
| 专业层 | 200 | 5000 | 10 |
| 企业层 | 1000 | 20000 | 50 |

## 13. SDK 支持

### 13.1 官方SDK
- **Python**: `pip install ai-content-sdk`
- **JavaScript**: `npm install ai-content-sdk`
- **Java**: Maven Central
- **Go**: `go get github.com/ai-content/sdk-go`

### 13.2 使用示例（Python）
```python
from ai_content import AIClient

client = AIClient(api_key="your_api_key")

# 生成图像
task = client.generate_image(
    prompt="美丽的日落风景",
    model="dall-e-3",
    quality="hd"
)

# 等待结果
result = client.wait_for_task(task.id)
print(f"结果URL: {result.url}")
```

---

本API规范提供了完整的接口设计，支持各种AI生成任务的管理和监控，确保系统易于集成和使用。