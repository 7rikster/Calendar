'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { formatDateKey, formatDateDisplay, formatTime } from '@/utils/dateUtils';
import { type CalendarEvent, EVENT_COLORS } from '@/data/mockEvents';

interface EventModalProps {
  isOpen: boolean;
  selectedDate: Date | null;
  selectedEndDate?: Date | null;
  eventToEdit?: CalendarEvent | null;
  onClose: () => void;
  onSave: (event: { title: string; date: string; endDate?: string; time: string; color: string; description?: string }) => void;
  onCheckConflicts?: (dateKey: string, endDateKey: string | undefined, time: string, excludeId?: string) => CalendarEvent[];
}

export default function EventModal({ isOpen, selectedDate, selectedEndDate, eventToEdit, onClose, onSave, onCheckConflicts }: EventModalProps) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [color, setColor] = useState<string>(EVENT_COLORS[0].value);
  const [description, setDescription] = useState('');
  const [conflicts, setConflicts] = useState<CalendarEvent[]>([]);
  const [showConflictWarning, setShowConflictWarning] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  const isRange = selectedDate && selectedEndDate &&
    formatDateKey(selectedDate) !== formatDateKey(selectedEndDate);

  useEffect(() => {
    if (isOpen) {
      if (eventToEdit) {
        setTitle(eventToEdit.title);
        setTime(eventToEdit.time);
        setColor(eventToEdit.color);
        setDescription(eventToEdit.description || '');
      } else {
        setTitle('');
        setTime('09:00');
        setColor(EVENT_COLORS[0].value);
        setDescription('');
      }
      setConflicts([]);
      setShowConflictWarning(false);
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [isOpen, eventToEdit]);

  // Auto-dismiss conflict warning when time changes
  useEffect(() => {
    if (showConflictWarning) {
      setShowConflictWarning(false);
      setConflicts([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }
  }, [isOpen, onClose]);

  const buildEventData = useCallback(() => {
    if (!selectedDate) return null;
    return {
      title: title.trim(),
      date: formatDateKey(selectedDate),
      endDate: isRange && selectedEndDate ? formatDateKey(selectedEndDate) : undefined,
      time,
      color,
      description: description.trim() || undefined,
    };
  }, [title, selectedDate, selectedEndDate, isRange, time, color, description]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim() || !selectedDate) return;

      // Check for conflicts before saving
      if (onCheckConflicts && !showConflictWarning) {
        const dateKey = formatDateKey(selectedDate);
        const endDateKey = isRange && selectedEndDate ? formatDateKey(selectedEndDate) : undefined;
        const found = onCheckConflicts(dateKey, endDateKey, time, eventToEdit?.id);
        if (found.length > 0) {
          setConflicts(found);
          setShowConflictWarning(true);
          return; // Don't save yet — show warning first
        }
      }

      const data = buildEventData();
      if (data) {
        onSave(data);
        onClose();
      }
    },
    [title, selectedDate, selectedEndDate, isRange, time, eventToEdit, onCheckConflicts, showConflictWarning, buildEventData, onSave, onClose]
  );

  const handleForceSubmit = useCallback(() => {
    const data = buildEventData();
    if (data) {
      onSave(data);
      onClose();
    }
  }, [buildEventData, onSave, onClose]);

  const handleEditTime = useCallback(() => {
    setShowConflictWarning(false);
    setConflicts([]);
    // Focus the time input
    const timeInput = document.getElementById('event-time');
    if (timeInput) {
      timeInput.focus();
      (timeInput as HTMLInputElement).showPicker?.();
    }
  }, []);

  if (!isOpen || !selectedDate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        data-modal-overlay
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div data-event-modal className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl
        animate-modal-enter overflow-hidden">
        <div className="h-1.5 transition-colors duration-300" style={{ backgroundColor: color }} />

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {eventToEdit ? 'Edit Event' : 'New Event'}
            </h2>
            <div className="text-right">
              {isRange ? (
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {formatDateDisplay(selectedDate)}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">to</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {formatDateDisplay(selectedEndDate!)}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {formatDateDisplay(selectedDate)}
                </span>
              )}
            </div>
          </div>

          {isRange && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20
              border border-blue-100 dark:border-blue-800/30">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" className="text-blue-500 dark:text-blue-400 shrink-0">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <p className="text-xs text-blue-600 dark:text-blue-300">
                This event will span all dates in the selected range
              </p>
            </div>
          )}

          {/* Conflict Warning */}
          {showConflictWarning && conflicts.length > 0 && (
            <div className="rounded-xl border border-amber-200 dark:border-amber-700/50 bg-amber-50 dark:bg-amber-900/20 
              overflow-hidden animate-fade-in">
              <div className="flex items-start gap-2.5 px-3.5 py-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-800/40 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" className="text-amber-600 dark:text-amber-400">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                    Time Conflict Detected
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300/80 mt-0.5">
                    You already {conflicts.length === 1 ? 'have an event' : `have ${conflicts.length} events`} at {formatTime(time)}:
                  </p>
                  <div className="mt-1.5 space-y-1">
                    {conflicts.map(c => (
                      <div key={c.id} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                        <span className="text-xs font-medium text-amber-900 dark:text-amber-100 truncate">
                          {c.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex border-t border-amber-200 dark:border-amber-700/50">
                <button
                  type="button"
                  onClick={handleEditTime}
                  className="flex-1 px-3 py-2.5 text-xs font-medium text-amber-700 dark:text-amber-300
                    hover:bg-amber-100 dark:hover:bg-amber-800/30 transition-colors duration-150 cursor-pointer"
                >
                  Edit Time
                </button>
                <div className="w-px bg-amber-200 dark:bg-amber-700/50" />
                <button
                  type="button"
                  onClick={handleForceSubmit}
                  className="flex-1 px-3 py-2.5 text-xs font-semibold text-amber-800 dark:text-amber-200
                    hover:bg-amber-100 dark:hover:bg-amber-800/30 transition-colors duration-150 cursor-pointer"
                >
                  Proceed Anyway
                </button>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="event-title" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              Event Title
            </label>
            <input
              ref={titleRef}
              id="event-title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Team Meeting"
              className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-600
                bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100
                text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                transition-all duration-200"
              required
            />
          </div>

          <div>
            <label htmlFor="event-time" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              Time
            </label>
            <input
              id="event-time"
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className={`w-full h-10 px-3 rounded-lg border 
                ${showConflictWarning
                  ? 'border-amber-400 dark:border-amber-500 ring-2 ring-amber-400/30'
                  : 'border-slate-200 dark:border-slate-600'}
                bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100
                text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40
                transition-all duration-200`}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
              Color Tag
            </label>
            <div className="flex flex-wrap gap-2">
              {EVENT_COLORS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-7 h-7 rounded-full transition-all duration-200
                    ${color === c.value
                      ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 scale-110'
                      : 'hover:scale-110'}
                  `}
                   style={{
                    backgroundColor: c.value,
                    '--ring-color': color === c.value ? c.value : undefined,
                  } as React.CSSProperties}
                  aria-label={`Select ${c.name} color`}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="event-description" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              Description (optional)
            </label>
            <textarea
              id="event-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600
                bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100
                text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500
                focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none
                transition-all duration-200"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 h-9 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300
                hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 h-9 rounded-lg text-sm font-medium text-white
                bg-blue-500 hover:bg-blue-600 active:scale-[0.97]
                shadow-sm shadow-blue-500/25 transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={!title.trim()}
            >
              {eventToEdit ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
