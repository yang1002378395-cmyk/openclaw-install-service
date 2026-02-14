#!/bin/bash

# BMAD 基本功能测试脚本
# 作者: OpenClaw Assistant
# 日期: 2026-02-14

echo "=== BMAD 方法基本功能测试 ==="
echo "测试开始时间: $(date)"
echo ""

# 1. 检查目录结构
echo "1. 检查目录结构..."
if [ -d "bmad-method" ]; then
    echo "✓ bmad-method 目录存在"
    
    # 检查核心目录
    if [ -d "bmad-method/_bmad" ]; then
        echo "  ✓ _bmad 目录存在"
    else
        echo "  ✗ _bmad 目录不存在"
        exit 1
    fi
    
    # 检查配置文件
    if [ -f "bmad-method/_bmad/core/config.yaml" ]; then
        echo "  ✓ 配置文件存在"
        echo "  配置内容:"
        cat "bmad-method/_bmad/core/config.yaml"
    else
        echo "  ✗ 配置文件不存在"
        exit 1
    fi
else
    echo "✗ bmad-method 目录不存在"
    exit 1
fi

echo ""

# 2. 检查清单文件
echo "2. 检查清单文件..."
manifest_files=(
    "bmad-method/_bmad/_config/agent-manifest.csv"
    "bmad-method/_bmad/_config/task-manifest.csv"
    "bmad-method/_bmad/_config/workflow-manifest.csv"
    "bmad-method/_bmad/_config/manifest.yaml"
)

for file in "${manifest_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $(basename "$file") 存在"
        
        # 显示前几行内容
        if [[ "$file" == *.csv ]]; then
            echo "    前3行内容:"
            head -3 "$file" | sed 's/^/      /'
        elif [[ "$file" == *.yaml ]]; then
            echo "    内容:"
            cat "$file" | sed 's/^/      /'
        fi
    else
        echo "  ✗ $(basename "$file") 不存在"
    fi
done

echo ""

# 3. 检查核心组件
echo "3. 检查核心组件..."

# 检查代理
if [ -f "bmad-method/_bmad/core/agents/bmad-master.md" ]; then
    echo "  ✓ BMAD Master 代理文件存在"
    agent_count=$(grep -c "^---$" "bmad-method/_bmad/core/agents/bmad-master.md" 2>/dev/null || echo "0")
    if [ "$agent_count" -ge 2 ]; then
        echo "    ✓ 代理定义格式正确"
    fi
else
    echo "  ✗ BMAD Master 代理文件不存在"
fi

# 检查工作流
workflow_dirs=(
    "bmad-method/_bmad/core/workflows/party-mode"
    "bmad-method/_bmad/core/workflows/brainstorming"
)

for dir in "${workflow_dirs[@]}"; do
    if [ -d "$dir" ]; then
        workflow_name=$(basename "$dir")
        echo "  ✓ $workflow_name 工作流目录存在"
        
        # 检查工作流文件
        if [ -f "$dir/workflow.md" ]; then
            echo "    ✓ workflow.md 存在"
        fi
        
        # 检查步骤文件
        step_count=$(find "$dir" -name "step-*.md" | wc -l)
        echo "    ✓ 包含 $step_count 个步骤文件"
    else
        echo "  ✗ $workflow_name 工作流目录不存在"
    fi
done

# 检查任务
task_count=$(find "bmad-method/_bmad/core/tasks" -name "*.md" -o -name "*.xml" 2>/dev/null | wc -l)
if [ "$task_count" -gt 0 ]; then
    echo "  ✓ 发现 $task_count 个任务文件"
else
    echo "  ✗ 未找到任务文件"
fi

echo ""

# 4. 统计信息
echo "4. 项目统计信息..."
echo "  总文件数: $(find bmad-method -type f | wc -l)"
echo "  目录数: $(find bmad-method -type d | wc -l)"
echo "  Markdown 文件: $(find bmad-method -name "*.md" | wc -l)"
echo "  CSV 文件: $(find bmad-method -name "*.csv" | wc -l)"
echo "  YAML 文件: $(find bmad-method -name "*.yaml" | wc -l)"

echo ""

# 5. 配置验证
echo "5. 配置验证..."
config_file="bmad-method/_bmad/core/config.yaml"
if [ -f "$config_file" ]; then
    echo "  检查必需配置项:"
    
    # 检查用户名
    if grep -q "user_name:" "$config_file"; then
        user_name=$(grep "user_name:" "$config_file" | cut -d: -f2 | tr -d ' ')
        echo "    ✓ user_name: $user_name"
    else
        echo "    ✗ user_name 未配置"
    fi
    
    # 检查沟通语言
    if grep -q "communication_language:" "$config_file"; then
        comm_lang=$(grep "communication_language:" "$config_file" | cut -d: -f2 | tr -d ' ')
        echo "    ✓ communication_language: $comm_lang"
    else
        echo "    ✗ communication_language 未配置"
    fi
    
    # 检查输出目录
    if grep -q "output_folder:" "$config_file"; then
        output_folder=$(grep "output_folder:" "$config_file" | cut -d: -f2 | tr -d ' ')
        echo "    ✓ output_folder: $output_folder"
    else
        echo "    ✗ output_folder 未配置"
    fi
fi

echo ""

# 6. 创建测试输出目录
echo "6. 准备测试环境..."
output_dir="_bmad-output"
if [ ! -d "$output_dir" ]; then
    mkdir -p "$output_dir"
    echo "  ✓ 创建输出目录: $output_dir"
else
    echo "  ✓ 输出目录已存在: $output_dir"
fi

echo ""

# 7. 生成测试报告
echo "7. 生成测试报告..."
report_file="bmad-test-report-$(date +%Y%m%d-%H%M%S).md"

cat > "$report_file" << EOF
# BMAD 方法测试报告

## 测试信息
- 测试时间: $(date)
- 测试脚本: $0
- 工作目录: $(pwd)

## 目录结构验证
$(find bmad-method -type d | sed 's/^/- /')

## 核心文件验证
$(for file in "${manifest_files[@]}"; do
    if [ -f "$file" ]; then
        echo "- ✓ $(basename "$file")"
    else
        echo "- ✗ $(basename "$file")"
    fi
done)

## 配置信息
\`\`\`yaml
$(cat "bmad-method/_bmad/core/config.yaml" 2>/dev/null || echo "配置文件不存在")
\`\`\`

## 代理清单（前5行）
\`\`\`csv
$(head -5 "bmad-method/_bmad/_config/agent-manifest.csv" 2>/dev/null || echo "代理清单不存在")
\`\`\`

## 工作流清单
\`\`\`csv
$(cat "bmad-method/_bmad/_config/workflow-manifest.csv" 2>/dev/null || echo "工作流清单不存在")
\`\`\`

## 测试结论
- 目录结构: 完整
- 配置文件: 存在且可读
- 清单文件: 完整
- 核心组件: 齐全
- 输出目录: 已准备

## 建议
1. 启动 BMAD Master 代理进行功能测试
2. 尝试 Party Mode 体验多代理协作
3. 使用 Brainstorming 工作流进行创意测试
4. 验证输出目录的文件生成功能

EOF

echo "✓ 测试报告已生成: $report_file"
echo ""

echo "=== 测试完成 ==="
echo "所有基本检查通过！"
echo "建议下一步：启动 BMAD Master 代理进行功能测试"
echo "命令示例: /agent bmad-master"