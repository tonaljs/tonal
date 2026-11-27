"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chord, Note, Scale, Time } from "tonal";
import { bandTime, playBand, stopBand } from "@/lib/band";
import {
  type BassLine,
  type BassNote,
  type BassOptions,
  DEFAULT_OPTIONS,
  type Feel,
  type Role,
  walkingBass,
} from "@/lib/walking-bass";
import { Chip, show, Toggle, TONICS } from "./controls";
import { PianoRoll, type RollChord } from "./piano-roll";

const EXAMPLES: { title: string; chart: string; key: string }[] = [
  {
    title: "Blues in F",
    key: "F major",
    chart:
      "[A] | F7 | Bb7 | F7 | Cm7 F7 |\n| Bb7 | Bdim7 | F7 | Am7 D7 |\n| Gm7 | C7 | F7 D7 | Gm7 C7 |",
  },
  {
    title: "Autumn leaves",
    key: "G minor",
    chart:
      "[A] |: Cm7 | F7 | Bbmaj7 | Ebmaj7 |\n| Am7b5 | D7 | Gm6 | % :|\n[B] | Am7b5 | D7 | Gm6 | % |\n| Cm7 | F7 | Bbmaj7 | Ebmaj7 |\n[C] | Am7b5 | D7 | Gm7 C7 | Fm7 Bb7 |\n| Am7b5 | D7 | Gm6 | % |",
  },
  {
    title: "Rhythm changes",
    key: "Bb major",
    chart:
      "[A] |: Bbmaj7 G7 | Cm7 F7 | Dm7 G7 | Cm7 F7 |\n| Fm7 Bb7 | Ebmaj7 Ab7 | Dm7 G7 | Cm7 F7 :|\n[B] | D7 | % | G7 | % |\n| C7 | % | F7 | % |\n[A] | Bbmaj7 G7 | Cm7 F7 | Dm7 G7 | Cm7 F7 |\n| Fm7 Bb7 | Ebmaj7 Ab7 | Cm7 F7 | Bbmaj7 |",
  },
  {
    title: "ii V I",
    key: "C major",
    chart: "| Dm7 | G7 | Cmaj7 | % |",
  },
];

const ROLES: [Role, string, string][] = [
  ["root", "fill-sky-600", "bg-sky-600"],
  ["chord tone", "fill-sky-400", "bg-sky-400"],
  ["scale tone", "fill-emerald-500", "bg-emerald-500"],
  ["passing", "fill-amber-500", "bg-amber-500"],
  ["approach", "fill-rose-500", "bg-rose-500"],
  ["ghost", "fill-fd-muted-foreground", "bg-fd-muted-foreground"],
];
const fillOf = (role: Role) => ROLES.find((r) => r[0] === role)?.[1] ?? "";
const bgOf = (role: Role) => ROLES.find((r) => r[0] === role)?.[2] ?? "";

const RANGES: [string, [string, string]][] = [
  ["E1–G3", ["E1", "G3"]],
  ["E1–C4", ["E1", "C4"]],
  ["B0–G3", ["B0", "G3"]],
];

type State = {
  key: string;
  choruses: number;
  feel: Feel;
  range: string;
  seed: number;
  variety: number;
  chromatic: number;
  leaps: number;
  skips: number;
  tempo: number;
  ride: boolean;
};

const DEFAULTS: State = {
  key: EXAMPLES[0].key,
  choruses: DEFAULT_OPTIONS.choruses,
  feel: DEFAULT_OPTIONS.feel,
  range: RANGES[0][0],
  seed: 1,
  variety: 1,
  chromatic: 1,
  leaps: 1,
  skips: 1,
  tempo: 160,
  ride: true,
};

const num = (value: Time.TimeValue) => Time.toNumber(value) ?? 0;

