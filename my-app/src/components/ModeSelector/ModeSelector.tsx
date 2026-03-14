'use client';

import { CalculatorMode } from '@/types';
import { useCalculatorStore } from '@/stores/calculatorStore';
import { cn } from '@/lib/utils';
import { Calculator, Binary, FunctionSquare } from 'lucide-react';

const modes: { value: CalculatorMode; label: string; icon: React.ReactNode }[] = [
  { value: 'standard', label: '标准', icon: <Calculator className="w-4 h-4" /> },
  { value: 'programmer', label: '程序员', icon: <Binary className="w-4 h-4" /> },
  { value: 'scientific', label: '科学', icon: <FunctionSquare className="w-4 h-4" /> },
];

export function ModeSelector() {
  const { mode, setMode } = useCalculatorStore();

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-[#2A2A2A] rounded-lg">
      {modes.map((m) => (
        <button
          key={m.value}
          onClick={() => setMode(m.value)}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
            mode === m.value
              ? 'bg-white dark:bg-[#3C3C3C] shadow-sm text-[#005FB8]'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          )}
        >
          {m.icon}
          <span className="hidden sm:inline">{m.label}</span>
        </button>
      ))}
    </div>
  );
}
