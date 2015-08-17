var data = require('./chords-all.json')
var generator = require('../data/set-generator')
var parse = require('./parse')

/**
 * A chord set generator
 *
 * Given a chord name returns the intervals or notes
 *
 * @param {String} name - a chord name (with or without tonic)
 * @return {Array} a set (of notes or intervals depending on the name)
 *
 * @see set/generator
 *
 * @example
 * chord('M') // => ['P1', 'M3', 'P5']
 * chord('C7') // => ['C4', 'E4', 'G4', 'B4']
 */
module.exports = generator(data, parse)
