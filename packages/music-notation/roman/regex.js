'use strict'

/**
 * A regex to match roman numbers literals with the from:
 * `[accidentals]roman[element]` where:
 *
 * accidentals: (Optional) one or two flats (b) or shaprs (#)
 * roman: (Required) a roman numeral from I to VII either in upper or lower case
 * element: (Optional) a name of an element
 *
 * @name roman.regex
 *
 * @example
 * var r = require('music-notation/roman/regex')
 * r.exec('bVII')
 * r.exec('IVMaj7')
 * r.exec('ii minor')
 */
module.exports = /^\s*(b|bb|#|##|)(IV|III|II|I|VII|VI|V|iv|iii|ii|i|vii|vi|v)\s*(.*)\s*$/
