"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Note, Progression, Scale, ScaleType } from "tonal";
import { keyboardRange, PianoKeyboard } from "./piano-keyboard";
import { usePiano } from "./use-piano";

const TONICS = [
  "C",
  "C#",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "F#",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
];

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

const show = (value: unknown) =>
  JSON.stringify(value)
    .replaceAll('","', '", "')
    .replaceAll('":', '": ')
    .replaceAll(',"', ', "');

const isValid = (tonic: string, type: string) =>
  !Note.get(tonic).empty && !ScaleType.get(type).empty;

export function ScaleChords() {
  const [tonic, setTonic] = useState("C");
  const [type, setType] = useState("major");
  const [size, setSize] = useState(4);
  const [step, setStep] = useState(2);
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
    setLinkRead(true);
  }, []);

  // keep the link up to date, to share it
  useEffect(() => {
    if (!linkRead) return;
    const params = new URLSearchParams({
      tonic,
      type,
      size: String(size),
      step: String(step),
    });
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString().replaceAll("+", "%20")}`,
    );
  }, [linkRead, tonic, type, size, step]);

  const name = `${tonic} ${type}`;
  const scale = useMemo(() => Scale.get(name), [name]);
  const chords = useMemo(
    () => Scale.chords(`${tonic}${OCTAVE} ${type}`, { size, step }),
    [tonic, type, size, step],
  );
  const seven = scale.notes.length === 7;
  const romans = chords.map(({ symbol }) =>
    seven && symbol ? Progression.toRomanNumerals(tonic, [symbol])[0] : "",
  );
  const chord = selected !== null ? chords[selected] : undefined;

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
    play(chords[index].notes);
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
          label="Chords"
          value={size}
          options={SIZES}
          onChange={setSize}
        />
        <Toggle
          label="Stacked in"
          value={step}
          options={STEPS}
          onChange={setStep}
        />
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
        <button
          type="button"
          className="rounded-lg bg-fd-primary px-3 py-1.5 font-medium text-fd-primary-foreground hover:opacity-90"
          onClick={() => playSequence(chords.map((c) => c.notes))}
        >
          Play chords
        </button>
      </div>
      {status === "loading" ? (
        <p className="-mt-4 text-sm text-fd-muted-foreground">
          Loading the piano…
        </p>
      ) : status === "error" ? (
        <p className="-mt-4 text-sm text-fd-muted-foreground">
          The piano samples could not be loaded.
        </p>
      ) : null}

      <ModeLinks name={name} onScale={changeScale} />

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

      <FittingChords name={name} tonic={tonic} />

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">The code</h2>
        <DynamicCodeBlock
          lang="js"
          code={code({ tonic, type, size, step, selected, seven })}
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

function Toggle({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: number;
  options: [number, string][];
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1" role="group" aria-label={label}>
      <span className="font-medium">{label}</span>
      <div className="flex overflow-hidden rounded-lg border border-fd-border">
        {options.map(([option, text]) => (
          <button
            key={option}
            type="button"
            aria-pressed={option === value}
            className={`px-2 py-1.5 ${
              option === value
                ? "bg-fd-primary text-fd-primary-foreground"
                : "hover:bg-fd-accent"
            }`}
            onClick={() => onChange(option)}
          >
            {text}
          </button>
        ))}
      </div>
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
