// BMAD-METHOD 记忆体系统 - 完整实现

// 继续 BMADMemorySystem 类
BMADMemorySystem.prototype.createBMADMemoryDetailHTML = function(memory) {
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
        <button class="btn-close" onclick="this.closest('.bmad-memory-detail-overlay').remove()">关闭</button>
      </div>
    </div>
  `;
};

// 获取BMAD类型名称
BMADMemorySystem.prototype.getBMADTypeName = function(type) {
  const names = {
    workflow: '工作流',
    agent: '代理',
    decision: '决策',
    collaboration: '协作',
    learning: '学习',
    system: '系统'
  };
  return names[type] || type;
};

// 查询BMAD记忆体
BMADMemorySystem.prototype.queryBMADMemories = function(query) {
  const { type, method, phase, agent, search } = query || {};
  
  return this.memories.filter(memory => {
    // 类型过滤
    if (type && type.length > 0 && !type.includes(memory.type)) {
      return false;
    }
    
    // 方法过滤
    if (method && method.length > 0 && !method.includes(memory.bmad.method)) {
      return false;
    }
    
    // 阶段过滤
    if (phase && phase.length > 0 && !phase.includes(memory.bmad.phase)) {
      return false;
    }
    
    // 代理过滤
    if (agent && agent.length > 0) {
      const hasAgent = agent.some(a => memory.bmad.agents.includes(a));
      if (!hasAgent) return false;
    }
    
    // 搜索过滤
    if (search) {
      const searchLower = search.toLowerCase();
      const inSummary = memory.content.summary.toLowerCase().includes(searchLower);
      const inDetails = memory.content.details.toLowerCase().includes(searchLower);
      
      if (!inSummary && !inDetails) {
        return false;
      }
    }
    
    return true;
  });
};

// 获取BMAD统计
BMADMemorySystem.prototype.getBMADStats = function() {
  const stats = {
    total: this.memories.length,
    byType: {},
    byMethod: {},
    byPhase: {},
    byAgent: {}
  };
  
  this.memories.forEach(memory => {
    // 按类型统计
    stats.byType[memory.type] = (stats.byType[memory.type] || 0) + 1;
    
    // 按方法统计
    stats.byMethod[memory.bmad.method] = (stats.byMethod[memory.bmad.method] || 0) + 1;
    
    // 按阶段统计
    stats.byPhase[memory.bmad.phase] = (stats.byPhase[memory.bmad.phase] || 0) + 1;
    
    // 按代理统计
    memory.bmad.agents.forEach(agent => {
      stats.byAgent[agent] = (stats.byAgent[agent] || 0) + 1;
    });
  });
  
  return stats;
};

// 更新BMAD统计
BMADMemorySystem.prototype.updateBMADStats = function() {
  const stats = this.getBMADStats();
  const statsContainer = document.getElementById('bmadStats');
  
  if (!statsContainer) return;
  
  const statItems = [
    { label: '工作流', value: stats.byType.workflow || 0, type: 'workflow' },
    { label: '代理', value: stats.byType.agent || 0, type: 'agent' },
    { label: '决策', value: stats.byType.decision || 0, type: 'decision' },
    { label: '学习', value: stats.byType.learning || 0, type: 'learning' }
  ];
  
  statsContainer.innerHTML = statItems.map(stat => `
    <div class="bmad-stat">
      <div class="stat-label">${stat.label}</div>
      <div class="stat-value">${stat.value}</div>
      <div class="stat-type">${stat.type}</div>
    </div>
  `).join('');
};

// 分析BMAD效率
BMADMemorySystem.prototype.analyzeBMADEfficiency = function() {
  const workflowMemories = this.queryBMADMemories({ type: ['workflow'] });
  const agentMemories = this.queryBMADMemories({ type: ['agent'] });
  
  const analysis = {
    workflow_efficiency: this.calculateWorkflowEfficiency(workflowMemories),
    agent_productivity: this.calculateAgentProductivity(agentMemories),
    collaboration_patterns: this.identifyCollaborationPatterns(),
    decision_quality: this.evaluateDecisionQuality()
  };
  
  return this.generateBMADRecommendations(analysis);
};

// 计算工作流效率
BMADMemorySystem.prototype.calculateWorkflowEfficiency = function(workflowMemories) {
  if (workflowMemories.length === 0) return {};
  
  const completions = workflowMemories.filter(m => m.content.status === 'completed');
  const avgDuration = completions.reduce((sum, m) => {
    return sum + (m.bmad.duration || 0);
  }, 0) / completions.length;
  
  return {
    total_workflows: workflowMemories.length,
    completed_workflows: completions.length,
    completion_rate: completions.length / workflowMemories.length,
    average_duration: avgDuration,
    efficiency_score: this.calculateEfficiencyScore(completions)
  };
};

// 计算代理生产力
BMADMemorySystem.prototype.calculateAgentProductivity = function(agentMemories) {
  const agentPerformance = {};
  
  agentMemories.forEach(memory => {
    const agentId = memory.bmad.agent_id;
    if (!agentId) return;
    
    if (!agentPerformance[agentId]) {
      agentPerformance[agentId] = {
        tasks: 0,
        completed: 0,
        total_duration: 0,
        performance_scores: []
      };
    }
    
    agentPerformance[agentId].tasks++;
    
    if (memory.content.status === 'completed') {
      agentPerformance[agentId].completed++;
      agentPerformance[agentId].total_duration += (memory.bmad.duration || 0);
      
      if (memory.content.performance) {
        agentPerformance[agentId].performance_scores.push(memory.content.performance.score || 0);
      }
    }
  });
  
  // 计算每个代理的平均性能
  Object.keys(agentPerformance).forEach(agentId => {
    const perf = agentPerformance[agentId];
    perf.completion_rate = perf.completed / perf.tasks;
    perf.average_duration = perf.total_duration / perf.completed || 0;
    perf.average_score = perf.performance_scores.length > 0 
      ? perf.performance_scores.reduce((a, b) => a + b) / perf.performance_scores.length
      : 0;
  });
  
  return agentPerformance;
};

// 识别协作模式
BMADMemorySystem.prototype.identifyCollaborationPatterns = function() {
  const collaborationMemories = this.queryBMADMemories({ type: ['collaboration'] });
  
  const patterns = {
    frequent_pairs: this.findFrequentAgentPairs(collaborationMemories),
    effective_methods: this.identifyEffectiveMethods(collaborationMemories),
    common_challenges: this.extractCommonChallenges(collaborationMemories),
    success_factors: this.identifySuccessFactors(collaborationMemories)
  };
  
  return patterns;
};

// 评估决策质量
BMADMemorySystem.prototype.evaluateDecisionQuality = function() {
  const decisionMemories = this.queryBMADMemories({ type: ['decision'] });
  
  const evaluation = {
    total_decisions: decisionMemories.length,
    by_method: this.groupDecisionsByMethod(decisionMemories),
    by_phase: this.groupDecisionsByPhase(decisionMemories),
    outcome_analysis: this.analyzeDecisionOutcomes(decisionMemories),
    improvement_areas: this.identifyDecisionImprovementAreas(decisionMemories)
  };
  
  return evaluation;
};

// 生成BMAD推荐
BMADMemorySystem.prototype.generateBMADRecommendations = function(analysis) {
  const recommendations = [];
  
  // 基于工作流效率的推荐
  if (analysis.workflow_efficiency.completion_rate < 0.8) {
    recommendations.push({
      type: 'workflow_optimization',
      priority: 'high',
      suggestion: '优化工作流设计，增加进度检查点',
      rationale: `工作流完成率 ${(analysis.workflow_efficiency.completion_rate * 100).toFixed(1)}% 低于目标`
    });
  }
  
  // 基于代理生产力的推荐
  Object.keys(analysis.agent_productivity).forEach(agentId => {
    const perf = analysis.agent_productivity[agentId];
    if (perf.completion_rate < 0.7) {
      recommendations.push({
        type: 'agent_support',
        priority: 'medium',
        suggestion: `为代理 ${agentId} 提供额外支持或培训`,
        rationale: `代理完成率 ${(perf.completion_rate * 100).toFixed(1)}% 较低`
      });
    }
  });
  
  // 基于协作模式的推荐
  if (analysis.collaboration_patterns.common_challenges.length > 0) {
    recommendations.push({
      type: 'collaboration_improvement',
      priority: 'medium',
      suggestion: '改进代理间协作机制',
      rationale: `识别到 ${analysis.collaboration_patterns.common_challenges.length} 个常见协作挑战`
    });
  }
  
  return recommendations;
};

// 导出BMAD记忆体
BMADMemorySystem.prototype.exportBMADMemories = function(format = 'json') {
  switch (format) {
    case 'json':
      return JSON.stringify({
        bmad_version: this.config.version,
        export_date: new Date().toISOString(),
        memories: this.memories
      }, null, 2);
    case 'csv':
      return this.exportBMADToCSV();
    default:
      return JSON.stringify(this.memories);
  }
};

// 导出为CSV
BMADMemorySystem.prototype.exportBMADToCSV = function() {
  if (this.memories.length === 0) return '';
  
  const headers = ['ID', '类型', 'BMAD方法', '阶段', '代理', '摘要', '时间', '优先级'];
  const rows = this.memories.map(memory => [
    memory.id,
    memory.type,
    memory.bmad.method,
    memory.bmad.phase,
    memory.bmad.agents.join('; '),
    memory.content.summary,
    new Date(memory.timestamp).toLocaleString(),
    memory.priority
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
};

// 导入BMAD记忆体
BMADMemorySystem.prototype.importBMADMemories = function(data, format = 'json') {
  try {
    let importedData;
    
    switch (format) {
      case 'json':
        importedData = JSON.parse(data);
        break;
      case 'csv':
        importedData = this.importBMADFromCSV(data);
        break;
      default:
        throw new Error('不支持的格式');
    }
    
    let memories;
    if (importedData.memories && Array.isArray(importedData.memories)) {
      memories = importedData.memories;
    } else if (Array.isArray(importedData)) {
      memories = importedData;
    } else {
      throw new Error('无效的记忆体数据格式');
    }
    
    // 验证并添加记忆体
    const validMemories = memories.filter(memory => this.validateBMADMemory(memory));
    this.memories.push(...validMemories);
    this.saveMemories();
    this.updateBMADMemoryUI();
    
    return {
      success: true,
      imported: validMemories.length,
      total: this.memories.length
    };
  } catch (error) {
    console.error('导入BMAD记忆体失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 验证BMAD记忆体
BMADMemorySystem.prototype.validateBMADMemory = function(memory) {
  const requiredFields = ['id', 'type', 'bmad', 'content', 'timestamp'];
  const requiredBMADFields = ['method', 'phase'];
  
  // 检查必需字段
  for (const field of requiredFields) {
    if (!memory[field]) return false;
  }
  
  // 检查BMAD字段
  for (const field of requiredBMADFields) {
    if (!memory.bmad[field]) return false;
  }
  
  // 检查内容字段
  if (!memory.content.summary) return false;
  
  return true;
};

// 从CSV导入
BMADMemorySystem.prototype.importBMADFromCSV = function(csvData) {
  const lines = csvData.split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  
  const memories = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    const values = line.split(',').map(v => v.replace(/^"|"$/g, '').trim());
    
    const memory = {
      id: values[0] || `bmad-import-${Date.now()}-${i}`,
      type: values[1] || 'learning',
      bmad: {
        method: values[2] || 'workflow',
        phase: values[3] || '1',
        agents: values[4] ? values[4].split(';').map(a => a.trim()) : []
      },
      content: {
        summary: values[5] || '导入的BMAD记忆体',
        details: '',
        context: ''
      },
      timestamp: new Date(values[6]).toISOString() || new Date().toISOString(),
      priority: values[7] || 'medium',
      metadata: {
        created_by: 'import',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        bmad_version: this.config.version,
        validated: false
      }
    };
    
    memories.push(memory);
  }
  
  return memories;
};

// 清除所有BMAD记忆体
BMADMemorySystem.prototype.clearAllBMADMemories = function() {
  if (confirm('确定要清除所有BMAD记忆体吗？此操作不可撤销。')) {
    this.memories = [];
    this.saveMemories();
    this.updateBMADMemoryUI();
    return true;
  }
  return false;
};

// 记录当前项目状态到BMAD记忆体
BMADMemorySystem.prototype.recordCurrentProjectState = function() {
  const currentTime = new Date().toISOString();
  
  // 记录项目状态记忆体
  const projectMemory = this.createBMADMemory({
    type: 'workflow',
    bmad: {
      method: 'workflow',
      phase: '1',
      agents: ['supervisor', 'product-planner', 'ux-designer', 'backend-arch', 'frontend-dev', 'ai-specialist', 'test-quality'],
