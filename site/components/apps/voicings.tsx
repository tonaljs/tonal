"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { useEffect, useMemo, useState } from "react";
import { Chord, Note, Progression, VoiceLeading, Voicing } from "tonal";
import {
  Chip,
  NoteSelect,
  PianoMessage,
  show,
  TONICS,
  Toggle,
} from "./controls";
import { keyboardRange, PianoKeyboard } from "./piano-keyboard";
import { PianoRoll, PianoRollLegend } from "./piano-roll";
import { audioTime } from "@/lib/piano";
import { usePiano } from "./use-piano";

type Options = Voicing.VoicingOptions;
type SequenceOptions = Voicing.SequenceOptions;

const EXAMPLES: { title: string; key: string; chart: string }[] = [
  { title: "ii–V–I", key: "C", chart: "| ii7 | V7 | Imaj7 | % |" },
  {
    title: "Autumn leaves",
    key: "Bb",
    chart: "| ii7 | V7 | Imaj7 | IVmaj7 |\n| viim7b5 | III7 | vim6 | % |",
  },
  {
    title: "Rhythm changes",
    key: "Bb",
    chart:
      "| I6 VI7 | ii7 V7 | iii7 VI7 | ii7 V7 |\n| v7 I7 | IV6 ivm6 | iii7 VI7 | ii7 V7 |",
  },
  {
    title: "Applied dominants",
    key: "F",
    chart: "| Imaj7 | V7/ii | ii7 | V7/V |\n| ii7 | V7 | I6 | % |",
  },
  { title: "Pop", key: "C", chart: "| I | V | vi | IV |\n| I | V | IV | % |" },
  {
    title: "Folk",
    key: "G",
    chart: "| I | IV | V | vi |\n| IV | I | Vsus4 V | I |",
  },
  {
    title: "Minor blues",
    key: "C",
    chart:
      "| im9 | ivm9 | im9 | % |\n| ivm9 | % | im9 | % |\n| bVI13 | V7alt | im9 | V7alt |",
  },
];

type Item = { numeral: string; symbol: string };

/**
 * Read a progression: bars between "|" (or on separate lines), chords
 * separated by spaces, "%" repeats the bar before. A chord is a roman
 * numeral in the key ("ii7", "V7/V", "bVII7") or a chord symbol ("Dm7").
 */
function parseProgression(text: string, key: string): Item[][] {
  const bars: Item[][] = [];
  for (const segment of text.split(/[|\n]/)) {
    const words = segment.trim().split(/\s+/).filter(Boolean);
    if (!words.length) continue;
    if (words.length === 1 && words[0] === "%") {
      bars.push(bars[bars.length - 1] ?? []);
      continue;
    }
    bars.push(
      words.map((word) => {
        if (/^[A-G]/.test(word)) {
          const symbol = Chord.get(word).empty ? "" : Chord.get(word).symbol;
          return { numeral: word, symbol };
        }
        const [symbol] = Progression.fromRomanNumerals(key, [word]);
        return { numeral: word, symbol: symbol ?? "" };
      }),
    );
  }
  return bars;
}

type State = {
  voices: number; // 0: the symbol's notes
  extensions: "" | "available";
  bass: "none" | "root" | "external";
  template: string;
  spacing: string;
  low: string;
  high: string;
  metric: "L1" | "L2" | "Linf";
};

const DEFAULTS: State = {
  voices: 0,
  extensions: "",
  bass: "none",
  template: "",
  spacing: "",
  low: "C3",
  high: "C5",
  metric: "L1",
};

const STYLES: { title: string; state: Partial<State> }[] = [
  { title: "The symbol", state: {} },
  { title: "Triads", state: { voices: 3 } },
  { title: "Pop piano", state: { voices: 3, bass: "root" } },
  {
    title: "Rootless (rules)",
    state: { voices: 4, extensions: "available", bass: "external" },
  },
  { title: "Rootless (template)", state: { template: "rootless" } },
  {
    title: "Piano + bass",
    state: { voices: 3, extensions: "available", bass: "root" },
  },
  { title: "Shells", state: { template: "shell", voices: 3 } },
  { title: "Drop 2", state: { voices: 4, spacing: "drop2" } },
  { title: "So What", state: { template: "so-what", high: "C6" } },
];

const SPACINGS = ["close", "open", "drop2", "drop3", "drop24", "spread"];

// every white key from C2 to C6, for the range
const RANGE_NOTES = Array.from({ length: 5 * 12 + 1 }, (_, i) =>
  Note.fromMidi(36 + i),
).filter((n) => !n.includes("b"));

