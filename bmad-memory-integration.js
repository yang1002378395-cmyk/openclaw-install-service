// BMAD-METHOD 记忆体集成系统

class BMADMemorySystem {
  constructor(bmadConfig) {
    this.config = bmadConfig || {
      version: '6.0.0',
      method: 'workflow',
      project: 'ai-content-platform'
    };
    
    this.memories = [];
    this.agents = {};
    this.workflows = {};
    
    this.init();
  }

  // 初始化系统
  init() {
    this.loadMemories();
    this.setupBMADEventListeners();
    this.recordSystemStartMemory();
  }

  // 加载记忆体
  loadMemories() {
    try {
      const savedMemories = localStorage.getItem('bmad_memories');
      if (savedMemories) {
        this.memories = JSON.parse(savedMemories);
        console.log(`BMAD: 已加载 ${this.memories.length} 个记忆体`);
      }
    } catch (error) {
      console.error('BMAD: 加载记忆体失败:', error);
      this.memories = [];
    }
  }

  // 保存记忆体
  saveMemories() {
    try {
      localStorage.setItem('bmad_memories', JSON.stringify(this.memories));
    } catch (error) {
      console.error('BMAD: 保存记忆体失败:', error);
    }
  }

  // 设置BMAD事件监听器
  setupBMADEventListeners() {
    // 监听BMAD工作流事件
    document.addEventListener('bmad-workflow-start', (event) => {
      this.recordWorkflowMemory(event.detail);
    });

    document.addEventListener('bmad-workflow-complete', (event) => {
      this.recordWorkflowCompletionMemory(event.detail);
    });

    // 监听BMAD代理事件
    document.addEventListener('bmad-agent-start', (event) => {
      this.recordAgentStartMemory(event.detail);
    });

    document.addEventListener('bmad-agent-complete', (event) => {
      this.recordAgentCompletionMemory(event.detail);
    });

    // 监听BMAD决策事件
    document.addEventListener('bmad-decision-made', (event) => {
      this.recordDecisionMemory(event.detail);
    });

    // 监听BMAD协作事件
    document.addEventListener('bmad-collaboration', (event) => {
      this.recordCollaborationMemory(event.detail);
    });

    // 监听BMAD学习事件
    document.addEventListener('bmad-learning', (event) => {
      this.recordLearningMemory(event.detail);
    });
  }

  // 记录系统启动记忆体
  recordSystemStartMemory() {
    const memory = this.createBMADMemory({
      type: 'system',
      bmad: {
        event: 'system_start',
        method: this.config.method,
        version: this.config.version
      },
      content: {
        summary: 'BMAD记忆体系统启动',
        details: `BMAD ${this.config.version} 记忆体系统已初始化`,
        context: '系统启动和配置'
      }
    });

    this.addMemory(memory);
  }

  // 记录工作流记忆体
  recordWorkflowMemory(workflowData) {
    const memory = this.createBMADMemory({
      type: 'workflow',
      bmad: {
        method: 'workflow',
        workflow: workflowData.id,
        phase: workflowData.phase,
        agents: workflowData.agents
      },
      content: {
        summary: `BMAD工作流启动: ${workflowData.name}`,
        details: `阶段: ${workflowData.phase}, 代理: ${workflowData.agents.join(', ')}`,
        context: 'BMAD工作流执行',
        goals: workflowData.goals,
        expected_outcomes: workflowData.expectedOutcomes
      }
    });

    this.addMemory(memory);
    this.showBMADNotification('工作流记忆体已记录', memory.content.summary);
  }

  // 记录工作流完成记忆体
  recordWorkflowCompletionMemory(completionData) {
    const memory = this.createBMADMemory({
      type: 'workflow',
      bmad: {
        method: 'workflow',
        workflow: completionData.id,
        phase: completionData.phase,
        duration: completionData.duration
      },
      content: {
        summary: `BMAD工作流完成: ${completionData.name}`,
        details: `状态: ${completionData.status}, 时长: ${completionData.duration}`,
        context: 'BMAD工作流完成',
        results: completionData.results,
        metrics: completionData.metrics,
        learnings: completionData.learnings
      }
    });

    this.addMemory(memory);
    this.showBMADNotification('工作流完成记忆体已记录', memory.content.summary, 'success');
  }

  // 记录代理启动记忆体
  recordAgentStartMemory(agentData) {
    const memory = this.createBMADMemory({
      type: 'agent',
      bmad: {
        agent_id: agentData.id,
        role: agentData.role,
        task: agentData.task
      },
      content: {
        summary: `BMAD代理启动: ${agentData.name}`,
        details: `角色: ${agentData.role}, 任务: ${agentData.task}`,
        context: 'BMAD代理任务执行',
        capabilities: agentData.capabilities,
        expected_outputs: agentData.expectedOutputs
      }
    });

    this.addMemory(memory);
    
    // 更新代理信息
    if (!this.agents[agentData.id]) {
      this.agents[agentData.id] = {
        id: agentData.id,
        name: agentData.name,
        role: agentData.role,
        tasks: [],
        performance: {}
      };
    }
  }

