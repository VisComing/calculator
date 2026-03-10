'use client';

import React from 'react';
import { useCalculatorContext } from '../context/CalculatorContext';
import { CalculusEngine, formatResult } from '../lib/math';
import { CalculusOp } from '../types/calculator';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'danger';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'default',
  className = ''
}) => {
  const baseStyles = 'h-12 rounded-lg font-medium text-sm transition-all duration-150 active:scale-95 flex items-center justify-center';
  
  const variantStyles = {
    default: 'bg-gray-700 text-white hover:bg-gray-600 active:bg-gray-500',
    primary: 'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-400 shadow-lg shadow-blue-600/30',
    secondary: 'bg-gray-600 text-white hover:bg-gray-500 active:bg-gray-400',
    accent: 'bg-purple-600 text-white hover:bg-purple-500 active:bg-purple-400',
    danger: 'bg-red-500 text-white hover:bg-red-400 active:bg-red-300'
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {label}
    </button>
  );
};

export default function CalculusPanel() {
  const { state, dispatch } = useCalculatorContext();
  const { operation, variable, lowerBound, upperBound } = state.calculus;

  const handleInput = (value: string) => {
    dispatch({ type: 'INPUT_DIGIT', payload: value });
  };

  const handleClear = () => {
    dispatch({ type: 'CLEAR_ALL' });
    dispatch({ type: 'SET_CALCULUS_OP', payload: CalculusOp.DERIVE });
  };

  const handleBackspace = () => {
    dispatch({ type: 'BACKSPACE' });
  };

  const handleVariableChange = (v: string) => {
    dispatch({ type: 'SET_VARIABLE', payload: v });
  };

  const handleOperationChange = (op: CalculusOp) => {
    dispatch({ type: 'SET_CALCULUS_OP', payload: op });
  };

  const handleBoundChange = (type: 'lower' | 'upper', value: string) => {
    dispatch({ 
      type: 'SET_BOUNDS', 
      payload: type === 'lower' ? { lower: value } : { upper: value } 
    });
  };

  const handleCalculate = () => {
    try {
      const expr = state.display;
      let result: string;

      switch (operation) {
        case CalculusOp.DERIVE:
          result = CalculusEngine.symbolicDerivative(expr, variable);
          break;
        case CalculusOp.INTEGRATE:
          result = CalculusEngine.symbolicIntegrate(expr, variable);
          break;
        case CalculusOp.DEFINITE_INTEGRAL:
          if (!lowerBound || !upperBound) {
            dispatch({ type: 'SET_ERROR', payload: '请输入上下限' });
            return;
          }
          const lower = parseFloat(lowerBound);
          const upper = parseFloat(upperBound);
          // 数值积分
          const integral = CalculusEngine.integrate(
            (x) => {
              try {
                // 简单表达式求值
                const replaced = expr.replace(new RegExp(variable, 'g'), x.toString());
                return eval(replaced);
              } catch {
                return 0;
              }
            },
            lower,
            upper
          );
          result = formatResult(integral);
          break;
        default:
          result = '未知操作';
      }

      dispatch({ type: 'SET_RESULT', payload: result });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  return (
    <div className="bg-gray-800 rounded-b-2xl overflow-hidden">
      {/* 操作选择 */}
      <div className="p-3 bg-gray-900">
        <div className="grid grid-cols-3 gap-2 mb-3">
          <button
            onClick={() => handleOperationChange(CalculusOp.DERIVE)}
            className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              operation === CalculusOp.DERIVE 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            求导 d/dx
          </button>
          <button
            onClick={() => handleOperationChange(CalculusOp.INTEGRATE)}
            className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              operation === CalculusOp.INTEGRATE 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            不定积分 ∫
          </button>
          <button
            onClick={() => handleOperationChange(CalculusOp.DEFINITE_INTEGRAL)}
            className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              operation === CalculusOp.DEFINITE_INTEGRAL 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            定积分 ∫ₐᵇ
          </button>
        </div>

        {/* 变量选择 */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-gray-400 text-sm">变量:</span>
          {['x', 'y', 'z', 't'].map((v) => (
            <button
              key={v}
              onClick={() => handleVariableChange(v)}
              className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                variable === v 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {/* 定积分上下限 */}
        {operation === CalculusOp.DEFINITE_INTEGRAL && (
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-gray-400 text-xs block mb-1">下限 a</label>
              <input
                type="text"
                value={lowerBound}
                onChange={(e) => handleBoundChange('lower', e.target.value)}
                placeholder="0"
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm border border-gray-700 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="text-gray-400 text-xs block mb-1">上限 b</label>
              <input
                type="text"
                value={upperBound}
                onChange={(e) => handleBoundChange('upper', e.target.value)}
                placeholder="1"
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm border border-gray-700 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* 表达式输入提示 */}
      <div className="px-3 py-2 bg-gray-800 border-t border-gray-700">
        <p className="text-xs text-gray-400">
          输入表达式 (例如: x^2, sin(x), e^x, 3*x+2)
        </p>
      </div>

      {/* 键盘 */}
      <div className="grid grid-cols-4 gap-2 p-3">
        <Button label="sin" onClick={() => handleInput('sin(')} variant="accent" />
        <Button label="cos" onClick={() => handleInput('cos(')} variant="accent" />
        <Button label="tan" onClick={() => handleInput('tan(')} variant="accent" />
        <Button label="C" onClick={handleClear} variant="danger" />

        <Button label="ln" onClick={() => handleInput('ln(')} variant="accent" />
        <Button label="log" onClick={() => handleInput('log(')} variant="accent" />
        <Button label="e^" onClick={() => handleInput('e^')} variant="accent" />
        <Button label="⌫" onClick={handleBackspace} variant="secondary" />

        <Button label="(" onClick={() => handleInput('(')} variant="secondary" />
        <Button label=")" onClick={() => handleInput(')')} variant="secondary" />
        <Button label="^" onClick={() => handleInput('^')} variant="secondary" />
        <Button label="/" onClick={() => handleInput('/')} variant="primary" />

        <Button label="7" onClick={() => handleInput('7')} />
        <Button label="8" onClick={() => handleInput('8')} />
        <Button label="9" onClick={() => handleInput('9')} />
        <Button label="×" onClick={() => handleInput('*')} variant="primary" />

        <Button label="4" onClick={() => handleInput('4')} />
        <Button label="5" onClick={() => handleInput('5')} />
        <Button label="6" onClick={() => handleInput('6')} />
        <Button label="-" onClick={() => handleInput('-')} variant="primary" />

        <Button label="1" onClick={() => handleInput('1')} />
        <Button label="2" onClick={() => handleInput('2')} />
        <Button label="3" onClick={() => handleInput('3')} />
        <Button label="+" onClick={() => handleInput('+')} variant="primary" />

        <Button label={variable} onClick={() => handleInput(variable)} variant="accent" />
        <Button label="0" onClick={() => handleInput('0')} />
        <Button label="." onClick={() => handleInput('.')} />
        <Button label="=" onClick={handleCalculate} variant="primary" />
      </div>

      {/* 常用函数提示 */}
      <div className="px-3 py-2 bg-gray-900 border-t border-gray-700">
        <p className="text-xs text-gray-500">
          支持的函数: sin, cos, tan, ln, log, e^x, x^n, 1/x, sqrt(x)
        </p>
      </div>
    </div>
  );
}
