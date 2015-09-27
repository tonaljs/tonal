'use strict'

var dictionary = require('../../collection/dictionary')
var data = require('./chords.json')
var aliases = require('./chord-aliases.json')

/**
 * Get the intervals of a chord name
 *
 * @param {String} name - the chord name
 * @return {Array} the intervals or null if not found
 *
 * @example
 * intervals('Cmaj7') // => ['1P', '3M', '5P', '7M']
 */
module.exports = dictionary(data, aliases)