  // 记录代理完成记忆体
  recordAgentCompletionMemory(completionData) {
    const memory = this.createBMADMemory({
      type: 'agent',
      bmad: {
        agent_id: completionData.id,
        role: completionData.role,
        task: completionData.task,
        duration: completionData.duration
      },
      content: {
        summary: `BMAD代理完成: ${completionData.name}`,
        details: `任务: ${completionData.task}, 状态: ${completionData.status}`,
        context: 'BMAD代理任务完成',
        outputs: completionData.outputs,
        performance: completionData.performance,
        learnings: completionData.learnings
      }
    });

    this.addMemory(memory);
    
    // 更新代理性能数据
    if (this.agents[completionData.id]) {
      this.agents[completionData.id].tasks.push({
        task: completionData.task,
        status: completionData.status,
        duration: completionData.duration,
        performance: completionData.performance
      });
    }
  }

  // 记录决策记忆体
  recordDecisionMemory(decisionData) {
    const memory = this.createBMADMemory({
      type: 'decision',
      bmad: {
        method: decisionData.method || 'workflow',
        phase: decisionData.phase,
        agents: decisionData.agents,
        decision_type: decisionData.decisionType
      },
      content: {
        summary: `BMAD决策: ${decisionData.summary}`,
        details: decisionData.details,
        context: decisionData.context,
        options: decisionData.options,
        chosen_option: decisionData.chosenOption,
        reasoning: decisionData.reasoning,
        expected_impact: decisionData.expectedImpact,
        bmad_implications: decisionData.bmadImplications
      }
    });

    this.addMemory(memory);
    this.showBMADNotification('决策记忆体已记录', memory.content.summary, 'info');
  }

  // 记录协作记忆体
  recordCollaborationMemory(collaborationData) {
    const memory = this.createBMADMemory({
      type: 'collaboration',
      bmad: {
        method: collaborationData.method || 'party-mode',
        agents: collaborationData.agents,
        collaboration_type: collaborationData.type
      },
      content: {
        summary: `BMAD协作: ${collaborationData.summary}`,
        details: collaborationData.details,
        context: collaborationData.context,
        interactions: collaborationData.interactions,
        outcomes: collaborationData.outcomes,
        efficiency: collaborationData.efficiency,
        improvements: collaborationData.improvements
      }
    });

    this.addMemory(memory);
  }

  // 记录学习记忆体
  recordLearningMemory(learningData) {
    const memory = this.createBMADMemory({
      type: 'learning',
      bmad: {
        method: learningData.method,
        phase: learningData.phase,
        learning_type: learningData.learningType
      },
      content: {
        summary: `BMAD学习: ${learningData.summary}`,
        details: learningData.details,
        context: learningData.context,
        situation: learningData.situation,
        action: learningData.action,
        result: learningData.result,
        insights: learningData.insights,
        best_practices: learningData.bestPractices,
        bmad_applications: learningData.bmadApplications
      }
    });

    this.addMemory(memory);
    this.showBMADNotification('学习记忆体已记录', memory.content.summary, 'success');
  }

