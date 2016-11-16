'use strict'

var assign = Object.assign
var tonal = {}

assign(tonal, require('tonal-array'))
assign(tonal, require('tonal-transpose'))
assign(tonal, require('tonal-distance'))

tonal.note = require('tonal-note')
tonal.ivl = require('tonal-interval')
tonal.midi = require('tonal-midi')
tonal.freq = require('tonal-freq')
tonal.range = require('tonal-range')

tonal.scale = function (name) { return tonal.scale.get(name) }
assign(tonal.scale, require('tonal-scale'))
tonal.chord = function (name) { return tonal.chord.get(name) }
assign(tonal.chord, require('tonal-chord'))

tonal.pitch = require('tonal-pitch')
tonal.notation = require('tonal-notation')
tonal.progression = require('tonal-progression')
tonal.sonority = require('tonal-sonority')

if (typeof module === 'object' && module.exports) module.exports = tonal
if (typeof window !== 'undefined') window.Tonal = tonal
