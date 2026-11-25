"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Chord, Key, Note, Progression } from "tonal";
import { voice } from "@/lib/voice";
import { CircleOfFifths, type KeyMode, tonicOf } from "./circle-of-fifths";
import { Chip, PianoMessage, show, Toggle } from "./controls";
import { keyboardRange, PianoKeyboard } from "./piano-keyboard";
import { usePiano } from "./use-piano";

type MinorScale = "natural" | "harmonic" | "melodic";

const MODES: [KeyMode, string][] = [
  ["major", "Major"],
  ["minor", "Minor"],
];

const MINOR_SCALES: [MinorScale, string][] = [
  ["natural", "Natural"],
  ["harmonic", "Harmonic"],
  ["melodic", "Melodic"],
];

const FUNCTIONS: Record<string, string> = {
  T: "tonic",
  SD: "subdominant",
  D: "dominant",
};

// the scale and the chords start at octave 3, so they fit on the keyboard
const OCTAVE = 3;

const inRange = (sig: number) => Math.abs(sig) <= 7;

/** The accidentals of a key signature, in the order they are written. */
function accidentals(sig: number): string[] {
  return Array.from({ length: Math.abs(sig) }, (_, i) =>
    sig > 0 ? Note.transposeFifths("F#", i) : Note.transposeFifths("Bb", -i),
  );
}

/** The key signature of a key, or null if it has more than 7 accidentals. */
function signatureOf(tonic: string, mode: KeyMode): number | null {
  const key = mode === "major" ? Key.majorKey(tonic) : Key.minorKey(tonic);
  return key.tonic && inRange(key.alteration) ? key.alteration : null;
}

const keyName = (tonic: string, mode: KeyMode) => `${tonic} ${mode}`;

