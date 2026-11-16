import {
  ChordQuality,
  ChordType,
  all as chordTypes,
  family,
  get as getChordType,
} from "@tonaljs/chord-type";
import { semitones } from "@tonaljs/interval";
import { get as pcset } from "@tonaljs/pcset";

// A change applied to the intervals of a base chord type
type Change = (intervals: string[]) => string[];

// The tones a token can name, and the interval each one adds
const TONES: Record<string, string> = {
  "2": "9M",
  "4": "4P",
  "6": "6M",
  b6: "6m",
  "9": "9M",
  b9: "9m",
  "#9": "9A",
  "+9": "9A",
  "11": "11P",
  "#11": "11A",
  "+11": "11A",
  "#4": "11A",
  "+4": "11A",
  "13": "13M",
  b13: "13m",
  b5: "5d",
  "#5": "5A",
  "+5": "5A",
};
const FIFTHS = ["5d", "5A"];
// Natural tones that can be written without "add" only inside parentheses
const BARE = ["6", "9", "11", "13"];
const MAJOR_SEVENTH = ["maj7", "Maj7", "ma7", "M7", "Δ7", "^7"];

const TOKEN = /^(add)?([b#+]?\d+|no[35]|maj7|Maj7|ma7|M7|Δ7|\^7)/;

/**
 * Get the chord type of a symbol that isn't in the dictionary, written as a
 * listed type followed by alteration tokens: `7b9#11`, `m7b5b9`, `7(b9,#9)`,
 * `7(no3)`, `dim(maj7)`.
 *
 * It returns undefined when the symbol can't be read that way. When the
 * resulting intervals are a listed type, it returns that type.
 */
export function composeChordType(symbol: string): ChordType | undefined {
  // Prefer the longest base: "m7b5b9" is "m7b5" plus "b9"
  for (let cut = symbol.length - 1; cut >= 0; cut--) {
    const rest = symbol.slice(cut);
    // A symbol without base is a major triad, as in "C(add9)" or "C(no3)"
    if (cut === 0 && !/^(\(|add|no)/.test(rest)) continue;
    const base = getChordType(symbol.slice(0, cut));
    if (base.empty) continue;
    const changes = parseChanges(rest);
    if (!changes) continue;
    const intervals = changes.reduce(
      (ivls, change) => change(ivls),
      base.intervals,
    );
    return chordTypeOf(sortIntervals(intervals));
  }
  return undefined;
}

// Parse the tokens after the base, bare or in parentheses separated by commas
// or spaces. Returns undefined if any part isn't a token.
function parseChanges(src: string): Change[] | undefined {
  const changes: Change[] = [];
  let rest = src;
  let inParens = false;
  while (rest.length) {
    if (inParens && /^[,\s]/.test(rest)) {
      rest = rest.slice(1);
    } else if (!inParens && /^\s*\(/.test(rest)) {
      rest = rest.replace(/^\s*\(/, "");
      inParens = true;
      if (rest[0] === ")") return undefined;
    } else if (inParens && rest[0] === ")") {
      rest = rest.slice(1);
      inParens = false;
    } else {
      const m = TOKEN.exec(rest);
      const change = m && changeOf(m[1] === "add", m[2], inParens);
      if (!m || !change) return undefined;
      changes.push(change);
      rest = rest.slice(m[0].length);
    }
  }
  return inParens || !changes.length ? undefined : changes;
}

function changeOf(
  add: boolean,
  token: string,
  inParens: boolean,
): Change | undefined {
  if (token === "no3") return without(["3m", "3M"]);
  if (token === "no5") return without(["5P", "5d", "5A"]);
  if (MAJOR_SEVENTH.includes(token)) {
    return add ? undefined : (ivls) => [...without(["7m", "7d"])(ivls), "7M"];
  }
  const interval = TONES[token];
  if (!interval) return undefined;
  const natural = /^\d/.test(token);
  if (add ? FIFTHS.includes(interval) : natural && !BARE.includes(token)) {
    return undefined;
  }
  if (!add && natural && !inParens) return undefined;
  return natural ? withInterval(interval) : altered(interval);
}

function without(remove: string[]): Change {
  return (ivls) => ivls.filter((ivl) => !remove.includes(ivl));
}

function withInterval(interval: string): Change {
  return (ivls) => (ivls.includes(interval) ? ivls : [...ivls, interval]);
}

// An altered tone replaces the natural one: b9 replaces 9, #5 replaces 5
function altered(interval: string): Change {
  const num = interval.slice(0, -1);
  const natural = num + (["4", "5", "11"].includes(num) ? "P" : "M");
  return (ivls) => withInterval(interval)(without([natural])(ivls));
}

function sortIntervals(intervals: string[]): string[] {
  return intervals
    .map((ivl, i) => [semitones(ivl), i, ivl] as const)
    .sort((a, b) => a[0] - b[0] || a[1] - b[1])
    .map(([, , ivl]) => ivl);
}

function chordTypeOf(intervals: string[]): ChordType {
  const same = (other: string[]) =>
    other.length === intervals.length &&
    other.every((ivl) => intervals.includes(ivl));
  const listed = chordTypes().find((type) => same(type.intervals));
  if (listed) return listed;
  return {
    ...pcset(intervals),
    name: "",
    quality: qualityOf(intervals),
    family: family(intervals),
    intervals,
    aliases: [],
  };
}

// Same rule as the chord type dictionary
function qualityOf(intervals: string[]): ChordQuality {
  return intervals.includes("5A")
    ? "Augmented"
    : intervals.includes("3M")
      ? "Major"
      : intervals.includes("5d")
        ? "Diminished"
        : intervals.includes("3m")
          ? "Minor"
          : "Unknown";
}
