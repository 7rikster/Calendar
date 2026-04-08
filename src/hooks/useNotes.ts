import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'calendar_monthly_notes';

interface NotesMap {
  [key: string]: string;
}

export function useNotes() {
  const [notesMap, setNotesMap] = useState<NotesMap>({});

  // Load notes from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setNotesMap(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load notes from local storage:', error);
    }
  }, []);

  // Save notes map to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notesMap));
    } catch (error) {
      console.error('Failed to save notes to local storage:', error);
    }
  }, [notesMap]);

  const getNote = useCallback(
    (year: number, month: number): string => {
      const key = `${year}-${month}`;
      return notesMap[key] || '';
    },
    [notesMap]
  );

  const saveNote = useCallback((year: number, month: number, content: string) => {
    const key = `${year}-${month}`;
    setNotesMap((prev) => ({
      ...prev,
      [key]: content,
    }));
  }, []);

  return {
    getNote,
    saveNote,
  };
}
