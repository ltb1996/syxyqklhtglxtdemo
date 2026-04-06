# 前端 Skill 总表（本地版）

生成时间：2026-04-07

## 1. 当前项目是做什么的

这个项目本质上是一个“学生信息后台管理系统 / 学生学业信息管理系统”的前后端分离 Demo，目标是用后台管理界面来维护大学生的完整档案信息。

从代码结构看，它的定位比较明确：

- 前端使用 `Vue 3 + Vite + Element Plus + Vue Router + Axios`，属于典型的后台管理台技术栈。
- 后端使用 `Node.js + Express + MongoDB + Mongoose + JWT`，负责认证、学生数据管理和统计接口。
- 前端已经落地的页面包括：登录、仪表盘、学生管理、学生详情/表单、个人中心、系统设置、404 页面。
- 后端已经落地的能力包括：登录鉴权、学生列表分页、条件筛选、学生 CRUD、统计信息接口、用户资料读取与修改。
- 学生数据模型并不只是“姓名 + 学号”，而是覆盖了基础信息、学籍信息、学术信息、家庭信息、就业信息等多个维度。

如果把它说得更直白一点，这个项目就是：

> 一个用于管理大学生档案、学籍、成绩表现、奖学金、家庭情况和就业信息的后台系统原型。

### 1.1 当前项目的技术栈

- 前端：`Vue 3`、`Vite`、`Element Plus`、`Vue Router`、`Axios`
- 后端：`Express`、`Mongoose`、`JWT`、`bcryptjs`、`helmet`、`cors`
- 数据库：`MongoDB`

### 1.2 当前项目已经实现的主要功能

- 用户登录与基于 token 的访问控制
- 学生信息列表页
- 学生分页、搜索、按学院/年级/学历/状态筛选
- 学生新增、编辑、删除、查看详情
- 统计看板，展示总人数、学院分布、年级分布、GPA、奖学金等信息
- 个人中心和系统设置页

### 1.3 当前项目尚未完全做实的地方

虽然 README 里写了不少规划，但从实际代码看，有一部分功能仍然是“占位式实现”：

- 导出报表目前还是“开发中”提示，不是真正导出。
- 批量编辑、批量删除目前没有完整业务实现。
- README 提到的一些导入导出能力，在当前代码里没有真正打通。

## 2. 本文如何定义“前端有关的 skill”

你要求的是“我本地上所有跟前端有关的 skill 文件”，这里我采用的是“偏全、但不过度泛化”的收录标准。

### 2.1 收录进来的 skill

只要它直接服务于下面这些事情，我就视为“前端相关”：

- 页面视觉设计
- 响应式适配
- 排版、配色、动效、交互、可用性
- 组件抽取、设计系统、前端规范
- React / Next.js / shadcn / SWR 等前端工程技能
- Figma 到代码、代码到 Figma 的协作流程
- 浏览器验收、页面检查、端到端验证
- 前端站点部署到 Vercel / Netlify

### 2.2 没有收录进来的 skill

下面这些虽然和 Web 项目有关，但我没有把它们算进“前端 skill 总表”：

- 纯后端 skill
- 数据库 / Postgres / Supabase 优化 skill
- 支付、身份认证、云函数、基础设施类 skill
- Cloudflare Workers / Durable Objects / MCP Server 之类平台技能
- iOS / Android 原生技能

原因很简单：这些更偏“全栈 / 后端 / 平台工程”，不是你这次要的“前端 skill 文件总表”。

## 3. 本文收录的前端相关 skill 总览

本次共收录 **46 个** 本地前端相关 skill，分成 5 组：

| 分类 | 数量 | 说明 |
| --- | ---: | --- |
| 通用视觉与体验设计技能 | 21 | 偏 UI/UX、布局、配色、排版、体验、质量提升 |
| Web 工程与组件生态技能 | 5 | 偏 React/Next/shadcn/Vercel Web 工作流 |
| Figma 设计协同技能 | 7 | 偏设计稿、组件库、设计系统、Code Connect |
| Vercel 前端开发与验证技能 | 12 | 偏浏览器验收、Next.js、AI UI、前端工程能力 |
| 前端交付与部署技能 | 1 | 偏 Netlify 发布 |

## 4. 对当前这个 Vue 项目，最值得优先关注的 skill

虽然下面会列全量清单，但如果你只是想知道“对当前这个项目最实用的是哪些”，我建议优先看这几类：

