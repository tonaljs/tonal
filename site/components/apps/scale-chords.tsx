"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Note, Progression, Scale, ScaleType } from "tonal";
import { Chip, PianoMessage, show, TONICS, Toggle } from "./controls";
import { keyboardRange, PianoKeyboard } from "./piano-keyboard";
import { usePiano } from "./use-piano";

const SIZES: [number, string][] = [
  [3, "Triads"],
  [4, "Sevenths"],
  [5, "Five notes"],
];

const STEPS: [number, string][] = [
  [2, "Thirds"],
  [3, "Fourths"],
  [1, "Seconds"],
];

type Mode = "stacked" | "all";
const MODES: [Mode, string][] = [
  ["stacked", "Stacked"],
  ["all", "All chords"],
];

const TRIADS = ["M", "m", "dim", "aug"];
const SEVENTHS = ["maj7", "7", "m7", "m7b5", "dim7", "mMaj7"];

// the chord types of each filter (undefined: every chord type)
type Filter = "triads" | "sevenths" | "common" | "all";
const FILTERS: Record<Filter, string[] | undefined> = {
  triads: TRIADS,
  sevenths: SEVENTHS,
  common: [
    ...TRIADS,
    ...SEVENTHS,
    "6",
    "m6",
    "sus2",
    "sus4",
    "7sus4",
    "add9",
    "madd9",
    "69",
    "9",
    "maj9",
    "m9",
    "11",
    "m11",
    "13",
  ],
  all: undefined,
};
const FILTER_OPTIONS: [Filter, string][] = [
  ["triads", "Triads"],
  ["sevenths", "Sevenths"],
  ["common", "Common"],
  ["all", "All"],
];

type Order = "common" | "dictionary";
const ORDERS: [Order, string][] = [
  ["common", "Common first"],
  ["dictionary", "Dictionary"],
];

// the chords start at octave 3, so that they fit on the keyboard
const OCTAVE = 3;

// the scale types grouped by their number of notes
const TYPE_GROUPS = (() => {
  const groups = new Map<number, string[]>();
  for (const type of ScaleType.all()) {
    const count = type.intervals.length;
    groups.set(count, [...(groups.get(count) ?? []), type.name]);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a - b)
    .map(([count, names]) => ({ count, names: names.sort() }));
})();

const isValid = (tonic: string, type: string) =>
  !Note.get(tonic).empty && !ScaleType.get(type).empty;

