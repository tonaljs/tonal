import { degreeOf, get as getChord } from "@tonaljs/chord";
import { distance as intervalBetween } from "@tonaljs/interval";
import { get as getNote, transpose } from "@tonaljs/note";
import { spacingName, stepsOf, VoicingSpacing } from "./spacing";

type Pitch = { name: string; pc: string; midi: number; chroma: number };

// The notes of a voicing, sorted from the bottom, or undefined if a note has
// no octave
function pitches(notes: string[]): Pitch[] | undefined {
  if (!Array.isArray(notes) || notes.length === 0) return undefined;
  const list: Pitch[] = [];
  for (const n of notes) {
    const note = getNote(n);
    if (note.empty || note.midi === null) return undefined;
    list.push({
      name: note.name,
      pc: note.pc,
      midi: note.midi,
      chroma: note.chroma,
    });
  }
  return list.sort((a, b) => a.midi - b.midi);
}

/** What `Voicing.analyze` tells about a voicing. */
export type VoicingAnalysis = {
  /** `true` if the voicing is empty or has a note without octave. */
  empty: boolean;
  /** The notes, from the bottom. */
  notes: string[];
  /** The lowest note. */
  bass: string;
  /** The highest note. */
  top: string;
  /** The interval from the lowest to the highest note. */
  span: string;
  /** The chord steps between neighbour voices (1 is close position). */
  steps: number[];
  /** The named spacing, or `""`: block, close, open, drop2, drop3, drop24, spread (the first that fits). */
  spacing: Exclude<VoicingSpacing, number[]> | "";
  /** With a chord: the chord degree of each note, from the bottom. */
  degrees: string[];
};

const EMPTY: VoicingAnalysis = {
  empty: true,
  notes: [],
  bass: "",
  top: "",
  span: "",
  steps: [],
  spacing: "",
  degrees: [],
};

/**
 * Describe a voicing (a list of notes with octave): its notes from the
 * bottom, the bass and top notes, the span, the spacing in chord steps and
 * its name (block, close, open, drop2, drop3, drop24, spread), and, with a
 * chord symbol, the chord degree of each note. It returns `empty: true` if
 * the voicing is empty or has a note without octave.
 *
 * Sources: chord steps, close and open position, Dmitri Tymoczko, *Tonality:
 * An Owner's Manual* (2023), prelude to ch. 2; drop voicings and spread, Gary
 * Lindsay, *Jazz Arranging Techniques* (2005), chs. 11 and 16; block chords,
 * Mark Levine, *The Jazz Piano Book* (1989), ch. 19.
 *
 * @param notes - the voicing, like ["G3", "C4", "E4", "B4"]
 * @param chord - the chord symbol, to name the degrees (optional)
 * @example
 * Voicing.analyze(["G3", "C4", "E4", "B4"], "Cmaj7").spacing; // => "drop2"
 * Voicing.analyze(["G3", "C4", "E4", "B4"], "Cmaj7").degrees; // => ["5", "1", "3", "7"]
 * Voicing.analyze(["C4", "G4", "E5"]).steps; // => [2, 2]
 */
export function analyze(notes: string[], chord?: string): VoicingAnalysis {
  const list = pitches(notes);
  if (!list) return EMPTY;
  const midis = list.map((p) => p.midi);
  const tonic = chord ? getChord(chord).tonic : null;
  const rootChroma = tonic ? getNote(tonic).chroma : undefined;
  const bass = list[0].name;
  const top = list[list.length - 1].name;
  return {
    empty: false,
    notes: list.map((p) => p.name),
    bass,
    top,
    span: intervalBetween(bass, top),
    steps: stepsOf(midis),
    spacing: spacingName(midis, rootChroma),
    degrees: chord ? list.map((p) => degreeOf(chord, p.name)) : [],
  };
}

// The note with a chroma at a midi number, spelled as the pitch class
function spell(pc: string, midi: number): string {
  for (let oct = -1; oct <= 10; oct++) {
    const note = getNote(pc + oct);
    if (note.midi === midi) return note.name;
  }
  return "";
}

/**
 * Invert a voicing: move every voice `n` steps along the voicing's own notes
 * (up for a positive `n`, down for a negative one), so the spacing doesn't
 * change. In close position it's the usual inversion (C4 E4 G4 becomes E4 G4
 * C5); in other spacings the voicing keeps its shape. The spelling is kept.
 * It returns `[]` if the voicing is empty or has a note without octave.
 *
 * Source: Dmitri Tymoczko, *Tonality: An Owner's Manual* (2023), prelude to
 * ch. 2: moving each voice along the chord ("transposition along the chord")
 * forms registral inversions without destroying the voicing's spacing, which
 * moving the bass to the top does.
 *
 * @param notes - the voicing, like ["C4", "E4", "G4"]
 * @param n - the number of steps: 1 is the first inversion
 * @example
 * Voicing.invert(["C4", "E4", "G4"], 1); // => ["E4", "G4", "C5"]
 * Voicing.invert(["C4", "G4", "E5"], 1); // => ["E4", "C5", "G5"]
 * Voicing.invert(["C4", "E4", "G4"], -1); // => ["G3", "C4", "E4"]
 */
export function invert(notes: string[], n: number): string[] {
  const list = pitches(notes);
  if (!list || !Number.isInteger(n)) return [];
  // the pitch classes of the voicing, spelled as in the voicing
  const names = new Map<number, string>();
  list.forEach((p) => {
    if (!names.has(p.chroma)) names.set(p.chroma, p.pc);
  });
  const dir = Math.sign(n);
  return list
    .map((p) => {
      let midi = p.midi;
      for (let i = 0; i < Math.abs(n); i++) {
        do midi += dir;
        while (!names.has(((midi % 12) + 12) % 12));
      }
      return spell(names.get(((midi % 12) + 12) % 12) as string, midi);
    })
    .filter((name) => name !== "");
}

/**
 * Drop voices of a voicing an octave: `n` is the position of the voice
 * counting from the top (1 is the top voice), or a list of positions. A close
 * voicing with the 2nd voice from the top dropped is a "drop 2" voicing. The
 * result is sorted from the bottom, and the spelling is kept. It returns `[]`
 * if the voicing is invalid or a position doesn't exist.
 *
 * Source: Gary Lindsay, *Jazz Arranging Techniques* (2005), ch. 11: "Drop 2 is
 * derived from 4 Way Close by lowering the 2nd voice from the top, one
 * octave"; drop 3 and drop 2 & 4 the same way.
 *
 * @param notes - the voicing, like ["C4", "E4", "G4", "B4"]
 * @param n - the position from the top, or positions: 2, 3, [2, 4]
 * @example
 * Voicing.drop(["C4", "E4", "G4", "B4"], 2); // => ["G3", "C4", "E4", "B4"]
 * Voicing.drop(["C4", "E4", "G4", "B4"], 3); // => ["E3", "C4", "G4", "B4"]
 * Voicing.drop(["C4", "E4", "G4", "B4"], [2, 4]); // => ["C3", "G3", "E4", "B4"]
 */
export function drop(notes: string[], n: number | number[]): string[] {
  const list = pitches(notes);
  const positions = Array.isArray(n) ? n : [n];
  if (
    !list ||
    positions.length === 0 ||
    positions.some((p) => !Number.isInteger(p) || p < 1 || p > list.length)
  ) {
    return [];
  }
  const dropped = list.map((p, i) =>
    positions.includes(list.length - i) ? transpose(p.name, "-8P") : p.name,
  );
  return pitches(dropped)?.map((p) => p.name) ?? [];
}
