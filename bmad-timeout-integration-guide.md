# BMAD 超时模块集成指南

## 🎯 概述
本指南介绍如何将超时测试与恢复模块集成到BMAD框架中，解决工作流卡住问题。

## 📦 安装步骤

### 1. 复制超时模块文件
```bash
# 创建超时模块目录
mkdir -p bmad-method/_bmad/modules/timeout

# 复制核心文件
cp bmad-timeout-module.md bmad-method/_bmad/modules/timeout/
cp bmad-timeout-test.js bmad-method/_bmad/modules/timeout/
cp timeout-handler.js bmad-method/_bmad/modules/timeout/

# 复制配置文件
cp bmad-method/timeout-test-integration.md bmad-method/_bmad/config/timeout-config.yaml
```

### 2. 更新BMAD配置
```bash
# 编辑核心配置文件
echo "
# 超时模块配置
timeout_module:
  enabled: true
  mode: monitoring  # monitoring|testing|enforcement
  config_path: _bmad/config/timeout-config.yaml
" >> bmad-method/_bmad/core/config.yaml
```

### 3. 安装依赖
```bash
# 创建package.json（如果不存在）
cd bmad-method
npm init -y

# 添加超时监控依赖
npm install node-cron chalk figlet
```

## 🔧 配置说明

### 基本配置 (timeout-config.yaml)
```yaml
# 启用状态
enabled: true

# 运行模式
mode: "monitoring"  # 可选: monitoring, testing, enforcement

# 代理超时设置
agent_timeouts:
  task_execution:
    warning: "5m"    # 5分钟警告
    critical: "15m"  # 15分钟严重
    restart: "30m"   # 30分钟重启
  
  response_waiting:
    warning: "2m"
    critical: "5m"

# 工作流超时设置
workflow_timeouts:
  phase_completion:
    warning_multiplier: 1.5  # 预计时间1.5倍警告
    critical_multiplier: 2.0 # 预计时间2倍严重
```

### 恢复策略配置
```yaml
recovery_strategies:
  - name: "task_reassignment"
    priority: 1
    trigger: "agent_unresponsive"
    action: "reassign_to_backup"
    params:
      backup_agents: ["backup-ux", "backend-arch"]
  
  - name: "resource_boost"
    priority: 2
    trigger: "slow_progress"
    action: "increase_resources"
    params:
      cpu_boost: 20%
      memory_boost: 25%
  
  - name: "workflow_skip"
    priority: 3
    trigger: "blocked_dependency"
    action: "skip_to_next"
    params:
      skip_validation: true
      add_to_backlog: true
```

### 通知配置
```yaml
notifications:
  channels:
    - name: "console"
      level: "all"
    
    - name: "log_file"
      level: "warning+"
      path: "logs/timeout-alerts.log"
    
    - name: "dashboard"
      level: "critical+"
      url: "http://localhost:3000/alerts"
  
  escalation:
    - level: "warning"
      repeat_count: 3
      escalate_to: "critical"
      cooldown: "10m"
    
    - level: "critical"
      repeat_count: 2
      escalate_to: "emergency"
      cooldown: "5m"
```

## 🚀 集成到工作流

### 1. Party Mode 集成
```yaml
# 在party-mode工作流中添加超时配置
party_mode:
  timeout_config:
    conversation:
      turn_timeout: "2m"
      response_timeout: "1m"
      discussion_timeout: "30m"
    
    recovery:
      - action: "gentle_nudge"
        trigger: "turn_timeout"
        message: "请继续发言..."
      
      - action: "summarize_and_move"
        trigger: "discussion_stalled"
        message: "基于讨论，我们决定..."
```

### 2. Workflow 集成
```yaml
# 在工作流阶段中添加超时检查
workflow:
  phases:
    - name: "需求分析"
      timeout: "1h"
      checkpoints:
        - name: "需求收集"
          timeout: "20m"
          recovery: "skip_with_assumptions"
        
        - name: "优先级排序"
          timeout: "15m"
          recovery: "auto_prioritize"
    
    - name: "设计阶段"
      timeout: "2h"
      dependencies:
        - phase: "需求分析"
          timeout: "10m"
          recovery: "proceed_without"
```

