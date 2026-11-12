const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000

// Formats a UTC ISO timestamp as IST using fixed lookup tables (not Intl), so
// server (Node) and client (browser) always render identical text regardless
// of each runtime's own timezone or ICU data — avoids hydration mismatches.
function toIST(iso: string) {
  return new Date(new Date(iso).getTime() + IST_OFFSET_MS)
}

export function formatDateLabel(iso: string) {
  const d = toIST(iso)
  return `${WEEKDAYS[d.getUTCDay()]}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`
}

export function formatShortDate(iso: string) {
  const d = toIST(iso)
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

export function formatTimeLabel(iso: string) {
  const d = toIST(iso)
  const hours24 = d.getUTCHours()
  const minutes = d.getUTCMinutes().toString().padStart(2, '0')
  const period = hours24 >= 12 ? 'PM' : 'AM'
  const hours12 = hours24 % 12 || 12
  return `${hours12}:${minutes} ${period}`
}
