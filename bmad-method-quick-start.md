# BMAD 方法快速入门指南

## 第一步：环境准备

### 1.1 检查项目结构
确保 `bmad-method` 文件夹已复制到项目中：
```bash
ls -la bmad-method/
```

### 1.2 查看核心配置
```bash
cat bmad-method/_bmad/core/config.yaml
```

## 第二步：启动 BMAD Master

### 2.1 加载 BMAD Master 代理
使用以下命令启动主代理：
```
/agent bmad-master
```

### 2.2 初始问候
BMAD Master 会：
1. 加载配置文件
2. 显示欢迎信息
3. 列出可用菜单选项

## 第三步：探索功能

### 3.1 基本命令
- **`[MH]`**: 重新显示菜单帮助
- **`[CH]`**: 与代理聊天（任何话题）
- **`[LT]`**: 列出所有可用任务
- **`[LW]`**: 列出所有工作流
- **`[PM]`**: 启动 Party Mode（多代理对话）
- **`[DA]`**: 退出代理

### 3.2 获取帮助
在任何时候输入：
```
/bmad-help
```
可以获取下一步建议，例如：
```
/bmad-help 我有一个关于产品设计的想法
```

## 第四步：体验核心功能

### 4.1 Party Mode（推荐首先尝试）
输入 `[PM]` 或 "party mode" 启动多代理对话。

**体验流程：**
1. 代理加载和介绍
2. 选择讨论话题
3. 观察多代理自然对话
4. 使用 `*exit` 退出

### 4.2 Brainstorming 工作流
输入 "brainstorming" 启动创意会话。

**特点：**
- 多种创意技术
- 结构化头脑风暴
- 想法组织和记录

### 4.3 独立任务
使用 `[LT]` 查看所有任务，包括：
- 编辑审查
- 文档索引
- 文档分片
- 对抗性审查

## 第五步：配置定制

### 5.1 修改配置文件
编辑 `bmad-method/_bmad/core/config.yaml`：
```yaml
user_name: 你的名字
communication_language: chinese  # 沟通语言
document_output_language: chinese  # 文档输出语言
output_folder: "{project-root}/_bmad-output"  # 输出目录
```

### 5.2 添加自定义代理
1. 在 `_bmad/core/agents/` 创建代理文件
2. 更新 `_bmad/_config/agent-manifest.csv`
3. 重启 BMAD Master

## 第六步：高级使用

### 6.1 工作流开发
1. 在 `_bmad/core/workflows/` 创建新工作流
2. 使用微文件架构（每个步骤独立）
3. 更新工作流清单

### 6.2 任务集成
1. 创建独立任务文件
2. 注册到任务清单
3. 可以从工作流或直接调用

### 6.3 模块扩展
1. 创建新模块目录
2. 添加模块配置
3. 更新主清单

## 常见问题

### Q1: 如何知道当前可用的功能？
A: 使用 `[MH]` 查看菜单，或 `[LT]`/`[LW]` 查看详细清单。

### Q2: 如何退出当前模式？
A: 大多数模式支持 `*exit`、`goodbye` 等退出命令。

### Q3: 输出文件在哪里？
A: 默认在 `_bmad-output/` 目录，可在配置中修改。

### Q4: 如何获取上下文相关的帮助？
A: 使用 `/bmad-help [你的问题]` 格式。

### Q5: 代理不响应怎么办？
A: 确保使用正确的命令格式，或尝试 `[MH]` 重新显示菜单。

## 最佳实践

### 1. 会话管理
- 每个工作流在独立上下文中运行
- 使用新鲜上下文窗口避免污染
- 及时保存重要输出

### 2. 文档组织
- 定期查看输出目录
- 使用文档索引任务整理文件
- 保持项目知识更新

### 3. 代理协作
- Party Mode 适合复杂决策
- 选择合适的代理组合
- 允许代理自然互动

### 4. 创意工作
- Brainstorming 追求数量而非质量
- 使用多种创意技术
- 延迟判断和组织

## 学习路径建议

### 初学者（第1天）
1. 启动 BMAD Master
2. 体验 Party Mode
3. 尝试基本命令

### 中级用户（第2-3天）
1. 探索所有工作流
2. 使用独立任务
3. 定制配置文件

### 高级用户（第4-7天）
1. 创建自定义代理
2. 开发新工作流
3. 扩展模块功能

## 资源参考

### 核心文件
- `bmad-method/_bmad/core/config.yaml` - 主配置
- `bmad-method/_bmad/core/agents/bmad-master.md` - 主代理定义
- `bmad-method/_bmad/_config/` - 所有清单文件

### 工作流示例
- `bmad-method/_bmad/core/workflows/party-mode/` - 多代理对话
- `bmad-method/_bmad/core/workflows/brainstorming/` - 创意工作流

### 任务示例
- `bmad-method/_bmad/core/tasks/` - 各种独立任务

---

**提示**: BMAD 方法的核心价值在于其结构化的工作流和多代理协作能力。建议从 Party Mode 开始体验，逐步探索其他功能。