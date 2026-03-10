'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  CalculatorMode,
  CalculatorState,
  CalculatorAction,
  AngleMode,
  NumberBase,
  DataType,
  CalculusOp,
  CalculationHistory
} from '../types/calculator';
import { generateId } from '../lib/utils';

// 初始状态
const initialState: CalculatorState = {
  mode: CalculatorMode.STANDARD,
  display: '0',
  expression: '',
  result: null,
  error: null,
  history: [],
  angleMode: AngleMode.DEGREE,
  programmer: {
    base: NumberBase.DEC,
    dataType: DataType.QWORD
  },
  calculus: {
    operation: null,
    variable: 'x',
    lowerBound: '',
    upperBound: ''
  }
};

// Reducer
function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'SET_MODE':
      return {
        ...state,
        mode: action.payload,
        display: '0',
        expression: '',
        result: null,
        error: null
      };

    case 'INPUT_DIGIT':
      if (state.error) {
        return {
          ...state,
          display: action.payload,
          error: null
        };
      }
      if (state.result !== null) {
        return {
          ...state,
          display: action.payload,
          expression: '',
          result: null
        };
      }
      if (state.display === '0' && action.payload !== '.') {
        return { ...state, display: action.payload };
      }
      if (state.display.length >= 16) {
        return state;
      }
      return { ...state, display: state.display + action.payload };

    case 'INPUT_OPERATOR':
      if (state.error) {
        return { ...state, error: null };
      }
      let newExpression = state.expression;
      let newDisplay = state.display;
      
      if (state.result !== null) {
        newExpression = state.result;
        newDisplay = state.result;
        state.result = null;
      }
      
      return {
        ...state,
        expression: newExpression + newDisplay + action.payload,
        display: '0'
      };

    case 'INPUT_FUNCTION':
      if (state.error) {
        return { ...state, error: null };
      }
      if (state.result !== null) {
        return {
          ...state,
          expression: '',
          display: action.payload + '(',
          result: null
        };
      }
      return {
        ...state,
        display: state.display === '0' ? action.payload + '(' : state.display + action.payload + '('
      };

    case 'INPUT_CONSTANT':
      if (state.error) {
        return {
          ...state,
          display: action.payload,
          error: null
        };
      }
      if (state.result !== null) {
        return {
          ...state,
          expression: '',
          display: action.payload,
          result: null
        };
      }
      return {
        ...state,
        display: state.display === '0' ? action.payload : state.display + action.payload
      };

    case 'CLEAR':
      return {
        ...state,
        display: '0',
        error: null
      };

    case 'CLEAR_ALL':
      return {
        ...state,
        display: '0',
        expression: '',
        result: null,
        error: null
      };

    case 'BACKSPACE':
      if (state.error || state.result !== null) {
        return {
          ...state,
          display: '0',
          error: null,
          result: null
        };
      }
      if (state.display.length === 1) {
        return { ...state, display: '0' };
      }
      return { ...state, display: state.display.slice(0, -1) };

    case 'CALCULATE':
      return state;

    case 'SET_RESULT':
      const historyItem: CalculationHistory = {
        id: generateId(),
        expression: state.expression + state.display,
        result: action.payload,
        mode: state.mode,
        timestamp: Date.now()
      };
      return {
        ...state,
        result: action.payload,
        display: action.payload,
        expression: '',
        history: [historyItem, ...state.history].slice(0, 50)
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        result: null
      };

    case 'SET_ANGLE_MODE':
      return { ...state, angleMode: action.payload };

    case 'SET_BASE':
      return {
        ...state,
        programmer: { ...state.programmer, base: action.payload }
      };

    case 'SET_DATA_TYPE':
      return {
        ...state,
        programmer: { ...state.programmer, dataType: action.payload }
      };

    case 'SET_CALCULUS_OP':
      return {
        ...state,
        calculus: { ...state.calculus, operation: action.payload }
      };

    case 'SET_VARIABLE':
      return {
        ...state,
        calculus: { ...state.calculus, variable: action.payload }
      };

    case 'SET_BOUNDS':
      return {
        ...state,
        calculus: {
          ...state.calculus,
          lowerBound: action.payload.lower ?? state.calculus.lowerBound,
          upperBound: action.payload.upper ?? state.calculus.upperBound
        }
      };

    case 'ADD_TO_HISTORY':
      return {
        ...state,
        history: [action.payload, ...state.history].slice(0, 50)
      };

    case 'CLEAR_HISTORY':
      return { ...state, history: [] };

    case 'LOAD_FROM_HISTORY':
      return {
        ...state,
        display: action.payload.result,
        expression: '',
        result: null
      };

    default:
      return state;
  }
}

// Context
interface CalculatorContextType {
  state: CalculatorState;
  dispatch: React.Dispatch<CalculatorAction>;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

// Provider
export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  return (
    <CalculatorContext.Provider value={{ state, dispatch }}>
      {children}
    </CalculatorContext.Provider>
  );
}

// Hook
export function useCalculatorContext() {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculatorContext must be used within a CalculatorProvider');
  }
  return context;
}
