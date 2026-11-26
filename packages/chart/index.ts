import { get as getChord } from "@tonaljs/chord";
import {
  add,
  compare,
  Fraction,
  fromBarBeat,
  meter as getMeter,
  Meter,
  mul,
  sub,
  TimeValue,
  fraction as toFraction,
} from "@tonaljs/time";

/** A chord of a written bar: its symbol as written and where it starts. */
export type ChartChord = {
  /** The chord symbol as written: "Cmaj7", "Cm7 b9", "N.C." */
  symbol: string;
  /** Where it starts, in quarter notes from the start of the bar */
  at: Fraction;
};

/** A bar of the written chart. */
export type ChartBar = {
  /** The time signature, inherited from the bar before when not written */
  meter: string;
  /** The chords: none continues the chord before */
  chords: ChartChord[];
  /** On the first bar of a section: its name */
  section?: string;
};

/** A chart as written: bars of chords, with sections and meters. */
export type Chart = {
  empty: boolean;
  bars: ChartBar[];
  /** What the parser ignored or couldn't read, by bar */
  problems: string[];
};

/** The options of `Chart.parse`. */
export type ParseOptions = {
  /** The meter of the first bar. Default "4/4". */
  meter?: string;
};

/** A bar of the played form. */
export type PlayedBar = {
  /** Its index in `chart.bars` */
  bar: number;
  /** Its index in the played form */
  index: number;
  /** Where it starts, in quarter notes from the start of the played form */
  start: Fraction;
  /** Its length, in quarter notes */
  length: Fraction;
  meter: string;
  /** The section it's in ("" before the first section) */
  section: string;
  /** Its index in this run of the section, from 0 */
  sectionBar: number;
  /** The number of bars in this run of the section */
  sectionLength: number;
  /** The chorus, from 1 */
  chorus: number;
  /** The pass through the repeat it's in, from 1 (1 outside repeats) */
  pass: number;
};

/** The options of `Chart.unroll` and `Chart.chords`. */
export type UnrollOptions = {
  /** How many times the form is played. Default 1. */
  choruses?: number;
};

/** A chord of the played form. */
export type PlayedChord = {
  symbol: string;
  /** Where it starts, in quarter notes from the start of the played form */
  start: Fraction;
  /** How long it lasts: until the next chord, or the end of the form */
  duration: Fraction;
  /** The index of its bar in the played form */
  bar: number;
};

const EMPTY: Chart = { empty: true, bars: [], problems: [] };

// a chord starts with a note letter, or is "N.C." (no chord)
const CHORD = /^([A-G]|N\.?C\.?(@|$))/;
const NO_CHORD = /^N\.?C\.?$/;
const METER = /^\d+(\+\d+)*\/\d+$/;
// a section label or a mark, which can have spaces: "[Verse 1]", "<To Coda>"
const LABELS = /\[[^\]]*\]|<[^>]*>/g;
const POSITION = /^(.*)@(\d+(?:\+\d+\/\d+)?)$/;

// A chord as written: its symbol and its position, if it has one
type Item = { symbol: string; position?: string };

// "A7@4" is ["A7", "4"]; "A7" is ["A7", undefined]
function splitPosition(word: string): [string, string | undefined] {
  const match = POSITION.exec(word);
  return match ? [match[1], match[2]] : [word, undefined];
}

/**
 * Read a chart from text: bars between `|` (a new line ends a bar too),
 * chords separated by spaces.
 *
 * - A chord is a word starting with a note letter, or `N.C.` (no chord).
 *   Other words are qualifiers of the chord before: `Cm7 b9` is one chord.
 * - `%` repeats the chords of the bar before. A bar with no chords continues
 *   the chord before.
 * - `[A]` (or `[Intro]`, `[Verse 1]`) starts a section on the bar it's in,
 *   or on the next bar when it's alone between bar lines (`| [A] | C |`).
 * - A meter like `3/4` or `2+2+3/8` changes the time signature from that bar
 *   on (`options.meter` at the start, 4/4 by default).
 * - `A7@4` places a chord on beat 4, and `A7@2+1/2` half a beat later. A
 *   beat is the meter's lower note, as in `Time.fromBarBeat`.
 *
 * Chords without a position are placed by the meter's pulses (the groups it's
 * felt in, from `Time.meter`): with n chords in p pulses, each chord gets
 * `floor(p / n)` pulses and the first `p mod n` one more, so 3 chords in 4/4
 * are 2+1+1 beats, 2 chords in 3/4 are 2+1 and 2 chords in 6/8 split the bar
 * in half. More chords than pulses split the bar equally. In a bar where some
 * chords have a position, a chord without one starts on beat 1 if it's
 * first, or on the next pulse after the chord before.
 *
 * Words it can't read are left out and listed in `problems`, by bar. It
 * returns a chart with `empty: true` if there are no bars.
 *
 * @param text - the chart, like "| Cmaj7 | Dm7 G7 |"
 * @param options - `meter`: the time signature of the first bar
 * @returns the written chart
 * @example
 * Chart.parse("| Dm7 G7 | Cmaj7 |").bars
 * // => [{ meter: "4/4", chords: [{ symbol: "Dm7", at: [0, 1] }, { symbol: "G7", at: [2, 1] }] }, { meter: "4/4", chords: [{ symbol: "Cmaj7", at: [0, 1] }] }]
 * Chart.parse("| C F G |").bars[0].chords.map((c) => c.at) // => [[0, 1], [2, 1], [3, 1]]
 */
