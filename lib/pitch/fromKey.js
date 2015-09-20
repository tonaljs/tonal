'use strict'

var fromMidi = require('./fromMidi')

/**
 * Get the pitch of the given piano key number
 *
 * This method doesn't take into account diatonic spelling. Always the same
 * pitch class is given to the same key number.
 *
 * @param {Integer} key - the key number
 * @return {String} the pitch
 *
 * @see pitch/fromMidi
 *
 * @example
 * fromKey(40) // => 'C4'
 * fromKey(49) // => 'A4'
 */
function fromKey (key) {
  return fromMidi(key + 20)
}

module.exports = fromKey
