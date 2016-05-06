
import { parse as noteParse } from 'note-parser'
import { parse as ivlParse, altToQ } from 'interval-notation'
import { encode, decode } from 'tonal-encoding'
import { isNum, isStr, isArr, toLetter, toAcc } from 'tonal-notation'

// internal: memoize parser
function memoize (fn) {
  var cache = {}
  return function (str) {
    if (!isStr(str)) return null
    return cache[str] || (cache[str] = fn(str))
  }
}

export function build (step, alt, oct, dir) {
  var enc = encode(step, alt, oct)
  return dir ? ['tnlp', enc, dir] : ['tnlp', enc]
}
export function isPitch (p) { return isArr(p) && p[0] === 'tnlp' }
export function pType (p) {
  return !isPitch(p) ? null
    : p[2] ? 'ivl' : 'note'
}
export function isNotePitch (p) { return pType(p) === 'note' }
export function isIvlPitch (p) { return pType(p) === 'ivl' }
export function isPC (p) { return isPitch(p) && p[1].length === 1 }

// low level functions. Warning! No checks!
export function fifths (p) { return p[2] === -1 ? -p[1][0] : p[1][0] }
export function focts (p) { return p[2] === -1 ? -p[1][1] : p[1][1] }
export function height (p) { return fifths(p) * 7 + focts(p) * 12 }

export var parseNote = memoize(function (s) {
  var p = noteParse(s)
  return p ? build(p.step, p.alt, p.oct) : null
})

export var parseIvl = memoize(function (s) {
  var p = ivlParse(s)
  if (!p) return null
  return p ? build(p.simple - 1, p.alt, p.oct, p.dir) : null
})

export function parsePitch (s) { return parseNote(s) || parseIvl(s) }

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
  var d = decode.apply(null, p[1])
  var num = d[0] + 1 + 7 * d[2]
  var alt = d[1]
  return p[2] * num + altToQ(num, alt)
}

export function strPitch (p) { return strNote(p) || strIvl(p) }

function decorator (is, parse, str) {
  return function (fn) {
    return function (v) {
      var i = is(v)
      // if the value is in pitch notation no conversion
      if (i) return fn(v)
      // else parse the pitch
      var p = parse(v)
      // if parsed, apply function and back to string
      return p ? str(fn(p)) : null
    }
  }
}

export var noteFn = decorator(isNotePitch, parseNote, strNote)
export var ivlFn = decorator(isIvlPitch, parseIvl, strIvl)
export var pitchFn = decorator(isPitch, parsePitch, strPitch)
