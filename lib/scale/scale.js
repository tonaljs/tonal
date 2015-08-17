var data = require('./scales-all.json')
var generator = require('../data/set-generator')
var parse = require('./parse')

/**
 * A scale set generator
 *
 * Given a scale name returns the intervals or notes
 *
 * @param {String} name - a scale name (with or without tonic)
 * @return {Array} a set (of notes or intervals depending on the name)
 *
 * @see set/generator
 *
 * @example
 * scale('major') // => []
 * scale('C major') // => []
 */
module.exports = generator(data, parse)
