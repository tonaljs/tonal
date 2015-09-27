'use strict'

/**
 * Get a dictionary from a hash map of { name -> intervals }. A dictionary
 * is a function that returns arrays of intervals given a name
 *
 * The returned function has the following signature:
 * `fn([tonic, ]name)` (see examples)
 *
 *
 * @param {HashMap} data - the hashmap data
 * @param {HashMap} aliases - (Optional) the aliases hashmap
 * @return {Function} a dictionary
 *
 * @example
 * chords = dictionary({'Maj7': '1P 3M 5P 7M'}, {'M7': 'Maj7'})
 * chords('Maj7') // => ['1P', '3M', '5P', '7M']
 * chords('M7') // => ['1P', '3M', '5P', '7M']
 */
function dictionary (data, aliasesData) {
  var names = Object.keys(data)
  var byNames = names.reduce(function (hash, name) {
    var value = data[name]
    hash[name] = (typeof value === 'string') ? value.split(' ') : value
    return hash
  }, {})
  var byAlias = aliasesData

  var get = function (name) {
    return byNames[name] || byNames[byAlias[name]]
  }

  var filter = function (fn) {
    var filtered = []
    names.forEach(function (name) {
      if (fn(byNames[name])) filtered.push(name)
    })
    return filtered
  }

  return function (name) {
    if (typeof name === 'function') return filter(name)
    else return get(name)
  }
}

module.exports = dictionary
