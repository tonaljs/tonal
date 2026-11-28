import { get as getChord, transpose as transposeChord } from "@tonaljs/chord";
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
  toBarBeat,
  fraction as toFraction,
} from "@tonaljs/time";

/** A chord of a written bar: its symbol (`value`) and where it starts. */
export type ChartChord = {
  /** The chord symbol as written: "Cmaj7", "Cm7 b9", "N.C." */
  value: string;
  /** Where it starts, in quarter notes from the start of the bar */
  at: Fraction;
  /** `N.C.` (no chord): a rest, nothing is played until the next chord */
  rest?: true;
};

/** A bar of the written chart. */
export type ChartBar = {
  /** The time signature, inherited from the bar before when not written */
  meter: string;
  /** The chords: none continues the chord before */
  chords: ChartChord[];
  /** On the first bar of a section: its name */
  section?: string;
  /** `|:` before the bar: a repeat starts */
  repeatStart?: true;
  /** `:|` after the bar: a repeat ends, with its number of passes (2) */
  repeatEnd?: number;
  /** `|1` or `|1,2` before the bar: an ending starts, for these passes */
  ending?: number[];
  /** `||` after the bar: a double bar (it closes an ending) */
  doubleBar?: true;
  /** `<Segno>`: the sign a D.S. goes back to, at the start of the bar */
  segno?: true;
  /** `<Coda>`: the coda starts on this bar */
  coda?: true;
  /** `<To Coda>`: after a jump, go to the coda at the end of this bar */
  toCoda?: true;
  /** `<Fine>`: after a jump, the end, at the end of this bar */
  fine?: true;
  /** `<D.C.>`, `<D.S. al Coda>`…: a jump at the end of this bar */
  jump?: Jump;
};

/** A jump back: da capo (to the start) or dal segno (to the sign). */
export type Jump =
  | "D.C."
  | "D.C. al Fine"
  | "D.C. al Coda"
  | "D.S."
  | "D.S. al Fine"
  | "D.S. al Coda"
  | "D.C. al 1st ending"
  | "D.C. al 2nd ending"
  | "D.C. al 3rd ending"
  | "D.S. al 1st ending"
  | "D.S. al 2nd ending"
  | "D.S. al 3rd ending";

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
  /** How long it lasts: the length of the bar, in quarter notes */
  duration: Fraction;
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
  /** The ending it's in, if any: the pass it's played on */
  ending?: number;
};

/** The options of `Chart.unroll` and `Chart.chords`. */
export type UnrollOptions = {
  /** How many times the form is played. Default 1. */
  choruses?: number;
  /** Take the repeats again after a D.C. or a D.S. Default false. */
  repeatsOnJump?: boolean;
};

/** A chord of the played form. */
export type PlayedChord = {
  /** The chord symbol as written: "Cmaj7", "Cm7 b9", "N.C." */
  value: string;
  /** Where it starts, in quarter notes from the start of the played form */
  start: Fraction;
  /** How long it lasts: until the next chord, or the end of the form */
  duration: Fraction;
  /** The index of its bar in the played form */
  bar: number;
  /** `N.C.` (no chord): a rest, nothing is played until the next chord */
  rest?: true;
};

const EMPTY: Chart = { empty: true, bars: [], problems: [] };

// a chord starts with a note letter, or is "N.C." (no chord)
const CHORD = /^([A-G]|N\.?C\.?(@|$))/;
const NO_CHORD = /^N\.?C\.?$/;
const METER = /^\d+(\+\d+)*\/\d+$/;
// a section label or a mark, which can have spaces: "[Verse 1]", "<To Coda>",
// and the bar line marks the parser writes for repeats and endings: "{rs}"
const LABELS = /\[[^\]]*\]|<[^>]*>|\{[^}]*\}/g;
// The navigation marks, by their letters: "<D.S. al Coda>" is "dsalcoda"
const MARKS: Record<string, Jump | "segno" | "coda" | "toCoda" | "fine"> = {
  segno: "segno",
  coda: "coda",
  tocoda: "toCoda",
  fine: "fine",
  dc: "D.C.",
  dcalfine: "D.C. al Fine",
  dcalcoda: "D.C. al Coda",
  ds: "D.S.",
  dsalfine: "D.S. al Fine",
  dsalcoda: "D.S. al Coda",
  // al 1st, 2nd or 3rd ending, also written "2nd End."
  ...Object.fromEntries(
    ["D.C.", "D.S."].flatMap((jump) =>
      ["1st", "2nd", "3rd"].flatMap((n) => {
        const key = `${jump[2].toLowerCase() === "c" ? "dc" : "ds"}al${n}`;
        const value = `${jump} al ${n} ending` as Jump;
        return [
          [`${key}ending`, value],
          [`${key}end`, value],
        ];
      }),
    ),
  ),
};
const markOf = (label: string) =>
  label[0] === "<"
    ? MARKS[label.slice(1, -1).toLowerCase().replace(/[.\s]/g, "")]
    : undefined;

