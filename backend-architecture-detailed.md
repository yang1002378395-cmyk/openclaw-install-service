# 后端架构详细设计文档

## 🎯 概述
**文档类型**: 后端架构详细设计  
**阶段**: 第三阶段 - 技术架构设计  
**负责代理**: Backend Architect  
**开始时间**: 2026-02-14T23:15:00+08:00  
**预计完成**: 2026-02-14T23:45:00+08:00  
**状态**: 🚀 进行中

## 📊 技术栈确定

### 核心框架
```
✅ FastAPI (Python 3.11+)
  - 原因: 高性能，异步支持，自动API文档
  - 版本: 0.104+ (支持Pydantic v2)
  - 特性: 依赖注入，WebSocket，后台任务

✅ SQLAlchemy 2.0+
  - 原因: Python ORM标准，异步支持
  - 配合: Alembic (数据库迁移)

✅ Pydantic 2.0+
  - 原因: 数据验证和序列化
  - 特性: 类型提示，JSON Schema生成
```

### 数据库和缓存
```
✅ PostgreSQL 15
  - 驱动: asyncpg (异步PostgreSQL驱动)
  - 连接池: 连接池管理

✅ Redis 7
  - 驱动: redis-py (支持异步)
  - 用途: 缓存，会话存储，消息队列

✅ Elasticsearch 8
  - 驱动: elasticsearch-py
  - 用途: 搜索，日志分析
```

### 消息队列和任务队列
```
✅ Celery + RabbitMQ
  - 原因: 成熟的异步任务处理
  - 监控: Flower (Celery监控)

✅ 备选方案: RQ (Redis Queue)
  - 简单场景使用
```

### 认证和授权
```
✅ JWT (JSON Web Tokens)
  - 库: python-jose (JWT实现)
  - 算法: RS256 (非对称加密)

✅ OAuth 2.0
  - 库: authlib (OAuth实现)
  - 支持: Google, GitHub, 自定义
```

## 🏗️ 项目结构

### 微服务划分
```
服务1: 用户服务 (user-service)
  - 职责: 用户管理，认证，授权
  - 端口: 8001

服务2: 项目服务 (project-service)
  - 职责: 项目管理，文件管理，协作
  - 端口: 8002

服务3: 内容生成服务 (generation-service)
  - 职责: AI内容生成，任务管理
  - 端口: 8003

服务4: AI编排服务 (ai-orchestration-service)
  - 职责: AI服务路由，成本优化
  - 端口: 8004

服务5: 文件服务 (file-service)
  - 职责: 文件存储，处理，分发
  - 端口: 8005

服务6: 通知服务 (notification-service)
  - 职责: 实时通知，邮件，WebSocket
  - 端口: 8006

服务7: API网关 (api-gateway)
  - 职责: 路由，认证，限流，监控
  - 端口: 8000
```

### 单个服务目录结构 (以用户服务为例)
```
user-service/
├── src/
│   ├── main.py                    # FastAPI应用入口
│   ├── config/                    # 配置管理
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   └── database.py
│   ├── api/                       # API端点
│   │   ├── __init__.py
│   │   ├── v1/                    # API版本
│   │   │   ├── __init__.py
│   │   │   ├── endpoints/
│   │   │   │   ├── auth.py
│   │   │   │   ├── users.py
│   │   │   │   └── teams.py
│   │   │   └── router.py
│   │   └── dependencies.py        # 依赖注入
│   ├── core/                      # 核心业务逻辑
│   │   ├── __init__.py
│   │   ├── security.py           # 安全相关
│   │   ├── exceptions.py         # 异常处理
│   │   └── events.py             # 事件处理
│   ├── models/                    # 数据模型
│   │   ├── __init__.py
│   │   ├── base.py               # 基础模型
│   │   ├── user.py               # 用户模型
│   │   ├── team.py               # 团队模型
│   │   └── session.py            # 会话模型
│   ├── schemas/                   # Pydantic模式
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── team.py
│   │   └── token.py
│   ├── services/                  # 业务服务层
│   │   ├── __init__.py
│   │   ├── user_service.py
│   │   ├── auth_service.py
│   │   └── team_service.py
│   ├── repositories/              # 数据访问层
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── user_repository.py
│   │   └── team_repository.py
│   ├── utils/                     # 工具函数
│   │   ├── __init__.py
│   │   ├── security.py
│   │   └── validation.py
│   └── worker/                    # Celery worker
│       ├── __init__.py
│       ├── tasks.py
│       └── celery_app.py
├── tests/                         # 测试
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_api/
│   └── test_services/
├── alembic/                       # 数据库迁移
│   ├── versions/
│   └── env.py
├── Dockerfile                     # Docker配置
├── docker-compose.yml            # 本地开发
├── requirements.txt              # Python依赖
├── pyproject.toml                # 项目配置
└── .env.example                  # 环境变量示例
```

