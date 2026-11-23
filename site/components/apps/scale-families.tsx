"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Chord, Interval, Note, Scale, ScaleType } from "tonal";
import {
  Chip,
  NoteSelect,
  PianoMessage,
  show,
  TONICS,
  Toggle,
} from "./controls";
import { keyboardRange, PianoKeyboard } from "./piano-keyboard";
import { usePiano } from "./use-piano";

// every family of the dictionary, in the order of its first scale type
const FAMILIES = [
  ...new Set(
    ScaleType.all()
      .map((type) => type.family)
      .filter(Boolean),
  ),
];
// the usual ones first
const ORDER = ["major", "melodic minor", "harmonic minor", "harmonic major"];
FAMILIES.sort(
  (a, b) =>
    (ORDER.indexOf(a) + 1 || 99) - (ORDER.indexOf(b) + 1 || 99) ||
    a.localeCompare(b),
);

const CHORD_EXAMPLES = ["C7b9", "Cm(maj7)", "C7#11", "Co7", "Cmaj7#5", "Cm7b5"];

type View = "tonic" | "notes";

// the scales start at octave 3, so that they fit on the keyboard
const OCTAVE = 3;

/** The modes of a family, by degree */
const modesOf = (family: string) =>
  ScaleType.all()
    .filter((type) => type.family === family)
    .sort((a, b) => a.degree - b.degree);

/** "3m" is "b3", "4A" is "#4": the degree name from the major scale */
function degreeName(interval: string) {
  const { num, alt } = Interval.get(interval);
  return (alt < 0 ? "b".repeat(-alt) : "#".repeat(alt)) + num;
}

type Row = {
  degree: number;
  type: ReturnType<typeof ScaleType.get>;
  tonic: string;
  /** The tonic of the family scale this mode comes from */
  parent: string;
  scale: ReturnType<typeof Scale.get>;
  chord: string;
};

function rowsOf(family: string, tonic: string, view: View): Row[] {
  const familyNotes = Scale.get(`${tonic} ${family}`).notes;
  const familyIntervals = ScaleType.get(family).intervals;
  return modesOf(family).map((type) => {
    const i = type.degree - 1;
    // same tonic: every mode on the tonic. Same notes: the mode on each
    // degree of the family scale
    const modeTonic = view === "tonic" ? tonic : familyNotes[i];
    const parent =
      view === "tonic"
        ? Note.transpose(tonic, Interval.negate(familyIntervals[i]))
        : tonic;
    const name = `${modeTonic} ${type.name}`;
    const [chord] = Scale.chords(`${modeTonic}${OCTAVE} ${type.name}`, {
      size: 4,
    });
    return {
      degree: type.degree,
      type,
      tonic: modeTonic,
      parent,
      scale: Scale.get(name),
      chord: chord?.symbol ?? "",
    };
  });
}

