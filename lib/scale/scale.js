var data = require('./scales-all.json')
var dictionary = require('../data/listDict')
var parse = require('./parse')

/**
 * A scale dictionary
 *
 * Given a scale name, returns the intervals or notes
 *
 * @param {String} name - a scale name (with or without tonic)
 * @return {Array} a list (of notes or intervals depending on the name)
 *
 * @see list/dictionary
 *
 * @example
 * scale('major') // => []
 * scale('C major') // => []
 */
module.exports = dictionary(data, parse)
