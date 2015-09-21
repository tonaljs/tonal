'use strict'
var props = require('./props')

/**
 * Get the key number from a pitch
 *
 * @param {String} pitch - the pitch
 * @return {Integer} the key number
 *
 * @example
 * key(49) // => 'A4'
 */
function key (pitch) {
  pitch = props(pitch)
  return pitch ? pitch.midi - 20 : null
}

module.exports = key