export function ScaleFamilies() {
  const [family, setFamily] = useState("harmonic minor");
  const [tonic, setTonic] = useState("C");
  const [view, setView] = useState<View>("tonic");
  const [chordText, setChordText] = useState("");
  const [selected, setSelected] = useState(0);
  const [linkRead, setLinkRead] = useState(false);
  const { status, play } = usePiano();

  // read the family of a shared link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const linkFamily = params.get("family") ?? "";
    if (FAMILIES.includes(linkFamily)) setFamily(linkFamily);
    const linkTonic = params.get("tonic") ?? "";
    if (!Note.get(linkTonic).empty) setTonic(Note.get(linkTonic).pc);
    if (params.get("view") === "notes") setView("notes");
    setChordText(params.get("chord") ?? "");
    setLinkRead(true);
  }, []);

  // keep the link up to date, to share it
  useEffect(() => {
    if (!linkRead) return;
    const params = new URLSearchParams({ family, tonic, view });
    if (chordText.trim()) params.set("chord", chordText.trim());
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString().replaceAll("+", "%20")}`,
    );
  }, [linkRead, family, tonic, view, chordText]);

  const rows = useMemo(
    () => rowsOf(family, tonic, view),
    [family, tonic, view],
  );
  const chord = chordText.trim() ? Chord.get(chordText.trim()) : null;
  const fits = chord && !chord.empty && chord.tonic ? chord : null;
  const row = rows[selected] ?? rows[0];

  // the selected mode from its tonic to the tonic an octave higher
  const scaleNotes = row
    ? [
        ...Scale.get(`${row.tonic}${OCTAVE} ${row.type.name}`).notes,
        `${row.tonic}${OCTAVE + 1}`,
      ]
    : [];
  const shaded = new Map(
    scaleNotes.map((n, i) => [
      Note.get(n).height,
      row
        ? degreeName(row.scale.intervals[i % row.scale.intervals.length])
        : "",
    ]),
  );
  // the chord, voiced from the octave of the scale
  const chordNotes = fits
    ? fits.intervals.map((ivl) => Note.transpose(`${fits.tonic}${OCTAVE}`, ivl))
    : [];
  const outsideOfRow =
    fits && row ? Scale.outside(row.scale.name, fits.symbol) : [];
  const active = new Map(
    chordNotes.map((n) => [
      Note.get(n).height,
      outsideOfRow.some((o) => Note.get(o).chroma === Note.get(n).chroma)
        ? "✕"
        : Note.get(n).pc,
    ]),
  );
  const [from, to] = keyboardRange([...shaded.keys(), ...active.keys()]);

  function choose(index: number) {
    setSelected(index);
    const r = rows[index];
    play(
      [
        ...Scale.get(`${r.tonic}${OCTAVE} ${r.type.name}`).notes,
        `${r.tonic}${OCTAVE + 1}`,
      ],
      { arpeggio: true },
    );
  }

  function changeFamily(value: string) {
    setFamily(value);
    setSelected(0);
  }

  function typeChord(value: string) {
    setChordText(value);
    const typed = Chord.get(value.trim());
    // the chord's root is the tonic of the modes it's compared with
    if (!typed.empty && typed.tonic && view === "tonic") setTonic(typed.tonic);
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        className="flex flex-wrap gap-2 text-sm"
        role="group"
        aria-label="Family"
      >
        {FAMILIES.map((f) => (
          <Chip key={f} pressed={f === family} onClick={() => changeFamily(f)}>
            {f}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-4 text-sm">
        <NoteSelect
          label="Tonic"
          value={tonic}
          options={TONICS}
          onChange={setTonic}
        />
        <Toggle
          stacked
          label="Modes"
          value={view}
          options={[
            ["tonic", "On the same tonic"],
            ["notes", "With the same notes"],
          ]}
          onChange={setView}
        />
        <label className="flex min-w-48 flex-1 flex-col gap-1">
          <span className="font-medium">Does a chord fit? (optional)</span>
          <input
            value={chordText}
            onChange={(e) => typeChord(e.target.value)}
            placeholder="C7b9"
            spellCheck={false}
            autoComplete="off"
            className="rounded-lg border border-fd-border bg-fd-background px-2 py-1.5 font-mono outline-none focus:ring-2 focus:ring-fd-ring"
          />
        </label>
      </div>
      <div className="-mt-4 flex flex-wrap gap-2 text-sm">
        <span className="text-fd-muted-foreground">Try:</span>
        {CHORD_EXAMPLES.map((example) => (
          <Chip key={example} onClick={() => typeChord(example)}>
            {example}
          </Chip>
        ))}
      </div>
      {chord && !fits ? (
        <p className="-mt-4 text-sm text-fd-muted-foreground">
          That's not a chord symbol with a root.
        </p>
      ) : null}

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <PianoKeyboard
            from={from}
            to={to}
            active={active}
            shaded={shaded}
            marked={
              chordNotes.length ? Note.get(chordNotes[0]).height : undefined
            }
            keyName={(midi) => Note.fromMidi(midi)}
            onKey={(midi) => play([midi])}
          />
        </div>
      </div>
      <PianoMessage status={status} />

      <div className="overflow-x-auto rounded-xl border border-fd-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-fd-secondary text-start text-fd-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-start font-medium">Degree</th>
              <th className="px-3 py-2 text-start font-medium">Mode</th>
              <th className="px-3 py-2 text-start font-medium">Formula</th>
              <th className="px-3 py-2 text-start font-medium">Seventh</th>
              {fits ? (
                <th className="px-3 py-2 text-start font-medium">
                  {fits.symbol}
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const outside = fits
                ? Scale.outside(r.scale.name, fits.symbol)
                : [];
              return (
                <tr
                  key={r.type.name}
                  onClick={() => choose(i)}
                  className={`cursor-pointer border-t border-fd-border ${
                    i === selected ? "bg-sky-500/10" : "hover:bg-fd-accent"
                  }`}
                >
                  <td className="px-3 py-2 font-mono">{r.degree}</td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      aria-pressed={i === selected}
                      className="text-start font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        choose(i);
                      }}
                    >
                      {r.tonic} {r.type.name}
                    </button>
                    <div className="text-xs text-fd-muted-foreground">
                      {view === "tonic" && r.degree > 1
                        ? `${Note.simplify(r.parent)} ${family}, from degree ${r.degree}`
                        : r.type.aliases.slice(0, 2).join(", ")}
                    </div>
                  </td>
                  <td className="px-3 py-2 font-mono">
                    {r.scale.intervals.map((ivl) => {
                      const name = degreeName(ivl);
                      return (
                        <span
                          key={ivl}
                          className={`me-1.5 ${/[b#]/.test(name) ? "font-bold text-amber-600 dark:text-amber-400" : ""}`}
                        >
                          {name}
                        </span>
                      );
                    })}
                  </td>
                  <td className="px-3 py-2 font-mono">{r.chord || "—"}</td>
                  {fits ? (
                    <td className="px-3 py-2 font-mono">
                      {outside.length ? (
                        <span className="text-red-600 dark:text-red-400">
                          ✕ {outside.join(" ")}
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          ✓ fits
                        </span>
                      )}
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {row ? (
        <p className="text-sm">
          {row.scale.name}: {row.scale.notes.join(" ")}.{" "}
          <Link
            href={`/apps/scale-chords/?tonic=${encodeURIComponent(row.tonic)}&type=${encodeURIComponent(row.type.name)}`}
            className="underline"
          >
            Its chords on each degree
          </Link>
        </p>
      ) : null}

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">The code</h2>
        <DynamicCodeBlock
          lang="js"
          code={code(family, tonic, view, row, fits?.symbol ?? null)}
        />
      </section>
    </div>
  );
}