- `frontend-design`：如果你想整体提升这个后台系统的视觉完成度。
- `arrange`：如果你想把目前后台页的布局层次、信息密度和视觉节奏整理得更好。
- `clarify`：如果你想把表单提示、错误信息、按钮文案做得更清楚。
- `normalize`：如果你想把不同页面的风格重新拉齐。
- `harden`：如果你想补齐异常状态、边界情况、溢出处理。
- `optimize`：如果你想检查页面性能、交互流畅度。
- `audit`：如果你想做一轮系统性的前端质量审查。
- `agent-browser` / `agent-browser-verify` / `verification`：如果你想在浏览器里真实检查页面是不是工作正常。
- `web-design-guidelines`：如果你想按照更系统的 Web 界面规范来 review 这个项目。
- `deploy-to-vercel` 或 `netlify-deploy`：如果你后面打算把前端页面快速发成可访问预览。

## 5. 通用视觉与体验设计技能（`.agents/skills`）

这一组是最偏“前端页面质量”的本地技能库，适合大多数 Web 前端项目，不依赖特定框架。对你当前这个 Vue 后台项目来说，这一组的实际价值是最高的。

### `frontend-design`

- 中文定位：高质量前端设计总控 skill。
- 本地文件：`C:\Users\liutianbo\.agents\skills\frontend-design\SKILL.md`
- 主要用途：用于从零创建或重做页面、组件、网站、应用界面，重点是做出“有设计感、不是 AI 套模板味道”的前端。
- 适用场景：做新页面、重做首页、做演示版、做高完成度原型、做产品化界面。
- 对当前项目适配度：高。你这个后台系统如果后续要从“功能能跑”升级到“产品界面更专业”，它是最值得先看的 skill 之一。

### `adapt`

- 中文定位：响应式适配 skill。
- 本地文件：`C:\Users\liutianbo\.agents\skills\adapt\SKILL.md`
- 主要用途：处理不同屏幕尺寸、断点、触摸目标、移动端布局和跨设备适配问题。
- 适用场景：后台页面在窄屏下挤压、表格在移动端不好用、触控区域太小、需要补断点时。
- 对当前项目适配度：高。当前项目是管理后台，但依然有平板、小屏笔记本和移动访问场景。

### `arrange`

- 中文定位：布局与视觉节奏整理 skill。
- 本地文件：`C:\Users\liutianbo\.agents\skills\arrange\SKILL.md`
- 主要用途：优化区块布局、留白、网格、层级和模块关系，解决“页面能用但不好看”的问题。
- 适用场景：卡片太挤、信息层次混乱、对齐不齐、区块关系松散、页面显得乱时。
- 对当前项目适配度：高。你现在这个后台项目里，仪表盘和学生管理页都很适合用它做一轮重排。

### `audit`

- 中文定位：前端技术质量审查 skill。
- 本地文件：`C:\Users\liutianbo\.agents\skills\audit\SKILL.md`
- 主要用途：检查无障碍、性能、主题一致性、响应式、常见反模式，并给出 P0-P3 分级问题。
- 适用场景：上线前体检、前端 code review、做质量报告、排查明显设计/实现问题时。
- 对当前项目适配度：高。尤其适合对后台页面做一次系统性体检。

### `bolder`

- 中文定位：把保守设计做得更有冲击力的 skill。
- 本地文件：`C:\Users\liutianbo\.agents\skills\bolder\SKILL.md`
- 主要用途：当页面太平、太普通、太模板化时，帮你增强视觉个性和表现力。
- 适用场景：需要做品牌感更强的登录页、欢迎页、专题页、展示页时。
- 对当前项目适配度：中。对后台日常页面不是第一优先，但对登录页和看板页有用。

### `clarify`

- 中文定位：UX 文案与界面表达澄清 skill。
- 本地文件：`C:\Users\liutianbo\.agents\skills\clarify\SKILL.md`
- 主要用途：优化提示语、错误信息、标签、按钮文案、说明文字，让界面更好懂。
- 适用场景：表单不知道怎么填、错误提示模糊、按钮命名不明确、操作路径不清楚时。
- 对当前项目适配度：高。学生表单、筛选项、登录页提示都很适合用它优化。

### `colorize`

- 中文定位：给界面补色、提气质的 skill。
- 本地文件：`C:\Users\liutianbo\.agents\skills\colorize\SKILL.md`
- 主要用途：当页面色彩过灰、过平、缺少情绪和重点时，帮助建立更有表现力的色彩系统。
- 适用场景：后台整体太白太灰、重点状态不突出、图表或关键区块缺乏视觉锚点时。
- 对当前项目适配度：高。当前项目整体偏默认后台风格，用它很合适。