export function parse(text: string, options?: ParseOptions): Chart {
  if (typeof text !== "string") return EMPTY;
  const start = getMeter(options?.meter ?? "4/4");
  let meterName = start.empty ? "4/4" : start.name;
  const bars: ChartBar[] = [];
  const problems: string[] = [];
  let pending: string[] = []; // words before the first bar line of a line
  let previous: Item[] = [];

  const readBar = (words: string[], labels: string[]) => {
    const number = bars.length + 1;
    const problem = (message: string) =>
      problems.push(`bar ${number}: ${message}`);
    const bar: ChartBar = { meter: meterName, chords: [] };
    let items: Item[] = [];
    for (const label of labels) {
      if (label.startsWith("[")) bar.section = label.slice(1, -1).trim();
      else problem(`unknown mark "${label}"`);
    }
    for (const word of words) {
      if (METER.test(word)) {
        if (getMeter(word).empty) problem(`invalid meter "${word}"`);
        else bar.meter = meterName = getMeter(word).name;
      } else if (word === "%") {
        items = [...items, ...previous.map((item) => ({ ...item }))];
      } else if (CHORD.test(word)) {
        const [symbol, position] = splitPosition(word);
        items.push({ symbol, position });
      } else if (items.length) {
        const last = items[items.length - 1];
        const [qualifier, position] = splitPosition(word);
        last.symbol += ` ${qualifier}`;
        if (position) last.position = position;
      } else {
        problem(`unknown word "${word}"`);
      }
    }
    for (const item of items) {
      if (NO_CHORD.test(item.symbol)) item.symbol = "N.C.";
      else if (getChord(item.symbol).empty) {
        problem(`unknown chord "${item.symbol}"`);
      }
    }
    bar.chords = place(items, getMeter(bar.meter), problem);
    if (items.length) previous = items;
    bars.push(bar);
  };

  for (const line of text.replace(/\|\|/g, "|").split("\n")) {
    const segments = line.split("|");
    segments.forEach((segment, i) => {
      const labels = segment.match(LABELS) ?? [];
      const words = segment.replace(LABELS, " ").split(/\s+/).filter(Boolean);
      const outside = i === 0 || i === segments.length - 1;
      const hasChord = words.some((w) => CHORD.test(w) || w === "%");
      // text before the first bar line, or after the last one, is a bar only
      // when it has chords; otherwise its labels go to the next bar. So does
      // a bar with only section labels ("| [A] | C |")
      const onlySections =
        !words.length && labels.length && labels.every((l) => l[0] === "[");
      if ((outside && !hasChord) || onlySections) {
        pending = [...pending, ...labels, ...words];
        return;
      }
      const all = [...pending, ...labels, ...words];
      pending = [];
      readBar(
        all.filter((w) => !/^[[<]/.test(w)),
        all.filter((w) => /^[[<]/.test(w)),
      );
    });
  }
  if (!bars.length) return EMPTY;
  return { empty: false, bars, problems };
}

// Where each chord of a bar starts
function place(
  items: Item[],
  m: Meter,
  problem: (message: string) => void,
): ChartChord[] {
  const n = items.length;
  const pulses = m.pulses;
  // the start of each pulse
  const starts: Fraction[] = [];
  let at: Fraction = [0, 1];
  for (const pulse of pulses) {
    starts.push(at);
    at = add(at, pulse) as Fraction;
  }
  const explicit = items.map((item) => {
    if (!item.position) return undefined;
    const position = fromBarBeat(`1:${item.position}`, m);
    if (!position) problem(`invalid position "@${item.position}"`);
    return position ?? undefined;
  });

  if (explicit.every((p) => p === undefined)) {
    if (n <= pulses.length) {
      const each = Math.floor(pulses.length / n);
      const extra = pulses.length % n;
      let pulse = 0;
      return items.map((item, i) => {
        const chord = { symbol: item.symbol, at: starts[pulse] };
        pulse += each + (i < extra ? 1 : 0);
        return chord;
      });
    }
    return items.map((item, i) => ({
      symbol: item.symbol,
      at: mul(m.bar, [i, n]) as Fraction,
    }));
  }

  // some chords have a position: the others go on the next pulse
  const chords: ChartChord[] = [];
  items.forEach((item, i) => {
    const before = chords[i - 1]?.at;
    let position = explicit[i];
    if (position && before && compare(position, before) <= 0) {
      problem(`"${item.symbol}" is placed before the chord before it`);
    }
    if (!position) {
      position = before
        ? (starts.find((s) => compare(s, before) > 0) ?? before)
        : [0, 1];
      if (before && compare(position, before) <= 0) {
        problem(`no room for "${item.symbol}" after the chord before it`);
      }
    }
    chords.push({ symbol: item.symbol, at: position });
  });
  return chords;
}

/**
 * Get what can't be played in a chart: the words, chords and positions that
 * `Chart.parse` couldn't read, by bar. An empty list means the chart is fine.
 *
 * @param chart - a chart from `Chart.parse`
 * @returns the problems, like `bar 3: unknown chord "Xm7"`
 * @example
 * Chart.problems(Chart.parse("| Cmaj7 | Xyz |")) // => ['bar 2: unknown word "Xyz"']
 */
export function problems(chart: Chart): string[] {
  if (!isChart(chart)) return [];
  return Array.isArray(chart.problems) ? [...chart.problems] : [];
}

function isChart(value: unknown): value is Chart {
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as Chart).bars)
  );
}

