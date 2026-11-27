// A walking bass line over a chord chart. The generator lives in the app:
// tonal gives the pieces (the played form and its chords, the chord's scale
// in a key, what a note is over a chord, approach notes, the octave of a note
// near another), and this file puts them together with its own rules.
//
// How a line is made:
//
// 1. The chart is played (`Chart.unroll`, `Chart.chords`) and cut into slots:
//    quarter notes when walking, half notes in two-feel.
// 2. A beam search walks the slots. On the first slot of a chord it places a
//    target (the root or slash bass, sometimes the 5th or 3rd); on the slot
//    before a new chord it places an approach to the next target, chosen with
//    the target (`Scale.approaches`); in between, chord and scale tones
//    (`Chord.classify` with the key) and chromatic passing notes. Each note
//    goes up or down from the one before (`Note.nearest`) inside the range.
// 3. Each choice has a cost from simple rules (below); a seeded random number
//    adds variety, so a seed gives the same line again.
// 4. Skips (an eighth ghost note before a target) are added to the line.
//
// The costs follow what real bass lines do (FiloBass, our counts: the root on
// 70% of beat 1s; into a chord change from a half step below 27%, a half step
// above 22%, a whole step above 12%, a fourth below 10%), set by hand for now.
import { Chart, Chord, Note, Scale, Time } from "tonal";

/** What a note does in the line. */
export type Role =
  "root" | "chord tone" | "scale tone" | "passing" | "approach" | "ghost";

/** A note of the line, in the shape of a tonal event. */
export type BassNote = {
  /** Where it starts, in quarter notes from the start of the played form */
  start: Time.Fraction;
  /** How long it lasts, in quarter notes */
  duration: Time.Fraction;
  /** The note, with octave (sounding pitch) */
  note: string;
  role: Role;
  /** The chord symbol it's played over */
  chord: string;
  /** Why this note, in words */
  why: string;
  /** Its bar in the played form, from 0 */
  bar: number;
};

export type Feel = "walk" | "two" | "head";

export type BassOptions = {
  /** A key or scale name, like "F major" */
  key: string;
  choruses: number;
  /** Walking in four, two-feel, or the head in two and the solos walking */
  feel: Feel;
  /** The lowest and highest notes (sounding) */
  range: [string, string];
  seed: number;
  /** How much to vary between near-best lines (0 to 2) */
  variety: number;
  /** How willing to use chromatic notes (0 to 2) */
  chromatic: number;
  /** How willing to leap (0 to 2) */
  leaps: number;
  /** The share of approach notes played with a skip (0 to 1) */
  skips: number;
};

export const DEFAULT_OPTIONS: BassOptions = {
  key: "F major",
  choruses: 2,
  feel: "head",
  range: ["E1", "G3"],
  seed: 1,
  variety: 1,
  chromatic: 1,
  leaps: 1,
  skips: 0.15,
};

// --- the slots -------------------------------------------------------------

/** A place for a note: a quarter (walking) or a half note (two-feel). */
type Slot = {
  start: number;
  duration: number;
  /** The chord symbol, or "" for no chord (N.C.) */
  chord: string;
  bar: number;
  /** The beat in the bar, from 0 */
  beat: number;
  /** The first slot of a chord */
  onset: boolean;
  two: boolean;
};

const num = (value: Time.TimeValue) => Time.toNumber(value) ?? 0;

// two-feel in the head (the first and last chorus), except in a bridge
function isTwoFeel(feel: Feel, bar: Chart.PlayedBar, choruses: number) {
  if (feel === "walk") return false;
  if (feel === "two") return true;
  const head = bar.chorus === 1 || bar.chorus === choruses;
  const bridge = /^(b|bridge)$/i.test(bar.section);
  return head && !bridge;
}

