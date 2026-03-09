# 技术设计文档 (Technical Design Document)

## 1. 架构概述

### 1.1 技术选型

| 类别 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 框架 | Next.js | 14.x | React 全栈框架 |
| 语言 | TypeScript | 5.x | 类型安全 |
| 样式 | Tailwind CSS | 3.x | 原子化 CSS |
| UI 组件 | shadcn/ui | latest | 组件库 |
| 数学计算 | mathjs | 11.x | 数值计算 |
| 符号计算 | Algebrite | 1.x | 积分求导 |
| 状态管理 | React Context | - | 全局状态 |
| 图标 | Lucide React | latest | 图标库 |

### 1.2 项目结构

```
calculator-project/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 主页面
│   ├── layout.tsx                # 根布局
│   ├── globals.css               # 全局样式
│   ├── components/               # 页面组件
│   │   ├── Calculator.tsx        # 计算器主组件
│   │   ├── Display.tsx           # 显示屏组件
│   │   ├── Keypad.tsx            # 键盘组件
│   │   ├── ModeTabs.tsx          # 模式切换标签
│   │   ├── HistoryPanel.tsx      # 历史记录面板
│   │   └── modes/                # 各模式专用组件
│   │       ├── StandardKeypad.tsx
│   │       ├── ScientificKeypad.tsx
│   │       ├── ProgrammerKeypad.tsx
│   │       └── CalculusPanel.tsx
│   ├── hooks/                    # 自定义 Hooks
│   │   ├── useCalculator.ts      # 计算器逻辑
│   │   ├── useHistory.ts         # 历史记录
│   │   └── useTheme.ts           # 主题管理
│   ├── lib/                      # 工具库
│   │   ├── calculator.ts         # 计算核心
│   │   ├── math.ts               # 数学函数封装
│   │   └── utils.ts              # 通用工具
│   ├── types/                    # TypeScript 类型
│   │   └── calculator.ts
│   └── context/                  # React Context
│       └── CalculatorContext.tsx
├── components/                   # shadcn/ui 组件
├── public/                       # 静态资源
├── docs/                         # 文档
├── tests/                        # 测试文件
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## 2. 核心模块设计

### 2.1 计算器状态机

```typescript
// 计算器模式
enum CalculatorMode {
  STANDARD = 'standard',
  SCIENTIFIC = 'scientific',
  PROGRAMMER = 'programmer',
  CALCULUS = 'calculus'
}

// 程序员模式数据类型
enum DataType {
  BYTE = 8,
  WORD = 16,
  DWORD = 32,
  QWORD = 64
}

// 角度模式
enum AngleMode {
  DEGREE = 'degree',
  RADIAN = 'radian'
}

// 计算器状态
interface CalculatorState {
  mode: CalculatorMode;
  display: string;
  expression: string;
  result: string | null;
  history: CalculationHistory[];
  angleMode: AngleMode;
  programmer: {
    base: number;      // 当前进制: 2, 8, 10, 16
    dataType: DataType;
  };
}
```

### 2.2 计算核心设计

#### 标准/科学计算
使用 `mathjs` 进行表达式求值：

```typescript
import { evaluate, sqrt, log, sin, cos, tan } from 'mathjs';

function calculate(expression: string, angleMode: AngleMode): number {
  const config = {
    angles: angleMode === AngleMode.DEGREE ? 'deg' : 'rad'
  };
  return evaluate(expression, config);
}
```

#### 程序员计算
自定义进制转换和位运算：

```typescript
class ProgrammerCalculator {
  // 进制转换
  convert(value: string, fromBase: number, toBase: number): string {
    const decimal = parseInt(value, fromBase);
    return decimal.toString(toBase).toUpperCase();
  }
  
  // 位运算
  bitwise(a: number, b: number, op: BitwiseOp): number {
    switch(op) {
      case 'AND': return a & b;
      case 'OR': return a | b;
      case 'XOR': return a ^ b;
      case 'NOT': return ~a;
      case 'SHL': return a << b;
      case 'SHR': return a >> b;
    }
  }
}
```

#### 微积分计算
使用 `Algebrite` 进行符号计算：

```typescript
import { derivative, integral, simplify } from 'algebrite';

