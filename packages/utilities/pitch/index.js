/**
 * Functions to deal with pitches (either notes or intervals).
 *
 * This functions are very low level and more developer friendly of this functions
 * are exposed in the note and interval packages. It's unlikely you need them.
 * That's why __this module is NOT exported in the tonal package__.
 *
 * @private
 * @module pitch
 */
import { parse as noteParse, build as noteStr } from 'note-parser'
import { parse as ivlParse, altToQ } from 'interval-notation'
import { encode as enc, decode as dec } from 'tonal-encoding'

/**
 * Create a pitch
 * @param {Integer} fifths - the number of fifths from C or from P1
 * @param {Integer} focts - the number of encoded octaves
 * @param {Integer} dir - (Optional) Only required for intervals. Can be 1 or -1
 * @return {Pitch}
 */
export function pitch (fifths, focts, dir) {
  return dir ? ['tnlp', [fifths, focts], dir] : ['tnlp', [fifths, focts]]
}
/**
 * Test if an object is a pitch
 * @param {Pitch}
 * @return {Boolean}
 */
export function isPitch (p) { return Array.isArray(p) && p[0] === 'tnlp' }
/**
 * Encode a pitch
 * @param {Integer} step
 * @param {Integer} alt
 * @param {Integer} oct
 * @param {Integer} dir - (Optional)
 */
export function encode (s, a, o, dir) {
  return dir ? ['tnlp', enc(s, a, o), dir] : ['tnlp', enc(s, a, o)]
}

/**
 * Decode a pitch
 * @param {Pitch} the pitch
 * @return {Array} An array with [step, alt, oct]
 */
export function decode (p) {
  return dec.apply(null, p[1])
}

/**
 * Get pitch type
 * @param {Pitch}
 * @return {String} 'ivl' or 'note' or null if not a pitch
 */
export function pType (p) {
  return !isPitch(p) ? null : p[2] ? 'ivl' : 'note'
}
/**
 * Test if is a pitch note (with or without octave)
 * @param {Pitch}
 * @return {Boolean}
 */
export function isNotePitch (p) { return pType(p) === 'note' }
/**
 * Test if is an interval
 * @param {Pitch}
 * @return {Boolean}
 */
export function isIvlPitch (p) { return pType(p) === 'ivl' }
/**
 * Test if is a pitch class (a pitch note without octave)
 * @param {Pitch}
 * @return {Boolean}
 */
export function isPC (p) { return isPitch(p) && p[1].length === 1 }

/**
 * Get direction of a pitch (even for notes)
 * @param {Pitch}
 * @return {Integer} 1 or -1
 */
export function dir (p) { return p[2] === -1 ? -1 : 1 }

/**
 * Get encoded fifths from pitch.
 * @param {Pitch}
 * @return {Integer}
 */
export function fifths (p) { return p[2] === -1 ? -p[1][0] : p[1][0] }
/**
 * Get encoded octaves from pitch.
 * @param {Pitch}
 * @return {Integer}
 */
export function focts (p) { return p[2] === -1 ? -p[1][1] : p[1][1] }
/**
 * Get height of a pitch.
 * @param {Pitch}
 * @return {Integer}
 */
export function height (p) { return fifths(p) * 7 + focts(p) * 12 }

/**
 * Get chroma of a pitch. The chroma is a number between 0 and 11 to represent
 * the position of a pitch inside an octave. Is the numeric equivlent of a
 * pitch class.
 *
 * @param {Pitch}
 * @return {Integer}
 */
export function chr (p) {
  var f = fifths(p)
  return 7 * f - 12 * Math.floor(f * 7 / 12)
}

// memoize parsers
function memoize (fn) {
  var cache = {}
  return function (str) {
    if (typeof str !== 'string') return null
    return cache[str] || (cache[str] = fn(str))
  }
}

/**
 * Parse a note
 * @function
 * @param {String} str
 * @return {Pitch} the pitch or null if not valid note string
 */
export var parseNote = memoize(function (s) {
  var p = noteParse(s)
  return p ? encode(p.step, p.alt, p.oct) : null
})

/**
 * Parse an interval
 * @function
 * @param {String} str
 * @return {Pitch} the pitch or null if not valid interval string
 */
export var parseIvl = memoize(function (s) {
  var p = ivlParse(s)
  if (!p) return null
  return p ? encode(p.simple - 1, p.alt, p.oct, p.dir) : null
})

/**
 * Parse a note or an interval
 * @param {String} str
 * @return {Pitch} the pitch or null if not valid pitch string
 */
export function parsePitch (s) { return parseNote(s) || parseIvl(s) }

/**
 * Ensure the given object is a note pitch. If is a string, it will be
 * parsed. If not a note pitch or valid note string, it returns null.
 * @param {Pitch|String}
 * @return {Pitch}
 */
export function asNotePitch (p) { return isNotePitch(p) ? p : parseNote(p) }
/**
 * Ensure the given object is a interval pitch. If is a string, it will be
 * parsed. If not a interval pitch or valid interval string, it returns null.
 * @param {Pitch|String}
 * @return {Pitch}
 */
export function asIvlPitch (p) { return isIvlPitch(p) ? p : parseIvl(p) }
/**
 * Ensure the given object is a pitch. If is a string, it will be
 * parsed. If not a pitch or valid pitch string, it returns null.
 * @param {Pitch|String}
 * @return {Pitch}
 */
export function asPitch (p) { return isPitch(p) ? p : parsePitch(p) }

/**
 * Convert a note pitch to string representation
 * @param {Pitch}
 * @return {String}
 */
export function strNote (p) {
  if (!isNotePitch(p)) return null
  return noteStr.apply(null, decode(p))
}

/**
 * Convert a interval pitch to string representation
 * @param {Pitch}
 * @return {String}
 */
export function strIvl (p) {
  if (!isIvlPitch(p)) return null
  // decode to [step, alt, oct]
  var d = decode(p)
  // d = [step, alt, oct]
  var num = d[0] + 1 + 7 * d[2]
  return p[2] * num + altToQ(num, d[1])
}

/**
 * Convert a pitch to string representation (either notes or intervals)
 * @param {Pitch}
 * @return {String}
 */
export function strPitch (p) { return strNote(p) || strIvl(p) }

// A function that creates a decorator
// The returned function can _decorate_ other functions to parse and build
// string representations
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

/**
 * Decorate a function to work internally with note pitches, even if the
 * parameters are provided as strings. Also it converts back the result
 * to string if a note pitch is returned.
 * @function
 * @param {Function} fn
 * @return {Function} the decorated function
 */
export var noteFn = decorator(isNotePitch, parseNote, strNote)
/**
 * Decorate a function to work internally with interval pitches, even if the
 * parameters are provided as strings. Also it converts back the result
 * to string if a interval pitch is returned.
 * @function
 * @param {Function} fn
 * @return {Function} the decorated function
 */
export var ivlFn = decorator(isIvlPitch, parseIvl, strIvl)
/**
 * Decorate a function to work internally with pitches, even if the
 * parameters are provided as strings. Also it converts back the result
 * to string if a pitch is returned.
 * @function
 * @param {Function} fn
 * @return {Function} the decorated function
 */
export var pitchFn = decorator(isPitch, parsePitch, strPitch)
