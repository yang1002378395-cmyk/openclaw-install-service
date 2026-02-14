// AI 内容生产平台 - 记忆体集成系统

class MemorySystem {
  constructor() {
    this.memories = [];
    this.loadMemories();
    this.setupMemoryTriggers();
  }

  // 加载现有记忆体
  loadMemories() {
    try {
      const savedMemories = localStorage.getItem('ai_platform_memories');
      if (savedMemories) {
        this.memories = JSON.parse(savedMemories);
        console.log(`已加载 ${this.memories.length} 个记忆体`);
      }
    } catch (error) {
      console.error('加载记忆体失败:', error);
      this.memories = [];
    }
  }

  // 保存记忆体到本地存储
  saveMemories() {
    try {
      localStorage.setItem('ai_platform_memories', JSON.stringify(this.memories));
      console.log('记忆体已保存');
    } catch (error) {
      console.error('保存记忆体失败:', error);
    }
  }

  // 设置记忆体触发器
  setupMemoryTriggers() {
    // 监听进度更新
    document.addEventListener('progressUpdated', (event) => {
      this.recordProgressMemory(event.detail);
    });

    // 监听任务完成
    document.addEventListener('taskCompleted', (event) => {
      this.recordTaskMemory(event.detail);
    });

    // 监听问题发生
    document.addEventListener('issueOccurred', (event) => {
      this.recordIssueMemory(event.detail);
    });

    // 监听决策制定
    document.addEventListener('decisionMade', (event) => {
      this.recordDecisionMemory(event.detail);
    });
  }

  // 记录进度记忆体
  recordProgressMemory(progressData) {
    const memory = {
      memory_id: `mem_${Date.now()}_progress`,
      type: 'learning',
      phase: 'phase_1',
      timestamp: new Date().toISOString(),
      agent: 'supervisor',
      priority: 'medium',
      tags: ['进度跟踪', '项目管理', '效率分析'],
      content: {
        summary: `项目进度更新至 ${progressData.progress}%`,
        details: `阶段: ${progressData.phase}, 状态: ${progressData.status}`,
        context: '第一阶段项目初始化与规划',
        evidence: progressData,
        impact: '帮助团队了解项目进展，调整工作计划',
        references: ['progress-overlay.html', 'phase1-summary-report.md']
      },
      metadata: {
        created_by: 'supervisor',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: '1.0',
        status: 'active'
      }
    };

    this.addMemory(memory);
    this.showMemoryNotification('进度记忆体已记录', memory.content.summary);
  }

  // 记录任务记忆体
  recordTaskMemory(taskData) {
    const memory = {
      memory_id: `mem_${Date.now()}_task`,
      type: 'expertise',
      phase: taskData.phase || 'phase_1',
      timestamp: new Date().toISOString(),
      agent: taskData.agent,
      priority: taskData.priority || 'medium',
      tags: ['任务完成', '技能验证', '代理绩效'],
      content: {
        summary: `${taskData.agent} 完成 ${taskData.task}`,
        details: `进度: ${taskData.progress}%, 状态: ${taskData.status}`,
        context: taskData.context || '项目任务执行',
        evidence: taskData,
        impact: '记录代理工作成果，评估工作效率',
        references: taskData.references || []
      },
      metadata: {
        created_by: 'supervisor',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: '1.0',
        status: 'active'
      }
    };

    this.addMemory(memory);
    this.showMemoryNotification('任务记忆体已记录', memory.content.summary);
  }

  // 记录问题记忆体
  recordIssueMemory(issueData) {
    const memory = {
      memory_id: `mem_${Date.now()}_issue`,
      type: 'issue',
      phase: issueData.phase || 'phase_1',
      timestamp: new Date().toISOString(),
      agent: issueData.agent || 'system',
      priority: issueData.severity || 'medium',
      tags: ['问题记录', '风险管理', '解决方案'],
      content: {
        summary: issueData.summary || '发现问题',
        details: issueData.details || '',
        context: issueData.context || '项目执行过程',
        evidence: issueData.evidence || {},
        impact: issueData.impact || '需要关注和解决',
        references: issueData.references || [],
        solution: issueData.solution || {},
        prevention: issueData.prevention || []
      },
      metadata: {
        created_by: issueData.reported_by || 'system',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: '1.0',
        status: issueData.resolved ? 'resolved' : 'active'
      }
    };

    this.addMemory(memory);
    this.showMemoryNotification('问题记忆体已记录', memory.content.summary, 'warning');
  }