### `critique`

- 中文定位：UX 视角的设计批评与评分 skill。
- 本地文件：`C:\Users\liutianbo\.agents\skills\critique\SKILL.md`
- 主要用途：从视觉层级、信息架构、情绪表达、认知负担等角度评估页面并提出改进意见。
- 适用场景：你不确定一个页面“是不是好”，想先拿到专业批评，再决定改哪里时。
- 对当前项目适配度：高。很适合对仪表盘、学生列表页、登录页做设计复盘。

### `delight`

- 中文定位：给界面增加记忆点和趣味性的 skill。
- 本地文件：`C:\Users\liutianbo\.agents\skills\delight\SKILL.md`
- 主要用途：增加让人感觉“有温度”“有细节”“有小惊喜”的微交互和趣味设计。
- 适用场景：希望页面除了能用，还更有产品感、完成度和愉悦感时。
- 对当前项目适配度：中。管理后台不一定需要太多花活，但登录页、空状态、成功反馈很适合。

### `distill`

- 中文定位：极简化与去噪 skill。
- 本地文件：`C:\Users\liutianbo\.agents\skills\distill\SKILL.md`
- 主要用途：去掉冗余块、无用装饰、重复说明和无必要复杂度，让界面更干净。
- 适用场景：页面元素过多、说明太长、结构堆叠太重、视觉负担偏高时。
- 对当前项目适配度：高。后台系统经常越做越臃肿，这个 skill 很适合压缩复杂度。

### `extract`

- 中文定位：组件与设计模式提取 skill。
- 本地文件：`C:\Users\liutianbo\.agents\skills\extract\SKILL.md`
- 主要用途：把重复 UI、重复布局、重复 token、重复交互抽成可复用组件或规则。
- 适用场景：多个页面反复出现相似卡片、表单区块、统计区块、列表操作栏时。
- 对当前项目适配度：高。学生详情、学生表单、统计模块都可能逐步抽象成通用组件。

### `harden`

- 中文定位：前端健壮性强化 skill。
- 本地文件：`C:\Users\liutianbo\.agents\skills\harden\SKILL.md`
- 主要用途：补齐错误态、空态、溢出、i18n、极端数据输入等边界处理。
- 适用场景：表格字段超长、接口失败没提示、空列表无引导、错误状态体验差时。
- 对当前项目适配度：高。后台系统非常需要这个 skill 来提高稳定性和可维护性。

### `normalize`

- 中文定位：拉齐设计系统一致性的 skill。
- 本地文件：`C:\Users\liutianbo\.agents\skills\normalize\SKILL.md`
- 主要用途：把页面样式、间距、字号、组件风格拉回统一标准，减少“每页一个味道”。
- 适用场景：项目迭代久了后，多个页面长得像不同人做的，需要统一的时候。
- 对当前项目适配度：高。当前项目页面之间的视觉统一性值得做一轮整理。

### `onboard`

- 中文定位：新用户引导与空状态设计 skill。
- 本地文件：`C:\Users\liutianbo\.agents\skills\onboard\SKILL.md`
- 主要用途：优化首次使用流程、空状态提示、上手引导，帮助用户快速进入任务。
- 适用场景：没有数据时页面太空、首次登录不知道下一步干什么、某些功能入口不直观时。
- 对当前项目适配度：中高。后台系统的空数据页、首次登录页、学生库为空时都很适用。

### `optimize`

- 中文定位：前端性能优化 skill。
- 本地文件：`C:\Users\liutianbo\.agents\skills\optimize\SKILL.md`
- 主要用途：诊断加载慢、渲染卡、图片问题、动画卡顿、包体积偏大等性能问题。
- 适用场景：列表页卡、看板首屏慢、资源过大、交互延迟明显时。
- 对当前项目适配度：高。学生列表和统计页后续数据一多就会涉及这类问题。

### `overdrive`

- 中文定位：超规格视觉/动效增强 skill。
- 本地文件：`C:\Users\liutianbo\.agents\skills\overdrive\SKILL.md`
- 主要用途：做更极致的动效、滚动叙事、物理感动画、视觉技术展示。
- 适用场景：宣传页、展示页、品牌型首页、要“哇一下”的界面时。
- 对当前项目适配度：低到中。对常规后台不是刚需，但如果你要把登录页或展示页做得更惊艳，可以用。

### `polish`