### 3. 代理配置集成
```yaml
# 在代理配置中添加超时设置
agent:
  id: "ux-designer"
  timeout_config:
    tasks:
      design_system:
        timeout: "45m"
        recovery: "simplify_requirements"
      
      page_design:
        timeout: "1.5h"
        recovery: "focus_on_core_pages"
    
    health_checks:
      interval: "5m"
      timeout: "30s"
      retries: 3
```

## 🧪 测试套件

### 运行测试
```bash
# 运行所有超时测试
node bmad-method/_bmad/modules/timeout/bmad-timeout-test.js

# 运行特定测试模式
node bmad-method/_bmad/modules/timeout/bmad-timeout-test.js test
node bmad-method/_bmad/modules/timeout/bmad-timeout-test.js monitor
node bmad-method/_bmad/modules/timeout/bmad-timeout-test.js report
```

### 测试场景
```javascript
// 手动触发测试场景
const tester = require('./bmad-timeout-test.js');

// 1. 单代理超时测试
tester.testAgentTimeout();

// 2. 工作流停滞测试
tester.testWorkflowStall();

// 3. 级联故障测试
tester.testCascadingFailure();

// 4. 恢复机制测试
tester.testRecoveryMechanism();
```

### 自动化测试计划
```yaml
# 自动化测试配置
auto_testing:
  schedule:
    - time: "02:00"
      test: "agent_timeout"
      frequency: "daily"
    
    - time: "sunday 03:00"
      test: "workflow_stall"
      frequency: "weekly"
    
    - time: "first day of month 04:00"
      test: "cascading_failure"
      frequency: "monthly"
  
  notifications:
    success: "log_only"
    failure: "alert_channel"
```

## 📊 监控与报告

### 实时监控
```bash
# 启动监控模式
node bmad-method/_bmad/modules/timeout/bmad-timeout-test.js monitor

# 监控输出示例
# 👁️ 启动BMAD超时监控...
# ✅ 系统状态正常
# ⚠️  ux-designer: 6分钟无响应
# 🔄  执行恢复: task_reassignment
# ✅  恢复成功: 任务重新分配给 backup-ux
```

### 监控仪表板
```html
<!-- 简单的监控页面 -->
<!DOCTYPE html>
<html>
<head>
    <title>BMAD超时监控</title>
    <style>
        .status-card { padding: 20px; margin: 10px; border-radius: 8px; }
        .healthy { background: #d1fae5; }
        .warning { background: #fef3c7; }
        .critical { background: #fee2e2; }
    </style>
</head>
<body>
    <h1>BMAD超时监控仪表板</h1>
    <div id="status-cards"></div>
    
    <script>
        // 实时更新状态
        setInterval(() => {
            fetch('/api/timeout-status')
                .then(r => r.json())
                .then(updateDashboard);
        }, 5000);
    </script>
</body>
</html>
```

### 报告生成
```bash
# 生成测试报告
node bmad-method/_bmad/modules/timeout/bmad-timeout-test.js report

# 报告文件: bmad-timeout-test-report.json
# 包含: 测试结果、性能指标、建议改进
```

## 🛠️ 故障排除

### 常见问题

#### 1. 模块未加载
```bash
# 检查配置
cat bmad-method/_bmad/core/config.yaml | grep timeout

# 启用模块
echo "timeout_module: { enabled: true }" >> bmad-method/_bmad/core/config.yaml
```

#### 2. 测试失败
```bash
# 检查依赖
npm list node-cron chalk figlet

# 安装缺失依赖
npm install node-cron chalk figlet
```

#### 3. 监控无数据
```bash
# 检查日志
tail -f logs/timeout-alerts.log

# 检查权限
chmod +x bmad-method/_bmad/modules/timeout/bmad-timeout-test.js
```

#### 4. 恢复策略不生效
```yaml
# 检查恢复策略配置
recovery_strategies:
  - name: "task_reassignment"
    priority: 1
    trigger: "agent_unresponsive"
    # 确保有备份代理
    params:
      backup_agents: ["backup-ux", "backend-arch"]
```

