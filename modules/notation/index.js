
export var isArr = Array.isArray
export function isNum (x) { return typeof x === 'number' }
export function isStr (x) { return typeof x === 'string' }

// NOTE LETTERS
// ============

// Given a letter, return step
export function toStep (l) {
  var s = 'CDEFGAB'.indexOf(l.toUpperCase())
  return s < 0 ? null : s
}

/**
 * Is a valid step number
 */
export function isStep (d) { return !(d < 0 || d > 6) }

/**
 * Given a step, return a letter
 */
export function toLetter (s) {
  return isStep(s) ? 'CDEFGAB'.charAt(s) : null
}

// ACCIDENTALS
// ===========

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
  return n === 0 ? ''
    : n < 0 ? fillStr('b', -n)
    : fillStr('#', n)
}