- 中文定位：上线前细节打磨 skill。
- 本地文件：`C:\Users\liutianbo\.agents\skills\polish\SKILL.md`
- 主要用途：修对齐、修间距、修边角、修 hover、修文本溢出，做最后一遍“收口”。
- 适用场景：功能已经差不多，准备上线或交付前，需要做最后一轮精修时。
- 对当前项目适配度：高。这个 skill 很适合你这种已经有基础页面的项目。

### `quieter`

- 中文定位：把过于吵闹的设计收下来 skill。
- 本地文件：`C:\Users\liutianbo\.agents\skills\quieter\SKILL.md`
- 主要用途：降低页面刺激度，让视觉语言更克制、更平静、更高级。
- 适用场景：颜色过多、阴影太重、按钮太抢、动画太闹时。
- 对当前项目适配度：中。当前项目不算太吵，但如果你后续做大幅改版，这个 skill 很有用。

### `teach-impeccable`

- 中文定位：把项目设计规范“教给 AI”的初始化 skill。
- 本地文件：`C:\Users\liutianbo\.agents\skills\teach-impeccable\SKILL.md`
- 主要用途：一次性收集项目设计上下文，并保存成长期可复用的设计规则。
- 适用场景：你希望后续任何 AI 辅助开发都遵守统一设计标准时。
- 对当前项目适配度：高。这个项目如果后续会持续迭代，早点做这一步会省很多重复沟通。

### `typeset`

- 中文定位：排版优化 skill。
- 本地文件：`C:\Users\liutianbo\.agents\skills\typeset\SKILL.md`
- 主要用途：优化字体、字号、字重、层级、可读性和文本节奏。
- 适用场景：页面整体“字不好看”“标题不稳”“说明文看起来杂乱”时。
- 对当前项目适配度：高。后台项目的信息密度高，排版质量非常重要。

### `animate`

- 中文定位：动效与微交互增强 skill。
- 本地文件：`C:\Users\liutianbo\.agents\skills\animate\SKILL.md`
- 主要用途：增加有目的的过渡、hover、进入动画、反馈动画，让界面更生动。
- 适用场景：页面切换生硬、操作反馈弱、卡片/面板完全静止，想让 UI 更“活”时。
- 对当前项目适配度：中高。仪表盘、弹窗、表单提交反馈都能从这个 skill 获益。

## 6. Web 工程与组件生态技能（Build Web Apps 插件）

这一组技能比 `.agents/skills` 更偏“前端工程工作流”，适合 React/Next/shadcn 生态，也包含前端部署能力。对当前 Vue 项目来说，有些是直接可借鉴，有些则是生态不完全匹配，但依然值得知道。

### `build-web-apps:frontend-skill`

- 中文定位：高审美 Web 前端页面构建 skill。
- 本地文件：`C:\Users\liutianbo\.codex\plugins\cache\openai-curated\build-web-apps\f78e3ad49297672a905eb7afb6aa0cef34edc79e\skills\frontend-skill\SKILL.md`
- 主要用途：做高质量落地页、网站、应用界面、Demo、游戏 UI，强调强视觉主张、少而精的动效和非模板化设计。
- 适用场景：要做视觉更强的官网、首页、专题页时，尤其好用。
- 对当前项目适配度：中高。更适合登录页、欢迎页、品牌化页面，不是纯后台 CRUD 页的第一优先级。

### `build-web-apps:react-best-practices`

- 中文定位：React / Next.js 性能与实现规范 skill。
- 本地文件：`C:\Users\liutianbo\.codex\plugins\cache\openai-curated\build-web-apps\f78e3ad49297672a905eb7afb6aa0cef34edc79e\skills\react-best-practices\SKILL.md`
- 主要用途：针对 React / Next 代码做性能导向的写法规范和重构指引，比如消除 waterfall、优化 bundle、减少重复渲染。
- 适用场景：写 React 组件、Next 页面、数据获取层、优化性能时。
- 对当前项目适配度：低到中。你当前项目是 Vue，不是 React；但如果以后迁到 React/Next，这个 skill 会非常关键。

### `build-web-apps:shadcn`

- 中文定位：shadcn/ui 项目管理与规范 skill。
- 本地文件：`C:\Users\liutianbo\.codex\plugins\cache\openai-curated\build-web-apps\f78e3ad49297672a905eb7afb6aa0cef34edc79e\skills\shadcn-best-practices\SKILL.md`
- 主要用途：管理 shadcn 组件的添加、搜索、修复、组合、样式约束和 CLI 工作流。
- 适用场景：项目基于 shadcn/ui，或者要初始化、扩展、重构 shadcn 组件体系时。
- 对当前项目适配度：低。当前项目是 Vue + Element Plus，不是 shadcn 体系。

