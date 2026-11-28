"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { useEffect, useMemo, useState } from "react";
import { Chart, Chord, Key, Note, Scale, Voicing } from "tonal";
import type { TimedNotes } from "@/lib/piano";
import { audioTime } from "@/lib/piano";
import { voice } from "@/lib/voice";
import { Chip, PianoMessage, show, TONICS, Toggle } from "./controls";
import { usePiano } from "./use-piano";

type Reading = ReturnType<typeof Key.analyzeChord>[number];
type Substitute = ReturnType<typeof Key.substitutes>[number];

const EXAMPLES: { title: string; chart: string }[] = [
  { title: "ii–V–I", chart: "| Dm7 | G7 | Cmaj7 | Cmaj7 |" },
  {
    title: "Turnaround",
    chart:
      "| Cmaj7 | Am7 | Dm7 | G7 |\n| Cmaj7 A7 | Dm7 G7 | Em7 A7 | Dm7 G7 |",
  },
  {
    title: "Minor ii–V–i",
    chart: "| Bm7b5 | E7 | Am7 | Am7 |\n| Dm7 | G7 | Cmaj7 | E7 |",
  },
  {
    title: "Jazz blues",
    chart:
      "| F7 | Bb7 | F7 | Cm7 F7 |\n| Bb7 | Bo7 | F7 | D7 |\n| Gm7 | C7 | F7 D7 | Gm7 C7 |",
  },
  {
    title: "Rhythm changes",
    chart:
      "| Bbmaj7 G7 | Cm7 F7 | Dm7 G7 | Cm7 F7 |\n| Fm7 Bb7 | Ebmaj7 Ab7 | Dm7 G7 | Cm7 F7 |",
  },
  {
    title: "Pop",
    chart: "| C | G | Am | F |\n| C | G | F | F |",
  },
];

// a quarter note lasts half a second (120 bpm), a bar has four
const QUARTER = 0.5;
const BAR = 4;

const FUNCTION_COLORS: Record<string, string> = {
  T: "border-l-sky-500",
  SD: "border-l-violet-500",
  D: "border-l-amber-500",
  "": "border-l-neutral-400",
};
const FUNCTION_NAMES: Record<string, string> = {
  T: "tonic",
  SD: "subdominant",
  D: "dominant",
  "": "no function",
};

const KEYS = TONICS.flatMap((t) => [`${t} major`, `${t} minor`]);

// The chords of a chart, bar by bar (repeats and jumps are read, not played)
function readBars(text: string): string[][] {
  return Chart.parse(text).bars.map((bar) => bar.chords.map((c) => c.value));
}

// Bars back to text, four to a line
function writeBars(bars: string[][]): string {
  const lines: string[] = [];
  for (let i = 0; i < bars.length; i += 4) {
    const line = bars
      .slice(i, i + 4)
      .map((b) => ` ${b.join(" ")} `)
      .join("|");
    lines.push(`|${line}|`);
  }
  return lines.join("\n");
}

type Slot = { bar: number; index: number; chord: string; flat: number };

