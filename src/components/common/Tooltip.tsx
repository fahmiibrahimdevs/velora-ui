import React, { useState, useRef, useEffect } from 'react';

export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';
export type TooltipVariant = 'dark' | 'light' | 'primary' | 'success' | 'warning' | 'danger';

export interface TooltipProps {
  content: React.ReactNode;
  position?: TooltipPosition;
  variant?: TooltipVariant;
  arrow?: boolean;
  delay?: number;
  disabled?: boolean;
  hotkey?: string;
  className?: string;
  tooltipClassName?: string;
  children: React.ReactNode;
  interactive?: boolean;
  block?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  variant = 'dark',
  arrow = true,
  delay = 100,
  disabled = false,
  hotkey,
  className = '',
  tooltipClassName = '',
  children,
  interactive = false,
  block = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (disabled || !content) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
    } else {
      setIsVisible(true);
    }
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsVisible(false), 50);
  };

  const toggleTooltip = (e: React.MouseEvent) => {
    if (disabled || !content) return;
    // For touch/mobile devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      e.stopPropagation();
      setIsVisible((prev) => !prev);
    }
  };

  // Close on outside click if opened on mobile
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsVisible(false);
      }
    };
    if (isVisible) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isVisible]);

  // Positioning classes
  const positionClasses: Record<TooltipPosition, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  // Variant styling
  const variantClasses: Record<TooltipVariant, string> = {
    dark: 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 border border-slate-800',
    light: 'bg-white text-slate-800 shadow-xl shadow-slate-900/10 border border-slate-200',
    primary: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-xl shadow-blue-900/20',
    success: 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/20',
    warning: 'bg-amber-600 text-white shadow-xl shadow-amber-900/20',
    danger: 'bg-rose-600 text-white shadow-xl shadow-rose-900/20',
  };

  // Arrow styles
  const arrowPositionClasses: Record<TooltipPosition, string> = {
    top: 'top-full left-1/2 -translate-x-1/2 border-x-transparent border-b-transparent border-t-[5px]',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-x-transparent border-t-transparent border-b-[5px]',
    left: 'left-full top-1/2 -translate-y-1/2 border-y-transparent border-r-transparent border-l-[5px]',
    right: 'right-full top-1/2 -translate-y-1/2 border-y-transparent border-l-transparent border-r-[5px]',
  };

  const arrowColorClasses: Record<TooltipVariant, Record<TooltipPosition, string>> = {
    dark: {
      top: 'border-t-slate-900',
      bottom: 'border-b-slate-900',
      left: 'border-l-slate-900',
      right: 'border-r-slate-900',
    },
    light: {
      top: 'border-t-white',
      bottom: 'border-b-white',
      left: 'border-l-white',
      right: 'border-r-white',
    },
    primary: {
      top: 'border-t-[#175cd3]',
      bottom: 'border-b-[#0f3ba0]',
      left: 'border-l-[#175cd3]',
      right: 'border-r-[#0f3ba0]',
    },
    success: {
      top: 'border-t-emerald-600',
      bottom: 'border-b-emerald-600',
      left: 'border-l-emerald-600',
      right: 'border-r-emerald-600',
    },
    warning: {
      top: 'border-t-amber-600',
      bottom: 'border-b-amber-600',
      left: 'border-l-amber-600',
      right: 'border-r-amber-600',
    },
    danger: {
      top: 'border-t-rose-600',
      bottom: 'border-b-rose-600',
      left: 'border-l-rose-600',
      right: 'border-r-rose-600',
    },
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${block ? 'flex w-full' : 'inline-flex items-center'} ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      onClick={toggleTooltip}
    >
      {children}

      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-50 px-2.5 py-1.5 text-xs font-normal rounded-lg whitespace-nowrap animate-in fade-in zoom-in-95 duration-150 ${
            interactive ? 'pointer-events-auto' : 'pointer-events-none'
          } ${positionClasses[position]} ${variantClasses[variant]} ${tooltipClassName}`}
        >
          <div className="flex items-center gap-1.5">
            <span>{content}</span>
            {hotkey && (
              <kbd
                className={`text-[10px] font-mono font-semibold px-1 py-0.5 rounded shadow-xs tracking-tight ${
                  variant === 'light'
                    ? 'bg-slate-100 text-slate-600 border border-slate-200'
                    : 'bg-white/20 text-white border border-white/25'
                }`}
              >
                {hotkey}
              </kbd>
            )}
          </div>

          {arrow && (
            <div
              className={`absolute w-0 h-0 border-[5px] ${arrowPositionClasses[position]} ${arrowColorClasses[variant][position]}`}
            />
          )}
        </div>
      )}
    </div>
  );
};
