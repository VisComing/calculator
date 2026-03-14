'use client';

import { useCalculatorStore } from '@/stores/calculatorStore';
import { useKeyboard } from '@/hooks/useKeyboard';
import { Display } from '@/components/Display/Display';
import { StandardPad } from '@/components/Keypad/StandardPad';
import { ProgrammerPad } from '@/components/Keypad/ProgrammerPad';
import { ScientificPad } from '@/components/Keypad/ScientificPad';
import { ModeSelector } from '@/components/ModeSelector/ModeSelector';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import { HistoryPanel } from '@/components/History/History';
import { cn } from '@/lib/utils';

export function Calculator() {
  const {
    mode,
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
    applyScientificFunction,
  } = useCalculatorStore();

  // Enable keyboard input
  useKeyboard({
    mode,
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
    applyScientificFunction,
  });

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-[#252525]/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              计算器
            </h1>
            <ModeSelector />
          </div>
          <div className="flex items-center gap-2">
            <HistoryPanel />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* Display */}
          <div className="mb-4">
            <Display />
          </div>

          {/* Keypad */}
          <div
            className={cn(
              'bg-white dark:bg-[#3C3C3C] rounded-xl p-4 shadow-calc dark:shadow-calc-dark',
              mode === 'scientific' && 'max-w-lg mx-auto'
            )}
          >
            {mode === 'standard' && <StandardPad />}
            {mode === 'programmer' && <ProgrammerPad />}
            {mode === 'scientific' && <ScientificPad />}
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
            <p>键盘快捷键: 数字键输入 | Enter = 计算 | Esc = 清除 | Backspace = 退格</p>
            {mode === 'scientific' && (
              <p className="mt-1">S=sin C=cos T=tan L=log N=ln P=π E=e R=√ Q=x²</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
