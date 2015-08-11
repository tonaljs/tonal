'use strict'

var cycle = require('./cycle-of-fifths')

/**
 * Given a key signature, get key signature information
 *
 * The key signature can be expressed in several ways:
 * - with number: 2 means 'two sharps', -2 means 'two flats'
 * - with accidentals: '##' or 'bb'
 * - with major tonic: for example, 'C'
 *
 * The key signature object has the following properties:
 * - num: the key signature number
 * - acc: the key signature accidentals
 * - major: the note name of the major tonality associated to this key signature
 * - minor: the note name of the minor tonality associated to this key signature
 *
 * @param {Integer|String} signature - the key signature expressen in number,
 * accidentals, or major tonic
 * @return {Object} an object with the key signature information
 */
function keySignature (signature) {
  if (signature instanceof keySignature) return signature
  if (!(this instanceof keySignature)) return new keySignature(signature)

  var index
  if (/^-?\d$/.test(signature)) {
    this.num = +signature
  } else if (/^\#*$/.test(signature)) {
    this.num = signature.length
  } else if (/^b+$/.test(signature)) {
    this.num = -1 * signature.length
  } else if ((index = cycle(signature)) !== undefined) {
    this.num = index
  } else {
    throw Error('Invalid key signature: ' + signature)
  }
  this.alt = this.num < 0 ? Array(-this.num + 1).join('b') : Array(this.num + 1).join('#')
  this.major = cycle(this.num)
  this.minor = cycle(this.num + 3)
}

module.exports = keySignature
