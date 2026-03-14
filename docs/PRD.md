# 多功能计算器 - 项目需求文档 (PRD)

## 一、优化后的提示词

**原始需求优化版：**

构建一个全功能网页计算器应用，采用 Next.js 14 (App Router) + TypeScript 前端，Python FastAPI 后端。需实现三种计算模式：标准计算、程序员计算、科学计算。界面参考 Windows 11 计算器设计，支持深色/浅色主题切换，完全响应式布局（适配桌面、平板、手机）。后端负责处理复杂数学运算、历史记录存储。要求代码质量高、组件化设计、充分测试覆盖、使用 Git 版本管理。

---

## 二、功能规格说明书

### 2.1 核心功能需求

#### 模式 1: 标准计算器 (Standard Mode)
- 基础四则运算（加、减、乘、除）
- 百分号计算
- 平方、开方、倒数
- 正负号切换
- 退格、清除、清除条目
- 记忆功能（MC, MR, M+, M-, MS）
- 键盘快捷键支持

#### 模式 2: 程序员计算器 (Programmer Mode)
- 进制转换：二进制、八进制、十进制、十六进制
- 位运算：AND、OR、NOT、XOR、NAND、NOR
- 位移运算：左移、右移、无符号右移
- 数据类型切换：字节(8位)、字(16位)、双字(32位)、四字(64位)
- 显示当前进制的数值表示

#### 模式 3: 科学计算器 (Scientific Mode)
- 三角函数：sin, cos, tan, asin, acos, atan
- 双曲函数：sinh, cosh, tanh
- 对数函数：log, log10, ln
- 指数函数：e^x, 2^x, 10^x, x^y
- 阶乘、绝对值、取整
- 常数：π, e
- 角度/弧度切换

### 2.2 界面需求

#### 布局结构
```
┌─────────────────────────────────────────────┐
│  [菜单]  计算器          [主题] [历史]  │
├─────────────────────────────────────────────┤
│  历史记录 (可收起)                          │
├─────────────────────────────────────────────┤
│  显示区域                                    │
│  ├─ 上一步计算式                             │
│  └─ 当前输入值                               │
├─────────────────────────────────────────────┤
│  记忆按钮栏 (MC MR M+ M- MS)                │
├─────────────────────────────────────────────┤
│  函数按钮栏 (依模式变化)                     │
├─────────────────────────────────────────────┤
│  数字键盘                                    │
│  ├─ 数字 0-9                                │
│  ├─ 运算符 + - × ÷ =                        │
│  ├─ 功能键 . C CE ⌫                        │
│  └─ 模式特定功能键                          │
└─────────────────────────────────────────────┘
```

#### 视觉设计规范
- **配色方案**：
  - 浅色模式：背景 #F3F3F3，按键 #FFFFFF，文字 #202020
  - 深色模式：背景 #202020，按键 #323232，文字 #FFFFFF
- **字体**：系统默认等宽字体，数字显示使用等宽
- **圆角**：8px 统一圆角
- **阴影**：轻微阴影增加层次感
- **动画**：按钮点击反馈 150ms 过渡动画

#### 响应式断点
- **桌面端** (≥1024px)：完整三栏布局，侧边显示历史记录
- **平板端** (768px-1023px)：双栏布局，历史记录可收起
- **手机端** (<768px)：单栏布局，底部固定键盘

### 2.3 技术需求

#### 前端技术栈
- **框架**：Next.js 14 (App Router)
- **语言**：TypeScript
- **样式**：Tailwind CSS + CSS Modules
- **状态管理**：Zustand / React Context
- **图标**：Lucide React
- **测试**：Jest + React Testing Library

#### 后端技术栈
- **框架**：FastAPI
- **语言**：Python 3.12+
- **计算库**：NumPy, SciPy, SymPy
- **API**：RESTful API with OpenAPI docs
- **部署**：支持 Docker 容器化

#### API 接口设计
```
POST /api/calculate
{
  "expression": "string",     // 计算表达式
  "mode": "standard|programmer|scientific",
  "base": "10|2|8|16",       // 程序员模式专用
  "angleMode": "deg|rad"     // 科学模式专用
}

Response:
{
  "result": "string|number",
  "error": "string|null",
  "history": [...]
}
```

### 2.4 非功能需求

- **性能**：首屏加载 < 1.5s，计算响应 < 100ms
- **兼容性**：Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **可访问性**：支持键盘导航、屏幕阅读器
- **安全性**：输入验证、防止代码注入

---

## 三、技术架构设计

### 3.1 系统架构图

