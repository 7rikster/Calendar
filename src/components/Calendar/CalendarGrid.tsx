'use client';

import { type CalendarDay, DAY_NAMES_SHORT } from '@/utils/dateUtils';
import { type CalendarEvent } from '@/data/mockEvents';
import CalendarCell from './CalendarCell';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarGridProps {
  calendarDays: CalendarDay[];
  direction: 'left' | 'right' | null;
  year: number;
  month: number;
  getEventsForDate: (date: Date) => CalendarEvent[];
  isInRange: (date: Date) => boolean;
  isRangeStart: (date: Date) => boolean;
  isRangeEnd: (date: Date) => boolean;
  isRangeMiddle: (date: Date) => boolean;
  onMouseDown: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
  onMouseUp: () => void;
  onDoubleClick: (date: Date) => void;
}

export default function CalendarGrid({
  calendarDays,
  direction,
  year,
  month,
  getEventsForDate,
  isInRange,
  isRangeStart,
  isRangeEnd,
  isRangeMiddle,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  onDoubleClick,
}: CalendarGridProps) {
  const slideVariants = {
    enter: (dir: 'left' | 'right' | null) => ({
      x: dir === 'left' ? '50%' : dir === 'right' ? '-50%' : 0,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: 'left' | 'right' | null) => ({
      x: dir === 'left' ? '-50%' : dir === 'right' ? '50%' : 0,
      opacity: 0
    })
  };

  return (
    <div className="px-2 sm:px-4 pb-3 sm:pb-5 overflow-hidden w-full">
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES_SHORT.map((name, i) => (
          <div
            key={name}
            className={`
              text-center text-[10px] sm:text-xs font-semibold tracking-wider py-2
              ${i === 5 ? 'text-blue-500 dark:text-blue-400' : ''}
              ${i === 6 ? 'text-red-500 dark:text-red-400' : ''}
              ${i < 5 ? 'text-slate-500 dark:text-slate-400' : ''}
            `}
          >
            {name}
          </div>
        ))}
      </div>
      <div className="h-px bg-slate-200 dark:bg-slate-700 mb-1" />
      <div className="relative overflow-hidden w-full">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={`${year}-${month}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            className="grid grid-cols-7 w-full"
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {calendarDays.map(day => (
              <div key={day.dateKey} className="group">
                <CalendarCell
                  day={day}
                  events={getEventsForDate(day.date)}
                  isRangeStart={isRangeStart(day.date)}
                  isRangeEnd={isRangeEnd(day.date)}
                  isRangeMiddle={isRangeMiddle(day.date)}
                  isInRange={isInRange(day.date)}
                  onMouseDown={onMouseDown}
                  onMouseEnter={onMouseEnter}
                  onDoubleClick={onDoubleClick}
                />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
