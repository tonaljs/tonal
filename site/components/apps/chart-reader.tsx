"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Chart, Chord, Interval, Note, Progression, Time } from "tonal";
import { audioTime } from "@/lib/piano";
import { voice } from "@/lib/voice";
import {
  Chip,
  NoteSelect,
  PianoMessage,
  show as showJson,
  TONICS,
  Toggle,
} from "./controls";
import { keyboardRange, PianoKeyboard } from "./piano-keyboard";
import { usePiano } from "./use-piano";

const EXAMPLES: { title: string; key: string; chart: string }[] = [
  {
    title: "AABA with endings",
    key: "C",
    chart:
      "[A] |: Cmaj7 A7 | Dm7 G7 |1 Em7 A7 | Dm7 G7 :|2 Dm7 G7 | C6 ||\n" +
      "[B] | Gm7 C7 | Fmaj7 | Am7 D7 | Dm7 G7 |\n" +
      "[A] | Cmaj7 A7 | Dm7 G7 | Em7 A7 | Dm7 G7 C6 |",
  },
  {
    title: "D.S. al Coda",
    key: "F",
    chart:
      "[Intro] | Gm7 C7 | Gm7 C7 |\n" +
      "[A] | <Segno> Fmaj7 | Bb7 | Am7 D7 | Gm7 C7 <To Coda> |\n" +
      "| Fmaj7 | Eb7 | Dm7 | G7 <D.S. al Coda> |\n" +
      "[Coda] | <Coda> Gm7 C7 | F6 |",
  },
  {
    title: "Jazz blues",
    key: "F",
    chart:
      "| F7 | Bb7 | F7 | Cm7 F7 |\n| Bb7 | Bo7 | F7 D7(b9) | Gm7 C7 |\n| Am7 D7 | Gm7 C7 | F6 D7 | Gm7 C7 |",
  },
  {
    title: "Waltz and 4/4",
    key: "G",
    chart:
      "3/4 |: Gmaj7 | Em7 | Am7 | D7 :|x3 4/4 Gmaj7 C7 | Bm7 E7 Am7 D7 | G6 |",
  },
  {
    title: "Applied dominants",
    key: "C",
    chart: "| Cmaj7 | A7 | Dm7 | G7 |\n| Em7 A7 | Dm7 G7 | C6 | N.C. |",
  },
  {
    title: "Chart symbols",
    key: "Bb",
    chart:
      "| Cm7 b9 | F7(#5) b9 | Bbmaj7#11 | Ebmin maj7 |\n| Ab13sus4 | Co9 | Dø G7(b9,#9) | N.C. |",
  },
];

// JSON for the code panel, with a space after the commas between numbers too
const show = (value: unknown) => showJson(value).replace(/,(?=[-\d[])/g, ", ");

// a quarter note lasts half a second when the chart is played (120 bpm)
const QUARTER = 0.5;

// a color for each chord family, so the harmonic rhythm can be seen at a glance
const FAMILY_COLORS: Record<string, string> = {
  major: "border-l-sky-500",
  minor: "border-l-violet-500",
  dominant: "border-l-amber-500",
  "half-diminished": "border-l-rose-400",
  diminished: "border-l-red-600",
  augmented: "border-l-emerald-500",
  suspended: "border-l-teal-400",
  power: "border-l-neutral-400",
};
const FAMILY_DOTS: Record<string, string> = {
  major: "bg-sky-500",
  minor: "bg-violet-500",
  dominant: "bg-amber-500",
  "half-diminished": "bg-rose-400",
  diminished: "bg-red-600",
  augmented: "bg-emerald-500",
  suspended: "bg-teal-400",
  power: "bg-neutral-400",
};

type ChartChord = { text: string; chord: ReturnType<typeof Chord.get> };

// Transpose the chords of the text as it's written, keeping its layout, its
// "%" and the words the parser can't read (Chart.transpose and Chart.toText
// would write the chart again: the code panel shows them)
function transposeText(text: string, interval: string): string {
  return text
    .split(/(\[[^\]]*\]|<[^>]*>)/)
    .map((part, i) =>
      i % 2
        ? part
        : part.replace(
            /(^|[\s|:])([A-G][^\s|@]*)/g,
            (_, before: string, word: string) =>
              before + (Chord.transpose(word, interval) || word),
          ),
    )
    .join("");
}

