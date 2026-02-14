# AI 内容生产平台 - 开发环境配置

## 环境要求

### 基础软件要求:
```bash
# 版本要求
Node.js >= 18.0.0
Python >= 3.11
Docker >= 24.0
Docker Compose >= 2.20
Git >= 2.40

# 推荐版本
Node.js 20.11.0 LTS
Python 3.11.8
Docker 25.0.3
```

### 开发工具:
```bash
# 代码编辑器
Visual Studio Code (推荐)
  - 扩展: ESLint, Prettier, Python, Docker
  - 扩展: GitLens, Thunder Client (API测试)

# 数据库工具
DBeaver 或 TablePlus
pgAdmin 4 (PostgreSQL管理)

# API 测试
Postman 或 Insomnia
Thunder Client (VSCode扩展)

# 设计工具
Figma (UI设计)
Excalidraw (架构图)
```

## 环境设置脚本

### 1. 基础环境检查脚本 (`check-env.sh`):
```bash
#!/bin/bash

echo "🔍 检查开发环境..."

# 检查 Node.js
if command -v node &> /dev/null; then
    node_version=$(node --version)
    echo "✅ Node.js: $node_version"
else
    echo "❌ Node.js 未安装"
    exit 1
fi

# 检查 Python
if command -v python3 &> /dev/null; then
    python_version=$(python3 --version)
    echo "✅ Python: $python_version"
else
    echo "❌ Python 3 未安装"
    exit 1
fi

# 检查 Docker
if command -v docker &> /dev/null; then
    docker_version=$(docker --version)
    echo "✅ Docker: $docker_version"
else
    echo "❌ Docker 未安装"
    exit 1
fi

# 检查 Docker Compose
if command -v docker-compose &> /dev/null; then
    docker_compose_version=$(docker-compose --version)
    echo "✅ Docker Compose: $docker_compose_version"
else
    echo "❌ Docker Compose 未安装"
    exit 1
fi

# 检查 Git
if command -v git &> /dev/null; then
    git_version=$(git --version)
    echo "✅ Git: $git_version"
else
    echo "❌ Git 未安装"
    exit 1
fi

echo "🎉 所有基础环境检查通过！"
```

### 2. 项目初始化脚本 (`init-project.sh`):
```bash
#!/bin/bash

echo "🚀 初始化 AI 内容生产平台项目..."

# 创建项目目录结构
mkdir -p ai-content-platform/{frontend,backend,ai-services,infrastructure,scripts,tests,docs}

# 前端项目初始化
cd ai-content-platform/frontend
npm create next-app@latest . --typescript --tailwind --app --no-eslint --import-alias "@/*" --no-src-dir --no-experimental-app
cd ..

# 后端项目初始化
cd backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn sqlalchemy alembic pydantic python-jose passlib bcrypt python-multipart
cd ..

# 创建环境变量文件
cat > .env.example << EOF
# 数据库配置
POSTGRES_DB=ai_content_platform
POSTGRES_USER=admin
POSTGRES_PASSWORD=secure_password_123
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT 配置
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI API 密钥
ADOBE_FIREFLY_API_KEY=your_adobe_firefly_api_key
OPENAI_API_KEY=your_openai_api_key
RUNWAY_API_KEY=your_runway_api_key
UDIO_API_KEY=your_udio_api_key

# 存储配置
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=ai-content-platform
AWS_REGION=us-east-1

# 应用配置
APP_ENV=development
APP_DEBUG=true
APP_HOST=0.0.0.0
APP_PORT=8000
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
EOF

echo "📋 复制环境变量文件"
cp .env.example .env

# 创建 Docker Compose 配置
cat > docker-compose.yml << EOF
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: \${POSTGRES_DB}
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - APP_ENV=\${APP_ENV}
      - APP_DEBUG=\${APP_DEBUG}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./backend:/app
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev

volumes:
  postgres_data:
  redis_data:
EOF

# 创建后端 Dockerfile
cat > backend/Dockerfile << EOF
FROM python:3.11-slim

WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# 复制依赖文件
COPY requirements.txt .

# 安装 Python 依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF

# 创建前端 Dockerfile
cat > frontend/Dockerfile << EOF
FROM node:20-alpine

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["npm", "start"]
EOF

echo "🎉 项目初始化完成！"
echo "📁 项目结构已创建"
echo "🐳 Docker Compose 配置已生成"
echo "🔧 运行以下命令启动开发环境："
echo "   docker-compose up -d"
```