export function ScaleChords() {
  const [tonic, setTonic] = useState("C");
  const [type, setType] = useState("major");
  const [size, setSize] = useState(4);
  const [step, setStep] = useState(2);
  const [mode, setMode] = useState<Mode>("stacked");
  const [filter, setFilter] = useState<Filter>("common");
  const [order, setOrder] = useState<Order>("common");
  const [selected, setSelected] = useState<number | null>(null);
  const [linkRead, setLinkRead] = useState(false);
  const { status, play, playSequence } = usePiano();

  // read the scale of a shared link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const linkTonic = params.get("tonic") ?? "";
    const linkType = params.get("type") ?? "";
    if (isValid(linkTonic, linkType)) {
      setTonic(Note.get(linkTonic).pc);
      setType(ScaleType.get(linkType).name);
    }
    const linkSize = Number(params.get("size"));
    if (SIZES.some(([s]) => s === linkSize)) setSize(linkSize);
    const linkStep = Number(params.get("step"));
    if (STEPS.some(([s]) => s === linkStep)) setStep(linkStep);
    const linkMode = params.get("mode");
    if (MODES.some(([m]) => m === linkMode)) setMode(linkMode as Mode);
    const linkFilter = params.get("chords");
    if (FILTER_OPTIONS.some(([f]) => f === linkFilter)) {
      setFilter(linkFilter as Filter);
    }
    const linkOrder = params.get("order");
    if (ORDERS.some(([o]) => o === linkOrder)) setOrder(linkOrder as Order);
    setLinkRead(true);
  }, []);

  // keep the link up to date, to share it
  useEffect(() => {
    if (!linkRead) return;
    const params = new URLSearchParams(
      mode === "all"
        ? { tonic, type, mode, chords: filter, order }
        : { tonic, type, size: String(size), step: String(step) },
    );
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString().replaceAll("+", "%20")}`,
    );
  }, [linkRead, tonic, type, size, step, mode, filter, order]);

  const name = `${tonic} ${type}`;
  const scale = useMemo(() => Scale.get(name), [name]);
  const chords = useMemo(
    () => Scale.chords(`${tonic}${OCTAVE} ${type}`, { size, step }),
    [tonic, type, size, step],
  );
  // every chord on each degree, in the "All chords" mode
  const allChords = useMemo(
    () =>
      mode === "all"
        ? Scale.chords(`${tonic}${OCTAVE} ${type}`, {
            all: true,
            types: FILTERS[filter],
            order,
          })
        : [],
    [mode, tonic, type, filter, order],
  );
  const degrees = useMemo(
    () =>
      scale.notes.map((root, i) => ({
        degree: i + 1,
        root,
        chords: allChords
          .map((chord, index) => ({ chord, index }))
          .filter(({ chord }) => chord.degree === i + 1),
      })),
    [scale, allChords],
  );
  const list = mode === "all" ? allChords : chords;
  const seven = scale.notes.length === 7;
  const romans = chords.map(({ symbol }) =>
    seven && symbol ? Progression.toRomanNumerals(tonic, [symbol])[0] : "",
  );
  const chord = selected !== null ? list[selected] : undefined;

  // the scale from the tonic to the tonic an octave higher
  const scaleNotes = [
    ...Scale.get(`${tonic}${OCTAVE} ${type}`).notes,
    `${tonic}${OCTAVE + 1}`,
  ];
  const shaded = new Map(
    scaleNotes.map((note, i) => [
      Note.get(note).height,
      String((i % scale.notes.length) + 1),
    ]),
  );
  const active = new Map(
    (chord?.notes ?? []).map((note) => [
      Note.get(note).height,
      Note.get(note).pc,
    ]),
  );
  const [from, to] = keyboardRange([...shaded.keys(), ...active.keys()]);
  const tonicOptions = TONICS.includes(tonic) ? TONICS : [tonic, ...TONICS];

  function choose(index: number) {
    setSelected(index);
    play(list[index].notes);
  }

  // a new list of chords: nothing selected
  function changeList<T>(set: (value: T) => void) {
    return (value: T) => {
      set(value);
      setSelected(null);
    };
  }

  function changeScale(newTonic: string, newType: string) {
    setTonic(newTonic);
    setType(newType);
    setSelected(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-4 text-sm">
        <label className="flex flex-col gap-1">
          <span className="font-medium">Tonic</span>
          <select
            value={tonic}
            onChange={(e) => changeScale(e.target.value, type)}
            className="rounded-lg border border-fd-border bg-fd-background px-2 py-1.5"
          >
            {tonicOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-0 flex-col gap-1">
          <span className="font-medium">
            Scale ({ScaleType.all().length} types)
          </span>
          <select
            value={type}
            onChange={(e) => changeScale(tonic, e.target.value)}
            className="max-w-full rounded-lg border border-fd-border bg-fd-background px-2 py-1.5"
          >
            {TYPE_GROUPS.map(({ count, names }) => (
              <optgroup key={count} label={`${count} notes`}>
                {names.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <Toggle
          stacked
          label="Mode"
          value={mode}
          options={MODES}
          onChange={changeList(setMode)}
        />
        {mode === "stacked" ? (
          <>
            <Toggle
              stacked
              label="Chords"
              value={size}
              options={SIZES}
              onChange={changeList(setSize)}
            />
            <Toggle
              stacked
              label="Stacked in"
              value={step}
              options={STEPS}
              onChange={changeList(setStep)}
            />
          </>
        ) : (
          <>
            <Toggle
              stacked
              label="Chord types"
              value={filter}
              options={FILTER_OPTIONS}
              onChange={changeList(setFilter)}
            />
            <Toggle
              stacked
              label="Order"
              value={order}
              options={ORDERS}
              onChange={changeList(setOrder)}
            />
          </>
        )}
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <PianoKeyboard
            from={from}
            to={to}
            active={active}
            shaded={shaded}
            marked={chord ? Note.get(chord.notes[0]).height : undefined}
            keyName={(midi) => Note.fromMidi(midi)}
            onKey={(midi) => play([midi])}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex-1">
          <span className="font-mono text-lg font-semibold">{name}</span>
          <span className="ms-3 font-mono text-fd-muted-foreground">
            {scale.notes.join(" ")}
          </span>
        </div>
        <button
          type="button"
          className="rounded-lg border border-fd-border px-3 py-1.5 font-medium hover:bg-fd-accent"
          onClick={() => play(scaleNotes, { arpeggio: true })}
        >
          Play scale
        </button>
        {mode === "stacked" ? (
          <button
            type="button"
            className="rounded-lg bg-fd-primary px-3 py-1.5 font-medium text-fd-primary-foreground hover:opacity-90"
            onClick={() => playSequence(chords.map((c) => c.notes))}
          >
            Play chords
          </button>
        ) : null}
      </div>
      <div className="-mt-4">
        <PianoMessage status={status} />
      </div>

      <ModeLinks name={name} onScale={changeScale} />

      {mode === "all" ? (
        <AllChords
          degrees={degrees}
          total={allChords.length}
          selected={selected}
          onChoose={choose}
          onPlay={(notes) => playSequence(notes)}
        />
      ) : (
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {chords.map((c, i) => (
            <li key={c.degree}>
              <button
                type="button"
                aria-pressed={selected === i}
                onClick={() => choose(i)}
                className={`flex h-full w-full flex-col gap-1 rounded-xl border p-3 text-start ${
                  selected === i
                    ? "border-sky-500 bg-sky-500/10"
                    : "border-fd-border bg-fd-card hover:bg-fd-accent"
                }`}
              >
                <span className="text-xs text-fd-muted-foreground">
                  {c.degree}
                  {romans[i] ? ` · ${romans[i]}` : null}
                </span>
                <span className="font-mono text-lg font-bold">
                  {c.symbol || "—"}
                </span>
                <span className="font-mono text-xs text-fd-muted-foreground">
                  {c.notes.map((n) => Note.get(n).pc).join(" ")}
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}

      {chord ? (
        <p className="text-sm">
          {chord.symbol
            ? `Degree ${chord.degree}: ${chord.symbol} (${chord.notes.join(" ")}). `
            : `Degree ${chord.degree}: no chord type has the notes ${chord.notes.join(" ")}. `}
          <Link
            href={`/apps/chord-finder/?notes=${chord.notes.map(encodeURIComponent).join(",")}`}
            className="underline"
          >
            Open in the chord finder
          </Link>
        </p>
      ) : (
        <p className="text-sm text-fd-muted-foreground">
          Click a chord to hear it and see it on the keyboard.
        </p>
      )}

      {mode === "stacked" ? <FittingChords name={name} tonic={tonic} /> : null}

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">The code</h2>
        <DynamicCodeBlock
          lang="js"
          code={
            mode === "all"
              ? allCode({ tonic, type, filter, order, selected })
              : code({ tonic, type, size, step, selected, seven })
          }
        />
      </section>
    </div>
  );
}

function ModeLinks({
  name,
  onScale,
}: {
  name: string;
  onScale: (tonic: string, type: string) => void;
}) {
  const modes = Scale.modeNames(name);
  if (modes.length < 2) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-fd-muted-foreground">Modes:</span>
      {modes.map(([modeTonic, modeType], i) => (
        <button
          key={`${modeTonic} ${modeType}`}
          type="button"
          aria-pressed={i === 0}
          className={`rounded-md px-2 py-0.5 font-mono ${
            i === 0
              ? "bg-fd-primary text-fd-primary-foreground"
              : "bg-fd-secondary hover:bg-fd-accent"
          }`}
          onClick={() => onScale(modeTonic, modeType)}
        >
          {modeTonic} {modeType}
        </button>
      ))}
    </div>
  );
}

type Degree = {
  degree: number;
  root: string;
  chords: { chord: { notes: string[]; symbol: string }; index: number }[];
};

// The chords of each degree, a card per degree
function AllChords({
  degrees,
  total,
  selected,
  onChoose,
  onPlay,
}: {
  degrees: Degree[];
  total: number;
  selected: number | null;
  onChoose: (index: number) => void;
  onPlay: (notes: string[][]) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-fd-muted-foreground">
        {total} chords whose notes are all in the scale.
      </p>
      <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {degrees.map(({ degree, root, chords }) => (
          <li
            key={degree}
            className="flex flex-col gap-2 rounded-xl border border-fd-border bg-fd-card p-3"
          >
            <div className="flex items-center gap-2">
              <span className="flex-1 text-sm">
                <span className="font-mono font-semibold">{root}</span>
                <span className="text-fd-muted-foreground">
                  {" "}
                  · degree {degree} · {chords.length}{" "}
                  {chords.length === 1 ? "chord" : "chords"}
                </span>
              </span>
              {chords.length > 1 ? (
                <button
                  type="button"
                  className="rounded-md px-2 py-0.5 text-xs hover:bg-fd-accent"
                  onClick={() => onPlay(chords.map(({ chord }) => chord.notes))}
                >
                  Play all
                </button>
              ) : null}
            </div>
            {chords.length ? (
              <div className="flex flex-wrap gap-1.5 text-sm">
                {chords.map(({ chord, index }) => (
                  <Chip
                    key={index}
                    pressed={selected === index}
                    title={chord.notes.map((n) => Note.get(n).pc).join(" ")}
                    onClick={() => onChoose(index)}
                  >
                    {chord.symbol}
                  </Chip>
                ))}
              </div>
            ) : (
              <p className="text-sm text-fd-muted-foreground">
                No chord of these types.
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function FittingChords({ name, tonic }: { name: string; tonic: string }) {
  const types = Scale.scaleChords(name);
  if (!types.length) return null;
  return (
    <div className="text-sm">
      <span className="text-fd-muted-foreground">
        Chords on the tonic whose notes are all in the scale:{" "}
      </span>
      <span className="font-mono">
        {types.map((t) => tonic + t).join(", ")}
      </span>
    </div>
  );
}

// The tonal calls behind what the page shows
function code({
  tonic,
  type,
  size,
  step,
  selected,
  seven,
}: {
  tonic: string;
  type: string;
  size: number;
  step: number;
  selected: number | null;
  seven: boolean;
}) {
  const name = `${tonic} ${type}`;
  const voiced = `${tonic}${OCTAVE} ${type}`;
  const options = [
    size !== 3 ? `size: ${size}` : "",
    step !== 2 ? `step: ${step}` : "",
  ]
    .filter(Boolean)
    .join(", ");
  const chords = Scale.chords(voiced, { size, step });
  const symbols = chords.map((c) => c.symbol);
  const lines = [
    `import { ${seven ? "Progression, " : ""}Scale } from "tonal";`,
    "",
    `Scale.get(${show(name)}).notes;`,
    `// => ${show(Scale.get(name).notes)}`,
    "",
    `const chords = Scale.chords(${show(voiced)}${options ? `, { ${options} }` : ""});`,
    `chords.map((c) => c.symbol);`,
    `// => ${show(symbols)}`,
  ];
  if (selected !== null && chords[selected]) {
    lines.push(`chords[${selected}];`, `// => ${show(chords[selected])}`);
  }
  if (seven) {
    lines.push(
      "",
      `Progression.toRomanNumerals(${show(tonic)}, chords.map((c) => c.symbol));`,
      `// => ${show(Progression.toRomanNumerals(tonic, symbols))}`,
    );
  }
  lines.push(
    "",
    `Scale.scaleChords(${show(name)});`,
    `// => ${show(Scale.scaleChords(name))}`,
  );
  return lines.join("\n");
}

