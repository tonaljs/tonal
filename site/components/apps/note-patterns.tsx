"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { useEffect, useMemo, useState } from "react";
import {
  Chart,
  Chord,
  Note,
  Pattern,
  RhythmPattern,
  Scale,
  Time,
  Voicing,
} from "tonal";
import { audioTime } from "@/lib/piano";
import {
  Chip,
  NoteSelect,
  PianoMessage,
  show as showJson,
  TONICS,
  Toggle,
} from "./controls";
import { PianoRoll, PianoRollLegend } from "./piano-roll";
import { usePiano } from "./use-piano";

// JSON for the code panel, with a space after the commas between numbers too
const show = (value: unknown) => showJson(value).replace(/,(?=[-\d[])/g, ", ");

// What the indexes are played over
type Pool = "voicing" | "chord" | "scale";
type Kind = "arpeggio" | "sequence";
type Fold = "off" | "whole" | "each";

type State = {
  kind: Kind;
  // arpeggio
  order: string;
  octaves: number;
  model: "expand" | "per-octave";
  // sequence
  cell: string;
  step: number;
  count: number;
  alternate: boolean;
  // the notes
  pool: Pool;
  voices: number; // 0: the symbol's notes
  // register
  low: string;
  high: string;
  fold: Fold;
  rhythm: string;
};

const DEFAULTS: State = {
  kind: "arpeggio",
  order: "up",
  octaves: 1,
  model: "expand",
  cell: "0 1 2 4",
  step: 1,
  count: 2,
  alternate: false,
  pool: "voicing",
  voices: 0,
  low: "C3",
  high: "C6",
  fold: "off",
  rhythm: "eighths",
};

const RHYTHMS: { id: string; title: string; pattern: number[] }[] = [
  {
    id: "eighths",
    title: "eighths",
    pattern: RhythmPattern.fromDurations(Array(8).fill(1)),
  },
  {
    id: "triplets",
    title: "triplets",
    pattern: RhythmPattern.fromDurations(Array(12).fill(1)),
  },
  {
    id: "sixteenths",
    title: "sixteenths",
    pattern: RhythmPattern.fromDurations(Array(16).fill(1)),
  },
  { id: "tresillo", title: "tresillo", pattern: RhythmPattern.euclid(8, 3) },
  { id: "e58", title: "E(5, 8)", pattern: RhythmPattern.euclid(8, 5) },
  {
    id: "son",
    title: "son clave",
    pattern: RhythmPattern.fromDurations([3, 3, 4, 2, 4]),
  },
  {
    id: "bossa",
    title: "bossa nova",
    pattern: RhythmPattern.fromDurations([3, 3, 4, 3, 3]),
  },
];

const SCALES = [
  "major",
  "minor",
  "dorian",
  "mixolydian",
  "harmonic minor",
  "melodic minor",
  "major pentatonic",
  "minor pentatonic",
];

const EXAMPLES: { title: string; chart: string; key: string; scale: string }[] =
  [
    {
      title: "ii–V–I",
      chart: "| Dm7 | G7 | Cmaj7 | % |",
      key: "C",
      scale: "major",
    },
    {
      title: "Pop",
      chart: "| C | G/B | Am | F |",
      key: "C",
      scale: "major",
    },
    {
      title: "Autumn leaves",
      chart: "| Cm7 | F7 | Bbmaj7 | Ebmaj7 |\n| Am7b5 | D7 | Gm6 | % |",
      key: "G",
      scale: "minor",
    },
    {
      title: "Modal vamp",
      chart: "| Dm9 | % | Em7 | % |",
      key: "D",
      scale: "dorian",
    },
    {
      title: "Minor blues",
      chart:
        "| Cm7 | % | % | % |\n| Fm7 | % | Cm7 | % |\n| Ab7 | G7 | Cm7 | G7 |",
      key: "C",
      scale: "minor pentatonic",
    },
  ];

const STYLES: { title: string; state: Partial<State> }[] = [
  { title: "Arpeggio up", state: {} },
  {
    title: "Up-down, 2 octaves",
    state: { order: "up-down", octaves: 2, rhythm: "sixteenths" },
  },
  {
    title: "Per octave",
    state: {
      order: "up-down",
      octaves: 2,
      model: "per-octave",
      rhythm: "sixteenths",
    },
  },
  {
    title: "Pinky",
    state: { order: "pinky-up-down", voices: 4, rhythm: "sixteenths" },
  },
  {
    title: "Thumb, chord tones",
    state: { order: "thumb-up", pool: "chord", octaves: 2, rhythm: "triplets" },
  },
  {
    title: "Converge, tresillo",
    state: { order: "converge-diverge", rhythm: "tresillo" },
  },
  {
    title: "1-2-3-5",
    state: {
      kind: "sequence",
      cell: "0 1 2 4",
      step: 1,
      count: 2,
      pool: "scale",
    },
  },
  {
    title: "Thirds up and down",
    state: {
      kind: "sequence",
      cell: "0 2",
      step: 1,
      count: 4,
      alternate: true,
      pool: "scale",
    },
  },
  {
    title: "Groups of 4",
    state: {
      kind: "sequence",
      cell: "0 1 2 3",
      step: 1,
      count: 4,
      pool: "scale",
      rhythm: "sixteenths",
    },
  },
  {
    title: "Down in 3s",
    state: {
      kind: "sequence",
      cell: "6 5 4",
      step: -1,
      count: 4,
      pool: "scale",
      rhythm: "triplets",
    },
  },
];

// every white key from C2 to C7, for the register
const RANGE_NOTES = Array.from({ length: 5 * 12 + 1 }, (_, i) =>
  Note.fromMidi(36 + i),
).filter((n) => !n.includes("b"));

// a quarter note lasts half a second when it's played (a 4/4 bar, 2 seconds)
const QUARTER = 0.5;

const parseCell = (text: string) =>
  text
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(Number);

type Segment = {
  /** The chord as written, and its symbol ("" if it isn't a chord) */
  text: string;
  symbol: string;
  /** The notes the indexes are played over */
  pool: string[];
  /** The note of each index, and the code that makes it */
  realise: (index: number) => string;
  over: string;
  /** The code before it, if any */
  setup: string[];
  indexes: number[];
  notes: string[];
  /** Where the chord starts and ends, in quarter notes */
  from: Time.Fraction;
  to: Time.Fraction;
};

type Event = {
  segment: number;
  index: number;
  note: string;
  start: number;
  duration: number;
};

function indexesFor(state: State, n: number): number[] {
  if (state.kind === "sequence") {
    const groups = Pattern.sequence(
      parseCell(state.cell),
      state.step,
      state.count,
    );
    return (state.alternate ? Pattern.alternate(groups) : groups).flat();
  }
  if (state.model === "expand") {
    return Pattern.arpeggio(state.order, n * state.octaves);
  }
  return Pattern.sequence(
    Pattern.arpeggio(state.order, n),
    n,
    state.octaves,
  ).flat();
}

export function NotePatterns() {
  const [text, setText] = useState(EXAMPLES[0].chart);
  const [key, setKey] = useState(EXAMPLES[0].key);
  const [scaleType, setScaleType] = useState(EXAMPLES[0].scale);
  const [state, setState] = useState<State>(DEFAULTS);
  const [selected, setSelected] = useState<number | null>(null);
  const [loop, setLoop] = useState(true);
  const [linkRead, setLinkRead] = useState(false);
  const { status, play, playSteps, updateSteps, stop, playing } = usePiano();
  const set = (patch: Partial<State>) => setState((s) => ({ ...s, ...patch }));

  // read a shared link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chart = params.get("chart");
    if (chart) setText(chart);
    const linkKey = params.get("key") ?? "";
    if (!Note.get(linkKey).empty) setKey(Note.get(linkKey).pc);
    const scale = params.get("scale") ?? "";
    if (SCALES.includes(scale)) setScaleType(scale);
    const read: Record<string, unknown> = {};
    for (const [name, value] of Object.entries(DEFAULTS)) {
      const param = params.get(name);
      if (param === null) continue;
      if (typeof value === "number" && Number.isInteger(Number(param))) {
        read[name] = Number(param);
      } else if (typeof value === "boolean") {
        read[name] = param === "true";
      } else if (typeof value === "string") {
        read[name] = param;
      }
    }
    const next = { ...DEFAULTS, ...read } as State;
    if (!Pattern.arpeggios().includes(next.order as never))
      next.order = DEFAULTS.order;
    if (!RHYTHMS.some((r) => r.id === next.rhythm))
      next.rhythm = DEFAULTS.rhythm;
    setState(next);
    setLinkRead(true);
  }, []);

  // keep the link up to date, to share it
  useEffect(() => {
    if (!linkRead) return;
    const params = new URLSearchParams({ key, scale: scaleType, chart: text });
    (Object.keys(DEFAULTS) as (keyof State)[]).forEach((name) => {
      if (state[name] !== DEFAULTS[name]) params.set(name, String(state[name]));
    });
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString().replaceAll("+", "%20")}`,
    );
  }, [linkRead, key, scaleType, text, state]);

  // the chart, its played form and its chords, from Chart
  const chart = useMemo(() => Chart.parse(text), [text]);
  const form = useMemo(() => Chart.unroll(chart), [chart]);
  const playedChords = useMemo(() => Chart.chords(chart), [chart]);
  const rhythm = (RHYTHMS.find((r) => r.id === state.rhythm) ?? RHYTHMS[0])
    .pattern;
  const stepsPerBar = rhythm.length;
  const scaleName = `${key} ${scaleType}`;
  const range: [string, string] = [state.low, state.high];

  const segments = useMemo(() => {
    const flat = playedChords.map((c) => ({
      chord: Chord.get(c.value),
      from: c.start,
      to: Time.add(c.start, c.duration) as Time.Fraction,
    }));
    const symbols = flat.map(({ chord }) =>
      chord.empty || !chord.notes.length ? "" : chord.symbol,
    );
    // the voicings, with voice leading from one chord to the next
    const voicings = Voicing.sequence(
      symbols.filter(Boolean),
      state.voices
        ? {
            voices: state.voices,
            range: [state.low, state.high] as [string, string],
          }
        : { range: [state.low, state.high] as [string, string] },
    );
    let v = 0;
    return flat.map(({ chord, from, to }, i): Segment => {
      const symbol = symbols[i];
      let pool: string[] = [];
      let realise: (index: number) => string = () => "";
      let over = "";
      let setup: string[] = [];
      // the chord's tonic in the lowest octave of the range
      const tonic = chord.tonic ?? "";
      const [root = ""] = tonic
        ? Note.fold([tonic], [state.low, state.high])
        : [];
      const placed = [
        `const [root] = Note.fold(${show([tonic])}, ${show([state.low, state.high])});`,
        `// => ${show([root])}`,
      ];
      if (symbol && state.pool === "voicing") {
        pool = voicings[v] ?? [];
        realise = Voicing.steps(pool);
        over = "Voicing.steps(voicing)";
      } else if (symbol && state.pool === "chord") {
        realise = Chord.steps(symbol, root);
        pool = chord.notes.map((_, j) => realise(j));
        over = `Chord.steps(${show(symbol)}, root)`;
        setup = placed;
      } else if (symbol) {
        // the scale of the key, from the chord's root (or the nearest note)
        const start = Scale.nearest(scaleName, root);
        realise = (index) => Scale.transposeBySteps(scaleName, start, index);
        pool = Scale.get(scaleName).notes.map((_, j) => realise(j));
        over = `(i) => Scale.transposeBySteps(${show(scaleName)}, start, i)`;
        setup = [
          ...placed,
          `const start = Scale.nearest(${show(scaleName)}, root); // => ${show(start)}`,
        ];
      }
      if (symbol) v++;
      const indexes = pool.length ? indexesFor(state, pool.length) : [];
      const played = indexes.map(realise);
      const notes =
        state.fold === "off" || !played.length
          ? played
          : Note.fold(played, range, { each: state.fold === "each" });
      return {
        text: chord.empty ? playedChords[i].value : chord.symbol,
        symbol,
        pool,
        realise,
        over,
        setup,
        indexes,
        notes,
        from,
        to,
      };
    });
    // the state, the chart and the scale make the segments
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playedChords, state, scaleName]);

  // a note on each onset of the rhythm, in every played bar (each step lasts
  // the bar's length over the steps); the pattern starts again with each chord
  const events = useMemo(() => {
    const segmentOf = new Map(playedChords.map((c, i) => [c, i]));
    const positions = form.flatMap((bar) =>
      Time.onsets(rhythm, Time.div(bar.duration, rhythm.length) ?? 0, bar.start),
    );
    const count = new Map<number, number>();
    const list: Event[] = [];
    positions.forEach((position, p) => {
      const chord = Chart.chordAt(playedChords, position);
      const s = chord ? segmentOf.get(chord) : undefined;
      if (s === undefined) return;
      const segment = segments[s];
      if (!segment.notes.length) return;
      const j = count.get(s) ?? 0;
      count.set(s, j + 1);
      const k = j % segment.notes.length;
      if (!segment.notes[k]) return;
      // until the next onset, or the end of the chord
      const next = positions[p + 1];
      const end =
        next && Time.compare(next, segment.to) < 0 ? next : segment.to;
      const start = Time.toNumber(position) ?? 0;
      list.push({
        segment: s,
        index: segment.indexes[k],
        note: segment.notes[k],
        start,
        duration: (Time.toNumber(end) ?? 0) - start,
      });
    });
    return list;
  }, [form, playedChords, segments, rhythm]);

  const last = form[form.length - 1];
  const total = last
    ? (Time.toNumber(Time.add(last.start, last.duration) ?? 0) ?? 0)
    : 0;
  // what Play plays: the notes, and rests where there are none
  const timeline = useMemo(() => {
    const steps: { notes: string[]; duration: number }[] = [];
    let time = 0;
    for (const e of events) {
      if (e.start > time) {
        steps.push({ notes: [], duration: (e.start - time) * QUARTER });
      }
      steps.push({ notes: [e.note], duration: e.duration * QUARTER });
      time = e.start + e.duration;
    }
    if (total > time) {
      steps.push({ notes: [], duration: (total - time) * QUARTER });
    }
    return steps;
  }, [events, total]);

  useEffect(() => {
    updateSteps(timeline, { loop });
  }, [timeline, loop, updateSteps]);

  const roll = events.map((e, i) => ({
    notes: [e.note],
    start: e.start,
    duration: e.duration,
    label:
      i === 0 || events[i - 1].segment !== e.segment
        ? segments[e.segment].text
        : "",
    sublabel: String(e.index),
  }));
  const current = selected !== null ? events[selected] : undefined;
  const first = segments.find((s) => s.notes.length);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="patterns-input" className="text-sm font-medium">
          Chords: bars between “|”, with sections, meters, repeats and jumps as
          in the chart reader
        </label>
        <textarea
          id="patterns-input"
          value={text}
          rows={2}
          onChange={(e) => {
            setText(e.target.value);
            setSelected(null);
          }}
          spellCheck={false}
          autoComplete="off"
          className="rounded-lg border border-fd-border bg-fd-background px-3 py-2 font-mono text-base outline-none focus:ring-2 focus:ring-fd-ring"
        />
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-fd-muted-foreground">Try:</span>
          {EXAMPLES.map((example) => (
            <Chip
              key={example.title}
              onClick={() => {
                setText(example.chart);
                setKey(example.key);
                setScaleType(example.scale);
                setSelected(null);
              }}
            >
              {example.title}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <span className="text-fd-muted-foreground">Patterns:</span>
        {STYLES.map((style) => (
          <Chip
            key={style.title}
            onClick={() => {
              setState({ ...DEFAULTS, ...style.state });
              setSelected(null);
            }}
          >
            {style.title}
          </Chip>
        ))}
      </div>

      <div className="flex flex-col gap-4 text-sm">
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
          <Toggle
            stacked
            label="Pattern"
            value={state.kind}
            options={[
              ["arpeggio", "arpeggio"],
              ["sequence", "sequence"],
            ]}
            onChange={(kind) => set({ kind })}
          />
          {state.kind === "arpeggio" ? (
            <>
              <Select
                label="Order"
                value={state.order}
                options={Pattern.arpeggios()}
                onChange={(order) => set({ order })}
              />
              <Toggle
                stacked
                label="Octaves"
                value={state.octaves}
                options={[
                  [1, "1"],
                  [2, "2"],
                  [3, "3"],
                ]}
                onChange={(octaves) => set({ octaves })}
              />
              <Toggle
                stacked
                label="More octaves"
                value={state.model}
                options={[
                  ["expand", "expand first"],
                  ["per-octave", "order per octave"],
                ]}
                onChange={(model) => set({ model })}
              />
            </>
          ) : (
            <>
              <label className="flex flex-col gap-1">
                <span className="font-medium">Cell (from 0)</span>
                <input
                  value={state.cell}
                  onChange={(e) => set({ cell: e.target.value })}
                  spellCheck={false}
                  className="w-28 rounded-lg border border-fd-border bg-fd-background px-2 py-1.5 font-mono"
                />
              </label>
              <Toggle
                stacked
                label="Step"
                value={state.step}
                options={[
                  [-2, "-2"],
                  [-1, "-1"],
                  [0, "0"],
                  [1, "1"],
                  [2, "2"],
                ]}
                onChange={(step) => set({ step })}
              />
              <Toggle
                stacked
                label="Groups"
                value={state.count}
                options={[
                  [1, "1"],
                  [2, "2"],
                  [3, "3"],
                  [4, "4"],
                  [8, "8"],
                ]}
                onChange={(count) => set({ count })}
              />
              <label className="flex items-center gap-2 pb-1.5">
                <input
                  type="checkbox"
                  checked={state.alternate}
                  onChange={(e) => set({ alternate: e.target.checked })}
                />
                Every other group backwards
              </label>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
          <Toggle
            stacked
            label="Over"
            value={state.pool}
            options={[
              ["voicing", "the voicing"],
              ["chord", "the chord tones"],
              ["scale", "the scale, from the root"],
            ]}
            onChange={(pool) => set({ pool })}
          />
          {state.pool === "voicing" ? (
            <Toggle
              stacked
              label="Voices"
              value={state.voices}
              options={[
                [0, "auto"],
                [3, "3"],
                [4, "4"],
                [5, "5"],
              ]}
              onChange={(voices) => set({ voices })}
            />
          ) : null}
          {state.pool === "scale" ? (
            <>
              <NoteSelect
                label="Key"
                value={key}
                options={TONICS}
                onChange={setKey}
              />
              <Select
                label="Scale"
                value={scaleType}
                options={SCALES}
                onChange={setScaleType}
              />
            </>
          ) : null}
        </div>

        <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
          <NoteSelect
            label="Lowest"
            value={state.low}
            options={RANGE_NOTES}
            onChange={(low) => set({ low })}
          />
          <NoteSelect
            label="Highest"
            value={state.high}
            options={RANGE_NOTES}
            onChange={(high) => set({ high })}
          />
          <Toggle
            stacked
            label="Fold into the range"
            value={state.fold}
            options={[
              ["off", "no"],
              ["whole", "the whole figure"],
              ["each", "each note"],
            ]}
            onChange={(fold) => set({ fold })}
          />
          <Select
            label="Rhythm"
            value={state.rhythm}
            options={RHYTHMS.map((r) => r.id)}
            labels={Object.fromEntries(RHYTHMS.map((r) => [r.id, r.title]))}
            onChange={(rhythm) => set({ rhythm })}
          />
          <label className="ms-auto flex items-center gap-2">
            <input
              type="checkbox"
              checked={loop}
              onChange={(e) => setLoop(e.target.checked)}
            />
            Loop
          </label>
          <button
            type="button"
            className="rounded-lg bg-fd-primary px-3 py-1.5 font-medium text-fd-primary-foreground hover:opacity-90"
            onClick={playing ? stop : () => playSteps(timeline, { loop })}
            disabled={!events.length}
          >
            {playing ? "Stop" : "Play"}
          </button>
        </div>
      </div>
      <PianoMessage status={status} />

      {events.length ? (
        <section className="flex flex-col gap-2">
          <div className="overflow-x-auto rounded-xl border border-fd-border bg-fd-card p-2">
            <PianoRoll
              chords={roll}
              unit={
                (Math.max(14, Math.round(160 / stepsPerBar)) * stepsPerBar) / 4
              }
              selected={selected}
              playback={playing}
              secondsPerUnit={QUARTER}
              clock={audioTime}
              onSelect={(i) => {
                setSelected(i);
                play([events[i].note]);
              }}
            />
          </div>
          <p className="text-xs text-fd-muted-foreground">
            Below each note: its index. The pattern starts again with each
            chord, and a note lasts until the next one.
          </p>
          <PianoRollLegend />
        </section>
      ) : (
        <p className="text-fd-muted-foreground">
          {segments.length
            ? "No notes: check the cell, or the chords."
            : "Write some bars, like “| Dm7 | G7 | Cmaj7 |”."}
        </p>
      )}

      {current ? (
        <p className="text-sm">
          <span className="font-mono font-bold">{current.note}</span> is index{" "}
          <span className="font-mono">{current.index}</span> over{" "}
          <span className="font-mono">
            {segments[current.segment].pool.join(" ")}
          </span>{" "}
          ({segments[current.segment].text}).
        </p>
      ) : null}

      {segments.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-start text-fd-muted-foreground">
              <tr>
                <th className="py-1 pe-4 text-start font-medium">Chord</th>
                <th className="py-1 pe-4 text-start font-medium">Over</th>
                <th className="py-1 pe-4 text-start font-medium">Indexes</th>
                <th className="py-1 text-start font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {segments.map((s, i) =>
                i > 0 &&
                segments[i - 1].text === s.text &&
                segments[i - 1].notes.join() === s.notes.join() ? null : (
                  <tr key={i} className="border-t border-fd-border align-top">
                    <td className="py-1 pe-4 font-bold">{s.text}</td>
                    <td className="py-1 pe-4">{s.pool.join(" ")}</td>
                    <td className="py-1 pe-4">{s.indexes.join(" ")}</td>
                    <td className="py-1">{s.notes.join(" ")}</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      ) : null}

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">The code</h2>
        <DynamicCodeBlock lang="js" code={code(state, first, range, rhythm)} />
      </section>
    </div>
  );
}

function Select({
  label,
  value,
  options,
  labels = {},
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  labels?: Record<string, string>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-medium">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-fd-border bg-fd-background px-2 py-1.5"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {labels[o] ?? o}
          </option>
        ))}
      </select>
    </label>
  );
}

