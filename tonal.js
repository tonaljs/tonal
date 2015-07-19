'use strict'

function newCache (values) {
  return function (id, generator) {
    if (!id) return null
    return values[id] || (values[id] = generator())
  }
}

var Tonal = {}
Tonal.interval = require('musical-interval')
Tonal.note = require('musical-note')
Tonal.keySignature = require('./key-signature.js')

Tonal.Scale = require('binary-scale')
Tonal.ScaleNames = require('scale-names')
Tonal.ScaleNames.load(require('scale-names/all.json'))

var allScales = []
Tonal.Scale.all = function () {
  if (allScales.length === 0) {
    for (var i = Tonal.Scale.MIN; i < Tonal.Scale.MAX; i++) {
      allScales.push(Tonal.scale(i))
    }
  }
  return allScales
}
Tonal.Scale.prototype.names = function () {
  return Tonal.ScaleNames.get(this.decimal)
}
var scalesCache = newCache({})
Tonal.scale = function (identifier) {
  return scalesCache(identifier, function () {
    try {
      return new Tonal.Scale(identifier)
    } catch (e) {
      var num = Tonal.ScaleNames.getDecimal(identifier) || parseInt(identifier, 2)
      return num ? new Tonal.Scale(num) : null
    }
  })
}
module.exports = Tonal
