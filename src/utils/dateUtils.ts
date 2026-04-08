export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

export const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

export const DAY_NAMES = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
] as const;

export const DAY_NAMES_SHORT = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const;

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`; /** Format a date as YYYY-MM-DD*/
}

export function formatDateDisplay(date: Date): string {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}:${String(minutes).padStart(2, '0')} ${ampm}`;
}

/** Check if two dates represent the same calendar day */
export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function isSaturday(date: Date): boolean {
  return date.getDay() === 6;
}

export function isSunday(date: Date): boolean {
  return date.getDay() === 0;
}

export interface CalendarDay {
  date: Date;
  dateKey: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isSaturday: boolean;
  isSunday: boolean;
}

function createCalendarDay(date: Date, isCurrentMonth: boolean): CalendarDay {
  return {
    date,
    dateKey: formatDateKey(date),
    day: date.getDate(),
    isCurrentMonth,
    isToday: isToday(date),
    isWeekend: isWeekend(date),
    isSaturday: isSaturday(date),
    isSunday: isSunday(date),
  };
}

export function generateCalendarGrid(
  year: number,
  month: number,
): CalendarDay[] {
  const days: CalendarDay[] = [];
  const firstDayOfWeek = getFirstDayOfMonth(year, month);
  const daysInCurrentMonth = getDaysInMonth(year, month);
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  // Previous month overflow days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    days.push(createCalendarDay(new Date(prevYear, prevMonth, day), false));
  }

  // Current month days
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    days.push(createCalendarDay(new Date(year, month, day), true));
  }

  // Next month overflow (fill only the remaining days needed for full weeks)
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const totalDays = Math.ceil((firstDayOfWeek + daysInCurrentMonth) / 7) * 7;
  const remaining = totalDays - days.length;
  for (let day = 1; day <= remaining; day++) {
    days.push(createCalendarDay(new Date(nextYear, nextMonth, day), false));
  }

  return days;
}

export interface MonthTheme {
  gradient: string;
  accentColor: string;
}

