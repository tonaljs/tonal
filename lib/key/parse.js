'use strict'

var pitchClass = require('../pitch/pitchClass')

/**
 * Get the components of a key name
 *
 * @example
 * pitchClass('C minor') // => { tonic: 'C', type: 'minor'}
 * pitchClass('C#') // => { tonic: 'C#', type: 'major'}
 */
function parseKey (name) {
  name = name.split(' ')
  var type = (name[1] || '').trim()
  if (type === '') type = 'major'
  else if (type !== 'major' && type !== 'minor') return null
  var pc = pitchClass(name[0])
  if (!pc) return null
  return { tonic: pc, type: type }
}

module.exports = parseKey
