var data = require('./chords-all.json')
var dictionary = require('../set/dictionary')

/**
 * A chord set generator
 *
 * Given a chord name returns the intervals or notes
 *
 * @param {String} name - a chord name (with or without tonic)
 * @return {Array} a set (of notes or intervals depending on the name)
 *
 * @see set/dictionary
 *
 * @example
 * chord('C') // => ['C4', 'E4', 'G4']
 * chord('C major') // => []
 */
module.exports = dictionary(data)
