'use strict'

var parse = require('array-notation/pitch/parse')
var str = require('array-notation/pitch/str')

/**
 * A gamut is a collection of intervals, pitch classes or notes.
 * Scales, chords, pitch sets are examples of gamuts.
 *
 * @name gamut
 * @param {String|Array} source - a list of elements
 * @return {Array} a list of pitches
 *
 * @example
 * var gamut = require('music-gamut')
 * gamut('c2 bb fx blah') // => ['C2', 'Bb', 'F##', null]
 */
function gamut (g) {
  return gamut.split(g).map(function (e) { return str(parse(e)) })
}

gamut.set = require('./set')
gamut.scale = require('./scale')
gamut.chord = require('./chord')
gamut.sort = require('./sort')
gamut.harmonics = require('./harmonics')
gamut.operation = require('./operation')
gamut.split = require('./split')
gamut.rotate = require('./rotate')
gamut.select = require('./select')

if (typeof module === 'object' && module.exports) module.exports = gamut
if (typeof window !== 'undefined') window.gamut = gamut
