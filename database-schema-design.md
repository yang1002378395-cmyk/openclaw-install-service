# AI 内容生产平台 - 数据库 Schema 设计

## 1. 数据模型设计原则

### 1.1 设计原则
- **规范化设计**：第三范式，减少数据冗余
- **扩展性**：支持未来功能扩展
- **性能优化**：合理索引、分区策略
- **数据一致性**：事务保证、外键约束
- **安全性**：数据加密、访问控制

### 1.2 命名规范
- 表名：`snake_case`，复数形式
- 字段名：`snake_case`
- 主键：`id` (UUID v7)
- 外键：`{table}_id`
- 时间戳：`created_at`, `updated_at`, `deleted_at`

## 2. 核心数据模型

### 2.1 用户数据模型

```sql
-- 用户表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    preferences JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- 用户偏好设置表
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    language VARCHAR(10) DEFAULT 'zh-CN',
    timezone VARCHAR(50) DEFAULT 'Asia/Shanghai',
    notification_email BOOLEAN DEFAULT TRUE,
    notification_push BOOLEAN DEFAULT TRUE,
    default_model VARCHAR(50) DEFAULT 'gpt-4',
    theme VARCHAR(20) DEFAULT 'light',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- 用户会话表
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(255) NOT NULL,
    user_agent TEXT,
    ip_address INET,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_sessions_user_id (user_id),
    INDEX idx_user_sessions_expires_at (expires_at)
);

-- 第三方认证表
CREATE TABLE oauth_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- google, github, microsoft
    provider_user_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, provider_user_id),
    UNIQUE(user_id, provider)
);
```

### 2.2 项目管理数据模型

```sql
-- 项目表
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- article, image, video, audio, code
    status VARCHAR(20) DEFAULT 'draft', -- draft, active, archived
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    settings JSONB DEFAULT '{
        "visibility": "private",
        "collaboration": false,
        "auto_save": true,
        "versioning": true
    }'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_activity_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    INDEX idx_projects_owner_id (owner_id),
    INDEX idx_projects_status (status),
    INDEX idx_projects_created_at (created_at)
);

-- 项目标签表
CREATE TABLE project_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    tag VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, tag),
    INDEX idx_project_tags_tag (tag)
);

-- 项目成员表
CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL, -- owner, admin, editor, viewer
    invited_by UUID REFERENCES users(id),
    invited_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    joined_at TIMESTAMPTZ,
    permissions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id),
    INDEX idx_project_members_user_id (user_id)
);

-- 项目版本表
CREATE TABLE project_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    name VARCHAR(200),
    description TEXT,
    content JSONB NOT NULL, -- 项目内容快照
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_project_versions_project_id (project_id),
    INDEX idx_project_versions_created_at (created_at),
    UNIQUE(project_id, version_number)
);
```

### 2.3 AI 生成任务数据模型

```sql
-- AI生成任务表
CREATE TABLE generation_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- text, image, code, audio, video
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed, cancelled
    prompt TEXT NOT NULL,
    model VARCHAR(100) NOT NULL,
    parameters JSONB DEFAULT '{
        "temperature": 0.7,
        "max_tokens": 1000
    }'::jsonb,
    result JSONB, -- 生成结果
    error JSONB, -- 错误信息
    cost DECIMAL(10, 6) DEFAULT 0, -- 成本（美元）
    duration_ms INTEGER, -- 处理时长（毫秒）
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    priority INTEGER DEFAULT 0, -- 任务优先级
    callback_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    INDEX idx_generation_tasks_user_id (user_id),
    INDEX idx_generation_tasks_project_id (project_id),
    INDEX idx_generation_tasks_status (status),
    INDEX idx_generation_tasks_created_at (created_at),
    INDEX idx_generation_tasks_priority_status (priority, status)
);

-- 任务结果表
CREATE TABLE task_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES generation_tasks(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL, -- text, image_url, audio_url, etc.
    content TEXT, -- 文本内容或URL
    media_id UUID REFERENCES media_files(id), -- 关联的媒体文件
    metadata JSONB DEFAULT '{}'::jsonb,
    quality_score DECIMAL(3, 2), -- 质量评分
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(task_id)
);

-- 模型使用统计表
CREATE TABLE model_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    model VARCHAR(100) NOT NULL,
    task_type VARCHAR(50) NOT NULL,
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    cost DECIMAL(10, 6) DEFAULT 0,
    request_count INTEGER DEFAULT 1,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, model, task_type, date),
    INDEX idx_model_usage_date (date),
    INDEX idx_model_usage_user_id (user_id)
);
```

### 2.4 媒体文件数据模型

