'use client';

import React from 'react';
import { useCalculatorContext } from '../context/CalculatorContext';
import { CalculatorMode } from '../types/calculator';
import { Calculator, FunctionSquare, Binary, Sigma } from 'lucide-react';

const modes = [
  { id: CalculatorMode.STANDARD, label: '标准', icon: Calculator },
  { id: CalculatorMode.SCIENTIFIC, label: '科学', icon: FunctionSquare },
  { id: CalculatorMode.PROGRAMMER, label: '程序员', icon: Binary },
  { id: CalculatorMode.CALCULUS, label: '微积分', icon: Sigma },
];

export default function ModeTabs() {
  const { state, dispatch } = useCalculatorContext();

  return (
    <div className="bg-gray-900 dark:bg-gray-900 p-2">
      <div className="flex space-x-1">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = state.mode === mode.id;
          
          return (
            <button
              key={mode.id}
              onClick={() => dispatch({ type: 'SET_MODE', payload: mode.id })}
              className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{mode.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
