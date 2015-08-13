var transposeGeneric = require('./transpose-generic')
var transposeChromatic = require('./transpose-chromatic')
var generic = require('./generic')
var semitones = require('./semitones')
var enharmonic = require('../note/enharmonic')

function transposeDiatonic (interval, note) {
  var steps = transposeGeneric(generic(interval), note)
  var chromatic = transposeChromatic(semitones(interval), note)
  return enharmonic(chromatic, steps)
}
module.exports = transposeDiatonic
