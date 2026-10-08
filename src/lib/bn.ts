/** Bengali number and date helpers.
 *
 *  Prices are stored as plain numbers in products.json and converted to
 *  Bengali digits only when they are rendered. Never store Bengali digits —
 *  sorting and min/max would then compare strings instead of numbers. */

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']

/** 1850 → "১৮৫০" */
export function toBengaliDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => BENGALI_DIGITS[Number(d)])
}

/** 1850 → "১,৮৫০" */
export function formatPrice(value: number): string {
  return toBengaliDigits(value.toLocaleString('en-US'))
}

/** 1850, "প্রতি কেজি" → "১,৮৫০ টাকা / কেজি" */
export function formatPriceWithUnit(value: number, unit: string): string {
  return `${formatPrice(value)} টাকা / ${unit.replace('প্রতি ', '')}`
}

export type ChangeTone = 'up' | 'down' | 'flat'

export function changeTone(change: number): ChangeTone {
  if (change > 0) return 'up'
  if (change < 0) return 'down'
  return 'flat'
}

/** 2.1 → "▲ ২.১%" · -2.9 → "▼ ২.৯%" · 0 → "— ০.০%" */
export function formatChange(change: number): string {
  const arrow = change > 0 ? '▲' : change < 0 ? '▼' : '—'
  return `${arrow} ${toBengaliDigits(Math.abs(change).toFixed(1))}%`
}

/** "বুধবার, ৮ অক্টোবর ২০২৬"
 *
 *  Call this inside useEffect in a client component, never during render on
 *  both server and client — the server and the browser can be on different
 *  days, and React would report a hydration mismatch. */
export function banglaDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('bn-BD', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
