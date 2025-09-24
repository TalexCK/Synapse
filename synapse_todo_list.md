# Synapse 项目 · 详细待办清单（Tauri + React + Vite + Headless UI + OpenRouter + MCP + Codex 自动化）

> 约定：
> - **Plan（先做计划）**：每次调用 Codex 前，先用 ChatGPT Web 生成一个微型执行计划（Prompt 已在每条任务下方给出）。
> - **Codex**：随后调用你提供的 Codex（`gpt-5-codex high/medium`）来落地实现（Prompt 已给出）。
> - **模型建议**：给出每步优先模型与备选；若需流式/成本控制，采用 Router 策略（后续 Milestone 实现）。
> - **Copilot**：列出在该任务中可让 Copilot 辅助的点。
> - 复选框 `[]` 用于跟踪进度；可在 Canvas 或仓库中勾选。

---

## 目录
- [M0 仓库与基础设施](#m0-仓库与基础设施)
- [M1 最小可用多模型聊天](#m1-最小可用多模型聊天)
- [M2 路由模型与策略中心](#m2-路由模型与策略中心)
- [M3 MCP 集成](#m3-mcp-集成)
- [M4 代码自动化编排（Codex 监控/测试/输入循环）](#m4-代码自动化编排codex-监控测试输入循环)
- [M5 图像模型与多模态](#m5-图像模型与多模态)
- [M6 评测、日志与回放](#m6-评测日志与回放)
- [通用工程与安全守则](#通用工程与安全守则)
- [脚本与命令建议](#脚本与命令建议)

---

## M0 仓库与基础设施

### 0.1 Monorepo 初始化
- [x] 建立 `synapse/` monorepo（pnpm 或 bun）
- [x] 目录结构：`apps/desktop`、`packages/*`、`.env.example`、`turbo.json`/`pnpm-workspace.yaml`
- [x] Git hooks（lint-staged + commitlint + husky）
- [x] 许可协议与贡献指南（MIT + CONTRIBUTING.md）

**Plan（ChatGPT Web）**
> 目标：用 pnpm 初始化 Monorepo，包含 Tauri 桌面前端与可复用 packages。列出需要的脚手架命令、依赖、目录、工作区配置、基础脚本。

**Codex（gpt-5-codex medium）**
> 在当前空目录下，生成 `pnpm-workspace.yaml`、根级 `package.json`（含 scripts）、`apps/desktop` 和 `packages/*` 的最小骨架，并写出所有需要执行的 shell 命令与说明。

**模型建议**：Classifier：`mistral-small`；实现：无。

**Copilot**：生成 `package.json` 脚本与 workspace 文件时自动补全。

---

### 0.2 Tauri + React + Vite + Tailwind + Headless UI
- [ ] `apps/desktop` 用 `create-tauri-app` + React + Vite
- [ ] 接入 Tailwind 与 Headless UI；基础布局与主题（浅/深）
- [ ] UI 基本页：Chat、Settings、Logs、Tools、Policy 编辑器（占位）

**Plan（ChatGPT Web）**
> 罗列 Tauri+React+Vite 初始化与 Tailwind、Headless UI 的安装与配置步骤，给出 vite 与 tailwind 的配置文件模板。

**Codex（gpt-5-codex medium）**
> 生成 `apps/desktop` 的初始化命令、`tailwind.config`、`postcss.config`、`index.css`、布局组件（顶部模型栏、主对话区、侧栏设置），并输出所有涉及的文件差异。

**模型建议**：实现阶段 `gpt-5-codex medium`；UI 细化可用 `claude-3.5-haiku` 作为快速建议（后续 Router 里调用）。

**Copilot**：Tailwind 类名与 Headless UI 组件状态机。

---

### 0.3 OpenRouter 代理（Tauri 后端）
- [ ] Rust 侧创建 `/v1/proxy`：仅允许 OpenRouter 目标域、必要头与路径白名单
- [ ] 前端通过 Tauri IPC/HTTP 调用代理，前端不接触 API Key
- [ ] `.env` 与密钥加载、错误提示与健康检查

**Plan（ChatGPT Web）**
> 设计一个最小安全代理：路由白名单、Header 注入、错误与限速；给出 Rust Tauri Command 示例与前端调用示例。

**Codex（gpt-5-codex high）**
> 生成 Rust 代码（Tauri command 或本地小型 HTTP server）实现代理转发；提供 `allowlist`、`rate-limit`、`timeout`、`retries` 参数；并给出前端 `fetch` 封装。

**模型建议**：实现用 `gpt-5-codex high`；文档说明可用 `mistral-small` 草拟。

**Copilot**：Rust HTTP 路由与错误处理模板。

---

### 0.4 packages 基础库
- [ ] `packages/openrouter-sdk`：SSE、重试、计数与 Zod 校验
- [ ] `packages/ui`：公共组件（模型选择器、成本徽章、日志面板）
- [ ] `packages/core-agent`：接口定义（Router、Tool、Stream 事件）

**Plan（ChatGPT Web）**
> 定义 SDK 的方法签名（stream/non-stream），错误模型，Zod Schema；定义 Agent 的事件流与接口。

**Codex（gpt-5-codex high）**
> 生成 TypeScript 包代码：OpenRouterClient（含 SSE）、Token 估算、成本统计；CoreAgent 接口与事件类型；基础单元测试（Vitest）。

**模型建议**：实现 `gpt-5-codex high`。

**Copilot**：类型补全、测试断言片段。

---

## M1 最小可用多模型聊天

### 1.1 模型清单与选择器
- [ ] 本地 `models.json`：列出常用模型（便宜/中等/强力/图像）
- [ ] 选择器组件 + 最近使用缓存

**Plan（ChatGPT Web）**
> 设计 models.json 的字段（id、provider、cap、cost、context_len、modality 等），以及选择器组件属性与样式。

**Codex（gpt-5-codex medium）**
> 生成 `packages/ui/ModelPicker` 与 `apps/desktop` 集成代码；提供示例 `models.json`。

**模型建议**：—

**Copilot**：组件 props 与状态管理。

---

### 1.2 聊天流与消息持久化
- [ ] 流式显示（SSE）与取消（AbortController）
- [ ] 对话持久化（SQLite/IndexedDB；建议 SQLite via Tauri）
- [ ] 消息导出（JSON/Markdown）

**Plan（ChatGPT Web）**
> 拆分 Chat 模块的状态机：输入→路由→请求→流→工具/附件→完成；数据表结构设计。

**Codex（gpt-5-codex high）**
> 实现 Chat 流组件与 SQLite 存储层（Tauri 插件或 Rust 命令）；给出导出函数与快捷键。

**模型建议**：实现 `gpt-5-codex high`。

**Copilot**：React 流渲染和键盘交互。

---

### 1.3 成本/Token 可视化
- [ ] 输入/输出 token 估算与 $ 成本估算
- [ ] 气泡徽章 + 详细面板

**Plan（ChatGPT Web）**
> 列出需要展示的指标与计算方式，确认 SDK 中可获得的统计字段。

**Codex（gpt-5-codex medium）**
> 在 Chat UI 中集成成本面板；实现 `estimateTokens()` 与 `estimateCost()`。

**Copilot**：UI glue code。

---

## M2 路由模型与策略中心

### 2.1 任务判定器（Classifier）
- [ ] 规则/关键词初版：qa/code/summary/image 等标签
- [ ] 可选：轻量模型辅助判定（调用便宜模型）

**Plan（ChatGPT Web）**
> 产出标签枚举、判定优先级、回退策略、误判容忍度与记录方案。

**Codex（gpt-5-codex medium）**
> 在 `packages/core-agent` 中实现 `classify(input, context)`；单测覆盖典型样例。

**模型建议**：判定提示用 `mistral-small` 或 `qwen2.5-7b`；实现 `gpt-5-codex medium`。

**Copilot**：正则与类型守卫。

---

### 2.2 RouterPolicy（YAML/JSON）与执行器
- [ ] `router-policy.yaml` 草案 + Zod Schema
- [ ] 执行器：根据标签/复杂度选择候选模型池；超参与回退链

**Plan（ChatGPT Web）**
> 设计 policy 字段、样例与边界条件；给出复杂度估算与回退链样式。

**Codex（gpt-5-codex high）**
> 实现 `selectModels(task, metadata)`；支持 cost_cap、latency_weight、success_weight；提供模拟测试。

**模型建议**：实现 `gpt-5-codex high`。

**Copilot**：策略对象拼装与类型。

---

### 2.3 策略可视化编辑器
- [ ] 前端编辑器：表单/代码双模式 + 校验 + 一键回滚
- [ ] 预览：给定输入展示路由决策解释

**Plan（ChatGPT Web）**
> 交互流程：加载→编辑→校验→保存→回滚；错误展示与解释视图设计。

**Codex（gpt-5-codex medium）**
> 生成编辑器组件与集成；使用 Headless UI Dialog 与 toast。

**Copilot**：表单状态与错位提示。

---

## M3 MCP 集成

### 3.1 MCP 客户端封装（`packages/mcp-client`）
- [ ] 握手/心跳/重连；tool 列表同步
- [ ] `call(tool, args)` 与返回值协议；权限描述

**Plan（ChatGPT Web）**
> 绘制协议时序：连接→注册→工具发现→调用→响应；错误与超时设计。

**Codex（gpt-5-codex high）**
> 生成 TS 客户端封装；集成到 `core-agent` 的 ToolRegistry。

**Copilot**：类型推断与错误枚举。

---

### 3.2 工具面板与日志
- [ ] UI 开关工具、显示 capability、限权
- [ ] 调用轨迹时间线（输入/输出/耗时）

**Plan（ChatGPT Web）**
> 设计面板字段、时间线行项目、筛选与搜索。

**Codex（gpt-5-codex medium）**
> 生成 UI 与数据源；与 Chat 对话事件联动。

**Copilot**：列表/过滤逻辑。

---

## M4 代码自动化编排（Codex 监控/测试/输入循环）

### 4.1 Orchestrator 抽象与 DAG
- [ ] 任务图节点：文件改动、测试编写/执行、构建命令
- [ ] 状态：PENDING/RUNNING/SUCCESS/FAILED；日志收集

**Plan（ChatGPT Web）**
> 设计 DAG 节点类型、边、事件回调；输入/输出规范与最小可复现包。

**Codex（gpt-5-codex high）**
> 生成 `packages/code-orchestrator` 初版：DAG 类型、执行器接口、事件总线；Vitest 单测。

**Copilot**：类型与事件总线胶水代码。

---

### 4.2 本地执行与沙箱
- [ ] Tauri 后端起子进程执行 `test/build/lint`，限时+输出采集
- [ ] 写入白名单；改动需 UI 审批（或自动批准开关）

**Plan（ChatGPT Web）**
> 定义安全边界、白名单格式、审批流；子进程超时/内存上限策略。

**Codex（gpt-5-codex high）**
> 生成 Rust 后端命令与前端调用；整合到 Orchestrator。

**Copilot**：Rust 子进程与日志解析。

---

### 4.3 失败闭环与输入合成
- [ ] 收集失败栈/相关文件 diff/测试摘要 → 生成最小上下文
- [ ] 用小模型做切片与定位，大模型仅做关键修复

**Plan（ChatGPT Web）**
> 设计“输入合成管线”，列出 token 预算策略与示例。

**Codex（gpt-5-codex high）**
> 实现 `buildMinimalContext(failLog, repoIndex)` 与修复回合 API（产出 Unified Diff + 变更测试）。

**Copilot**：diff 生成与路径处理。

---

## M5 图像模型与多模态

### 5.1 附件与上传
- [ ] Tauri 临时目录存储、大小限制、清理策略
- [ ] 前端附件选择与预览

**Plan（ChatGPT Web）**
> 列出文件流走向、安全限制与 UI 流程。

**Codex（gpt-5-codex medium）**
> 实现上传与预览组件；Tauri 后端文件 API。

**Copilot**：组件细节。

---

### 5.2 图像模型调用
- [ ] `google/gemini-2.5-flash-image-preview` 接入（生成/理解）
- [ ] 与 Chat 统一输出流（文本 + 图像链接/缩略）

**Plan（ChatGPT Web）**
> 定义多模态消息结构与展示方式；错误与配额提示。

**Codex（gpt-5-codex medium）**
> 在 SDK 中添加多模态请求支持；前端展示卡片。

**Copilot**：卡片与状态管理。

---

## M6 评测、日志与回放

### 6.1 结构化日志
- [ ] 字段：model、latency、tokens、usd_cost、tools、errors
- [ ] 写入 SQLite；查询与筛选 UI

**Plan（ChatGPT Web）**
> 设计表结构与查询接口；性能与清理策略。

**Codex（gpt-5-codex medium）**
> 实现日志持久化与 UI 查询页。

**Copilot**：SQL 构造与查询 UI。

---

### 6.2 A/B 评测与回放
- [ ] 同一输入跑多策略；人工/半自动评分
- [ ] 回放：重建请求、工具调用链、输出对比

**Plan（ChatGPT Web）**
> 评测指标、打分界面、回放数据格式；与 RouterPolicy 的反馈闭环。

**Codex（gpt-5-codex high）**
> 生成评测 Runner、回放视图与结果汇总导出。

**Copilot**：结果表与导出脚本。

---

## 通用工程与安全守则
- [ ] 前端不接触密钥；Tauri 代理白名单与速率限制
- [ ] MCP 写操作白名单与确认对话框
- [ ] 成本上限：每请求与每日预算拦截器
- [ ] 上下文裁剪：RAG/符号索引（后续增强）
- [ ] 崩溃与错误上报（本地）

**Plan（ChatGPT Web）**：整理安全清单与异常流。

**Codex（gpt-5-codex medium）**：实现预算拦截器、中断与回退逻辑。

---

## 脚本与命令建议
- [ ] `pnpm dev`: 并行启动 desktop 与本地代理
- [ ] `pnpm build`: 构建所有包与 desktop
- [ ] `pnpm test`: 运行 Vitest + Playwright
- [ ] `pnpm lint:fix`: ESLint + Prettier
- [ ] `pnpm release`: 版本号与打包（后续）

**Plan（ChatGPT Web）**：列出每个脚本应调用的子命令与依赖顺序。

**Codex（gpt-5-codex medium）**：生成根级与各包的脚本配置，保证跨平台。

---

# 附：示例 Prompt 模板（可复制替换变量）

### A. 计划（用于 ChatGPT Web，先于 Codex）
```
你是我的开发 PM，请基于【目标/约束/产出】产出一个最小可执行计划（bullet），包含：
1) 需要创建/修改的文件与目录；2) 关键 API/类型；3) 依赖与命令；4) 风险与回退。
目标：${GOAL}
约束：${CONSTRAINTS}
产出：${ARTIFACTS}
```

### B. Codex 实现（gpt-5-codex high/medium）
```
你是严格的代码生成器。先阅读【计划】；仅按计划输出：
- 需新增/修改的文件的完整内容（用代码块分文件，含路径）
- 需要执行的命令（按顺序）
- 关键说明（简短）
计划：${PLAN_TEXT}
上下文：${FILE_TREE_OR_SNIPPETS}
要求：类型安全、可编译、含必要单测；尽量输出统一 diff 或完整文件。
```

### C. Bug 修复回合（结合 Orchestrator）
```
你将收到：失败日志、相关文件片段、diff、测试摘要。请只输出：
1) 最小修复 diff（Unified Diff）；2) 必要测试改动；3) 复现步骤（命令）。
偏好：减少上下文、原地修复、不改接口除非必要。
```

---

**完成顺序建议**：从 M0→M1→M2，先把“可用聊天 + 路由”跑通，再并行推进 MCP 与 Orchestrator。M5/M6 作为持续增强在主干稳定后接入。