const chromas = (notes: string[]) =>
  notes
    .map((n) => Note.get(n).chroma)
    .sort((x, y) => x - y)
    .join();
const sameNotes = (a: string[], b: string[]) => chromas(a) === chromas(b);

const isMinorLike = (family: string) =>
  ["minor", "half-diminished", "diminished"].includes(family);

/**
 * A dominant chord that resolves down a fifth to the next chord is the V of
 * that chord: A7 before Dm7 in C is V7/ii. The label is only kept if
 * `Progression.fromRomanNumerals` gives the same chord back.
 */
function appliedNumeral(
  key: string,
  current: ChartChord,
  next: ChartChord | undefined,
): string {
  const { chord } = current;
  if (!next || chord.family !== "dominant" || !chord.tonic) return "";
  if (next.chord.empty || !next.chord.tonic) return "";
  const resolves = Interval.distance(chord.tonic, next.chord.tonic) === "4P";
  const target = Progression.toRomanNumerals(key, [next.chord.tonic])[0];
  // the V of the tonic is the plain V
  if (!resolves || target === "I") return "";
  const type = Chord.tokenize(chord.symbol)[1];
  const of = isMinorLike(next.chord.family) ? target.toLowerCase() : target;
  const label = `V${type}/${of}`;
  const [back] = Progression.fromRomanNumerals(key, [label]);
  const same = !!back && sameNotes(Chord.get(back).notes, chord.notes);
  return same ? label : "";
}

type Position = [number, number];