// The tonal call of the "All chords" mode
function allCode({
  tonic,
  type,
  filter,
  order,
  selected,
}: {
  tonic: string;
  type: string;
  filter: Filter;
  order: Order;
  selected: number | null;
}) {
  const voiced = `${tonic}${OCTAVE} ${type}`;
  const types = FILTERS[filter];
  const options = [
    "all: true",
    types ? "types" : "",
    order !== "common" ? `order: ${show(order)}` : "",
  ]
    .filter(Boolean)
    .join(", ");
  const chords = Scale.chords(voiced, { all: true, types, order });
  const chord = selected !== null ? chords[selected] : undefined;
  const degree = chord?.degree ?? 1;
  const counts = Scale.get(voiced).notes.map(
    (_, i) => chords.filter((c) => c.degree === i + 1).length,
  );
  const lines = [
    `import { Scale } from "tonal";`,
    "",
    ...(types ? [`const types = ${show(types)};`] : []),
    `const chords = Scale.chords(${show(voiced)}, { ${options} });`,
    `chords.length;`,
    `// => ${chords.length}`,
    "",
    `// the chords on degree ${degree}`,
    `chords.filter((c) => c.degree === ${degree}).map((c) => c.symbol);`,
    `// => ${show(chords.filter((c) => c.degree === degree).map((c) => c.symbol))}`,
    "",
    `// how many on each degree`,
    `Scale.get(${show(voiced)}).notes.map((_, i) => chords.filter((c) => c.degree === i + 1).length);`,
    `// => [${counts.join(", ")}]`,
  ];
  if (chord) {
    lines.push("", `chords[${selected}];`, `// => ${show(chord)}`);
  }
  return lines.join("\n");
}
