export type CalculatorMode = 'standard' | 'programmer' | 'scientific';

export type Operator = '+' | '-' | '*' | '/' | '%' | '^' | null;

export type MemoryOperation = 'MC' | 'MR' | 'M+' | 'M-' | 'MS';

export type Base = 2 | 8 | 10 | 16;
export type BitWidth = 8 | 16 | 32 | 64;
export type AngleMode = 'deg' | 'rad';

export interface CalculationHistory {
  id: string;
  expression: string;
  result: string;
  mode: CalculatorMode;
  timestamp: number;
}

export interface ProgrammerSettings {
  base: Base;
  bitWidth: BitWidth;
}

export interface ScientificSettings {
  angleMode: AngleMode;
}

export interface CalculatorState {
  mode: CalculatorMode;
  display: string;
  expression: string;
  previousValue: string;
  operator: Operator;
  waitingForOperand: boolean;
  memory: number;
  history: CalculationHistory[];
  programmerSettings: ProgrammerSettings;
  scientificSettings: ScientificSettings;
}

export interface CalculateRequest {
  expression: string;
  mode: CalculatorMode;
  base?: Base;
  angleMode?: AngleMode;
}

export interface CalculateResponse {
  result: string | number;
  error?: string;
}
