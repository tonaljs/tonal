'use strict'

var transpose = require('./transpose')

/**
 * Get all the enharmonics of a pitch (up to 4 alterations)
 *
 * @param {String} pitch - the pitch to get the enharmonics from
 * @param {boolean} includeSource - (Optional) If true, the returned array
 * will contain the given pitch. False by default
 * @return {Array} an array of pitches ordered by distance to the given one
 *
 * @example
 * enharmonics('C') // => [ 'A###3', 'B#3', 'Dbb4', 'Ebbbb4' ]
 * enharmonics('Ab3') // => ['E####3', 'F###3', 'G#3', 'Bbbb3', 'Cbbbb4']
 * enharmonics('C', true) // => [ 'A###3', 'B#3', 'C4', 'Dbb4', 'Ebbbb4' ]
 */
function enharmonics (pitch, includePitch) {
  var enharmonics = includePitch ? [ pitch ] : []

  var enharmonic = transpose(pitch, '2d')
  while (enharmonic) {
    enharmonics.push(enharmonic)
    enharmonic = transpose(enharmonic, '2d')
  }
  enharmonic = transpose(pitch, '-2d')
  while (enharmonic) {
    enharmonics.unshift(enharmonic)
    enharmonic = transpose(enharmonic, '-2d')
  }
  return enharmonics
}

module.exports = enharmonics
