'use strict'
var props = require('./props')

/**
 * Return the key number from a pitch
 *
 * @param {String} pitch - the pitch
 * @return {Integer} the key number
 */
function key (pitch) {
  pitch = props(pitch)
  return pitch ? pitch.midi - 20 : null
}

module.exports = key
