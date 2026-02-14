# 数据库设计规范文档

## 🎯 概述
**文档类型**: 数据库设计规范  
**阶段**: 第三阶段 - 技术架构设计  
**负责代理**: Backend Architect  
**开始时间**: 2026-02-14T23:35:00+08:00  
**预计完成**: 2026-02-15T00:20:00+08:00  
**状态**: 🚀 进行中

## 📊 设计目标

### 业务需求
1. **用户管理**: 支持用户注册、登录、资料管理
2. **项目管理**: 支持项目创建、协作、版本管理
3. **内容管理**: 支持多模态内容生成和存储
4. **协作功能**: 支持实时协作和权限管理
5. **分析统计**: 支持用户行为分析和业务统计

### 技术需求
1. **性能**: 支持高并发读写操作
2. **扩展性**: 支持数据量增长和分片
3. **一致性**: 保证数据一致性和完整性
4. **可用性**: 高可用，支持故障恢复
5. **安全性**: 数据加密和访问控制

## 🗄️ 数据库选型

### 主数据库: PostgreSQL 15
```
选择理由:
  - ACID兼容: 强一致性保证
  - JSONB支持: 灵活的半结构化数据
  - 全文搜索: 内置全文搜索功能
  - 地理空间: 支持地理位置数据
  - 扩展性: 支持读写分离和分片
  - 生态系统: 丰富的工具和库
  - 成本效益: 开源免费

版本: PostgreSQL 15
部署: 主从复制，读写分离
备份: 每日全量备份 + 持续WAL归档
监控: pg_stat_statements, pgBadger
```

### 缓存数据库: Redis 7
```
选择理由:
  - 高性能: 内存存储，极快读写
  - 数据结构: 丰富的数据结构支持
  - 持久化: RDB + AOF持久化选项
  - 集群支持: Redis Cluster自动分片
  - 发布订阅: 消息发布订阅功能

使用场景:
  - 会话存储: 用户会话管理
  - 缓存层: 热点数据缓存
  - 消息队列: 简单任务队列
  - 实时数据: 实时计数和统计
  - 分布式锁: 分布式锁实现
```

### 搜索数据库: Elasticsearch 8
```
选择理由:
  - 全文搜索: 强大的全文搜索能力
  - 实时分析: 实时数据分析和聚合
  - 可扩展性: 水平扩展容易
  - REST API: 简单的HTTP接口
  - 生态系统: Kibana可视化工具

使用场景:
  - 内容搜索: 项目和文件搜索
  - 日志分析: 应用日志分析
  - 用户行为: 用户行为分析
  - 监控数据: 系统监控数据
```

### 对象存储: S3/MinIO
```
选择理由:
  - 无限扩展: 存储容量无限扩展
  - 成本效益: 按使用量付费
  - 高可用: 数据多副本存储
  - 版本控制: 对象版本管理
  - 生命周期: 自动数据生命周期管理

使用场景:
  - 文件存储: 用户上传的文件
  - 媒体文件: 生成的图像、视频、音频
  - 备份数据: 数据库备份文件
  - 静态资源: 应用静态资源
```

## 📋 数据模型设计

### 核心实体关系图
```
用户 (users)
  ├── 拥有 ──┐
  │          ▼
  │       项目 (projects)
  │          ├── 包含 ──┐
  │          │          ▼
  │          │       文件 (files)
  │          │          ├── 版本 (file_versions)
  │          │          └── 生成任务 (generation_tasks)
  │          │
  │          └── 成员 (project_members)
  │
  ├── 会话 (sessions)
  ├── 团队 (teams)
  │      └── 成员 (team_members)
  │
  └── 活动 (user_activities)

AI服务 (ai_services)
  ├── 调用记录 (api_calls)
  └── 成本记录 (cost_records)

系统 (system)
  ├── 配置 (configurations)
  ├── 日志 (system_logs)
  └── 监控 (monitoring_metrics)
```

## 🗂️ 详细表结构设计

### 1. 用户表 (users)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(150),
    
    -- 认证信息
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(50) NOT NULL,
    
    -- 个人信息
    avatar_url TEXT,
    bio TEXT,
    website VARCHAR(255),
    
    -- 账户状态
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'deleted')),
    email_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    
    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- 索引
    INDEX idx_users_email (email),
    INDEX idx_users_username (username),
    INDEX idx_users_status (status),
    INDEX idx_users_created_at (created_at)
);

