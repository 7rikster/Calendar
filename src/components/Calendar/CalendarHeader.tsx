'use client';

import { MONTH_NAMES } from '@/utils/dateUtils';
import { motion, AnimatePresence } from 'framer-motion';

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
  return (
    <div className="relative overflow-hidden rounded-t-2xl select-none bg-slate-900">
      <div className="relative h-44 sm:h-56 md:h-64 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.img
            key={month}
            src={`/${MONTH_NAMES[month].toLowerCase()}.jpg`}
            alt={`${MONTH_NAMES[month]} landscape`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />

        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <motion.span
            key={`year-${year}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 0.85, y: 0 }}
            className="text-sm sm:text-base font-medium tracking-[0.3em] uppercase drop-shadow-md"
            style={{ color: '#ffffff' }}
          >
            {year}
          </motion.span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.h1
              key={`month-${month}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide mt-1"
              style={{ color: '#ffffff', textShadow: '0 4px 16px rgba(0,0,0,0.4)' }}
            >
              {MONTH_NAMES[month]}
            </motion.h1>
          </AnimatePresence>
        </div>

        <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex items-center justify-center gap-2 sm:gap-3 z-20">
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
      
      {/* <div className="relative h-5 sm:h-6 bg-slate-100 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-center gap-[10px] sm:gap-3 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-slate-400 dark:border-slate-500 bg-slate-200 dark:bg-slate-700 shadow-inner"
          />
        ))}
      </div> */}

      <div className="relative h-5 sm:h-6 bg-slate-100 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-center gap-[10px] sm:gap-3 overflow-hidden">
        {Array.from({ length: 64 }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-slate-400 dark:border-slate-500 bg-slate-200 dark:bg-slate-700 shadow-inner ${
              i === 48 ? 'hidden md:block lg:hidden' :
              i >= 38 ? 'hidden md:block' :
              i >= 22 ? 'hidden sm:block' :
              'block'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
