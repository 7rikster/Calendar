'use client';

import { MONTH_NAMES, MONTH_THEMES } from '@/utils/dateUtils';

interface CalendarHeaderProps {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export default function CalendarHeader({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  onToday,
}: CalendarHeaderProps) {
  const theme = MONTH_THEMES[month];

  return (
    <div className="relative overflow-hidden rounded-t-2xl select-none">
      <div
        className="relative h-40 sm:h-48 md:h-56 transition-all duration-500"
        style={{ background: theme.gradient }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 800 300"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <polygon
            points="500,300 800,100 800,300"
            fill={theme.accentColor}
            opacity="0.35"
          />
          <polygon
            points="550,300 800,160 800,300"
            fill={theme.accentColor}
            opacity="0.25"
          />
          <polygon
            points="0,0 200,0 0,120"
            fill="white"
            opacity="0.06"
          />
          <circle cx="650" cy="80" r="40" fill="white" opacity="0.05" />
          <circle cx="150" cy="220" r="60" fill="white" opacity="0.04" />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <span
            className="text-sm sm:text-base font-medium tracking-[0.3em] uppercase opacity-80"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            {year}
          </span>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide mt-1"
            style={{ color: '#ffffff', textShadow: '0 2px 12px rgba(0,0,0,0.15)' }}
          >
            {MONTH_NAMES[month]}
          </h1>
        </div>

        <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex items-center justify-center gap-2 sm:gap-3 z-10">
          <button
            id="prev-month-btn"
            onClick={onPrevMonth}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-sm
              flex items-center justify-center text-white
              hover:bg-white/30 active:scale-95 transition-all duration-200"
            aria-label="Previous month"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            id="today-btn"
            onClick={onToday}
            className="px-3 sm:px-4 h-8 sm:h-9 rounded-full bg-white/20 backdrop-blur-sm
              text-white text-xs sm:text-sm font-medium
              hover:bg-white/30 active:scale-95 transition-all duration-200"
          >
            Today
          </button>

          <button
            id="next-month-btn"
            onClick={onNextMonth}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-sm
              flex items-center justify-center text-white
              hover:bg-white/30 active:scale-95 transition-all duration-200"
            aria-label="Next month"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative h-5 sm:h-6 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-center gap-[10px] sm:gap-3 overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-slate-400 dark:border-slate-500 bg-slate-200 dark:bg-slate-700 shadow-inner"
          />
        ))}
      </div>
    </div>
  );
}