```
┌─────────────────────────────────────────────────────────┐
│                      客户端 (Client)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Web App    │  │   Mobile     │  │   Tablet     │  │
│  │  (Next.js)   │  │  (Responsive)│  │  (Responsive)│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTPS/HTTP2
┌─────────────────────────┴───────────────────────────────┐
│                      服务端 (Server)                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Next.js API Routes                  │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐ │   │
│  │  │ /api/theme│  │ /api/calc  │  │ /api/hist  │ │   │
│  │  └────────────┘  └────────────┘  └────────────┘ │   │
│  └──────────────────────┬──────────────────────────┘   │
│                         │                              │
│  ┌──────────────────────┴──────────────────────────┐   │
│  │              Python FastAPI Service              │   │
│  │  ┌──────────────────────────────────────────┐   │   │
│  │  │  Calculation Engine (NumPy/SciPy/SymPy)  │   │   │
│  │  └──────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 3.2 前端架构

#### 组件结构
```
src/
├── app/                      # Next.js App Router
│   ├── page.tsx             # 主页面
│   ├── layout.tsx           # 根布局（主题提供者）
│   ├── globals.css          # 全局样式
│   └── api/                 # API Routes
│
├── components/              # React 组件
│   ├── Calculator/          # 计算器主容器
│   │   ├── index.tsx
│   │   ├── Calculator.tsx
│   │   └── Calculator.module.css
│   ├── Display/             # 显示区域
│   ├── Keypad/              # 键盘区域
│   │   ├── StandardPad.tsx
│   │   ├── ProgrammerPad.tsx
│   │   └── ScientificPad.tsx
│   ├── ModeSelector/        # 模式选择器
│   ├── History/             # 历史记录
│   ├── ThemeToggle/         # 主题切换
│   └── ui/                  # 通用 UI 组件
│       ├── Button.tsx
│       └── Card.tsx
│
├── hooks/                   # 自定义 Hooks
│   ├── useCalculator.ts     # 计算器逻辑
│   ├── useTheme.ts          # 主题管理
│   └── useKeyboard.ts       # 键盘事件
│
├── stores/                  # 状态管理 (Zustand)
│   ├── calculatorStore.ts
│   └── themeStore.ts
│
├── lib/                     # 工具函数
│   ├── calculations.ts      # 计算逻辑
│   ├── converters.ts        # 进制转换
│   └── utils.ts
│
├── types/                   # TypeScript 类型
│   └── index.ts
│
└── __tests__/              # 测试文件
    ├── components/
    └── hooks/
```

#### 状态管理设计

**Calculator Store (Zustand):**
```typescript
interface CalculatorState {
  mode: 'standard' | 'programmer' | 'scientific';
  display: string;
  expression: string;
  memory: number;
  history: CalculationHistory[];
  programmerSettings: {
    base: 2 | 8 | 10 | 16;
    bitWidth: 8 | 16 | 32 | 64;
  };
  scientificSettings: {
    angleMode: 'deg' | 'rad';
  };
  // Actions
  setMode: (mode: CalculatorMode) => void;
  inputDigit: (digit: string) => void;
  inputOperator: (operator: string) => void;
  calculate: () => void;
  clear: () => void;
  memoryOperation: (op: MemoryOp) => void;
}
```

**Theme Store:**
```typescript
interface ThemeState {
  theme: 'light' | 'dark' | 'system';
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
}
```

### 3.3 后端架构

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI 入口
│   ├── config.py            # 配置
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py          # 依赖注入
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── endpoints/
│   │       │   ├── calculate.py
│   │       │   ├── history.py
│   │       │   └── health.py
│   │       └── router.py
│   │
│   ├── core/
│   │   ├── calculator.py    # 计算引擎
│   │   ├── converters.py    # 进制转换
│   │   └── security.py      # 安全验证
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── calculation.py   # Pydantic 模型
│   │   └── history.py
│   │
│   └── services/
│       ├── __init__.py
│       ├── calc_service.py  # 计算服务
│       └── history_service.py
│
├── tests/                   # 测试
├── requirements.txt
├── Dockerfile
└── pyproject.toml
```

---

## 四、实现计划

### Phase 1: 项目初始化 (Day 1)
- [x] 创建项目文档
- [ ] 初始化 Next.js 项目
- [ ] 配置 TypeScript、Tailwind CSS
- [ ] 配置主题系统
- [ ] 初始化 Python FastAPI 项目
- [ ] Git 初始化与首次提交

### Phase 2: 基础组件开发 (Day 2)
- [ ] 实现基础 UI 组件 (Button, Card)
- [ ] 实现 Display 组件
- [ ] 实现标准键盘布局
- [ ] 实现状态管理 Store
- [ ] 标准模式计算逻辑
- [ ] Git 提交

### Phase 3: 高级功能开发 (Day 3)
- [ ] 程序员模式 UI 与逻辑
- [ ] 科学模式 UI 与逻辑
- [ ] Python 后端计算 API
- [ ] 前后端联调
- [ ] Git 提交

### Phase 4: 增强功能 (Day 4)
- [ ] 历史记录功能
- [ ] 键盘快捷键支持
- [ ] 响应式布局优化
- [ ] Git 提交

### Phase 5: 测试与优化 (Day 5)
- [ ] 编写单元测试
- [ ] 编写集成测试
- [ ] 性能优化
- [ ] 最终 Git 提交

---

## 五、测试策略

### 单元测试覆盖
- **计算逻辑测试**：每种运算类型的输入输出验证
- **组件测试**：渲染、交互、状态变化
- **Hook 测试**：自定义 Hook 的行为验证
- **API 测试**：端点响应、错误处理

### 集成测试场景
- 端到端计算流程
- 模式切换数据持久化
- 主题切换
- 响应式布局适配

### 测试矩阵
| 功能 | 单元测试 | 集成测试 | E2E 测试 |
|------|----------|----------|----------|
| 标准计算 | ✅ | ✅ | ✅ |
| 程序员计算 | ✅ | ✅ | ✅ |
| 科学计算 | ✅ | ✅ | ✅ |
| 主题切换 | ✅ | ✅ | ✅ |
| 响应式布局 | - | ✅ | ✅ |
| API 接口 | ✅ | ✅ | - |

---

## 六、Git 提交规范

采用 Conventional Commits 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型：**
- `feat`: 新功能
- `fix`: 修复
- `docs`: 文档
- `style`: 样式调整
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具

**示例：**
```
feat(calculator): 实现标准计算模式

- 添加四则运算逻辑
- 实现记忆功能
- 添加键盘快捷键支持

Closes #3
```

---

*文档版本: v1.0*
*最后更新: 2025-03-13*
