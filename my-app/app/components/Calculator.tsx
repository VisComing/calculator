'use client';

import React, { useEffect, useState } from 'react';
import { useCalculatorContext } from '../context/CalculatorContext';
import { CalculatorMode } from '../types/calculator';
import { keyMap } from '../lib/utils';

import ModeTabs from './ModeTabs';
import Display from './Display';
import StandardKeypad from './StandardKeypad';
import ScientificKeypad from './ScientificKeypad';
import ProgrammerKeypad from './ProgrammerKeypad';
import CalculusPanel from './CalculusPanel';
import HistoryPanel from './HistoryPanel';

import { History, Moon, Sun } from 'lucide-react';

export default function Calculator() {
  const { state, dispatch } = useCalculatorContext();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      
      // 防止默认行为（如页面滚动）
      if (key === ' ' || key === 'Enter') {
        e.preventDefault();
      }

      const mappedKey = keyMap[key];
      if (!mappedKey) return;

      e.preventDefault();

      switch (mappedKey) {
        case '=':
          dispatch({ type: 'CALCULATE' });
          break;
        case 'backspace':
          dispatch({ type: 'BACKSPACE' });
          break;
        case 'clear':
          dispatch({ type: 'CLEAR_ALL' });
          break;
        default:
          if (['+', '-', '×', '÷'].includes(mappedKey)) {
            dispatch({ type: 'INPUT_OPERATOR', payload: mappedKey });
          } else if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].includes(mappedKey)) {
            dispatch({ type: 'INPUT_DIGIT', payload: mappedKey });
          } else {
            dispatch({ type: 'INPUT_DIGIT', payload: mappedKey });
          }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  // 渲染对应的键盘
  const renderKeypad = () => {
    switch (state.mode) {
      case CalculatorMode.STANDARD:
        return <StandardKeypad />;
      case CalculatorMode.SCIENTIFIC:
        return <ScientificKeypad />;
      case CalculatorMode.PROGRAMMER:
        return <ProgrammerKeypad />;
      case CalculatorMode.CALCULUS:
        return <CalculusPanel />;
      default:
        return <StandardKeypad />;
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-950' : 'bg-gray-100'
    }`}>
      {/* 主计算器容器 */}
      <div className="w-full max-w-md">
        {/* 顶部工具栏 */}
        <div className="flex justify-between items-center mb-4 px-2">
          <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            科学计算器
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsHistoryOpen(true)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-200 shadow'
              }`}
              title="历史记录"
            >
              <History className="w-5 h-5" />
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-200 shadow'
              }`}
              title="切换主题"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 计算器主体 */}
        <div className={`rounded-2xl shadow-2xl overflow-hidden ${
          isDarkMode ? 'shadow-black/50' : 'shadow-gray-400/50'
        }`}>
          <ModeTabs />
          <Display />
          {renderKeypad()}
        </div>

        {/* 底部提示 */}
        <div className={`text-center mt-4 text-sm ${
          isDarkMode ? 'text-gray-500' : 'text-gray-400'
        }`}>
          支持键盘输入 · 按 Enter 计算
        </div>
      </div>

      {/* 历史记录面板 */}
      <HistoryPanel 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
      />
    </div>
  );
}
