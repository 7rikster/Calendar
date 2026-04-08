'use client';

import { useState, useCallback, useRef } from 'react';
import { isSameDay } from '@/utils/dateUtils';

export interface UseRangeSelectionReturn {
  startDate: Date | null;
  endDate: Date | null;
  isDragging: boolean;
  hoverDate: Date | null;
  /** 'first' = start date set, waiting for second click to complete range */
  clickPhase: 'idle' | 'first';
  handleMouseDown: (date: Date) => void;
  handleMouseEnter: (date: Date) => void;
  handleMouseUp: () => void;
  isInRange: (date: Date) => boolean;
  isRangeStart: (date: Date) => boolean;
  isRangeEnd: (date: Date) => boolean;
  isRangeMiddle: (date: Date) => boolean;
  clearSelection: () => void;
  getEffectiveRange: () => { start: Date; end: Date } | null;
}

/**
 * Custom hook for date range selection.
 *
 * Supports TWO interaction models:
 *   1. Drag-to-select: mousedown → mousemove → mouseup finalises the range.
 *   2. Click-click:    click once to set start, click again to set end.
 *
 * `clickPhase` tracks whether we are waiting for the second click.
 * Refs mirror state so that synchronous handlers always read the latest value.
 */
export function useRangeSelection(): UseRangeSelectionReturn {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [clickPhase, setClickPhase] = useState<'idle' | 'first'>('idle');

  // Refs mirror state so that synchronous handlers always read the latest value
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<Date | null>(null);
  const hasDraggedRef = useRef(false);
  const hoverDateRef = useRef<Date | null>(null);
  const clickPhaseRef = useRef<'idle' | 'first'>('idle');
  const firstClickDateRef = useRef<Date | null>(null);

  const normalize = useCallback(
    (s: Date | null, e: Date | null): { start: Date; end: Date } | null => {
      if (!s) return null;
      if (!e) return { start: s, end: s };
      return s <= e ? { start: s, end: e } : { start: e, end: s };
    },
    []
  );

  const getEffectiveRange = useCallback((): { start: Date; end: Date } | null => {
    if (isDragging && dragStartRef.current && hoverDate) {
      return normalize(dragStartRef.current, hoverDate);
    }
    return normalize(startDate, endDate);
  }, [isDragging, hoverDate, startDate, endDate, normalize]);

  const handleMouseDown = useCallback((date: Date) => {
    if (clickPhaseRef.current === 'first' && firstClickDateRef.current) {
      const range = normalize(firstClickDateRef.current, date);
      if (range) {
        setStartDate(range.start);
        setEndDate(isSameDay(range.start, range.end) ? null : range.end);
      }
      clickPhaseRef.current = 'idle';
      firstClickDateRef.current = null;
      setClickPhase('idle');
      setHoverDate(null);
      hoverDateRef.current = null;
      isDraggingRef.current = false;
      dragStartRef.current = null;
      hasDraggedRef.current = false;
      return;
    }

    dragStartRef.current = date;
    hasDraggedRef.current = false;
    isDraggingRef.current = true;
    hoverDateRef.current = date;
    setIsDragging(true);
    setHoverDate(date);
  }, [normalize]);

  const handleMouseEnter = useCallback((date: Date) => {
    if (isDraggingRef.current) {
      if (dragStartRef.current && !isSameDay(date, dragStartRef.current)) {
        hasDraggedRef.current = true;
      }
      hoverDateRef.current = date;
      setHoverDate(date);
      return;
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    if (isDraggingRef.current && dragStartRef.current) {
      if (hasDraggedRef.current && hoverDateRef.current) {
        const range = normalize(dragStartRef.current, hoverDateRef.current);
        if (range) {
          setStartDate(range.start);
          setEndDate(range.end);
        }
        clickPhaseRef.current = 'idle';
        firstClickDateRef.current = null;
        setClickPhase('idle');
      } else {
        const clickedDate = dragStartRef.current;
        setStartDate(clickedDate);
        setEndDate(null);
        clickPhaseRef.current = 'first';
        firstClickDateRef.current = clickedDate;
        setClickPhase('first');
      }
    }
    isDraggingRef.current = false;
    dragStartRef.current = null;
    hasDraggedRef.current = false;
    setIsDragging(false);
    if (clickPhaseRef.current !== 'first') {
      hoverDateRef.current = null;
      setHoverDate(null);
    }
  }, [normalize]);

  const isInRange = useCallback((date: Date): boolean => {
    const range = getEffectiveRange();
    if (!range) return false;
    const dt = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const st = new Date(range.start.getFullYear(), range.start.getMonth(), range.start.getDate()).getTime();
    const et = new Date(range.end.getFullYear(), range.end.getMonth(), range.end.getDate()).getTime();
    return dt >= st && dt <= et;
  }, [getEffectiveRange]);

  const isRangeStart = useCallback((date: Date): boolean => {
    const range = getEffectiveRange();
    if (!range) return false;
    return isSameDay(date, range.start);
  }, [getEffectiveRange]);

  const isRangeEnd = useCallback((date: Date): boolean => {
    const range = getEffectiveRange();
    if (!range) return false;
    return isSameDay(date, range.end);
  }, [getEffectiveRange]);

  const isRangeMiddle = useCallback((date: Date): boolean => {
    return isInRange(date) && !isRangeStart(date) && !isRangeEnd(date);
  }, [isInRange, isRangeStart, isRangeEnd]);

  const clearSelection = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
    isDraggingRef.current = false;
    hoverDateRef.current = null;
    dragStartRef.current = null;
    hasDraggedRef.current = false;
    clickPhaseRef.current = 'idle';
    firstClickDateRef.current = null;
    setIsDragging(false);
    setHoverDate(null);
    setClickPhase('idle');
  }, []);

  return {
    startDate, endDate, isDragging, hoverDate, clickPhase,
    handleMouseDown, handleMouseEnter, handleMouseUp,
    isInRange, isRangeStart, isRangeEnd, isRangeMiddle,
    clearSelection, getEffectiveRange,
  };
}
