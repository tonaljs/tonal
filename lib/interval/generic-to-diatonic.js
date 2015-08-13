var type = require('./generic-type')

var DIMISHED = { 1: -1, 2: 0, 3: 2, 4: 4, 5: 6, 6: 7, 7: 9, 8: 11 }

/**
 * Given a generic interval and a number of semitones, return the interval
 * (if exists)
 */
function genericToDiationic (generic, semitones) {
  var qualities = type(generic) === 'perfect' ? ['d', 'P', 'A'] : ['d', 'm', 'M', 'A']
  var dir = semitones < 0 ? '-' : ''
  var num = generic + 1
  var quality = qualities[semitones - DIMISHED[num]]
  return quality + dir + num
}
module.exports = genericToDiationic
