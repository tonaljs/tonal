'use strict'

var parse = require('./parse')
var transpose = require('note-transpose')

/**
 * Get relative of a key
 *
 * @name key.relative
 * @function
 * @param {String} relative - the name of the relative mode desired
 * @param {String} key - the key name
 * @return {String} the relative key name or null if the key or the relative name
 * are not valid
 *
 * @example
 * key.relative('minor', 'C major') // => 'A minor'
 * key.relative('major', 'A minor') // => 'C major'
 * key.relative('dorian', 'F major') // => 'G dorian'
 */
module.exports = function (rel, key) {
  var k = parse(key)
  var r = parse(rel)
  if (!k || !k.tonic || !r) return null
  var major = k.mode === 'major' ? k.tonic : transpose(k.tonic, '-' + k.dist)
  return r.mode === 'major' ? major + ' major' : transpose(major, '' + r.dist) + ' ' + rel
}
