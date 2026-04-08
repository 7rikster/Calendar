'use client';

import { useState, useCallback, useMemo } from 'react';
import { type CalendarEvent, mockEvents } from '@/data/mockEvents';
import { formatDateKey } from '@/utils/dateUtils';

const STORAGE_KEY = 'calendar-events';

export interface UseEventsReturn {
  events: CalendarEvent[];
  eventsByDate: Map<string, CalendarEvent[]>;
  getEventsForDate: (date: Date) => CalendarEvent[];
  getEventsForRange: (start: Date, end: Date) => CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  editEvent: (id: string, event: Omit<CalendarEvent, 'id'>) => void;
  deleteEvent: (id: string) => void;
  getConflicts: (dateKey: string, endDateKey: string | undefined, time: string, excludeId?: string) => CalendarEvent[];
}


function eventSpansDate(event: CalendarEvent, dateKey: string): boolean {
  if (!event.endDate || event.endDate === event.date) {
    return event.date === dateKey;
  }
  return dateKey >= event.date && dateKey <= event.endDate;
}

function eventOverlapsRange(event: CalendarEvent, startKey: string, endKey: string): boolean {
  const evStart = event.date;
  const evEnd = event.endDate || event.date;
  return evStart <= endKey && evEnd >= startKey;
}


export function useEvents(): UseEventsReturn {
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    if (typeof window === 'undefined') return mockEvents;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as CalendarEvent[];
    } catch {}
    return mockEvents;
  });

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
      const dateKey = formatDateKey(date);
      return events.filter(event => eventSpansDate(event, dateKey));
    },
    [events]
  );


  const getEventsForRange = useCallback(
    (start: Date, end: Date): CalendarEvent[] => {
      const startKey = formatDateKey(start);
      const endKey = formatDateKey(end);
      return events
        .filter(event => eventOverlapsRange(event, startKey, endKey))
        .sort((a, b) => {
          if (a.date !== b.date) return a.date.localeCompare(b.date);
          return a.time.localeCompare(b.time);
        });
    },
    [events]
  );

  const persistEvents = useCallback((updated: CalendarEvent[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }, []);

  const addEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    };
    setEvents(prev => {
      const updated = [...prev, newEvent];
      persistEvents(updated);
      return updated;
    });
  }, [persistEvents]);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => {
      const updated = prev.filter(e => e.id !== id);
      persistEvents(updated);
      return updated;
    });
  }, [persistEvents]);

  const editEvent = useCallback((id: string, eventData: Omit<CalendarEvent, 'id'>) => {
    setEvents(prev => {
      const updated = prev.map(e => (e.id === id ? { ...eventData, id } : e));
      persistEvents(updated);
      return updated;
    });
  }, [persistEvents]);
  const getConflicts = useCallback(
    (dateKey: string, endDateKey: string | undefined, time: string, excludeId?: string): CalendarEvent[] => {
      const rangeStart = dateKey;
      const rangeEnd = endDateKey || dateKey;
      return events.filter(ev => {
        if (excludeId && ev.id === excludeId) return false;
        if (ev.time !== time) return false;
        const evEnd = ev.endDate || ev.date;
        return ev.date <= rangeEnd && evEnd >= rangeStart;
      });
    },
    [events]
  );

  return { events, eventsByDate, getEventsForDate, getEventsForRange, addEvent, deleteEvent, editEvent, getConflicts };
}
