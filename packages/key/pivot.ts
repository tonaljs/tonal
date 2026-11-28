import { get as getChord } from "@tonaljs/chord";
import { note } from "@tonaljs/pitch-note";
import type { ChordReading, ChordSource } from "./analyze";
import type { KeyScale } from "./index";

/** A chord two keys share, as returned by `Key.pivotChords`. */
export interface PivotChord {
  /** The chord, spelled in the destination key (or in the key it belongs to). */
  chord: string;
  /** Its numeral in the first key, like "iii". */
  from: string;
  /** Its numeral in the second key, like "vi". */
  to: string;
  /** Where its reading in the first key comes from: "diatonic", "secondary dominant"... */
  fromSource: ChordSource;
  /** Where its reading in the second key comes from. */
  toSource: ChordSource;
}

/** Options of `Key.pivotChords`. */
export interface PivotChordsOptions {
  /** 7th chords instead of triads. */
  sevenths?: boolean;
  /**
   * Also the chords of one key that have a functional reading in the other
   * (secondary dominants, borrowed from the parallel major or minor...): D7
   * is V7/V in C and V7 in G.
   */
  chromatic?: boolean;
}

type KeyFns = {
  majorKey: (tonic: string) => KeyScale;
  minorKey: (tonic: string) => {
    natural: KeyScale;
    harmonic: KeyScale;
    melodic: KeyScale;
  };
  analyzeChord: (key: string, chord: string) => ChordReading[];
};

// The root pitch class and the type: the same chord, whatever its spelling
const identity = (name: string) => {
  const chord = getChord(name);
  return `${note(chord.tonic ?? "").chroma}|${chord.chroma}`;
};

// A key's chords, each once: the major's, or the three minor forms'
function keyChords(key: string, sevenths: boolean, fns: KeyFns) {
  const [tonic, type = "major", ...rest] = key.trim().split(/\s+/);
  if (rest.length || (type !== "major" && type !== "minor")) return undefined;
  if (note(tonic).empty) return undefined;
  const minor = type === "minor" ? fns.minorKey(tonic) : undefined;
  const scales = minor
    ? [minor.natural, minor.harmonic, minor.melodic]
    : [fns.majorKey(tonic)];
  const chords: string[] = [];
  const seen = new Set<string>();
  for (const scale of scales) {
    for (const chord of sevenths ? scale.chords : scale.triads) {
      const id = identity(chord);
      if (!seen.has(id)) {
        seen.add(id);
        chords.push(chord);
      }
    }
  }
  return chords;
}

export function pivotChordsOf(
  from: string,
  to: string,
  options: PivotChordsOptions,
  fns: KeyFns,
): PivotChord[] {
  if (typeof from !== "string" || typeof to !== "string") return [];
  const sevenths = !!options.sevenths;
  const a = keyChords(from, sevenths, fns);
  const b = keyChords(to, sevenths, fns);
  if (!a || !b) return [];
  const inB = new Map(b.map((c) => [identity(c), c]));
  const inA = new Set(a.map(identity));

  const diatonic = (key: string, chord: string) =>
    fns.analyzeChord(key, chord).find((r) => r.source === "diatonic");
  // a reading that isn't chromatic, and borrowed only from the parallel
  // major or minor (not from a mode)
  const functional = (key: string, chord: string) =>
    fns
      .analyzeChord(key, chord)
      .find(
        (r) =>
          r.source !== "chromatic" &&
          (r.source !== "borrowed" || / (major|minor)$/.test(r.scale)),
      );

  const result: PivotChord[] = [];
  for (const chord of a) {
    const shared = inB.get(identity(chord));
    if (!shared) continue;
    const ra = diatonic(from, chord);
    const rb = diatonic(to, shared);
    if (!ra || !rb) continue;
    result.push({
      chord: shared,
      from: ra.numeral,
      to: rb.numeral,
      fromSource: "diatonic",
      toSource: "diatonic",
    });
  }
  if (!options.chromatic) return result;

  // the chords of one key with a functional reading in the other
  for (const chord of a) {
    if (inB.has(identity(chord))) continue;
    const ra = diatonic(from, chord);
    const rb = functional(to, chord);
    if (!ra || !rb) continue;
    result.push({
      chord,
      from: ra.numeral,
      to: rb.numeral,
      fromSource: "diatonic",
      toSource: rb.source,
    });
  }
  for (const chord of b) {
    if (inA.has(identity(chord))) continue;
    const ra = functional(from, chord);
    const rb = diatonic(to, chord);
    if (!ra || !rb) continue;
    result.push({
      chord,
      from: ra.numeral,
      to: rb.numeral,
      fromSource: ra.source,
      toSource: "diatonic",
    });
  }
  return result;
}
