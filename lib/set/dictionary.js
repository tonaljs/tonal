var set = require('./set')

var REGEX = /^([a-gA-G])?\s*(.*)$/
/**
 * Create a set generator from a hash map
 *
 * A set generator is a function that generates sets from strings
 */
function dictionary (hash) {
  return function (repr) {
    var match = REGEX.exec(repr)
    var identifier = hash[match[2]]
    if (!identifier) throw Error('Name not found: ' + match[2])
    return set(identifier, match[1])
  }
}

module.exports = dictionary
