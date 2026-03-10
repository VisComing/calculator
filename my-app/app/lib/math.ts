import { 
  evaluate, 
  sqrt, 
  log, 
  log10, 
  log2,
  sin, 
  cos, 
  tan,
  asin,
  acos,
  atan,
  pow,
  factorial as mathFactorial,
  pi,
  e,
  bignumber,
  BigNumber
} from 'mathjs';
import { AngleMode } from '../types/calculator';

// 计算表达式
export function calculateExpression(
  expression: string, 
  angleMode: AngleMode = AngleMode.DEGREE
): number {
  try {
    // 替换显示符号为计算符号
    let expr = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, 'pi')
      .replace(/√/g, 'sqrt')
      .replace(/\^/g, '**');

    // 配置角度模式
    const config = {
      angles: angleMode === AngleMode.DEGREE ? 'deg' : 'rad'
    };

    const result = evaluate(expr, config);
    return typeof result === 'number' ? result : parseFloat(result.toString());
  } catch (error) {
    throw new Error('计算错误: ' + (error as Error).message);
  }
}

// 科学计算函数
export const scientificFunctions = {
  // 三角函数
  sin: (x: number, mode: AngleMode) => sin(x, mode === AngleMode.DEGREE ? 'deg' : 'rad'),
  cos: (x: number, mode: AngleMode) => cos(x, mode === AngleMode.DEGREE ? 'deg' : 'rad'),
  tan: (x: number, mode: AngleMode) => tan(x, mode === AngleMode.DEGREE ? 'deg' : 'rad'),
  asin: (x: number, mode: AngleMode) => {
    const result = asin(x);
    return mode === AngleMode.DEGREE ? (result * 180 / Math.PI) : result;
  },
  acos: (x: number, mode: AngleMode) => {
    const result = acos(x);
    return mode === AngleMode.DEGREE ? (result * 180 / Math.PI) : result;
  },
  atan: (x: number, mode: AngleMode) => {
    const result = atan(x);
    return mode === AngleMode.DEGREE ? (result * 180 / Math.PI) : result;
  },
  
  // 对数函数
  log: (x: number) => log10(x),
  ln: (x: number) => log(x),
  log2: (x: number) => log2(x),
  logBase: (x: number, base: number) => log(x) / log(base),
  
  // 指数函数
  exp: (x: number) => Math.exp(x),
  exp10: (x: number) => Math.pow(10, x),
  exp2: (x: number) => Math.pow(2, x),
  pow: (x: number, y: number) => pow(x, y),
  sqrt: (x: number) => sqrt(x),
  cbrt: (x: number) => Math.cbrt(x),
  
  // 其他函数
  abs: (x: number) => Math.abs(x),
  floor: (x: number) => Math.floor(x),
  ceil: (x: number) => Math.ceil(x),
  round: (x: number) => Math.round(x),
  factorial: (n: number) => {
    if (n < 0 || !Number.isInteger(n)) throw new Error('阶乘只支持非负整数');
    if (n > 170) throw new Error('数值过大');
    return mathFactorial(n);
  },
  
  // 统计函数
  permutations: (n: number, r: number) => {
    if (n < 0 || r < 0 || !Number.isInteger(n) || !Number.isInteger(r)) {
      throw new Error('排列参数必须为非负整数');
    }
    if (r > n) throw new Error('r 不能大于 n');
    return mathFactorial(n) / mathFactorial(n - r);
  },
  combinations: (n: number, r: number) => {
    if (n < 0 || r < 0 || !Number.isInteger(n) || !Number.isInteger(r)) {
      throw new Error('组合参数必须为非负整数');
    }
    if (r > n) throw new Error('r 不能大于 n');
    return mathFactorial(n) / (mathFactorial(r) * mathFactorial(n - r));
  },
  
  // 常数
  PI: Math.PI,
  E: Math.E,
  PHI: (1 + Math.sqrt(5)) / 2, // 黄金比例
};

// 程序员计算
export class ProgrammerCalculator {
  // 进制转换
  static convert(value: string, fromBase: number, toBase: number): string {
    const decimal = parseInt(value, fromBase);
    if (isNaN(decimal)) throw new Error('无效的数值');
    return decimal.toString(toBase).toUpperCase();
  }
  
  // 位运算
  static bitwise(a: number, b: number, op: string): number {
    switch(op) {
      case 'AND': return a & b;
      case 'OR': return a | b;
      case 'XOR': return a ^ b;
      case 'NOT': return ~a;
      case 'SHL': return a << b;
      case 'SHR': return a >> b;
      default: throw new Error('未知的位运算');
    }
  }
  
  // 限制数值范围
  static clamp(value: number, bits: number): number {
    const max = Math.pow(2, bits) - 1;
    const min = 0;
    return Math.max(min, Math.min(max, value));
  }
  
  // 格式化不同进制的显示
  static format(value: number, base: number): string {
    switch(base) {
      case 2: return '0b' + value.toString(2);
      case 8: return '0o' + value.toString(8);
      case 10: return value.toString(10);
      case 16: return '0x' + value.toString(16).toUpperCase();
      default: return value.toString(base);
    }
  }
}

