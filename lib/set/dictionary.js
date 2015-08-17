var set = require('./set')

/**
 * Create a set generator from a hash map data and a name parser
 *
 * A set generator is a function that generates sets from strings. It uses
 * a parser to separate the tonic (if any) from the real name. Then look up
 * into the hash for a name and pass it to a set generator.
 *
 * If the name is not found in the hash data, it throws an exception
 *
 * @param {Hash} data - the data hash (dictionary)
 * @param {Function} parser - a function that parses the name and returns
 * an object with tonic (if not present) and the name properties
 *
 * For different parser implementations:
 * @see scale/parse
 * @see chord/parse
 *
 * @example
 * var scales = dictionary({'major': 2773})
 * scales('C major') // => ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4']
 */
function dictionary (data, parser) {
  parser = parser || parseName
  return function (name) {
    var parsed = parser(name)
    var setIdentifier = data[parsed.type]
    if (!setIdentifier) throw Error('Name not found: ' + parsed.type)
    return set(setIdentifier, parsed.tonic)
  }
}

module.exports = dictionary

var REGEX = /^([a-gA-G])?\s*(.*)$/
function parseName (name) {
  var m = REGEX.exec(name)
  return m ? { tonic: m[1], type: m[2] } : m
}
