'use client';

import { useEffect, useCallback } from 'react';
import { CalculatorMode, MemoryOperation, Operator } from '@/types';

interface KeyboardHandlers {
  mode: CalculatorMode;
  inputDigit: (digit: string) => void;
  inputDecimal: () => void;
  inputOperator: (operator: Operator) => void;
  calculate: () => void;
  clear: () => void;
  clearEntry: () => void;
  backspace: () => void;
  toggleSign: () => void;
  inputPercent: () => void;
  applyScientificFunction?: (func: string) => void;
  memoryOperation?: (op: MemoryOperation) => void;
}

export function useKeyboard({
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
  applyScientificFunction,
  memoryOperation,
}: KeyboardHandlers) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key, ctrlKey, shiftKey, altKey, metaKey } = event;

      // Ignore if any modifier key is pressed (except for some shortcuts)
      if (altKey || metaKey) return;

      // Prevent default for calculator keys to avoid page scrolling
      const calculatorKeys = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        '+', '-', '*', '/', '=', 'Enter', 'Escape', 'Backspace',
        '.', '%', '_',
      ];
      if (calculatorKeys.includes(key)) {
        event.preventDefault();
      }

      // Digits
      if (/^[0-9]$/.test(key)) {
        inputDigit(key);
        return;
      }

      // Hex digits for programmer mode
      if (mode === 'programmer' && /^[a-fA-F]$/.test(key)) {
        inputDigit(key.toUpperCase());
        return;
      }

      // Operators
      switch (key) {
        case '+':
          inputOperator('+');
          break;
        case '-':
          inputOperator('-');
          break;
        case '*':
        case 'x':
        case 'X':
          inputOperator('*');
          break;
        case '/':
        case '÷':
          inputOperator('/');
          break;
        case '%':
          inputPercent();
          break;
        case '^':
          if (mode === 'scientific') {
            inputOperator('^');
          }
          break;
      }

      // Enter / = for calculate
      if (key === 'Enter' || key === '=') {
        calculate();
        return;
      }

      // Escape for clear
      if (key === 'Escape') {
        clear();
        return;
      }

      // Backspace
      if (key === 'Backspace') {
        if (ctrlKey || shiftKey) {
          clearEntry();
        } else {
          backspace();
        }
        return;
      }

      // Delete for clear entry
      if (key === 'Delete') {
        clearEntry();
        return;
      }

      // Decimal point
      if (key === '.' || key === ',') {
        inputDecimal();
        return;
      }

      // Scientific mode shortcuts
      if (mode === 'scientific' && applyScientificFunction) {
        const lowerKey = key.toLowerCase();
        switch (lowerKey) {
          case 's':
            applyScientificFunction('sin');
            break;
          case 'c':
            applyScientificFunction('cos');
            break;
          case 't':
            applyScientificFunction('tan');
            break;
          case 'l':
            applyScientificFunction(shiftKey ? 'log' : 'ln');
            break;
          case 'p':
            applyScientificFunction('pi');
            break;
          case 'e':
            applyScientificFunction('e');
            break;
          case '!':
            applyScientificFunction('fact');
            break;
          case 'r':
            applyScientificFunction('sqrt');
            break;
          case 'q':
            applyScientificFunction('square');
            break;
        }
      }

      // Memory operations
      if (memoryOperation) {
        if (ctrlKey) {
          switch (key.toLowerCase()) {
            case 'm':
              memoryOperation('MS');
              break;
            case 'r':
              memoryOperation('MR');
              break;
            case 'l':
              memoryOperation('MC');
              break;
          }
        }
      }

      // Toggle sign with underscore or F9
      if (key === '_' || key === 'F9') {
        toggleSign();
        return;
      }
    },
    [
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
      applyScientificFunction,
      memoryOperation,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export default useKeyboard;