// 微积分计算 (简化版)
export class CalculusEngine {
  // 数值求导
  static derivative(f: (x: number) => number, x: number, h: number = 1e-5): number {
    return (f(x + h) - f(x - h)) / (2 * h);
  }
  
  // 数值积分 (Simpson法则)
  static integrate(
    f: (x: number) => number, 
    a: number, 
    b: number, 
    n: number = 1000
  ): number {
    if (n % 2 !== 0) n++;
    const h = (b - a) / n;
    let sum = f(a) + f(b);
    
    for (let i = 1; i < n; i++) {
      const x = a + i * h;
      sum += (i % 2 === 0 ? 2 : 4) * f(x);
    }
    
    return sum * h / 3;
  }
  
  // 解析求导 (简单规则)
  static symbolicDerivative(expression: string, variable: string = 'x'): string {
    // 移除空格
    let expr = expression.replace(/\s/g, '');
    
    // 简单规则匹配
    // 常数
    if (/^-?\d+(\.\d+)?$/.test(expr)) return '0';
    
    // x^n
    const powerMatch = expr.match(new RegExp(`^${variable}\^(\\d+)$`));
    if (powerMatch) {
      const n = parseInt(powerMatch[1]);
      if (n === 1) return '1';
      if (n === 2) return `2*${variable}`;
      return `${n}*${variable}^${n-1}`;
    }
    
    // ax^n
    const coeffPowerMatch = expr.match(new RegExp(`^(-?\\d+(?:\\.\\d+)?)\\*?${variable}\^(\\d+)$`));
    if (coeffPowerMatch) {
      const a = coeffPowerMatch[1];
      const n = parseInt(coeffPowerMatch[2]);
      const newCoeff = parseFloat(a) * n;
      if (n === 1) return `${newCoeff}`;
      if (n === 2) return `${newCoeff}*${variable}`;
      return `${newCoeff}*${variable}^${n-1}`;
    }
    
    // ax
    const linearMatch = expr.match(new RegExp(`^(-?\\d+(?:\\.\\d+)?)\\*?${variable}$`));
    if (linearMatch) {
      return linearMatch[1];
    }
    
    // x
    if (expr === variable) return '1';
    
    // sin(x)
    if (expr === `sin(${variable})`) return `cos(${variable})`;
    
    // cos(x)
    if (expr === `cos(${variable})`) return `-sin(${variable})`;
    
    // e^x
    if (expr === `e^${variable}` || expr === `exp(${variable})`) return `e^${variable}`;
    
    // ln(x)
    if (expr === `ln(${variable})`) return `1/${variable}`;
    
    return '无法解析求导';
  }
  
  // 解析积分 (简单规则)
  static symbolicIntegrate(expression: string, variable: string = 'x'): string {
    let expr = expression.replace(/\s/g, '');
    
    // 常数
    if (/^-?\d+(\.\d+)?$/.test(expr)) {
      return `${expr}*${variable}`;
    }
    
    // x^n
    const powerMatch = expr.match(new RegExp(`^${variable}\^(\\d+)$`));
    if (powerMatch) {
      const n = parseInt(powerMatch[1]);
      return `${variable}^${n+1}/${n+1}`;
    }
    
    // x (即 x^1)
    if (expr === variable) {
      return `${variable}^2/2`;
    }
    
    // ax^n
    const coeffPowerMatch = expr.match(new RegExp(`^(-?\\d+(?:\\.\\d+)?)\\*?${variable}\^(\\d+)$`));
    if (coeffPowerMatch) {
      const a = coeffPowerMatch[1];
      const n = parseInt(coeffPowerMatch[2]);
      return `${a}*${variable}^${n+1}/${n+1}`;
    }
    
    // ax
    const linearMatch = expr.match(new RegExp(`^(-?\\d+(?:\\.\\d+)?)\\*?${variable}$`));
    if (linearMatch) {
      const a = linearMatch[1];
      return `${a}*${variable}^2/2`;
    }
    
    // sin(x)
    if (expr === `sin(${variable})`) return `-cos(${variable})`;
    
    // cos(x)
    if (expr === `cos(${variable})`) return `sin(${variable})`;
    
    // e^x
    if (expr === `e^${variable}` || expr === `exp(${variable})`) return `e^${variable}`;
    
    // 1/x
    if (expr === `1/${variable}`) return `ln|${variable}|`;
    
    return '无法解析积分';
  }
}

// 格式化结果
export function formatResult(value: number, maxDecimals: number = 10): string {
  if (isNaN(value)) return 'Error';
  if (!isFinite(value)) return value > 0 ? '∞' : '-∞';
  
  // 处理非常小的数
  if (Math.abs(value) < 1e-10 && value !== 0) {
    return value.toExponential(6);
  }
  
  // 处理非常大的数
  if (Math.abs(value) > 1e10) {
    return value.toExponential(6);
  }
  
  // 去除末尾的零
  const str = value.toFixed(maxDecimals);
  return parseFloat(str).toString();
}
