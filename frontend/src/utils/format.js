// frontend/src/utils/format.js
export function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' })
}

export function initials(name = '') {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
}

export function truncate(str = '', n = 60) {
  return str.length > n ? str.slice(0, n) + '…' : str
}