### `build-web-apps:web-design-guidelines`

- 中文定位：Web 界面规范审查 skill。
- 本地文件：`C:\Users\liutianbo\.codex\plugins\cache\openai-curated\build-web-apps\f78e3ad49297672a905eb7afb6aa0cef34edc79e\skills\web-design-guidelines\SKILL.md`
- 主要用途：按 Web Interface Guidelines 对 UI 代码做审查，偏规则化 review。
- 适用场景：想检查页面是否符合更系统的 Web 界面规范、可用性和设计纪律时。
- 对当前项目适配度：高。虽然当前项目是 Vue，但这个 skill 检查的是界面质量，不依赖 React。

### `build-web-apps:deploy-to-vercel`

- 中文定位：把前端项目发到 Vercel 的部署 skill。
- 本地文件：`C:\Users\liutianbo\.codex\plugins\cache\openai-curated\build-web-apps\f78e3ad49297672a905eb7afb6aa0cef34edc79e\skills\deploy-to-vercel\SKILL.md`
- 主要用途：检查项目状态、判断是否已链接 Vercel、优先走 preview 部署，并逐步把项目带到更规范的 Git + Vercel 工作流。
- 适用场景：想快速拿一个可访问预览链接、想把 Web 项目挂到 Vercel 时。
- 对当前项目适配度：高。你的前端是 Vite，完全可以走 Vercel 预览部署。

## 7. Figma 设计协同技能（Figma 插件）

这一组 skill 的作用不是直接“写页面代码”，而是打通设计稿、组件库、代码和设计系统之间的协作链路。对团队协作和中大型前端项目很有价值。

### `figma:create-new-file`

- 中文定位：创建新的 Figma 文件 skill。
- 本地文件：`C:\Users\liutianbo\.codex\plugins\cache\openai-curated\figma\f78e3ad49297672a905eb7afb6aa0cef34edc79e\skills\figma-create-new-file\SKILL.md`
- 主要用途：新建空白 Figma 设计文件或 FigJam 文件，为后续设计或自动生成打基础。
- 适用场景：准备从头搭一个设计稿、白板或组件库时。
- 对当前项目适配度：中。只有在你要把这个项目拉到 Figma 里继续设计协作时才会用到。

### `figma:figma-use`

- 中文定位：Figma Plugin API 操作基础 skill。
- 本地文件：`C:\Users\liutianbo\.codex\plugins\cache\openai-curated\figma\f78e3ad49297672a905eb7afb6aa0cef34edc79e\skills\figma-use\SKILL.md`
- 主要用途：在 Figma 里执行脚本、创建/修改节点、设置变量、改布局、建组件，是其他 Figma 写操作 skill 的前置基础。
- 适用场景：任何要“直接改 Figma 文件”的任务都离不开它。
- 对当前项目适配度：中。它本身不直接改你这个 Vue 项目，但在设计稿协同里是核心底座。

### `figma:figma-generate-design`

- 中文定位：从代码或描述生成 Figma 页面 skill。
- 本地文件：`C:\Users\liutianbo\.codex\plugins\cache\openai-curated\figma\f78e3ad49297672a905eb7afb6aa0cef34edc79e\skills\figma-generate-design\SKILL.md`
- 主要用途：把应用页面、网站、布局结构从代码或描述翻到 Figma 里，并优先复用设计系统组件与 tokens。
- 适用场景：你已经有前端页面，想快速生成设计稿或同步给设计团队时。
- 对当前项目适配度：高。如果你想把这个后台系统的现有页面同步成 Figma 设计稿，这个 skill 很合适。

### `figma:figma-generate-library`

- 中文定位：从代码构建设计系统库 skill。
- 本地文件：`C:\Users\liutianbo\.codex\plugins\cache\openai-curated\figma\f78e3ad49297672a905eb7afb6aa0cef34edc79e\skills\figma-generate-library\SKILL.md`
- 主要用途：从代码抽设计 token、组件、变量、模式，并在 Figma 中逐步建立专业级设计系统。
- 适用场景：团队要做一套正式的设计系统，或者想让 Figma 和代码库保持长期一致时。
- 对当前项目适配度：中高。如果你打算把这个项目长期维护并形成组件规范，它会很有价值。

### `figma:figma-implement-design`

