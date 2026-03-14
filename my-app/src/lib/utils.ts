import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number, maxDecimals: number = 10): string {
  if (Number.isNaN(num)) return 'Error';
  if (!Number.isFinite(num)) return num > 0 ? 'Infinity' : '-Infinity';

  const str = num.toString();
  if (str.length > 16) {
    return num.toExponential(10);
  }

  return parseFloat(num.toFixed(maxDecimals)).toString();
}

export function evaluateExpression(expr: string): number {
  try {
    // 替换数学常数
    let sanitized = expr
      .replace(/π/g, Math.PI.toString())
      .replace(/pi/g, Math.PI.toString())
      .replace(/e(?![a-z])/gi, Math.E.toString());

    // 替换运算符
    sanitized = sanitized
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/\^/g, '**');

    // 安全评估 - 只允许数字和基本运算符
    if (!/^[\d\+\-\*\/\%\(\)\.\s\*\*]+$/.test(sanitized)) {
      throw new Error('Invalid expression');
    }

    // eslint-disable-next-line no-new-func
    const result = new Function(`return ${sanitized}`)();
    return Number(result);
  } catch {
    return NaN;
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
