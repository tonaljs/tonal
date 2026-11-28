import { get as getChord } from "@tonaljs/chord";
import { note } from "@tonaljs/pitch-note";

/** The options of `Progression.keys`. */
export type KeysOptions = {
  /** What changing key costs, in the scores of the table (default 4) */
  change?: number;
};

// A chord's class for tonal centres: major (Δ), minor (-), minor tonic (m6,
// mMaj7: "-Δ"), dominant (7), sus dominant (7sus), half-diminished (ø),
// diminished (o), or other
function classOf(intervals: string[]): string {
  const has = (i: string) => intervals.includes(i);
  if (has("3m") && has("5d")) return has("7m") ? "ø" : "o";
  if (has("3m")) return has("7M") || (has("6M") && !has("7m")) ? "-Δ" : "-";
  if (has("3M")) {
    if (has("7m")) return "7";
    return has("5A") && !has("7M") ? "other" : "Δ";
  }
  if (has("4P") && has("7m")) return "7sus";
  return "other";
}

// What a chord can be in a key: a score by its degree from the tonic (in
// semitones) and its class. Missing pairs score -1; "other" chords score 0.
const MAJOR: Record<string, number> = {
  "0Δ": 3,
  "0-Δ": 1,
  "07": 1,
  "0-": 0.5,
  "1o": 1,
  "17": 1,
  "2-": 2,
  "2ø": 1,
  "27": 1,
  "27sus": 1,
  "3o": 1,
  "37": 0.5,
  "4-": 2,
  "47": 1,
  "4ø": 0.5,
  "5Δ": 2,
  "5-": 1,
  "57": 1,
  "6ø": 0.5,
  "6o": 0.5,
  "77": 3,
  "77sus": 2.5,
  "7Δ": 1,
  "7-": 0.5,
  "8Δ": 0.5,
  "87": 1,
  "9-": 2,
  "97": 1.5,
  "9ø": 0.5,
  "10Δ": 0.5,
  "107": 1,
  "11ø": 1,
  "11o": 1,
  "117": 0.5,
};
const MINOR: Record<string, number> = {
  "0-": 3,
  "0-Δ": 3,
  "0Δ": 1,
  "07": 0.5,
  "1Δ": 0.5,
  "17": 1,
  "2ø": 2.5,
  "2-": 1,
  "27": 1,
  "3Δ": 2,
  "37": 1,
  "5-": 2,
  "57": 1,
  "5Δ": 0.5,
  "77": 3,
  "77sus": 2,
  "7-": 1,
  "8Δ": 2,
  "87": 1,
  "9ø": 1,
  "10Δ": 1,
  "107": 1.5,
  "11o": 1.5,
  "117": 0.5,
};
// the bonus of a cadence for the key it lands in
const CADENCE = 2;

type Change = { root: number; cls: string; pc: string };

// keys: 0-11 major on that pitch class, 12-23 minor
// the tonic spelled as the chords spell it, or as most key signatures do
const MAJOR_TONICS = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
];
const MINOR_TONICS = [
  "C",
  "C#",
  "D",
  "Eb",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "Bb",
  "B",
];
const keyName = (k: number, tonic?: string) =>
  k < 12
    ? `${tonic ?? MAJOR_TONICS[k]} major`
    : `${tonic ?? MINOR_TONICS[k - 12]} minor`;

function score(change: Change | null, key: number): number {
  if (!change || change.cls === "other") return 0;
  const table = key < 12 ? MAJOR : MINOR;
  const degree = (change.root - (key % 12) + 12) % 12;
  return table[`${degree}${change.cls}`] ?? -1;
}

const isDominant = (c: Change | null) =>
  !!c && (c.cls === "7" || c.cls === "7sus");
const isMinor = (c: Change | null) => !!c && (c.cls === "-" || c.cls === "ø");
// a minor chord followed by its dominant (a fourth up) is a ii
const isTwo = (a: Change | null, b: Change | null) =>
  isMinor(a) && isDominant(b) && b!.root === (a!.root + 5) % 12;

