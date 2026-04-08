export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD (start date)
  endDate?: string; // YYYY-MM-DD (end date for multi-day events)
  time: string; // HH:mm
  color: string;
  description?: string;
  isHoliday?: boolean;
}

export const EVENT_COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Amber', value: '#f59e0b' },
] as const;

export const mockEvents: CalendarEvent[] = [
  { id: '1', title: 'Team Standup', date: '2026-04-07', time: '09:00', color: '#3b82f6', description: 'Daily standup meeting with the dev team' },
  { id: '2', title: 'Design Review', date: '2026-04-07', time: '14:00', color: '#a855f7', description: 'Review new calendar component designs' },
  { id: '3', title: 'Lunch with Sarah', date: '2026-04-09', time: '12:30', color: '#22c55e', description: 'Catch up over lunch at the Italian place' },
  { id: '4', title: 'Sprint Planning', date: '2026-04-13', time: '10:00', color: '#f97316', description: 'Plan tasks for the upcoming sprint' },
  { id: '5', title: 'Code Review', date: '2026-04-15', time: '15:00', color: '#3b82f6', description: 'Review PRs for the calendar feature' },
  { id: '6', title: 'Birthday Party 🎂', date: '2026-04-18', time: '18:00', color: '#ec4899', description: "John's birthday celebration at the park" },
  { id: '7', title: 'Dentist Appointment', date: '2026-04-21', time: '11:00', color: '#ef4444', description: 'Regular checkup' },
  { id: '8', title: 'Workshop: React 19', date: '2026-04-22', time: '13:00', color: '#06b6d4', description: 'Deep dive into new React 19 features' },
  { id: '9', title: 'Morning Gym 💪', date: '2026-04-25', time: '07:00', color: '#22c55e' },
  { id: '10', title: 'Project Deadline 🚀', date: '2026-04-30', time: '23:59', color: '#ef4444', description: 'Final submission for the calendar project' },
  { id: '11', title: 'Coffee Chat ☕', date: '2026-04-09', time: '10:00', color: '#f59e0b', description: 'Coffee with the new intern' },
  { id: '12', title: 'Mid-April Festival', date: '2026-04-15', time: '00:00', color: '#ef4444', isHoliday: true, description: 'Public spring holiday' },
  { id: '13', title: 'Release v2.0', date: '2026-04-22', time: '09:00', color: '#22c55e', description: 'Ship calendar v2 to production' },
  { id: '14', title: 'Yoga Class 🧘', date: '2026-04-25', time: '18:00', color: '#a855f7' },
  // May 2026
  { id: '15', title: 'May Day Holiday 🌸', date: '2026-05-01', time: '00:00', color: '#ef4444', isHoliday: true, description: 'Public holiday' },
  { id: '16', title: 'Client Meeting', date: '2026-05-05', time: '10:00', color: '#a855f7', description: 'Quarterly review with the client' },
  // March 2026
  { id: '17', title: 'Quarter Review', date: '2026-03-28', time: '14:00', color: '#3b82f6', description: 'Q1 performance review' },
  { id: '18', title: 'Team Dinner 🍕', date: '2026-03-30', time: '19:00', color: '#ec4899', description: 'End of quarter celebration dinner' },
];
