export const WEEK_DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'] as const;

export type WeekDay = (typeof WEEK_DAYS)[number];