/**
 * Get the key of each chord of a progression: where it modulates, and where
 * it only borrows (a secondary dominant keeps the key it's in). It returns a
 * key name per chord, like "C major" or "A minor", and `""` for a symbol
 * that isn't a chord when no chord comes before it. The most common key of
 * a song is its reference key.
 *
 * The rules:
 *
 * - Each chord scores each of the 24 keys by what it can be in it: its degree
 *   from the tonic and its class (major, minor, a minor tonic as m6 or mMaj7,
 *   dominant, sus dominant, half-diminished, diminished). In a major key, I 3,
 *   V7 3, ii and vi 2, IV 2, VI7 1.5, other secondary dominants and borrowed
 *   chords 0.5 to 1; in a minor key, i 3, V7 3, iiø 2.5, bIII, bVI and iv 2.
 *   A chord the key can't explain scores -1 (the README has the table).
 * - A cadence (a dominant resolving down a fifth to a major or minor chord)
 *   adds 2 to the key it lands in, on the dominant, the landing and the ii
 *   before, unless the landing is a ii itself (a minor chord followed by
 *   its dominant).
 * - Changing key costs `change` (4): the keys are the path with the highest
 *   total score, so a lone secondary dominant stays in its key and a cadence
 *   elsewhere moves. On a tie, a chord stays in the key before (a pivot
 *   chord belongs to the key it comes from).
 * - A key is spelled as a chord on its tonic spells it (Gbmaj7 gives
 *   "Gb major"), or else with flats for majors (Db, Gb, Ab) and the usual
 *   minors (C#, F#, G#).
 * - A chord repeated right after itself counts once; a symbol that isn't a
 *   chord takes the key of the chord before.
 *
 * It's a model of functional harmony: blues, where I7 is a tonic, and modal
 * tunes, with no cadences, aren't read well.
 *
 * @param chords - chord symbols, as `Chart.chords(chart).map((c) => c.value)` gives them
 * @param options - `change`: what changing key costs (4)
 * @returns the key of each chord
 * @example
 * Progression.keys(["Cmaj7", "A7", "Dm7", "G7", "Cmaj7"]); // => ["C major", "C major", "C major", "C major", "C major"]
 * Progression.keys(["Cm7", "F7", "Bbmaj7", "Ebmaj7", "Am7b5", "D7", "Gm6"]); // => ["Bb major", "Bb major", "Bb major", "Bb major", "G minor", "G minor", "G minor"]
 */
export function keys(chords: string[], options?: KeysOptions): string[] {
  if (!Array.isArray(chords)) return [];
  const change = Number.isFinite(options?.change) ? Number(options!.change) : 4;

  // the chord changes, and the change of each chord
  const changes: (Change | null)[] = [];
  const changeOf: number[] = [];
  for (const symbol of chords) {
    const chord = getChord(String(symbol));
    const root = note(chord.tonic ?? "");
    if (chord.empty || root.empty) {
      changes.push(null);
      changeOf.push(changes.length - 1);
      continue;
    }
    const c: Change = {
      root: root.chroma,
      cls: classOf(chord.intervals),
      pc: root.pc,
    };
    const last = changes[changes.length - 1];
    if (!last || last.root !== c.root || last.cls !== c.cls) changes.push(c);
    changeOf.push(changes.length - 1);
  }
  const n = changes.length;
  if (!n) return [];

  // cadences
  const bonus = changes.map(() => new Array<number>(24).fill(0));
  for (let i = 0; i + 1 < n; i++) {
    const [a, b] = [changes[i], changes[i + 1]];
    if (!a || !b || !isDominant(a) || b.root !== (a.root + 5) % 12) continue;
    if (b.cls !== "Δ" && b.cls !== "-" && b.cls !== "-Δ") continue;
    if (isTwo(b, changes[i + 2])) continue;
    const key = b.root + (b.cls === "Δ" ? 0 : 12);
    bonus[i][key] += CADENCE;
    bonus[i + 1][key] += CADENCE;
    if (i > 0 && isTwo(changes[i - 1], a)) bonus[i - 1][key] += CADENCE;
  }

  // the best path through the keys
  const total = Array.from({ length: n }, () => new Array<number>(24).fill(0));
  const back = Array.from({ length: n }, () => new Array<number>(24).fill(0));
  for (let k = 0; k < 24; k++) total[0][k] = score(changes[0], k) + bonus[0][k];
  for (let i = 1; i < n; i++) {
    let best = 0;
    for (let k = 1; k < 24; k++)
      if (total[i - 1][k] > total[i - 1][best]) best = k;
    for (let k = 0; k < 24; k++) {
      const stay = total[i - 1][k];
      const move = total[i - 1][best] - change;
      total[i][k] = Math.max(stay, move) + score(changes[i], k) + bonus[i][k];
      // on a tie, the chord stays in the key before (a pivot chord belongs
      // to the key it comes from)
      back[i][k] = stay > move ? k : best;
    }
  }
  const path = new Array<number>(n);
  let k = 0;
  for (let j = 1; j < 24; j++) if (total[n - 1][j] > total[n - 1][k]) k = j;
  for (let i = n - 1; i >= 0; i--) {
    path[i] = k;
    k = back[i][k];
  }
  // each run of a key spelled as a chord on its tonic spells it, if any
  const names = new Array<string>(n);
  for (let start = 0; start < n;) {
    let end = start;
    while (end + 1 < n && path[end + 1] === path[start]) end++;
    const key = path[start];
    const tonic = changes
      .slice(start, end + 1)
      .find((c) => c !== null && c.root === key % 12)?.pc;
    for (let i = start; i <= end; i++) names[i] = keyName(key, tonic);
    start = end + 1;
  }
  // a run of non-chords at the start has no key
  const firstChord = changes.findIndex((c) => c !== null);
  return changeOf.map((c) =>
    firstChord < 0 || c < firstChord ? "" : names[c],
  );
}