function slotsOf(text: string, options: BassOptions) {
  const chart = Chart.parse(text);
  const played = Chart.unroll(chart, { choruses: options.choruses });
  const chords = Chart.chords(chart, { choruses: options.choruses });
  const starts = new Set(chords.map((c) => num(c.start)));
  const slots: Slot[] = [];
  for (const bar of played) {
    const start = num(bar.start);
    const length = num(bar.duration);
    // halves only when every chord of the bar starts on beat 1 or 3
    const changes = [...starts].filter((s) => s > start && s < start + length);
    const two =
      isTwoFeel(options.feel, bar, options.choruses) &&
      length % 2 === 0 &&
      changes.every((s) => (s - start) % 2 === 0);
    const step = two ? 2 : 1;
    for (let beat = 0; beat + step <= length; beat += step) {
      const at = start + beat;
      const chord = Chart.chordAt(chords, at)?.value ?? "";
      const previous = slots[slots.length - 1];
      slots.push({
        start: at,
        duration: step,
        // no chord (N.C.) or a symbol tonal can't read: a rest
        chord: Chord.get(chord).tonic ? chord : "",
        bar: bar.index,
        beat,
        onset: starts.has(at) || !previous || previous.chord !== chord,
        two,
      });
    }
  }
  return { chart, slots };
}

// --- what tonal says about each chord ---------------------------------------

type Target = { pc: string; role: Role; cost: number; degree: string };

type ChordInfo = {
  symbol: string;
  /** The chord's scale in the key, like "G mixolydian" */
  scale: string;
  scaleNotes: string[];
  targets: Target[];
  /** The class of each pitch class (chroma 0-11) over the chord */
  classes: string[];
};

