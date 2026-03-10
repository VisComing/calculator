'use client';

import React from 'react';
import { useCalculatorContext } from '../context/CalculatorContext';
import { NumberBase, DataType, BitwiseOp } from '../types/calculator';
import { ProgrammerCalculator } from '../lib/math';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'danger' | 'disabled';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'default',
  disabled = false
}) => {
  const baseStyles = 'h-12 sm:h-14 rounded-lg font-medium text-sm sm:text-base transition-all duration-150 flex items-center justify-center';
  
  const variantStyles = {
    default: 'bg-gray-700 text-white hover:bg-gray-600 active:bg-gray-500 active:scale-95',
    primary: 'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-400 shadow-lg shadow-blue-600/30 active:scale-95',
    secondary: 'bg-gray-600 text-white hover:bg-gray-500 active:bg-gray-400 active:scale-95',
    accent: 'bg-purple-600 text-white hover:bg-purple-500 active:bg-purple-400 active:scale-95',
    danger: 'bg-red-500 text-white hover:bg-red-400 active:bg-red-300 active:scale-95',
    disabled: 'bg-gray-800 text-gray-600 cursor-not-allowed'
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[disabled ? 'disabled' : variant]}`}
    >
      {label}
    </button>
  );
};

export default function ProgrammerKeypad() {
  const { state, dispatch } = useCalculatorContext();
  const { base, dataType } = state.programmer;

  // 检查数字是否在当前进制下有效
  const isValidDigit = (digit: string): boolean => {
    const digitValue = parseInt(digit, 36);
    return digitValue < base;
  };

  const handleDigit = (digit: string) => {
    if (!isValidDigit(digit)) return;
    dispatch({ type: 'INPUT_DIGIT', payload: digit });
  };

  const handleClear = () => {
    dispatch({ type: 'CLEAR_ALL' });
  };

  const handleBackspace = () => {
    dispatch({ type: 'BACKSPACE' });
  };

  const handleBaseChange = (newBase: NumberBase) => {
    // 转换当前数值到新进制
    try {
      const currentValue = parseInt(state.display || '0', base);
      dispatch({ type: 'SET_BASE', payload: newBase });
      dispatch({ type: 'SET_RESULT', payload: currentValue.toString(newBase).toUpperCase() });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: '转换错误' });
    }
  };

  const handleDataTypeChange = (type: DataType) => {
    dispatch({ type: 'SET_DATA_TYPE', payload: type });
  };

  const handleBitwise = (op: BitwiseOp) => {
    // 位运算需要存储第一个操作数
    dispatch({ type: 'INPUT_OPERATOR', payload: op });
  };

  const handleCalculate = () => {
    try {
      const parts = state.expression.split(/(AND|OR|XOR|NOT|<<|>>)/);
      if (parts.length < 2) {
        dispatch({ type: 'SET_RESULT', payload: state.display });
        return;
      }

      const a = parseInt(parts[0], base);
      const op = parts[1].trim();
      const b = parseInt(state.display, base);

      let result: number;
      switch (op) {
        case 'AND':
          result = ProgrammerCalculator.bitwise(a, b, 'AND');
          break;
        case 'OR':
          result = ProgrammerCalculator.bitwise(a, b, 'OR');
          break;
        case 'XOR':
          result = ProgrammerCalculator.bitwise(a, b, 'XOR');
          break;
        case 'NOT':
          result = ProgrammerCalculator.bitwise(a, 0, 'NOT');
          break;
        case '<<':
          result = ProgrammerCalculator.bitwise(a, b, 'SHL');
          break;
        case '>>':
          result = ProgrammerCalculator.bitwise(a, b, 'SHR');
          break;
        default:
          throw new Error('未知操作');
      }

      // 限制到数据类型范围
      const clamped = ProgrammerCalculator.clamp(result, dataType);
      dispatch({ type: 'SET_RESULT', payload: clamped.toString(base).toUpperCase() });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const baseButtons = [
    { label: 'BIN', value: NumberBase.BIN },
    { label: 'OCT', value: NumberBase.OCT },
    { label: 'DEC', value: NumberBase.DEC },
    { label: 'HEX', value: NumberBase.HEX },
  ];

  const dataTypeButtons = [
    { label: 'BYTE', value: DataType.BYTE },
    { label: 'WORD', value: DataType.WORD },
    { label: 'DWORD', value: DataType.DWORD },
    { label: 'QWORD', value: DataType.QWORD },
  ];

  // 根据进制决定哪些按钮可用
  const hexDigits = base >= 16;
  const decDigits = base >= 10;
  const octDigits = base >= 8;

  return (
    <div className="bg-gray-800 rounded-b-2xl overflow-hidden">
      {/* 进制选择 */}
      <div className="flex justify-center p-2 bg-gray-900 gap-1">
        {baseButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => handleBaseChange(btn.value)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              base === btn.value 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* 数据类型选择 */}
      <div className="flex justify-center p-2 bg-gray-900 gap-1 border-t border-gray-800">
        {dataTypeButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => handleDataTypeChange(btn.value)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              dataType === btn.value 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* 位运算区 */}
      <div className="grid grid-cols-4 gap-2 p-3 border-t border-gray-700">
        <Button label="AND" onClick={() => handleBitwise(BitwiseOp.AND)} variant="accent" />
        <Button label="OR" onClick={() => handleBitwise(BitwiseOp.OR)} variant="accent" />
        <Button label="XOR" onClick={() => handleBitwise(BitwiseOp.XOR)} variant="accent" />
        <Button label="NOT" onClick={() => handleBitwise(BitwiseOp.NOT)} variant="accent" />
        <Button label="<<" onClick={() => handleBitwise(BitwiseOp.SHL)} variant="accent" />
        <Button label=">>" onClick={() => handleBitwise(BitwiseOp.SHR)} variant="accent" />
        <Button label="C" onClick={handleClear} variant="danger" />
        <Button label="⌫" onClick={handleBackspace} variant="secondary" />
      </div>

      {/* 数字键盘 */}
      <div className="grid grid-cols-4 gap-2 p-3">
        {/* 十六进制字母 */}
        <Button label="A" onClick={() => handleDigit('A')} disabled={!hexDigits} />
        <Button label="B" onClick={() => handleDigit('B')} disabled={!hexDigits} />
        <Button label="C" onClick={() => handleDigit('C')} disabled={!hexDigits} />
        <Button label="D" onClick={() => handleDigit('D')} disabled={!hexDigits} />
        <Button label="E" onClick={() => handleDigit('E')} disabled={!hexDigits} />
        <Button label="F" onClick={() => handleDigit('F')} disabled={!hexDigits} />
        <Button label="7" onClick={() => handleDigit('7')} disabled={!octDigits} />
        <Button label="8" onClick={() => handleDigit('8')} disabled={!octDigits} />
        <Button label="9" onClick={() => handleDigit('9')} disabled={!decDigits} />
        <Button label="4" onClick={() => handleDigit('4')} />
        <Button label="5" onClick={() => handleDigit('5')} />
        <Button label="6" onClick={() => handleDigit('6')} />
        <Button label="1" onClick={() => handleDigit('1')} />
        <Button label="2" onClick={() => handleDigit('2')} />
        <Button label="3" onClick={() => handleDigit('3')} />
        <Button label="=" onClick={handleCalculate} variant="primary" />
        <Button label="0" onClick={() => handleDigit('0')} />
      </div>
    </div>
  );
}
