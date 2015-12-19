// Only to build the API.md file
var tonal = {}

tonal.notation = require('../node_modules/tonal.notation/index')
tonal.pitch = require('../node_modules/tonal.pitch/index')
tonal.transpose = require('../node_modules/tonal.transpose/index')
tonal.distance = require('../node_modules/tonal.distance/index')
tonal.note = require('../node_modules/tonal.note/index')

tonal.gamut = require('../node_modules/tonal.gamut/index')
tonal.set = require('../node_modules/tonal.set/index')
tonal.scale = require('../node_modules/tonal.scale/index')
tonal.chord = require('../node_modules/tonal.chord/index')

tonal.key = require('../node_modules/tonal.key/index')

module.exports = tonal
