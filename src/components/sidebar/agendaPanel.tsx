'use client';

import { useMemo } from 'react';
import { type CalendarEvent } from '@/data/mockEvents';
import { formatDateDisplay, formatTime, formatDateKey } from '@/utils/dateUtils';
import { Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

interface AgendaPanelProps {
  startDate: Date | null;
  endDate: Date | null;
  getEventsForDate: (date: Date) => CalendarEvent[];
  getEventsForRange: (start: Date, end: Date) => CalendarEvent[];
  onDeleteEvent: (id: string) => void;
  onCreateEvent: (date: Date) => void;
}

function parseDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatShortRange(startKey: string, endKey: string): string {
  const s = parseDateKey(startKey);
  const e = parseDateKey(endKey);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${months[s.getMonth()]} ${s.getDate()} – ${e.getDate()}`;
  }
  return `${months[s.getMonth()]} ${s.getDate()} – ${months[e.getMonth()]} ${e.getDate()}`;
}

export default function AgendaPanel({
  startDate,
  endDate,
  getEventsForDate,
  getEventsForRange,
  onDeleteEvent,
  onCreateEvent,
}: AgendaPanelProps) {
  const events = useMemo(() => {
    if (!startDate) return [];
    if (!endDate) return getEventsForDate(startDate);
    return getEventsForRange(startDate, endDate);
  }, [startDate, endDate, getEventsForDate, getEventsForRange]);

  const groupedEvents = useMemo(() => {
    if (!endDate || !startDate) return null;

    const groups = new Map<string, { date: Date; events: CalendarEvent[] }>();

    const current = new Date(startDate);
    const last = new Date(endDate);
    while (current <= last) {
      const key = formatDateKey(current);
      groups.set(key, { date: new Date(current), events: [] });
      current.setDate(current.getDate() + 1);
    }

    const placed = new Set<string>();

    for (const event of events) {
      if (placed.has(event.id)) continue;
      placed.add(event.id);

      const eventStart = event.date;
      const startKey = formatDateKey(startDate);

      const placeKey = eventStart >= startKey ? eventStart : startKey;

      if (groups.has(placeKey)) {
        groups.get(placeKey)!.events.push(event);
      }
    }

    return Array.from(groups.values()).filter(g => g.events.length > 0);
  }, [events, startDate, endDate]);

  const hasSelection = startDate !== null;
  const isRange = startDate && endDate && formatDateKey(startDate) !== formatDateKey(endDate);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-lg
      dark:shadow-slate-900/50 overflow-hidden border border-slate-100 dark:border-slate-700/50">
      <div className="px-4 sm:px-5 py-4 border-b border-slate-100 dark:border-slate-700/50">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 tracking-wide uppercase">
          Agenda
        </h2>
        {hasSelection && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isRange
              ? `${formatDateDisplay(startDate)} — ${formatDateDisplay(endDate)}`
              : formatDateDisplay(startDate)}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3 space-y-2">
        {!hasSelection && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.5" className="text-slate-400 dark:text-slate-500">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Select a date to view events
            </p>
          </div>
        )}

        {hasSelection && events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3">
              <span className="text-lg">📭</span>
            </div>
            <p className="text-sm text-slate-400 dark:text-slate-500 mb-3">
              No events scheduled
            </p>
            <button
              onClick={() => onCreateEvent(startDate)}
              className="px-3 h-8 rounded-lg text-xs font-medium text-blue-500 dark:text-blue-400
                bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30
                transition-colors duration-200 cursor-pointer"
            >
              + Add Event
            </button>
          </div>
        )}

        {hasSelection && !isRange && events.length > 0 && (
          <>
            {events.map(event => (
              <EventCard key={event.id} event={event} onDelete={onDeleteEvent} />
            ))}
          </>
        )}

        {isRange && groupedEvents && groupedEvents.length > 0 && (
          <>
            {groupedEvents.map(({ date, events: dayEvents }) => (
              <div key={formatDateKey(date)}>
                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-2 mb-1">
                  {formatDateDisplay(date)}
                </p>
                {dayEvents.map(event => (
                  <EventCard key={event.id} event={event} onDelete={onDeleteEvent} />
                ))}
              </div>
            ))}
          </>
        )}
      </div>

      {hasSelection && events.length > 0 && (
        <div className="px-4 sm:px-5 py-3 border-t border-slate-100 dark:border-slate-700/50">
          <button
            onClick={() => onCreateEvent(startDate)}
            className="w-full h-9 rounded-lg text-sm font-medium text-blue-500 dark:text-blue-400
              bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30
              active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            + New Event
          </button>
        </div>
      )}
    </div>
  );
}

function EventCard({ event, onDelete }: { event: CalendarEvent; onDelete: (id: string) => void }) {
  const isMultiDay = event.endDate && event.endDate !== event.date;

  return (
    <div className="group relative flex items-center justify-center gap-3 p-2.5 rounded-xl
      hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors duration-150">
      <div className="flex items-start justify-center gap-3 w-full">
        <div
        className="w-1 min-h-[32px] h-full rounded-full shrink-0 mt-0.5"
        style={{ backgroundColor: event.color }}
        />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
            {event.title}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {formatTime(event.time)}
            </p>
            {isMultiDay && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md
                bg-blue-50 dark:bg-blue-900/20 text-[10px] font-medium
                text-blue-600 dark:text-blue-300">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" className="shrink-0">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                </svg>
                {formatShortRange(event.date, event.endDate!)}
              </span>
            )}
          </div>
          {event.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
      </div>

      <Button
        onClick={(e) => { e.stopPropagation(); onDelete(event.id); }}
        variant="ghost"
        size="icon"
        className="w-8 h-8 text-slate-400 hover:text-red-500
          hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 shrink-0 cursor-pointer"
        aria-label={`Delete ${event.title}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
