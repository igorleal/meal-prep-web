import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns'

export { startOfMonth, endOfMonth }

export const formatDate = (date: Date | string, formatStr: string = 'PPP'): string => {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, formatStr)
}

export const formatDateForApi = (date: Date): string => {
  return format(date, 'yyyy-MM-dd')
}

export const getCalendarDays = (date: Date): Date[] => {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 })
  const end = endOfWeek(endOfMonth(date), { weekStartsOn: 1 })
  return eachDayOfInterval({ start, end })
}

export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date())
}

export const isSameMonthAs = (date: Date, monthDate: Date): boolean => {
  return isSameMonth(date, monthDate)
}

export const nextMonth = (date: Date): Date => {
  return addMonths(date, 1)
}

export const prevMonth = (date: Date): Date => {
  return subMonths(date, 1)
}

export const formatDateWithOrdinal = (date: Date | string): string => {
  const d = typeof date === 'string' ? parseISO(date) : date
  const day = d.getDate()
  const month = format(d, 'MMMM')

  const ordinal = (n: number): string => {
    const s = ['th', 'st', 'nd', 'rd']
    const v = n % 100
    return n + (s[(v - 20) % 10] || s[v] || s[0])
  }

  return `${ordinal(day)} of ${month}`
}

export { format, parseISO }