// one bar lasts two seconds when it's played
const BAR = 2;

type Override = { voices?: number; template?: string; spacing?: string };

function toOptions(state: State): SequenceOptions {
  const options: SequenceOptions = {};
  if (state.voices) options.voices = state.voices;
  if (state.extensions) options.extensions = state.extensions;
  if (state.bass !== "none") options.bass = state.bass;
  if (state.template) options.template = state.template;
  if (state.spacing) options.spacing = state.spacing as Options["spacing"];
  if (state.low !== DEFAULTS.low || state.high !== DEFAULTS.high) {
    options.range = [state.low, state.high];
  }
  if (state.metric !== "L1") options.metric = state.metric;
  return options;
}

function overrideOptions(o: Override): Options {
  const options: Options = {};
  if (o.voices) options.voices = o.voices;
  if (o.template !== undefined) options.template = o.template || undefined;
  if (o.spacing !== undefined)
    options.spacing = (o.spacing || undefined) as Options["spacing"];
  return options;
}

const midiOf = (n: string) => Note.get(n).height;

export function Voicings() {
  const [text, setText] = useState(EXAMPLES[0].chart);
  const [key, setKey] = useState(EXAMPLES[0].key);
  const [state, setState] = useState<State>(DEFAULTS);
  const [overrides, setOverrides] = useState<Record<number, Override>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [linkRead, setLinkRead] = useState(false);
  const { status, play, playSteps, updateSteps, stop, playing } = usePiano();
  const [loop, setLoop] = useState(false);

  // read a shared link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chart = params.get("chart");
    if (chart) setText(chart);
    const linkKey = params.get("key") ?? "";
    if (!Note.get(linkKey).empty) setKey(Note.get(linkKey).pc);
    const read: Partial<State> = {};
    const voices = Number(params.get("voices"));
    if (voices >= 1 && voices <= 8) read.voices = voices;
    if (params.get("extensions") === "available") read.extensions = "available";
    const bass = params.get("bass");
    if (bass === "root" || bass === "external") read.bass = bass;
    const template = params.get("template");
    if (template && Voicing.templates().includes(template))
      read.template = template;
    const spacing = params.get("spacing");
    if (spacing && SPACINGS.includes(spacing)) read.spacing = spacing;
    for (const key of ["low", "high"] as const) {
      const note = params.get(key);
      if (note && Note.get(note).height !== null) read[key] = note;
    }
    const metric = params.get("metric");
    if (metric === "L2" || metric === "Linf") read.metric = metric;
    setState({ ...DEFAULTS, ...read });
    try {
      const o = JSON.parse(params.get("chords") ?? "{}");
      if (o && typeof o === "object") setOverrides(o);
    } catch {}
    setLinkRead(true);
  }, []);

  // keep the link up to date, to share it
  useEffect(() => {
    if (!linkRead) return;
    const params = new URLSearchParams({ key, chart: text });
    (Object.keys(DEFAULTS) as (keyof State)[]).forEach((key) => {
      if (state[key] !== DEFAULTS[key]) params.set(key, String(state[key]));
    });
    if (Object.keys(overrides).length) {
      params.set("chords", JSON.stringify(overrides));
    }
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString().replaceAll("+", "%20")}`,
    );
  }, [linkRead, key, text, state, overrides]);

  const bars = useMemo(() => parseProgression(text, key), [text, key]);
  const flatItems = bars.flat();
  const chords = flatItems.map((c) => c.symbol);
  const options = toOptions(state);
  const items = chords.map((chord, i) =>
    overrides[i] ? { chord, ...overrideOptions(overrides[i]) } : chord,
  );

  const voicings = useMemo(
    () => Voicing.sequence(items, options),
    // items and options are rebuilt from these on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [text, key, state, overrides],
  );
  // each chord on its own, to compare the motion
  const alone = useMemo(
    () =>
      chords.map((chord, i) => {
        const { maxLeap, metric, ...rest } = options as SequenceOptions;
        void maxLeap;
        void metric;
        return Voicing.get(chord, {
          ...rest,
          ...(overrides[i] ? overrideOptions(overrides[i]) : {}),
        });
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [text, key, state, overrides],
  );

  // the voicing before each chord (skipping chords without one)
  const previous = voicings.map((_, i) => {
    for (let j = i - 1; j >= 0; j--) if (voicings[j].length) return voicings[j];
    return [];
  });
  const motion = (list: string[][]) => {
    let total = 0;
    let last: string[] = [];
    for (const v of list) {
      if (!v.length) continue;
      if (last.length) total += VoiceLeading.distance(last, v) ?? 0;
      last = v;
    }
    return total;
  };

  const set = (patch: Partial<State>) => setState((s) => ({ ...s, ...patch }));
  const setOverride = (i: number, patch: Override) =>
    setOverrides((o) => {
      const next = { ...o, [i]: { ...o[i], ...patch } };
      const clean = Object.fromEntries(
        Object.entries(next[i]).filter(([, v]) => v !== undefined),
      );
      if (!Object.keys(clean).length) delete next[i];
      else next[i] = clean;
      return next;
    });

  const indexOf = (bar: number, chord: number) =>
    bars.slice(0, bar).reduce((n, b) => n + b.length, 0) + chord;
  // what the Play button plays: each chord's voicing for its share of the bar
  const steps = useMemo(
    () =>
      bars.flatMap((bar, b) =>
        bar.map((_, i) => ({
          notes:
            voicings[bars.slice(0, b).reduce((n, x) => n + x.length, 0) + i] ??
            [],
          duration: BAR / bar.length,
        })),
      ),
    [bars, voicings],
  );
  // a change while it plays (progression, key, style, loop): keep playing the
  // new voicings from the same point
  useEffect(() => {
    updateSteps(steps, { loop });
  }, [steps, loop, updateSteps]);

  const current = selected !== null ? voicings[selected] : undefined;

  // the piano roll: one unit per bar
  const roll = bars.flatMap((bar, b) =>
    bar.map((item, i) => ({
      notes: voicings[indexOf(b, i)] ?? [],
      start: b + i / bar.length,
      duration: 1 / bar.length,
      label: item.numeral,
      sublabel: item.symbol && item.symbol !== item.numeral ? item.symbol : "",
    })),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="voicings-input" className="text-sm font-medium">
          Progression: roman numerals (or chord symbols), bars between “|”
        </label>
        <textarea
          id="voicings-input"
          value={text}
          rows={3}
          onChange={(e) => {
            setText(e.target.value);
            setSelected(null);
            setOverrides({});
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
                setSelected(null);
                setOverrides({});
              }}
            >
              {example.title}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 text-sm">
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
          <NoteSelect
            label="Key"
            value={key}
            options={TONICS}
            onChange={setKey}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-fd-muted-foreground">Styles:</span>
          {STYLES.map((style) => (
            <Chip
              key={style.title}
              onClick={() => setState({ ...DEFAULTS, ...style.state })}
            >
              {style.title}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
          <Toggle
            stacked
            label="Voices"
            value={state.voices}
            options={[
              [0, "auto"],
              [2, "2"],
              [3, "3"],
              [4, "4"],
              [5, "5"],
              [6, "6"],
            ]}
            onChange={(voices) => set({ voices })}
          />
          <Toggle
            stacked
            label="Tensions"
            value={state.extensions}
            options={[
              ["", "the symbol's"],
              ["available", "available"],
            ]}
            onChange={(extensions) => set({ extensions })}
          />
          <Toggle
            stacked
            label="Bass"
            value={state.bass}
            options={[
              ["none", "in the voicing"],
              ["root", "bass part"],
              ["external", "bass player"],
            ]}
            onChange={(bass) => set({ bass })}
          />
        </div>
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
          <Select
            label="Template"
            value={state.template}
            options={["", ...Voicing.templates()]}
            empty="rules"
            onChange={(template) => set({ template })}
          />
          <Select
            label="Spacing"
            value={state.spacing}
            options={["", ...SPACINGS]}
            empty="any"
            onChange={(spacing) => set({ spacing })}
          />
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
            label="Voice leading"
            value={state.metric}
            options={[
              ["L1", "total"],
              ["L2", "Euclidean"],
              ["Linf", "largest leap"],
            ]}
            onChange={(metric) => set({ metric })}
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
            onClick={playing ? stop : () => playSteps(steps, { loop })}
            disabled={!voicings.some((v) => v.length)}
          >
            {playing ? "Stop" : "Play"}
          </button>
        </div>
      </div>
      <PianoMessage status={status} />

      {voicings.some((v) => v.length) ? (
        <section className="flex flex-col gap-2">
          <div className="overflow-x-auto rounded-xl border border-fd-border bg-fd-card p-2">
            <PianoRoll
              chords={roll}
              unit={112}
              selected={selected}
              playback={playing}
              secondsPerUnit={BAR}
              clock={audioTime}
              onSelect={(index) => {
                setSelected(index);
                if (voicings[index]?.length) play(voicings[index]);
              }}
            />
          </div>
          <PianoRollLegend />
        </section>
      ) : null}

      {bars.length ? (
        <ol className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-fd-border bg-fd-border sm:grid-cols-4">
          {bars.map((bar, b) => (
            <li key={b} className="flex min-h-28 gap-1 bg-fd-card p-1.5">
              {bar.map((c, i) => {
                const index = indexOf(b, i);
                return (
                  <VoicingCard
                    key={i}
                    text={c.numeral}
                    voicing={voicings[index]}
                    previous={previous[index]}
                    chord={c.symbol}
                    custom={!!overrides[index]}
                    selected={selected === index}
                    onClick={() => {
                      setSelected(index);
                      if (voicings[index].length) play(voicings[index]);
                    }}
                  />
                );
              })}
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-fd-muted-foreground">
          Write some bars, like “| Dm7 | G7 | Cmaj7 |”.
        </p>
      )}

      <p className="text-sm">
        The voices move{" "}
        <span className="font-mono font-bold">{motion(voicings)}</span>{" "}
        semitones in total along the progression.{" "}
        <span className="text-fd-muted-foreground">
          Voicing each chord on its own, they would move{" "}
          <span className="font-mono">{motion(alone)}</span>.
        </span>
      </p>

      {selected !== null && current ? (
        <VoicingDetails
          numeral={flatItems[selected]?.numeral ?? ""}
          chord={chords[selected]}
          voicing={current}
          previous={previous[selected]}
          override={overrides[selected] ?? {}}
          onOverride={(patch) => setOverride(selected, patch)}
          onPlay={() => play(current)}
        />
      ) : (
        <p className="text-sm text-fd-muted-foreground">
          Click a chord to hear it, see how its voices move, and give it its own
          options.
        </p>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">The code</h2>
        <DynamicCodeBlock
          lang="js"
          code={code(
            key,
            flatItems.map((c) => c.numeral),
            items,
            options,
            voicings,
            selected,
            previous,
          )}
        />
      </section>
    </div>
  );
}

function Select({
  label,
  value,
  options,
  empty,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  empty: string;
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
            {o || empty}
          </option>
        ))}
      </select>
    </label>
  );
}

function VoicingCard({
  text,
  chord,
  voicing,
  previous,
  custom,
  selected,
  onClick,
}: {
  text: string;
  chord: string;
  voicing: string[];
  previous: string[];
  custom: boolean;
  selected: boolean;
  onClick: () => void;
}) {
  const analysis = Voicing.analyze(voicing, chord);
  const moved =
    voicing.length && previous.length
      ? VoiceLeading.distance(previous, voicing)
      : null;
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex min-w-0 flex-1 flex-col items-start gap-0.5 rounded-md border px-2 py-1.5 text-start ${
        selected
          ? "border-sky-500 bg-sky-500/10"
          : "border-transparent hover:bg-fd-accent"
      }`}
    >
      <span className="max-w-full truncate font-mono text-base font-bold">
        {text}
        {custom ? <span className="text-sky-500"> *</span> : null}
      </span>
      {chord && chord !== text ? (
        <span className="max-w-full truncate font-mono text-xs text-fd-muted-foreground">
          {chord}
        </span>
      ) : null}
      {voicing.length ? (
        <>
          <span className="max-w-full font-mono text-xs leading-snug">
            {[...voicing].reverse().map((n) => (
              <span key={n} className="block">
                {n}
              </span>
            ))}
          </span>
          <span className="font-mono text-xs text-fd-muted-foreground">
            {analysis.spacing || "·"}
            {moved !== null ? ` · ${moved}` : ""}
          </span>
        </>
      ) : (
        <span className="text-xs text-fd-muted-foreground">no voicing</span>
      )}
    </button>
  );
}

