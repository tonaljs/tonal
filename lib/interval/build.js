var parse = require('./parse')
/**
 * Create or modify an interval
 *
 * You can create an interval by the interval number, the alteration and octave
 *
 * If instead a interval number, a real interval is provided, the alter and
 * octave values are offsets from the actual value and a copy of the interval
 * is returned
 *
 * @param {String} interval - the interval to be modified
 * @param {Integer} alter - (Optional) the alteration of the new interval, or
 * the alteration change for modified intervals. 0 by default.
 * @param {Integer} octave - (Optional) the octave size of the new interval, or
 * the octave change for modified intervals. 0 by default.
 * @param {Boolean} opposite - (optional) if true, change the direction of the
 * interval num. By default is false
 * @return {String} the created or modified interval
 *
 * @example
 * // number and alteration
 * quality(5, 0) // => 'P5'
 * quality(5, 1) // => 'A5'
 * quality(5, -1) // => 'd5'
 * // number, alteration and octave
 * quality(5, 0, 1) // => 'P12'
 * // modify an interval by an alteration and octave amount
 * quality('P5', 1) // => 'A5'
 * quality('A5', 0) // => 'A5'
 * quality('M3', 1) // => 'A3'
 * quality(3, -1) // => 'A3'
 */
function fromAlter (interval, alter, oct, opposite) {
  alter = alter || 0
  oct = oct || 0
  // TODO: decide what to do
  if (oct < 0) throw Error('Negative octaves not yet implemented')

  var i = isNaN(interval) ? parse(interval) : base(interval)
  var dir = opposite ? -i.dir : i.dir
  alter += i.alter

  return quality(i.perfectable, alter) + dir * (i.num + 7 * oct)
}

function base (interval) {
  if (interval === 0) throw Error('0 is not a valid interval number')
  var num = Math.abs(interval)
  var generic = (num - 1) % 7
  return {
    num: num, alter: 0,
    dir: interval < 0 ? -1 : 1,
    perfectable: generic === 0 || generic === 3 || generic === 4
  }
}

function quality (perfectable, alter) {
  if (perfectable) {
    if (alter > 0) return Array(alter + 1).join('A')
    else if (alter < 0) return Array(-alter + 1).join('d')
    else return 'P'
  } else {
    if (alter > 0) return Array(alter + 1).join('A')
    else if (alter < -1) return Array(-alter).join('d')
    else if (alter === -1) return 'm'
    else return 'M'
  }
}

module.exports = fromAlter
