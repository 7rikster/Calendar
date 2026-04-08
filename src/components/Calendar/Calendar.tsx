'use client';

import { useState, useCallback, useEffect } from 'react';
import { useCalendar } from '@/hooks/useCalendar';
import { useRangeSelection } from '@/hooks/useRangeSelection';
import { useEvents } from '@/hooks/useEvents';
import { type CalendarEvent } from '@/data/mockEvents';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import EventModal from './EventModal';
import AgendaPanel from '@/components/Sidebar/agendaPanel';
import ThemeToggle from '@/components/themeToggle';

export default function Calendar() {
  const { year, month, calendarDays, direction, goToPrevMonth, goToNextMonth, goToToday } = useCalendar();
  const rangeSelection = useRangeSelection();
  const { getEventsForDate, getEventsForRange, addEvent, deleteEvent, editEvent, getConflicts } = useEvents();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<Date | null>(null);
  const [modalEndDate, setModalEndDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const [agendaOpen, setAgendaOpen] = useState(false);

  const handleOpenModal = useCallback((date: Date) => {
    setEditingEvent(null);
    const range = rangeSelection.getEffectiveRange();
    if (range && range.start.getTime() !== range.end.getTime()) {
      setModalDate(range.start);
      setModalEndDate(range.end);
    } else {
      setModalDate(date);
      setModalEndDate(null);
    }
    setModalOpen(true);
  }, [rangeSelection]);

  const handleEditEventClick = useCallback((event: CalendarEvent) => {
    setEditingEvent(event);
    const [y, m, d] = event.date.split('-').map(Number);
    setModalDate(new Date(y, m - 1, d));
    if (event.endDate && event.endDate !== event.date) {
      const [ey, em, ed] = event.endDate.split('-').map(Number);
      setModalEndDate(new Date(ey, em - 1, ed));
    } else {
      setModalEndDate(null);
    }
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setModalDate(null);
    setModalEndDate(null);
    setTimeout(() => setEditingEvent(null), 300); // clear after animation
  }, []);

  const handleSaveEvent = useCallback(
    (eventData: { title: string; date: string; endDate?: string; time: string; color: string; description?: string }) => {
      if (editingEvent) {
        editEvent(editingEvent.id, eventData);
      } else {
        addEvent(eventData);
      }
    },
    [addEvent, editEvent, editingEvent]
  );

  const hasSelection = rangeSelection.startDate !== null;

  useEffect(() => {
    if (!hasSelection) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-calendar-interactive]')) return;
      if (target.closest('[data-modal-overlay]') || target.closest('[data-event-modal]')) return;
      if (target.closest('[data-toolbar]')) return;

      rangeSelection.clearSelection();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [hasSelection, rangeSelection]);

  return (
    <div className="w-full max-w-[1200px] mx-auto px-3 sm:px-4 lg:px-6 py-4">
      <div data-toolbar className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
        </div>
        <div className="flex items-center gap-3">
          {hasSelection && (
            <button
              onClick={rangeSelection.clearSelection}
              className="text-xs font-medium text-slate-500 dark:text-slate-400
                hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 cursor-pointer"
            >
              Clear Selection
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-slate-900/50
        overflow-hidden border border-slate-100 dark:border-slate-700/50
        transition-shadow duration-300 hover:shadow-2xl dark:hover:shadow-slate-900/60">
        
        <CalendarHeader
          year={year}
          month={month}
          onPrevMonth={goToPrevMonth}
          onNextMonth={goToNextMonth}
          onToday={goToToday}
        />

        <div className="flex flex-col lg:flex-row lg:relative">
          <div className="flex-1 min-w-0">
            <div data-calendar-interactive>
              <CalendarGrid
                calendarDays={calendarDays}
                direction={direction}
                year={year}
                month={month}
                getEventsForDate={getEventsForDate}
                isInRange={rangeSelection.isInRange}
                isRangeStart={rangeSelection.isRangeStart}
                isRangeEnd={rangeSelection.isRangeEnd}
                isRangeMiddle={rangeSelection.isRangeMiddle}
                onMouseDown={rangeSelection.handleMouseDown}
                onMouseEnter={rangeSelection.handleMouseEnter}
                onMouseUp={rangeSelection.handleMouseUp}
                onDoubleClick={handleOpenModal}
                onPrevMonth={goToPrevMonth}
                onNextMonth={goToNextMonth}
              />
            </div>
          </div>

          <div className={`
            lg:w-[320px] xl:w-[350px] shrink-0
            ${agendaOpen ? 'block' : 'hidden'} lg:block
            border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700/50
            transition-all duration-300 bg-slate-50/50 dark:bg-slate-900/50
          `}>
            <div data-calendar-interactive className="h-full lg:absolute lg:inset-y-0 lg:right-0 lg:w-[320px] xl:w-[350px]">
              <AgendaPanel
                startDate={rangeSelection.startDate}
                endDate={rangeSelection.endDate}
                getEventsForDate={getEventsForDate}
                getEventsForRange={getEventsForRange}
                onDeleteEvent={deleteEvent}
                onCreateEvent={handleOpenModal}
                onEditEvent={handleEditEventClick}
                year={year}
                month={month}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <button
          onClick={() => setAgendaOpen(!agendaOpen)}
          className="lg:hidden w-full max-w-sm h-10 rounded-xl bg-white dark:bg-slate-800
            border border-slate-200 dark:border-slate-700 shadow-sm
            text-sm font-medium text-slate-600 dark:text-slate-300
            flex items-center justify-center gap-2
            hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          {agendaOpen ? 'Hide Agenda' : 'Show Agenda'}
        </button>
      </div>

      <EventModal
        isOpen={modalOpen}
        selectedDate={modalDate}
        selectedEndDate={modalEndDate}
        eventToEdit={editingEvent}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        onCheckConflicts={getConflicts}
      />
    </div>
  );
}
