'use client';

import React from 'react';
import { useCalculatorContext } from '../context/CalculatorContext';
import { calculateExpression, formatResult, scientificFunctions } from '../lib/math';
import { AngleMode } from '../types/calculator';

interface ButtonProps {
  label: string | React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'danger';
  colSpan?: number;
  rowSpan?: number;
}

const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  className = '',
  variant = 'default',
  colSpan = 1,
  rowSpan = 1
}) => {
  const baseStyles = 'h-10 sm:h-12 rounded-lg font-medium text-sm sm:text-base transition-all duration-150 active:scale-95 flex items-center justify-center';
  
  const variantStyles = {
    default: 'bg-gray-700 text-white hover:bg-gray-600 active:bg-gray-500',
    primary: 'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-400 shadow-lg shadow-blue-600/30',
    secondary: 'bg-gray-600 text-white hover:bg-gray-500 active:bg-gray-400',
    accent: 'bg-purple-600 text-white hover:bg-purple-500 active:bg-purple-400',
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

export default function ScientificKeypad() {
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

  const handleFunction = (func: string) => {
    try {
      const value = parseFloat(state.display);
      let result: number;

      switch (func) {
        case 'sin':
          result = scientificFunctions.sin(value, state.angleMode as AngleMode);
          break;
        case 'cos':
          result = scientificFunctions.cos(value, state.angleMode as AngleMode);
          break;
        case 'tan':
          result = scientificFunctions.tan(value, state.angleMode as AngleMode);
          break;
        case 'asin':
          result = scientificFunctions.asin(value, state.angleMode as AngleMode);
          break;
        case 'acos':
          result = scientificFunctions.acos(value, state.angleMode as AngleMode);
          break;
        case 'atan':
          result = scientificFunctions.atan(value, state.angleMode as AngleMode);
          break;
        case 'log':
          result = scientificFunctions.log(value);
          break;
        case 'ln':
          result = scientificFunctions.ln(value);
          break;
        case 'log2':
          result = scientificFunctions.log2(value);
          break;
        case 'sqrt':
          result = scientificFunctions.sqrt(value);
          break;
        case 'cbrt':
          result = scientificFunctions.cbrt(value);
          break;
        case 'exp':
          result = scientificFunctions.exp(value);
          break;
        case 'abs':
          result = scientificFunctions.abs(value);
          break;
        case 'floor':
          result = scientificFunctions.floor(value);
          break;
        case 'ceil':
          result = scientificFunctions.ceil(value);
          break;
        case 'round':
          result = scientificFunctions.round(value);
          break;
        case 'factorial':
          result = scientificFunctions.factorial(value);
          break;
        case '1/x':
          result = 1 / value;
          break;
        case 'x²':
          result = value * value;
          break;
        case 'x³':
          result = value * value * value;
          break;
        case '10^x':
          result = scientificFunctions.exp10(value);
          break;
        case '2^x':
          result = scientificFunctions.exp2(value);
          break;
        case 'e^x':
          result = scientificFunctions.exp(value);
          break;
        default:
          return;
      }

      dispatch({ type: 'SET_RESULT', payload: formatResult(result) });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const handleConstant = (constant: string) => {
    let value: string;
    switch (constant) {
      case 'π':
        value = Math.PI.toString();
        break;
      case 'e':
        value = Math.E.toString();
        break;
      case 'rand':
        value = Math.random().toString();
        break;
      default:
        return;
    }
    dispatch({ type: 'INPUT_DIGIT', payload: value });
  };

  const toggleAngleMode = () => {
    dispatch({ 
      type: 'SET_ANGLE_MODE', 
      payload: state.angleMode === AngleMode.DEGREE ? AngleMode.RADIAN : AngleMode.DEGREE 
    });
  };

  return (
    <div className="bg-gray-800 rounded-b-2xl overflow-hidden">
      {/* 角度模式切换 */}
      <div className="flex justify-center p-2 bg-gray-900">
        <button
          onClick={toggleAngleMode}
          className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
            state.angleMode === AngleMode.DEGREE 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300'
          }`}
        >
          DEG
        </button>
        <button
          onClick={toggleAngleMode}
          className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ml-2 ${
            state.angleMode === AngleMode.RADIAN 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300'
          }`}
        >
          RAD
        </button>
      </div>

      {/* 科学函数区 */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 p-2 sm:p-3">
        {/* 第一行 - 三角函数 */}
        <Button label="sin" onClick={() => handleFunction('sin')} variant="accent" />
        <Button label="cos" onClick={() => handleFunction('cos')} variant="accent" />
        <Button label="tan" onClick={() => handleFunction('tan')} variant="accent" />
        <Button label="C" onClick={handleClear} variant="danger" />
        <Button label="⌫" onClick={handleBackspace} variant="secondary" />

        {/* 第二行 - 反三角函数 */}
        <Button label="sin⁻¹" onClick={() => handleFunction('asin')} variant="accent" />
        <Button label="cos⁻¹" onClick={() => handleFunction('acos')} variant="accent" />
        <Button label="tan⁻¹" onClick={() => handleFunction('atan')} variant="accent" />
        <Button label="(" onClick={() => handleNumber('(')} variant="secondary" />
        <Button label=")" onClick={() => handleNumber(')')} variant="secondary" />

        {/* 第三行 - 对数 */}
        <Button label="ln" onClick={() => handleFunction('ln')} variant="accent" />
        <Button label="log" onClick={() => handleFunction('log')} variant="accent" />
        <Button label="log₂" onClick={() => handleFunction('log2')} variant="accent" />
        <Button label="xʸ" onClick={() => handleOperator('^')} variant="accent" />
        <Button label="√" onClick={() => handleFunction('sqrt')} variant="accent" />

        {/* 第四行 - 幂运算 */}
        <Button label="x²" onClick={() => handleFunction('x²')} variant="accent" />
        <Button label="x³" onClick={() => handleFunction('x³')} variant="accent" />
        <Button label="∛" onClick={() => handleFunction('cbrt')} variant="accent" />
        <Button label="1/x" onClick={() => handleFunction('1/x')} variant="accent" />
        <Button label="|x|" onClick={() => handleFunction('abs')} variant="accent" />

        {/* 第五行 - 指数 */}
        <Button label="eˣ" onClick={() => handleFunction('e^x')} variant="accent" />
        <Button label="10ˣ" onClick={() => handleFunction('10^x')} variant="accent" />
        <Button label="2ˣ" onClick={() => handleFunction('2^x')} variant="accent" />
        <Button label="n!" onClick={() => handleFunction('factorial')} variant="accent" />
        <Button label="÷" onClick={() => handleOperator('÷')} variant="primary" />

        {/* 第六行 - 常数和数字 */}
        <Button label="π" onClick={() => handleConstant('π')} variant="accent" />
        <Button label="7" onClick={() => handleNumber('7')} />
        <Button label="8" onClick={() => handleNumber('8')} />
        <Button label="9" onClick={() => handleNumber('9')} />
        <Button label="×" onClick={() => handleOperator('×')} variant="primary" />

        {/* 第七行 */}
        <Button label="e" onClick={() => handleConstant('e')} variant="accent" />
        <Button label="4" onClick={() => handleNumber('4')} />
        <Button label="5" onClick={() => handleNumber('5')} />
        <Button label="6" onClick={() => handleNumber('6')} />
        <Button label="-" onClick={() => handleOperator('-')} variant="primary" />

        {/* 第八行 */}
        <Button label="Rand" onClick={() => handleConstant('rand')} variant="accent" />
        <Button label="1" onClick={() => handleNumber('1')} />
        <Button label="2" onClick={() => handleNumber('2')} />
        <Button label="3" onClick={() => handleNumber('3')} />
        <Button label="+" onClick={() => handleOperator('+')} variant="primary" />

        {/* 第九行 */}
        <Button label="⌊x⌋" onClick={() => handleFunction('floor')} variant="accent" />
        <Button label="⌈x⌉" onClick={() => handleFunction('ceil')} variant="accent" />
        <Button label="0" onClick={() => handleNumber('0')} />
        <Button label="." onClick={() => handleNumber('.')} />
        <Button label="=" onClick={handleCalculate} variant="primary" />
      </div>
    </div>
  );
}