// The tonal calls behind what the page shows, for the first chord
function code(
  state: State,
  segment: Segment | undefined,
  range: [string, string],
  rhythm: number[],
) {
  if (!segment) return 'import { Pattern } from "tonal";';
  const modules = new Set(["Pattern", "RhythmPattern"]);
  const lines: string[] = [];
  const n = segment.pool.length;
  let indexes: string;
  if (state.kind === "sequence") {
    const cell = parseCell(state.cell);
    const call = `Pattern.sequence(${show(cell)}, ${state.step}, ${state.count})`;
    const groups = Pattern.sequence(cell, state.step, state.count);
    indexes = state.alternate ? `Pattern.alternate(${call})` : call;
    lines.push(
      `${indexes};`,
      `// => ${show(state.alternate ? Pattern.alternate(groups) : groups)}`,
      "",
    );
    indexes += ".flat()";
  } else {
    indexes =
      state.model === "expand"
        ? `Pattern.arpeggio(${show(state.order)}, ${n}${state.octaves > 1 ? ` * ${state.octaves}` : ""})`
        : `Pattern.sequence(Pattern.arpeggio(${show(state.order)}, ${n}), ${n}, ${state.octaves}).flat()`;
    lines.push(`${indexes};`, `// => ${show(segment.indexes)}`, "");
  }
  if (state.pool === "voicing") {
    modules.add("Voicing");
    lines.push(
      `const voicing = ${show(segment.pool)}; // ${segment.symbol}, from Voicing.sequence`,
    );
  } else {
    modules.add(state.pool === "chord" ? "Chord" : "Scale");
    modules.add("Note");
    lines.push(...segment.setup);
  }
  lines.push(
    `const notes = ${indexes}.map(${segment.over});`,
    `// => ${show(segment.indexes.map(segment.realise))}`,
  );
  if (state.fold !== "off") {
    modules.add("Note");
    lines.push(
      "",
      `Note.fold(notes, ${show(range)}${state.fold === "each" ? ", { each: true }" : ""});`,
      `// => ${show(segment.notes)}`,
    );
  }
  lines.push(
    "",
    "// a note on each onset",
    `RhythmPattern.toOnsets(${show(rhythm)});`,
    `// => ${show(RhythmPattern.toOnsets(rhythm))}`,
  );
  return [
    `import { ${[...modules].sort().join(", ")} } from "tonal";`,
    "",
    ...lines,
  ].join("\n");
}
