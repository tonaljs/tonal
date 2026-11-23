"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { useEffect, useMemo, useRef, useState } from "react";
import { Chord, Note } from "tonal";
import { voice } from "@/lib/voice";
import { keyboardRange, PianoKeyboard } from "./piano-keyboard";
import { useMidiInput } from "./use-midi";
import { usePiano } from "./use-piano";

const DEFAULT_NOTES = ["C4", "E4", "G4", "B4"];

const EXAMPLES = [
  "E3 G3 C4",
  "C E G Bb D",
  "C E B",
  "F# A C Eb",
  "C D G",
  "Cm7b5/Gb",
  "Ab13",
  "C7#9",
  "Co9",
  "Cm7 b9",
];

type Spelling = "flat" | "sharp";
type Labels = "degrees" | "notes";

// What the chord finder looks at: notes, and the chord symbol if one was typed
type Query = { notes: string[]; chord?: string };

// Several notes ("C E G", "C4,E4,G4") or one chord symbol ("Cmaj7", "C/E")
function parseText(text: string): Query | null {
  const tokens = text
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean);
  if (!tokens.length) return { notes: [] };
  if (tokens.length > 1 && tokens.every((token) => !Note.get(token).empty)) {
    return { notes: voice(tokens.map((token) => Note.get(token).name)) };
  }
  const chord = Chord.get(text.trim());
  if (chord.empty || !chord.tonic) return null;
  return { notes: voice(chord.notes), chord: chord.symbol };
}

const byHeight = (a: string, b: string) =>
  Note.get(a).height - Note.get(b).height;

const show = (value: unknown) =>
  JSON.stringify(value).replaceAll('","', '", "');

export function ChordFinder() {
  // the text box, and the notes when they come from the keyboard
  const [text, setText] = useState(DEFAULT_NOTES.join(" "));
  const [keys, setKeys] = useState<string[] | null>(DEFAULT_NOTES);
  const [selected, setSelected] = useState<string | null>(null);
  const [spelling, setSpelling] = useState<Spelling>("flat");
  const [labels, setLabels] = useState<Labels>("degrees");
  const [assumePerfectFifth, setAssumePerfectFifth] = useState(false);
  // the link has been read: until then, don't overwrite it
  const [linkRead, setLinkRead] = useState(false);
  const { status, play } = usePiano();

  // a MIDI keyboard: the held keys are the chord. When they are released the
  // chord stays, and the next key starts a new one.
  const held = useRef(new Set<number>());
  const midi = useMidiInput({
    noteOn(note) {
      held.current.add(note);
      const next = [...held.current].sort((a, b) => a - b).map(spell);
      setKeys(next);
      setText(next.join(" "));
      setSelected(null);
    },
    noteOff(note) {
      held.current.delete(note);
    },
  });

  // read the chord or the notes of a shared link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const notes = params.get("notes");
    const chord = params.get("chord");
    if (notes) {
      const list = notes.split(",").filter((n) => !Note.get(n).empty);
      setKeys(list);
      setText(list.join(" "));
    } else if (chord) {
      setKeys(null);
      setText(chord);
    }
    setLinkRead(true);
  }, []);

  // keep the link up to date, to share it
  useEffect(() => {
    if (!linkRead) return;
    const params = keys
      ? keys.length
        ? // "#" must be escaped, or the rest of the link is a fragment
          `?notes=${keys.map(encodeURIComponent).join(",")}`
        : ""
      : text.trim()
        ? `?chord=${encodeURIComponent(text.trim())}`
        : "";
    window.history.replaceState(null, "", window.location.pathname + params);
  }, [linkRead, keys, text]);

  const query = useMemo(
    () => (keys ? { notes: keys } : parseText(text)),
    [keys, text],
  );
  const notes = query?.notes ?? [];

  const detected = useMemo(
    () => (notes.length ? Chord.detect(notes, { assumePerfectFifth }) : []),
    [notes, assumePerfectFifth],
  );
  const names = query?.chord
    ? [query.chord, ...detected.filter((name) => name !== query.chord)]
    : detected;
  const current =
    selected && names.includes(selected) ? selected : (names[0] ?? null);
  const chord = current ? Chord.get(current) : null;

  const active = new Map(
    notes.map((note) => [
      Note.get(note).height,
      labels === "degrees" && current
        ? Chord.degreeOf(current, note) || Note.get(note).pc
        : Note.get(note).pc,
    ]),
  );
  const bass = notes.length
    ? Note.get([...notes].sort(byHeight)[0]).height
    : undefined;

  function spell(midi: number) {
    return spelling === "flat"
      ? Note.fromMidi(midi)
      : Note.fromMidiSharps(midi);
  }

  const [from, to] = keyboardRange(notes.map((note) => Note.get(note).height));

  function toggleKey(midi: number) {
    const existing = notes.find((note) => Note.get(note).height === midi);
    const next = existing
      ? notes.filter((note) => note !== existing)
      : [...notes, spell(midi)].sort(byHeight);
    setKeys(next);
    setText(next.join(" "));
    setSelected(null);
    if (!existing) play([midi]);
  }

  function typeText(value: string) {
    setKeys(null);
    setText(value);
    setSelected(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {/* on small screens the keyboard keeps a playable size and scrolls */}
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <PianoKeyboard
              from={from}
              to={to}
              active={active}
              marked={bass}
              keyName={spell}
              onKey={toggleKey}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <Toggle
            label="Black keys"
            value={spelling}
            options={[
              ["flat", "♭"],
              ["sharp", "♯"],
            ]}
            onChange={setSpelling}
          />
          <Toggle
            label="Labels"
            value={labels}
            options={[
              ["degrees", "Degrees"],
              ["notes", "Notes"],
            ]}
            onChange={setLabels}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={assumePerfectFifth}
              onChange={(e) => setAssumePerfectFifth(e.target.checked)}
            />
            Assume a perfect fifth
          </label>
          <button
            type="button"
            className="ms-auto text-fd-muted-foreground underline hover:text-fd-foreground"
            onClick={() => {
              setKeys([]);
              setText("");
            }}
          >
            Clear
          </button>
        </div>
        <MidiControl {...midi} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="chord-finder-input" className="text-sm font-medium">
          Notes or chord symbol
        </label>
        <input
          id="chord-finder-input"
          value={text}
          onChange={(e) => typeText(e.target.value)}
          placeholder="C E G Bb, or Cm7b5/Gb"
          spellCheck={false}
          autoComplete="off"
          className="rounded-lg border border-fd-border bg-fd-background px-3 py-2 font-mono text-base outline-none focus:ring-2 focus:ring-fd-ring"
        />
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-fd-muted-foreground">Try:</span>
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              className="rounded-md bg-fd-secondary px-2 py-0.5 font-mono hover:bg-fd-accent"
              onClick={() => typeText(example)}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {query === null ? (
        <p className="text-fd-muted-foreground">
          That's not a list of notes or a chord symbol with a root.
        </p>
      ) : !notes.length ? (
        <p className="text-fd-muted-foreground">
          Press some keys, or type notes or a chord symbol.
        </p>
      ) : !chord ? (
        <p className="text-fd-muted-foreground">
          No chord has exactly these notes.
        </p>
      ) : (
        <ChordDetails
          chord={chord}
          names={names}
          current={current!}
          notes={notes}
          status={status}
          onSelect={setSelected}
          onChord={typeText}
          onPlay={(arpeggio) => play(notes, { arpeggio })}
        />
      )}

      {notes.length ? (
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">The code</h2>
          <DynamicCodeBlock
            lang="js"
            code={code(query!, current, assumePerfectFifth)}
          />
        </section>
      ) : null}
    </div>
  );
}