export function WalkingBass() {
  const [text, setText] = useState(EXAMPLES[0].chart);
  const [state, setState] = useState<State>(DEFAULTS);
  const [selected, setSelected] = useState<number | null>(null);
  const [loop, setLoop] = useState(true);
  const [linkRead, setLinkRead] = useState(false);
  const set = (patch: Partial<State>) => setState((s) => ({ ...s, ...patch }));

  // read a shared link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chart = params.get("chart");
    if (chart) setText(chart);
    const read: Record<string, unknown> = {};
    for (const [name, value] of Object.entries(DEFAULTS)) {
      const param = params.get(name);
      if (param === null) continue;
      if (typeof value === "number" && Number.isFinite(Number(param))) {
        read[name] = Number(param);
      } else if (typeof value === "boolean") {
        read[name] = param === "true";
      } else if (typeof value === "string") {
        read[name] = param;
      }
    }
    const next = { ...DEFAULTS, ...read } as State;
    if (!["walk", "two", "head"].includes(next.feel)) next.feel = DEFAULTS.feel;
    if (!RANGES.some((r) => r[0] === next.range)) next.range = DEFAULTS.range;
    if (Scale.get(next.key).empty) next.key = DEFAULTS.key;
    next.choruses = Math.min(4, Math.max(1, Math.round(next.choruses)));
    setState(next);
    setLinkRead(true);
  }, []);

  // keep the link up to date, to share it
  useEffect(() => {
    if (!linkRead) return;
    const params = new URLSearchParams({ chart: text });
    (Object.keys(DEFAULTS) as (keyof State)[]).forEach((name) => {
      if (state[name] !== DEFAULTS[name]) params.set(name, String(state[name]));
    });
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString().replaceAll("+", "%20")}`,
    );
  }, [linkRead, text, state]);

  const options: BassOptions = useMemo(
    () => ({
      key: state.key,
      choruses: state.choruses,
      feel: state.feel,
      range: RANGES.find((r) => r[0] === state.range)?.[1] ?? RANGES[0][1],
      seed: state.seed,
      variety: state.variety,
      chromatic: state.chromatic,
      leaps: state.leaps,
      skips: state.skips,
    }),
    [state],
  );
  const line = useMemo(() => walkingBass(text, options), [text, options]);
  const note = selected !== null ? line.notes[selected] : undefined;

  // playback
  const { play, stop, playing, status } = useBand();
  const playLine = useCallback(
    () => play(line, state.tempo, state.ride, loop),
    [play, line, state.tempo, state.ride, loop],
  );
  // a new line, tempo or ride while playing: play it again from the start
  const restart = useRef(playLine);
  restart.current = playLine;
  const isPlaying = !!playing;
  useEffect(() => {
    // only when what plays changes, not when playback starts
    if (isPlaying) restart.current();
  }, [line, state.tempo, state.ride]);

  const unit = 18;
  const rollNotes: RollChord[] = useMemo(() => {
    const onsets = new Map(line.chords.map((c) => [c.start, c.value]));
    return line.notes.map((n) => {
      const start = num(n.start);
      return {
        notes: [n.note],
        start,
        duration: num(n.duration),
        label: onsets.get(start) ?? "",
        className: fillOf(n.role),
      };
    });
  }, [line]);

  const [tonic, mode] = splitKey(state.key);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2 text-sm">
          {EXAMPLES.map((e) => (
            <Chip
              key={e.title}
              pressed={text === e.chart}
              onClick={() => {
                setText(e.chart);
                set({ key: e.key });
                setSelected(null);
              }}
            >
              {e.title}
            </Chip>
          ))}
        </div>
        <label className="flex flex-col gap-1">
          <span className="font-medium">Chart</span>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setSelected(null);
            }}
            rows={4}
            spellCheck={false}
            className="rounded-lg border border-fd-border bg-fd-background p-2 font-mono text-sm"
          />
        </label>
        {line.problems.length ? (
          <p className="text-sm text-amber-600">{line.problems.join("; ")}</p>
        ) : null}
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3 text-sm">
          <label className="flex flex-col gap-1">
            <span className="font-medium">Key</span>
            <span className="flex gap-1">
              <select
                value={tonic}
                onChange={(e) => set({ key: `${e.target.value} ${mode}` })}
                className="rounded-lg border border-fd-border bg-fd-background px-2 py-1.5"
              >
                {(TONICS.includes(tonic) ? TONICS : [tonic, ...TONICS]).map(
                  (t) => (
                    <option key={t}>{t}</option>
                  ),
                )}
              </select>
              <select
                value={mode}
                onChange={(e) => set({ key: `${tonic} ${e.target.value}` })}
                className="rounded-lg border border-fd-border bg-fd-background px-2 py-1.5"
              >
                <option>major</option>
                <option>minor</option>
              </select>
            </span>
          </label>
          <Toggle
            stacked
            label="Feel"
            value={state.feel}
            options={[
              ["head", "Head in two"],
              ["walk", "Walking"],
              ["two", "Two-feel"],
            ]}
            onChange={(feel) => set({ feel })}
          />
          <Toggle
            stacked
            label="Choruses"
            value={state.choruses}
            options={[
              [1, "1"],
              [2, "2"],
              [3, "3"],
              [4, "4"],
            ]}
            onChange={(choruses) => set({ choruses })}
          />
          <Toggle
            stacked
            label="Range"
            value={state.range}
            options={RANGES.map(([name]) => [name, name])}
            onChange={(range) => set({ range })}
          />
        </div>
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3 text-sm">
          <Slider
            label="Variety"
            value={state.variety}
            onChange={(variety) => set({ variety })}
          />
          <Slider
            label="Chromatic"
            value={state.chromatic}
            onChange={(chromatic) => set({ chromatic })}
          />
          <Slider
            label="Leaps"
            value={state.leaps}
            onChange={(leaps) => set({ leaps })}
          />
          <Slider
            label="Between the beats"
            value={state.skips}
            onChange={(skips) => set({ skips })}
            format={(v) => `×${v.toFixed(1)}`}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <button
            type="button"
            className="rounded-lg bg-fd-primary px-3 py-1.5 font-medium text-fd-primary-foreground"
            onClick={() => (playing ? stop() : playLine())}
          >
            {playing ? "Stop" : "Play"}
          </button>
          <button
            type="button"
            className="rounded-lg border border-fd-border px-3 py-1.5 hover:bg-fd-accent"
            onClick={() => {
              set({ seed: state.seed + 1 });
              setSelected(null);
            }}
          >
            New line
          </button>
          <span className="text-fd-muted-foreground">seed {state.seed}</span>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={loop}
              onChange={(e) => setLoop(e.target.checked)}
            />
            Loop
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={state.ride}
              onChange={(e) => set({ ride: e.target.checked })}
            />
            Ride
          </label>
          <label className="flex items-center gap-2">
            Tempo
            <input
              type="range"
              min={60}
              max={280}
              step={5}
              value={state.tempo}
              onChange={(e) => set({ tempo: Number(e.target.value) })}
            />
            <span className="w-8 tabular-nums">{state.tempo}</span>
          </label>
          {status === "loading" ? (
            <span className="text-fd-muted-foreground">
              Loading the bass and drums…
            </span>
          ) : status === "error" ? (
            <span className="text-fd-muted-foreground">
              The samples could not be loaded.
            </span>
          ) : null}
        </div>
        <div className="overflow-x-auto rounded-lg border border-fd-border p-2">
          <PianoRoll
            chords={rollNotes}
            unit={unit}
            selected={selected}
            onSelect={setSelected}
            playback={playing}
            secondsPerUnit={60 / state.tempo}
            clock={bandTime}
          />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-fd-muted-foreground">
          {ROLES.map(([role, , bg]) => (
            <span key={role} className="flex items-center gap-1">
              <span className={`h-2.5 w-2.5 rounded-sm ${bg}`} />
              {role}
            </span>
          ))}
        </div>
        {note ? (
          <NoteDetail note={note} line={line} keyName={state.key} />
        ) : (
          <p className="text-sm text-fd-muted-foreground">
            Click a note to see why it was chosen.
          </p>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Bar by bar</h2>
        <Bars line={line} selected={selected} onSelect={setSelected} />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">With tonal</h2>
        <p className="text-sm text-fd-muted-foreground">
          tonal gives the pieces; the search that puts them together, its costs
          and the random choices live in the app (
          <code>lib/walking-bass.ts</code>).
        </p>
        <DynamicCodeBlock lang="js" code={code(line, state, note)} />
        <p className="text-sm text-fd-muted-foreground">
          How often a bass plays each kind of note, interval and approach comes
          from our counts of{" "}
          <a
            href="https://aim-qmul.github.io/FiloBass"
            className="underline hover:text-fd-foreground"
          >
            FiloBass
          </a>
          , 48 transcribed jazz walking bass lines (Jasper Riley and Simon
          Dixon, &ldquo;FiloBass: A Dataset and Corpus Based Study of Jazz
          Basslines&rdquo;, ISMIR 2023). Only rounded percentages are used, not
          the transcriptions; the shapes of a bar (chromatic climbs, arpeggios,
          scale runs) are set by hand from bass method practice and only checked
          against them.
        </p>
      </section>
    </div>
  );
}

function splitKey(key: string): [string, string] {
  const [tonic = "C", mode = "major"] = key.split(" ");
  return [tonic, mode];
}

function Slider({
  label,
  value,
  onChange,
  max = 2,
  step = 0.1,
  format = (v) => v.toFixed(1),
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  step?: number;
  format?: (value: number) => string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-medium">
        {label}{" "}
        <span className="text-fd-muted-foreground">{format(value)}</span>
      </span>
      <input
        type="range"
        min={0}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

function NoteDetail({
  note,
  line,
  keyName,
}: {
  note: BassNote;
  line: BassLine;
  keyName: string;
}) {
  const info = line.info[note.chord];
  return (
    <div className="rounded-lg border border-fd-border p-3 text-sm">
      <p>
        <span className="font-mono font-bold">{note.note}</span> over{" "}
        <span className="font-mono font-bold">{note.chord}</span>,{" "}
        <span
          className={`rounded px-1.5 py-0.5 text-xs text-white ${bgOf(note.role)}`}
        >
          {note.role}
        </span>
        : {note.why}.
      </p>
      <p className="text-fd-muted-foreground">
        Bar {note.bar + 1}, beat {(num(note.start) % 4) + 1}. Over this chord in{" "}
        {keyName}, {Note.pitchClass(note.note)} is{" "}
        {classWords(Chord.classify(note.chord, note.note, { key: keyName }))};
        the chord's scale is {info?.scale || "unknown"}.
      </p>
    </div>
  );
}

function classWords(c: string) {
  return c === "chord tone"
    ? "a chord tone"
    : c === "tension"
      ? "a tension (in the chord's scale)"
      : c === "avoid"
        ? "an avoid note"
        : "outside the chord's scale";
}

function Bars({
  line,
  selected,
  onSelect,
}: {
  line: BassLine;
  selected: number | null;
  onSelect: (index: number) => void;
}) {
  const bars: { bar: number; chords: string[]; notes: [BassNote, number][] }[] =
    [];
  line.notes.forEach((n, i) => {
    let row = bars[bars.length - 1];
    if (!row || row.bar !== n.bar) {
      row = { bar: n.bar, chords: [], notes: [] };
      bars.push(row);
    }
    if (!row.chords.includes(n.chord)) row.chords.push(n.chord);
    row.notes.push([n, i]);
  });
  return (
    <div className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
      {bars.map((row) => (
        <div
          key={row.bar}
          className="flex flex-wrap items-center gap-1 rounded border border-fd-border px-2 py-1"
        >
          <span className="w-6 text-fd-muted-foreground tabular-nums">
            {row.bar + 1}
          </span>
          <span className="w-24 font-mono font-bold">
            {row.chords.join(" ")}
          </span>
          {row.notes.map(([n, i]) => (
            <button
              key={i}
              type="button"
              title={`${n.role}: ${n.why}`}
              onClick={() => onSelect(i)}
              className={`rounded px-1.5 font-mono text-xs text-white ${bgOf(n.role)} ${
                selected === i ? "ring-2 ring-fd-foreground" : ""
              }`}
            >
              {n.note}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

// The tonal calls behind the line, for the selected note (or the first one)
function code(line: BassLine, state: State, selected: BassNote | undefined) {
  const note = selected ?? line.notes[0];
  if (!note) return 'import { Chart } from "tonal";';
  const key = state.key;
  const index = line.notes.indexOf(note);
  const next = line.notes.slice(index + 1).find((n) => n.role !== "ghost");
  const scale = line.info[note.chord]?.scale ?? "";
  const lines = [
    'import { Chart, Chord, Scale } from "tonal";',
    "",
    "// the chords of the played form, in quarter notes",
    `const chords = Chart.chords(Chart.parse(chart), { choruses: ${state.choruses} });`,
    `// => [${line.chords
      .slice(0, 2)
      .map(
        (c) =>
          `{ value: ${show(c.value)}, start: ${show(Time.fraction(c.start))}, duration: ${show(Time.fraction(c.duration))} }`,
      )
      .join(", ")}, …]`,
    "",
    `// the chord's scale in the key`,
    `Chord.chordScale(${show(note.chord)}, { key: ${show(key)} });`,
    `// => ${show(scale)}`,
    "",
    "// what the note is over the chord",
    `Chord.classify(${show(note.chord)}, ${show(note.note)}, { key: ${show(key)} });`,
    `// => ${show(Chord.classify(note.chord, note.note, { key }))}`,
  ];
  if (note.role === "approach" && next) {
    const nextScale = line.info[next.chord]?.scale ?? "";
    const a = Scale.approaches(nextScale, next.note);
    lines.push(
      "",
      `// the approach notes to the next target, ${next.note}`,
      `Scale.approaches(${show(nextScale)}, ${show(next.note)});`,
      `// => { below: ${show(a.below)}, above: ${show(a.above)}, scaleBelow: ${show(a.scaleBelow)}, scaleAbove: ${show(a.scaleAbove)}, dominantBelow: ${show(a.dominantBelow)}, … }`,
    );
  }
  return lines.join("\n");
}

