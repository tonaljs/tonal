var parse = require('./parse')
/**
 * Determine if the given string is a valid note
 *
 * @param {String} string - the string to be tested
 * @return {Boolean} true if is a valid note
 */
function isNote (string) {
  return parse(string) !== null
}

module.exports = isNote
