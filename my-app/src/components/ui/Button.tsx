import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'operator' | 'accent' | 'memory' | 'function';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  disabled?: boolean;
  title?: string;
}

export function Button({
  children,
  onClick,
  variant = 'default',
  size = 'default',
  className,
  disabled,
  title,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'rounded-lg font-medium transition-all duration-150 active:scale-95',
        'flex items-center justify-center',
        'focus:outline-none focus:ring-2 focus:ring-[#005FB8] focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        // Variant styles
        variant === 'default' && [
          'bg-white dark:bg-[#3C3C3C]',
          'text-gray-900 dark:text-white',
          'border border-gray-300 dark:border-gray-600',
          'hover:bg-gray-50 dark:hover:bg-[#4A4A4A]',
          'shadow-sm',
        ],
        variant === 'operator' && [
          'bg-gray-100 dark:bg-[#323232]',
          'text-gray-900 dark:text-white',
          'border border-gray-300 dark:border-gray-600',
          'hover:bg-gray-200 dark:hover:bg-[#404040]',
          'text-lg',
        ],
        variant === 'accent' && [
          'bg-[#005FB8] text-white',
          'hover:bg-blue-600',
          'shadow-sm',
          'text-lg',
        ],
        variant === 'memory' && [
          'bg-transparent',
          'text-gray-500 dark:text-gray-400',
          'text-xs',
          'hover:bg-gray-100 dark:hover:bg-[#333333]',
        ],
        variant === 'function' && [
          'bg-gray-50 dark:bg-[#2A2A2A]',
          'text-gray-900 dark:text-white',
          'text-sm',
          'hover:bg-gray-100 dark:hover:bg-[#333333]',
        ],
        // Size styles
        size === 'default' && 'h-14 text-lg',
        size === 'sm' && 'h-10 text-sm px-2',
        size === 'lg' && 'h-16 text-xl',
        className
      )}
    >
      {children}
    </button>
  );
}