## 🔧 核心组件设计

### 1. FastAPI应用配置
```python
# src/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import logging

from src.api.v1.router import api_router
from src.config.settings import settings
from src.core.events import create_start_app_handler, create_stop_app_handler

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

def create_application() -> FastAPI:
    application = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        docs_url="/docs" if settings.DEBUG else None,
        redoc_url="/redoc" if settings.DEBUG else None,
    )
    
    # 中间件
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    application.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.ALLOWED_HOSTS,
    )
    
    # 事件处理器
    application.add_event_handler(
        "startup",
        create_start_app_handler(application),
    )
    application.add_event_handler(
        "shutdown",
        create_stop_app_handler(application),
    )
    
    # 路由
    application.include_router(
        api_router,
        prefix=settings.API_V1_STR,
    )
    
    return application

app = create_application()

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}
```

### 2. 配置管理
```python
# src/config/settings.py
from pydantic_settings import BaseSettings
from typing import List, Optional
import secrets

class Settings(BaseSettings):
    # 项目配置
    PROJECT_NAME: str = "AI Content Platform"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"
    
    # API配置
    API_V1_STR: str = "/api/v1"
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1"]
    
    # 安全配置
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # 数据库配置
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "app"
    POSTGRES_PORT: int = 5432
    
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    # Redis配置
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: Optional[str] = None
    REDIS_DB: int = 0
    
    @property
    def REDIS_URL(self) -> str:
        if self.REDIS_PASSWORD:
            return f"redis://:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
    
    # Celery配置
    CELERY_BROKER_URL: str = "amqp://guest:guest@localhost:5672//"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/1"
    
    # AI服务配置
    FIREFLY_API_KEY: Optional[str] = None
    RUNWAY_API_KEY: Optional[str] = None
    UDIO_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    
    # 文件存储配置
    S3_ACCESS_KEY: Optional[str] = None
    S3_SECRET_KEY: Optional[str] = None
    S3_BUCKET_NAME: str = "ai-content-platform"
    S3_REGION: str = "us-east-1"
    S3_ENDPOINT_URL: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
```

### 3. 数据库模型设计
```python
# src/models/base.py
from datetime import datetime
from typing import Any
from uuid import UUID, uuid4

from sqlalchemy import DateTime, String
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    """基础模型类"""
    
    @declared_attr.directive
    def __tablename__(cls) -> str:
        return cls.__name__.lower() + "s"
    
    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

# src/models/user.py
from sqlalchemy import Boolean, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models.base import Base

class User(Base):
    __tablename__ = "users"
    
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )
    username: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        index=True,
        nullable=False,
    )
    display_name: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )
    
    # 认证信息
    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    salt: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    
    # 个人信息
    avatar_url: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    bio: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    website: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    
    # 账户状态
    status: Mapped[str] = mapped_column(
        String(20),
        default="active",
        nullable=False,
    )
    email_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    two_factor_enabled: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    
    # 时间戳
    last_login_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    
    # 关系
    sessions: Mapped[list["Session"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )
    teams: Mapped[list["TeamMember"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )
    projects: Mapped[list["ProjectMember"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )
    
    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email}, username={self.username})>"
```

### 4. Pydantic模式设计
```python
# src/schemas/user.py
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, validator

class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=100)
    display_name: Optional[str] = Field(None, max_length=150)
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    website: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=100)
    
    @validator("password")
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("密码至少8个字符")
        if not any(c.isupper() for c in v):
            raise ValueError("密码必须包含大写字母")
        if not any(c.islower() for c in v):
            raise ValueError("密码必须包含小写字母")
        if not any(c.isdigit() for c in v):
            raise ValueError("密码必须包含数字")
        if not any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in v):
            raise ValueError("密码必须包含特殊字符")
        return v

class UserUpdate(BaseModel):
    display_name: Optional[str] = Field(None, max_length=150)
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    website: Optional[str] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None

class UserInDB(UserBase):
    id: UUID
    email_verified: bool
    two_factor_enabled: bool
    status: str
    created_at: datetime
    updated_at: datetime
    last_login_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class UserPublic(UserInDB):
    """公开的用户信息，不包含敏感字段"""
    pass

class UserWithTokens(UserPublic):
    """包含认证令牌的用户信息"""
    tokens: dict[str, str]
```

### 5. 业务服务层
```python
# src/services/user_service.py
from datetime import datetime, timedelta
from typing import Optional
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from src.models.user import User
from src.schemas.user import UserCreate, UserUpdate, UserInDB
from src.core.security import get_password_hash, verify_password
from src.core.exceptions import (
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
)

class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_by_id(self, user_id: UUID) -> Optional[User]:
        """根据ID获取用户"""
        result = await self.db.execute(
