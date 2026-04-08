'use client';

import { useState, useCallback, useMemo } from 'react';
import { type CalendarEvent, mockEvents } from '@/data/mockEvents';
import { formatDateKey } from '@/utils/dateUtils';

export interface UseEventsReturn {
  events: CalendarEvent[];
  eventsByDate: Map<string, CalendarEvent[]>;
  getEventsForDate: (date: Date) => CalendarEvent[];
  getEventsForRange: (start: Date, end: Date) => CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteEvent: (id: string) => void;
}

/**
 * Custom hook for event management.
*/
export function useEvents(): UseEventsReturn {
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const existing = map.get(event.date) || [];
      existing.push(event);
      map.set(event.date, existing);
    }
    return map;
  }, [events]);

  const getEventsForDate = useCallback(
    (date: Date): CalendarEvent[] => {
      return eventsByDate.get(formatDateKey(date)) || [];
    },
    [eventsByDate]
  );

  const getEventsForRange = useCallback(
    (start: Date, end: Date): CalendarEvent[] => {
      const result: CalendarEvent[] = [];
      const current = new Date(start);
      while (current <= end) {
        const dayEvents = eventsByDate.get(formatDateKey(current));
        if (dayEvents) result.push(...dayEvents);
        current.setDate(current.getDate() + 1);
      }
      return result.sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
      });
    },
    [eventsByDate]
  );

  const addEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    };
    setEvents(prev => [...prev, newEvent]);
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  return { events, eventsByDate, getEventsForDate, getEventsForRange, addEvent, deleteEvent };
}
