# BMAD 超时测试与恢复模块

## 概述
BMAD超时测试模块为多代理协作系统提供智能超时检测、自动恢复和流程优化功能，解决工作流卡住问题，确保项目持续高效推进。

## 模块架构

### 1. 超时检测层级
```
BMAD超时系统
├── 代理级别超时 (Agent-Level Timeout)
│   ├── 任务执行超时
│   ├── 响应等待超时
│   └── 资源占用超时
├── 工作流级别超时 (Workflow-Level Timeout)
│   ├── 阶段完成超时
│   ├── 里程碑超时
│   └── 依赖等待超时
├── 系统级别超时 (System-Level Timeout)
│   ├── 资源耗尽检测
│   ├── 死锁检测
│   └── 性能降级检测
└── 项目级别超时 (Project-Level Timeout)
    ├── 整体进度超时
    ├── 交付物延迟
    └── 风险升级超时
```

### 2. BMAD超时配置格式
```yaml
# bmad-timeout-config.yaml
timeout_config:
  version: "1.0.0"
  enabled: true
  
  # 代理级别配置
  agent_level:
    task_execution:
      warning_threshold: "5m"      # 5分钟警告
      critical_threshold: "15m"    # 15分钟严重
      restart_threshold: "30m"     # 30分钟重启
    response_waiting:
      warning_threshold: "2m"
      critical_threshold: "5m"
    resource_usage:
      cpu_warning: 80%            # CPU使用率警告
      memory_warning: 85%         # 内存使用率警告
  
  # 工作流级别配置  
  workflow_level:
    phase_completion:
      warning_multiplier: 1.5     # 预计时间1.5倍警告
      critical_multiplier: 2.0    # 预计时间2倍严重
    milestone_check:
      interval: "10m"             # 里程碑检查间隔
      grace_period: "5m"          # 宽限期
    
  # 恢复策略
  recovery_strategies:
    - name: "task_reassignment"
      priority: 1
      conditions: ["agent_unresponsive", "task_timeout"]
    - name: "resource_reallocation"
      priority: 2  
      conditions: ["resource_exhausted", "performance_degraded"]
    - name: "workflow_restart"
      priority: 3
      conditions: ["deadlock_detected", "multiple_failures"]
    - name: "graceful_degradation"
      priority: 4
      conditions: ["system_overload", "critical_path_blocked"]
    
  # 通知配置
  notifications:
    channels: ["log", "dashboard", "alert"]
    escalation:
      - level: "warning"
        channels: ["log", "dashboard"]
      - level: "critical"
        channels: ["log", "dashboard", "alert"]
      - level: "emergency"
        channels: ["all"]
```

## 核心组件

### 1. BMAD超时检测器 (Timeout Detector)
```python
class BMADTimeoutDetector:
    """BMAD超时检测器"""
    
    def __init__(self, config):
        self.config = config
        self.monitors = {
            'agent': AgentTimeoutMonitor(),
            'workflow': WorkflowTimeoutMonitor(),
            'system': SystemTimeoutMonitor()
        }
        self.history = TimeoutHistory()
        
    def monitor_agent(self, agent_id, task):
        """监控代理任务执行"""
        monitor = self.monitors['agent']
        return monitor.track_agent(agent_id, task)
    
    def monitor_workflow(self, workflow_id, phase):
        """监控工作流阶段进度"""
        monitor = self.monitors['workflow']
        return monitor.track_workflow(workflow_id, phase)
    
    def check_system_health(self):
        """检查系统健康状态"""
        monitor = self.monitors['system']
        return monitor.check_health()
    
    def detect_timeouts(self):
        """检测所有超时情况"""
        timeouts = []
        
        # 检查代理超时
        agent_timeouts = self.monitors['agent'].check_timeouts()
        timeouts.extend(agent_timeouts)
        
        # 检查工作流超时
        workflow_timeouts = self.monitors['workflow'].check_timeouts()
        timeouts.extend(workflow_timeouts)
        
        # 检查系统问题
        system_issues = self.monitors['system'].check_issues()
        timeouts.extend(system_issues)
        
        return self.prioritize_timeouts(timeouts)
```

### 2. BMAD自动恢复器 (Auto-Recovery Engine)
```python
class BMADAutoRecovery:
    """BMAD自动恢复引擎"""
    
    def __init__(self, detector, strategy_selector):
        self.detector = detector
        self.strategy_selector = strategy_selector
        self.recovery_history = []
        
    def handle_timeout(self, timeout_event):
        """处理超时事件"""
        # 选择恢复策略
        strategy = self.strategy_selector.select_strategy(timeout_event)
        
        # 执行恢复
        recovery_result = self.execute_recovery(strategy, timeout_event)
        
        # 记录恢复历史
        self.record_recovery(timeout_event, strategy, recovery_result)
        
        return recovery_result
    
    def execute_recovery(self, strategy, timeout_event):
        """执行恢复策略"""
        recovery_methods = {
            'task_reassignment': self.reassign_task,
            'resource_reallocation': self.reallocate_resources,
            'workflow_restart': self.restart_workflow,
            'graceful_degradation': self.degrade_gracefully
        }
        
        method = recovery_methods.get(strategy.name)
        if method:
            return method(timeout_event, strategy.params)
        else:
            return self.default_recovery(timeout_event)
    
    def reassign_task(self, timeout_event, params):
        """重新分配任务"""
        agent_id = timeout_event.agent_id
        task_id = timeout_event.task_id
        
        # 寻找可用代理
        available_agents = self.find_available_agents(task_id)
        
        if available_agents:
            # 重新分配任务
            new_agent = self.select_best_agent(available_agents, task_id)
            result = self.reassign_to_agent(task_id, new_agent)
            
            return {
                'success': True,
                'action': 'task_reassigned',
                'from_agent': agent_id,
                'to_agent': new_agent,
                'result': result
            }
        
        return {
            'success': False,
            'action': 'no_available_agents',
            'fallback': 'workflow_restart'
        }
```

