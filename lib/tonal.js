'use strict'

var toArray = require('./utils/toArray')
var pitch = require('./pitch/props')
var interval = require('./interval/props')

function Tonal (source) {
  if (!(this instanceof Tonal)) return new Tonal(source)

  if (pitch(source) || interval(source)) this.element = source
  else this.array = toArray(source)
}

Tonal.add = function (name, func) {
  Tonal.prototype[name] = function (e) { return this.map(func(e)) }
}

Tonal.prototype.map = function (callback) {
  return this.element ? callback(this.element) : this.array.map(callback)
}

Tonal.add('pitch', require('./pitch/pitch'))
Tonal.add('pitchClass', require('./pitch/pitchClass'))
Tonal.add('octave', require('./pitch/octave'))
Tonal.add('freq', require('./pitch/freq'))
Tonal.add('midi', require('./pitch/midi'))
Tonal.add('transpose', require('./pitch/transpose'))

module.exports = Tonal