-- 扩展信息 (JSONB)
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    preferences JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2. 会话表 (sessions)
```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- 会话信息
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    refresh_token_hash VARCHAR(255),
    user_agent TEXT,
    ip_address INET,
    
    -- 设备信息
    device_type VARCHAR(50),
    device_name VARCHAR(100),
    os_name VARCHAR(50),
    browser_name VARCHAR(50),
    
    -- 有效期
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    refresh_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- 状态
    revoked BOOLEAN DEFAULT FALSE,
    
    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 索引
    INDEX idx_sessions_user_id (user_id),
    INDEX idx_sessions_expires_at (expires_at),
    INDEX idx_sessions_token_hash (token_hash)
);
```

### 3. 团队表 (teams)
```sql
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    
    -- 所有者
    owner_id UUID NOT NULL REFERENCES users(id),
    
    -- 团队设置
    avatar_url TEXT,
    website VARCHAR(255),
    billing_email VARCHAR(255),
    
    -- 订阅信息
    plan VARCHAR(50) DEFAULT 'free',
    subscription_status VARCHAR(20) DEFAULT 'active',
    subscription_ends_at TIMESTAMP WITH TIME ZONE,
    
    -- 限制
    max_members INTEGER DEFAULT 10,
    max_projects INTEGER DEFAULT 5,
    max_storage_mb INTEGER DEFAULT 1024,
    
    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- 索引
    INDEX idx_teams_owner_id (owner_id),
    INDEX idx_teams_slug (slug),
    INDEX idx_teams_subscription_status (subscription_status)
);

-- 团队成员
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- 角色和权限
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'guest')),
    permissions JSONB DEFAULT '{}',
    
    -- 加入信息
    invited_by UUID REFERENCES users(id),
    invited_at TIMESTAMP WITH TIME ZONE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 状态
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'inactive')),
    
    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 约束
    UNIQUE(team_id, user_id),
    
    -- 索引
    INDEX idx_team_members_team_id (team_id),
    INDEX idx_team_members_user_id (user_id),
    INDEX idx_team_members_role (role)
);
```

### 4. 项目表 (projects)
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- 所属关系
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- 项目设置
    avatar_url TEXT,
    visibility VARCHAR(20) DEFAULT 'private' CHECK (visibility IN ('private', 'team', 'public')),
    settings JSONB DEFAULT '{}',
    
    -- 统计信息
    file_count INTEGER DEFAULT 0,
    total_size_mb INTEGER DEFAULT 0,
    member_count INTEGER DEFAULT 1,
    
    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    archived_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- 约束
    CHECK (
        (team_id IS NOT NULL AND user_id IS NULL) OR
        (team_id IS NULL AND user_id IS NOT NULL)
    ),
    
    -- 索引
    INDEX idx_projects_team_id (team_id),
    INDEX idx_projects_user_id (user_id),
    INDEX idx_projects_slug (slug),
    INDEX idx_projects_created_at (created_at)
);

-- 项目成员
CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- 角色和权限
    role VARCHAR(50) DEFAULT 'editor' CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
    permissions JSONB DEFAULT '{}',
    
    -- 加入信息
    invited_by UUID REFERENCES users(id),
    invited_at TIMESTAMP WITH TIME ZONE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 约束
    UNIQUE(project_id, user_id),
    
    -- 索引
    INDEX idx_project_members_project_id (project_id),
    INDEX idx_project_members_user_id (user_id)
);
```

### 5. 文件表 (files)
```sql
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    
    -- 文件信息
    name VARCHAR(500) NOT NULL,
    path TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL CHECK (file_type IN ('image', 'video', 'audio', 'document', 'folder', 'other')),
    mime_type VARCHAR(100),
    
    -- 存储信息
    storage_key TEXT NOT NULL,
    storage_provider VARCHAR(50) DEFAULT 's3',
    storage_region VARCHAR(50),
    bucket_name VARCHAR(255),
    
    -- 文件属性
    size_bytes BIGINT NOT NULL,
    width INTEGER,
    height INTEGER,
    duration_seconds INTEGER,
    metadata JSONB DEFAULT '{}',
    
    -- 版本信息
    current_version_id UUID,
    version_count INTEGER DEFAULT 1,
    
    -- 权限
    visibility VARCHAR(20) DEFAULT 'private' CHECK (visibility IN ('private', 'project', 'public')),
    
    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- 索引
    INDEX idx_files_project_id (project_id),
    INDEX idx_files_path (path),
    INDEX idx_files_file_type (file_type),
    INDEX idx_files_created_at (created_at),
    
    -- 约束
    UNIQUE(project_id, path, name)
);