### 调试模式
```bash
# 启用详细日志
export BMAD_TIMEOUT_DEBUG=true
node bmad-timeout-test.js test

# 查看调试输出
# 🔍 检测到超时: ux-designer (任务: design-system)
# 🔍 选择恢复策略: task_reassignment
# 🔍 执行恢复: 重新分配给 backup-ux
# 🔍 恢复结果: 成功 (耗时: 2.3秒)
```

## 📈 性能优化

### 监控优化
```yaml
performance:
  monitoring_interval: "60s"  # 监控间隔
  data_retention: "7d"       # 数据保留
  alert_cooldown: "5m"       # 警报冷却
  batch_processing: true     # 批量处理
```

### 资源优化
```yaml
resource_limits:
  max_concurrent_monitors: 10
  memory_limit: "512MB"
  cpu_limit: "50%"
  log_rotation: "daily"
```

### 缓存策略
```yaml
caching:
  enabled: true
  agent_status_ttl: "5m"
  workflow_state_ttl: "10m"
  recovery_history_ttl: "1h"
```

## 🔄 升级与维护

### 版本升级
```bash
# 备份当前配置
cp bmad-method/_bmad/config/timeout-config.yaml timeout-config-backup.yaml

# 更新模块文件
cp new-bmad-timeout-module.md bmad-method/_bmad/modules/timeout/

# 测试升级
node bmad-timeout-test.js test

# 如果测试通过，启用新版本
```

### 定期维护
```bash
# 1. 清理旧日志
find logs/ -name "*.log" -mtime +30 -delete

# 2. 压缩历史数据
tar -czf timeout-data-$(date +%Y%m%d).tar.gz bmad-monitoring-data.json

# 3. 更新依赖
cd bmad-method && npm update

# 4. 运行完整性检查
node bmad-timeout-test.js test
```

## 🎯 最佳实践

### 1. 渐进式部署
```yaml
deployment_phases:
  phase1:  # 仅监控
    scope: ["ux-designer", "frontend-dev"]
    actions: ["monitor", "alert"]
  
  phase2:  # 测试恢复
    scope: ["backend-arch", "ai-integration"]
    actions: ["monitor", "test_recovery"]
  
  phase3:  # 全面启用
    scope: "all"
    actions: ["monitor", "auto_recovery"]
```

### 2. 阈值调优
```yaml
# 根据实际表现调整阈值
threshold_tuning:
  initial:  # 初始设置
    agent_warning: "5m"
    agent_critical: "15m"
  
  optimized:  # 优化后
    agent_warning: "3m"
    agent_critical: "10m"
    workflow_warning: "1.2x"  # 1.2倍预计时间
```

### 3. 团队培训
```markdown
# 培训材料
## 超时模块使用指南

### 识别问题:
- 代理无响应 > 3分钟 → 警告
- 工作流阶段超时 > 1.5倍 → 严重
- 多个代理同时超时 → 紧急

### 处理流程:
1. 查看监控仪表板
2. 检查警报详情
3. 评估自动恢复结果
4. 必要时手动干预

### 报告问题:
- 提供超时事件ID
- 附上相关日志
- 描述影响范围
```

## 📞 支持与反馈

### 获取帮助
```bash
# 查看帮助文档
node bmad-timeout-test.js --help

# 查看配置示例
cat bmad-method/_bmad/config/timeout-config.yaml

# 查看日志
tail -f logs/timeout-alerts.log
```

### 报告问题
```markdown
问题报告模板:
## 问题描述
- 发生时间: 
- 影响范围: 
- 错误信息: 

## 环境信息
- BMAD版本: 
- 超时模块版本: 
- 节点版本: 

## 复现步骤
1. 
2. 
3. 

## 期望行为
```

### 贡献指南
```markdown
## 如何贡献
1. Fork仓库
2. 创建功能分支
3. 添加测试用例
4. 提交Pull Request

## 代码规范
- 使用ES6+语法
- 添加JSDoc注释
- 包含单元测试
- 更新文档
```

---

**集成状态**: ✅ 已完成  
**测试状态**: 🟢 通过  
**监控状态**: 👁️ 运行中  
**最后更新**: 2026-02-14T22:40:00+08:00