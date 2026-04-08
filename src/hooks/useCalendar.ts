'use client';

import { useState, useMemo, useCallback } from 'react';
import { generateCalendarGrid, type CalendarDay } from '@/utils/dateUtils';

export interface UseCalendarReturn {
  currentDate: Date;
  year: number;
  month: number;
  calendarDays: CalendarDay[];
  direction: 'left' | 'right' | null;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  goToToday: () => void;
  goToMonth: (year: number, month: number) => void;
}

/**
 * Custom hook for calendar navigation and grid generation.
*/
export function useCalendar(): UseCalendarReturn {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(
    () => generateCalendarGrid(year, month),
    [year, month]
  );

  const goToPrevMonth = useCallback(() => {
    setDirection('right');
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setDirection('left');
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const goToToday = useCallback(() => {
    setDirection(null);
    setCurrentDate(new Date());
  }, []);

  const goToMonth = useCallback((y: number, m: number) => {
    setDirection(null);
    setCurrentDate(new Date(y, m, 1));
  }, []);

  return { currentDate, year, month, calendarDays, direction, goToPrevMonth, goToNextMonth, goToToday, goToMonth };
}