### 3. 开发工作流脚本 (`dev-workflow.sh`):
```bash
#!/bin/bash

case "$1" in
    start)
        echo "🚀 启动开发环境..."
        docker-compose up -d
        echo "✅ 开发环境已启动"
        echo "🌐 前端: http://localhost:3000"
        echo "🔧 后端 API: http://localhost:8000"
        echo "📚 API 文档: http://localhost:8000/docs"
        ;;
    
    stop)
        echo "🛑 停止开发环境..."
        docker-compose down
        echo "✅ 开发环境已停止"
        ;;
    
    restart)
        echo "🔄 重启开发环境..."
        docker-compose restart
        echo "✅ 开发环境已重启"
        ;;
    
    logs)
        echo "📋 查看日志..."
        docker-compose logs -f
        ;;
    
    status)
        echo "📊 服务状态..."
        docker-compose ps
        ;;
    
    migrate)
        echo "🗄️ 运行数据库迁移..."
        docker-compose exec backend alembic upgrade head
        echo "✅ 数据库迁移完成"
        ;;
    
    test)
        echo "🧪 运行测试..."
        docker-compose exec backend pytest
        docker-compose exec frontend npm test
        echo "✅ 测试完成"
        ;;
    
    clean)
        echo "🧹 清理环境..."
        docker-compose down -v
        docker system prune -f
        echo "✅ 环境清理完成"
        ;;
    
    *)
        echo "使用方法: $0 {start|stop|restart|logs|status|migrate|test|clean}"
        exit 1
        ;;
esac
```

## VS Code 配置

### 工作区设置 (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "javascript.preferences.importModuleSpecifier": "non-relative",
  "files.exclude": {
    "**/node_modules": true,
    "**/.next": true,
    "**/venv": true,
    "**/__pycache__": true
  },
  "python.defaultInterpreterPath": "./backend/venv/bin/python",
  "python.analysis.autoImportCompletions": true,
  "python.analysis.typeCheckingMode": "basic",
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.wordWrap": "on"
  }
}
```

### 扩展推荐 (`.vscode/extensions.json`):
```json
{
  "recommendations": [
    "ms-python.python",
    "ms-python.black-formatter",
    "ms-python.isort",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-azuretools.vscode-docker",
    "github.vscode-pull-request-github",
    "humao.rest-client",
    "ms-vscode.vscode-typescript-next",
    "oderwat.indent-rainbow",
    "usernamehw.errorlens",
    "wix.vscode-import-cost"
  ]
}
```

## Git 配置

### `.gitignore` 文件:
```gitignore
# 依赖目录
node_modules/
venv/
__pycache__/
*.pyc
*.pyo
*.pyd
.Python

# 环境变量
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# 构建输出
.next/
dist/
build/
out/

# 日志
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# 运行时数据
*.pid
*.seed
*.pid.lock

# 覆盖率目录
coverage/
.nyc_output/

# 编辑器目录
.vscode/
.idea/
*.swp
*.swo

# 系统文件
.DS_Store
Thumbs.db

# 测试快照
__snapshots__/

# 临时文件
tmp/
temp/
```

### Git Hooks 配置 (`.husky/`):
```bash
#!/bin/bash
# pre-commit hook

# 运行代码检查
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ ESLint 检查失败，请修复错误后再提交"
  exit 1
fi

# 运行类型检查
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ TypeScript 类型检查失败"
  exit 1
fi

# 运行测试
npm test -- --passWithNoTests
if [ $? -ne 0 ]; then
  echo "❌ 测试失败，请修复测试后再提交"
  exit 1
fi

echo "✅ 所有检查通过，可以提交"
```

## 开发规范

### 代码提交规范:
```bash
# 提交类型
feat:     新功能
fix:      修复 bug
docs:     文档更新
style:    代码格式调整
refactor: 代码重构
test:     测试相关
chore:    构建过程或辅助工具
perf:     性能优化
ci:       持续集成
build:    构建系统
revert:   回滚提交

# 示例
git commit -m "feat: 添加 AI 图像生成功能"
git commit -m "fix: 修复视频生成 API 超时问题"
git commit -m "docs: 更新 API 接口文档"
```

### 分支管理策略:
```
main
  ├── develop
  │   ├── feature/ui-design
  │   ├── feature/ai-integration
  │   ├── feature/backend-api
  │   └── hotfix/login-issue
  └── release/v1.0.0
```

## 监控和调试

### 后端监控端点:
```python
# health check
GET /health

# metrics (Prometheus格式)
GET /metrics

# 性能监控
GET /debug/performance

# 内存使用
GET /debug/memory
```

### 前端监控:
```javascript
// 错误监控
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: process.env.NODE_ENV,
});

// 性能监控
import { getCLS, getFID, getLCP } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

## 快速开始

### 1. 克隆项目:
```bash
git clone https://github.com/your-org/ai-content-platform.git
cd ai-content-platform
```

### 2. 设置环境:
```bash
chmod +x scripts/*.sh
./scripts/check-env.sh
./scripts/init-project.sh
```

### 3. 配置 AI API 密钥:
```bash
# 编辑 .env 文件，填入你的 API 密钥
vim .env
```

###