function ChordDetails({
  chord,
  names,
  current,
  notes,
  status,
  onSelect,
  onChord,
  onPlay,
}: {
  chord: ReturnType<typeof Chord.get>;
  names: string[];
  current: string;
  notes: string[];
  status: ReturnType<typeof usePiano>["status"];
  onSelect: (name: string) => void;
  onChord: (name: string) => void;
  onPlay: (arpeggio: boolean) => void;
}) {
  const reduced = Chord.reduced(current);
  const extended = Chord.extended(current);
  const scales = Chord.chordScales(current);
  const symbol = (alias: string) =>
    (chord.tonic ?? "") + alias + (chord.bass ? `/${chord.bass}` : "");
  // a chord played without its fifth: the same name without "no5"
  const withFifth = withoutFifthOf(current);

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-fd-border bg-fd-card p-4 md:p-6">
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex-1">
          <div className="font-mono text-4xl font-bold">{current}</div>
          <div className="mt-1 text-fd-muted-foreground">
            {chord.name} · {chord.family}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg bg-fd-primary px-4 py-2 font-medium text-fd-primary-foreground hover:opacity-90"
            onClick={() => onPlay(false)}
          >
            Play
          </button>
          <button
            type="button"
            className="rounded-lg border border-fd-border px-4 py-2 font-medium hover:bg-fd-accent"
            onClick={() => onPlay(true)}
          >
            Arpeggio
          </button>
        </div>
      </div>
      {status === "loading" ? (
        <p className="text-sm text-fd-muted-foreground">Loading the piano…</p>
      ) : status === "error" ? (
        <p className="text-sm text-fd-muted-foreground">
          The piano samples could not be loaded.
        </p>
      ) : null}

      {names.length > 1 ? (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-fd-muted-foreground">Possible names:</span>
          {names.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={name === current}
              className={`rounded-md px-2 py-0.5 font-mono ${
                name === current
                  ? "bg-fd-primary text-fd-primary-foreground"
                  : "bg-fd-secondary hover:bg-fd-accent"
              }`}
              onClick={() => onSelect(name)}
            >
              {name}
            </button>
          ))}
        </div>
      ) : null}

      {withFifth ? (
        <p className="text-sm">
          <span className="text-fd-muted-foreground">
            Played without its fifth. With it, it's{" "}
          </span>
          <button
            type="button"
            className="rounded-md bg-fd-secondary px-2 py-0.5 font-mono hover:bg-fd-accent"
            onClick={() => onChord(withFifth)}
          >
            {withFifth}
          </button>
        </p>
      ) : null}

      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        <Row term="Notes">{notes.join(" ")}</Row>
        <Row term="Chord notes">{chord.notes.join(" ")}</Row>
        <Row term="Intervals">{chord.intervals.join(" ")}</Row>
        <Row term="Formula">{Chord.formula(current).join(" ")}</Row>
        <Row term="Most important">
          {Chord.degreesByImportance(current).join(" ")}
        </Row>
        <Row term="Complexity">{chord.complexity}</Row>
        <Row term="Also written">
          {chord.aliases
            .map(symbol)
            .filter((s) => s !== current)
            .join(", ") || "—"}
        </Row>
      </dl>

      <ChordLinks title="Inside it" chords={reduced} onChord={onChord} />
      <ChordLinks
        title="Extensions"
        chords={extended.slice(0, 16)}
        onChord={onChord}
      />
      {scales.length ? (
        <div className="text-sm">
          <span className="text-fd-muted-foreground">Scales that fit: </span>
          {scales.slice(0, 12).join(", ")}
          {scales.length > 12 ? ` and ${scales.length - 12} more` : null}
        </div>
      ) : null}
    </section>
  );
}

