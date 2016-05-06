
import { parse as noteParse } from 'note-parser'
import { parse as ivlParse, altToQ } from 'interval-notation'
import { encode, decode } from 'tonal-encoding'
import { toAcc } from 'tonal-accidentals'
import { isNum, isStr, isArr, toLetter } from 'tonal-notation'

function memoize (fn) {
  var cache = {}
  return function (str) {
    if (!isStr(str)) return null
    return cache[str] || (cache[str] = fn(str))
  }
}

export var parseNote = memoize(function (s) {
  var p = noteParse(s)
  return p ? ['tnl-note', encode(p.step, p.alt, p.oct)] : null
})

export var parseIvl = memoize(function (s) {
  var p = ivlParse(s)
  if (!p) return null
  return p ? ['tnl-ivl', p.dir, encode(p.simple - 1, p.alt, p.oct)] : null
})

export function parsePitch (s) { return parseNote(s) || parseIvl(s) }

export function isNotePitch (p) { return isArr(p) && p[0] === 'tnl-note' }
export function isIvlPitch (p) { return isArr(p) && p[0] === 'tnl-ivl' }
export function isPitch (p) { return isNotePitch(p) || isIvlPitch(p) }

export function asNotePitch (p) { return isNotePitch(p) ? p : parseNote(p) }
export function asIvlPitch (p) { return isIvlPitch(p) ? p : parseIvl(p) }
export function asPitch (p) { return isPitch(p) ? p : parsePitch(p) }

function octStr (n) { return isNum(n) ? n : '' }

export function strNote (p) {
  if (!isNotePitch(p)) return null
  var d = decode.apply(null, p[1])
  return toLetter(d[0]) + toAcc(d[1]) + octStr(d[2])
}

export function strIvl (p) {
  if (!isIvlPitch(p)) return null
  var d = decode.apply(null, p[2])
  var num = d[0] + 1 + 7 * d[2]
  var alt = d[1]
  return p[1] * num + altToQ(num, alt)
}

export function toNoteStr (p) {}