function VoicingDetails({
  numeral,
  chord,
  voicing,
  previous,
  override,
  onOverride,
  onPlay,
}: {
  numeral: string;
  chord: string;
  voicing: string[];
  previous: string[];
  override: Override;
  onOverride: (patch: Override) => void;
  onPlay: () => void;
}) {
  const analysis = Voicing.analyze(voicing, chord);
  const { moves, distance } = VoiceLeading.get(previous, voicing);
  const heights = [...voicing, ...previous].map(midiOf) as number[];
  const [from, to] = keyboardRange(heights);
  const active = new Map(
    voicing.map((n, i) => [midiOf(n) as number, analysis.degrees[i] || n]),
  );
  const shaded = new Map(
    previous.map((n) => [midiOf(n) as number, Note.get(n).pc]),
  );
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-fd-border bg-fd-card p-4 md:p-6">
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex-1">
          <div className="font-mono text-3xl font-bold">
            {chord}
            {numeral && numeral !== chord ? (
              <span className="ms-3 text-xl text-fd-muted-foreground">
                {numeral}
              </span>
            ) : null}
          </div>
          <div className="mt-1 text-fd-muted-foreground">
            {voicing.join(" ")}
            {analysis.spacing ? ` · ${analysis.spacing}` : ""}
          </div>
        </div>
        <button
          type="button"
          className="rounded-lg bg-fd-primary px-4 py-2 font-medium text-fd-primary-foreground hover:opacity-90"
          onClick={onPlay}
        >
          Play
        </button>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <PianoKeyboard
            from={from}
            to={to}
            active={active}
            shaded={shaded}
            marked={midiOf(voicing[0]) as number}
            keyName={(midi) => Note.fromMidi(midi)}
            onKey={() => {}}
          />
        </div>
      </div>
      <p className="-mt-2 text-xs text-fd-muted-foreground">
        Pressed keys: this voicing, labelled with its degrees. Lighter keys: the
        voicing before.
      </p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        <Row term="Degrees">{analysis.degrees.join(" ")}</Row>
        <Row term="Chord steps">{analysis.steps.join(" ")}</Row>
        <Row term="Span">{analysis.span}</Row>
        {previous.length ? (
          <Row term="Voice leading">
            {moves.map(([a, b]) => `${a}→${b}`).join("  ")} ({distance})
          </Row>
        ) : null}
      </dl>
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3 text-sm">
        <span className="w-full font-medium">This chord's own options</span>
        <Toggle
          stacked
          label="Voices"
          value={override.voices ?? 0}
          options={[
            [0, "as all"],
            [2, "2"],
            [3, "3"],
            [4, "4"],
            [5, "5"],
            [6, "6"],
          ]}
          onChange={(voices) => onOverride({ voices: voices || undefined })}
        />
        <Select
          label="Template"
          value={override.template ?? "-"}
          options={["-", "", ...Voicing.templates()]}
          empty="rules"
          onChange={(t) => onOverride({ template: t === "-" ? undefined : t })}
        />
        <Select
          label="Spacing"
          value={override.spacing ?? "-"}
          options={["-", "", ...SPACINGS]}
          empty="any"
          onChange={(s) => onOverride({ spacing: s === "-" ? undefined : s })}
        />
      </div>
    </section>
  );
}

