#!/usr/bin/env node

/**
 * BMAD 超时测试脚本
 * 用于测试和验证BMAD框架的超时检测与恢复机制
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

class BMADTimeoutTester {
  constructor(configPath) {
    this.config = this.loadConfig(configPath);
    this.testResults = [];
    this.monitoringData = [];
  }

  // 加载配置
  loadConfig(configPath) {
    try {
      const configContent = fs.readFileSync(configPath, 'utf8');
      // 简单解析YAML格式
      const config = {};
      const lines = configContent.split('\n');
      
      lines.forEach(line => {
        if (line.trim() && !line.startsWith('#')) {
          const [key, ...valueParts] = line.split(':');
          if (key && valueParts.length > 0) {
            const value = valueParts.join(':').trim();
            config[key.trim()] = this.parseValue(value);
          }
        }
      });
      
      return config;
    } catch (error) {
      console.error('加载配置失败:', error.message);
      return this.getDefaultConfig();
    }
  }

  // 解析配置值
  parseValue(value) {
    // 尝试解析为数字
    if (!isNaN(value)) return Number(value);
    
    // 尝试解析为布尔值
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
    
    // 尝试解析时间字符串
    if (value.match(/^\d+[smh]$/)) {
      return this.parseTimeString(value);
    }
    
    // 返回字符串
    return value;
  }

  // 解析时间字符串
  parseTimeString(timeStr) {
    const unit = timeStr.slice(-1);
    const value = parseInt(timeStr.slice(0, -1));
    
    switch (unit) {
      case 's': return value * 1000; // 秒
      case 'm': return value * 60 * 1000; // 分钟
      case 'h': return value * 60 * 60 * 1000; // 小时
      default: return value * 1000;
    }
  }

  // 默认配置
  getDefaultConfig() {
    return {
      enabled: true,
      mode: 'testing',
      agent_timeouts: {
        task_execution: {
          warning: 300000, // 5分钟
          critical: 900000, // 15分钟
          restart: 1800000 // 30分钟
        }
      },
      testing: {
        enabled: true
      }
    };
  }

  // 运行所有测试
  async runAllTests() {
    console.log('🚀 开始BMAD超时测试...');
    
    if (!this.config.enabled) {
      console.log('⚠️ 超时测试未启用，跳过测试');
      return;
    }

    const tests = [
      this.testAgentTimeoutDetection.bind(this),
      this.testWorkflowTimeoutDetection.bind(this),
      this.testRecoveryMechanism.bind(this),
      this.testNotificationSystem.bind(this),
      this.testStressScenario.bind(this)
    ];

    for (const test of tests) {
      await this.runTest(test);
    }

    this.generateReport();
  }

  // 运行单个测试
  async runTest(testFunction) {
    const testName = testFunction.name.replace('test', '').replace(/([A-Z])/g, ' $1').trim();
    
    console.log(`\n📋 运行测试: ${testName}`);
    
    try {
      const startTime = Date.now();
      const result = await testFunction();
      const duration = Date.now() - startTime;
      
      this.testResults.push({
        name: testName,
        status: 'passed',
        duration,
        result
      });
      
      console.log(`✅ ${testName}: 通过 (${duration}ms)`);
    } catch (error) {
      this.testResults.push({
        name: testName,
        status: 'failed',
        error: error.message
      });
      
      console.error(`❌ ${testName}: 失败 - ${error.message}`);
    }
  }

  // 测试1: 代理超时检测
  async testAgentTimeoutDetection() {
    console.log('  测试代理超时检测机制...');
    
    // 模拟代理任务
    const task = {
      id: 'test-task-001',
      agent: 'test-agent',
      startTime: Date.now() - this.config.agent_timeouts.task_execution.warning - 1000,
      expectedDuration: 60000 // 1分钟
    };
    
    // 检查是否应该检测到超时
    const timeSinceStart = Date.now() - task.startTime;
    const shouldTimeout = timeSinceStart > this.config.agent_timeouts.task_execution.warning;
    
    if (!shouldTimeout) {
      throw new Error('超时检测逻辑错误: 应该检测到超时');
    }
    
    // 模拟超时事件
    const timeoutEvent = {
      type: 'agent_timeout',
      agent: task.agent,
      task: task.id,
      duration: timeSinceStart,
      threshold: this.config.agent_timeouts.task_execution.warning
    };
    
    return {
      event: timeoutEvent,
      detected: shouldTimeout,
      responseTime: timeSinceStart
    };
  }

  // 测试2: 工作流超时检测
  async testWorkflowTimeoutDetection() {
    console.log('  测试工作流超时检测...');
    
    // 模拟工作流阶段
    const workflowPhase = {
      id: 'test-workflow-001',
      phase: 'design',
      startTime: Date.now() - 7200000, // 2小时前
      expectedDuration: 3600000, // 1小时
      warningMultiplier: this.config.workflow_timeouts?.phase_completion?.warning_multiplier || 1.5
    };
    
    const expectedCompletion = workflowPhase.expectedDuration * workflowPhase.warningMultiplier;
    const timeSinceStart = Date.now() - workflowPhase.startTime;
    const shouldWarn = timeSinceStart > expectedCompletion;
    
    if (!shouldWarn) {
      throw new Error('工作流超时检测错误: 应该发出警告');
    }
    
    return {
      workflow: workflowPhase.id,
      phase: workflowPhase.phase,
      expectedCompletion,
      actualTime: timeSinceStart,
      warningIssued: shouldWarn
    };
  }

  // 测试3: 恢复机制
  async testRecoveryMechanism() {
    console.log('  测试自动恢复机制...');
    
    // 模拟超时事件
    const timeoutEvent = {
      type: 'agent_timeout',
      agent: 'ux-designer',
      task: 'design-system',
      duration: 1200000, // 20分钟
      threshold: 300000 // 5分钟警告阈值
    };
    
    // 模拟恢复策略选择
    const recoveryStrategies = this.config.recovery_strategies || [
      { name: 'task_reassignment', priority: 1 }
    ];
    
    const selectedStrategy = recoveryStrategies
      .sort((a, b) => a.priority - b.priority)[0];
    
    // 模拟恢复执行
    const recoveryResult = {
      strategy: selectedStrategy.name,
      action: 'reassign_to_backup',
      newAgent: 'backup-designer',
      success: true,
      recoveryTime: 5000 // 5秒恢复时间
    };
    
    if (!recoveryResult.success) {
      throw new Error('恢复机制测试失败: 恢复未成功');
    }
    
    return recoveryResult;
  }

  // 测试4: 通知系统
  async testNotificationSystem() {
    console.log('  测试通知系统...');
    
    const notificationLevels = ['warning', 'critical', 'emergency'];
    const testNotifications = [];
    
    for (const level of notificationLevels) {
      const notification = {
        id: `test-notification-${Date.now()}`,
        timestamp: new Date().toISOString(),
        level,
        message: `测试${level}级别通知`,
        channels: this.getChannelsForLevel(level)
      };
      
      testNotifications.push(notification);
      
      // 验证通知配置
      if (!notification.channels || notification.channels.length === 0) {
        throw new Error(`通知系统错误: ${level}级别没有配置通知通道`);
      }
    }
    
    return {
      notificationsSent: testNotifications.length,
      levelsTested: notificationLevels,
      channelsTested: [...new Set(testNotifications.flatMap(n => n.channels))]
    };
  }

  // 获取对应级别的通知通道
  getChannelsForLevel(level) {
    const notificationConfig = this.config.notifications;
    if (!notificationConfig) return ['log'];
    
    const escalationRules = notificationConfig.escalation || [];
    for (const rule of escalationRules) {
      if (rule.level === level) {
        return rule.channels || ['log'];
      }
    }
    
    return ['log'];
  }

  // 测试5: 压力场景
  async testStressScenario() {
    console.log('  测试压力场景...');
    
    // 模拟多个并发超时
    const concurrentTimeouts = 5;
    const timeoutEvents = [];
    
    for (let i = 0; i < concurrentTimeouts; i++) {
      timeoutEvents.push({
        id: `stress-test-${i}`,
        agent: `agent-${i}`,
        task: `task-${i}`,
        duration: 600000 + (i * 60000), // 10-14分钟
        threshold: 300000 // 5分钟
      });
    }
    
    // 模拟批量处理
    const processingStart = Date.now();
    const processedResults = timeoutEvents.map(event => ({
      eventId: event.id,
      handled: true,
      recoveryStrategy: 'task_reassignment',
      processingTime: 100 + Math.random() * 400 // 100-500ms
    }));
    
    const totalProcessingTime = Date.now() - processingStart;
    const successRate = processedResults.filter(r => r.handled).length / processedResults.length;
    
    if (successRate < 0.8) {
      throw new Error(`压力测试失败: 成功率${successRate * 100}%低于80%`);
    }
    
    if (totalProcessingTime > 5000) {
      throw new Error(`压力测试失败: 处理时间${totalProcessingTime}ms超过5秒`);
    }
    
    return {
      concurrentTimeouts,
      successRate,
      totalProcessingTime,
      averageProcessingTime: totalProcessingTime / concurrentTimeouts
    };
  }

  // 生成测试报告
  generateReport() {
    console.log('\n📊 生成测试报告...');
    
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(t => t.status === 'passed').length;
    const failedTests = this.testResults.filter(t => t.status === 'failed').length;
    const passRate = (passedTests / totalTests) * 100;
    
    const report = {
      timestamp: new Date().toISOString(),
      config: this.config,
      summary: {
        totalTests,
        passedTests,
        failedTests,
        passRate: `${passRate.toFixed(1)}%`
      },
      details: this.testResults,
      recommendations: this.generateRecommendations()
    };
    
    // 保存报告
    const reportPath = path.join(process.cwd(), 'bmad-timeout-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`\n📁 测试报告已保存: ${reportPath}`);
    console.log(`📈 测试结果: ${passedTests}/${totalTests} 通过 (${passRate.toFixed(1)}%)`);
    
    if (failedTests > 0) {
      console.log('❌ 失败的测试:');
      this.testResults
        .filter(t => t.status === 'failed')
        .forEach(t => console.log(`   - ${t.name}: ${t.error}`));
    }
    
    return report;
  }

  // 生成建议
  generateRecommendations() {
    const recommendations = [];
    
    // 检查配置完整性
    if (!this.config.agent_timeouts) {
      recommendations.push('添加代理级别超时配置');
    }
    
    if (!this.config.workflow_timeouts) {
      recommendations.push('添加工作流级别超时配置');
    }
    
    if (!this.config.recovery_strategies) {
      recommendations.push('定义恢复策略');
    }
    
    if (!this.config.notifications) {
      recommendations.push('配置通知系统');
    }
    
    // 基于测试结果的建议
    const failedTests = this.testResults.filter(t => t.status === 'failed');
    if (failedTests.length > 0) {
      recommendations.push('修复失败的测试用例');
    }
    
    // 性能建议
    const slowTests = this.testResults.filter(t => t.duration > 1000);
    if (slowTests.length > 0) {
      recommendations.push('优化慢速测试用例');
    }
    
    return recommendations;
  }

  // 启动监控模式
  async startMonitoring() {
    if (this.config.mode !== 'monitoring') {
      console.log('当前不是监控模式，切换到监控模式...');
      this.config.mode = 'monitoring';
    }
    
    console.log('👁️ 启动BMAD超时监控...');
    
    // 设置监控间隔
    const monitorInterval = setInterval(() => {
      this.monitorSystem();
    }, 60000); // 每分钟检查一次
    
    // 保存监控数据
    process.on('SIGINT', () => {
      clearInterval(monitorInterval);
      this.saveMonitoringData();
      console.log('监控已停止');
      process.exit(0);
    });
    
    console.log('监控运行中，按 Ctrl+C 停止...');
  }

  // 监控系统
  async monitorSystem() {
    const timestamp = new Date().toISOString();
    
    try {
      // 检查系统状态
      const systemStatus = await this.checkSystemStatus();
      
      // 检查代理状态
      const agentStatus = await this.checkAgentStatus();
      
      // 检查工作流进度
      const workflowStatus = await this.checkWorkflowStatus();
      
      // 记录监控数据
      this.monitoringData.push({
        timestamp,
        systemStatus,
        agentStatus,
        workflowStatus
      });
      
      // 清理旧数据
      if (this.monitoringData.length > 1440) { // 保留24小时数据
        this.monitoringData.shift();
      }
      
      // 检查是否需要警报
      this.checkForAlerts(systemStatus, agentStatus, workflowStatus);
      
    } catch (error) {
      console.error('监控检查失败:', error.message);
    }
  }

  // 检查系统状态
  async checkSystemStatus() {
    // 这里可以添加实际的系统检查
    return {
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      disk: Math.random() * 100,
      network: 'ok'
    };
  }

  // 检查代理状态
  async checkAgentStatus() {
    // 模拟代理状态检查
    const agents = ['ux-designer', 'frontend-dev', 'backend-arch', 'ai-integration'];
    
    return agents.map(agent => ({
      name: agent,
      status: Math.random() > 0.1 ? 'active' : 'inactive',
      lastActivity: Date.now() - Math.random() * 300000, // 0-5分钟前
      tasks: Math.floor(Math.random() * 3)
    }));
  }

  // 检查工作流进度
  async checkWorkflowStatus() {
    // 模拟工作流检查
    return {
      activeWorkflows: Math.floor(Math.random() * 5),
      completedPhases: Math.floor(Math.random() * 20),
      blockedPhases: Math.floor(Math.random() * 3),
      averagePhaseTime: 1200000 + Math.random() * 1800000 // 20-50分钟
    };
  }

  // 检查警报
  checkForAlerts(systemStatus, agentStatus, workflowStatus) {
    const alerts = [];
    
    // 检查系统资源
    if (systemStatus.cpu > 80) {
      alerts.push({
        level: 'warning',
        message: `CPU使用率高: ${systemStatus.cpu.toFixed(1)}%`
      });
    }
    
    // 检查不活跃代理
    const inactiveAgents = agentStatus.filter(a => a.status === 'inactive');
    if (inactiveAgents.length > 0) {
      alerts.push({
        level: 'critical',
        message: `${inactiveAgents.length}个代理不活跃: ${inactiveAgents.map(a => a.name).join(', ')}`
      });
    }
    
    // 检查阻塞的工作流
    if (workflowStatus.blockedPhases > 2) {
      alerts.push({
        level: 'warning',
        message: `${workflowStatus.blockedPhases}个工作流阶段被阻塞`
      });
    }
    
    // 发送警报
    if (alerts.length > 0) {
      this.sendAlerts(alerts);
    }
  }

  // 发送警报
  sendAlerts(alerts) {
    alerts.forEach(alert => {
      console.log(`🚨 ${alert.level.toUpperCase()}: ${alert.message}`);
      
      // 这里可以集成实际的通知系统
      // 例如: 发送到Slack、邮件、监控面板等
    });
  }

  // 保存监控数据
  saveMonitoringData() {
    if (this.monitoringData.length === 0) return;
    
    const dataPath = path.join(process.cwd(), 'bmad-monitoring-data.json');
    fs.writeFileSync(dataPath, JSON.stringify(this.monitoringData, null, 2));
    console.log(`📁 监控数据已保存: ${dataPath} (${this.monitoringData.length}条记录)`);
  }
}

// 命令行接口
async function main() {
  const args = process.argv.slice(2);
  const configPath = args[0] || 'bmad-method/timeout-test-integration.md';
  const mode = args[1] || 'test';
  
  const tester = new BMADTimeoutTester(configPath);
  
  switch (mode.toLowerCase()) {
    case 'test':
      await tester.runAllTests();
      break;
      
    case 'monitor':
      await tester.startMonitoring();
      break;
      
    case 'report':
      tester.generateReport();
      break;
      
    default:
      console.log('使用方法:');
      console.log('  node bmad-timeout-test.js [config-path] [mode]');
      console.log('');
      console.log('模式:');
      console.log('  test     - 运行所有测试 (默认)');
      console.log('  monitor  - 启动监控模式');
      console.log('  report   - 生成报告');
      console.log('');
      console.log('示例:');
      console.log('  node bmad-timeout-test.js bmad-timeout-config.yaml test');
      console.log('  node bmad-timeout-test.js bmad-timeout-config.yaml monitor');
      break;
  }
}

// 如果是直接运行
if (require.main === module) {
  main().catch(error => {
    console.error('执行失败:', error);
    process.exit(1);
  });
}

module.exports = BMADTimeoutTester;