- 中文定位：从 Figma 设计稿实现代码 skill。
- 本地文件：`C:\Users\liutianbo\.codex\plugins\cache\openai-curated\figma\f78e3ad49297672a905eb7afb6aa0cef34edc79e\skills\figma-implement-design\SKILL.md`
- 主要用途：把 Figma 节点转成生产可用代码，追求 1:1 视觉还原，同时遵守项目现有组件和样式约定。
- 适用场景：设计给了一张稿，你需要高还原度落地到代码库时。
- 对当前项目适配度：高。如果后面你拿设计稿来改这个后台系统，这个 skill 非常实用。

### `figma:figma-code-connect-components`

- 中文定位：Figma 组件与代码组件映射 skill。
- 本地文件：`C:\Users\liutianbo\.codex\plugins\cache\openai-curated\figma\f78e3ad49297672a905eb7afb6aa0cef34edc79e\skills\figma-code-connect-components\SKILL.md`
- 主要用途：把 Figma 里的组件和代码库里的组件建立 Code Connect 映射，减少“设计稿一个名字、代码一个名字”的割裂。
- 适用场景：项目已经有组件库，希望设计和代码能一一对应时。
- 对当前项目适配度：中。当前项目还没有明显成熟组件库，但以后做大了很需要。

### `figma:figma-create-design-system-rules`

- 中文定位：为当前代码库生成设计系统规则 skill。
- 本地文件：`C:\Users\liutianbo\.codex\plugins\cache\openai-curated\figma\f78e3ad49297672a905eb7afb6aa0cef34edc79e\skills\figma-create-design-system-rules\SKILL.md`
- 主要用途：为 AI 编码代理生成这个项目专属的 Figma-to-code 规则文件，例如组件目录、命名规范、tokens 约束。
- 适用场景：团队已经形成了一些前端设计/实现规范，想把它系统化时。
- 对当前项目适配度：中高。非常适合项目开始变复杂时建立统一规矩。

## 8. Vercel 前端开发与验证技能（Vercel 插件）

这一组不是单纯的“部署 skill”，而是覆盖了浏览器验收、Next.js 前端架构、AI UI 组件、shadcn、SWR、字体和文档站等多个方向。它更像是一套偏现代 Web 前端工程工具箱。

### `vercel:agent-browser`

- 中文定位：浏览器自动化与页面交互 skill。
- 本地文件：`C:\Users\liutianbo\.codex\plugins\cache\openai-curated\vercel\f78e3ad49297672a905eb7afb6aa0cef34edc79e\skills\agent-browser\SKILL.md`
- 主要用途：打开页面、点击、输入、截图、抓取 DOM、验证页面交互，是前端真实验收的重要工具。
- 适用场景：你启动了 dev server，想在浏览器里真正验证页面、表单、交互是否工作正常时。
- 对当前项目适配度：高。对你这种前端页面已经成型的项目，非常有用。

### `vercel:agent-browser-verify`

- 中文定位：开发服务器自动验页 skill。
- 本地文件：`C:\Users\liutianbo\.codex\plugins\cache\openai-curated\vercel\f78e3ad49297672a905eb7afb6aa0cef34edc79e\skills\agent-browser-verify\SKILL.md`
- 主要用途：在 dev server 启动后，自动做第一轮可视化检查，确认页面是否加载成功、是否有 console 错误。
- 适用场景：你不想只看终端“服务启动成功”，而是想确认浏览器里真的不是白屏。
- 对当前项目适配度：高。这个项目后面跑前端时，非常建议配合使用。

### `vercel:verification`

- 中文定位：全链路功能验证 skill。
- 本地文件：`C:\Users\liutianbo\.codex\plugins\cache\openai-curated\vercel\f78e3ad49297672a905eb7afb6aa0cef34edc79e\skills\verification\SKILL.md`
- 主要用途：不是只看页面，而是把“浏览器 -> API -> 数据 -> 返回结果”整个故事链都验证一遍。
- 适用场景：功能看起来差不多了，但你想确认整条链路是真通的，而不是只做局部检查时。
- 对当前项目适配度：高。前后端分离项目最需要这种整链路验收。

### `vercel:react-best-practices`

- 中文定位：TSX 代码审查型 React 最佳实践 skill。
- 本地文件：`C:\Users\liutianbo\.codex\plugins\cache\openai-curated\vercel\f78e3ad49297672a905eb7afb6aa0cef34edc79e\skills\react-best-practices\SKILL.md`
- 主要用途：在改动多个 React/TSX 组件后，按结构、hooks、可访问性、性能、TypeScript 等维度做一轮精简质量检查。
- 适用场景：大批量改 React 组件后，想快速过一遍质量基线时。
- 对当前项目适配度：低。因为当前项目是 Vue，不是 React。

