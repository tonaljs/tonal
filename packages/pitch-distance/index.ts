import { IntervalCoordinates, PitchCoordinates, pitch } from "@tonaljs/pitch";
import {
  IntervalLiteral,
  IntervalName,
  interval as asInterval,
} from "@tonaljs/pitch-interval";
import {
  NoteLiteral,
  NoteName,
  note as asNote,
  coordToNote,
} from "@tonaljs/pitch-note";

/**
 * Transpose a note by an interval.
 *
 * @param {string} note - the note or note name
 * @param {string} interval - the interval or interval name
 * @return {string} the transposed note name or empty string if not valid notes
 * @example
 * import { transpose } from "@tonaljs/core"
 * transpose("d3", "3M") // => "F#3"
 * transpose("D", "3M") // => "F#"
 * ["C", "D", "E", "F", "G"].map(pc => transpose(pc, "M3")) // => ["E", "F#", "G#", "A", "B"]
 */
export function transpose(
  noteName: NoteLiteral,
  intervalName: IntervalLiteral | [number, number],
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
  tonic: string | undefined | null,
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
 * Find the interval distance between two notes or pitch classes.
 *
 * The written letters decide the interval number and its direction, even
 * when the sound goes the other way: C4 to B#3 is "-2d" and B#3 to Cb4 is
 * "2dd". Only a unison takes its direction from the sound: C4 to Cb4 is "-1A".
 *
 * If either note is a pitch class, the distance is between pitch classes:
 * a simple interval, ascending by letter (C# to Dbb is "2dd", C to Cb is "1d").
 *
 * @param {Note|string} from - the note or note name to calculate distance from
 * @param {Note|string} to - the note or note name to calculate distance to
 * @return {string} the interval name or empty string if not valid notes
 *
 */
export function distance(
  fromNote: NoteLiteral,
  toNote: NoteLiteral,
): IntervalName {
  const from = asNote(fromNote);
  const to = asNote(toNote);
  if (from.empty || to.empty) {
    return "";
  }

  const fcoord = from.coord;
  const tcoord = to.coord;
  const fifths = tcoord[0] - fcoord[0];
  const isPitchClass = fcoord.length !== 2 || tcoord.length !== 2;
  // Between pitch classes, choose the octaves that keep the letter steps
  // ascending and within an octave (0 to 6)
  const octs = isPitchClass
    ? -Math.floor((fifths * 4) / 7)
    : tcoord[1] - fcoord[1];

  // A fifth is 4 letter steps and 7 semitones, an octave 7 and 12
  const steps = fifths * 4 + octs * 7;
  const semitones = fifths * 7 + octs * 12;
  const descending =
    !isPitchClass && (steps < 0 || (steps === 0 && semitones < 0));
  const coord: IntervalCoordinates = descending
    ? [-fifths, -octs, -1]
    : [fifths, octs, 1];
  return asInterval(pitch(coord)).name;
}