// The marks that act at the end of a bar, so alone between bar lines they
// belong to the bar before: a repeat end, a double bar, a jump, To Coda, Fine
function isClosing(label: string): boolean {
  if (/^\{(re|db)/.test(label)) return true;
  const mark = markOf(label);
  return !!mark && mark !== "segno" && mark !== "coda";
}

// A bar line: ":|x3", "|:", "||", "|1,2", ":|2", ":|:"…
const BAR_LINE =
  /:\|(\|)?(?:x(\d+))?(\d+(?:,\d+)*)?(:)?|(\|\|?):|(\|\|?)(\d+(?:,\d+)*)(?![\d/+])|\|\||\|/g;

// The marks of a bar line: for the bar before it (a repeat end, a double
// bar) and for the bar after it (a repeat start, an ending)
type BarLine = {
  from: number;
  to: number;
  close: string[];
  open: string[];
  // whether the last bar line merged into it is a plain "|"
  plain: boolean;
  // an empty bar comes before it ("| |")
  empty?: boolean;
};

// Bar lines with repeats and endings, as marks next to plain bar lines:
// ":|x3" is "{re:3} |", "|:" is "| {rs}", "|2" is "| {e:2}", "||" is
// "{db} |". Bar lines with only spaces between them are one bar line
// (":| |2" is ":|2"), except two plain ones: "| |" is an empty bar.
function markBarLines(line: string): string {
  const lines: BarLine[] = [];
  for (const m of line.matchAll(BAR_LINE)) {
    const [text, double, times, endings, start, startBar, endingBar, ending] =
      m;
    const close: string[] = [];
    const open: string[] = [];
    if (text.startsWith(":|")) {
      close.push(times ? `{re:${times}}` : "{re}");
      if (double) close.push("{db}");
      if (endings) open.push(`{e:${endings}}`);
      if (start) open.push("{rs}");
    } else if (startBar) {
      if (startBar === "||") close.push("{db}");
      open.push("{rs}");
    } else if (endingBar) {
      if (endingBar === "||") close.push("{db}");
      open.push(`{e:${ending}}`);
    } else if (text === "||") {
      close.push("{db}");
    }
    const plain = !close.length && !open.length;
    const bar: BarLine = {
      from: m.index,
      to: m.index + text.length,
      close,
      open,
      plain,
    };
    const before = lines[lines.length - 1];
    const between = before ? line.slice(before.to, bar.from) : "x";
    if (before && !between.trim() && !(before.plain && plain)) {
      before.to = bar.to;
      before.close.push(...close);
      before.open.push(...open);
      before.plain = plain;
    } else {
      // two plain bar lines with only spaces between them: an empty bar
      if (before && !between.trim()) bar.empty = true;
      lines.push(bar);
    }
  }
  let result = "";
  let from = 0;
  for (const bar of lines) {
    result += line.slice(from, bar.from);
    if (bar.empty) result += " {empty} ";
    result += ` ${bar.close.join(" ")} | ${bar.open.join(" ")} `;
    from = bar.to;
  }
  return result + line.slice(from);
}

const POSITION = /^(.*)@(\d+(?:\+\d+\/\d+)?)$/;

// A chord as written: its value (the symbol) and its position, if it has one
type Item = { value: string; position?: string };

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
 * - `|:` and `:|` start and end a repeat (`:|x3` plays it three times);
 *   `|1` (or `|1,2`) starts an ending, and `:|2` ends a repeat and starts
 *   ending 2. `||` is a double bar. See `Chart.unroll` for how they're played.
 *   Bar lines with only spaces between them are one bar line (`:| |2` is
 *   `:|2`), except two plain ones: `| |` is an empty bar.
 * - `<Segno>` and `<Coda>` mark the start of their bar; `<To Coda>`,
 *   `<Fine>`, `<D.C.>`, `<D.C. al Fine>`, `<D.C. al Coda>`, `<D.S.>`,
 *   `<D.S. al Fine>`, `<D.S. al Coda>` and `<D.C. al 2nd ending>` (1st,
 *   2nd or 3rd, D.C. or D.S.; also written `<D.C. al 2nd End.>`) act at the
 *   end of their bar (alone between bar lines, at the end of the bar before).
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
 * // => [{ meter: "4/4", chords: [{ value: "Dm7", at: [0, 1] }, { value: "G7", at: [2, 1] }] }, { meter: "4/4", chords: [{ value: "Cmaj7", at: [0, 1] }] }]
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
      else if (label === "{empty}") continue;
      else if (label === "{rs}") bar.repeatStart = true;
      else if (label.startsWith("{e:")) {
        const numbers = label.slice(3, -1).split(",").map(Number);
        if (numbers.every((n) => n > 0)) bar.ending = numbers;
        else problem(`invalid ending "${label.slice(3, -1)}"`);
      } else if (isClosing(label)) closeBar(bar, label);
      else if (markOf(label) === "segno") bar.segno = true;
      else if (markOf(label) === "coda") bar.coda = true;
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
        items.push({ value: symbol, position });
      } else if (items.length) {
        const last = items[items.length - 1];
        const [qualifier, position] = splitPosition(word);
        last.value += ` ${qualifier}`;
        if (position) last.position = position;
      } else {
        problem(`unknown word "${word}"`);
      }
    }
    for (const item of items) {
      if (NO_CHORD.test(item.value)) item.value = "N.C.";
      else if (getChord(item.value).empty) {
        problem(`unknown chord "${item.value}"`);
      }
    }
    bar.chords = place(items, getMeter(bar.meter), problem).map((chord) =>
      chord.value === "N.C." ? { ...chord, rest: true } : chord,
    );
    if (items.length) previous = items;
    bars.push(bar);
  };

  // a repeat end, a double bar, a jump, To Coda or Fine, after a bar
  const closeBar = (bar: ChartBar, label: string) => {
    const mark = markOf(label);
    if (label === "{db}") bar.doubleBar = true;
    else if (label.startsWith("{re")) {
      bar.repeatEnd = label === "{re}" ? 2 : +label.slice(4, -1);
    } else if (mark === "toCoda") bar.toCoda = true;
    else if (mark === "fine") bar.fine = true;
    else if (mark) bar.jump = mark as Jump;
  };

  for (const line of text.split("\n")) {
    const segments = markBarLines(line).split("|");
    segments.forEach((segment, i) => {
      const labels: string[] = segment.match(LABELS) ?? [];
      const words = segment.replace(LABELS, " ").split(/\s+/).filter(Boolean);
      const outside = i === 0 || i === segments.length - 1;
      const hasChord = words.some((w) => CHORD.test(w) || w === "%");
      // text before the first bar line, or after the last one, is a bar only
      // when it has chords; otherwise its labels go to the next bar. So do
      // marks alone between bar lines ("| [A] | C |")
      const onlyMarks =
        !words.length && labels.length > 0 && !labels.includes("{empty}");
      if ((outside && !hasChord) || onlyMarks) {
        // a repeat end, a double bar or a jump closes the bar before
        const last = bars[bars.length - 1];
        for (const label of labels.filter(isClosing)) {
          if (last) closeBar(last, label);
        }
        pending = [
          ...pending,
          ...labels.filter((l) => !isClosing(l)),
          ...words,
        ];
        return;
      }
      const all = [...pending, ...labels, ...words];
      pending = [];
      readBar(
        all.filter((w) => !/^[[<{]/.test(w)),
        all.filter((w) => /^[[<{]/.test(w)),
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
        const chord = { value: item.value, at: starts[pulse] };
        pulse += each + (i < extra ? 1 : 0);
        return chord;
      });
    }
    return items.map((item, i) => ({
      value: item.value,
      at: mul(m.bar, [i, n]) as Fraction,
    }));
  }

  // some chords have a position: the others go on the next pulse
  const chords: ChartChord[] = [];
  items.forEach((item, i) => {
    const before = chords[i - 1]?.at;
    let position = explicit[i];
    if (position && before && compare(position, before) <= 0) {
      problem(`"${item.value}" is placed before the chord before it`);
    }
    if (!position) {
      position = before
        ? (starts.find((s) => compare(s, before) > 0) ?? before)
        : [0, 1];
      if (before && compare(position, before) <= 0) {
        problem(`no room for "${item.value}" after the chord before it`);
      }
    }
    chords.push({ value: item.value, at: position });
  });
  return chords;
}

/**
 * Get what can't be played in a chart, by bar: the words, chords and
 * positions that `Chart.parse` couldn't read, and repeats and endings that
 * don't close (a chart with those unrolls to `[]`). An empty list means the
 * chart is fine.
 *
 * @param chart - a chart from `Chart.parse`
 * @returns the problems, like `bar 3: unknown chord "Xm7"`
 * @example
 * Chart.problems(Chart.parse("| Cmaj7 | Xyz |")) // => ['bar 2: unknown word "Xyz"']
 */
export function problems(chart: Chart): string[] {
  if (!isChart(chart)) return [];
  const parsed = Array.isArray(chart.problems) ? chart.problems : [];
  return [...parsed, ...structure(chart).problems];
}

function isChart(value: unknown): value is Chart {
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as Chart).bars)
  );
}

