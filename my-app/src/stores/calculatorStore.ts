import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  CalculatorMode,
  Operator,
  CalculationHistory,
  MemoryOperation,
  Base,
  BitWidth,
  AngleMode,
} from '@/types';
import { generateId, formatNumber } from '@/lib/utils';
import { applyBitWidth, baseToDecimal, decimalToBase } from '@/lib/converters';

interface CalculatorStore {
  mode: CalculatorMode;
  display: string;
  expression: string;
  previousValue: string;
  operator: Operator;
  waitingForOperand: boolean;
  memory: number;
  history: CalculationHistory[];
  programmerSettings: { base: Base; bitWidth: BitWidth };
  scientificSettings: { angleMode: AngleMode };

  // Actions
  setMode: (mode: CalculatorMode) => void;
  inputDigit: (digit: string) => void;
  inputDecimal: () => void;
  inputOperator: (operator: Operator) => void;
  calculate: () => void;
  clear: () => void;
  clearEntry: () => void;
  backspace: () => void;
  toggleSign: () => void;
  inputPercent: () => void;
  memoryOperation: (operation: MemoryOperation) => void;
  setProgrammerBase: (base: Base) => void;
  setProgrammerBitWidth: (bitWidth: BitWidth) => void;
  setAngleMode: (mode: AngleMode) => void;
  clearHistory: () => void;
  applyScientificFunction: (func: string) => void;
  applyBitwiseOperation: (operation: string) => void;
}

const initialState = {
  mode: 'standard' as CalculatorMode,
  display: '0',
  expression: '',
  previousValue: '',
  operator: null as Operator,
  waitingForOperand: false,
  memory: 0,
  history: [] as CalculationHistory[],
  programmerSettings: { base: 10 as Base, bitWidth: 64 as BitWidth },
  scientificSettings: { angleMode: 'deg' as AngleMode },
};