type BandStatus = "idle" | "loading" | "ready" | "error";

// Play the line with a bass and a ride, once or in a loop
function useBand() {
  const [status, setStatus] = useState<BandStatus>("idle");
  const [playing, setPlaying] = useState<{
    start: number;
    duration: number;
    loop?: boolean;
  } | null>(null);
  const run = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const clear = useCallback(() => {
    run.current++;
    clearTimeout(timer.current);
    setPlaying(null);
  }, []);

  useEffect(
    () => () => {
      run.current++;
      clearTimeout(timer.current);
      void stopBand();
    },
    [],
  );

  const play = useCallback(
    (line: BassLine, tempo: number, ride: boolean, loop: boolean) => {
      clear();
      void stopBand();
      const id = run.current;
      const notes = line.notes.map((n) => ({
        start: num(n.start),
        duration: num(n.duration),
        note: n.note,
        ghost: n.role === "ghost",
      }));
      setStatus((s) => (s === "ready" ? s : "loading"));
      const turn = (at?: number) =>
        playBand(notes, { length: line.length, tempo, ride, at }).then(
          (playback) => {
            if (id !== run.current) return;
            setStatus("ready");
            setPlaying({ ...playback, loop });
            const end = playback.start + playback.duration;
            timer.current = setTimeout(
              () => {
                if (id !== run.current) return;
                if (loop) void turn(end);
                else setPlaying(null);
              },
              Math.max(0, (end - bandTime() - 0.4) * 1000),
            );
          },
          () => setStatus("error"),
        );
      void turn();
    },
    [clear],
  );

  const stop = useCallback(() => {
    clear();
    void stopBand();
  }, [clear]);

  return { play, stop, playing, status };
}
