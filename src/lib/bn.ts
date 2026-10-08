/** Bengali number, unit and date helpers.
 *
 *  The API returns prices as plain numbers. Convert them to Bengali digits only
 *  when rendering. Never sort or compare the converted strings — challenge C1
 *  requires sorting by numeric value. */

import type { ChangeDir } from './api'

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']

/** 1850 → "১৮৫০" */
export function toBengaliDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => BENGALI_DIGITS[Number(d)])
}

/** 1850 → "১,৮৫০" */
export function formatPrice(value: number): string {
  return toBengaliDigits(value.toLocaleString('en-US'))
}

const UNIT_LABELS: Record<string, string> = {
  kg: 'কেজি',
  litre: 'লিটার',
  liter: 'লিটার',
  dozen: 'ডজন',
  piece: 'পিস',
}

/** "kg" → "কেজি" (falls back to the raw code if the API ever adds a new unit) */
export function unitLabel(unit: string): string {
  return UNIT_LABELS[unit] ?? unit
}

/** "kg" → "প্রতি কেজি" — the unit line on every card */
export function perUnit(unit: string): string {
  return `প্রতি ${unitLabel(unit)}`
}

/** 148, "kg" → "১৪৮ টাকা/কেজি" — used in the price ticker */
export function priceWithUnit(value: number, unit: string): string {
  return `${formatPrice(value)} টাকা/${unitLabel(unit)}`
}

/** up 2.1 → "▲ ২.১%" · down -2.9 → "▼ ২.৯%" · flat 0 → "— ০.০%" */
export function formatChange(dir: ChangeDir, pct: number): string {
  const arrow = dir === 'up' ? '▲' : dir === 'down' ? '▼' : '—'
  return `${arrow} ${toBengaliDigits(Math.abs(pct).toFixed(1))}%`
}

/** "বুধবার, ৮ অক্টোবর, ২০২৬"
 *
 *  Call this inside useEffect in a client component — never during render on
 *  both server and client. The server and the browser can be on different days
 *  and React would report a hydration mismatch. */
export function banglaDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('bn-BD', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