  // 记录决策记忆体
  recordDecisionMemory(decisionData) {
    const memory = {
      memory_id: `mem_${Date.now()}_decision`,
      type: 'decision',
      phase: decisionData.phase || 'phase_1',
      timestamp: new Date().toISOString(),
      agent: decisionData.agent || 'supervisor',
      priority: decisionData.priority || 'high',
      tags: ['技术决策', '架构选择', '工具选型'],
      content: {
        summary: decisionData.summary || '重要决策制定',
        details: decisionData.details || '',
        context: decisionData.context || '项目技术选型',
        evidence: decisionData.evidence || {},
        impact: decisionData.impact || '影响项目技术方向',
        references: decisionData.references || [],
        options: decisionData.options || [],
        chosen_option: decisionData.chosen_option || '',
        reasoning: decisionData.reasoning || '',
        decision_makers: decisionData.decision_makers || []
      },
      metadata: {
        created_by: decisionData.made_by || 'supervisor',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: '1.0',
        status: 'active'
      }
    };

    this.addMemory(memory);
    this.showMemoryNotification('决策记忆体已记录', memory.content.summary, 'info');
  }

  // 添加记忆体
  addMemory(memory) {
    this.memories.push(memory);
    this.saveMemories();
    this.updateMemoryUI();
    
    // 触发记忆体添加事件
    const event = new CustomEvent('memoryAdded', { detail: memory });
    document.dispatchEvent(event);
  }

  // 显示记忆体通知
  showMemoryNotification(title, message, type = 'info') {
    const notificationEvent = new CustomEvent('showNotification', {
      detail: {
        title: `记忆体: ${title}`,
        message: message,
        type: type
      }
    });
    document.dispatchEvent(notificationEvent);
  }

  // 更新记忆体UI
  updateMemoryUI() {
    // 更新记忆体计数
    const memoryCount = document.getElementById('memoryCount');
    if (memoryCount) {
      memoryCount.textContent = this.memories.length;
    }

    // 更新最近记忆体列表
    this.updateRecentMemories();
  }

  // 更新最近记忆体列表
  updateRecentMemories() {
    const recentMemoriesList = document.getElementById('recentMemories');
    if (!recentMemoriesList) return;

    // 获取最近5个记忆体
    const recentMemories = this.memories
      .slice(-5)
      .reverse();

    recentMemoriesList.innerHTML = '';

    recentMemories.forEach(memory => {
      const memoryItem = document.createElement('div');
      memoryItem.className = 'memory-item';
      memoryItem.innerHTML = `
        <div class="memory-type ${memory.type}">${this.getTypeIcon(memory.type)}</div>
        <div class="memory-content">
          <div class="memory-summary">${memory.content.summary}</div>
          <div class="memory-meta">
            <span class="memory-agent">${memory.agent}</span>
            <span class="memory-time">${this.formatTime(memory.timestamp)}</span>
          </div>
        </div>
      `;
      
      memoryItem.addEventListener('click', () => {
        this.showMemoryDetail(memory);
      });
      
      recentMemoriesList.appendChild(memoryItem);
    });
  }

  // 获取类型图标
  getTypeIcon(type) {
    const icons = {
      decision: '📋',
      learning: '🧠',
      issue: '⚠️',
      expertise: '🎯',
      collaboration: '🤝',
      performance: '📈',
      architecture: '🏗️',
      code: '💻',
      deployment: '🚀'
    };
    return icons[type] || '📝';
  }

  // 格式化时间
  formatTime(timestamp) {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  // 显示记忆体详情
  showMemoryDetail(memory) {
    const detailHtml = `
      <div class="memory-detail">
        <div class="memory-header">
          <div class="memory-type-badge ${memory.type}">
            ${this.getTypeIcon(memory.type)} ${this.getTypeName(memory.type)}
          </div>
          <div class="memory-priority ${memory.priority}">${memory.priority}</div>
        </div>
        
        <div class="memory-title">${memory.content.summary}</div>
        
        <div class="memory-info">
          <div class="info-item">
            <span class="info-label">代理:</span>
            <span class="info-value">${memory.agent}</span>
          </div>
          <div class="info-item">
            <span class="info-label">阶段:</span>
            <span class="info-value">${memory.phase}</span>
          </div>
          <div class="info-item">
            <span class="info-label">时间:</span>
            <span class="info-value">${new Date(memory.timestamp).toLocaleString()}</span>
          </div>
        </div>
        
        <div class="memory-content-detail">
          <h4>详细内容</h4>
          <p>${memory.content.details}</p>
        </div>
        
        ${memory.content.context ? `
        <div class="memory-context">
          <h4>上下文</h4>
          <p>${memory.content.context}</p>
        </div>
        ` : ''}
        
        ${memory.tags.length > 0 ? `
        <div class="memory-tags">
          <h4>标签</h4>
          <div class="tags-list">
            ${memory.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        </div>
        ` : ''}
        
        <div class="memory-actions">
          <button class="btn-close" onclick="this.closest('.memory-detail-overlay').remove()">关闭</button>
        </div>
      </div>
    `;

    // 创建覆盖层
    const overlay = document.createElement('div');
    overlay.className = 'memory-detail-overlay';
    overlay.innerHTML = detailHtml;
    
    document.body.appendChild(overlay);
    
    // 点击背景关闭
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });
  }

