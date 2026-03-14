'use client';

import { useEffect } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme, toggleTheme, initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  const options: { value: typeof theme; icon: React.ReactNode; label: string }[] = [
    { value: 'light', icon: <Sun className="w-4 h-4" />, label: '浅色' },
    { value: 'dark', icon: <Moon className="w-4 h-4" />, label: '深色' },
    { value: 'system', icon: <Monitor className="w-4 h-4" />, label: '系统' },
  ];

  return (
    <div className={cn('flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-[#2A2A2A]', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => setTheme(option.value)}
          title={option.label}
          className={cn(
            'p-2 rounded-md transition-all duration-200',
            theme === option.value
              ? 'bg-white dark:bg-[#3C3C3C] shadow-sm text-[#005FB8]'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          )}
        >
          {option.icon}
        </button>
      ))}
    </div>
  );
}
