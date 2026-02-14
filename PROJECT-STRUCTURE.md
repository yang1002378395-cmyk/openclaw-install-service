# AI Content Studio Platform - 项目结构

## 项目概述
这是一个基于 BMAD-METHOD 多代理协作开发的 AI 内容生产平台，包含 UI 设计、视频生成、音效制作、文档解析等核心功能。

## 目录结构

```
ai-content-studio-platform/
├── 📁 docs/                          # 项目文档
│   ├── 📄 PRD.md                    # 产品需求文档
│   ├── 📄 API-SPECIFICATION.md      # API 接口规范
│   ├── 📄 ARCHITECTURE.md           # 系统架构文档
│   ├── 📄 UI-DESIGN-SPEC.md         # UI 设计规范
│   └── 📄 DEPLOYMENT-GUIDE.md       # 部署指南
│
├── 📁 frontend/                     # 前端项目
│   ├── 📁 src/
│   │   ├── 📁 app/                  # Next.js App Router
│   │   │   ├── 📁 (auth)/          # 认证相关页面
│   │   │   ├── 📁 (dashboard)/     # 主工作区页面
│   │   │   ├── 📁 api/             # API Routes
│   │   │   └── 📄 layout.tsx       # 根布局
│   │   │
│   │   ├── 📁 components/          # React 组件
│   │   │   ├── 📁 ui/              # 基础 UI 组件
│   │   │   ├── 📁 ai/              # AI 专用组件
│   │   │   ├── 📁 media/           # 媒体处理组件
│   │   │   └── 📁 layout/          # 布局组件
│   │   │
│   │   ├── 📁 hooks/               # 自定义 Hooks
│   │   │   ├── 📄 useAI.ts         # AI 生成相关
│   │   │   ├── 📄 useMedia.ts      # 媒体处理
│   │   │   └── 📄 useProject.ts    # 项目管理
│   │   │
│   │   ├── 📁 lib/                 # 工具函数和配置
│   │   │   ├── 📁 api/             # API 客户端
│   │   │   ├── 📁 utils/           # 工具函数
│   │   │   └── 📄 constants.ts     # 常量定义
│   │   │
│   │   ├── 📁 stores/              # 状态管理
│   │   │   ├── 📄 auth.store.ts    # 认证状态
│   │   │   ├── 📄 project.store.ts # 项目状态
│   │   │   └── 📄 ui.store.ts      # UI 状态
│   │   │
│   │   ├── 📁 types/               # TypeScript 类型定义
│   │   │   ├── 📄 api.ts           # API 响应类型
│   │   │   ├── 📄 ai.ts            # AI 相关类型
│   │   │   └── 📄 index.ts         # 导出所有类型
│   │   │
│   │   └── 📁 styles/              # 全局样式
│   │       ├── 📄 globals.css      # 全局样式
│   │       └── 📁 themes/          # 主题定义
│   │
│   ├── 📄 package.json             # 依赖配置
│   ├── 📄 tsconfig.json            # TypeScript 配置
│   ├── 📄 tailwind.config.js       # Tailwind 配置
│   ├── 📄 next.config.js           # Next.js 配置
│   └── 📄 README.md                # 前端项目说明
│
├── 📁 backend/                      # 后端项目
│   ├── 📁 src/
│   │   ├── 📁 api/                 # API 路由
│   │   │   ├── 📁 v1/              # API 版本1
│   │   │   │   ├── 📁 auth/        # 认证相关
│   │   │   │   ├── 📁 users/       # 用户管理
│   │   │   │   ├── 📁 projects/    # 项目管理
│   │   │   │   ├── 📁 ai/          # AI 生成
│   │   │   │   ├── 📁 uploads/     # 文件上传
│   │   │   │   └── 📁 billing/     # 计费管理
│   │   │   │
│   │   │   └── 📄 __init__.py
│   │   │
│   │   ├── 📁 core/                # 核心业务逻辑
│   │   │   ├── 📁 models/          # 数据模型
│   │   │   ├── 📁 services/        # 业务服务
│   │   │   ├── 📁 schemas/         # Pydantic 模式
│   │   │   └── 📁 config/          # 配置管理
│   │   │
│   │   ├── 📁 ai/                  # AI 集成模块
│   │   │   ├── 📁 models/          # AI 模型封装
│   │   │   │   ├── 📄 image.py     # 图像生成模型
│   │   │   │   ├── 📄 video.py     # 视频生成模型
│   │   │   │   ├── 📄 audio.py     # 音频生成模型
│   │   │   │   └── 📄 document.py  # 文档解析模型
│   │   │   │
│   │   │   ├── 📁 routers/         # AI 路由
│   │   │   ├── 📁 tasks/           # 异步任务
│   │   │   └── 📁 utils/           # AI 工具函数
│   │   │
│   │   ├── 📁 database/            # 数据库相关
│   │   │   ├── 📄 models.py        # SQLAlchemy 模型
│   │   │   ├── 📄 session.py       # 数据库会话
│   │   │   └── 📄 migrations/      # 数据库迁移
│   │   │
│   │   ├── 📁 middleware/          # 中间件
│   │   │   ├── 📄 auth.py          # 认证中间件
│   │   │   ├── 📄 logging.py       # 日志中间件
│   │   │   └── 📄 rate_limit.py    # 速率限制
│   │   │
│   │   └── 📁 utils/               # 工具函数
│   │       ├── 📄 security.py      # 安全相关
│   │       ├── 📄 file_utils.py    # 文件处理
│   │       └── 📄 validation.py    # 数据验证
│   │
│   ├── 📄 requirements.txt         # Python 依赖
│   ├── 📄 Dockerfile               # Docker 配置
│   ├── 📄 docker-compose.yml       # Docker Compose
│   ├── 📄 alembic.ini              # 数据库迁移配置
│   └── 📄 README.md                # 后端项目说明
│
├── 📁 ai-services/                  # AI 服务独立部署
│   ├── 📁 image-generation/        # 图像生成服务
│   ├── 📁 video-generation/        # 视频生成服务
│   ├── 📁 audio-generation/        # 音频生成服务
│   └── 📁 document-parsing/        # 文档解析服务
│
├── 📁 infrastructure/               # 基础设施
│   ├── 📁 kubernetes/              # K8s 部署配置
│   │   ├── 📁 namespaces/          # 命名空间
│   │   ├── 📁 deployments/         # 部署配置
│   │   ├── 📁 services/            # 服务配置
│   │   ├── 📁 configmaps/          # 配置映射
│   │   └── 📁 secrets/             # 密钥管理
│   │
│   ├── 📁 terraform/               # Terraform 配置
│   │   ├── 📁 modules/             # 可复用模块
│   │   ├── 📁 environments/        # 环境配置
│   │   │   ├── 📁 dev/             # 开发环境
│   │   │   ├── 📁 staging/         # 测试环境
│   │   │   └── 📁 prod/            # 生产环境
│   │   │
│   │   └── 📄 main.tf              # 主配置文件
│   │
│   └── 📁 monitoring/              # 监控配置
│       ├── 📁 prometheus/          # Prometheus 配置
│       ├── 📁 grafana/             # Grafana 仪表板
│       └── 📁 alertmanager/        # 告警配置
│
├── 📁 scripts/                      # 脚本文件
│   ├── 📄 setup-dev.sh             # 开发环境设置
│   ├── 📄 deploy.sh                # 部署脚本
│   ├── 📄 backup.sh                # 备份脚本
│   └── 📄 test-all.sh              # 测试脚本
│
├── 📁 tests/                        # 测试文件
│   ├── 📁 unit/                    # 单元测试
│   ├── 📁 integration/             # 集成测试
│   ├── 📁 e2e/                     # 端到端测试
│   └── 📁 performance/             # 性能测试
│
├── 📁 .github/                      # GitHub 配置
│   ├── 📁 workflows/               # GitHub Actions
│   │   ├── 📄 ci.yml               # CI 流水线
│   │   ├── 📄 cd.yml               # CD 流水线
│   │   └── 📄 security-scan.yml    # 安全扫描
│   │
│   └── 📄 CODEOWNERS               # 代码负责人
│
├── 📄 .env.example                  # 环境变量示例
├── 📄 .gitignore                    # Git 忽略文件
├── 📄 docker-compose.override.yml   # Docker Compose 覆盖
├── 📄 Makefile                      # Make 命令
└── 📄 README.md                     # 项目总说明
```

