/**
 *  Given a valid interval number, return its simplified version
 *
 * @param {Integer} number - the number to be simplified (must be a positive integer)
 * @return {Integer} the simplified number (a number between 1 and 8)
 */
function simplifyNumber (num) {
  if (num < 1) throw Error('Not a valid interval number: ' + num)
  else if (num === 8) return num
  else return ((Math.abs(num) - 1) % 7) + 1
}

module.exports = simplifyNumber