-- 文件版本
CREATE TABLE file_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    
    -- 版本信息
    version_number INTEGER NOT NULL,
    description TEXT,
    
    -- 存储信息
    storage_key TEXT NOT NULL,
    size_bytes BIGINT NOT NULL,
    metadata JSONB DEFAULT '{}',
    
    -- 创建信息
    created_by UUID REFERENCES users(id),
    
    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 约束
    UNIQUE(file_id, version_number),
    
    -- 索引
    INDEX idx_file_versions_file_id (file_id),
    INDEX idx_file_versions_created_at (created_at)
);

-- 外键约束
ALTER TABLE files 
ADD CONSTRAINT fk_files_current_version 
FOREIGN KEY (current_version_id) 
REFERENCES file_versions(id) 
ON DELETE SET NULL;
```

### 6. 生成任务表 (generation_tasks)
```sql
CREATE TABLE generation_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 关联信息
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    file_id UUID REFERENCES files(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- 任务信息
    task_type VARCHAR(50) NOT NULL CHECK (task_type IN ('image', 'video', 'audio', 'document', 'enhance', 'transform')),
    service_provider VARCHAR(50) NOT NULL,
    model_name VARCHAR(100),
    
    -- 输入参数
    prompt TEXT,
    parameters JSONB NOT NULL DEFAULT '{}',
    input_files JSONB DEFAULT '[]',
    
    -- 输出结果
    output_files JSONB DEFAULT '[]',
    result_metadata JSONB DEFAULT '{}',
    
    -- 状态跟踪
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    progress_percent INTEGER DEFAULT 0,
    error_message TEXT,
    
    -- 成本信息
    estimated_cost_usd DECIMAL(10, 6),
    actual_cost_usd DECIMAL(10, 6),
    token_count INTEGER,
    
    -- 性能指标
    queue_time_ms INTEGER,
    processing_time_ms INTEGER,
    total_time_ms INTEGER,
    
    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- 索引
    INDEX idx_generation_tasks_project_id (project_id),
    INDEX idx_generation_tasks_user_id (user_id),
    INDEX idx_generation_tasks_status (status),
    INDEX idx_generation_tasks_created_at (created_at),
    INDEX idx_generation_tasks_task_type (task_type)
);
```

### 7. AI服务表 (ai_services)
```sql
CREATE TABLE ai_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 服务信息
    provider VARCHAR(100) NOT NULL,
    service_name VARCHAR(100) NOT NULL,
    model_name VARCHAR(100),
    
    -- 能力描述
    capabilities JSONB NOT NULL DEFAULT '[]',
    supported_formats JSONB DEFAULT '[]',
    max_input_size INTEGER,
    max_output_size INTEGER,
    
    -- 配置信息
    api_endpoint TEXT,
    api_key_encrypted TEXT,
    config JSONB DEFAULT '{}',
    
    -- 状态
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    priority INTEGER DEFAULT 1,
    
    -- 限制
    rate_limit_per_minute INTEGER,
    rate_limit_per_day INTEGER,
    concurrent_limit INTEGER,
    
    -- 成本信息
    cost_per_request_usd DECIMAL(10, 6),
    cost_per_token_usd DECIMAL(10, 6),
    cost_per_second_usd DECIMAL(10, 6),
    
    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 索引
    INDEX idx_ai_services_provider (provider),
    INDEX idx_ai_services_status (status),
    UNIQUE(provider, service_name, model_name)
);

-- API调用记录
CREATE TABLE api_calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES ai_services(id),
    task_id UUID REFERENCES generation_tasks(id),
    
    -- 调用信息
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    request_body JSONB,
    response_body JSONB,
    
    -- 状态