// "Cmaj7no5/E" is "Cmaj7/E" without its fifth
function withoutFifthOf(name: string): string | null {
  const [tonic, type, bass] = Chord.tokenize(name);
  if (!type.endsWith("no5")) return null;
  const full = `${tonic}${type.slice(0, -3)}${bass ? `/${bass}` : ""}`;
  const chord = Chord.get(full);
  return chord.empty || !chord.intervals.includes("5P") ? null : full;
}

function MidiControl({
  status,
  inputs,
  connect,
}: ReturnType<typeof useMidiInput>) {
  if (status === "unsupported") return null;
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {status === "on" ? (
        <span className="text-fd-muted-foreground">
          {inputs.length
            ? `MIDI: ${inputs.join(", ")}. Play a chord on it.`
            : "No MIDI keyboard found. Plug one in."}
        </span>
      ) : (
        <>
          <button
            type="button"
            className="rounded-md border border-fd-border px-2 py-0.5 hover:bg-fd-accent"
            disabled={status === "connecting"}
            onClick={connect}
          >
            Use a MIDI keyboard
          </button>
          {status === "denied" ? (
            <span className="text-fd-muted-foreground">
              The browser didn't allow MIDI access.
            </span>
          ) : null}
        </>
      )}
    </div>
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

function ChordLinks({
  title,
  chords,
  onChord,
}: {
  title: string;
  chords: string[];
  onChord: (name: string) => void;
}) {
  if (!chords.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-fd-muted-foreground">{title}:</span>
      {chords.map((name) => (
        <button
          key={name}
          type="button"
          className="rounded-md bg-fd-secondary px-2 py-0.5 font-mono hover:bg-fd-accent"
          onClick={() => onChord(name)}
        >
          {name}
        </button>
      ))}
    </div>
  );
}

function Toggle<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: [T, string][];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label={label}>
      <span className="text-fd-muted-foreground">{label}</span>
      <div className="flex overflow-hidden rounded-md border border-fd-border">
        {options.map(([option, text]) => (
          <button
            key={option}
            type="button"
            aria-pressed={option === value}
            className={`px-2 py-0.5 ${
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
function code(
  query: Query,
  current: string | null,
  assumePerfectFifth: boolean,
) {
  const lines = ['import { Chord } from "tonal";', ""];
  if (query.chord) {
    lines.push(
      `Chord.get(${show(query.chord)}).notes; // => ${show(Chord.get(query.chord).notes)}`,
      "",
    );
  }
  const options = assumePerfectFifth ? ", { assumePerfectFifth: true }" : "";
  lines.push(
    `Chord.detect(${show(query.notes)}${options});`,
    `// => ${show(Chord.detect(query.notes, { assumePerfectFifth }))}`,
  );
  if (current) {
    const chord = Chord.get(current);
    const name = show(current);
    lines.push(
      "",
      `const chord = Chord.get(${name});`,
      `chord.name; // => ${show(chord.name)}`,
      `chord.intervals; // => ${show(chord.intervals)}`,
      `chord.family; // => ${show(chord.family)}`,
      `chord.complexity; // => ${chord.complexity}`,
      `Chord.formula(${name}); // => ${show(Chord.formula(current))}`,
      `Chord.degreesByImportance(${name}); // => ${show(Chord.degreesByImportance(current))}`,
      `Chord.degreeOf(${name}, ${show(query.notes[0])}); // => ${show(Chord.degreeOf(current, query.notes[0]))}`,
    );
  }
  return lines.join("\n");
}
