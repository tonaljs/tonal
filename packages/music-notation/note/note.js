'use strict'

var parse = require('./parse')
var str = require('./str')

/**
 * Get a note from a string (or null if not valid note)
 *
 * @name note
 * @function
 * @param {String} src - the source
 * @return {String} the note in scientific notation
 *
 * @example
 * note = require('music-notation/note/note')
 * note('fx2') // => 'F##2'
 * note('bbb') // => 'Bbb'
 * note('blah') // => null
 */
module.exports = function (n) { return str(parse(n)) }
