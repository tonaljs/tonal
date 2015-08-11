'use strict'

var REGEX = /([AdmMP])(-?)(\d+)/
var NAME_TO_DISTANCE = { 'd1': -1, 'P1': 0, 'A1': 1, 'd2': 0, 'm2': 1, 'M2': 2,
  'A2': 3, 'd3': 2, 'm3': 3, 'M3': 4, 'A3': 5, 'd4': 4, 'P4': 5, 'A4': 6,
  'd5': 6, 'P5': 7, 'A5': 8, 'd6': 7, 'm6': 8, 'M6': 9, 'A6': 10, 'd7': 9,
  'm7': 10, 'M7': 11, 'A7': 12, 'd8': 11, 'P8': 12, 'A8': 13 }

/**
 * Parse a interval name and returns an object with interval properties
 *
 * Valid intervals are: 'P5', 'm3', 'd-2', 'P-4', 'M13'...
 *
 * The returned object has the following properties:
 * - name: the full name of the interval
 * - quality: the quality of the interval ('d', 'm', 'P', 'M' or 'A')
 * - number: the __simplified__ number of the interval (always between -9 and 9)
 * - oct: the number of octaves (can be negative)
 * - dist: the distance in semitiones (__whithout octaves__: a number between -12 and 12)
 *
 * If the string is not a interval ('g3') or its a invalid interval ('M5') an
 * exception is thrown.
 *
 * @param {String} name - the name of the interval to be parsed
 * @return {Object} the interval object
 *
 * @example
 * var parse = require('tonal/parse-interval')
 * parse('P-5') // => { name: 'P-5', num: -5, oct: 0, dist: -7 }
 * parse('M9') // => { name: 'M9', num: 2, oct: 1, dist: 2 }
 */
function parseInterval (name) {
  if (name instanceof parseInterval) return name
  if (!(this instanceof parseInterval)) return new parseInterval(name)

  var match = REGEX.exec(name)
  if (!match) throw Error('Not an interval: ' + name)

  this.name = name
  this.quality = match[1]
  this.num = +match[3]
  this.oct = 0
  while (this.num > 8) {
    this.num -= 7
    this.oct++
  }

  this.dist = NAME_TO_DISTANCE[match[1] + this.num]
  if (this.dist === undefined) {
    throw Error('parseInterval not valid: ' + name + ' ' + match[1] + this.num)
  }

  if (match[2] === '-') {
    this.dist *= -1
    this.num *= -1
    this.oct *= -1
  }
}

module.exports = parseInterval
