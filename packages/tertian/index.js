/**
 * This module implements functions related to tertians, chords constructed
 * from the intervals of (major and minor) thirds.
 *
 * This is an experimental module and is not published
 *
 * @private
 * @module tertian
 */
import { permutations } from 'tonal-array'
import { transpose } from 'tonal-transpose'

/**
 * Given a tertian structure, return the intervals
 * The structure is a string like 'mmM' where 'm' denotes a minor third
 * and 'M' a major one.
 * @private
 * @param {String} structure - the tertian structure
 * @return {Array<String>} an array of intervals
 * @example
 * tertian.intervals('Mmm') // => [ '1P', '3M', '5P', '7m' ]
 */
export function intervals (st) {
  var inner = st.split('').map((t) => t === 'm' ? '3m' : '3M')
  return inner.reduce(function (ivls, v) {
    ivls.push(transpose(v, ivls[ivls.length - 1]))
    return ivls
  }, ['1P'])
}

export function allFor (st) {
  return sortedSet(permutations(st.split('')).map((s) => s.join('')))
}

function sortedSet (arr) {
  return arr.sort().filter(function (v, i) {
    return i === 0 || v !== arr[i - 1]
  })
}
