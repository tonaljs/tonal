var data = require('./scales-min.json')
var dictionary = require('../set/dictionary')

/**
 * A scale set generator
 *
 * Given a scale name returns the intervals or notes
 *
 * @param {String} name - a scale name (with or without tonic)
 * @return {Array} a set (of notes or intervals depending on the name)
 *
 * @see set/dictionary
 *
 * @example
 * scale('major') // => []
 * scale('C major') // => []
 */
module.exports = dictionary(data)
