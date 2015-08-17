var noteParse = require('../note/parse')
/**
 * Parse a chord name and returns the tonic (if any) and the chord type
 */
function parse (chord) {
  var tonic = null
  var type = chord.trim()
  try {
    tonic = noteParse(type, true).note
    type = type.substring(tonic.length).trim()
  } catch (e) {}
  return { tonic: tonic, type: type }
}

module.exports = parse
