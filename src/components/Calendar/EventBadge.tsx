'use client';

import { type CalendarEvent } from '@/data/mockEvents';

interface EventBadgeProps {
  events: CalendarEvent[];
  maxVisible?: number;
}

export default function EventBadge({ events, maxVisible = 3 }: EventBadgeProps) {
  if (events.length === 0) return null;

  const visible = events.slice(0, maxVisible);
  const remaining = events.length - maxVisible;

  return (
    <div className="flex items-center justify-center gap-[3px] mt-0.5">
      {visible.map(event => (
        <span
          key={event.id}
          className="w-[5px] h-[5px] rounded-full shrink-0 transition-transform duration-200 hover:scale-[1.8]"
          style={{ backgroundColor: event.color }}
        />
      ))}
      {remaining > 0 && (
        <span className="text-[7px] leading-none text-slate-400 dark:text-slate-500 font-semibold ml-0.5">
          +{remaining}
        </span>
      )}
    </div>
  );
}
