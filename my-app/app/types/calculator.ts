// 计算器模式
export enum CalculatorMode {
  STANDARD = 'standard',
  SCIENTIFIC = 'scientific',
  PROGRAMMER = 'programmer',
  CALCULUS = 'calculus'
}

// 程序员模式数据类型
export enum DataType {
  BYTE = 8,
  WORD = 16,
  DWORD = 32,
  QWORD = 64
}

// 角度模式
export enum AngleMode {
  DEGREE = 'degree',
  RADIAN = 'radian'
}

// 进制
export enum NumberBase {
  BIN = 2,
  OCT = 8,
  DEC = 10,
  HEX = 16
}

// 位运算操作
export enum BitwiseOp {
  AND = 'AND',
  OR = 'OR',
  XOR = 'XOR',
  NOT = 'NOT',
  SHL = 'SHL',
  SHR = 'SHR'
}

// 微积分操作
export enum CalculusOp {
  DERIVE = 'derive',
  INTEGRATE = 'integrate',
  DEFINITE_INTEGRAL = 'definite_integral',
  LIMIT = 'limit'
}

// 计算历史记录
export interface CalculationHistory {
  id: string;
  expression: string;
  result: string;
  mode: CalculatorMode;
  timestamp: number;
}

// 计算器状态
export interface CalculatorState {
  mode: CalculatorMode;
  display: string;
  expression: string;
  result: string | null;
  error: string | null;
  history: CalculationHistory[];
  angleMode: AngleMode;
  programmer: {
    base: NumberBase;
    dataType: DataType;
  };
  calculus: {
    operation: CalculusOp | null;
    variable: string;
    lowerBound?: string;
    upperBound?: string;
  };
}

// 计算器动作
export type CalculatorAction =
  | { type: 'SET_MODE'; payload: CalculatorMode }
  | { type: 'INPUT_DIGIT'; payload: string }
  | { type: 'INPUT_OPERATOR'; payload: string }
  | { type: 'INPUT_FUNCTION'; payload: string }
  | { type: 'INPUT_CONSTANT'; payload: string }
  | { type: 'CLEAR' }
  | { type: 'CLEAR_ALL' }
  | { type: 'BACKSPACE' }
  | { type: 'CALCULATE' }
  | { type: 'SET_RESULT'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ANGLE_MODE'; payload: AngleMode }
  | { type: 'SET_BASE'; payload: NumberBase }
  | { type: 'SET_DATA_TYPE'; payload: DataType }
  | { type: 'SET_CALCULUS_OP'; payload: CalculusOp }
  | { type: 'SET_VARIABLE'; payload: string }
  | { type: 'SET_BOUNDS'; payload: { lower?: string; upper?: string } }
  | { type: 'ADD_TO_HISTORY'; payload: CalculationHistory }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'LOAD_FROM_HISTORY'; payload: CalculationHistory };

// 主题
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}
