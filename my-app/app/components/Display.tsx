'use client';

import React from 'react';
import { useCalculatorContext } from '../context/CalculatorContext';
import { CalculatorMode } from '../types/calculator';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../lib/utils';

export default function Display() {
  const { state } = useCalculatorContext();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    const textToCopy = state.result || state.display;
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 根据模式显示不同的信息
  const getModeLabel = () => {
    switch (state.mode) {
      case CalculatorMode.STANDARD:
        return '标准';
      case CalculatorMode.SCIENTIFIC:
        return state.angleMode === 'degree' ? '科学 (DEG)' : '科学 (RAD)';
      case CalculatorMode.PROGRAMMER:
        const baseNames: Record<number, string> = {
          2: 'BIN',
          8: 'OCT',
          10: 'DEC',
          16: 'HEX'
        };
        return `程序员 (${baseNames[state.programmer.base]})`;
      case CalculatorMode.CALCULUS:
        return '微积分';
      default:
        return '';
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900 rounded-t-2xl p-6 min-h-[140px] flex flex-col">
      {/* 模式标签 */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
          {getModeLabel()}
        </span>
        <button
          onClick={handleCopy}
          className="text-gray-400 hover:text-white transition-colors p-1 rounded"
          title="复制结果"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* 表达式显示 */}
      <div className="flex-1 flex flex-col justify-end">
        {state.expression && (
          <div className="text-right text-gray-400 text-sm mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
            {state.expression}
          </div>
        )}
        
        {/* 主显示 */}
        <div 
          className={`text-right font-mono text-4xl md:text-5xl font-light tracking-tight overflow-hidden text-ellipsis whitespace-nowrap transition-all duration-200 ${
            state.error ? 'text-red-400' : 'text-white'
          }`}
        >
          {state.error || state.display}
        </div>

        {/* 结果显示 */}
        {state.result && state.result !== state.display && (
          <div className="text-right text-green-400 text-xl mt-1 font-mono">
            = {state.result}
          </div>
        )}
      </div>

      {/* 程序员模式：显示所有进制 */}
      {state.mode === CalculatorMode.PROGRAMMER && !state.error && (
        <div className="mt-4 pt-3 border-t border-gray-700 grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">HEX</span>
            <span className="text-gray-300 font-mono">
              {parseInt(state.display || '0', state.programmer.base).toString(16).toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">DEC</span>
            <span className="text-gray-300 font-mono">
              {parseInt(state.display || '0', state.programmer.base).toString(10)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">OCT</span>
            <span className="text-gray-300 font-mono">
              {parseInt(state.display || '0', state.programmer.base).toString(8)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">BIN</span>
            <span className="text-gray-300 font-mono truncate">
              {parseInt(state.display || '0', state.programmer.base).toString(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
