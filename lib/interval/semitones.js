'use strict'

var interval = require('./props')
var prop = require('../internal/prop')
/**
 * @name semitones
 * Get the semitones of a interval
 *
 * @param {String} interval - the interval to get the semitones number from
 * @return {Interger} the semitones or null if not a valid interval
 *
 * @example
 * semitones('5P') // => 7
 */
module.exports = prop(interval, 'semitones')
