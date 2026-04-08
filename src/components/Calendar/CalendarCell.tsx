'use client';

import { memo, useCallback } from 'react';
import { type CalendarDay } from '@/utils/dateUtils';
import { type CalendarEvent } from '@/data/mockEvents';
import EventBadge from './EventBadge';

interface CalendarCellProps {
  day: CalendarDay;
  events: CalendarEvent[];
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isRangeMiddle: boolean;
  isInRange: boolean;
  onMouseDown: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
  onDoubleClick: (date: Date) => void;
}

const CalendarCell = memo(function CalendarCell({
  day,
  events,
  isRangeStart,
  isRangeEnd,
  isRangeMiddle,
  isInRange,
  onMouseDown,
  onMouseEnter,
  onDoubleClick,
}: CalendarCellProps) {
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => { e.preventDefault(); onMouseDown(day.date); },
    [day.date, onMouseDown]
  );

  const handleMouseEnter = useCallback(
    () => onMouseEnter(day.date),
    [day.date, onMouseEnter]
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); onDoubleClick(day.date); },
    [day.date, onDoubleClick]
  );

  const isSingleSelect = isRangeStart && isRangeEnd;

  const getDateColor = () => {
    if (day.isToday) return '';
    if (!day.isCurrentMonth) return 'text-slate-400 dark:text-slate-400';
    if (day.isSunday) return 'text-red-500 dark:text-red-400';
    if (day.isSaturday) return 'text-blue-500 dark:text-blue-400';
    return 'text-slate-700 dark:text-slate-200';
  };

  return (
    <div
      className={`
        relative flex flex-col items-center justify-center pt-1 pb-0.5
        min-h-[48px] sm:min-h-[56px] md:min-h-[68px]
        cursor-pointer select-none transition-all duration-150
        ${!isInRange && day.isCurrentMonth ? 'hover:bg-slate-100/80 dark:hover:bg-slate-700/40' : ''}
        ${!day.isCurrentMonth ? 'opacity-35' : ''}
        ${isRangeMiddle ? 'bg-blue-50 dark:bg-blue-950/40' : ''}
        ${isRangeStart && !isSingleSelect ? 'bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/50 dark:to-blue-950/40 rounded-l-lg' : ''}
        ${isRangeEnd && !isSingleSelect ? 'bg-gradient-to-l from-blue-100 to-blue-50 dark:from-blue-900/50 dark:to-blue-950/40 rounded-r-lg' : ''}
      `}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className={`
          w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full
          text-xs sm:text-sm font-medium transition-all duration-200
          ${day.isToday && !isInRange
            ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-400/30'
            : ''}
          ${day.isToday && isInRange
            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
            : ''}
          ${(isRangeStart || isRangeEnd) && !day.isToday
            ? 'bg-blue-500 text-white shadow-sm shadow-blue-500/25'
            : ''}
          ${getDateColor()}
        `}
      >
        {day.day}
      </div>

      <EventBadge events={events} maxVisible={3} />

      {events.length > 0 && day.isCurrentMonth && (
        <div className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-1
          opacity-0 group-hover:opacity-100 pointer-events-none
          transition-opacity duration-200">
          <div className="bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800
            text-[10px] px-2 py-1 rounded-md shadow-lg whitespace-nowrap max-w-[160px] truncate">
            {events[0].title}{events.length > 1 ? ` +${events.length - 1}` : ''}
          </div>
        </div>
      )}
    </div>
  );
});

export default CalendarCell;
