import { getDaysInMonth } from 'date-fns'

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

export function daysArray(date: Date): number[] {
  return createArrayFromOneToX(getDaysInMonth(date))
}
