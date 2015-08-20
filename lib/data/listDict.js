var toList = require('../list/toList')

/**
 * Create a list dictionary from a hash map data and a name parser
 *
 * A list dictionary is a function that generates lists from keys. It uses
 * a parser to remove the tonic (if present) from the key. Then look up
 * into the hash for a name and pass it to a list generator.
 *
 * If the returned dictionary is called without arguments, a list of all keys
 * is returned
 *
 * If the name is not found in the hash data, it throws an exception
 *
 * The parser should receive one string and return an object with two string
 * properties:
 * - tonic: a note if any, or null
 * - type: (required) the key to lookfor
 *
 * The scale/scale and chord/chord functions uses this to create a generator.
 *
 * @param {Hash} data - the data hash (dictionary)
 * @param {Function} parser - a function that parses the name and returns
 * an object with tonic (if not present) and the name properties
 * @return {Function} the list dictionary
 *
 * @example
 * var listDict = require('tonal/data/listDict')
 * var scale = listDict({'major': 2773})
 * scale('C major') // => ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4']
 * scale('major') // => ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7']
 * // get keys:
 * scale() // => ['major']
 */
function listDict (data, parser) {
  parser = parser || parseName
  var keys = null
  return function (name) {
    if (arguments.length === 0) {
      keys = keys || Object.keys(data).sort()
      return keys
    }
    var parsed = parser(name)
    var listIdentifier = data[parsed.type]
    if (!listIdentifier) throw Error('Name not found: ' + parsed.type)
    return toList(listIdentifier, parsed.tonic)
  }
}

module.exports = listDict

var REGEX = /^([a-gA-G])?\s*(.*)$/
function parseName (name) {
  var m = REGEX.exec(name)
  return m ? { tonic: m[1], type: m[2] } : m
}
