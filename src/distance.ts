import { note as toNote, NoteName } from './note'
import { interval as toInterval, IntervalName, IntervalProps } from './interval'
import { toPitchProps, FifthsOctaves, Fifths } from './pitch'

/**
 * Transpose a note by an interval. The note can be a pitch class.
 *
 * This function can be partially applied.
 *
 * @param {string} note
 * @param {string} interval
 * @return {string} the transposed note
 * @example
 * import { tranpose } from "@tonaljs/tonal"
 * transpose("d3", "3M") // => "F#3"
 * transpose("D", "3M") // => "F#"
 * ["C", "D", "E", "F", "G"].map(pc => transpose(pc, "M3)) // => ["E", "F#", "G#", "A", "B"]
 */
export function transpose(
  note: NoteName,
  interval: IntervalName
): NoteName | undefined {
  const foNote = toNote(note).fo
  const foInterval = toInterval(interval).fo

  if (foNote && foInterval) {
    const tr: Fifths | FifthsOctaves =
      foNote.length === 1
        ? [foNote[0] + foInterval[0]]
        : [foNote[0] + foInterval[0], foNote[1] + foInterval[1]]
    return toNote(toPitchProps(tr)).name
  }
}

/**
 * @private
 * Transpose a pitch class by a number of perfect fifths.
 *
 * @function
 * @param {string} pitchClass - the pitch class
 * @param {Integer} fifhts - the number of fifths
 * @return {string} the transposed pitch class
 *
 * @example
 * import { transposeFifths } from "@tonaljs/tonal"
 * transposeFifths("G4", 1) // => "D"
 * [0, 1, 2, 3, 4].map(fifths => transposeFifths("C", fifths)) // => ["C", "G", "D", "A", "E"]
 */
export function transposeFifths(
  note: NoteName,
  fifths: number
): NoteName | undefined {
  const foNote = toNote(note).fo
  return foNote && toNote(toPitchProps([foNote[0] + fifths])).name
}

/**
 * Adds two intervals
 *
 * @function
 * @param {string} interval1
 * @param {string} interval2
 * @return {string} the added interval name
 * @example
 * import { add } from "@tonaljs/tonal"
 * add("3m", "5P") // => "7m"
 */
export const add = combineIntervals((a, b) => [a[0] + b[0], a[1] + b[1]])

/**
 * Subtracts two intervals
 *
 * @function
 * @param {string} minuendInterval
 * @param {string} subtrahendInterval
 * @return {string} the substracted interval name
 * @example
 * import { substract } from '@tonaljs/tonal'
 * substract('5P', '3M') // => '3m'
 * substract('3M', '5P') // => '-3m'
 */
export const substract = combineIntervals((a, b) => [a[0] - b[0], a[1] - b[1]])

/**
 * Find the interval distance between two notes or pitch classes.
 *
 * To find distance between pitch classes, both notes must be pitch classes and
 * the interval is always ascending
 *
 * @param {string} fromNote - the note name to calculate distance from
 * @param {string} toNote - the note name to calculate distance to
 * @return {string} the name of the distance interval
 *
 * @example
 * import { distance } from "@tonaljs/tonal"
 * substract('5P', '3M') //=> '3m'
 * substract('3M', '5P') //=> '-3m'
 */
export function distance(
  from: NoteName,
  to: NoteName
): IntervalName | undefined {
  const foFrom = toNote(from).fo
  const foTo = toNote(to).fo

  if (foFrom && foTo) {
    const fo: FifthsOctaves | undefined =
      foFrom.length === 2 && foTo.length === 2
        ? [foTo[0] - foFrom[0], foTo[1] - foFrom[1]]
        : foFrom.length === 1 && foTo.length === 1
        ? [foTo[0] - foFrom[0], -Math.floor(((foTo[0] - foFrom[0]) * 7) / 12)]
        : undefined

    return fo && intervalName(fo)
  }
}

type Combine = (a: FifthsOctaves, b: FifthsOctaves) => FifthsOctaves
function combineIntervals(fn: Combine) {
  return function(a: IntervalName, b: IntervalName): IntervalName | undefined {
    const foA = toInterval(a).fo
    const foB = toInterval(b).fo
    return foA && foB && intervalName(fn(foA, foB))
  }
}

// if the resulting interval is descending, we have to invert fo values
function intervalName(fo: FifthsOctaves) {
  const isDescending = fo[0] * 7 + fo[1] * 12 < 0
  const props = isDescending
    ? toPitchProps([-fo[0], -fo[1]], -1)
    : toPitchProps(fo)
  return toInterval(props).name
}
