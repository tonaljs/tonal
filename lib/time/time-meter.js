'use strict'

/**
 * Parse a time meter signature
 *
 * The returned time meter object has the following properties:
 * - beats: number of beats per measure (integer)
 * - subdivision: the meter subdivision (4 or 8)
 * - measure: the length (in duration value) of the measure
 *
 * @param {String} meter - the string representing the time meter
 * @return {Object} a time meter object
 */
function timeMeter (repr) {
  repr = repr.split('/')
  var meter = { beats: +repr[0], subdivision: +repr[1] }
  meter.measure = meter.beats / meter.subdivision
  return meter
}

module.exports = timeMeter
