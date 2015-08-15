var NOTE = /^([a-gA-G])(#{0,2}|b{0,2})(-?[0-9]{0,1})$/

/**
 * Determine if the given string is a valid note
 *
 * @param {String} string - the string to be tested
 * @return {Boolean} true if is a valid note
 */
function isNote (string) {
  return NOTE.test(string)
}

module.exports = isNote
