'use client';

import { useMemo } from 'react';
import { type CalendarEvent } from '@/data/mockEvents';
import { formatDateDisplay, formatTime, formatDateKey } from '@/utils/dateUtils';

interface AgendaPanelProps {
  startDate: Date | null;
  endDate: Date | null;
  getEventsForDate: (date: Date) => CalendarEvent[];
  getEventsForRange: (start: Date, end: Date) => CalendarEvent[];
  onDeleteEvent: (id: string) => void;
  onCreateEvent: (date: Date) => void;
}

/**
 * Side panel / agenda view showing events for the selected date or range.
 * Features a clean scrollable list grouped by date with delete functionality.
 */
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

  // Group events by date for range view
  const groupedEvents = useMemo(() => {
    if (!endDate || !startDate) return null;
    const groups = new Map<string, { date: Date; events: CalendarEvent[] }>();
    for (const event of events) {
      if (!groups.has(event.date)) {
        const [y, m, d] = event.date.split('-').map(Number);
        groups.set(event.date, { date: new Date(y, m - 1, d), events: [] });
      }
      groups.get(event.date)!.events.push(event);
    }
    return Array.from(groups.values());
  }, [events, startDate, endDate]);

  const hasSelection = startDate !== null;
  const isRange = startDate && endDate && formatDateKey(startDate) !== formatDateKey(endDate);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-lg
      dark:shadow-slate-900/50 overflow-hidden border border-slate-100 dark:border-slate-700/50">
      {/* Panel header */}
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

      {/* Events list */}
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
                transition-colors duration-200"
            >
              + Add Event
            </button>
          </div>
        )}

        {/* Single date events */}
        {hasSelection && !isRange && events.length > 0 && (
          <>
            {events.map(event => (
              <EventCard key={event.id} event={event} onDelete={onDeleteEvent} />
            ))}
          </>
        )}

        {/* Range grouped events */}
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

      {/* Create event button */}
      {hasSelection && events.length > 0 && (
        <div className="px-4 sm:px-5 py-3 border-t border-slate-100 dark:border-slate-700/50">
          <button
            onClick={() => onCreateEvent(startDate)}
            className="w-full h-9 rounded-lg text-sm font-medium text-blue-500 dark:text-blue-400
              bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30
              active:scale-[0.98] transition-all duration-200"
          >
            + New Event
          </button>
        </div>
      )}
    </div>
  );
}

/** Individual event card in the agenda list */
function EventCard({ event, onDelete }: { event: CalendarEvent; onDelete: (id: string) => void }) {
  return (
    <div className="group relative flex items-start gap-3 p-2.5 rounded-xl
      hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors duration-150">
      {/* Color indicator */}
      <div
        className="w-1 min-h-[32px] h-full rounded-full shrink-0 mt-0.5"
        style={{ backgroundColor: event.color }}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
          {event.title}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          {formatTime(event.time)}
        </p>
        {event.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {event.description}
          </p>
        )}
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(event.id); }}
        className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md
          flex items-center justify-center text-slate-400 hover:text-red-500
          hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 shrink-0"
        aria-label={`Delete ${event.title}`}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