function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="text-fd-muted-foreground">{term}</dt>
      <dd className="font-mono">{children}</dd>
    </>
  );
}

// The tonal calls behind what the page shows
function code(
  key: string,
  numerals: string[],
  items: (string | { chord: string })[],
  options: SequenceOptions,
  voicings: string[][],
  selected: number | null,
  previous: string[][],
) {
  const first = items.slice(0, 8);
  const more = items.length > 8 ? " // the first 8 chords" : "";
  const opts = Object.keys(options).length ? `, ${show(options)}` : "";
  const symbols = numerals.slice(0, 8);
  const lines = [
    'import { Progression, Voicing, VoiceLeading } from "tonal";',
    "",
    `Progression.fromRomanNumerals(${show(key)}, ${show(symbols)});${more}`,
    `// => ${show(Progression.fromRomanNumerals(key, symbols))}`,
    "",
    `Voicing.sequence(${show(first)}${opts});`,
    ...voicings.slice(0, 8).map((v, i) => `// ${i ? "  " : "=>"} ${show(v)}`),
  ];
  if (selected !== null && voicings[selected]?.length) {
    const v = voicings[selected];
    const chord =
      typeof items[selected] === "string"
        ? (items[selected] as string)
        : (items[selected] as { chord: string }).chord;
    const a = Voicing.analyze(v, chord);
    lines.push(
      "",
      `Voicing.analyze(${show(v)}, ${show(chord)});`,
      `// => spacing: ${show(a.spacing)}, steps: ${show(a.steps)}, degrees: ${show(a.degrees)}`,
    );
    if (previous[selected].length) {
      lines.push(
        `VoiceLeading.distance(${show(previous[selected])}, ${show(v)}); // => ${VoiceLeading.distance(previous[selected], v)}`,
      );
    }
  }
  return lines.join("\n");
}
