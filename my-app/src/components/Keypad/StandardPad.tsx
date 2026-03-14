'use client';

import { Button } from '@/components/ui/Button';
import { useCalculatorStore } from '@/stores/calculatorStore';
import { cn } from '@/lib/utils';

interface MemoryButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

function MemoryButton({ onClick, disabled, children }: MemoryButtonProps) {
  return (
    <Button
      variant="memory"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="min-w-[48px]"
    >
      {children}
    </Button>
  );
}

export function StandardPad() {
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
    memoryOperation,
    memory,
    display,
  } = useCalculatorStore();

  const hasMemory = memory !== 0;

  return (
    <div className="space-y-2">
      {/* Memory buttons */}
      <div className="flex justify-between gap-1">
        <MemoryButton onClick={() => memoryOperation('MC')} disabled={!hasMemory}>
          MC
        </MemoryButton>
        <MemoryButton onClick={() => memoryOperation('MR')} disabled={!hasMemory}>
          MR
        </MemoryButton>
        <MemoryButton onClick={() => memoryOperation('M+')}>M+</MemoryButton>
        <MemoryButton onClick={() => memoryOperation('M-')}>M-</MemoryButton>
        <MemoryButton onClick={() => memoryOperation('MS')}>MS</MemoryButton>
      </div>

      {/* Function buttons row */}
      <div className="grid grid-cols-4 gap-2">
        <Button variant="function" onClick={inputPercent}>%</Button>
        <Button variant="function" onClick={clearEntry}>CE</Button>
        <Button variant="function" onClick={clear}>C</Button>
        <Button variant="function" onClick={backspace}>⌫</Button>
      </div>

      {/* Second function row */}
      <div className="grid grid-cols-4 gap-2">
        <Button variant="function" onClick={() => {}} title="倒数">¹/ₓ</Button>
        <Button variant="function" onClick={() => {}} title="平方">x²</Button>
        <Button variant="function" onClick={() => {}} title="平方根">²√x</Button>
        <Button variant="operator" onClick={() => inputOperator('/')} title="除">÷</Button>
      </div>

      {/* Number pad with operators */}
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