export function Reharmonizer() {
  const [text, setText] = useState(EXAMPLES[1].chart);
  const [keyChoice, setKeyChoice] = useState("auto");
  const [selected, setSelected] = useState<number | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [target, setTarget] = useState("G major");
  const [pivotSevenths, setPivotSevenths] = useState(true);
  const [pivotChromatic, setPivotChromatic] = useState(false);
  const [motifText, setMotifText] = useState("C4 E4 G4 A4 Bb4 A4 G4 E4");
  const [motifChord, setMotifChord] = useState("C7");
  const [keepPassing, setKeepPassing] = useState(true);
  const [withMotif, setWithMotif] = useState<"chords" | "motif">("motif");
  const [linkRead, setLinkRead] = useState(false);
  const { status, play, playSteps, stop, playing } = usePiano();
  const [now, setNow] = useState<number | null>(null);

  // read a shared link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chart = params.get("chart");
    if (chart) setText(chart);
    const key = params.get("key");
    if (key && KEYS.includes(key)) setKeyChoice(key);
    const motif = params.get("motif");
    if (motif) setMotifText(motif);
    const over = params.get("over");
    if (over && !Chord.get(over).empty) setMotifChord(over);
    setLinkRead(true);
  }, []);

  // keep the link up to date, to share it
  useEffect(() => {
    if (!linkRead) return;
    const params = new URLSearchParams({ chart: text });
    if (keyChoice !== "auto") params.set("key", keyChoice);
    params.set("motif", motifText);
    params.set("over", motifChord);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString().replaceAll("+", "%20")}`,
    );
  }, [linkRead, text, keyChoice, motifText, motifChord]);

  const bars = useMemo(() => readBars(text), [text]);
  const slots = useMemo(() => {
    const list: Slot[] = [];
    bars.forEach((bar, b) =>
      bar.forEach((chord, index) =>
        list.push({ bar: b, index, chord, flat: list.length }),
      ),
    );
    return list;
  }, [bars]);
  const symbols = useMemo(() => slots.map((s) => s.chord), [slots]);

  // the key: the best ranked major or minor scale for the chords
  const ranked = useMemo(
    () => Scale.rank([], { chords: symbols, types: ["major", "minor"] }),
    [symbols],
  );
  const detected = ranked[0]?.name ?? "C major";
  const key = keyChoice === "auto" ? detected : keyChoice;

  const readings = useMemo(
    () =>
      slots.map((s, i) =>
        Key.analyzeChord(key, s.chord, {
          previous: symbols[i - 1],
          next: symbols[i + 1],
        }),
      ),
    [slots, symbols, key],
  );

  const current = selected !== null ? slots[selected] : undefined;
  const substitutes = useMemo(
    () =>
      current
        ? Key.substitutes(key, current.chord, {
            next: symbols[current.flat + 1],
          })
        : [],
    [current, key, symbols],
  );

  const pivots = useMemo(
    () =>
      Key.pivotChords(key, target, {
        sevenths: pivotSevenths,
        chromatic: pivotChromatic,
      }),
    [key, target, pivotSevenths, pivotChromatic],
  );

  // the motif, written over one chord, fitted to every chord of the chart
  const motif = useMemo(
    () =>
      motifText
        .split(/[\s,]+/)
        .filter(Boolean)
        .filter((n) => !Note.get(n).empty && Note.get(n).oct !== undefined),
    [motifText],
  );
  const fitOptions = useMemo(
    () => (keepPassing ? { keep: "non-chord" as const } : {}),
    [keepPassing],
  );
  const fitted = useMemo(
    () =>
      slots.map((s) =>
        motif.map((n) => Chord.fitNote(n, motifChord, s.chord, fitOptions)),
      ),
    [slots, motif, motifChord, fitOptions],
  );

  // voiced chords that move little from one to the next
  const voicings = useMemo(() => {
    try {
      const list = Voicing.sequence(symbols);
      return symbols.map((c, i) =>
        list[i]?.length ? list[i] : voice(Chord.get(c).notes),
      );
    } catch {
      return symbols.map((c) => voice(Chord.get(c).notes));
    }
  }, [symbols]);

  // what Play plays: each chord for its share of the bar, and the motif over it
  const steps = useMemo(() => {
    const list: TimedNotes[] = [];
    slots.forEach((s, i) => {
      const duration = (BAR / bars[s.bar].length) * QUARTER;
      const chord = voicings[i] ?? [];
      const line = fitted[i].filter(Boolean);
      if (withMotif === "chords" || !line.length) {
        list.push({ notes: chord, duration });
        return;
      }
      const each = duration / line.length;
      line.forEach((n, j) => {
        list.push({
          notes: [n],
          duration: each,
          held: j === 0 ? { notes: chord, duration } : undefined,
        });
      });
    });
    return list;
  }, [slots, bars, voicings, fitted, withMotif]);

  // the chord that sounds now
  const starts = useMemo(() => {
    let t = 0;
    return slots.map((s) => {
      const at = t;
      t += (BAR / bars[s.bar].length) * QUARTER;
      return at;
    });
  }, [slots, bars]);
  useEffect(() => {
    if (!playing) {
      setNow(null);
      return;
    }
    let frame = 0;
    const tick = () => {
      const t = audioTime() - playing.start;
      let index = -1;
      for (let i = 0; i < starts.length; i++) if (starts[i] <= t) index = i;
      setNow((before) => (before === index ? before : index));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, starts]);

  function edit(newText: string) {
    setHistory((h) => [...h, text]);
    setText(newText);
  }

  function choose(i: number) {
    setSelected(i);
    const notes = voicings[i];
    if (notes?.length) play(notes);
  }

  function apply(sub: Substitute) {
    if (!current) return;
    const next = bars.map((b) => b.slice());
    next[current.bar].splice(current.index, 1, ...sub.chords);
    edit(writeBars(next));
    setSelected(null);
  }

  function undo() {
    const last = history[history.length - 1];
    if (last === undefined) return;
    setHistory((h) => h.slice(0, -1));
    setText(last);
    setSelected(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="reharmonizer-input" className="text-sm font-medium">
          Chart: bars between “|”, chords separated by spaces
        </label>
        <textarea
          id="reharmonizer-input"
          value={text}
          rows={3}
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
                edit(example.chart);
                setKeyChoice("auto");
                setSelected(null);
              }}
            >
              {example.title}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-x-6 gap-y-3 text-sm">
        <label className="flex flex-col gap-1">
          <span className="font-medium">Key</span>
          <select
            value={keyChoice}
            onChange={(e) => setKeyChoice(e.target.value)}
            className="rounded-lg border border-fd-border bg-fd-background px-2 py-1.5"
          >
            <option value="auto">Detected: {detected}</option>
            {KEYS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>
        <Toggle
          stacked
          label="Play"
          value={withMotif}
          options={[
            ["chords", "Chords"],
            ["motif", "Chords and motif"],
          ]}
          onChange={setWithMotif}
        />
        <button
          type="button"
          className="rounded-lg border border-fd-border px-3 py-1.5 hover:bg-fd-accent disabled:opacity-50"
          onClick={undo}
          disabled={!history.length}
        >
          Undo
        </button>
        <button
          type="button"
          className="ms-auto rounded-lg bg-fd-primary px-3 py-1.5 font-medium text-fd-primary-foreground hover:opacity-90"
          onClick={playing ? stop : () => playSteps(steps)}
          disabled={!steps.length}
        >
          {playing ? "Stop" : "Play"}
        </button>
      </div>
      <PianoMessage status={status} />

      {slots.length ? (
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">The chart in {key}</h2>
          <p className="text-sm text-fd-muted-foreground">
            Each chord with its first reading in the key (
            <span className="font-mono">Key.analyzeChord</span>, with the chords
            before and after). Click one to see every reading and its
            substitutes.
          </p>
          <ol className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-fd-border bg-fd-border sm:grid-cols-4">
            {bars.map((bar, b) => (
              <li key={b} className="flex min-h-20 gap-1 bg-fd-card p-1.5">
                {bar.length ? (
                  bar.map((chord, i) => {
                    const slot = slots.find(
                      (s) => s.bar === b && s.index === i,
                    )!;
                    const reading = readings[slot.flat][0];
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => choose(slot.flat)}
                        className={`flex min-w-0 flex-1 flex-col items-start rounded-md border-l-4 px-2 py-1 text-left ${
                          FUNCTION_COLORS[reading?.function ?? ""]
                        } ${
                          selected === slot.flat
                            ? "bg-fd-primary/15 ring-1 ring-fd-primary"
                            : now === slot.flat
                              ? "bg-amber-500/15"
                              : "hover:bg-fd-accent"
                        }`}
                      >
                        <span className="font-mono font-semibold">{chord}</span>
                        <span className="font-mono text-sm">
                          {reading?.numeral ?? "?"}
                        </span>
                        {reading && reading.source !== "diatonic" ? (
                          <span className="text-[11px] text-fd-muted-foreground">
                            {reading.source}
                          </span>
                        ) : null}
                      </button>
                    );
                  })
                ) : (
                  <span className="p-2 text-fd-muted-foreground">—</span>
                )}
              </li>
            ))}
          </ol>
          <p className="flex flex-wrap gap-x-4 text-xs text-fd-muted-foreground">
            {Object.entries(FUNCTION_NAMES).map(([fn, name]) => (
              <span key={fn} className="flex items-center gap-1">
                <span
                  className={`inline-block h-3 border-l-4 ${FUNCTION_COLORS[fn]}`}
                />
                {name}
              </span>
            ))}
          </p>
        </section>
      ) : (
        <p className="text-fd-muted-foreground">
          Write some bars, like “| Dm7 | G7 | Cmaj7 |”.
        </p>
      )}

      {current ? (
        <ChordPanel
          chord={current.chord}
          readings={readings[current.flat]}
          substitutes={substitutes}
          onApply={apply}
          onHear={(chords) =>
            playSteps(
              chords.map((c) => ({
                notes: voice(Chord.get(c).notes),
                duration: 1,
              })),
            )
          }
        />
      ) : null}

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Modulate</h2>
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3 text-sm">
          <label className="flex flex-col gap-1">
            <span className="font-medium">From {key} to</span>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="rounded-lg border border-fd-border bg-fd-background px-2 py-1.5"
            >
              {KEYS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </label>
          <Toggle
            stacked
            label="Chords"
            value={pivotSevenths ? "7" : "3"}
            options={[
              ["3", "Triads"],
              ["7", "Sevenths"],
            ]}
            onChange={(v) => setPivotSevenths(v === "7")}
          />
          <label className="flex items-center gap-2 pb-1.5">
            <input
              type="checkbox"
              checked={pivotChromatic}
              onChange={(e) => setPivotChromatic(e.target.checked)}
            />
            Chromatic readings too
          </label>
        </div>
        {pivots.length ? (
          <table className="w-fit text-sm">
            <thead>
              <tr className="text-left text-fd-muted-foreground">
                <th className="pe-4 font-normal">Pivot</th>
                <th className="pe-4 font-normal">in {key}</th>
                <th className="pe-4 font-normal">in {target}</th>
                <th className="font-normal" />
              </tr>
            </thead>
            <tbody>
              {pivots.map((p) => (
                <tr key={p.chord + p.from}>
                  <td className="pe-4 font-mono font-semibold">{p.chord}</td>
                  <td className="pe-4 font-mono">
                    {p.from}
                    {p.fromSource !== "diatonic" ? (
                      <span className="ms-1 font-sans text-xs text-fd-muted-foreground">
                        {p.fromSource}
                      </span>
                    ) : null}
                  </td>
                  <td className="pe-4 font-mono">
                    {p.to}
                    {p.toSource !== "diatonic" ? (
                      <span className="ms-1 font-sans text-xs text-fd-muted-foreground">
                        {p.toSource}
                      </span>
                    ) : null}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="rounded-md bg-fd-secondary px-2 py-0.5 text-xs hover:bg-fd-accent"
                      title="Add a bar with the pivot and a ii–V–I in the new key"
                      onClick={() => {
                        const tonic = target.split(" ")[0];
                        const minor = target.endsWith("minor");
                        const two = Key.majorKey(tonic).chords[1];
                        const cadence = minor
                          ? [
                              Key.minorKey(tonic).harmonic.chords[1],
                              Key.minorKey(tonic).harmonic.chords[4],
                              Key.minorKey(tonic).natural.chords[0],
                            ]
                          : [
                              two,
                              Key.majorKey(tonic).chords[4],
                              Key.majorKey(tonic).chords[0],
                            ];
                        edit(
                          writeBars([
                            ...bars,
                            [p.chord],
                            [cadence[0], cadence[1]],
                            [cadence[2]],
                          ]),
                        );
                        setKeyChoice("auto");
                      }}
                    >
                      Modulate with it
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-fd-muted-foreground">
            No shared chords: try a closer key, or chromatic readings.
          </p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">A motif over every chord</h2>
        <p className="text-sm text-fd-muted-foreground">
          Write a figure over one chord: each note keeps its role on every chord
          of the chart (<span className="font-mono">Chord.fitNote</span>): the
          3rd goes to the new 3rd, the 11th to a #11 on a dominant.
        </p>
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3 text-sm">
          <label className="flex flex-col gap-1">
            <span className="font-medium">Notes</span>
            <input
              value={motifText}
              onChange={(e) => setMotifText(e.target.value)}
              spellCheck={false}
              className="w-72 rounded-lg border border-fd-border bg-fd-background px-2 py-1.5 font-mono"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium">Written over</span>
            <input
              value={motifChord}
              onChange={(e) => setMotifChord(e.target.value)}
              spellCheck={false}
              className="w-24 rounded-lg border border-fd-border bg-fd-background px-2 py-1.5 font-mono"
            />
          </label>
          <label className="flex items-center gap-2 pb-1.5">
            <input
              type="checkbox"
              checked={keepPassing}
              onChange={(e) => setKeepPassing(e.target.checked)}
            />
            Passing notes keep their interval
          </label>
        </div>
        {Chord.get(motifChord).empty || !Chord.get(motifChord).tonic ? (
          <p className="text-sm text-rose-500">
            “{motifChord}” isn&apos;t a chord with a root.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="text-sm">
              <tbody>
                {slots.map((s, i) => (
                  <tr
                    key={i}
                    className={now === i ? "bg-amber-500/15" : undefined}
                  >
                    <td className="pe-4 font-mono font-semibold">{s.chord}</td>
                    <td className="font-mono whitespace-nowrap">
                      {fitted[i].map((n, j) => (
                        <span key={j} className="me-2 inline-block w-9">
                          {n || "·"}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">The code</h2>
        <DynamicCodeBlock
          lang="js"
          code={code({
            symbols,
            ranked: ranked.slice(0, 3).map((r) => r.name),
            key,
            current,
            readings: current ? readings[current.flat] : [],
            substitutes,
            target,
            pivotOptions: {
              sevenths: pivotSevenths,
              chromatic: pivotChromatic,
            },
            pivots,
            motif,
            motifChord,
            fitOptions,
            fitted,
          })}
        />
      </section>
    </div>
  );
}

const KIND_ORDER = [
  "tritone substitute",
  "related ii",
  "backdoor",
  "contained",
  "diatonic",
  "borrowed",
  "secondary dominant",
  "substitute dominant",
  "passing diminished",
];

function ChordPanel({
  chord,
  readings,
  substitutes,
  onApply,
  onHear,
}: {
  chord: string;
  readings: Reading[];
  substitutes: Substitute[];
  onApply: (sub: Substitute) => void;
  onHear: (chords: string[]) => void;
}) {
  const kinds = KIND_ORDER.filter((k) => substitutes.some((s) => s.kind === k));
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-fd-border p-4">
      <h2 className="text-lg font-semibold">
        <span className="font-mono">{chord}</span>
      </h2>
      <div className="flex flex-col gap-1 text-sm">
        <h3 className="font-medium">Readings, the likeliest first</h3>
        {readings.length ? (
          <table className="w-fit">
            <tbody>
              {readings.map((r, i) => (
                <tr key={i} className={i ? "text-fd-muted-foreground" : ""}>
                  <td className="pe-4 font-mono font-semibold">{r.numeral}</td>
                  <td className="pe-4">{r.source}</td>
                  <td className="pe-4">{FUNCTION_NAMES[r.function]}</td>
                  <td className="pe-4">
                    {r.target ? `to ${r.target}` : ""}
                    {r.resolution ? ` (${r.resolution})` : ""}
                  </td>
                  <td className="font-mono">{r.chordScale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-fd-muted-foreground">No reading.</p>
        )}
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <h3 className="font-medium">
          Substitutes (click to hear, “use” to put it in the chart)
        </h3>
        {kinds.length ? (
          <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-[auto_1fr]">
            {kinds.map((kind) => (
              <div key={kind} className="contents">
                <dt className="text-fd-muted-foreground">{kind}</dt>
                <dd className="flex flex-wrap gap-2">
                  {substitutes
                    .filter((s) => s.kind === kind)
                    .map((s, i) => (
                      <span
                        key={i}
                        className="flex items-center overflow-hidden rounded-md bg-fd-secondary"
                      >
                        <button
                          type="button"
                          className="px-2 py-0.5 font-mono hover:bg-fd-accent"
                          onClick={() => onHear(s.chords)}
                        >
                          {s.chords.join(" ")}
                        </button>
                        <button
                          type="button"
                          className="border-s border-fd-border px-2 py-0.5 text-xs hover:bg-fd-accent"
                          onClick={() => onApply(s)}
                        >
                          use
                        </button>
                      </span>
                    ))}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-fd-muted-foreground">No substitutes.</p>
        )}
      </div>
    </section>
  );
}

function code(p: {
  symbols: string[];
  ranked: string[];
  key: string;
  current: Slot | undefined;
  readings: Reading[];
  substitutes: Substitute[];
  target: string;
  pivotOptions: { sevenths: boolean; chromatic: boolean };
  pivots: ReturnType<typeof Key.pivotChords>;
  motif: string[];
  motifChord: string;
  fitOptions: { keep?: "non-chord" };
  fitted: string[][];
}): string {
  const lines = [
    `const chords = ${show(p.symbols)};`,
    `Scale.rank([], { chords, types: ["major", "minor"] }).map((s) => s.name);`,
    `// => ${show(p.ranked)}${p.ranked.length ? " ..." : ""}`,
  ];
  if (p.current) {
    const c = p.current.chord;
    const next = p.symbols[p.current.flat + 1];
    const previous = p.symbols[p.current.flat - 1];
    const opts = [
      previous ? `previous: ${show(previous)}` : "",
      next ? `next: ${show(next)}` : "",
    ]
      .filter(Boolean)
      .join(", ");
    lines.push(
      "",
      `Key.analyzeChord(${show(p.key)}, ${show(c)}${opts ? `, { ${opts} }` : ""})[0];`,
      `// => ${show(p.readings[0] ?? null)}`,
      "",
      `Key.substitutes(${show(p.key)}, ${show(c)}${next ? `, { next: ${show(next)} }` : ""}).map((s) => s.chords);`,
      `// => ${show(p.substitutes.map((s) => s.chords))}`,
    );
  }
  const po = Object.entries(p.pivotOptions)
    .filter(([, v]) => v)
    .map(([k]) => `${k}: true`)
    .join(", ");
  lines.push(
    "",
    `Key.pivotChords(${show(p.key)}, ${show(p.target)}${po ? `, { ${po} }` : ""}).map((p) => \`\${p.chord}: \${p.from} \${p.to}\`);`,
    `// => ${show(p.pivots.map((x) => `${x.chord}: ${x.from} ${x.to}`))}`,
  );
  if (p.motif.length && p.symbols.length) {
    const fo = p.fitOptions.keep ? `, { keep: "non-chord" }` : "";
    lines.push(
      "",
      `const motif = ${show(p.motif)};`,
      `motif.map((n) => Chord.fitNote(n, ${show(p.motifChord)}, ${show(p.symbols[0])}${fo}));`,
      `// => ${show(p.fitted[0])}`,
    );
  }
  return lines.join("\n");
}