```sql
-- 媒体文件表
CREATE TABLE media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL,
    storage_provider VARCHAR(50) DEFAULT 's3', -- s3, minio, azure, gcs
    storage_key VARCHAR(500) NOT NULL,
    storage_bucket VARCHAR(255) NOT NULL,
    storage_region VARCHAR(50),
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    width INTEGER, -- 图片/视频宽度
    height INTEGER, -- 图片/视频高度
    duration DECIMAL(10, 3), -- 音频/视频时长（秒）
    format VARCHAR(50), -- 文件格式
    metadata JSONB DEFAULT '{}'::jsonb,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    is_public BOOLEAN DEFAULT FALSE,
    is_temporary BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ, -- 临时文件过期时间
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    INDEX idx_media_files_owner_id (owner_id),
    INDEX idx_media_files_project_id (project_id),
    INDEX idx_media_files_created_at (created_at),
    INDEX idx_media_files_is_temporary_expires_at (is_temporary, expires_at)
);

-- 文件处理任务表
CREATE TABLE file_processing_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID NOT NULL REFERENCES media_files(id) ON DELETE CASCADE,
    operation VARCHAR(50) NOT NULL, -- resize, compress, transcode, watermark
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
    parameters JSONB DEFAULT '{}'::jsonb,
    result JSONB,
    error TEXT,
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    INDEX idx_file_processing_tasks_file_id (file_id),
    INDEX idx_file_processing_tasks_status (status)
);
```

### 2.5 计费和订阅数据模型

```sql
-- 订阅计划表
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL, -- free, basic, pro, enterprise
    description TEXT,
    price_monthly DECIMAL(10, 2) DEFAULT 0,
    price_yearly DECIMAL(10, 2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    features JSONB NOT NULL,
    limits JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 用户订阅表
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    status VARCHAR(20) DEFAULT 'active', -- active, cancelled, expired, trial
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    cancelled_at TIMESTAMPTZ,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_subscriptions_user_id (user_id),
    INDEX idx_user_subscriptions_status (status),
    INDEX idx_user_subscriptions_current_period_end (current_period_end)
);

-- 使用额度表
CREATE TABLE usage_quotas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quota_type VARCHAR(50) NOT NULL, -- tokens, images, audio_minutes, storage
    used_amount DECIMAL(15, 6) DEFAULT 0,
    total_amount DECIMAL(15, 6) NOT NULL,
    reset_period VARCHAR(20) DEFAULT 'monthly', -- daily, weekly, monthly, yearly
    reset_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, quota_type, reset_date),
    INDEX idx_usage_quotas_user_id (user_id),
    INDEX idx_usage_quotas_reset_date (reset_date)
);

-- 支付记录表
CREATE TABLE payment_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES user_subscriptions(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50), -- credit_card, paypal, etc.
    payment_provider VARCHAR(50), -- stripe, paypal, etc.
    provider_transaction_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_payment_records_user_id (user_id),
    INDEX idx_payment_records_status (status)
);
```

### 2.6 审计和日志数据模型

```sql
-- 审计日志表
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_logs_user_id (user_id),
    INDEX idx_audit_logs_resource (resource_type, resource_id),
    INDEX idx_audit_logs_created_at (created_at)
);

-- API请求日志表
CREATE TABLE api_request_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    method VARCHAR(10) NOT NULL,
    path VARCHAR(500) NOT NULL,
    query_params TEXT,
    status_code INTEGER,
    request_body TEXT,
    response_body TEXT,
    duration_ms INTEGER,
    ip_address INET,
    user_agent TEXT,
    request_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_api_request_logs_user_id (user_id),
    INDEX idx_api_request_logs_path (path),
    INDEX idx_api_request_logs_created_at (created_at),
    INDEX idx_api_request_logs_request_id (request_id)
);
```

## 3. 索引策略

### 3.1 主键索引
- 所有表使用 UUID 主键
- 默认使用 gen_random_uuid() 生成

### 3.2 外键索引
- 所有外键字段都建立索引
- 支持级联删除或设置为 NULL

### 3.3 查询优化索引
```sql
-- 复合索引示例
CREATE INDEX idx_generation_tasks_user_status ON generation_tasks(user_id, status);
CREATE INDEX idx_projects_owner_status ON projects(owner_id, status);
CREATE INDEX idx_media_files_owner_created ON media_files(owner_id, created_at DESC);

-- 部分索引示例
CREATE INDEX idx_active_users ON users(id) WHERE is_active = TRUE;
CREATE INDEX idx_non_deleted_projects ON projects(id) WHERE deleted_at IS NULL;

-- 表达式索引示例
CREATE INDEX idx_users_lower_email ON users(LOWER(email));
CREATE INDEX idx_projects_name_trgm ON projects USING gin(name gin_trgm_ops);
```

## 4. 分区策略

### 4.1 按时间分区
```sql
-- 按月份分区的大表
CREATE TABLE generation_tasks_y2024m01 PARTITION OF generation_tasks
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE api_request_logs_y2024m01 PARTITION OF api_request_logs
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### 4.2 按用户分区
```sql
-- 按用户ID哈希分区