// An ending of a group: where it starts and its last bar. A late ending is
// written after its group (often after the jump): only a jump to it plays it
type Ending = {
  bar: number;
  numbers: number[];
  end: number;
  group: Ending[];
  late?: true;
};
// A repeat end: where it goes back to, and how many passes it plays
type Repeat = { start: number; passes: number };

// A jump: from the end of its bar back to `target`, then on to the end of
// `stop` (Fine or To Coda, or the end of the chart), then from `coda`. With
// `ending` (al 2nd ending), that ending is taken after the jump
type JumpPlan = {
  bar: number;
  target: number;
  stop?: number;
  coda?: number;
  ending?: number;
};

type Structure = {
  jump?: JumpPlan;
  repeats: Map<number, Repeat>; // by the bar of the repeat end
  starts: Set<number>; // the bars repeats go back to
  endings: Map<number, Ending>; // by the bar each ending starts on
  inside: boolean[]; // the bars in a repeat or an ending
  problems: string[];
};

// The repeats and endings of a chart
function structure(chart: Chart): Structure {
  const bars = chart.bars;
  const problems: string[] = [];
  const problem = (i: number, message: string) =>
    problems.push(`bar ${i + 1}: ${message}`);
  const repeats = new Map<number, Repeat>();
  const endings = new Map<number, Ending>();
  let open = -1; // the bar of an open |:
  let afterEnd = 0; // the bar after the last :|
  let group: Ending[] | null = null;
  let lastGroup: Ending[] | null = null; // the group closed before
  let groupStart = 0; // where the repeat of the group starts

  // the last ending of a group without its own :| lasts until a double bar
  // (closeGroup(i) on it), or one bar
  const closeGroup = (end?: number) => {
    const last = group?.[group.length - 1];
    if (last && last.end < 0) last.end = end ?? last.bar;
    if (group && !group.some((e) => repeats.has(e.end))) {
      problem(group[0].bar, `ending ${group[0].numbers} has no repeat end`);
    }
    if (group) lastGroup = group;
    group = null;
  };
  const highestOf = (endings: Ending[]) =>
    Math.max(...endings.filter((e) => !e.late).flatMap((e) => e.numbers));

  bars.forEach((bar, i) => {
    // a section closes the group, unless it starts on an ending
    if (
      group &&
      (bar.repeatStart || (bar.section !== undefined && !bar.ending))
    ) {
      closeGroup();
    }
    if (bar.repeatStart) {
      if (open >= 0) problem(i, "a repeat starts inside another repeat");
      open = i;
    }
    if (bar.ending) {
      // an ending that continues a group already closed (|3 after |1 and
      // |2), outside any repeat, joins it, late. Inside a repeat it starts
      // a group of its own (charts that number endings across sections)
      const late =
        !group &&
        !bar.repeatStart &&
        open < 0 &&
        lastGroup !== null &&
        Math.min(...bar.ending) === highestOf(lastGroup) + 1;
      if (late) group = lastGroup;
      if (!group) {
        group = [];
        groupStart = open >= 0 ? open : afterEnd;
      } else {
        const before = group[group.length - 1];
        if (before.end < 0) {
          problem(before.bar, `ending ${before.numbers} has no repeat end`);
          before.end = i - 1;
        }
      }
      const ending: Ending = { bar: i, numbers: bar.ending, end: -1, group };
      if (late) ending.late = true;
      group.push(ending);
      endings.set(i, ending);
    }
    if (bar.repeatEnd !== undefined) {
      const start = group ? groupStart : open >= 0 ? open : afterEnd;
      const highest = group ? highestOf(group) : 0;
      const passes = Math.max(bar.repeatEnd, highest);
      if (!Number.isInteger(passes) || passes < 1) {
        problem(i, `invalid number of passes`);
      }
      repeats.set(i, { start, passes });
      const last = group?.[group.length - 1];
      if (last && last.end < 0) last.end = i;
      open = -1;
      afterEnd = i + 1;
    }
    if (group && bar.doubleBar) closeGroup(i);
  });
  closeGroup();
  if (open >= 0) problem(open, "a repeat starts without a repeat end");
  // the highest passes of a group apply to each of its repeat ends
  for (const ending of endings.values()) {
    const highest = highestOf(ending.group);
    for (const e of ending.group) {
      const repeat = repeats.get(e.end);
      if (repeat) repeat.passes = Math.max(repeat.passes, highest);
    }
  }

  const inside: boolean[] = bars.map(() => false);
  const mark = (from: number, to: number) => {
    for (let i = from; i <= to; i++) inside[i] = true;
  };
  repeats.forEach((repeat, end) => mark(repeat.start, end));
  endings.forEach((ending) => mark(ending.bar, ending.end));
  const starts = new Set([...repeats.values()].map((r) => r.start));
  const jump = jumpOf(bars, problem);
  for (const ending of endings.values()) {
    if (ending.late && !ending.numbers.includes(jump?.ending ?? NaN)) {
      problem(
        ending.bar,
        `ending ${ending.numbers} is after its group, and no jump goes to it`,
      );
    }
  }
  return { jump, repeats, starts, endings, inside, problems };
}

