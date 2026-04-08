'use client';

import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      id="theme-toggle"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="cursor-pointer relative w-14 h-7 rounded-full bg-slate-200 dark:bg-slate-700
        transition-colors duration-300 focus:outline-none focus-visible:ring-2
        focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-xs transition-opacity duration-300"
        style={{ opacity: theme === 'light' ? 1 : 0.3 }}>
        ☀️
      </span>
      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-xs transition-opacity duration-300"
        style={{ opacity: theme === 'dark' ? 1 : 0.3 }}>
        🌙
      </span>
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white dark:bg-slate-900
          shadow-md transition-all duration-300 ease-in-out
          ${theme === 'light' ? 'translate-x-7' : 'translate-x-0'}`}
      />
    </button>
  );
}
