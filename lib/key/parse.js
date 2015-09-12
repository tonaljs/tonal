'use strict'

var props = require('../pitch/props')

/**
 * Parse a key name
 *
 * @example
 * parse('C minor') // => { tonic: 'C', type: 'minor'}
 * parse('C#') // => { tonic: 'C#', type: 'major'}
 */
function parse (name) {
  name = name.split(' ')
  var type = (name[1] || '').trim()
  if (type === '') type = 'major'
  else if (type !== 'major' && type !== 'minor') return null
  var pitch = props(name[0])
  if (!pitch) return null
  return { tonic: pitch.pitchClass, type: type }
}

module.exports = parse
