import { IntervalName } from "tonal-interval";
import { EmptySet, Pcset, pcset, PcsetChroma, PcsetNum } from "tonal-pcset";
import data from "./data";

export type ChordQuality =
  | "Major"
  | "Minor"
  | "Augmented"
  | "Diminished"
  | "Unknown";

export interface ChordPcset extends Pcset {
  name: string;
  quality: ChordQuality;
  intervals: IntervalName[];
  aliases: string[];
}
const NoChord: ChordPcset = {
  ...EmptySet,
  name: "",
  quality: "Unknown",
  intervals: [],
  aliases: []
};

type ChordType = string | PcsetChroma | PcsetNum;
const chordNames: string[] = [];
const chordAliases: string[] = [];
const chords: Record<ChordType, ChordPcset> = {};

/**
 * Given a chord name or chroma, return the chord properties
 * @param {string} source - chord name or pitch class set chroma
 * @example
 * import { chord } from 'tonaljs/chord-dictionary'
 * chord('major')
 */
export function chord(type: ChordType): ChordPcset {
  return chords[type] || NoChord;
}

/**
 * Get all chord names
 * @return {Array<String>} an array of chord names
 */
export function names() {
  return chordNames.slice();
}

export function abbreviatures() {
  return chordAliases.slice();
}

function getQuality(intervals: IntervalName[]): ChordQuality {
  const has = (interval: IntervalName) => intervals.indexOf(interval) !== -1;
  return has("5A")
    ? "Augmented"
    : has("3M")
    ? "Major"
    : has("5d")
    ? "Diminished"
    : has("3m")
    ? "Minor"
    : "Unknown";
}

data.forEach(([ivls, name, abbrvs]) => {
  const intervals = ivls.split(" ");
  const aliases = abbrvs.split(" ");
  const quality = getQuality(intervals);
  const set = pcset(intervals);
  if (set.chroma) {
    const chord: ChordPcset = { name, quality, intervals, aliases, ...set };
    if (name) {
      chordNames.push(name);
      chords[name] = chord;
    }
    chords[chord.num] = chord;
    chords[chord.chroma] = chord;
    aliases.forEach(alias => {
      chordAliases.push(alias);
      chords[alias] = chord;
    });
  }
});
chordNames.sort((a, b) => a.localeCompare(b));
chordAliases.sort((a, b) => a.localeCompare(b));