// The bars to play, in order, with their chorus and pass
type Step = { bar: number; chorus: number; pass: number };

function playOrder(chart: Chart, choruses: number): Step[] {
  const steps: Step[] = [];
  for (let chorus = 1; chorus <= choruses; chorus++) {
    chart.bars.forEach((_, bar) => steps.push({ bar, chorus, pass: 1 }));
  }
  return steps;
}

const chorusesOf = (options?: UnrollOptions) => {
  const choruses = options?.choruses ?? 1;
  return Number.isInteger(choruses) && choruses > 0 ? choruses : 0;
};

/**
 * Get the played form of a chart: every bar in the order it's played, with
 * where it starts (in quarter notes), its length, its section, its place in
 * the section and its chorus. `choruses` plays the form more than once.
 *
 * A run of a section starts at a bar that starts a section (`[A]`), or at a
 * new chorus, so `sectionBar` and `sectionLength` count within it: written
 * as `[A] ... [A] ...`, an AA form is two runs.
 *
 * It returns `[]` if the chart is empty or `choruses` isn't a positive
 * integer.
 *
 * @param chart - a chart from `Chart.parse`
 * @param options - `choruses`: how many times the form is played (1)
 * @returns the played bars
 * @example
 * Chart.unroll(Chart.parse("[A] | C | G | [B] | F |")).map((b) => `${b.section}${b.sectionBar}`)
 * // => ["A0", "A1", "B0"]
 */
export function unroll(chart: Chart, options?: UnrollOptions): PlayedBar[] {
  const choruses = chorusesOf(options);
  if (!isChart(chart) || chart.empty || !choruses) return [];
  const sections: string[] = [];
  let name = "";
  chart.bars.forEach((bar, i) => {
    if (bar.section !== undefined) name = bar.section;
    sections[i] = name;
  });
  let start: Fraction = [0, 1];
  const played: PlayedBar[] = playOrder(chart, choruses).map((step, index) => {
    const bar = chart.bars[step.bar];
    const length = getMeter(bar.meter).bar;
    const played: PlayedBar = {
      bar: step.bar,
      index,
      start,
      length,
      meter: bar.meter,
      section: sections[step.bar],
      sectionBar: 0,
      sectionLength: 0,
      chorus: step.chorus,
      pass: step.pass,
    };
    start = add(start, length) as Fraction;
    return played;
  });
  // the runs of sections
  let runStart = 0;
  played.forEach((bar, i) => {
    const before = played[i - 1];
    const newRun =
      !before ||
      chart.bars[bar.bar].section !== undefined ||
      bar.section !== before.section ||
      bar.chorus !== before.chorus;
    if (newRun) runStart = i;
    bar.sectionBar = i - runStart;
  });
  for (let i = played.length - 1, end = played.length; i >= 0; i--) {
    played[i].sectionLength = end - (i - played[i].sectionBar);
    if (played[i].sectionBar === 0) end = i;
  }
  return played;
}