  // 创建BMAD记忆体
  createBMADMemory(data) {
    const timestamp = new Date().toISOString();
    const memoryId = `bmad-mem-${Date.now()}-${data.type}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id: memoryId,
      type: data.type,
      scope: data.scope || 'project',
      priority: data.priority || 'medium',
      timestamp: timestamp,
      
      bmad: {
        method: data.bmad.method || this.config.method,
        phase: data.bmad.phase || '1',
        agents: data.bmad.agents || [],
        workflow: data.bmad.workflow,
        session: data.bmad.session,
        ...data.bmad
      },
      
      content: {
        summary: data.content.summary || '',
        details: data.content.details || '',
        context: data.content.context || '',
        evidence: data.content.evidence || {},
        impact: data.content.impact || '',
        recommendations: data.content.recommendations || [],
        ...data.content
      },
      
      metadata: {
        created_by: data.metadata?.created_by || 'system',
        created_at: timestamp,
        updated_at: timestamp,
        bmad_version: this.config.version,
        validated: data.metadata?.validated || false
      }
    };
  }

  // 添加记忆体
  addMemory(memory) {
    this.memories.push(memory);
    this.saveMemories();
    this.updateBMADMemoryUI();
    
    // 触发记忆体添加事件
    const event = new CustomEvent('bmad-memory-added', { detail: memory });
    document.dispatchEvent(event);
  }

  // 显示BMAD通知
  showBMADNotification(title, message, type = 'info') {
    const notificationEvent = new CustomEvent('bmad-notification', {
      detail: {
        title: `BMAD: ${title}`,
        message: message,
        type: type
      }
    });
    document.dispatchEvent(notificationEvent);
  }

  // 更新BMAD记忆体UI
  updateBMADMemoryUI() {
    // 更新记忆体计数
    const bmadMemoryCount = document.getElementById('bmadMemoryCount');
    if (bmadMemoryCount) {
      bmadMemoryCount.textContent = this.memories.length;
    }

    // 更新最近BMAD记忆体
    this.updateRecentBMADMemories();
    
    // 更新BMAD统计
    this.updateBMADStats();
  }

  // 更新最近BMAD记忆体
  updateRecentBMADMemories() {
    const bmadMemoriesList = document.getElementById('bmadMemories');
    if (!bmadMemoriesList) return;

    // 获取最近5个BMAD记忆体
    const recentMemories = this.memories
      .slice(-5)
      .reverse();

    bmadMemoriesList.innerHTML = '';

    recentMemories.forEach(memory => {
      const memoryItem = this.createBMADMemoryItem(memory);
      bmadMemoriesList.appendChild(memoryItem);
    });
  }

  // 创建BMAD记忆体项目
  createBMADMemoryItem(memory) {
    const memoryItem = document.createElement('div');
    memoryItem.className = 'bmad-memory-item';
    memoryItem.dataset.memoryId = memory.id;
    
    const typeIcon = this.getBMADTypeIcon(memory.type);
    const methodBadge = this.createBMADMethodBadge(memory.bmad.method);
    
    memoryItem.innerHTML = `
      <div class="bmad-memory-header">
        <div class="bmad-memory-type ${memory.type}">
          ${typeIcon}
        </div>
        <div class="bmad-memory-method">
          ${methodBadge}
        </div>
      </div>
      <div class="bmad-memory-content">
        <div class="bmad-memory-summary">${memory.content.summary}</div>
        <div class="bmad-memory-meta">
          <span class="bmad-memory-phase">阶段 ${memory.bmad.phase}</span>
          <span class="bmad-memory-time">${this.formatBMADTime(memory.timestamp)}</span>
        </div>
      </div>
    `;
    
    memoryItem.addEventListener('click', () => {
      this.showBMADMemoryDetail(memory);
    });
    
    return memoryItem;
  }

  // 获取BMAD类型图标
  getBMADTypeIcon(type) {
    const icons = {
      workflow: '🔄',
      agent: '🤖',
      decision: '📋',
      collaboration: '🤝',
      learning: '🧠',
      system: '⚙️'
    };
    return icons[type] || '📝';
  }

  // 创建BMAD方法徽章
  createBMADMethodBadge(method) {
    const badges = {
      'workflow': '<span class="badge-workflow">工作流</span>',
      'party-mode': '<span class="badge-party">Party Mode</span>',
      'brainstorming': '<span class="badge-brainstorm">头脑风暴</span>'
    };
    return badges[method] || `<span class="badge-default">${method}</span>`;
  }

  // 格式化BMAD时间
  formatBMADTime(timestamp) {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  // 显示BMAD记忆体详情
  showBMADMemoryDetail(memory) {
    const detailHtml = this.createBMADMemoryDetailHTML(memory);
    
    // 创建覆盖层
    const overlay = document.createElement('div');
    overlay.className = 'bmad-memory-detail-overlay';
    overlay.innerHTML = detailHtml;
    
    document.body.appendChild(overlay);
    
    // 点击背景关闭
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });
  }

  // 创建BMAD记忆体详情HTML
  createBMADMemoryDetailHTML(memory) {
    const typeName = this.getBMADTypeName(memory.type);
    const agentsList = memory.bmad.agents.length > 0 
      ? memory.bmad.agents.map(agent => `<span class="agent-tag">${agent}</span>`).join('')
      : '<span class="no-agents">无指定代理</span>';
    
    return `
      <div class="bmad-memory-detail">
        <div class="bmad-memory-detail-header">
          <div class="detail-type ${memory.type}">
            ${this.getBMADTypeIcon(memory.type)} ${typeName}
          </div>
          <div class="detail-priority ${memory.priority}">${memory.priority}</div>
        </div>
        
        <div class="bmad-memory-title">${memory.content.summary}</div>
        
        <div class="bmad-memory-info">
          <div class="info-section">
            <h4>BMAD信息</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">方法:</span>
                <span class="info-value">${memory.bmad.method}</span>
              </div>
              <div class="info-item">
                <span class="info-label">阶段:</span>
                <span class="info-value">${memory.bmad.phase}</span>
              </div>
              <div class="info-item">
                <span class="info-label">时间:</span>
                <span class="info-value">${new Date(memory.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          ${memory.bmad.agents.length > 0 ? `
          <div class="info-section">
            <h4>参与代理</h4>
            <div class="agents-list">${agentsList}</div>
          </div>
          ` : ''}
        </div>
        
        <div class="bmad-memory-content-detail">
          <h4>详细内容</h4>
          <p>${memory.content.details}</p>
        </div>
        
        ${memory.content.context ? `
        <div class="bmad-memory-context">
          <h4>上下文</h4>
          <p>${memory.content.context}</p>
        </div>
        ` : ''}
        
        ${memory.content.learnings || memory.content.insights ? `
        <div class="bmad-memory-learnings">
          <h4>学习与洞察</h4>
          <ul>
            ${(memory.content.learnings || memory.content.insights || []).map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
        
        <div class="bmad-memory-actions">
          <button class="btn-close" onclick="this.closest('.bmad-m