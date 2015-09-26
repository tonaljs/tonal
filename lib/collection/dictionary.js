'use strict'

/**
 * Create a dictionary from a hashmap. A dictionary is a function that given a
 * key returns an array of intervals
 *
 * @param {HashMap} data - the hashmap data
 * @param {HashMap} aliases - (Optional) the aliases hashmap
 * @return {Array} an array of intervals
 *
 * @example
 * chords = dictionary({'Maj7': '1P 3M 5P 7M'}, {'M7': 'Maj7'})
 * chords('Maj7') // => ['1P', '3M', '5P', '7M']
 * chords('M7') // => ['1P', '3M', '5P', '7M']
 */
function dictionary (data, aliases) {
  var keys = Object.keys(data)
  var dict = {}
  keys.forEach(function (key) {
    var value = data[key]
    dict[key] = (typeof value === 'string') ? value.split(' ') : value
  })

  return function (name) {
    if (typeof name === 'function') {
      return filter(keys, dict, name)
    } else {
      return (dict[name] || dict[aliases[name]])
    }
  }
}

function filter (keys, data, fn) {
  var filtered = []
  keys.forEach(function (key) {
    if (fn(data[key])) filtered.push(key)
  })
  return filtered
}

module.exports = dictionary