### 3. BMAD智能预警系统 (Intelligent Alert System)
```python
class BMADAlertSystem:
    """BMAD智能预警系统"""
    
    def __init__(self, config):
        self.config = config.notifications
        self.alert_history = []
        self.escalation_rules = self.load_escalation_rules()
        
    def send_alert(self, level, message, context):
        """发送警报"""
        alert = {
            'id': self.generate_alert_id(),
            'timestamp': datetime.now(),
            'level': level,
            'message': message,
            'context': context,
            'channels': self.get_channels_for_level(level)
        }
        
        # 发送到配置的通道
        for channel in alert['channels']:
            self.send_to_channel(channel, alert)
        
        # 记录警报
        self.alert_history.append(alert)
        
        # 检查是否需要升级
        self.check_escalation(alert)
        
        return alert
    
    def get_channels_for_level(self, level):
        """获取对应级别的通知通道"""
        for rule in self.config.escalation:
            if rule.level == level:
                return rule.channels
        return ['log']  # 默认日志通道
    
    def check_escalation(self, alert):
        """检查警报是否需要升级"""
        # 检查重复警报
        recent_alerts = self.get_recent_alerts(alert['context'], '30m')
        
        if len(recent_alerts) >= 3:
            # 重复警报，升级级别
            next_level = self.get_next_level(alert['level'])
            if next_level:
                escalation_alert = {
                    'original_alert': alert['id'],
                    'level': next_level,
                    'message': f"警报升级: {alert['message']} (重复{len(recent_alerts)}次)",
                    'context': alert['context']
                }
                self.send_alert(**escalation_alert)
```

## 集成到BMAD工作流

### 1. Party Mode超时集成
```yaml
# party-mode-with-timeout.yaml
party_mode:
  timeout_integration:
    enabled: true
    
    conversation_timeouts:
      turn_timeout: "2m"          # 单次发言超时
      response_timeout: "1m"      # 响应等待超时
      discussion_timeout: "30m"   # 讨论总超时
    
    recovery_actions:
      - action: "gentle_nudge"
        condition: "turn_timeout"
        message: "请继续发言..."
      
      - action: "change_topic"
        condition: "discussion_stalled"
        message: "让我们换个角度讨论..."
      
      - action: "summarize_and_move"
        condition: "discussion_timeout"
        message: "基于讨论，我们决定..."
```

### 2. Workflow超时集成
```yaml
# workflow-with-timeout.yaml
workflow:
  phases:
    - name: "需求分析"
      timeout: "1h"
      checkpoints:
        - name: "需求收集完成"
          timeout: "20m"
          recovery: "skip_to_next"
        
        - name: "优先级排序"
          timeout: "15m"
          recovery: "auto_prioritize"
    
    - name: "设计阶段"
      timeout: "2h"
      dependencies:
        - phase: "需求分析"
          timeout: "10m"  # 依赖等待超时
          recovery: "proceed_with_assumptions"
```

### 3. 代理配置超时集成
```yaml
# agent-with-timeout.yaml
agent:
  id: "ux-designer"
  timeout_config:
    task_execution:
      design_system: "45m"
      page_design: "1.5h"
      prototype: "1h"
    
    resource_limits:
      max_memory: "2GB"
      max_cpu: "80%"
      max_disk: "500MB"
    
    health_checks:
      interval: "5m"
      timeout: "30s"
      retries: 3
    
    failure_handling:
      retry_policy:
        max_retries: 3
        backoff: "exponential"
        max_delay: "5m"
      
      fallback_actions:
        - action: "simplify_task"
          condition: "timeout_after_retry"
        
        - action: "request_assistance"
          condition: "resource_exhausted"
        
        - action: "save_state_and_exit"
          condition: "unrecoverable_error"
```

## 超时测试套件

