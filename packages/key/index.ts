import { range } from "tonal-array";
import { mode as toMode, ModeValid } from "tonal-mode";
import { altToAcc, transposeFifths } from "tonal-note";
import { intervals as getIntervals } from "tonal-pcset";

import {
  IntervalName,
  note,
  NoteName,
  tokenizeNote,
  transpose
} from "../tonal";

interface Key extends ModeValid {
  name: string;
  tonic: string;
  modeName: string;
  modeNum: number;
  alt: number;
  acc: string;
  alteredNotes: NoteName[];
  intervals: IntervalName[];
  scale: NoteName[];
}

export function key(keyName: string): Key | null {
  const [tonic, type] = tokenize(keyName);
  const m = toMode(type);
  const t = note(tonic);
  if (!m.valid || !t.valid) {
    return null;
  }

  const name = tonic + " " + type;
  const { modeNum, pcset, aliases } = m;
  const triad = tonic + m.triad;
  const seventh = tonic + m.seventh;
  const modeName = m.name;
  const alt = t.coord[0] - m.alt;
  const acc = altToAcc(alt);
  const alteredNotes = getAlteredNotes(alt);
  const intervals: IntervalName[] = getIntervals(pcset);
  const scale: NoteName[] = intervals.map(i => transpose(tonic, i));

  return {
    valid: true,
    name,
    tonic,
    modeName,
    pcset,
    modeNum,
    triad,
    seventh,
    alt,
    acc,
    alteredNotes,
    intervals,
    scale,
    aliases
  };
}

/**
 * Split the key name into its components (pitch class tonic and mode name)
 *
 * @function
 * @param {string} name
 * @return {Array} an array in the form [tonic, key]
 *
 * @example
 * Key.tokenize("C major") // => ["C", "major"]
 */
export function tokenize(keyName: string): string[] {
  const p = tokenizeNote(keyName);
  const type = p[3].toLowerCase();
  if (p[0] === "" || toMode(type) === null) {
    return [];
  }
  return [p[0] + p[1], type];
}

function getAlteredNotes(alt: number) {
  return alt === 0
    ? []
    : alt > 0
    ? range(1, alt).map(i => transposeFifths("B", i))
    : range(-1, alt).map(i => transposeFifths("F", i));
}
