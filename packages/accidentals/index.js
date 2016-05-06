export function areFlats (s) { return /^b+$/.test(s) }
export function areSharps (s) { return /^#+$/.test(s) }

export function toAlt (s) {
  return s === '' ? 0
    : areFlats(s) ? -s.length
    : areSharps(s) ? s.length
    : null
}

function fillStr (s, num) { return Array(num + 1).join(s) }

export function toAcc (n) {
  return n < 0 ? fillStr('b', Math.abs(n)) : fillStr('#', n)
}