// The jump of a chart, checking its marks
function jumpOf(
  bars: ChartBar[],
  problem: (i: number, message: string) => void,
): JumpPlan | undefined {
  // the bar of each mark (one of each)
  const at: Record<string, number> = {};
  const once = (name: string, label: string, i: number) => {
    if (at[name] === undefined) at[name] = i;
    else problem(i, `a second ${label}`);
  };
  bars.forEach((bar, i) => {
    if (bar.segno) once("segno", "<Segno>", i);
    if (bar.coda) once("coda", "<Coda>", i);
    if (bar.toCoda) once("toCoda", "<To Coda>", i);
    if (bar.fine) once("fine", "<Fine>", i);
    if (bar.jump) once("jump", "jump", i);
  });
  const { segno, coda, toCoda, fine } = at;
  let bar = at.jump;
  let jump = bar !== undefined ? bars[bar].jump : undefined;
  // To Coda and Coda without a jump: a D.C. al Coda before the coda
  if (!jump && toCoda !== undefined && coda !== undefined && toCoda < coda) {
    bar = coda - 1;
    jump = "D.C. al Coda";
  }
  const alFine = jump?.endsWith("al Fine");
  const alCoda = jump?.endsWith("al Coda");
  const alEnding = /al (\d)\w\w ending$/.exec(jump ?? "");
  const endingNumber = alEnding ? Number(alEnding[1]) : undefined;
  let ok = true;
  const fail = (i: number, message: string) => {
    problem(i, message);
    ok = false;
  };
  if (fine !== undefined && !alFine && !alEnding) {
    fail(fine, "<Fine> without a D.C. al Fine or D.S. al Fine");
  }
  if (!alCoda && toCoda !== undefined) {
    fail(toCoda, "<To Coda> without a D.C. al Coda or D.S. al Coda");
  }
  if (!alCoda && coda !== undefined) {
    fail(coda, "<Coda> without a D.C. al Coda or D.S. al Coda");
  }
  if (!jump || bar === undefined) return undefined;
  const ds = jump.startsWith("D.S.");
  if (ds && segno === undefined) fail(bar, `${jump} without a <Segno>`);
  if (ds && segno !== undefined && segno > bar) {
    fail(segno, "<Segno> after the jump");
  }
  // (a segno nobody jumps to is only a sign)
  if (alFine && fine === undefined) fail(bar, `${jump} without a <Fine>`);
  if (alFine && fine !== undefined && fine > bar) {
    fail(fine, "<Fine> after the jump");
  }
  if (alCoda && (toCoda === undefined || coda === undefined)) {
    fail(bar, `${jump} without a <To Coda> and a <Coda>`);
  } else if (alCoda && (toCoda > bar || coda <= bar)) {
    fail(coda, "<To Coda> must come before the jump, and <Coda> after it");
  }
  if (
    endingNumber !== undefined &&
    !bars.some((b) => b.ending?.includes(endingNumber))
  ) {
    fail(bar, `${jump} without an ending ${endingNumber}`);
  }
  if (!ok) return undefined;
  const target = ds ? segno : 0;
  if (endingNumber !== undefined) {
    return { bar, target, stop: fine, ending: endingNumber };
  }
  if (alFine) return { bar, target, stop: fine };
  if (alCoda) return { bar, target, stop: toCoda, coda };
  return { bar, target };
}