### 1. 单元测试
```python
# test_timeout_detection.py
class TestTimeoutDetection:
    """超时检测测试"""
    
    def test_agent_timeout_detection(self):
        """测试代理超时检测"""
        detector = BMADTimeoutDetector(test_config)
        
        # 模拟代理任务
        task = {
            'id': 'task-001',
            'agent_id': 'ux-designer',
            'start_time': datetime.now() - timedelta(minutes=10),
            'expected_duration': '5m'
        }
        
        # 监控任务
        detector.monitor_agent('ux-designer', task)
        
        # 检查超时
        timeouts = detector.detect_timeouts()
        
        assert len(timeouts) == 1
        assert timeouts[0].type == 'agent_timeout'
        assert timeouts[0].agent_id == 'ux-designer'
    
    def test_workflow_timeout_detection(self):
        """测试工作流超时检测"""
        detector = BMADTimeoutDetector(test_config)
        
        # 模拟工作流阶段
        phase = {
            'workflow_id': 'project-001',
            'phase': 'design',
            'start_time': datetime.now() - timedelta(hours=2),
            'expected_duration': '1h'
        }
        
        # 监控工作流
        detector.monitor_workflow('project-001', phase)
        
        # 检查超时
        timeouts = detector.detect_timeouts()
        
        assert any(t.type == 'workflow_timeout' for t in timeouts)
```

### 2. 集成测试
```python
# test_recovery_integration.py
class TestRecoveryIntegration:
    """恢复集成测试"""
    
    def test_auto_recovery_workflow(self):
        """测试自动恢复工作流"""
        # 设置测试环境
        detector = BMADTimeoutDetector(test_config)
        recovery = BMADAutoRecovery(detector, test_strategy_selector)
        
        # 创建超时事件
        timeout_event = TimeoutEvent(
            type='agent_timeout',
            agent_id='ux-designer',
            task_id='design-system',
            duration='20m',
            expected='10m'
        )
        
        # 触发恢复
        result = recovery.handle_timeout(timeout_event)
        
        # 验证恢复结果
        assert result['success'] == True
        assert result['action'] == 'task_reassigned'
        assert 'to_agent' in result
        
        # 验证任务已重新分配
        task = get_task('design-system')
        assert task['assigned_to'] == result['to_agent']
        assert task['status'] == 'reassigned'
```

### 3. 压力测试
```python
# test_stress_scenarios.py
class TestStressScenarios:
    """压力场景测试"""
    
    def test_multiple_concurrent_timeouts(self):
        """测试多个并发超时"""
        detector = BMADTimeoutDetector(test_config)
        
        # 创建多个并发超时
        timeouts = []
        for i in range(10):
            timeout = TimeoutEvent(
                type='agent_timeout',
                agent_id=f'agent-{i}',
                task_id=f'task-{i}',
                duration=f'{15+i}m',
                expected='10m'
            )
            timeouts.append(timeout)
        
        # 批量处理超时
        results = []
        for timeout in timeouts:
            result = detector.handle_timeout(timeout)
            results.append(result)
        
        # 验证处理结果
        assert len(results) == 10
        success_count = sum(1 for r in results if r['success'])
        assert success_count >= 8  # 至少80%成功
        
    def test_cascading_failure_recovery(self):
        """测试级联故障恢复"""
        # 模拟级联故障场景
        scenario = CascadingFailureScenario(
            initial_failure='database_timeout',
            cascade_chain=['api_gateway', 'cache_layer', 'agent_coordinator']
        )
        
        # 执行恢复测试
        recovery_tester = RecoveryTester(scenario)
        test_result = recovery_tester.run_test()
        
        # 验证恢复效果
        assert test_result['overall_success'] == True
        assert test_result['recovery_time'] < '2m'
        assert test_result['data_loss'] == 'none'
```

## 部署与配置

### 1. 安装步骤
```bash
# 1. 复制超时模块到BMAD框架
cp bmad-timeout-module.md bmad-method/_bmad/modules/timeout/

# 2. 安装依赖
npm install bmad-timeout-monitor bmad-auto-recovery

# 3. 配置超时设置
cp bmad-timeout-config.yaml bmad-method/_bmad/config/

# 4. 启用模块
echo "timeout_module: enabled" >> bmad-method/_bmad/core/config.yaml

# 5. 启动监控服务
node bmad-timeout-service.js start
```

### 2. 配置文件示例
```yaml
# bmad-timeout-config.yaml
timeout_config:
  enabled: true
  log_level: "info"
  
  monitoring:
    interval: "60s"
    retention: "7d"
    
  alerts:
    email:
      enabled: true
      recipients: ["project-manager@example.com"]
    slack:
      enabled: true
      webhook: "https://hooks.slack.com/services/..."
    dashboard:
      enabled: true
      url: "http://localhost:3000/dashboard"
    
  recovery:
    auto_recovery: true
    max_recovery_attempts: 3
    recovery_timeout: "10m"
    
  testing:
    auto_test_interval: "24h"
    test_timeout: "5m"
    report_generation: true
```

### 3. 监控仪表板
```html
<!-- timeout-dashboard.html -->
<div class="timeout-dashboard">
  <div class="header">
    <h1>BMAD超时监控仪表板</h1>
    <div class="status-indicator" id="systemStatus"></div>
  </div>
  
  <div class="metrics-grid">
    <div class="metric-card">
      <h3>代理状态</h3>
      <div class="metric-value" id="agentStatus"></div>
      <div class="metric-trend" id="agentTrend"></div>
    </div>
    
    <div class="metric-card">
      <h3>工作流进度</h3>
      <div class="metric-value" id="workflowProgress"></div