export function KeyExplorer() {
  const [sig, setSig] = useState(0);
  const [mode, setMode] = useState<KeyMode>("major");
  const [minorScale, setMinorScale] = useState<MinorScale>("natural");
  const [selected, setSelected] = useState<string | null>(null);
  const [linkRead, setLinkRead] = useState(false);
  const { status, play, playSequence } = usePiano();

  // read the key of a shared link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const linkMode = params.get("mode") === "minor" ? "minor" : "major";
    const linkSig = signatureOf(params.get("key") ?? "", linkMode);
    if (linkSig !== null) {
      setSig(linkSig);
      setMode(linkMode);
    }
    const linkScale = params.get("scale");
    if (MINOR_SCALES.some(([s]) => s === linkScale)) {
      setMinorScale(linkScale as MinorScale);
    }
    setLinkRead(true);
  }, []);

  const tonic = tonicOf(sig, mode);

  // keep the link up to date, to share it
  useEffect(() => {
    if (!linkRead) return;
    const params = new URLSearchParams({ key: tonic, mode });
    if (mode === "minor") params.set("scale", minorScale);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params}`,
    );
  }, [linkRead, tonic, mode, minorScale]);

  const scale = useMemo(
    () =>
      mode === "major" ? Key.majorKey(tonic) : Key.minorKey(tonic)[minorScale],
    [tonic, mode, minorScale],
  );
  const roles = useMemo(
    () =>
      new Map(
        (mode === "major"
          ? Key.majorKeyChords(tonic)
          : Key.minorKeyChords(tonic)
        ).map((c) => [c.name, c.roles]),
      ),
    [tonic, mode],
  );
  const numerals = Progression.toRomanNumerals(tonic, [...scale.chords]);

  function selectKey(newSig: number, newMode: KeyMode) {
    setSig(newSig);
    setMode(newMode);
    setSelected(null);
  }

  // the related keys, with the signature and mode to select them
  const relative: [string, number, KeyMode] = [
    mode === "major" ? "Relative minor" : "Relative major",
    sig,
    mode === "major" ? "minor" : "major",
  ];
  const parallelMode: KeyMode = mode === "major" ? "minor" : "major";
  const parallelSig = signatureOf(tonic, parallelMode);
  const related = [
    relative,
    ...(parallelSig !== null
      ? [["Parallel " + parallelMode, parallelSig, parallelMode] as const]
      : []),
    ...(inRange(sig + 1) ? [["Dominant key", sig + 1, mode] as const] : []),
    ...(inRange(sig - 1) ? [["Subdominant key", sig - 1, mode] as const] : []),
  ];

  // the scale from the tonic to the tonic an octave higher
  const scaleNotes = voice([...scale.scale, tonic], OCTAVE);
  const shaded = new Map(
    scaleNotes.map((note, i) => [
      Note.get(note).height,
      scale.grades[i % 7] ?? "",
    ]),
  );
  const chordNotes = (name: string) => voice(Chord.get(name).notes, OCTAVE);
  const active = new Map(
    (selected ? chordNotes(selected) : []).map((note) => [
      Note.get(note).height,
      Note.get(note).pc,
    ]),
  );
  const [from, to] = keyboardRange([...shaded.keys(), ...active.keys()]);

  function choose(name: string) {
    setSelected(name);
    play(chordNotes(name));
  }

  const chordRow = (title: string, names: readonly string[], prefix = "") => (
    <tr>
      <th
        scope="row"
        className="whitespace-nowrap pe-3 text-start font-medium text-fd-muted-foreground"
      >
        {title}
      </th>
      {names.map((name, i) => (
        <td key={i} className="p-1">
          {name ? (
            <div className="flex flex-col items-start gap-0.5">
              {prefix ? (
                <span className="text-xs text-fd-muted-foreground">
                  {prefix}/{scale.grades[i]}
                </span>
              ) : null}
              <Chip pressed={selected === name} onClick={() => choose(name)}>
                {name}
              </Chip>
            </div>
          ) : (
            <span className="text-fd-muted-foreground">·</span>
          )}
        </td>
      ))}
    </tr>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid items-start gap-6 md:grid-cols-[320px_1fr]">
        <CircleOfFifths sig={sig} mode={mode} onSelect={selectKey} />

        <div className="flex flex-col gap-4 text-sm">
          <div className="flex flex-wrap items-center gap-4">
            <Toggle
              label="Mode"
              value={mode}
              options={MODES}
              onChange={(m) => {
                const s = signatureOf(tonic, m);
                // the parallel key when it exists, the relative one if not
                selectKey(s ?? sig, m);
              }}
            />
            {mode === "minor" ? (
              <Toggle
                label="Scale"
                value={minorScale}
                options={MINOR_SCALES}
                onChange={(s) => {
                  setMinorScale(s);
                  setSelected(null);
                }}
              />
            ) : null}
          </div>

          <div>
            <h2 className="font-mono text-2xl font-bold">
              {keyName(tonic, mode)}
              {mode === "minor" && minorScale !== "natural" ? (
                <span className="ms-2 text-base font-normal text-fd-muted-foreground">
                  ({minorScale} scale)
                </span>
              ) : null}
            </h2>
            <p className="mt-1 text-fd-muted-foreground">
              {sig === 0
                ? "No sharps or flats"
                : `${Math.abs(sig)} ${sig > 0 ? "sharp" : "flat"}${Math.abs(sig) > 1 ? "s" : ""}: `}
              <span className="font-mono text-fd-foreground">
                {accidentals(sig).join(" ")}
              </span>
            </p>
          </div>

          <KeySignature sig={sig} />

          <div className="flex flex-wrap items-center gap-2">
            {related.map(([label, s, m]) => (
              <button
                key={label}
                type="button"
                className="rounded-lg border border-fd-border px-2 py-1 hover:bg-fd-accent"
                onClick={() => selectKey(s, m)}
              >
                <span className="text-fd-muted-foreground">{label}: </span>
                <span className="font-mono font-semibold">
                  {keyName(tonicOf(s, m), m)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <PianoKeyboard
            from={from}
            to={to}
            active={active}
            shaded={shaded}
            marked={
              selected ? Note.get(chordNotes(selected)[0]).height : undefined
            }
            keyName={(midi) => Note.fromMidi(midi)}
            onKey={(midi) => play([midi])}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex-1 font-mono">
          {scale.scale.map((note, i) => (
            <span key={note} className="me-3 inline-flex flex-col">
              <span className="text-xs text-fd-muted-foreground">
                {scale.grades[i]}
              </span>
              <span className="text-lg font-semibold">{note}</span>
            </span>
          ))}
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
          onClick={() => playSequence(scale.chords.map(chordNotes))}
        >
          Play chords
        </button>
      </div>
      <PianoMessage status={status} />

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Chords</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th />
                {scale.grades.map((grade, i) => (
                  <th
                    key={grade}
                    scope="col"
                    className="p-1 text-start font-mono"
                  >
                    {grade}
                    <span className="block text-xs font-normal text-fd-muted-foreground">
                      {FUNCTIONS[scale.chordsHarmonicFunction[i]] ?? ""}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chordRow("Triads", scale.triads)}
              {chordRow("Sevenths", scale.chords)}
              {chordRow("Secondary dominants", scale.secondaryDominants, "V")}
              {chordRow("Their ii", scale.secondaryDominantSupertonics, "ii")}
              {chordRow(
                "Substitute dominants",
                scale.substituteDominants,
                "subV",
              )}
              {chordRow(
                "Their ii",
                scale.substituteDominantSupertonics,
                "subii",
              )}
              <tr>
                <th
                  scope="row"
                  className="whitespace-nowrap pe-3 text-start font-medium text-fd-muted-foreground"
                >
                  Chord scales
                </th>
                {scale.chordScales.map((name, i) => (
                  <td key={i} className="p-1 align-top text-xs">
                    <Link
                      href={`/apps/scale-chords/?tonic=${encodeURIComponent(scale.scale[i])}&type=${encodeURIComponent(name.split(" ").slice(1).join(" "))}`}
                      className="underline decoration-fd-border hover:decoration-fd-foreground"
                    >
                      {name}
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {selected ? (
        <p className="text-sm">
          <span className="font-mono font-semibold">{selected}</span> (
          <span className="font-mono">
            {Chord.get(selected).notes.join(" ")}
          </span>
          ){numeralOf(selected, scale.chords, numerals)}:{" "}
          {describeRoles(roles.get(selected) ?? [])}.{" "}
          <Link
            href={`/apps/chord-finder/?chord=${encodeURIComponent(selected)}`}
            className="underline"
          >
            Open in the chord finder
          </Link>
        </p>
      ) : (
        <p className="text-sm text-fd-muted-foreground">
          Click a chord to hear it, see it on the keyboard and read its roles in
          the key.
        </p>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">The code</h2>
        <DynamicCodeBlock
          lang="js"
          code={code({ tonic, mode, minorScale, sig, selected, roles })}
        />
      </section>
    </div>
  );
}

function numeralOf(
  name: string,
  chords: readonly string[],
  numerals: string[],
) {
  const i = chords.indexOf(name);
  return i >= 0 && numerals[i] ? `, ${numerals[i]}` : "";
}

function describeRoles(roles: string[]) {
  if (!roles.length) return "a chord of the key";
  return roles
    .map((role) => {
      if (FUNCTIONS[role]) return `the ${FUNCTIONS[role]} function`;
      const [kind, target] = role.split("/");
      const what =
        kind === "V"
          ? "the secondary dominant"
          : kind === "subV"
            ? "the substitute dominant"
            : kind === "ii"
              ? "the ii before the secondary dominant"
              : kind === "subii"
                ? "the ii before the substitute dominant"
                : role;
      return `${what} of ${target} (${role})`;
    })
    .join("; ");
}

// the treble staff positions (in steps above E4) of the accidentals
const SHARP_STEPS = [8, 5, 9, 6, 3, 7, 4];
const FLAT_STEPS = [4, 7, 3, 6, 2, 5, 1];

/** A key signature on a treble staff. */
function KeySignature({ sig }: { sig: number }) {
  const gap = 8;
  const bottom = 52;
  const stepY = (step: number) => bottom - (step * gap) / 2;
  const steps = (sig > 0 ? SHARP_STEPS : FLAT_STEPS).slice(0, Math.abs(sig));
  const width = 56 + 7 * 11 + 16;
  return (
    <svg
      viewBox={`0 0 ${width} 72`}
      className="h-[72px] w-auto text-fd-foreground"
      role="img"
      aria-label={
        sig === 0
          ? "Key signature without accidentals"
          : `Key signature: ${accidentals(sig).join(", ")}`
      }
    >
      {[0, 1, 2, 3, 4].map((line) => (
        <line
          key={line}
          x1={0}
          x2={width}
          y1={stepY(line * 2)}
          y2={stepY(line * 2)}
          className="stroke-current"
          strokeWidth={1}
          opacity={0.6}
        />
      ))}
      <text
        x={4}
        y={stepY(2) + 10}
        fontSize={46}
        className="fill-current"
        style={{
          fontFamily:
            "'Noto Music', 'Apple Symbols', 'Segoe UI Symbol', 'Bravura', serif",
        }}
      >
        𝄞
      </text>
      {steps.map((step, i) => (
        <text
          key={i}
          x={44 + i * 11}
          y={stepY(step)}
          dominantBaseline="central"
          fontSize={sig > 0 ? 17 : 19}
          className="fill-current"
        >
          {sig > 0 ? "♯" : "♭"}
        </text>
      ))}
    </svg>
  );
}

function code({
  tonic,
  mode,
  minorScale,
  sig,
  selected,
  roles,
}: {
  tonic: string;
  mode: KeyMode;
  minorScale: MinorScale;
  sig: number;
  selected: string | null;
  roles: Map<string, string[]>;
}) {
  const quoted = JSON.stringify(tonic);
  const lines = ['import { Key, Progression } from "tonal";', ""];
  if (mode === "major") {
    const key = Key.majorKey(tonic);
    lines.push(
      `Key.majorTonicFromKeySignature(${sig}); // => ${show(Key.majorTonicFromKeySignature(sig))}`,
      "",
      `const key = Key.majorKey(${quoted});`,
      `key.keySignature; // => ${show(key.keySignature)}`,
      `key.minorRelative; // => ${show(key.minorRelative)}`,
    );
  } else {
    const key = Key.minorKey(tonic);
    lines.push(
      `const key = Key.minorKey(${quoted});`,
      `key.keySignature; // => ${show(key.keySignature)}`,
      `key.relativeMajor; // => ${show(key.relativeMajor)}`,
      "",
      `// the scale, chords and dominants of the ${minorScale} minor scale`,
      `const scale = key.${minorScale};`,
    );
  }
  const s = mode === "major" ? "key" : "scale";
  const data =
    mode === "major" ? Key.majorKey(tonic) : Key.minorKey(tonic)[minorScale];
  lines.push(
    `${s}.scale; // => ${show(data.scale)}`,
    `${s}.chords; // => ${show(data.chords)}`,
    `${s}.chordsHarmonicFunction; // => ${show(data.chordsHarmonicFunction)}`,
    `${s}.secondaryDominants; // => ${show(data.secondaryDominants)}`,
    `${s}.substituteDominants; // => ${show(data.substituteDominants)}`,
    "",
    `Progression.toRomanNumerals(${quoted}, ${s}.chords);`,
    `// => ${show(Progression.toRomanNumerals(tonic, [...data.chords]))}`,
  );
  if (selected) {
    const fn = mode === "major" ? "majorKeyChords" : "minorKeyChords";
    lines.push(
      "",
      `// the roles of ${selected} in the key`,
      `Key.${fn}(${quoted}).find((c) => c.name === ${JSON.stringify(selected)});`,
      `// => ${show({ name: selected, roles: roles.get(selected) ?? [] })}`,
    );
  }
  return lines.join("\n");
}
