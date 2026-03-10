'use client';

import React from 'react';
import { useCalculatorContext } from '../context/CalculatorContext';
import { CalculatorMode } from '../types/calculator';
import { History, Trash2, X } from 'lucide-react';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoryPanel({ isOpen, onClose }: HistoryPanelProps) {
  const { state, dispatch } = useCalculatorContext();

  const handleClearHistory = () => {
    dispatch({ type: 'CLEAR_HISTORY' });
  };

  const handleLoadHistory = (item: typeof state.history[0]) => {
    dispatch({ type: 'LOAD_FROM_HISTORY', payload: item });
    onClose();
  };

  const getModeLabel = (mode: CalculatorMode) => {
    switch (mode) {
      case CalculatorMode.STANDARD:
        return '标准';
      case CalculatorMode.SCIENTIFIC:
        return '科学';
      case CalculatorMode.PROGRAMMER:
        return '程序员';
      case CalculatorMode.CALCULUS:
        return '微积分';
      default:
        return '';
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* 遮罩层 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 侧边栏 */}
      <div className="relative w-full max-w-sm bg-gray-900 h-full shadow-2xl flex flex-col animate-slide-in-right">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">计算历史</h2>
          </div>
          <div className="flex items-center space-x-2">
            {state.history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                title="清空历史"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 历史列表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {state.history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <History className="w-12 h-12 mb-2 opacity-30" />
              <p className="text-sm">暂无计算历史</p>
            </div>
          ) : (
            state.history.map((item) => (
              <button
                key={item.id}
                onClick={() => handleLoadHistory(item)}
                className="w-full text-left p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors group"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs text-blue-400 font-medium">
                    {getModeLabel(item.mode)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTime(item.timestamp)}
                  </span>
                </div>
                <div className="text-gray-400 text-sm mb-1 truncate">
                  {item.expression}
                </div>
                <div className="text-white text-lg font-mono font-medium">
                  = {item.result}
                </div>
              </button>
            ))
          )}
        </div>

        {/* 底部统计 */}
        {state.history.length > 0 && (
          <div className="p-4 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center">
              共 {state.history.length} 条记录
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
