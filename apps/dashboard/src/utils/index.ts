import { getDaysInMonth, startOfMonth } from 'date-fns'

export function convertSecToMin(duration: number | null) {
  if (!duration) return 0
  return duration / 60
}

export function roundToNearest5(date = new Date()) {
  const minutes = 5
  const ms = 1000 * 60 * minutes
  return new Date(Math.round(date.getTime() / ms) * ms)
}

export function calculateAge(date: Date) {
  if (!date) {
    return 0
  }
  const now = new Date()
  const diff = Math.abs(now.getTime() - date.getTime())
  const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365))
  return age
}

export function createArrayFromOneToX(X: number): number[] {
  return Array.from({ length: X }, (_, index) => index + 1)
}

export function createDateArrayFromXToY(
  startDate: Date,
  endDate: Date
): Date[] {
  const dateArray: Date[] = []
  let currentDate = new Date(startDate) // Start from X

  // While the current date is less than or equal to the end date Y
  while (currentDate <= endDate) {
    dateArray.push(new Date(currentDate)) // Add current date to the array
    currentDate.setDate(currentDate.getDate() + 1) // Increment the day by 1
  }

  return dateArray
}

export function daysArray(date: Date): number[] {
  return createArrayFromOneToX(getDaysInMonth(date))
}

export function twoDigitFormat(value: number): string {
  const result = '0' + value.toString()
  return result.substring(result.length - 2)
}

export function slugFromDate(date: Date): string {
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${month}-${year}`
}

export function dateFromSlug(slug: string): Date {
  const month = Number(slug.split('-')[0])
  const year = Number(slug.split('-')[1])
  return startOfMonth(new Date(year, month - 1, 1))
}

export function getMonthsArray(start: Date, end: Date): string[] {
  const arr = []
  for (
    const dt = new Date(startOfMonth(start));
    dt <= new Date(startOfMonth(end));
    dt.setMonth(dt.getMonth() + 1)
  ) {
    arr.push(new Date(dt))
  }
  return arr.map((month) => slugFromDate(month))
}

export function dayTitle(number: number) {
  if (number > 10 && [11, 12, 13, 14].includes(number % 100)) return 'дней'
  const last_num = number % 10
  if (last_num == 1) return 'день'
  if ([2, 3, 4].includes(last_num)) return 'дня'
  if ([5, 6, 7, 8, 9, 0].includes(last_num)) return 'дней'
}
