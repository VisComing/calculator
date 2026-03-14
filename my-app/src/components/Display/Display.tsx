'use client';

import { useCalculatorStore } from '@/stores/calculatorStore';
import { cn } from '@/lib/utils';
import { decimalToBase } from '@/lib/converters';

export function Display() {
  const { display, expression, mode, programmerSettings, memory } = useCalculatorStore();
  const { base, bitWidth } = programmerSettings;

  const hasMemory = memory !== 0;

  return (
    <div className="flex flex-col bg-white dark:bg-[#1E1E1E] rounded-xl p-4 sm:p-6 shadow-inner border border-gray-200 dark:border-gray-700">
      {/* Memory indicator */}
      <div className="h-6 flex items-center">
        {hasMemory && (
          <span className="text-xs text-[#005FB8] font-medium">M</span>
        )}
      </div>

      {/* Expression */}
      <div className="text-right mb-2">
        <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-mono">
          {expression}
        </span>
      </div>

      {/* Main display */}
      <div className="text-right">
        <span
          className={cn(
            'font-mono font-semibold text-gray-900 dark:text-white',
            'break-all leading-tight',
            display.length > 15 ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'
          )}
        >
          {display}
        </span>
      </div>

      {/* Programmer mode base display */}
      {mode === 'programmer' && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm">
            <BaseDisplay label="HEX" value={display} currentBase={base} targetBase={16} />
            <BaseDisplay label="DEC" value={display} currentBase={base} targetBase={10} />
            <BaseDisplay label="OCT" value={display} currentBase={base} targetBase={8} />
            <BaseDisplay label="BIN" value={display} currentBase={base} targetBase={2} />
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {bitWidth} 位整数
          </div>
        </div>
      )}
    </div>
  );
}

interface BaseDisplayProps {
  label: string;
  value: string;
  currentBase: number;
  targetBase: number;
}

function BaseDisplay({ label, value, currentBase, targetBase }: BaseDisplayProps) {
  let displayValue = '';

  try {
    const num = parseInt(value, currentBase);
    if (!Number.isNaN(num)) {
      displayValue = decimalToBase(num, targetBase as 2 | 8 | 10 | 16).replace(/^(0b|0o|0x)/, '');
      // Truncate if too long
      if (displayValue.length > 12) {
        displayValue = displayValue.slice(0, 10) + '...';
      }
    }
  } catch {
    displayValue = '0';
  }

  const isActive = currentBase === targetBase;

  return (
    <div className={cn(
      'font-mono p-2 rounded',
      isActive && 'bg-blue-50 dark:bg-[#1a365d]/30'
    )}>
      <span className="text-gray-400 dark:text-gray-500 text-xs">{label}</span>
      <div className={cn(
        'truncate',
        isActive ? 'text-[#005FB8]' : 'text-gray-700 dark:text-gray-300'
      )}>
        {displayValue || '0'}
      </div>
    </div>
  );
}