export const useCalculatorStore = create<CalculatorStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setMode: (mode) => {
        set({ ...initialState, mode });
      },

      inputDigit: (digit) => {
        const { display, waitingForOperand, mode, programmerSettings } = get();

        if (waitingForOperand) {
          set({ display: digit, waitingForOperand: false });
        } else {
          if (mode === 'programmer' && programmerSettings.base !== 10) {
            // Programmer mode with non-decimal base
            const newDisplay = display === '0' ? digit : display + digit;
            set({ display: newDisplay });
          } else {
            const newDisplay = display === '0' ? digit : display + digit;
            set({ display: newDisplay });
          }
        }
      },

      inputDecimal: () => {
        const { display, waitingForOperand, mode, programmerSettings } = get();

        if (mode === 'programmer' && programmerSettings.base !== 10) {
          return; // Only decimal in base 10
        }

        if (waitingForOperand) {
          set({ display: '0.', waitingForOperand: false });
        } else if (!display.includes('.')) {
          set({ display: display + '.' });
        }
      },

      inputOperator: (operator) => {
        const { display, calculate } = get();

        calculate();
        set({
          previousValue: display,
          operator,
          waitingForOperand: true,
          expression: `${display} ${operator}`,
        });
      },

      calculate: () => {
        const { display, previousValue, operator, mode, programmerSettings, history } = get();

        if (!operator || !previousValue) return;

        let a = parseFloat(previousValue);
        let b = parseFloat(display);
        let result = 0;

        if (mode === 'programmer') {
          const { base } = programmerSettings;
          a = baseToDecimal(previousValue, base);
          b = baseToDecimal(display, base);
        }

        switch (operator) {
          case '+':
            result = a + b;
            break;
          case '-':
            result = a - b;
            break;
          case '*':
            result = a * b;
            break;
          case '/':
            result = b === 0 ? NaN : a / b;
            break;
          case '%':
            result = a % b;
            break;
          case '^':
            result = Math.pow(a, b);
            break;
        }

        if (mode === 'programmer') {
          const { bitWidth } = programmerSettings;
          result = applyBitWidth(Math.floor(result), bitWidth, true);
        }

        const formattedResult = formatNumber(result);

        // Add to history
        const newHistoryItem: CalculationHistory = {
          id: generateId(),
          expression: `${previousValue} ${operator} ${display}`,
          result: formattedResult,
          mode,
          timestamp: Date.now(),
        };

        set({
          display: formattedResult,
          previousValue: '',
          operator: null,
          waitingForOperand: true,
          expression: '',
          history: [newHistoryItem, ...history].slice(0, 50),
        });
      },

      clear: () => {
        set({
          display: '0',
          expression: '',
          previousValue: '',
          operator: null,
          waitingForOperand: false,
        });
      },

      clearEntry: () => {
        set({ display: '0' });
      },

      backspace: () => {
        const { display, waitingForOperand } = get();
        if (waitingForOperand) return;

        if (display.length > 1) {
          set({ display: display.slice(0, -1) });
        } else {
          set({ display: '0' });
        }
      },

      toggleSign: () => {
        const { display, mode, programmerSettings } = get();
        let value = parseFloat(display);

        if (mode === 'programmer') {
          const { base, bitWidth } = programmerSettings;
          value = baseToDecimal(display, base);
          value = -value;
          value = applyBitWidth(value, bitWidth, true);
          set({ display: decimalToBase(value, base) });
        } else {
          set({ display: formatNumber(-value) });
        }
      },

      inputPercent: () => {
        const { display, previousValue, operator } = get();
        let value = parseFloat(display);

        if (previousValue && operator) {
          const baseValue = parseFloat(previousValue);
          value = (baseValue * value) / 100;
        } else {
          value = value / 100;
        }

        set({ display: formatNumber(value) });
      },

      memoryOperation: (operation) => {
        const { display, memory } = get();
        const value = parseFloat(display);

        switch (operation) {
          case 'MC':
            set({ memory: 0 });
            break;
          case 'MR':
            set({ display: formatNumber(memory), waitingForOperand: true });
            break;
          case 'M+':
            set({ memory: memory + value });
            break;
          case 'M-':
            set({ memory: memory - value });
            break;
          case 'MS':
            set({ memory: value });
            break;
        }
      },

      setProgrammerBase: (base) => {
        const { display, programmerSettings } = get();
        const currentValue = baseToDecimal(display, programmerSettings.base);
        set({
          programmerSettings: { ...programmerSettings, base },
          display: decimalToBase(currentValue, base),
        });
      },

      setProgrammerBitWidth: (bitWidth) => {
        set({
          programmerSettings: { ...get().programmerSettings, bitWidth },
        });
      },

      setAngleMode: (angleMode) => {
        set({ scientificSettings: { ...get().scientificSettings, angleMode } });
      },

      clearHistory: () => {
        set({ history: [] });
      },

      applyScientificFunction: (func) => {
        const { display, scientificSettings } = get();
        let value = parseFloat(display);
        const { angleMode } = scientificSettings;

        // Convert to radians if in deg mode
        const toRad = (deg: number) => (deg * Math.PI) / 180;
        const input = angleMode === 'deg' && ['sin', 'cos', 'tan'].includes(func) ? toRad(value) : value;

        let result = 0;
        switch (func) {
          case 'sin':
            result = Math.sin(input);
            break;
          case 'cos':
            result = Math.cos(input);
            break;
          case 'tan':
            result = Math.tan(input);
            break;
          case 'asin':
            result = Math.asin(value);
            if (angleMode === 'deg') result = (result * 180) / Math.PI;
            break;
          case 'acos':
            result = Math.acos(value);
            if (angleMode === 'deg') result = (result * 180) / Math.PI;
            break;
          case 'atan':
            result = Math.atan(value);
            if (angleMode === 'deg') result = (result * 180) / Math.PI;
            break;
          case 'sinh':
            result = Math.sinh(value);
            break;
          case 'cosh':
            result = Math.cosh(value);
            break;
          case 'tanh':
            result = Math.tanh(value);
            break;
          case 'log':
            result = Math.log10(value);
            break;
          case 'ln':
            result = Math.log(value);
            break;
          case 'sqrt':
            result = Math.sqrt(value);
            break;
          case 'square':
            result = value * value;
            break;
          case 'cube':
            result = value * value * value;
            break;
          case '1/x':
            result = 1 / value;
            break;
          case 'abs':
            result = Math.abs(value);
            break;
          case 'floor':
            result = Math.floor(value);
            break;
          case 'ceil':
            result = Math.ceil(value);
            break;
          case 'fact':
            result = factorial(value);
            break;
          case '10^x':
            result = Math.pow(10, value);
            break;
          case '2^x':
            result = Math.pow(2, value);
            break;
          case 'e^x':
            result = Math.exp(value);
            break;
          case 'pi':
            result = Math.PI;
            break;
          case 'e':
            result = Math.E;
            break;
          default:
            result = value;
        }

        set({ display: formatNumber(result), waitingForOperand: true });
      },

      applyBitwiseOperation: (operation) => {
        const { display, previousValue, programmerSettings } = get();
        const { base, bitWidth } = programmerSettings;

        let a = baseToDecimal(previousValue || display, base);
        let b = baseToDecimal(display, base);
        let result = 0;

        switch (operation) {
          case 'AND':
            result = (a & b) & (Math.pow(2, bitWidth) - 1);
            break;
          case 'OR':
            result = (a | b) & (Math.pow(2, bitWidth) - 1);
            break;
          case 'XOR':
            result = (a ^ b) & (Math.pow(2, bitWidth) - 1);
            break;
          case 'NOT':
            result = (~b) & (Math.pow(2, bitWidth) - 1);
            break;
          case 'NAND':
            result = (~(a & b)) & (Math.pow(2, bitWidth) - 1);
            break;
          case 'NOR':
            result = (~(a | b)) & (Math.pow(2, bitWidth) - 1);
            break;
          case 'SHL':
            result = (b << 1) & (Math.pow(2, bitWidth) - 1);
            break;
          case 'SHR':
            result = b >> 1;
            break;
          default:
            result = b;
        }

        if (operation !== 'NOT' && operation !== 'SHL' && operation !== 'SHR') {
          set({
            previousValue: display,
            waitingForOperand: true,
          });
        }

        set({ display: decimalToBase(result, base) });
      },
    }),
    {
      name: 'calculator-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        mode: state.mode,
        memory: state.memory,
        history: state.history,
        programmerSettings: state.programmerSettings,
        scientificSettings: state.scientificSettings,
      }),
    }
  )
);

function factorial(n: number): number {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity;

  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}