## 技术栈详情

### 前端技术栈
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript 5+
- **样式**: Tailwind CSS 3 + CSS Modules
- **状态管理**: Zustand + React Query
- **UI 组件**: shadcn/ui + Radix UI
- **图表**: Recharts
- **测试**: Vitest + React Testing Library + Playwright
- **构建工具**: Vite/Turbopack
- **包管理**: pnpm

### 后端技术栈
- **框架**: FastAPI (Python)
- **数据库**: PostgreSQL 15
- **缓存**: Redis 7
- **消息队列**: RabbitMQ/Celery
- **对象存储**: AWS S3/MinIO
- **ORM**: SQLAlchemy 2.0
- **迁移工具**: Alembic
- **API 文档**: OpenAPI 3.0 + Swagger UI

### AI 服务技术栈
- **图像生成**: Stable Diffusion 3, DALL-E 3
- **视频生成**: Runway Gen-2, Stable Video Diffusion
- **音频生成**: MusicGen, AudioLDM 2, ElevenLabs
- **文档解析**: GPT-4 Vision, Claude 3
- **向量数据库**: Pinecone/Weaviate (可选)

### 基础设施
- **容器化**: Docker + Docker Compose
- **编排**: Kubernetes
- **云服务**: AWS/GCP/Azure
- **CI/CD**: GitHub Actions
- **监控**: Prometheus + Grafana + ELK Stack
- **日志**: Loki + Grafana
- **追踪**: Jaeger

