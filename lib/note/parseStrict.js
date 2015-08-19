var parse = require('./parse')
/**
 * Parse a string and throws exception if its not valid note
 *
 * This method is exactly the same as `note/parse` but with
 * exceptions
 *
 * @see note/parse
 */
function parseStrict(note) {
  var n = parse(note)
  if (!n) throw Error('Not valid note: ' + note)
  else return n
}

module.exports = parseStrict