// The bars to play, in order, with their chorus, pass and ending
type Step = { bar: number; chorus: number; pass: number; ending?: number };

// a guard against charts that would play for too long (":|x100000")
const MAX_BARS = 100000;

function playOrder(
  chart: Chart,
  choruses: number,
  repeatsOnJump: boolean,
): Step[] {
  const { jump, repeats, starts, endings, inside, problems } = structure(chart);
  if (problems.length) return [];
  // the ending each bar is in
  const endingOf = new Map<number, Ending>();
  endings.forEach((e) => {
    for (let i = e.bar; i <= e.end; i++) endingOf.set(i, e);
  });
  const steps: Step[] = [];

  // Play from a bar until the end of `stop` (or of the chart). After a jump,
  // repeats aren't taken (unless repeatsOnJump), and the endings are chosen
  // as on a pass past the last one
  const walk = (
    from: number,
    stop: number | undefined,
    chorus: number,
    afterJump: boolean,
    forced?: number, // the ending to take (after a jump al 2nd ending)
  ) => {
    const noRepeats = afterJump && !repeatsOnJump;
    let pass = 1;
    let back = false; // arrived by going back to a repeat start
    let i = from;
    while (i < chart.bars.length) {
      if (steps.length > MAX_BARS) return false;
      if (starts.has(i) && !back) pass = 1;
      back = false;
      const ending = endings.get(i);
      const isForced =
        forced !== undefined &&
        !!ending?.group.some((e) => e.numbers.includes(forced));
      const choice = isForced ? forced! : noRepeats ? Infinity : pass;
      if (ending?.late && !ending.numbers.includes(choice)) {
        // a late ending is only played when a jump goes to it
        i = ending.end + 1;
        continue;
      }
      if (ending && !ending.numbers.includes(choice)) {
        // the ending for this pass; past the last one, the last ending if it
        // doesn't repeat, or the bar after the endings
        const target = ending.group.find(
          (e) => e.numbers.includes(choice) && (!e.late || isForced),
        );
        const written = ending.group.filter((e) => !e.late);
        const last = written[written.length - 1];
        const next = target
          ? target.bar
          : repeats.has(last.end)
            ? last.end + 1
            : last.bar;
        if (next !== i) {
          i = next;
          continue;
        }
      }
      const step: Step = { bar: i, chorus, pass: inside[i] ? pass : 1 };
      const inEnding = endingOf.get(i);
      if (inEnding) {
        step.ending = inEnding.numbers.includes(choice)
          ? choice
          : Math.max(...inEnding.numbers);
      }
      steps.push(step);
      if (!inside[i]) pass = 1;
      const repeat = repeats.get(i);
      if (!noRepeats && repeat && pass < repeat.passes) {
        pass++;
        i = repeat.start;
        back = true;
        continue;
      }
      if (i === stop) return true;
      i++;
    }
    return true;
  };

  if (!jump) {
    for (let chorus = 1; chorus <= choruses; chorus++) {
      if (!walk(0, undefined, chorus, false)) return [];
    }
    return steps;
  }
  // a plain D.C. or D.S. is part of the tune: each chorus plays it
  if (
    jump.stop === undefined &&
    jump.coda === undefined &&
    jump.ending === undefined
  ) {
    for (let chorus = 1; chorus <= choruses; chorus++) {
      if (!walk(0, jump.bar, chorus, false)) return [];
      if (!walk(jump.target, undefined, chorus, true)) return [];
    }
    return steps;
  }
  // al Fine and al Coda: the part before the jump once per chorus (from the
  // start, then from where the jump goes back to); then, once, the jump and
  // the coda, which end the tune
  for (let chorus = 1; chorus <= choruses; chorus++) {
    const from = chorus === 1 ? 0 : jump.target;
    if (!walk(from, jump.bar, chorus, false)) return [];
  }
  if (!walk(jump.target, jump.stop, choruses, true, jump.ending)) return [];
  if (jump.coda !== undefined && !walk(jump.coda, undefined, choruses, false)) {
    return [];
  }
  return steps;
}

