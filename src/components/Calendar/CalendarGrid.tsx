'use client';

import { type CalendarDay, DAY_NAMES_SHORT } from '@/utils/dateUtils';
import { type CalendarEvent } from '@/data/mockEvents';
import CalendarCell from './CalendarCell';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';

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
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
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
  onPrevMonth,
  onNextMonth,
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

  const eventSpansDate = (ev: CalendarEvent, dateKey: string) => {
    const evStart = ev.date;
    const evEnd = ev.endDate || ev.date;
    return dateKey >= evStart && dateKey <= evEnd;
  };

  const slotsByDate: Record<string, (CalendarEvent | null)[]> = {};
  calendarDays.forEach(day => slotsByDate[day.dateKey] = []);

  const multiDayEventsMap = new Map<string, CalendarEvent>();
  calendarDays.forEach(day => {
    getEventsForDate(day.date).forEach(e => {
      if (e.endDate && e.endDate !== e.date) {
        multiDayEventsMap.set(e.id, e);
      }
    });
  });

  const multiDayEvents = Array.from(multiDayEventsMap.values());
  multiDayEvents.sort((a, b) => {
    const aStart = new Date(a.date).getTime();
    const bStart = new Date(b.date).getTime();
    if (aStart !== bStart) return aStart - bStart;
    const aEnd = new Date(a.endDate || a.date).getTime();
    const bEnd = new Date(b.endDate || b.date).getTime();
    return bEnd - aEnd;
  });

  multiDayEvents.forEach(event => {
    const activeDates = calendarDays.filter(day => eventSpansDate(event, day.dateKey)).map(d => d.dateKey);
    if (activeDates.length === 0) return;

    let slot = 0;
    while (true) {
      const isFree = activeDates.every(date => !slotsByDate[date][slot]);
      if (isFree) break;
      slot++;
    }

    activeDates.forEach(date => {
      while (slotsByDate[date].length <= slot) slotsByDate[date].push(null);
      slotsByDate[date][slot] = event;
    });
  });

  const maxSlotsByWeek: number[] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    const week = calendarDays.slice(i, i + 7);
    let max = 0;
    week.forEach(day => {
      max = Math.max(max, slotsByDate[day.dateKey].length);
    });
    maxSlotsByWeek.push(max);
  }

  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;

    if (deltaX > 50 && onNextMonth) {
      onNextMonth();
    } else if (deltaX < -50 && onPrevMonth) {
      onPrevMonth();
    }
    
    touchStartX.current = null;
  };

  return (
    <div 
      className="px-2 sm:px-4 pb-3 sm:pb-5 overflow-hidden w-full dark:bg-slate-900/80 pt-2 lg:pt-4"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
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
      <div className="relative w-full">
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
            {calendarDays.map((day, i) => (
              <div key={day.dateKey} className="group">
                <CalendarCell
                  day={day}
                  events={getEventsForDate(day.date)}
                  slottedEvents={slotsByDate[day.dateKey]}
                  maxSlots={maxSlotsByWeek[Math.floor(i / 7)]}
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
