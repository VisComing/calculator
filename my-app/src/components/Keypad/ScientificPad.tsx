'use client';

import { Button } from '@/components/ui/Button';
import { useCalculatorStore } from '@/stores/calculatorStore';
import { cn } from '@/lib/utils';
import { AngleMode } from '@/types';

export function ScientificPad() {
  const {
    inputDigit,
    inputDecimal,
    inputOperator,
    calculate,
    clear,
    clearEntry,
    backspace,
    toggleSign,
    inputPercent,
    applyScientificFunction,
    scientificSettings,
    setAngleMode,
  } = useCalculatorStore();

  const { angleMode } = scientificSettings;

  const trigFunctions = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan'];
  const hyperFunctions = ['sinh', 'cosh', 'tanh'];
  const logFunctions = ['log', 'ln', '10^x', '2^x', 'e^x'];
  const otherFunctions = ['sqrt', 'square', 'cube', '1/x', 'abs', 'fact'];

  return (
    <div className="space-y-2">
      {/* Angle mode selector */}
      <div className="flex gap-2 mb-2">
        {(['deg', 'rad'] as AngleMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setAngleMode(mode)}
            className={cn(
              'px-3 py-1 text-xs font-medium rounded transition-colors',
              angleMode === mode
                ? 'bg-[#005FB8] text-white'
                : 'bg-gray-100 dark:bg-[#2A2A2A] text-gray-600 dark:text-gray-400'
            )}
          >
            {mode.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Trigonometric functions */}
      <div className="grid grid-cols-6 gap-1 sm:gap-2">
        {trigFunctions.map((func) => (
          <Button
            key={func}
            variant="function"
            size="sm"
            onClick={() => applyScientificFunction(func)}
          >
            {func}
          </Button>
        ))}
      </div>

      {/* Hyperbolic functions */}
      <div className="grid grid-cols-6 gap-1 sm:gap-2">
        {hyperFunctions.map((func) => (
          <Button
            key={func}
            variant="function"
            size="sm"
            onClick={() => applyScientificFunction(func)}
          >
            {func}
          </Button>
        ))}
        <div className="col-span-3" />
      </div>

      {/* Logarithmic functions */}
      <div className="grid grid-cols-5 gap-1 sm:gap-2">
        {logFunctions.map((func) => (
          <Button
            key={func}
            variant="function"
            size="sm"
            onClick={() => applyScientificFunction(func)}
          >
            {func}
          </Button>
        ))}
      </div>

      {/* Other functions row 1 */}
      <div className="grid grid-cols-5 gap-1 sm:gap-2">
        {otherFunctions.slice(0, 5).map((func) => (
          <Button
            key={func}
            variant="function"
            size="sm"
            onClick={() => applyScientificFunction(func)}
          >
            {func === '1/x' ? '¹/ₓ' : func}
          </Button>
        ))}
      </div>

      {/* Constants */}
      <div className="grid grid-cols-5 gap-1 sm:gap-2">
        <Button variant="function" size="sm" onClick={() => applyScientificFunction('pi')}>π</Button>
        <Button variant="function" size="sm" onClick={() => applyScientificFunction('e')}>e</Button>
        <div className="col-span-3" />
      </div>

      {/* Standard operations */}
      <div className="grid grid-cols-4 gap-2">
        <Button variant="function" onClick={inputPercent}>%</Button>
        <Button variant="function" onClick={clearEntry}>CE</Button>
        <Button variant="function" onClick={clear}>C</Button>
        <Button variant="function" onClick={backspace}>⌫</Button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Button variant="function" onClick={() => applyScientificFunction('square')}>x²</Button>
        <Button variant="function" onClick={() => applyScientificFunction('sqrt')}>²√x</Button>
        <Button variant="function" onClick={() => inputOperator('^')}>xʸ</Button>
        <Button variant="operator" onClick={() => inputOperator('/')}>÷</Button>
      </div>

      {/* Number pad */}
      <div className="grid grid-cols-4 gap-2">
        <Button onClick={() => inputDigit('7')}>7</Button>
        <Button onClick={() => inputDigit('8')}>8</Button>
        <Button onClick={() => inputDigit('9')}>9</Button>
        <Button variant="operator" onClick={() => inputOperator('*')}>×</Button>

        <Button onClick={() => inputDigit('4')}>4</Button>
        <Button onClick={() => inputDigit('5')}>5</Button>
        <Button onClick={() => inputDigit('6')}>6</Button>
        <Button variant="operator" onClick={() => inputOperator('-')}>−</Button>

        <Button onClick={() => inputDigit('1')}>1</Button>
        <Button onClick={() => inputDigit('2')}>2</Button>
        <Button onClick={() => inputDigit('3')}>3</Button>
        <Button variant="operator" onClick={() => inputOperator('+')}>+</Button>

        <Button onClick={toggleSign}>+/-</Button>
        <Button onClick={() => inputDigit('0')}>0</Button>
        <Button onClick={inputDecimal}>.</Button>
        <Button variant="accent" onClick={calculate}>=</Button>
      </div>
    </div>
  );
}