const CHROMAS = [
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

function chordInfo(symbol: string, key: string): ChordInfo {
  const scale =
    Chord.chordScale(symbol, { key }) || Chord.chordScale(symbol) || "";
  const formula = Chord.formula(symbol);
  const find = (...degrees: string[]) =>
    degrees.find((d) => formula.includes(d));
  const fifth = find("5", "b5", "#5");
  const third = find("3", "b3", "4");
  const targets: Target[] = [
    { pc: Chord.bass(symbol), role: "root", cost: 0, degree: "the root" },
  ];
  if (fifth) {
    targets.push({
      pc: Chord.noteOf(symbol, fifth),
      role: "chord tone",
      cost: 1.6,
      degree: `the ${fifth}`,
    });
  }
  if (third) {
    targets.push({
      pc: Chord.noteOf(symbol, third),
      role: "chord tone",
      cost: 2.6,
      degree: `the ${third}`,
    });
  }
  return {
    symbol,
    scale,
    scaleNotes: Scale.get(scale).notes,
    targets: targets.filter((t) => t.pc),
    classes: CHROMAS.map((pc) => Chord.classify(symbol, pc, { key })),
  };
}

// --- costs -------------------------------------------------------------------

const midi = (name: string) => Note.midi(name) ?? NaN;

function intervalCost(semitones: number, leaps: number) {
  const size = Math.abs(semitones);
  const base = [2.5, 0, 0, 0.4, 0.4, 0.8, 1.6, 1, 1.8, 1.8, 2.5, 2.5, 2.5];
  const cost = base[Math.min(size, 12)] ?? 4;
  return size >= 3 ? cost * leaps : cost;
}

// the role of a note in the middle of a chord, by beat strength
const MIDDLE: Record<string, number[]> = {
  // beat 1 (a chord held from the bar before), 2, 3, 4
  "chord tone": [0.2, 0.3, 0.1, 0.4],
  "scale tone": [1, 0.3, 0.8, 0.5],
  avoid: [3, 1.5, 2.5, 1.5],
  passing: [3.5, 1.2, 2.5, 1],
};

// approach kinds into a target, and their cost
const APPROACH: [keyof Scale.ApproachNotes, number, string][] = [
  ["below", 0, "a half step below"],
  ["above", 0.3, "a half step above"],
  ["scaleAbove", 0.7, "the scale note above"],
  ["dominantBelow", 0.8, "its fifth, a fourth below"],
  ["dominantAbove", 1.4, "its fifth, a fifth above"],
  ["scaleBelow", 1.4, "the scale note below"],
];

// two-note approaches, on the two slots before a target
const APPROACH2: [keyof Scale.ApproachNotes, number, string][] = [
  [
    "enclosure",
    1.1,
    "an enclosure: the scale note above, then a half step below",
  ],
  ["chromaticEnclosure", 1.4, "a chromatic enclosure"],
  ["doubleBelow", 1.3, "two half steps up"],
  ["doubleAbove", 1.5, "two half steps down"],
];

// --- the search --------------------------------------------------------------

type Step = {
  slot: number;
  note: string;
  midi: number;
  role: Role;
  why: string;
};

type State = {
  cost: number;
  /** The notes so far, last first */
  path: Step[];
  /** Notes already chosen for the next slots (an approach and its target) */
  pending: Step[];
};

/** A seeded random number generator (mulberry32). */
export function random(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BEAM = 48;

export type BassLine = {
  notes: BassNote[];
  /** The chords of the played form, for the labels */
  chords: { value: string; start: number; duration: number }[];
  /** The scale and the targets of each chord symbol */
  info: Record<string, ChordInfo>;
  problems: string[];
  /** The length of the played form, in quarter notes */
  length: number;
};

/** Make a walking bass line over a chart. */
export function walkingBass(text: string, options: BassOptions): BassLine {
  const { chart, slots } = slotsOf(text, options);
  const rnd = random(options.seed);
  const [low, high] = options.range.map(midi);
  const range = options.range;
  const centre = (low + high) / 2 - 4;

  const info: Record<string, ChordInfo> = {};
  for (const slot of slots) {
    if (slot.chord && !info[slot.chord]) {
      info[slot.chord] = chordInfo(slot.chord, options.key);
    }
  }

  const inRange = (name: string) => {
    const m = midi(name);
    return m >= low && m <= high;
  };
  const register = (m: number) =>
    Math.max(0, Math.abs(m - centre) - 7) * 0.25 +
    (m - low < 2 || high - m < 2 ? 0.5 : 0);
  const noise = () => rnd() * options.variety;

  // the octaves of a pitch class near the note before: one up, one down
  const near = (pc: string, previous?: Step) => {
    if (!previous) {
      // the first note: every octave in the range
      const list: string[] = [];
      for (let oct = 0; oct <= 7; oct++) {
        if (inRange(pc + oct)) list.push(pc + oct);
      }
      return list;
    }
    const up = Note.nearest(pc, previous.note, { direction: "up", range });
    const down = Note.nearest(pc, previous.note, { direction: "down", range });
    return [...new Set([up, down].filter(Boolean))];
  };

  // the cost of going from one note to another
  const move = (from: Step | undefined, to: string) => {
    if (!from) return register(midi(to));
    const d = midi(to) - from.midi;
    // a chromatic note resolves by step
    const resolve =
      (from.role === "passing" || from.role === "approach") && Math.abs(d) > 2
        ? 2
        : 0;
    return intervalCost(d, options.leaps) + register(midi(to)) + resolve;
  };

  // the figure of a bar repeats the bar before: a little more expensive
  const repeatsFigure = (path: Step[], slot: number) => {
    const bar = slots[slot].bar;
    const recent = path.slice(0, 10);
    const figure = (b: number) =>
      recent
        .filter((s) => slots[s.slot].bar === b)
        .map((s) => s.midi)
        .reverse();
    const a = figure(bar);
    const b = figure(bar - 1);
    if (a.length < 3 || a.length !== b.length) return false;
    const shape = (f: number[]) =>
      f
        .slice(1)
        .map((m, i) => m - f[i])
        .join();
    return shape(a) === shape(b);
  };

  // approach notes, by scale and target
  const memo = new Map<string, Scale.ApproachNotes>();
  const approachesTo = (scale: string, goal: string) => {
    const key = `${scale}|${goal}`;
    let found = memo.get(key);
    if (!found) {
      found = Scale.approaches(scale, goal);
      memo.set(key, found);
    }
    return found;
  };

  // the next slot with a chord after `i`, if it starts a new chord
  const nextTarget = (i: number) => {
    const next = slots[i + 1];
    return next && next.chord && next.onset ? next : undefined;
  };

  let beam: State[] = [{ cost: 0, path: [], pending: [] }];

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    const next: State[] = [];
    const push = (state: State, steps: Step[], cost: number) => {
      const [first, ...rest] = steps;
      const path = [first, ...state.path];
      let total = state.cost + cost + noise();
      if (slot.beat + slot.duration >= 4 && repeatsFigure(path, i))
        total += 1.5;
      next.push({ cost: total, path, pending: rest });
    };

    for (const state of beam) {
      const previous = state.path[0];
      // a rest (N.C.): no note
      if (!slot.chord) {
        next.push({ ...state, pending: [] });
        continue;
      }
      // a note chosen with the one before
      if (state.pending.length) {
        const [first, ...rest] = state.pending;
        next.push({
          cost: state.cost,
          path: [first, ...state.path],
          pending: rest,
        });
        continue;
      }
      const chord = info[slot.chord];
      const after =
        previous && slots[previous.slot + 1] === slot ? previous : undefined;

      // the first note of a chord, not prepared by an approach
      if (slot.onset) {
        for (const target of chord.targets) {
          for (const note of near(target.pc, after)) {
            const d = after ? midi(note) - after.midi : 1;
            const repeated = d === 0 ? 5 : 0;
            const unprepared = after && Math.abs(d) > 2 ? 0.8 : 0;
            push(
              state,
              [
                {
                  slot: i,
                  note,
                  midi: midi(note),
                  role: target.role,
                  why: `${target.degree} of ${slot.chord}`,
                },
              ],
              target.cost + move(after, note) + repeated + unprepared,
            );
          }
        }
        continue;
      }

      const role = (pc: string): Role => {
        const c = chord.classes[Note.chroma(pc) ?? 0];
        return c === "chord tone"
          ? "chord tone"
          : c === "tension"
            ? "scale tone"
            : "passing";
      };
      const roleCost = (pc: string) => {
        const c = chord.classes[Note.chroma(pc) ?? 0];
        const beat = Math.min(slot.beat, 3);
        if (slot.two) return c === "chord tone" ? 0 : c === "tension" ? 1 : 3;
        const table =
          c === "chord tone"
            ? MIDDLE["chord tone"]
            : c === "tension"
              ? MIDDLE["scale tone"]
              : c === "avoid"
                ? MIDDLE.avoid
                : MIDDLE.passing;
        const chromatic = c === "avoid" || c === "outside";
        return table[beat] * (chromatic ? options.chromatic : 1);
      };

      // the slot before a new chord: an approach, chosen with its target
      const target = nextTarget(i);
      if (target) {
        const nextChord = info[target.chord];
        for (const t of nextChord.targets) {
          for (const goal of near(t.pc, after)) {
            const approaches = approachesTo(nextChord.scale, goal);
            for (const [kind, cost, words] of APPROACH) {
              const note = approaches[kind] as string;
              if (!note || !inRange(note)) continue;
              const chromatic =
                kind === "below" || kind === "above" ? options.chromatic : 1;
              // in two-feel, beat 3 is more often a chord tone
              const two = slot.two ? 1.2 : 0;
              const d = midi(goal) - midi(note);
              push(
                state,
                [
                  {
                    slot: i,
                    note,
                    midi: midi(note),
                    role: "approach",
                    why: `approach to ${goal}: ${words}`,
                  },
                  {
                    slot: i + 1,
                    note: goal,
                    midi: midi(goal),
                    role: t.role,
                    why: `${t.degree} of ${target.chord}`,
                  },
                ],
                t.cost +
                  cost * chromatic +
                  two +
                  move(after, note) +
                  register(midi(goal)) +
                  (d === 0 ? 5 : 0),
              );
            }
          }
        }
      }

      // two slots before a new chord, in the same chord: a two-note approach
      const target2 =
        !target && slots[i + 1]?.chord === slot.chord
          ? nextTarget(i + 1)
          : undefined;
      if (target2 && !slots[i + 1].onset) {
        const nextChord = info[target2.chord];
        for (const t of nextChord.targets.slice(0, 1)) {
          for (const goal of near(t.pc, after)) {
            const approaches = approachesTo(nextChord.scale, goal);
            for (const [kind, cost, words] of APPROACH2) {
              const pair = approaches[kind] as string[];
              if (pair.length !== 2 || !pair.every(inRange)) continue;
              push(
                state,
                [
                  ...pair.map((note, k) => ({
                    slot: i + k,
                    note,
                    midi: midi(note),
                    role: "approach" as Role,
                    why: `approach to ${goal}: ${words}`,
                  })),
                  {
                    slot: i + 2,
                    note: goal,
                    midi: midi(goal),
                    role: t.role,
                    why: `${t.degree} of ${target2.chord}`,
                  },
                ],
                t.cost +
                  cost * options.chromatic +
                  move(after, pair[0]) +
                  intervalCost(midi(pair[1]) - midi(pair[0]), 1) +
                  register(midi(goal)),
              );
            }
          }
        }
      }

      // a note in the middle of the chord: a chord or scale tone, or a
      // chromatic passing note
      const pcs = new Set(chord.scaleNotes);
      for (const pc of pcs) {
        for (const note of near(pc, after)) {
          const repeated = after && midi(note) === after.midi ? 1 : 0;
          push(
            state,
            [
              {
                slot: i,
                note,
                midi: midi(note),
                role: role(pc),
                why: whyMiddle(slot.chord, pc, role(pc)),
              },
            ],
            roleCost(pc) + move(after, note) + repeated,
          );
        }
      }
      if (after) {
        for (const ivl of ["2m", "-2m"]) {
          const note = Note.simplify(Note.transpose(after.note, ivl));
          if (!note || !inRange(note) || pcs.has(Note.pitchClass(note))) {
            continue;
          }
          push(
            state,
            [
              {
                slot: i,
                note,
                midi: midi(note),
                role: "passing",
                why: `chromatic passing note, ${ivl === "2m" ? "up" : "down"} from ${after.note}`,
              },
            ],
            roleCost(Note.pitchClass(note)) + move(after, note),
          );
        }
      }
    }

    // a slot nothing could be played on: keep the line as it was
    if (!next.length) {
      beam = beam.map((state) => ({ ...state, pending: [] }));
      continue;
    }
    // keep the best states, one per last note and pending notes
    next.sort((a, b) => a.cost - b.cost);
    const seen = new Set<string>();
    beam = [];
    for (const state of next) {
      const key = [
        state.path[0]?.midi,
        state.path[1]?.midi,
        ...state.pending.map((s) => s.midi),
      ].join();
      if (seen.has(key)) continue;
      seen.add(key);
      beam.push(state);
      if (beam.length >= BEAM) break;
    }
  }

  const best = beam[0];
  const steps = best ? [...best.path].reverse() : [];
  const notes = withSkips(steps, slots, options, random(options.seed + 1));
  const chords = Chart.chords(chart, { choruses: options.choruses }).map(
    (c) => ({ value: c.value, start: num(c.start), duration: num(c.duration) }),
  );
  const last = slots[slots.length - 1];
  return {
    notes,
    chords,
    info,
    problems: chart.problems,
    length: last ? last.start + last.duration : 0,
  };
}

function whyMiddle(chord: string, pc: string, role: Role) {
  const degree = Chord.degreeOf(chord, pc);
  if (role === "chord tone") return `chord tone: the ${degree} of ${chord}`;
  if (role === "scale tone")
    return `scale tone: the ${degree}, in the chord's scale`;
  return `passing note: the ${degree}, outside the chord`;
}

// an approach in walking (or the last half in two-feel) can be played with a
// skip: the note, then the same note as a ghost on the swung eighth before
// the target
function withSkips(
  steps: Step[],
  slots: Slot[],
  options: BassOptions,
  rnd: () => number,
): BassNote[] {
  const notes: BassNote[] = [];
  for (const step of steps) {
    const slot = slots[step.slot];
    const base = {
      note: step.note,
      role: step.role,
      chord: slot.chord,
      why: step.why,
      bar: slot.bar,
    };
    const skip =
      step.role === "approach" &&
      slots[step.slot + 1]?.onset &&
      rnd() < options.skips;
    if (!skip) {
      notes.push({
        ...base,
        start: Time.fraction(slot.start)!,
        duration: Time.fraction(slot.duration)!,
      });
      continue;
    }
    const first = slot.duration - 0.5;
    notes.push({
      ...base,
      start: Time.fraction(slot.start)!,
      duration: Time.fraction(first)!,
    });
    notes.push({
      ...base,
      role: "ghost",
      why: "a skip: the note again, as a ghost note, on the eighth before the target",
      start: Time.fraction(slot.start + first)!,
      duration: Time.fraction(0.5)!,
    });
  }
  return notes;
}
