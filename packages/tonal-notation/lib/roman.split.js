'use strict'

var R = /^\s*(b|bb|#|##|)(IV|III|II|I|VII|VI|V|iv|iii|ii|i|vii|vi|v)\s*(.*)\s*$/

/**
 * Split a roman numeral string into its parts.
 *
 * Returns an array contains:
 *
 * - 0: the complete string
 * - 1: the accidentals
 * - 2: the roman numeral
 * - 3: the structure name
 *
 * @name roman.split
 * @param {String} source - the string to parse
 * @return {Array} array - the string parts
 *
 * @example
 * split('bVIIMaj9') // => ['bVIIMaj9', 'b', 'VII', 'Maj9']
 */
module.exports = function (s) { return R.exec(s) }