// The tonal calls behind what the page shows
function code(
  family: string,
  tonic: string,
  view: View,
  row: Row | undefined,
  chord: string | null,
) {
  const modes = modesOf(family).map((t) => [t.degree, t.name]);
  const lines = [
    'import { Scale, ScaleType } from "tonal";',
    "",
    "// the modes of a family, by degree",
    `ScaleType.all()`,
    `  .filter((t) => t.family === ${show(family)})`,
    "  .map((t) => [t.degree, t.name]);",
    `// => ${show(modes)}`,
  ];
  if (row) {
    const { family: f, degree } = ScaleType.get(row.type.name);
    lines.push(
      "",
      `ScaleType.get(${show(row.type.name)}); // => { family: ${show(f)}, degree: ${degree}, ... }`,
      `Scale.get(${show(row.scale.name)}).notes;`,
      `// => ${show(row.scale.notes)}`,
    );
  }
  if (view === "notes") {
    lines.push(
      "",
      `Scale.modeNames(${show(`${tonic} ${family}`)});`,
      `// => ${show(Scale.modeNames(`${tonic} ${family}`))}`,
    );
  }
  if (chord && row) {
    lines.push(
      "",
      "// the chord notes that aren't in the scale",
      `Scale.outside(${show(row.scale.name)}, ${show(chord)});`,
      `// => ${show(Scale.outside(row.scale.name, chord))}`,
    );
  }
  return lines.join("\n");
}
