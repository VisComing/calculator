'use client';

import { Button } from '@/components/ui/Button';
import { useCalculatorStore } from '@/stores/calculatorStore';
import { Base, BitWidth } from '@/types';
import { cn } from '@/lib/utils';
import { isValidForBase } from '@/lib/converters';

export function ProgrammerPad() {
  const {
    inputDigit,
    clear,
    clearEntry,
    backspace,
    toggleSign,
    applyBitwiseOperation,
    programmerSettings,
    setProgrammerBase,
    setProgrammerBitWidth,
    display,
  } = useCalculatorStore();

  const { base, bitWidth } = programmerSettings;

  const bases: { value: Base; label: string }[] = [
    { value: 16, label: 'HEX' },
    { value: 10, label: 'DEC' },
    { value: 8, label: 'OCT' },
    { value: 2, label: 'BIN' },
  ];

  const bitWidths: { value: BitWidth; label: string }[] = [
    { value: 8, label: 'BYTE' },
    { value: 16, label: 'WORD' },
    { value: 32, label: 'DWORD' },
    { value: 64, label: 'QWORD' },
  ];

  const hexKeys = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="space-y-2">
      {/* Base selector */}
      <div className="flex gap-1 mb-2">
        {bases.map((b) => (
          <button
            key={b.value}
            onClick={() => setProgrammerBase(b.value)}
            className={cn(
              'flex-1 py-1.5 px-2 text-xs font-medium rounded transition-colors',
              base === b.value
                ? 'bg-[#005FB8] text-white'
                : 'bg-gray-100 dark:bg-[#2A2A2A] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#333333]'
            )}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* Bit width selector */}
      <div className="flex gap-1 mb-2">
        {bitWidths.map((bw) => (
          <button
            key={bw.value}
            onClick={() => setProgrammerBitWidth(bw.value)}
            className={cn(
              'flex-1 py-1.5 px-2 text-xs font-medium rounded transition-colors',
              bitWidth === bw.value
                ? 'bg-[#005FB8] text-white'
                : 'bg-gray-100 dark:bg-[#2A2A2A] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#333333]'
            )}
          >
            {bw.label}
          </button>
        ))}
      </div>

      {/* Bitwise operations */}
      <div className="grid grid-cols-4 gap-2">
        <Button variant="function" onClick={() => applyBitwiseOperation('AND')}>AND</Button>
        <Button variant="function" onClick={() => applyBitwiseOperation('OR')}>OR</Button>
        <Button variant="function" onClick={() => applyBitwiseOperation('XOR')}>XOR</Button>
        <Button variant="function" onClick={() => applyBitwiseOperation('NOT')}>NOT</Button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Button variant="function" onClick={() => applyBitwiseOperation('NAND')}>NAND</Button>
        <Button variant="function" onClick={() => applyBitwiseOperation('NOR')}>NOR</Button>
        <Button variant="function" onClick={() => applyBitwiseOperation('SHL')}>SHL</Button>
        <Button variant="function" onClick={() => applyBitwiseOperation('SHR')}>SHR</Button>
      </div>

      {/* Clear/Backspace */}
      <div className="grid grid-cols-4 gap-2">
        <Button variant="function" onClick={clearEntry}>CE</Button>
        <Button variant="function" onClick={clear}>C</Button>
        <Button variant="function" onClick={backspace}>⌫</Button>
        <Button variant="function" onClick={toggleSign}>+/-</Button>
      </div>

      {/* Number pad with hex keys */}
      <div className="grid grid-cols-4 gap-2">
        {base === 16 && (
          <>
            {hexKeys.slice(0, 4).map((key) => (
              <Button
                key={key}
                onClick={() => inputDigit(key)}
                disabled={!isValidForBase(key, base)}
              >
                {key}
              </Button>
            ))}
          </>
        )}

        {base === 16 && (
          <>
            {hexKeys.slice(4).map((key) => (
              <Button
                key={key}
                onClick={() => inputDigit(key)}
                disabled={!isValidForBase(key, base)}
              >
                {key}
              </Button>
            ))}
          </>
        )}

        {base === 16 && <div className="col-span-2" />}

        <Button
          onClick={() => inputDigit('7')}
          disabled={!isValidForBase('7', base)}
        >
          7
        </Button>
        <Button
          onClick={() => inputDigit('8')}
          disabled={!isValidForBase('8', base)}
        >
          8
        </Button>
        <Button
          onClick={() => inputDigit('9')}
          disabled={!isValidForBase('9', base)}
        >
          9
        </Button>
        <Button variant="operator" disabled>÷</Button>

        <Button
          onClick={() => inputDigit('4')}
          disabled={!isValidForBase('4', base)}
        >
          4
        </Button>
        <Button
          onClick={() => inputDigit('5')}
          disabled={!isValidForBase('5', base)}
        >
          5
        </Button>
        <Button
          onClick={() => inputDigit('6')}
          disabled={!isValidForBase('6', base)}
        >
          6
        </Button>
        <Button variant="operator" disabled>×</Button>

        <Button
          onClick={() => inputDigit('1')}
          disabled={!isValidForBase('1', base)}
        >
          1
        </Button>
        <Button
          onClick={() => inputDigit('2')}
          disabled={!isValidForBase('2', base)}
        >
          2
        </Button>
        <Button
          onClick={() => inputDigit('3')}
          disabled={!isValidForBase('3', base)}
        >
          3
        </Button>
        <Button variant="operator" disabled>−</Button>

        <div className={cn(base === 16 && 'col-span-2')}>
          <Button
            onClick={() => inputDigit('0')}
            disabled={!isValidForBase('0', base)}
            className="w-full"
          >
            0
          </Button>
        </div>
        <Button variant="accent">=</Button>
        <Button variant="operator" disabled>+</Button>
      </div>
    </div>
  );
}
