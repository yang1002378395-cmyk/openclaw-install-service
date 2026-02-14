// 超时处理机制 - 第二阶段紧急监控

class TimeoutHandler {
  constructor(config) {
    this.config = {
      checkInterval: 60000, // 1分钟检查一次
      warningThreshold: 120000, // 2分钟无产出警告
      criticalThreshold: 300000, // 5分钟无产出严重
      restartThreshold: 600000, // 10分钟无产出重启
      ...config
    };
    
    this.lastOutputTime = Date.now();
    this.outputHistory = [];
    this.isMonitoring = false;
    this.timeoutHandlers = new Map();
  }

  // 开始监控
  startMonitoring() {
    console.log('🚀 启动超时监控机制...');
    this.isMonitoring = true;
    this.monitorInterval = setInterval(() => this.checkTimeouts(), this.config.checkInterval);
    
    // 监听文件变化
    this.setupFileWatcher();
    
    return this;
  }

  // 停止监控
  stopMonitoring() {
    console.log('🛑 停止超时监控');
    this.isMonitoring = false;
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
    }
    this.clearAllTimeouts();
  }

  // 设置文件监视器
  setupFileWatcher() {
    console.log('📁 设置文件产出监控...');
    // 这里可以集成实际的文件系统监视
    // 目前使用手动记录方式
  }

  // 记录产出
  recordOutput(fileType, fileName) {
    const now = Date.now();
    const output = {
      timestamp: now,
      fileType,
      fileName,
      duration: now - this.lastOutputTime
    };
    
    this.lastOutputTime = now;
    this.outputHistory.push(output);
    
    // 保持历史记录大小
    if (this.outputHistory.length > 100) {
      this.outputHistory.shift();
    }
    
    console.log(`📝 记录产出: ${fileName} (${fileType})`);
    
    // 清除相关超时
    this.clearTimeout(fileType);
    
    return output;
  }

  // 检查超时
  checkTimeouts() {
    if (!this.isMonitoring) return;
    
    const now = Date.now();
    const timeSinceLastOutput = now - this.lastOutputTime;
    
    console.log(`⏰ 超时检查: 最后产出 ${Math.floor(timeSinceLastOutput / 1000)} 秒前`);
    
    // 警告级别检查
    if (timeSinceLastOutput >= this.config.warningThreshold && 
        timeSinceLastOutput < this.config.criticalThreshold) {
      this.handleWarning(timeSinceLastOutput);
    }
    
    // 严重级别检查
    else if (timeSinceLastOutput >= this.config.criticalThreshold && 
             timeSinceLastOutput < this.config.restartThreshold) {
      this.handleCritical(timeSinceLastOutput);
    }
    
    // 重启级别检查
    else if (timeSinceLastOutput >= this.config.restartThreshold) {
      this.handleRestart(timeSinceLastOutput);
    }
  }

  // 处理警告
  handleWarning(timeSinceLastOutput) {
    const seconds = Math.floor(timeSinceLastOutput / 1000);
    console.warn(`⚠️ 警告: ${seconds}秒无产出，可能进度缓慢`);
    
    // 发送轻度提醒
    this.sendAlert('warning', `进度缓慢: ${seconds}秒无新产出`);
    
    // 设置检查超时
    this.setTimeout('progress_check', () => {
      this.checkSpecificProgress();
    }, 30000); // 30秒后检查具体进度
  }

  // 处理严重状态
  handleCritical(timeSinceLastOutput) {
    const seconds = Math.floor(timeSinceLastOutput / 1000);
    console.error(`🚨 严重: ${seconds}秒无产出，可能卡住`);
    
    // 发送严重警报
    this.sendAlert('critical', `进度停滞: ${seconds}秒无产出，需要干预`);
    
    // 尝试自动恢复
    this.attemptAutoRecovery();
    
    // 设置重启超时
    this.setTimeout('auto_restart', () => {
      this.autoRestartProcess();
    }, 120000); // 2分钟后自动重启
  }

  // 处理重启
  handleRestart(timeSinceLastOutput) {
    const seconds = Math.floor(timeSinceLastOutput / 1000);
    console.error(`💥 超时重启: ${seconds}秒无产出，执行紧急重启`);
    
    // 发送紧急警报
    this.sendAlert('emergency', `系统停滞: ${seconds}秒无产出，执行紧急重启`);
    
    // 立即执行重启
    this.executeEmergencyRestart();
  }

  // 检查具体进度
  checkSpecificProgress() {
    console.log('🔍 检查具体任务进度...');
    
    // 检查各代理状态
    const agentStatus = this.checkAgentStatus();
    
    // 检查文件系统
    const fileStatus = this.checkFileSystem();
    
    // 分析问题
    this.analyzeIssues(agentStatus, fileStatus);
  }

  // 检查代理状态
  checkAgentStatus() {
    const status = {
      ux_designer: this.checkAgentOutput('UX/UI Designer', ['design', 'fig']),
      frontend_dev: this.checkAgentOutput('Frontend Developer', ['validation', 'arch']),
      ai_integration: this.checkAgentOutput('AI Integration', ['api', 'test']),
      backend_arch: this.checkAgentOutput('Backend Architect', ['feasibility', 'tech']),
      test_quality: this.checkAgentOutput('Test & Quality', ['test', 'quality']),
      product_planner: this.checkAgentOutput('Product Planner', ['review', 'plan'])
    };
    
    return status;
  }

  // 检查代理产出
  checkAgentOutput(agentName, keywords) {
    const recentFiles = this.outputHistory
      .filter(output => output.timestamp > Date.now() - 300000) // 最近5分钟
      .filter(output => {
        const fileStr = output.fileName.toLowerCase();
        return keywords.some(keyword => fileStr.includes(keyword));
      });
    
    return {
      active: recentFiles.length > 0,
      lastOutput: recentFiles[0] ? recentFiles[0].timestamp : null,
      outputCount: recentFiles.length
    };
  }

  // 检查文件系统
  checkFileSystem() {
    try {
      // 这里可以添加实际的文件系统检查
      return {
        writable: true,
        spaceAvailable: true,
        permissions: 'ok'
      };
    } catch (error) {
      return {
        writable: false,
        error: error.message
      };
    }
  }

  // 分析问题
  analyzeIssues(agentStatus, fileStatus) {
    const issues = [];
    
    // 检查不活跃的代理
    Object.entries(agentStatus).forEach(([agent, status]) => {
      if (!status.active && status.lastOutput) {
        const minutesAgo = Math.floor((Date.now() - status.lastOutput) / 60000);
        issues.push(`${agent}: ${minutesAgo}分钟无产出`);
      }
    });
    
    // 检查文件系统问题
    if (!fileStatus.writable) {
      issues.push(`文件系统不可写: ${fileStatus.error}`);
    }
    
    // 输出分析结果
    if (issues.length > 0) {
      console.log('📊 发现问题:', issues);
      this.sendAlert('analysis', `发现${issues.length}个问题: ${issues.join(', ')}`);
    } else {
      console.log('✅ 未发现明显问题');
    }
    
    return issues;
  }

  // 尝试自动恢复
  attemptAutoRecovery() {
    console.log('🔄 尝试自动恢复...');
    
    // 1. 重新分配任务
    this.reassignTasks();
    
    // 2. 清理临时状态
    this.cleanupTempState();
    
    // 3. 发送恢复信号
    this.sendRecoverySignal();
  }

  // 重新分配任务
  reassignTasks() {
    console.log('📋 重新分配任务优先级...');
    
    // 将卡住的任务重新分配给其他代理
    const reassignments = [
      { from: 'ai_integration', to: 'backend_arch', task: 'api_test_backup' },
      { from: 'ux_designer', to: 'frontend_dev', task: 'design_implementation' }
    ];
    
    reassignments.forEach(reassignment => {
      console.log(`   ↳ ${reassignment.from} → ${reassignment.to}: ${reassignment.task}`);
    });
  }

  // 清理临时状态
  cleanupTempState() {
    console.log('🧹 清理临时状态...');
    // 清理可能阻塞的状态
  }

  // 发送恢复信号
  sendRecoverySignal() {
    console.log('📡 发送恢复信号...');
    this.sendAlert('recovery', '自动恢复机制已启动');
  }

  // 自动重启进程
  autoRestartProcess() {
    console.log('🚀 执行自动重启...');
    
    // 1. 停止当前进程
    this.stopAllProcesses();
    
    // 2. 清理环境
    this.cleanupEnvironment();
    
    // 3. 重新启动
    this.restartProcesses();
    
    // 4. 重置监控
    this.resetMonitoring();
  }

  // 停止所有进程
  stopAllProcesses() {
    console.log('🛑 停止所有工作进程...');
    // 实际实现中这里会停止代理进程
  }

  // 清理环境
  cleanupEnvironment() {
    console.log('🧼 清理工作环境...');
    // 清理临时文件、重置状态等
  }

  // 重启进程
  restartProcesses() {
    console.log('🔁 重启工作进程...');
    
    const restartOrder = [
      'supervisor',
      'ux_designer',
      'frontend_dev',
      'ai_integration',
      'backend_arch',
      'test_quality',
      'product_planner'
    ];
    
    restartOrder.forEach(agent => {
      console.log(`   ↳ 启动 ${agent}`);
      // 实际启动代理
    });
  }

  // 重置监控
  resetMonitoring() {
    console.log('🔄 重置监控状态...');
    this.lastOutputTime = Date.now();
    this.outputHistory = [];
    this.clearAllTimeouts();
  }

  // 执行紧急重启
  executeEmergencyRestart() {
    console.log('💥 执行紧急重启流程...');
    
    // 立即执行重启
    this.autoRestartProcess();
    
    // 发送重启完成通知
    setTimeout(() => {
      this.sendAlert('restart_complete', '紧急重启完成，系统已恢复');
    }, 5000);
  }

  // 设置超时处理器
  setTimeout(id, handler, delay) {
    this.clearTimeout(id);
    
    const timeoutId = setTimeout(() => {
      handler();
      this.timeoutHandlers.delete(id);
    }, delay);
    
    this.timeoutHandlers.set(id, timeoutId);
  }

  // 清除超时
  clearTimeout(id) {
    if (this.timeoutHandlers.has(id)) {
      clearTimeout(this.timeoutHandlers.get(id));
      this.timeoutHandlers.delete(id);
    }
  }

  // 清除所有超时
  clearAllTimeouts() {
    this.timeoutHandlers.forEach((timeoutId, id) => {
      clearTimeout(timeoutId);
    });
    this.timeoutHandlers.clear();
  }

  // 发送警报
  sendAlert(level, message) {
    const alert = {
      timestamp: Date.now(),
      level,
      message,
      lastOutputTime: this.lastOutputTime,
      outputHistory: this.outputHistory.slice(-5) // 最近5个产出
    };
    
    console.log(`🚨 警报 [${level}]: ${message}`);
    
    // 这里可以集成实际的通知系统
    // 例如: 发送到监控面板、邮件、Slack等
    
    return alert;
  }

  // 获取监控状态
  getStatus() {
    return {
      isMonitoring: this.isMonitoring,
      lastOutputTime: this.lastOutputTime,
      timeSinceLastOutput: Date.now() - this.lastOutputTime,
      outputCount: this.outputHistory.length,
      activeTimeouts: this.timeoutHandlers.size,
      config: this.config
    };
  }

  // 获取产出统计
  getOutputStats() {
    const now = Date.now();
    const lastHour = this.outputHistory.filter(o => o.timestamp > now - 3600000);
    
    return {
      total: this.outputHistory.length,
      lastHour: lastHour.length,
      averageInterval: lastHour.length > 1 
        ? lastHour.reduce((sum, o) => sum + o.duration, 0) / (lastHour.length - 1)
        : 0,
      recentOutputs: this.outputHistory.slice(-10)
    };
  }
}

// 导出单例实例
const timeoutHandler = new TimeoutHandler();

// 模拟使用
if (require.main === module) {
  // 启动监控
  timeoutHandler.startMonitoring();
  
  // 模拟产出
  setTimeout(() => {
    timeoutHandler.recordOutput('design', 'color-system-core.json');
  }, 1000);
  
  setTimeout(() => {
    timeoutHandler.recordOutput('spec', 'component-spec-core.md');
  }, 30000);
  
  // 10分钟后停止监控
  setTimeout(() => {
    timeoutHandler.stopMonitoring();
    console.log('监控测试完成');
  }, 600000);
}

module.exports = timeoutHandler;