const chorusesOf = (options?: UnrollOptions) => {
  const choruses = options?.choruses ?? 1;
  return Number.isInteger(choruses) && choruses > 0 ? choruses : 0;
};

/**
 * Get the played form of a chart: every bar in the order it's played, with
 * where it starts (in quarter notes), its duration, its section, its place in
 * the section, its chorus, and its pass and ending in a repeat. `choruses`
 * plays the form more than once.
 *
 * Repeats and endings:
 *
 * - `:|` goes back to its `|:`, or, without one, to the start of the chart
 *   or the bar after the `:|` before. It plays 2 passes, `:|x3` three, and as
 *   many as the highest ending: `|1,2 ... :|3` plays three.
 * - On each pass, the ending for that pass is played and the others are
 *   skipped. When no ending is for the pass, the last ending is played if it
 *   doesn't repeat, and otherwise the endings are skipped.
 * - An ending with a `:|` ends there. The last one lasts until a `||`, or
 *   one bar.
 * - An ending can start a section: `[A] |: C |1 G :| [B] |2 F |` is one
 *   group of endings.
 * - An ending written after its group, outside any repeat (`|3` after `|1`
 *   and `|2`), belongs to the group and is only played by a jump al 3rd
 *   ending; without one, it's a problem.
 * - A `|:` inside a repeat, a `|:` without a `:|`, or an ending without any
 *   `:|` is a problem (`Chart.problems`), and the chart unrolls to `[]`.
 *
 * Jumps (one per chart, with one `<Segno>` and one `<Coda>`):
 *
 * - After the bar with a D.C. the play goes back to the start, and after a
 *   D.S. to the `<Segno>`. Then it goes on to the end, stops after the
 *   `<Fine>` (al Fine), or goes from the end of the `<To Coda>` bar to the
 *   `<Coda>` (al Coda). `<Fine>` and `<To Coda>` count only after the jump.
 * - After the jump, repeats aren't taken and the endings are chosen as on a
 *   pass past the last one (the last ending, if it doesn't repeat), unless
 *   `repeatsOnJump`.
 * - With `choruses` and an `al Fine` or `al Coda`, the part before the jump
 *   is played once per chorus (the first time from the start, then from
 *   where the jump goes back to), and the jump and the coda once, at the end
 *   of the last chorus: they end the tune. A plain D.C. or D.S. is part of
 *   the tune, so each chorus plays the whole tune with its jump.
 * - `<To Coda>` and `<Coda>` without a jump are a `<D.C. al Coda>` at the
 *   end of the bar before the coda.
 * - A jump al 1st, 2nd or 3rd ending goes back to the start or the sign,
 *   takes no repeats (unless `repeatsOnJump`) and plays that ending at the
 *   group of endings; then it goes on to the end, or stops at a `<Fine>`.
 *   With `choruses` it ends the tune, like `al Fine`.
 * - A `<Segno>` without a D.S. is only a sign.
 *
 * A run of a section starts at a bar that starts a section (`[A]`), or at a
 * new chorus, so `sectionBar` and `sectionLength` count within it: an AA
 * form is two runs, written out or with a repeat.
 *
 * It returns `[]` if the chart is empty or has a problem, or if `choruses`
 * isn't a positive integer.
 *
 * @param chart - a chart from `Chart.parse`
 * @param options - `choruses`: how many times the form is played (1)
 * @returns the played bars
 * @example
 * Chart.unroll(Chart.parse("[A] | C | G | [B] | F |")).map((b) => `${b.section}${b.sectionBar}`)
 * // => ["A0", "A1", "B0"]
 * Chart.unroll(Chart.parse("|: C |1 G :|2 F |")).map((b) => [b.bar, b.pass, b.ending])
 * // => [[0, 1, undefined], [1, 1, 1], [0, 2, undefined], [2, 2, 2]]
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
  const repeatsOnJump = options?.repeatsOnJump === true;
  const played: PlayedBar[] = playOrder(chart, choruses, repeatsOnJump).map(
    (step, index) => {
      const bar = chart.bars[step.bar];
      const duration = getMeter(bar.meter).bar;
      const played: PlayedBar = {
        bar: step.bar,
        index,
        start,
        duration,
        meter: bar.meter,
        section: sections[step.bar],
        sectionBar: 0,
        sectionLength: 0,
        chorus: step.chorus,
        pass: step.pass,
      };
      if (step.ending !== undefined) played.ending = step.ending;
      start = add(start, duration) as Fraction;
      return played;
    },
  );
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
 * Get the chords of a chart as they're played: each with its symbol
 * (`value`), where it starts and how long it lasts (in quarter notes from the
 * start of the played form), and its bar in the played form. A chord lasts until the next
 * chord, or the end of the form: a bar with no chords continues the chord
 * before, and a chord written again is played again (a new entry). `N.C.`
 * is a chord too, a rest, with `rest: true`: nothing plays until the next
 * chord (`Chord.get("N.C.")` has no notes and no tonic).
 *
 * It returns `[]` if the chart is empty or the options aren't valid.
 *
 * @param chart - a chart from `Chart.parse`
 * @param options - as in `Chart.unroll`
 * @returns the played chords
 * @example
 * Chart.chords(Chart.parse("| Dm7 G7 | Cmaj7 |")).map((c) => [c.value, c.start, c.duration])
 * // => [["Dm7", [0, 1], [2, 1]], ["G7", [2, 1], [2, 1]], ["Cmaj7", [4, 1], [4, 1]]]
 */
