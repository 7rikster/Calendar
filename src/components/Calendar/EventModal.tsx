'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { formatDateKey, formatDateDisplay } from '@/utils/dateUtils';
import { EVENT_COLORS } from '@/data/mockEvents';

interface EventModalProps {
  isOpen: boolean;
  selectedDate: Date | null;
  selectedEndDate?: Date | null;
  onClose: () => void;
  onSave: (event: { title: string; date: string; endDate?: string; time: string; color: string; description?: string }) => void;
}

export default function EventModal({ isOpen, selectedDate, selectedEndDate, onClose, onSave }: EventModalProps) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [color, setColor] = useState<string>(EVENT_COLORS[0].value);
  const [description, setDescription] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);

  const isRange = selectedDate && selectedEndDate &&
    formatDateKey(selectedDate) !== formatDateKey(selectedEndDate);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setTime('09:00');
      setColor(EVENT_COLORS[0].value);
      setDescription('');
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }
  }, [isOpen, onClose]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim() || !selectedDate) return;
      onSave({
        title: title.trim(),
        date: formatDateKey(selectedDate),
        endDate: isRange && selectedEndDate ? formatDateKey(selectedEndDate) : undefined,
        time,
        color,
        description: description.trim() || undefined,
      });
      onClose();
    },
    [title, selectedDate, selectedEndDate, isRange, time, color, description, onSave, onClose]
  );

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
              New Event
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
              className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-600
                bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100
                text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40
                transition-all duration-200"
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
                hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 h-9 rounded-lg text-sm font-medium text-white
                bg-blue-500 hover:bg-blue-600 active:scale-[0.97]
                shadow-sm shadow-blue-500/25 transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!title.trim()}
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
