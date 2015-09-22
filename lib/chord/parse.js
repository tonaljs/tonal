var REGEX = /^\s*([A-G])(#{1,4}|b{1,4}|x{1,2}|)(.*)$/
/**
 * Get the components of a chord name
 *
 * The returned object has the properties:
 *
 * - __tonic__: the tonic note (__must be uppercase__) or null if not specified
 * - __type__: the chord type
 *
 * @param {String} chord - the chord string to be parsed
 * @return {Object} the chord object
 *
 * @example
 * parse('C#Maj7') // => { tonic: 'C#', type: 'Maj7' }
 * parse('7b5') // => { tonic: null, type: '7b5' }
 * parse('c#Maj7') // => { tonic: null, type: 'c#Maj7' }
 * parse('add9') // => { tonic: null, type: 'add9'}
 */
function parse (chord) {
  var m = REGEX.exec(chord)
  if (m) return { tonic: m[1] + m[2], type: m[3].trim() }
  else return { tonic: null, type: chord.trim() }
}

module.exports = parse