export function chords(chart: Chart, options?: UnrollOptions): PlayedChord[] {
  const played = unroll(chart, options);
  const list: Omit<PlayedChord, "duration">[] = [];
  for (const bar of played) {
    for (const chord of chart.bars[bar.bar].chords) {
      list.push({
        value: chord.value,
        start: add(bar.start, chord.at) as Fraction,
        bar: bar.index,
        ...(chord.rest ? { rest: true as const } : {}),
      });
    }
  }
  const last = played[played.length - 1];
  const end = last ? add(last.start, last.duration) : null;
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
 * Chart.chordAt(chords, 3)?.value // => "G7"
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

/**
 * Build a chart from named sections and a form: the sections in the order
 * the form lists them. Each section is a chart text (as in `Chart.parse`),
 * read on its own from `options.meter` (4/4 by default), so it has the same
 * meter wherever it's played; its first bar starts the section with its
 * name. The form is names separated by spaces, with `*n` to play one n
 * times: `"Intro A*2 B A"`. A form like `"AABA"` is read letter by letter
 * when there's no section with that name.
 *
 * Problems in a section are listed with its name. It returns a chart with
 * `empty: true` if a name in the form isn't a section (`Chart.problems`
 * says which) or the form is empty.
 *
 * @param sections - the chart text of each section, by name
 * @param form - the order of the sections, like "A A B A" or "Intro A*2 B"
 * @param options - `meter`: the time signature of every section
 * @returns the written chart
 * @example
 * const chart = Chart.fromForm({ A: "| C | G |", B: "| F |" }, "A A B A");
 * Chart.unroll(chart).map((b) => `${b.section}${b.sectionBar}`)
 * // => ["A0", "A1", "A0", "A1", "B0", "A0", "A1"]
 */
export function fromForm(
  sections: Record<string, string>,
  form: string,
  options?: ParseOptions,
): Chart {
  if (typeof sections !== "object" || sections === null) return EMPTY;
  if (typeof form !== "string") return EMPTY;
  const has = (name: string) =>
    Object.prototype.hasOwnProperty.call(sections, name) &&
    typeof sections[name] === "string";
  // each name, as many times as it's played
  const names: string[] = [];
  for (const token of form.split(/\s+/).filter(Boolean)) {
    const [, name, times] = /^(.+?)(?:\*(\d+))?$/.exec(token) as string[];
    const count = times === undefined ? 1 : +times;
    const letters = name.split("");
    const list = has(name)
      ? [name]
      : letters.length > 1 && letters.every(has)
        ? letters
        : undefined;
    if (!list) {
      return { ...EMPTY, problems: [`unknown section "${name}"`] };
    }
    for (let i = 0; i < count; i++) names.push(...list);
  }
  if (!names.length) return EMPTY;
  // each section is read once
  const parsed = new Map<string, Chart>();
  const problems: string[] = [];
  for (const name of new Set(names)) {
    const chart = parse(sections[name], options);
    parsed.set(name, chart);
    if (chart.empty) problems.push(`section "${name}" has no bars`);
    for (const problem of chart.problems) {
      problems.push(`section "${name}", ${problem}`);
    }
  }
  const bars: ChartBar[] = names.flatMap((name) =>
    (parsed.get(name) as Chart).bars.map((bar, i) =>
      i === 0 ? { ...bar, section: name } : { ...bar },
    ),
  );
  if (!bars.length) return { ...EMPTY, problems };
  return { empty: false, bars, problems };
}

/**
 * Write a chart as text, in the syntax of `Chart.parse`, so that parsing it
 * gives the same chart: `Chart.parse(Chart.toText(chart))` has the same
 * bars. Each section starts a line, and a line has at most 4 bars. Meters are
 * written where they change, and positions (`@`) only in the bars where the
 * chords aren't where the split rule would put them. `%` is written out as
 * the chords it repeats.
 *
 * It returns `""` if the chart is empty or isn't a chart.
 *
 * @param chart - a chart, from `Chart.parse` or `Chart.transpose`
 * @returns the chart as text
 * @example
 * Chart.toText(Chart.parse("[A] |: C | G7 :| [B] | F |"))
 * // => "[A] |: C | G7 :|\n[B] | F |"
 */
export function toText(chart: Chart): string {
  if (!isChart(chart) || chart.empty) return "";
  const lines: string[] = [];
  let line = "";
  let inLine = 0;
  let meterName = "4/4";
  // an empty bar is written between two plain bar lines: "| |"
  const empty = (bar?: ChartBar) => !!bar && !bar.chords.length;
  const padBefore = (text: string, bar: ChartBar) =>
    empty(bar) && text !== "|" ? `${text} |` : text;
  const padAfter = (text: string, bar?: ChartBar) =>
    empty(bar) && text !== "|" ? `| ${text}` : text;
  chart.bars.forEach((bar, i) => {
    const before = chart.bars[i - 1];
    const left = barLineBefore(bar);
    if (!before || bar.section !== undefined || inLine === 4) {
      if (before) {
        lines.push(`${line} ${padAfter(barLineAfter(before), before)}`);
      }
      const start = padBefore(left, bar);
      line = bar.section !== undefined ? `[${bar.section}] ${start}` : start;
      inLine = 0;
    } else {
      const right = barLineAfter(before);
      const join =
        right === "|"
          ? left
          : left === "|"
            ? right
            : // ":|" and "|2" are ":|2", but ":|x3" and "|2" stay apart
              /\d$/.test(right)
              ? `${right} ${left}`
              : `${right}${left.slice(1)}`;
      line += ` ${padBefore(padAfter(join, before), bar)}`;
    }
    const words: string[] = [];
    // a bar with only marks would give them to the next bar: its meter
    // keeps it a bar
    const marksOnly =
      !bar.chords.length &&
      !!(bar.segno || bar.coda || bar.toCoda || bar.fine || bar.jump);
    if (bar.meter !== meterName || marksOnly) words.push(bar.meter);
    meterName = bar.meter;
    if (bar.segno) words.push("<Segno>");
    if (bar.coda) words.push("<Coda>");
    words.push(...chordsText(bar));
    if (bar.toCoda) words.push("<To Coda>");
    if (bar.fine) words.push("<Fine>");
    if (bar.jump) words.push(`<${bar.jump}>`);
    line += words.length ? ` ${words.join(" ")}` : " ";
    inLine++;
  });
  const last = chart.bars[chart.bars.length - 1];
  lines.push(`${line} ${padAfter(barLineAfter(last), last)}`);
  return lines.join("\n");
}

// The bar line before a bar: a repeat start, an ending, or a plain one
function barLineBefore(bar: ChartBar): string {
  const marks: string[] = [];
  if (bar.repeatStart) marks.push("|:");
  if (bar.ending) marks.push(`|${bar.ending.join(",")}`);
  return marks.length ? marks.join(" ") : "|";
}

// The bar line after a bar: a repeat end, a double bar, or a plain one
function barLineAfter(bar: ChartBar): string {
  if (bar.repeatEnd !== undefined) {
    const times = bar.repeatEnd === 2 ? "" : `x${bar.repeatEnd}`;
    return `:|${bar.doubleBar ? "|" : ""}${times}`;
  }
  return bar.doubleBar ? "||" : "|";
}

// The chords of a bar, with positions when the split rule wouldn't place them
// there
function chordsText(bar: ChartBar): string[] {
  const m = getMeter(bar.meter);
  const items = bar.chords.map((c) => ({ value: c.value }));
  const placed = place(items, m, () => undefined);
  const moved = bar.chords.some(
    (c, i) => !placed[i] || compare(c.at, placed[i].at) !== 0,
  );
  return bar.chords.map((c) =>
    moved ? `${c.value}@${toBarBeat(c.at, m).slice(2)}` : c.value,
  );
}

/**
 * Transpose the chords of a chart by an interval, keeping everything else
 * (sections, meters, repeats, jumps, positions). `N.C.` stays. It returns a
 * chart with `empty: true` if the interval isn't valid or the chart is empty.
 *
 * @param chart - a chart, from `Chart.parse`
 * @param interval - the interval, like "4P" or "-2M"
 * @returns the transposed chart
 * @example
 * Chart.toText(Chart.transpose(Chart.parse("|: Dm7 G7 | C :|"), "2M"))
 * // => "|: Em7 A7 | D :|"
 */
export function transpose(chart: Chart, interval: string): Chart {
  if (!isChart(chart) || chart.empty) return EMPTY;
  if (!transposeChord("C", interval)) return EMPTY;
  return {
    ...chart,
    bars: chart.bars.map((bar) => ({
      ...bar,
      chords: bar.chords.map((chord) => ({
        ...chord,
        value:
          chord.value === "N.C."
            ? chord.value
            : transposeChord(chord.value, interval) || chord.value,
      })),
    })),
  };
}

/**
 * Get the bar of the played form at a position (in quarter notes from its
 * start, as a fraction, an exact number or a string), from the list
 * `Chart.unroll` gives: a bar from its start until the next one starts. It
 * returns `null` before the start, after the end, or if the position isn't
 * valid.
 *
 * @param played - the played form, from `Chart.unroll`
 * @param position - the position, in quarter notes
 * @returns the played bar, or null
 * @example
 * const played = Chart.unroll(Chart.parse("| C | 3/4 G | F |"));
 * Chart.barAt(played, 5)?.index // => 1
 * Chart.barAt(played, 10) // => null
 */
export function barAt(
  played: PlayedBar[],
  position: TimeValue,
): PlayedBar | null {
  const at = toFraction(position);
  if (!Array.isArray(played) || !played.length || !at) return null;
  if (compare(played[0].start, at) > 0) return null;
  let lo = 0;
  let hi = played.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (compare(played[mid].start, at) <= 0) lo = mid;
    else hi = mid - 1;
  }
  const bar = played[lo];
  const end = add(bar.start, bar.duration);
  return end && compare(at, end) < 0 ? bar : null;
}
