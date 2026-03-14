'use client';

import { useState } from 'react';
import { useCalculatorStore } from '@/stores/calculatorStore';
import { History, X, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HistoryPanel() {
  const { history, clearHistory } = useCalculatorStore();
  const [isOpen, setIsOpen] = useState(false);

  const hasHistory = history.length > 0;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'p-2 rounded-lg transition-colors',
          isOpen
            ? 'bg-[#005FB8] text-white'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#333333]'
        )}
        title="历史记录"
      >
        <History className="w-5 h-5" />
      </button>

      {/* History panel */}
      <div
        className={cn(
          'fixed right-0 top-0 h-full w-80 bg-white dark:bg-[#2A2A2A] shadow-xl z-50',
          'transform transition-transform duration-300 ease-in-out',
          'border-l border-gray-200 dark:border-gray-700',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            历史记录
          </h2>
          <div className="flex gap-2">
            {hasHistory && (
              <button
                onClick={clearHistory}
                className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 transition-colors"
                title="清除历史"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History list */}
        <div className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-80px)]">
          {!hasHistory ? (
            <div className="text-center text-gray-400 dark:text-gray-500 py-8">
              暂无历史记录
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-gray-50 dark:bg-[#3C3C3C] hover:bg-gray-100 dark:hover:bg-[#444444] transition-colors cursor-pointer"
              >
                <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                  {item.expression} =
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white font-mono">
                  {item.result}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {new Date(item.timestamp).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
