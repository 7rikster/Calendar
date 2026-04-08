'use client';

import { useState, useCallback, useRef } from 'react';
import { isSameDay } from '@/utils/dateUtils';

export interface UseRangeSelectionReturn {
  startDate: Date | null;
  endDate: Date | null;
  isDragging: boolean;
  hoverDate: Date | null;
  handleMouseDown: (date: Date) => void;
  handleMouseEnter: (date: Date) => void;
  handleMouseUp: () => void;
  handleDateClick: (date: Date) => void;
  isInRange: (date: Date) => boolean;
  isRangeStart: (date: Date) => boolean;
  isRangeEnd: (date: Date) => boolean;
  isRangeMiddle: (date: Date) => boolean;
  clearSelection: () => void;
  getEffectiveRange: () => { start: Date; end: Date } | null;
}

/**
 * Custom hook for date range selection with drag-to-select support.
 * Handles click selection, drag selection, and reverse range normalization.
 */
export function useRangeSelection(): UseRangeSelectionReturn {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const dragStartRef = useRef<Date | null>(null);
  const hasDraggedRef = useRef(false);

  /** Normalize a range so start <= end */
  const normalize = useCallback(
    (s: Date | null, e: Date | null): { start: Date; end: Date } | null => {
      if (!s) return null;
      if (!e) return { start: s, end: s };
      return s <= e ? { start: s, end: e } : { start: e, end: s };
    },
    []
  );

  /** Get the currently effective range (accounts for drag preview) */
  const getEffectiveRange = useCallback((): { start: Date; end: Date } | null => {
    if (isDragging && dragStartRef.current && hoverDate) {
      return normalize(dragStartRef.current, hoverDate);
    }
    return normalize(startDate, endDate);
  }, [isDragging, hoverDate, startDate, endDate, normalize]);

  const handleMouseDown = useCallback((date: Date) => {
    dragStartRef.current = date;
    hasDraggedRef.current = false;
    setIsDragging(true);
    setHoverDate(date);
  }, []);

  const handleMouseEnter = useCallback((date: Date) => {
    if (isDragging) {
      if (dragStartRef.current && !isSameDay(date, dragStartRef.current)) {
        hasDraggedRef.current = true;
      }
      setHoverDate(date);
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (isDragging && dragStartRef.current && hasDraggedRef.current && hoverDate) {
      const range = normalize(dragStartRef.current, hoverDate);
      if (range) {
        setStartDate(range.start);
        setEndDate(range.end);
      }
    }
    setIsDragging(false);
    setHoverDate(null);
    dragStartRef.current = null;
  }, [isDragging, hoverDate, normalize]);

  const handleDateClick = useCallback((date: Date) => {
    if (hasDraggedRef.current) return;
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else {
      const range = normalize(startDate, date);
      if (range) {
        setStartDate(range.start);
        setEndDate(range.end);
      }
    }
  }, [startDate, endDate, normalize]);

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
    setIsDragging(false);
    setHoverDate(null);
    dragStartRef.current = null;
    hasDraggedRef.current = false;
  }, []);

  return {
    startDate, endDate, isDragging, hoverDate,
    handleMouseDown, handleMouseEnter, handleMouseUp, handleDateClick,
    isInRange, isRangeStart, isRangeEnd, isRangeMiddle,
    clearSelection, getEffectiveRange,
  };
}