### `vercel:nextjs`

- 中文定位：Next.js App Router 专家 skill。
- 本地文件：`C:\Users\liutianbo\.codex\plugins\cache\openai-curated\vercel\f78e3ad49297672a905eb7afb6aa0cef34edc79e\skills\nextjs\SKILL.md`
- 主要用途：处理路由、Server Components、Server Actions、缓存、布局、部署等 Next.js 关键问题。
- 适用场景：你在做 Next.js 项目时需要架构指导、性能建议或 API 迁移建议。
- 对当前项目适配度：低。当前是 Vue + Vite，不是 Next.js。

### `vercel:shadcn`

- 中文定位：shadcn/ui 官方生态 skill。
- 本地文件：`C:\Users\liutianbo\.codex\plugins\cache\openai-curated\vercel\f78e3ad49297672a905eb7afb6aa0cef34edc79e\skills\shadcn\SKILL.md`
- 主要用途：负责 shadcn CLI、组件安装、主题、注册表、Tailwind 集成和组件设计规范。
- 适用场景：项目走 shadcn + Tailwind + React 路线时。
- 对当前项目适配度：低。当前项目不是这个技术栈。

### `vercel:swr`

- 中文定位：SWR 数据获取与缓存 skill。
- 本地文件：`C:\Users\liutianbo\.codex\plugins\cache\openai-curated\vercel\f78e3ad49297672a905eb7afb6aa0cef34edc79e\skills\swr\SKILL.md`
- 主要用途：指导如何在 React 中做客户端缓存、revalidate、乐观更新、分页和无限滚动。
- 适用场景：React 项目中数据交互复杂，希望统一客户端数据获取模式时。
- 对当前项目适配度：低到中。当前 Vue 不直接适配，但设计思想仍可借鉴。

### `vercel:geist`

- 中文定位：Geist 字体与排版体系 skill。
- 本地文件：`C:\Users\liutianbo\.codex\plugins\cache\openai-curated\vercel\f78e3ad49297672a905eb7afb6aa0cef34edc79e\skills\geist\SKILL.md`
- 主要用途：指导 Geist Sans / Mono / Pixel 的导入、CSS 变量接入和字体体系配置。
- 适用场景：做 Next.js / React 页面时，希望整体排版更现代、统一、开发者友好时。
- 对当前项目适配度：低到中。当前 Vue 项目也能借鉴“字体系统”的思路，但不算直接命中。

### `vercel:geistdocs`

- 中文定位：Geistdocs 文档站 skill。
- 本地文件：`C:\Users\liutianbo\.codex\plugins\cache\openai-curated\vercel\f78e3ad49297672a905eb7afb6aa0cef34edc79e\skills\geistdocs\SKILL.md`
- 主要用途：搭建基于 Next.js + Fumadocs 的文档站，处理 MDX、AI Chat、i18n、反馈和部署。
- 适用场景：给项目做产品文档站、开发文档站、知识库站点时。
- 对当前项目适配度：低到中。不是当前业务项目的核心，但如果要补文档站会有用。

### `vercel:v0-dev`

- 中文定位：v0 AI 生成前端代码 skill。
- 本地文件：`C:\Users\liutianbo\.codex\plugins\cache\openai-curated\vercel\f78e3ad49297672a905eb7afb6aa0cef34edc79e\skills\v0-dev\SKILL.md`
- 主要用途：指导如何通过 v0 生成 UI、拉取生成的组件到代码库、与 shadcn/Next 结合。
- 适用场景：你想用 prompt 直接生成前端页面、组件或原型时。
- 对当前项目适配度：中。它更偏 React/Next 生态，但在做新页面原型时有参考价值。

### `vercel:ai-elements`

- 中文定位：AI 聊天界面组件 skill。
- 本地文件：`C:\Users\liutianbo\.codex\plugins\cache\openai-curated\vercel\f78e3ad49297672a905eb7afb6aa0cef34edc79e\skills\ai-elements\SKILL.md`
- 主要用途：处理聊天消息、工具调用展示、推理面板、流式回复等 AI 原生界面组件。
- 适用场景：做 AI 聊天产品、AI 助手、工具调用可视化界面时。
- 对当前项目适配度：低。当前项目是学生管理后台，不是 AI 产品界面。

### `vercel:json-render`