class CalculusEngine {
  // 求导
  derive(expression: string, variable: string): string {
    const result = derivative(expression, variable);
    return simplify(result).toString();
  }
  
  // 不定积分
  integrate(expression: string, variable: string): string {
    const result = integral(expression, variable);
    return simplify(result).toString();
  }
  
  // 定积分 (数值方法)
  definiteIntegral(
    expression: string, 
    variable: string, 
    lower: number, 
    upper: number
  ): number {
    // 使用 Simpson 法则或 mathjs 数值积分
  }
}
```

### 2.3 组件架构

#### Calculator (容器组件)
```typescript
function Calculator() {
  const { state, dispatch } = useCalculator();
  
  return (
    <div className="calculator-container">
      <ModeTabs mode={state.mode} onChange={dispatch.setMode} />
      <Display 
        value={state.display} 
        expression={state.expression}
        result={state.result}
      />
      <Keypad mode={state.mode} onInput={dispatch.input} />
      <HistoryPanel history={state.history} />
    </div>
  );
}
```

#### Display (展示组件)
```typescript
interface DisplayProps {
  value: string;        // 当前输入
  expression: string;   // 完整表达式
  result: string | null; // 计算结果
}

function Display({ value, expression, result }: DisplayProps) {
  return (
    <div className="display">
      <div className="expression">{expression}</div>
      <div className="current">{value}</div>
      {result && <div className="result">= {result}</div>}
    </div>
  );
}
```

## 3. UI 设计

### 3.1 颜色方案

```css
/* 深色模式 */
--bg-primary: #1a1a2e;
--bg-secondary: #16213e;
--bg-tertiary: #0f3460;
--accent: #e94560;
--text-primary: #ffffff;
--text-secondary: #a0a0a0;

/* 浅色模式 */
--bg-primary: #f8f9fa;
--bg-secondary: #e9ecef;
--bg-tertiary: #dee2e6;
--accent: #4361ee;
--text-primary: #212529;
--text-secondary: #6c757d;
```

### 3.2 布局规格

- 计算器宽度: 400px (桌面), 100% (移动端)
- 显示屏高度: 120px
- 按键大小: 60px × 60px
- 按键间距: 8px
- 圆角: 12px

### 3.3 响应式断点

```typescript
// Tailwind 配置
screens: {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
}
```

## 4. 性能优化

### 4.1 计算优化
- 使用 Web Worker 处理复杂计算
- 防抖输入处理 (debounce)
- 缓存计算结果

### 4.2 渲染优化
- React.memo 优化组件重渲染
- useMemo 缓存计算结果
- useCallback 稳定回调引用

### 4.3 加载优化
- 代码分割 (dynamic import)
- 懒加载微积分模块 (较大)
- Tree shaking 移除未使用代码

## 5. 错误处理

### 5.1 计算错误
```typescript
type CalcError = 
  | 'DIVIDE_BY_ZERO'
  | 'INVALID_EXPRESSION'
  | 'OVERFLOW'
  | 'DOMAIN_ERROR'
  | 'SYNTAX_ERROR';

function handleError(error: CalcError): string {
  const messages = {
    DIVIDE_BY_ZERO: '不能除以零',
    INVALID_EXPRESSION: '表达式无效',
    OVERFLOW: '数值溢出',
    DOMAIN_ERROR: '定义域错误',
    SYNTAX_ERROR: '语法错误'
  };
  return messages[error];
}
```

### 5.2 边界情况
- 超大数值处理
- 浮点数精度问题
- 空输入处理
- 无效字符过滤

## 6. 测试策略

### 6.1 单元测试
- 计算函数测试
- 工具函数测试
- 组件渲染测试

### 6.2 集成测试
- 用户操作流程测试
- 模式切换测试
- 历史记录测试

### 6.3 E2E 测试
- 完整计算流程
- 键盘交互测试
- 响应式布局测试
