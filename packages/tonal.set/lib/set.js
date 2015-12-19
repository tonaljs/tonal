'use strict'

/**
 * Create a set: a set is a list of uniq pitch classes or simplified intervals
 * in ascending pitch order
 *
 * This is an alias of `gamut.set`
 *
 * @name set
 * @function
 * @param {String|Array} notes - the note list
 * @return {String|Array} the set
 *
 * @example
 * var set = require('music.set/set')
 * set('E7 C2 e D5 c1') // => ['C', 'D', 'E']
 * set('11 10 9') // => [ '2M', '3M', '4P' ]
 */
module.exports = require('music-gamut/set')