/**
 * Get the chords of a chart as they're played: each with its symbol, where
 * it starts and how long it lasts (in quarter notes from the start of the
 * played form), and its bar in the played form. A chord lasts until the next
 * chord, or the end of the form: a bar with no chords continues the chord
 * before, and a chord written again is played again (a new entry). `N.C.`
 * is a chord too, a rest.
 *
 * It returns `[]` if the chart is empty or the options aren't valid.
 *
 * @param chart - a chart from `Chart.parse`
 * @param options - as in `Chart.unroll`
 * @returns the played chords
 * @example
 * Chart.chords(Chart.parse("| Dm7 G7 | Cmaj7 |")).map((c) => [c.symbol, c.start, c.duration])
 * // => [["Dm7", [0, 1], [2, 1]], ["G7", [2, 1], [2, 1]], ["Cmaj7", [4, 1], [4, 1]]]
 */
export function chords(chart: Chart, options?: UnrollOptions): PlayedChord[] {
  const played = unroll(chart, options);
  const list: Omit<PlayedChord, "duration">[] = [];
  for (const bar of played) {
    for (const chord of chart.bars[bar.bar].chords) {
      list.push({
        symbol: chord.symbol,
        start: add(bar.start, chord.at) as Fraction,
        bar: bar.index,
      });
    }
  }
  const last = played[played.length - 1];
  const end = last ? add(last.start, last.length) : null;
  return list.map((chord, i) => ({
    ...chord,
    duration: sub(list[i + 1]?.start ?? end ?? 0, chord.start) as Fraction,
  }));
}

/**
 * Get the chord playing at a position (in quarter notes from the start of
 * the played form, as a fraction, an exact number or a string), from the
 * list `Chart.chords` gives. A chord plays from its start until the next one
 * starts. It returns `null` before the first chord, after the end, or if the
 * position isn't valid.
 *
 * @param chords - the played chords, from `Chart.chords`
 * @param position - the position, in quarter notes
 * @returns the chord, or null
 * @example
 * const chords = Chart.chords(Chart.parse("| Dm7 G7 | Cmaj7 |"));
 * Chart.chordAt(chords, 3)?.symbol // => "G7"
 * Chart.chordAt(chords, [8, 1]) // => null
 */
export function chordAt(
  chords: PlayedChord[],
  position: TimeValue,
): PlayedChord | null {
  const at = toFraction(position);
  if (!Array.isArray(chords) || !chords.length || !at) return null;
  // the last chord that starts at or before the position
  let lo = 0;
  let hi = chords.length - 1;
  if (compare(chords[0].start, at) > 0) return null;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (compare(chords[mid].start, at) <= 0) lo = mid;
    else hi = mid - 1;
  }
  const chord = chords[lo];
  const end = add(chord.start, chord.duration);
  return end && compare(at, end) < 0 ? chord : null;
}

/**
 * Get the position of a bar and beat of the played form, in quarter notes
 * from its start: `"9:3"` is beat 3 of the 9th played bar, in that bar's
 * meter (a beat is the meter's lower note, as in `Time.fromBarBeat`). It
 * returns `null` if the bar or the beat isn't in the form.
 *
 * @param played - the played form, from `Chart.unroll`
 * @param text - the bar and beat, like "2:3" or "2:3+1/2"
 * @returns the position, or null
 * @example
 * const played = Chart.unroll(Chart.parse("| C | 3/4 G | F |"));
 * Chart.position(played, "3:2") // => [8, 1]
 */
export function position(played: PlayedBar[], text: string): Fraction | null {
  if (!Array.isArray(played) || typeof text !== "string") return null;
  const match = /^(\d+):(.+)$/.exec(text.trim());
  const bar = match ? played[+match[1] - 1] : undefined;
  if (!match || !bar || +match[1] < 1) return null;
  const inBar = fromBarBeat(`1:${match[2]}`, bar.meter);
  return inBar ? add(bar.start, inBar) : null;
}
