# BMAD 超时配置
version: "1.0.0"
enabled: true
mode: "monitoring"  # monitoring|testing|enforcement

# 代理级别超时设置
agent_timeouts:
  task_execution:
    warning: "5m"
    critical: "15m"
    restart: "30m"
  response_waiting:
    warning: "2m"
    critical: "5m"
  health_check:
    interval: "1m"
    timeout: "30s"

# 工作流级别超时设置
workflow_timeouts:
  phase_completion:
    warning_multiplier: 1.5
    critical_multiplier: 2.0
  milestone_check:
    interval: "10m"
    grace_period: "5m"

# 恢复策略
recovery_strategies:
  - name: "task_reassignment"
    priority: 1
    trigger: "agent_unresponsive"
    action: "reassign_to_backup"
  
  - name: "resource_boost"
    priority: 2
    trigger: "slow_progress"
    action: "increase_resources"
  
  - name: "workflow_skip"
    priority: 3
    trigger: "blocked_dependency"
    action: "skip_to_next"
  
  - name: "graceful_degradation"
    priority: 4
    trigger: "system_overload"
    action: "reduce_quality"

# 通知设置
notifications:
  channels:
    - name: "log"
      level: "all"
    - name: "dashboard"
      level: "warning+"
    - name: "alert"
      level: "critical+"
  
  escalation:
    - level: "warning"
      repeat_count: 3
      escalate_to: "critical"
    - level: "critical"
      repeat_count: 2
      escalate_to: "emergency"

# 测试模式设置
testing:
  enabled: true
  scenarios:
    - name: "single_agent_timeout"
      frequency: "daily"
    - name: "workflow_stall"
      frequency: "weekly"
    - name: "cascading_failure"
      frequency: "monthly"
  
  auto_test_schedule:
    - time: "02:00"
      scenario: "single_agent_timeout"
    - time: "sunday 03:00"
      scenario: "workflow_stall"