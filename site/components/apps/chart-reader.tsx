"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Chord, Interval, Note, Progression } from "tonal";
import { voice } from "@/lib/voice";
import { Chip, NoteSelect, PianoMessage, show, TONICS } from "./controls";
import { keyboardRange, PianoKeyboard } from "./piano-keyboard";
import { usePiano } from "./use-piano";

const EXAMPLES: { title: string; key: string; chart: string }[] = [
  {
    title: "Applied dominants",
    key: "C",
    chart: "| Cmaj7 | A7 | Dm7 | G7 |\n| Em7 A7 | Dm7 G7 | C6 | N.C. |",
  },
  {
    title: "Jazz blues",
    key: "F",
    chart:
      "| F7 | Bb7 | F7 | Cm7 F7 |\n| Bb7 | Bo7 | F7 D7(b9) | Gm7 C7 |\n| Am7 D7 | Gm7 C7 | F6 | % |",
  },
  {
    title: "Minor ii–V",
    key: "C",
    chart: "| Dm7b5 | G7(b9) | Cm(maj7) | Cm6 |\n| Ab7 | G7 alt | Cm9 | % |",
  },
  {
    title: "Chart symbols",
    key: "Bb",
    chart:
      "| Cm7 b9 | F7(#5) b9 | Bbmaj7#11 | Ebmin maj7 |\n| Ab13sus4 | Co9 | Dø G7(b9,#9) | N.C. |",
  },
];

// one bar of the chart lasts two seconds when it's played
const BAR = 2;

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

type ChartChord = {
  /** As written in the chart, spaces included */
  text: string;
  chord: ReturnType<typeof Chord.get>;
};
type Bar = ChartChord[];

// A chord starts with a note letter, or is "N.C." (no chord). Any other word
// is a qualifier of the chord before it: "Cm7 b9" is one chord, "Cm7 F7" two.
const STARTS_CHORD = /^([A-G]|N\.?C\.?$)/;

/**
 * Read a chart: bars between "|" (or on separate lines), chords separated by
 * spaces. "%" repeats the bar before.
 */
function parseChart(text: string): Bar[] {
  const bars: Bar[] = [];
  for (const segment of text.split(/[|\n]/)) {
    const words = segment.trim().split(/\s+/).filter(Boolean);
    if (!words.length) continue;
    if (words.length === 1 && words[0] === "%") {
      bars.push(bars[bars.length - 1] ?? []);
      continue;
    }
    const texts: string[] = [];
    for (const word of words) {
      if (STARTS_CHORD.test(word) || !texts.length) texts.push(word);
      else texts[texts.length - 1] += ` ${word}`;
    }
    bars.push(texts.map((t) => ({ text: t, chord: Chord.get(t) })));
  }
  return bars;
}

function writeChart(bars: string[][]): string {
  const lines: string[] = [];
  for (let i = 0; i < bars.length; i += 4) {
    const line = bars.slice(i, i + 4).map((bar) => bar.join(" "));
    lines.push(`| ${line.join(" | ")} |`);
  }
  return lines.join("\n");
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
  const [selected, setSelected] = useState<Position | null>(null);
  const [linkRead, setLinkRead] = useState(false);
  const { status, play, playSteps } = usePiano();

  // read the chart of a shared link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chart = params.get("chart");
    const linkKey = params.get("key") ?? "";
    if (chart) setText(chart);
    if (!Note.get(linkKey).empty) setKey(Note.get(linkKey).pc);
    setLinkRead(true);
  }, []);

  // keep the link up to date, to share it
  useEffect(() => {
    if (!linkRead) return;
    const params = new URLSearchParams({ key, chart: text });
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString().replaceAll("+", "%20")}`,
    );
  }, [linkRead, key, text]);

  const bars = useMemo(() => parseChart(text), [text]);
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
  const unknown = flat.filter((c) => c.chord.empty);

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

  function playChart() {
    playSteps(
      bars.flatMap((bar) =>
        bar.map(({ chord }) => ({
          notes: voice(chord.notes),
          duration: BAR / bar.length,
        })),
      ),
    );
  }

  function transposeTo(newKey: string) {
    const interval = Interval.distance(key, newKey);
    const transposed = bars.map((bar) =>
      bar.map(({ text }) => Chord.transpose(text, interval)),
    );
    setText(writeChart(transposed));
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
            <Chip key={example.title} onClick={() => loadExample(example)}>
              {example.title}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4 text-sm">
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
        <button
          type="button"
          className="ms-auto rounded-lg bg-fd-primary px-3 py-1.5 font-medium text-fd-primary-foreground hover:opacity-90"
          onClick={playChart}
          disabled={!flat.length}
        >
          Play the chart
        </button>
      </div>
      <PianoMessage status={status} />

      {bars.length ? (
        <ol className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-fd-border bg-fd-border sm:grid-cols-4">
          {bars.map((bar, b) => (
            <li key={b} className="flex min-h-24 gap-1 bg-fd-card p-1.5">
              {bar.length ? (
                bar.map((c, i) => (
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
                <span className="p-2 text-fd-muted-foreground">%</span>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-fd-muted-foreground">
          Write some bars, like “| Dm7 | G7 | Cmaj7 |”.
        </p>
      )}

      <Legend />

      {unknown.length ? (
        <p className="text-sm">
          <span className="font-mono">
            {[...new Set(unknown.map((c) => c.text))].join(", ")}
          </span>{" "}
          <span className="text-fd-muted-foreground">
            {unknown.length === 1 ? "isn't" : "aren't"} a chord symbol tonal can
            read, so {unknown.length === 1 ? "it's" : "they're"} empty
            (`Chord.get(symbol).empty` is true) and silent.
          </span>
        </p>
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
          code={code(key, flat, applied, current?.text ?? null)}
        />
      </section>
    </div>
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
    <div className="-mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-fd-muted-foreground">
      {Object.entries(FAMILY_DOTS).map(([family, dot]) => (
        <span key={family} className="flex items-center gap-1">
          <span className={`size-2 rounded-full ${dot}`} />
          {family}
        </span>
      ))}
      <span>· dots: complexity</span>
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
        <span className="font-mono font-bold">{text}</span> isn't a chord symbol
        tonal can read. A chord is a listed type followed by alterations, such
        as <span className="font-mono">7b9</span>,{" "}
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
  key: string,
  chords: ChartChord[],
  applied: string[],
  current: string | null,
) {
  const symbols = chords.slice(0, 8).map((c) => c.text);
  const more = chords.length > 8 ? " // the first 8 chords" : "";
  const lines = [
    'import { Chord, Progression } from "tonal";',
    "",
    `const chords = ${show(symbols)};${more}`,
    "",
    "chords.map((c) => Chord.get(c).symbol);",
    `// => ${show(symbols.map((c) => Chord.get(c).symbol))}`,
    "chords.map((c) => Chord.get(c).family);",
    `// => ${show(symbols.map((c) => Chord.get(c).family))}`,
    "chords.map((c) => Chord.get(c).complexity);",
    `// => ${show(symbols.map((c) => Chord.get(c).complexity))}`,
    "",
    `Progression.toRomanNumerals(${show(key)}, chords);`,
    `// => ${show(Progression.toRomanNumerals(key, symbols))}`,
  ];
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
      `Chord.transpose(${name}, "4P"); // => ${show(Chord.transpose(current, "4P"))}`,
    );
  }
  return lines.join("\n");
}