export function ChartReader() {
  const [text, setText] = useState(EXAMPLES[0].chart);
  const [key, setKey] = useState(EXAMPLES[0].key);
  const [choruses, setChoruses] = useState(1);
  const [repeatsOnJump, setRepeatsOnJump] = useState(false);
  const [selected, setSelected] = useState<Position | null>(null);
  const [linkRead, setLinkRead] = useState(false);
  const { status, play, playSteps, stop, playing } = usePiano();
  // the played bar that sounds now
  const [now, setNow] = useState<number | null>(null);

  // read the chart of a shared link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chart = params.get("chart");
    const linkKey = params.get("key") ?? "";
    if (chart) setText(chart);
    if (!Note.get(linkKey).empty) setKey(Note.get(linkKey).pc);
    const linkChoruses = Number(params.get("choruses"));
    if (linkChoruses >= 1 && linkChoruses <= 4) setChoruses(linkChoruses);
    if (params.get("repeatsOnJump") === "true") setRepeatsOnJump(true);
    setLinkRead(true);
  }, []);

  // keep the link up to date, to share it
  useEffect(() => {
    if (!linkRead) return;
    const params = new URLSearchParams({ key, chart: text });
    if (choruses !== 1) params.set("choruses", String(choruses));
    if (repeatsOnJump) params.set("repeatsOnJump", "true");
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString().replaceAll("+", "%20")}`,
    );
  }, [linkRead, key, text, choruses, repeatsOnJump]);

  const chart = useMemo(() => Chart.parse(text), [text]);
  const options = useMemo(
    () => ({ choruses, repeatsOnJump }),
    [choruses, repeatsOnJump],
  );
  const played = useMemo(() => Chart.unroll(chart, options), [chart, options]);
  const playedChords = useMemo(
    () => Chart.chords(chart, options),
    [chart, options],
  );
  const problems = useMemo(() => Chart.problems(chart), [chart]);

  // the written chords, with what tonal reads in each symbol
  const bars = useMemo(
    () =>
      chart.bars.map((bar) =>
        bar.chords.map((c): ChartChord => ({
          text: c.value,
          chord: Chord.get(c.value),
        })),
      ),
    [chart],
  );
  const flat = bars.flat();
  const numerals = useMemo(
    () =>
      Progression.toRomanNumerals(
        key,
        bars.flat().map((c) => c.text),
      ),
    [bars, key],
  );
  const applied = flat.map((c, i) => appliedNumeral(key, c, flat[i + 1]));

  const indexOf = ([bar, chord]: Position) =>
    bars.slice(0, bar).reduce((n, b) => n + b.length, 0) + chord;
  const current =
    selected && bars[selected[0]]?.[selected[1]]
      ? bars[selected[0]][selected[1]]
      : null;
  const notes = current ? voice(current.chord.notes) : [];

  function choose(position: Position) {
    setSelected(position);
    const { chord } = bars[position[0]][position[1]];
    if (chord.notes.length) play(voice(chord.notes));
  }

  // what Play plays: each chord of the played form for its duration
  const steps = useMemo(() => {
    const list: { notes: string[]; duration: number }[] = [];
    const first = playedChords[0];
    if (first && Time.compare(first.start, 0) > 0) {
      list.push({
        notes: [],
        duration: (Time.toNumber(first.start) ?? 0) * QUARTER,
      });
    }
    for (const c of playedChords) {
      list.push({
        notes: voice(Chord.get(c.value).notes),
        duration: (Time.toNumber(c.duration) ?? 0) * QUARTER,
      });
    }
    return list;
  }, [playedChords]);

  // follow the playback: the played bar at the time of the audio clock
  useEffect(() => {
    if (!playing) {
      setNow(null);
      return;
    }
    let frame = 0;
    const tick = () => {
      // the audio clock is a float: exact on a grid of 1/1024 of a quarter
      const quarters = (audioTime() - playing.start) / QUARTER;
      const at = Math.floor(quarters * 1024) / 1024;
      const index = Chart.barAt(played, at)?.index ?? -1;
      setNow((before) =>
        before === index ? before : index < 0 ? null : index,
      );
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, played]);

  const nowBar = now !== null ? played[now]?.bar : undefined;

  function transposeTo(newKey: string) {
    setText(transposeText(text, Interval.distance(key, newKey)));
    setKey(newKey);
  }

  function loadExample(example: (typeof EXAMPLES)[number]) {
    setText(example.chart);
    setKey(example.key);
    setSelected(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="chart-reader-input" className="text-sm font-medium">
          Chart: bars between “|”, chords separated by spaces
        </label>
        <textarea
          id="chart-reader-input"
          value={text}
          rows={4}
          onChange={(e) => {
            setText(e.target.value);
            setSelected(null);
          }}
          spellCheck={false}
          autoComplete="off"
          className="rounded-lg border border-fd-border bg-fd-background px-3 py-2 font-mono text-base outline-none focus:ring-2 focus:ring-fd-ring"
        />
        <p className="text-xs text-fd-muted-foreground">
          <span className="font-mono">[A]</span> a section ·{" "}
          <span className="font-mono">%</span> the bar before ·{" "}
          <span className="font-mono">3/4</span> a meter ·{" "}
          <span className="font-mono">A7@4</span> a chord on beat 4 ·{" "}
          <span className="font-mono">|: :|x3</span> repeats ·{" "}
          <span className="font-mono">|1 :|2</span> endings ·{" "}
          <span className="font-mono">
            {"<Segno> <To Coda> <Coda> <Fine> <D.S. al Coda>"}
          </span>{" "}
          jumps
        </p>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-fd-muted-foreground">Try:</span>
          {EXAMPLES.map((example) => (
            <Chip key={example.title} onClick={() => loadExample(example)}>
              {example.title}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-x-6 gap-y-3 text-sm">
        <NoteSelect
          label="Key (for the numerals)"
          value={key}
          options={TONICS}
          onChange={setKey}
        />
        <NoteSelect
          label="Transpose to"
          value={key}
          options={TONICS}
          onChange={transposeTo}
        />
        <Toggle
          stacked
          label="Choruses"
          value={choruses}
          options={[
            [1, "1"],
            [2, "2"],
            [3, "3"],
            [4, "4"],
          ]}
          onChange={setChoruses}
        />
        <label className="flex items-center gap-2 pb-1.5">
          <input
            type="checkbox"
            checked={repeatsOnJump}
            onChange={(e) => setRepeatsOnJump(e.target.checked)}
          />
          Repeats after D.C. / D.S.
        </label>
        <button
          type="button"
          className="ms-auto rounded-lg bg-fd-primary px-3 py-1.5 font-medium text-fd-primary-foreground hover:opacity-90"
          onClick={playing ? stop : () => playSteps(steps)}
          disabled={!steps.length}
        >
          {playing ? "Stop" : "Play the chart"}
        </button>
      </div>
      <PianoMessage status={status} />

      {problems.length ? (
        <ul className="flex flex-col gap-1 rounded-lg border border-rose-500/40 bg-rose-500/5 px-3 py-2 text-sm">
          {problems.map((p) => (
            <li key={p} className="font-mono">
              {p}
            </li>
          ))}
          <li className="text-xs text-fd-muted-foreground">
            From <span className="font-mono">Chart.problems(chart)</span>. Words
            it can't read are left out; a form that doesn't close can't be
            played.
          </li>
        </ul>
      ) : null}

      {bars.length ? (
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">The chart, as written</h2>
          <ol className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-fd-border bg-fd-border sm:grid-cols-4">
            {chart.bars.map((bar, b) => (
              <li
                key={b}
                className={`flex min-h-28 flex-col gap-1 p-1.5 ${
                  nowBar === b ? "bg-amber-500/15" : "bg-fd-card"
                }`}
              >
                <BarMarks bar={bar} number={b + 1} />
                <div className="flex flex-1 gap-1">
                  {bars[b].length ? (
                    bars[b].map((c, i) => (
                      <ChordCard
                        key={i}
                        item={c}
                        numeral={numerals[indexOf([b, i])]}
                        applied={applied[indexOf([b, i])]}
                        selected={selected?.[0] === b && selected?.[1] === i}
                        onClick={() => choose([b, i])}
                      />
                    ))
                  ) : (
                    <span className="p-2 text-fd-muted-foreground">—</span>
                  )}
                </div>
                <BarEndMarks bar={bar} />
              </li>
            ))}
          </ol>
          <Legend />
        </section>
      ) : (
        <p className="text-fd-muted-foreground">
          Write some bars, like “| Dm7 | G7 | Cmaj7 |”.
        </p>
      )}

      {played.length ? (
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">
            The form, as it&apos;s played
          </h2>
          <p className="text-sm text-fd-muted-foreground">
            {played.length} bars from{" "}
            <span className="font-mono">Chart.unroll</span>: the number of each
            written bar, in the order it&apos;s played, with its pass and
            ending. Click one to see its chords.
          </p>
          <ol className="flex flex-wrap gap-1">
            {played.map((b, i) => (
              <PlayedCell
                key={i}
                bar={b}
                first={bars[b.bar][0]?.text ?? ""}
                newChorus={i === 0 || played[i - 1].chorus !== b.chorus}
                now={now === i}
                selected={selected?.[0] === b.bar}
                onClick={() => {
                  if (bars[b.bar].length) choose([b.bar, 0]);
                }}
              />
            ))}
          </ol>
        </section>
      ) : null}

      {current ? (
        <ChordDetails
          item={current}
          notes={notes}
          numeral={numerals[indexOf(selected!)]}
          applied={applied[indexOf(selected!)]}
          onPlay={() => play(notes)}
        />
      ) : (
        <p className="text-sm text-fd-muted-foreground">
          Click a chord to hear it and see its notes.
        </p>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">The code</h2>
        <DynamicCodeBlock
          lang="js"
          code={code(
            text,
            options,
            problems,
            played,
            playedChords,
            key,
            flat,
            applied,
            current?.text ?? null,
          )}
        />
      </section>
    </div>
  );
}

const MARK = "rounded px-1 font-mono text-[11px] leading-4";

// The marks at the start of a written bar
function BarMarks({ bar, number }: { bar: Chart.ChartBar; number: number }) {
  return (
    <div className="flex min-h-4 flex-wrap items-center gap-1 text-fd-muted-foreground">
      <span className="font-mono text-[10px]">{number}</span>
      {bar.section !== undefined ? (
        <span className={`${MARK} bg-fd-primary text-fd-primary-foreground`}>
          {bar.section || "·"}
        </span>
      ) : null}
      {bar.repeatStart ? (
        <span className={`${MARK} bg-fd-secondary`}>‖:</span>
      ) : null}
      {bar.ending ? (
        <span className={`${MARK} border-t-2 border-l-2 border-fd-foreground`}>
          {bar.ending.join(",")}.
        </span>
      ) : null}
      {bar.segno ? (
        <span className={`${MARK} bg-fd-secondary`}>Segno</span>
      ) : null}
      {bar.coda ? (
        <span className={`${MARK} bg-fd-secondary`}>Coda</span>
      ) : null}
      <span className="ms-auto font-mono text-[10px]">{bar.meter}</span>
    </div>
  );
}

// The marks at the end of a written bar
function BarEndMarks({ bar }: { bar: Chart.ChartBar }) {
  const marks: string[] = [];
  if (bar.toCoda) marks.push("To Coda");
  if (bar.fine) marks.push("Fine");
  if (bar.jump) marks.push(bar.jump);
  if (bar.repeatEnd !== undefined) {
    marks.push(bar.repeatEnd > 2 ? `:‖ x${bar.repeatEnd}` : ":‖");
  }
  if (bar.doubleBar) marks.push("‖");
  if (!marks.length) return null;
  return (
    <div className="flex flex-wrap justify-end gap-1">
      {marks.map((m) => (
        <span key={m} className={`${MARK} bg-fd-secondary`}>
          {m}
        </span>
      ))}
    </div>
  );
}

// A bar of the played form
function PlayedCell({
  bar,
  first,
  newChorus,
  now,
  selected,
  onClick,
}: {
  bar: Chart.PlayedBar;
  first: string;
  newChorus: boolean;
  now: boolean;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <li className="flex items-end">
      {newChorus && bar.chorus > 1 ? (
        <span className="me-1 self-stretch border-l-2 border-fd-foreground ps-1 text-[10px] text-fd-muted-foreground">
          chorus {bar.chorus}
        </span>
      ) : null}
      <button
        type="button"
        onClick={onClick}
        title={`${first || "—"}: bar ${bar.bar + 1}, pass ${bar.pass}${
          bar.ending ? `, ending ${bar.ending}` : ""
        }, chorus ${bar.chorus}`}
        className={`flex w-14 flex-col items-start rounded-md border px-1.5 py-1 text-start ${
          now
            ? "border-amber-500 bg-amber-500/20"
            : selected
              ? "border-sky-500 bg-sky-500/10"
              : "border-fd-border hover:bg-fd-accent"
        }`}
      >
        <span className="text-[10px] leading-3 text-fd-muted-foreground">
          {bar.sectionBar === 0 && bar.section ? bar.section : "\u00a0"}
        </span>
        <span className="font-mono text-sm font-bold">{bar.bar + 1}</span>
        <span className="max-w-full truncate font-mono text-[10px]">
          {first || "—"}
        </span>
        <span className="font-mono text-[10px] text-fd-muted-foreground">
          {bar.pass > 1 ? `p${bar.pass}` : ""}
          {bar.ending ? ` ${bar.ending}.` : ""}
        </span>
      </button>
    </li>
  );
}

function ChordCard({
  item,
  numeral,
  applied,
  selected,
  onClick,
}: {
  item: ChartChord;
  numeral: string;
  applied: string;
  selected: boolean;
  onClick: () => void;
}) {
  const { chord, text } = item;
  const noChord = !chord.empty && !chord.notes.length;
  const color = chord.empty
    ? "border-l-red-500 border-dashed"
    : (FAMILY_COLORS[chord.family] ?? "border-l-fd-border");
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex min-w-0 flex-1 flex-col items-start gap-0.5 rounded-md border border-l-4 px-2 py-1.5 text-start ${color} ${
        selected
          ? "border-sky-500 bg-sky-500/10"
          : "border-transparent hover:bg-fd-accent"
      }`}
    >
      <span className="max-w-full truncate font-mono text-base font-bold">
        {chord.empty ? text : chord.symbol}
      </span>
      <span className="max-w-full truncate font-mono text-xs text-fd-muted-foreground">
        {chord.empty ? "?" : noChord ? "no chord" : applied || numeral}
      </span>
      {chord.empty || noChord ? null : <Complexity value={chord.complexity} />}
    </button>
  );
}

