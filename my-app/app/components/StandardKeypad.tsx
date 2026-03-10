'use client';

import React from 'react';
import { useCalculatorContext } from '../context/CalculatorContext';
import { calculateExpression, formatResult } from '../lib/math';

interface ButtonProps {
  label: string;
  value?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
  colSpan?: number;
  rowSpan?: number;
}

const Button: React.FC<ButtonProps> = ({ 
  label, 
  value, 
  onClick, 
  className = '',
  variant = 'default',
  colSpan = 1,
  rowSpan = 1
}) => {
  const baseStyles = 'h-14 sm:h-16 rounded-xl font-medium text-lg sm:text-xl transition-all duration-150 active:scale-95 flex items-center justify-center';
  
  const variantStyles = {
    default: 'bg-gray-700 text-white hover:bg-gray-600 active:bg-gray-500',
    primary: 'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-400 shadow-lg shadow-blue-600/30',
    secondary: 'bg-gray-600 text-white hover:bg-gray-500 active:bg-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-400 active:bg-red-300'
  };

  return (
    <button
      onClick={onClick || (() => {})}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{
        gridColumn: colSpan > 1 ? `span ${colSpan}` : undefined,
        gridRow: rowSpan > 1 ? `span ${rowSpan}` : undefined
      }}
    >
      {label}
    </button>
  );
};

export default function StandardKeypad() {
  const { state, dispatch } = useCalculatorContext();

  const handleNumber = (num: string) => {
    dispatch({ type: 'INPUT_DIGIT', payload: num });
  };

  const handleOperator = (op: string) => {
    dispatch({ type: 'INPUT_OPERATOR', payload: op });
  };

  const handleCalculate = () => {
    try {
      const fullExpression = state.expression + state.display;
      const result = calculateExpression(fullExpression, state.angleMode);
      const formattedResult = formatResult(result);
      dispatch({ type: 'SET_RESULT', payload: formattedResult });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const handleClear = () => {
    dispatch({ type: 'CLEAR_ALL' });
  };

  const handleBackspace = () => {
    dispatch({ type: 'BACKSPACE' });
  };

  const handlePercent = () => {
    try {
      const value = parseFloat(state.display) / 100;
      dispatch({ type: 'SET_RESULT', payload: value.toString() });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: '错误' });
    }
  };

  const handleToggleSign = () => {
    if (state.display !== '0') {
      if (state.display.startsWith('-')) {
        dispatch({ type: 'SET_RESULT', payload: state.display.slice(1) });
      } else {
        dispatch({ type: 'SET_RESULT', payload: '-' + state.display });
      }
    }
  };

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-800 rounded-b-2xl">
      {/* 第一行 */}
      <Button label="C" onClick={handleClear} variant="danger" />
      <Button label="⌫" onClick={handleBackspace} variant="secondary" />
      <Button label="%" onClick={handlePercent} variant="secondary" />
      <Button label="÷" onClick={() => handleOperator('÷')} variant="primary" />

      {/* 第二行 */}
      <Button label="7" onClick={() => handleNumber('7')} />
      <Button label="8" onClick={() => handleNumber('8')} />
      <Button label="9" onClick={() => handleNumber('9')} />
      <Button label="×" onClick={() => handleOperator('×')} variant="primary" />

      {/* 第三行 */}
      <Button label="4" onClick={() => handleNumber('4')} />
      <Button label="5" onClick={() => handleNumber('5')} />
      <Button label="6" onClick={() => handleNumber('6')} />
      <Button label="-" onClick={() => handleOperator('-')} variant="primary" />

      {/* 第四行 */}
      <Button label="1" onClick={() => handleNumber('1')} />
      <Button label="2" onClick={() => handleNumber('2')} />
      <Button label="3" onClick={() => handleNumber('3')} />
      <Button label="+" onClick={() => handleOperator('+')} variant="primary" />

      {/* 第五行 */}
      <Button label="±" onClick={handleToggleSign} variant="secondary" />
      <Button label="0" onClick={() => handleNumber('0')} />
      <Button label="." onClick={() => handleNumber('.')} />
      <Button label="=" onClick={handleCalculate} variant="primary" />
    </div>
  );
}