- 中文定位：AI 响应渲染 skill。
- 本地文件：`C:\Users\liutianbo\.codex\plugins\cache\openai-curated\vercel\f78e3ad49297672a905eb7afb6aa0cef34edc79e\skills\json-render\SKILL.md`
- 主要用途：处理 AI SDK v6 的 message parts、tool call 显示、流式状态和结构化数据渲染。
- 适用场景：你自己写 AI Chat UI，而不是直接套组件库时。
- 对当前项目适配度：低。除非你以后给后台加 AI 助理模块，否则暂时不需要。

## 9. 前端交付与部署技能（Netlify 插件）

这一组目前只有一个，但对“前端项目如何交付”非常实用。

### `netlify:netlify-deploy`

- 中文定位：Netlify 部署 skill。
- 本地文件：`C:\Users\liutianbo\.codex\plugins\cache\openai-curated\netlify\f78e3ad49297672a905eb7afb6aa0cef34edc79e\skills\netlify-deploy\SKILL.md`
- 主要用途：检查 Netlify CLI 登录状态、链接站点、识别项目配置并执行 preview 或 production 部署。
- 适用场景：你想把前端项目发到 Netlify，或者已经习惯 Netlify 工作流时。
- 对当前项目适配度：高。Vite 前端部署到 Netlify 是完全合理的路径。

## 10. 这些 skill 之间的关系，怎么理解

如果你后续真要把这些 skill 用起来，不建议把它们看成“46 个互不相关的文件”。更合理的理解方式是：

### 10.1 偏“页面质量提升”的

- `frontend-design`
- `arrange`
- `typeset`
- `colorize`
- `animate`
- `delight`
- `polish`
- `distill`
- `quieter`
- `bolder`

这一组适合做“视觉和体验升级”。

### 10.2 偏“可用性、稳定性、规范”的

- `clarify`
- `normalize`
- `harden`
- `optimize`
- `audit`
- `critique`
- `web-design-guidelines`

这一组适合做“质量和治理”。

### 10.3 偏“组件/设计系统/协作流程”的

- `extract`
- `teach-impeccable`
- `figma-use`
- `figma-generate-design`
- `figma-generate-library`
- `figma-implement-design`
- `figma-code-connect-components`
- `figma-create-design-system-rules`

这一组适合做“中长期工程化”。

### 10.4 偏“现代 React / Next / shadcn 工程”的

- `build-web-apps:react-best-practices`
- `build-web-apps:shadcn`
- `vercel:react-best-practices`
- `vercel:nextjs`
- `vercel:shadcn`
- `vercel:swr`
- `vercel:geist`
- `vercel:v0-dev`

这一组对 React/Next 技术栈特别重要，但对你当前 Vue 项目只是参考项。

### 10.5 偏“真实页面验收和发布”的

- `vercel:agent-browser`
- `vercel:agent-browser-verify`
- `vercel:verification`
- `build-web-apps:deploy-to-vercel`
- `netlify:netlify-deploy`

这一组最适合在“页面已经写出来了，要验证和发出去”的阶段使用。

## 11. 如果只针对你这个项目，我会怎么选 skill

如果后面你要继续打磨这个学生信息管理系统，我建议优先使用顺序如下：

1. `audit`
   先做一轮体检，搞清楚当前前端的问题分布。
2. `arrange` + `normalize`
   先把布局、层级、组件风格统一起来。
3. `clarify` + `harden`
   再补文案表达、错误态、空态、极端情况。
4. `typeset` + `colorize` + `polish`
   再提升文字质量、配色和细节完成度。
5. `agent-browser-verify` + `verification`
   最后做真实浏览器验收和整链路验证。

如果你后面还想把这个项目做成“有设计稿、有组件库、有协作规范”的版本，再接上：

- `extract`
- `teach-impeccable`
- `figma-generate-design`
- `figma-create-design-system-rules`

## 12. 结论

对你这台机器来说，真正“跟前端强相关”的本地 skill 已经很丰富了，而且不是单一方向：

- 有偏设计的
- 有偏体验的
- 有偏工程规范的
- 有偏组件生态的
- 有偏 Figma 协作的
- 有偏浏览器验收和部署的

如果只围绕当前这个 Vue 学生信息管理系统来看，最有直接价值的不是 React / Next / shadcn 那一批，而是：

- `frontend-design`
- `arrange`
- `clarify`
- `normalize`
- `harden`
- `optimize`
- `audit`
- `agent-browser`
- `agent-browser-verify`
- `verification`
- `web-design-guidelines`
- `deploy-to-vercel`
- `netlify-deploy`

这份文档的目的，不只是给你一个名字清单，而是让你以后看到某个前端问题时，能很快知道“应该调哪一类 skill 来解决”。
