import {
  coordToInterval,
  interval as asInterval,
  IntervalLiteral,
  IntervalName,
} from "./interval";
import { coordToNote, note as asNote, NoteLiteral, NoteName } from "./note";
import { PitchCoordinates } from "./pitch";

/**
 * Transpose a note by an interval.
 *
 * @param {string} note - the note or note name
 * @param {string} interval - the interval or interval name
 * @return {string} the transposed note name or empty string if not valid notes
 * @example
 * import { tranpose } from "@tonaljs/core"
 * transpose("d3", "3M") // => "F#3"
 * transpose("D", "3M") // => "F#"
 * ["C", "D", "E", "F", "G"].map(pc => transpose(pc, "M3)) // => ["E", "F#", "G#", "A", "B"]
 */
export function transpose(
  noteName: NoteLiteral,
  intervalName: IntervalLiteral | [number, number]
): NoteName {
  const note = asNote(noteName);
  const intervalCoord = Array.isArray(intervalName)
    ? intervalName
    : asInterval(intervalName).coord;
  if (note.empty || !intervalCoord || intervalCoord.length < 2) {
    return "";
  }
  const noteCoord = note.coord;
  const tr: PitchCoordinates =
    noteCoord.length === 1
      ? [noteCoord[0] + intervalCoord[0]]
      : [noteCoord[0] + intervalCoord[0], noteCoord[1] + intervalCoord[1]];
  return coordToNote(tr).name;
}

// Private
export function tonicIntervalsTransposer(
  intervals: string[],
  tonic: string | undefined | null
) {
  const len = intervals.length;
  return (normalized: number) => {
    if (!tonic) return "";
    const index =
      normalized < 0 ? (len - (-normalized % len)) % len : normalized % len;
    const octaves = Math.floor(normalized / len);
    const root = transpose(tonic, [0, octaves]);
    return transpose(root, intervals[index]);
  };
}

/**
 * Find the interval distance between two notes or coord classes.
 *
 * To find distance between coord classes, both notes must be coord classes and
 * the interval is always ascending
 *
 * @param {Note|string} from - the note or note name to calculate distance from
 * @param {Note|string} to - the note or note name to calculate distance to
 * @return {string} the interval name or empty string if not valid notes
 *
 */
export function distance(
  fromNote: NoteLiteral,
  toNote: NoteLiteral
): IntervalName {
  const from = asNote(fromNote);
  const to = asNote(toNote);
  if (from.empty || to.empty) {
    return "";
  }

  const fcoord = from.coord;
  const tcoord = to.coord;
  const fifths = tcoord[0] - fcoord[0];
  const octs =
    fcoord.length === 2 && tcoord.length === 2
      ? tcoord[1] - fcoord[1]
      : -Math.floor((fifths * 7) / 12);

  // If it's unison and not pitch class, it can be descending interval (#243)
  const forceDescending =
    to.height === from.height &&
    to.midi !== null &&
    from.midi !== null &&
    from.step > to.step;
  return coordToInterval([fifths, octs], forceDescending).name;
}
