var parse = require('./parse')  
/**
 * Parses an interval and throws an exception if is not valid
 *
 * Is the same as `interval/parse` but with exceptions
 *
 * @see interval/parse
 */
function parseStrict(interval) {
  var i = parse(interval)
  if (!i) throw Error('Not valid interval: ' + interval)
  else return i
}

module.exports = parseStrict