function Complexity({ value }: { value: number }) {
  const dots = Math.min(value, 8);
  return (
    <span
      className="flex gap-0.5"
      title={`complexity ${value}`}
      role="img"
      aria-label={`complexity ${value}`}
    >
      {Array.from({ length: 8 }, (_, i) => (
        <span
          key={i}
          className={`size-1.5 rounded-full ${
            i < dots ? "bg-fd-foreground/70" : "bg-fd-border"
          }`}
        />
      ))}
    </span>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-fd-muted-foreground">
      {Object.entries(FAMILY_DOTS).map(([family, dot]) => (
        <span key={family} className="flex items-center gap-1">
          <span className={`size-2 rounded-full ${dot}`} />
          {family}
        </span>
      ))}
      <span>· dots: complexity · —: the chord goes on</span>
    </div>
  );
}

function ChordDetails({
  item,
  notes,
  numeral,
  applied,
  onPlay,
}: {
  item: ChartChord;
  notes: string[];
  numeral: string;
  applied: string;
  onPlay: () => void;
}) {
  const { chord, text } = item;
  if (chord.empty) {
    return (
      <section className="rounded-xl border border-fd-border bg-fd-card p-4 text-sm">
        <span className="font-mono font-bold">{text}</span> isn&apos;t a chord
        symbol tonal can read. A chord is a listed type followed by alterations,
        such as <span className="font-mono">7b9</span>,{" "}
        <span className="font-mono">(#11)</span> or{" "}
        <span className="font-mono">sus4</span>.
      </section>
    );
  }
  if (!chord.notes.length) {
    return (
      <section className="rounded-xl border border-fd-border bg-fd-card p-4 text-sm">
        <span className="font-mono font-bold">N.C.</span> is “no chord”: not
        empty, but without notes.
      </section>
    );
  }
  const [from, to] = keyboardRange(notes.map((n) => Note.get(n).height));
  const active = new Map(
    notes.map((n) => [
      Note.get(n).height,
      Chord.degreeOf(chord.symbol, n) || Note.get(n).pc,
    ]),
  );
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-fd-border bg-fd-card p-4 md:p-6">
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex-1">
          <div className="font-mono text-3xl font-bold">{chord.symbol}</div>
          <div className="mt-1 text-fd-muted-foreground">
            {chord.name} · {chord.family} · complexity {chord.complexity}
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
            marked={Note.get(notes[0]).height}
            keyName={(midi) => Note.fromMidi(midi)}
            onKey={() => {}}
          />
        </div>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        <Row term="Written">{text}</Row>
        <Row term="Numeral">
          {applied ? `${applied} (${numeral})` : numeral}
        </Row>
        <Row term="Notes">{chord.notes.join(" ")}</Row>
        <Row term="Formula">{Chord.formula(chord.symbol).join(" ")}</Row>
        <Row term="Most important">
          {Chord.degreesByImportance(chord.symbol).join(" ")}
        </Row>
      </dl>
      <Link
        href={`/apps/chord-finder/?chord=${encodeURIComponent(chord.symbol)}`}
        className="text-sm underline"
      >
        Open in the chord finder
      </Link>
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
  text: string,
  options: { choruses: number; repeatsOnJump: boolean },
  problems: string[],
  played: Chart.PlayedBar[],
  playedChords: Chart.PlayedChord[],
  key: string,
  chords: ChartChord[],
  applied: string[],
  current: string | null,
) {
  const opts: string[] = [];
  if (options.choruses !== 1) opts.push(`choruses: ${options.choruses}`);
  if (options.repeatsOnJump) opts.push("repeatsOnJump: true");
  const optsText = opts.length ? `, { ${opts.join(", ")} }` : "";
  const order = played.map((b) => b.bar + 1);
  const firstChords = playedChords.slice(0, 4);
  const symbols = chords.slice(0, 8).map((c) => c.text);
  const more = chords.length > 8 ? " // the first 8 chords" : "";
  const lines = [
    'import { Chart, Chord, Progression } from "tonal";',
    "",
    `const chart = Chart.parse(${show(text)});`,
    `Chart.problems(chart); // => ${show(problems)}`,
    "",
    "// the written bars in the order they're played",
    `Chart.unroll(chart${optsText}).map((b) => b.bar + 1);`,
    `// => ${show(order.slice(0, 32))}${order.length > 32 ? " (the first 32)" : ""}`,
    "",
    "// the chords, with their start and duration in quarter notes",
    `const chords = Chart.chords(chart${optsText});`,
    "chords.slice(0, 4).map((c) => [c.value, c.start, c.duration]);",
    `// => ${show(firstChords.map((c) => [c.value, c.start, c.duration]))}`,
  ];
  if (playedChords.length) {
    lines.push(
      `Chart.chordAt(chords, 6)?.value; // => ${show(Chart.chordAt(playedChords, 6)?.value ?? null)}`,
    );
  }
  if (playedChords.length) {
    lines.push(
      "",
      "// transposed a fourth up, written back as text",
      `Chart.toText(Chart.transpose(chart, "4P"));`,
      `// => ${show(Chart.toText(Chart.transpose(Chart.parse(text), "4P")))}`,
    );
  }
  lines.push(
    "",
    `const symbols = ${show(symbols)};${more}`,
    "symbols.map((c) => Chord.get(c).family);",
    `// => ${show(symbols.map((c) => Chord.get(c).family))}`,
    `Progression.toRomanNumerals(${show(key)}, symbols);`,
    `// => ${show(Progression.toRomanNumerals(key, symbols))}`,
  );
  const firstApplied = applied.find(Boolean);
  if (firstApplied) {
    lines.push(
      "",
      "// an applied dominant, checked the other way",
      `Progression.fromRomanNumerals(${show(key)}, [${show(firstApplied)}]);`,
      `// => ${show(Progression.fromRomanNumerals(key, [firstApplied]))}`,
    );
  }
  if (current) {
    const name = show(current);
    lines.push(
      "",
      `Chord.get(${name}).notes; // => ${show(Chord.get(current).notes)}`,
      `Chord.formula(${name}); // => ${show(Chord.formula(current))}`,
      `Chord.degreesByImportance(${name});`,
      `// => ${show(Chord.degreesByImportance(current))}`,
    );
  }
  return lines.join("\n");
}