  // 获取类型名称
  getTypeName(type) {
    const names = {
      decision: '决策',
      learning: '学习',
      issue: '问题',
      expertise: '专业',
      collaboration: '协作',
      performance: '绩效',
      architecture: '架构',
      code: '代码',
      deployment: '部署'
    };
    return names[type] || type;
  }

  // 查询记忆体
  queryMemories(query) {
    const { type, phase, agent, tags, search } = query || {};
    
    return this.memories.filter(memory => {
      // 类型过滤
      if (type && type.length > 0 && !type.includes(memory.type)) {
        return false;
      }
      
      // 阶段过滤
      if (phase && phase.length > 0 && !phase.includes(memory.phase)) {
        return false;
      }
      
      // 代理过滤
      if (agent && agent.length > 0 && !agent.includes(memory.agent)) {
        return false;
      }
      
      // 标签过滤
      if (tags && tags.length > 0) {
        const hasTag = tags.some(tag => memory.tags.includes(tag));
        if (!hasTag) return false;
      }
      
      // 搜索过滤
      if (search) {
        const searchLower = search.toLowerCase();
        const inSummary = memory.content.summary.toLowerCase().includes(searchLower);
        const inDetails = memory.content.details.toLowerCase().includes(searchLower);
        const inTags = memory.tags.some(tag => tag.toLowerCase().includes(searchLower));
        
        if (!inSummary && !inDetails && !inTags) {
          return false;
        }
      }
      
      return true;
    });
  }

  // 获取记忆体统计
  getMemoryStats() {
    const stats = {
      total: this.memories.length,
      byType: {},
      byPhase: {},
      byAgent: {},
      byPriority: {}
    };
    
    this.memories.forEach(memory => {
      // 按类型统计
      stats.byType[memory.type] = (stats.byType[memory.type] || 0) + 1;
      
      // 按阶段统计
      stats.byPhase[memory.phase] = (stats.byPhase[memory.phase] || 0) + 1;
      
      // 按代理统计
      stats.byAgent[memory.agent] = (stats.byAgent[memory.agent] || 0) + 1;
      
      // 按优先级统计
      stats.byPriority[memory.priority] = (stats.byPriority[memory.priority] || 0) + 1;
    });
    
    return stats;
  }

  // 导出记忆体
  exportMemories(format = 'json') {
    switch (format) {
      case 'json':
        return JSON.stringify(this.memories, null, 2);
      case 'csv':
        return this.exportToCSV();
      default:
        return JSON.stringify(this.memories);
    }
  }

  // 导出为CSV
  exportToCSV() {
    if (this.memories.length === 0) return '';
    
    const headers = ['ID', '类型', '阶段', '代理', '优先级', '摘要', '时间', '标签'];
    const rows = this.memories.map(memory => [
      memory.memory_id,
      memory.type,
      memory.phase,
      memory.agent,
      memory.priority,
      memory.content.summary,
      new Date(memory.timestamp).toLocaleString(),
      memory.tags.join('; ')
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    return csvContent;
  }

  // 导入记忆体
  importMemories(data, format = 'json') {
    try {
      let importedMemories;
      
      switch (format) {
        case 'json':
          importedMemories = JSON.parse(data);
          break;
        case 'csv':
          importedMemories = this.importFromCSV(data);
          break;
        default:
          throw new Error('不支持的格式');
      }
      
      if (Array.isArray(importedMemories)) {
        this.memories.push(...importedMemories);
        this.saveMemories();
        this.updateMemoryUI();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('导入记忆体失败:', error);
      return false;
    }
  }

  // 从CSV导入
  importFromCSV(csvData) {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    
    const memories = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      
      const values = line.split(',').map(v => v.replace(/^"|"$/g, '').trim());
      const memory = {
        memory_id: values[0] || `mem_import_${Date.now()}_${i}`,
        type: values[1] || 'learning',
        phase: values[2] || 'phase_1',
        agent: values[3] || 'system',
        priority: values[4] || 'medium',
        content: {
          summary: values[5] || '导入的记忆体',
          details: '',
          context: '',
          evidence: {},
          impact: '',
          references: []
        },
        timestamp: new Date(values[6]).toISOString() || new Date().toISOString(),
        tags: values[7] ? values[7].split(';').map(t => t.trim()) : [],
        metadata: {
          created_by: 'import',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          version: '1.0',
          status: 'active'
        }
      };
      
      memories.push(memory);
    }
    
    return memories;
  }

  // 清除所有记忆体
  clearAllMemories() {
    if (confirm('确定要清除所有记忆体吗？此操作不可撤销。')) {
      this.mem