var data = require('./chords-all.json')
var dictionary = require('../list/dictionary')
var parse = require('./parse')

/**
 * Create a list from a chord name
 *
 * If the chord name contains the tonic, a note list is returned. If only the
 * chord type is given, you get an interval list.
 *
 * @param {String} name - a chord name (with or without tonic)
 * @return {Array} a list (of notes or intervals depending on the name)
 *
 * @name chord
 * @module chord
 * @see list/dictionary
 *
 * @example
 * chord('M') // => ['P1', 'M3', 'P5']
 * chord('C7') // => ['C4', 'E4', 'G4', 'B4']
 */
module.exports = dictionary(data, parse)
