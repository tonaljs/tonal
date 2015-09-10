var REGEX = /^\s*([a-gA-G])(#{1,4}|b{1,4}|x{1,2}|)(.*)$/
/**
 * Parse a chord name and returns the tonic (if any) and the chord type
 *
 * The returned object has the properties:
 * - tonic: the tonic note or null if not specified
 * - type: the chord type
 *
 * @param {String} chord - the chord string to be parsed
 * @return {Object} the chord object
 *
 * @example
 * parse('C#major') // => { tonic: 'C#', type: 'major' }
 * parse('minor') // => { tonic: null, type: 'minor' }
 */
function parse (chord) {
  var m = REGEX.exec(chord)
  if (m) return { tonic: m[1] + m[2], type: m[3].trim() }
  else return { tonic: null, type: chord.trim() }
}

module.exports = parse
