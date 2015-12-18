
var tonal = {}

tonal.notation = require('tonal.notation')
tonal.pitch = require('tonal.pitch')
tonal.transpose = require('tonal.transpose')
tonal.distance = require('tonal.distance')
tonal.note = require('tonal.note')

tonal.gamut = require('tonal.gamut')
tonal.set = require('tonal.set')
tonal.scale = require('tonal.scale')
tonal.chord = require('tonal.chord')

tonal.key = require('tonal.key')

if (typeof module === 'object' && module.exports) module.exports = tonal
if (typeof window !== 'undefined') window.tonal = tonal
