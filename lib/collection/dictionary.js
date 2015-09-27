'use strict'

/**
 * A dictionary is a function that, given a name, returns an array of intervals.
 * And given a fileter function it returns all the names filtered by that function.
 *
 * The returned function has the following signature:
 * `fn({String|Function}) -> {Array<Intervals>}` (see examples)
 *
 * @param {HashMap} data - the hashmap data
 * @param {HashMap} aliases - (Optional) the aliases hashmap
 * @return {Function} a dictionary
 *
 * @example
 * chords = dictionary({'Maj7': '1P 3M 5P 7M'}, {'M7': 'Maj7'})
 * chords('Maj7') // => ['1P', '3M', '5P', '7M']
 * chords('M7') // => ['1P', '3M', '5P', '7M']
 * chords(function(c) { return c[1] === '3M' }) // => ['Maj7']
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