## 开发环境设置

### 1. 克隆项目
```bash
git clone https://github.com/your-org/ai-content-studio-platform.git
cd ai-content-studio-platform
```

### 2. 环境变量配置
```bash
cp .env.example .env
# 编辑 .env 文件，填入必要的配置
```

### 3. 启动开发环境
```bash
# 使用 Docker Compose
docker-compose up -d

# 或使用 Makefile
make dev
```

### 4. 访问服务
- 前端: http://localhost:3000
- 后端 API: http://localhost:8000
- API 文档: http://localhost:8000/docs
- 数据库管理: http://localhost:8080 (pgAdmin)

## 开发工作流

### 1. 功能开发流程
```
1. 从 main 分支创建功能分支
2. 开发功能并编写测试
3. 提交代码并推送到远程
4. 创建 Pull Request
5. 代码审查和 CI 测试
6. 合并到开发分支
7. 部署到测试环境
8. 用户验收测试
9. 合并到主分支
10. 生产环境部署
```

### 2. 提交规范
使用 Conventional Commits 规范：
```
feat: 添加新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具
```

### 3. 代码审查 Checklist
- [ ] 代码符合编码规范
- [ ] 有适当的测试覆盖
- [ ] 文档已更新
- [ ] 性能影响已评估
- [ ] 安全考虑已包含
- [ ] 向后兼容性已考虑

## 部署架构

### 开发环境
- 单节点 Docker Compose
- 本地数据库和缓存
- 开发用 AI 模型（轻量级）

### 测试环境
- Kubernetes 集群
- 独立的命名空间
- 完整的服务部署
- 自动化测试套件

### 生产环境
- 多区域 Kubernetes 集群
- 高可用架构
- CDN 加速
- 监控和告警
- 备份和灾难恢复

## 监控和运维

### 监控指标
1. **应用性能**
   - API 响应时间
   - 错误率
   - 请求吞吐量
   - 资源使用率

2. **业务指标**
   - 用户活跃度
   - AI 生成成功率
   - 用户满意度
   - 收入指标

3. **基础设施**
   - 服务器负载
   - 网络流量
   - 存储使用
   - 数据库性能

### 告警规则
- API 错误率 > 1%
- 响应时间 P95 > 500ms
- 服务器 CPU > 80%
- 内存使用 > 85%
- 磁盘空间 < 20%

## 安全考虑

### 1. 数据安全
- 传输层加密 (TLS 1.3)
- 静态数据加密
- 敏感信息脱敏
- 定期安全审计

### 2. 访问控制
- 基于角色的访问控制 (RBAC)
- 最小权限原则
- API 速率限制
- IP 白名单

### 3. 内容安全
- AI 生成内容审核
- 用户上传文件扫描
- 版权检测
- 不当内容过滤

## 项目路线图

### Phase 1: MVP (1-2个月)
- [ ] 基础用户系统
- [ ] AI 原画生成
- [ ] 文档解析
- [ ] 响应式 Web 界面

### Phase 2: 功能扩展 (3-4个月)
- [ ] AI 视频生成
- [ ] AI 音效生成
- [ ] 高级设计功能
- [ ] 团队协作

### Phase 3: 平台完善 (5-6个月)
- [ ] 多模态内容融合
- [ ] 智能工作流
- [ ] 开放平台 API
- [ ] 企业级功能

## 贡献指南

1. Fork 项目仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证
本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式
- 项目负责人: [负责人姓名]
- 技术负责人: [技术负责人姓名]
- 问题反馈: [GitHub Issues](https://github.com/your-org/ai-content-studio-platform/issues)
- 文档: [项目 Wiki](https://github.com/your-org/ai-content-studio-platform/wiki)

---

**最后更新**: 2026年2月14日  
**版本**: 1.0.0-beta  
**状态**: 开发中