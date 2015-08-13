var transposeGeneric = require('./transpose-generic')
var transposeChromatic = require('./transpose-chromatic')
var simpleNumber = require('./simple-number')
var semitones = require('./semitones')
var enharmonic = require('../note/enharmonic')

function transposeDiatonic (interval, note) {
  var steps = transposeGeneric(simpleNumber(interval), note)
  var chromatic = transposeChromatic(semitones(interval), note)
  return enharmonic(chromatic, steps)
}
module.exports = transposeDiatonic
