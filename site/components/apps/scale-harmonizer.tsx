"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { useEffect, useMemo, useState } from "react";
import { Interval, Note, Scale, ScaleType } from "tonal";
import { Chip, NoteSelect, PianoMessage, show, TONICS } from "./controls";
import { keyboardRange, PianoKeyboard } from "./piano-keyboard";
import { usePiano } from "./use-piano";

// a voice is the melody moved by a number of scale steps
const VOICES: [number, string][] = [
  [5, "6th above"],
  [4, "5th above"],
  [3, "4th above"],
  [2, "3rd above"],
  [-2, "3rd below"],
  [-3, "4th below"],
  [-5, "6th below"],
  [-9, "10th below"],
];

const MELODIES: { title: string; notes: string }[] = [
  { title: "Scale", notes: "C4 D4 E4 F4 G4 A4 B4 C5" },
  {
    title: "Ode to Joy",
    notes: "E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4 D4 D4",
  },
  { title: "Arpeggio", notes: "C4 E4 G4 B4 D5 B4 G4 E4 C4" },
  { title: "Chromatic", notes: "C4 C#4 D4 Eb4 E4 F4 F#4 G4" },
];

// one note of the melody lasts this many seconds when it's played
const STEP = 0.45;

const CONSONANCE_STYLE: Record<string, string> = {
  perfect: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  imperfect: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  dissonant: "bg-red-500/15 text-red-700 dark:text-red-300",
};

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

/** Notes with octave; a note without one is in octave 4 */
function parseMelody(text: string): string[] {
  return text
    .split(/[\s,]+/)
    .map((word) => Note.get(word))
    .filter((note) => !note.empty)
    .map((note) => (note.oct === undefined ? `${note.pc}4` : note.name));
}

type Step = {
  /** As written */
  note: string;
  /** The scale note used to build the voices: the same, or the nearest */
  inScale: string;
  voices: {
    steps: number;
    note: string;
    interval: string;
    consonance: string;
  }[];
};

function harmonize(
  scale: string,
  melody: string[],
  voices: number[],
  consonantFourth: boolean,
): Step[] {
  return melody.map((note) => {
    const inScale = Scale.nearest(scale, note);
    return {
      note,
      inScale,
      voices: voices.map((steps) => {
        const voiced = Scale.transposeBySteps(scale, inScale, steps);
        const interval = Interval.distance(note, voiced);
        return {
          steps,
          note: voiced,
          interval,
          consonance: Interval.consonance(interval, { consonantFourth }),
        };
      }),
    };
  });
}

export function ScaleHarmonizer() {
  const [tonic, setTonic] = useState("C");
  const [type, setType] = useState("major");
  const [text, setText] = useState(MELODIES[0].notes);
  const [voices, setVoices] = useState<number[]>([4, 2]);
  const [consonantFourth, setConsonantFourth] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [linkRead, setLinkRead] = useState(false);
  const { status, play, playSteps } = usePiano();

  // read the melody of a shared link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const linkTonic = params.get("tonic") ?? "";
    const linkType = params.get("type") ?? "";
    if (!Note.get(linkTonic).empty && !ScaleType.get(linkType).empty) {
      setTonic(Note.get(linkTonic).pc);
      setType(ScaleType.get(linkType).name);
    }
    const melody = params.get("melody");
    if (melody) setText(melody.split(",").join(" "));
    const linkVoices = (params.get("voices") ?? "")
      .split(",")
      .map(Number)
      .filter((n) => VOICES.some(([steps]) => steps === n));
    if (linkVoices.length) setVoices(linkVoices);
    if (params.get("fourth") === "consonant") setConsonantFourth(true);
    setLinkRead(true);
  }, []);

  const melody = useMemo(() => parseMelody(text), [text]);
  const scale = `${tonic} ${type}`;
  // voices above the melody first, as in a score
  const sortedVoices = useMemo(
    () => [...voices].sort((a, b) => b - a),
    [voices],
  );
  const steps = useMemo(
    () => harmonize(scale, melody, sortedVoices, consonantFourth),
    [scale, melody, sortedVoices, consonantFourth],
  );

  // keep the link up to date, to share it
  useEffect(() => {
    if (!linkRead) return;
    const params = new URLSearchParams({
      tonic,
      type,
      melody: melody.join(","),
      voices: voices.join(","),
    });
    if (consonantFourth) params.set("fourth", "consonant");
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString().replaceAll("+", "%20")}`,
    );
  }, [linkRead, tonic, type, melody, voices, consonantFourth]);

  const counts = { perfect: 0, imperfect: 0, dissonant: 0 } as Record<
    string,
    number
  >;
  for (const step of steps) {
    for (const v of step.voices)
      counts[v.consonance] = (counts[v.consonance] ?? 0) + 1;
  }
  const snapped = steps.filter((s) => s.inScale && s.inScale !== s.note);
  const step = selected !== null ? steps[selected] : undefined;

  // the scale across the range of the melody and its voices
  const heights = steps.flatMap((s) => [
    Note.get(s.note).height,
    ...s.voices.map((v) => Note.get(v.note).height),
  ]);
  const [from, to] = keyboardRange(heights.filter(Number.isFinite));
  const chroma = Scale.get(scale).chroma;
  const shaded = new Map<number, string>();
  for (let midi = from; midi <= to; midi++) {
    if (chroma[midi % 12] === "1") shaded.set(midi, "");
  }
  const active = new Map(
    step
      ? [
          [Note.get(step.note).height, Note.get(step.note).pc],
          ...step.voices.map(
            (v) => [Note.get(v.note).height, Note.get(v.note).pc] as const,
          ),
        ]
      : [],
  );

  const notesOf = (s: Step) => [s.note, ...s.voices.map((v) => v.note)];

  function choose(index: number) {
    setSelected(index);
    play(notesOf(steps[index]));
  }

  function toggleVoice(steps: number) {
    setVoices((current) =>
      current.includes(steps)
        ? current.filter((s) => s !== steps)
        : [...current, steps],
    );
  }

  function addNote(midi: number) {
    const name = Note.fromMidi(midi);
    // spelled as in the scale when it's a scale note
    const nearest = Scale.nearest(scale, name);
    const note = Note.get(nearest).height === midi ? nearest : name;
    setText((current) => `${current.trim()} ${note}`.trim());
    play([midi]);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-4 text-sm">
        <NoteSelect
          label="Tonic"
          value={tonic}
          options={TONICS}
          onChange={setTonic}
        />
        <label className="flex min-w-0 flex-col gap-1">
          <span className="font-medium">Scale</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
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
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="harmonizer-melody" className="text-sm font-medium">
          Melody (or click the keys to add notes)
        </label>
        <input
          id="harmonizer-melody"
          value={text}
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
          {MELODIES.map((m) => (
            <Chip
              key={m.title}
              onClick={() => {
                setText(m.notes);
                setSelected(null);
              }}
            >
              {m.title}
            </Chip>
          ))}
          <button
            type="button"
            className="ms-auto text-fd-muted-foreground underline hover:text-fd-foreground"
            onClick={() => setText("")}
          >
            Clear
          </button>
        </div>
      </div>

      <div
        className="flex flex-wrap items-center gap-2 text-sm"
        role="group"
        aria-label="Voices"
      >
        <span className="text-fd-muted-foreground">Voices:</span>
        {VOICES.map(([n, label]) => (
          <Chip
            key={n}
            pressed={voices.includes(n)}
            title={`${n > 0 ? "+" : ""}${n} scale steps`}
            onClick={() => toggleVoice(n)}
          >
            {label}
          </Chip>
        ))}
        <label className="ms-2 flex items-center gap-2">
          <input
            type="checkbox"
            checked={consonantFourth}
            onChange={(e) => setConsonantFourth(e.target.checked)}
          />
          The fourth is consonant
        </label>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <PianoKeyboard
            from={from}
            to={to}
            active={active}
            shaded={shaded}
            marked={step ? Note.get(step.note).height : undefined}
            keyName={(midi) => Note.fromMidi(midi)}
            onKey={addNote}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex flex-1 flex-wrap gap-2 text-xs">
          {Object.entries(counts).map(([consonance, count]) => (
            <span
              key={consonance}
              className={`rounded-md px-2 py-0.5 ${CONSONANCE_STYLE[consonance]}`}
            >
              {count} {consonance}
            </span>
          ))}
        </div>
        <button
          type="button"
          className="rounded-lg bg-fd-primary px-3 py-1.5 font-medium text-fd-primary-foreground hover:opacity-90"
          disabled={!steps.length}
          onClick={() =>
            playSteps(steps.map((s) => ({ notes: notesOf(s), duration: STEP })))
          }
        >
          Play
        </button>
      </div>
      <PianoMessage status={status} />

      {steps.length ? (
        <div className="overflow-x-auto rounded-xl border border-fd-border">
          <table className="text-sm">
            <tbody>
              {sortedVoices
                .filter((n) => n > 0)
                .map((n) => (
                  <VoiceRow
                    key={n}
                    label={VOICES.find(([s]) => s === n)![1]}
                    steps={steps}
                    row={sortedVoices.indexOf(n)}
                    selected={selected}
                    onChoose={choose}
                  />
                ))}
              <tr className="border-y border-fd-border bg-fd-secondary">
                <th className="px-3 py-2 text-start font-medium whitespace-nowrap">
                  Melody
                </th>
                {steps.map((s, i) => (
                  <td key={i} className={i === selected ? "bg-sky-500/15" : ""}>
                    <button
                      type="button"
                      aria-pressed={i === selected}
                      onClick={() => choose(i)}
                      className="w-full px-2 py-2 text-center font-mono font-bold"
                      title={
                        s.inScale !== s.note
                          ? `not in the scale: the voices start from ${s.inScale}`
                          : undefined
                      }
                    >
                      {s.note}
                      {s.inScale && s.inScale !== s.note ? "*" : null}
                    </button>
                  </td>
                ))}
              </tr>
              {sortedVoices
                .filter((n) => n < 0)
                .map((n) => (
                  <VoiceRow
                    key={n}
                    label={VOICES.find(([s]) => s === n)![1]}
                    steps={steps}
                    row={sortedVoices.indexOf(n)}
                    selected={selected}
                    onChoose={choose}
                  />
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-fd-muted-foreground">
          Write a melody with octaves, like “E4 F4 G4”.
        </p>
      )}

      {snapped.length ? (
        <p className="text-sm text-fd-muted-foreground">
          * Not in {scale}:{" "}
          <span className="font-mono">
            {snapped.map((s) => `${s.note} → ${s.inScale}`).join(", ")}
          </span>
          . The voices start from the nearest scale note (`Scale.nearest`).
        </p>
      ) : null}

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">The code</h2>
        <DynamicCodeBlock
          lang="js"
          code={code(scale, melody, sortedVoices, consonantFourth, snapped[0])}
        />
      </section>
    </div>
  );
}

function VoiceRow({
  label,
  steps,
  row,
  selected,
  onChoose,
}: {
  label: string;
  steps: Step[];
  /** The index of the voice in each step */
  row: number;
  selected: number | null;
  onChoose: (index: number) => void;
}) {
  return (
    <tr>
      <th className="px-3 py-1.5 text-start font-normal whitespace-nowrap text-fd-muted-foreground">
        {label}
      </th>
      {steps.map((s, i) => {
        const v = s.voices[row];
        return (
          <td key={i} className={i === selected ? "bg-sky-500/15" : ""}>
            <button
              type="button"
              onClick={() => onChoose(i)}
              className="flex w-full flex-col items-center gap-0.5 px-2 py-1.5"
            >
              <span className="font-mono">{v?.note || "—"}</span>
              {v?.interval ? (
                <span
                  className={`rounded px-1 font-mono text-xs ${CONSONANCE_STYLE[v.consonance] ?? ""}`}
                >
                  {v.interval}
                </span>
              ) : null}
            </button>
          </td>
        );
      })}
    </tr>
  );
}

// The tonal calls behind what the page shows
function code(
  scale: string,
  melody: string[],
  voices: number[],
  consonantFourth: boolean,
  snapped: Step | undefined,
) {
  const notes = melody.slice(0, 8);
  const more = melody.length > 8 ? " // the first 8 notes" : "";
  const options = consonantFourth ? ", { consonantFourth: true }" : "";
  const lines = [
    'import { Interval, Scale } from "tonal";',
    "",
    `const melody = ${show(notes)};${more}`,
  ];
  const inScale = notes.map((n) => Scale.nearest(scale, n));
  // the voices start from the melody, or from the nearest scale notes
  let from = "melody";
  if (snapped) {
    from = "inScale";
    lines.push(
      "",
      "// notes outside the scale move to the nearest scale note",
      `Scale.nearest(${show(scale)}, ${show(snapped.note)}); // => ${show(snapped.inScale)}`,
      `const inScale = melody.map((n) => Scale.nearest(${show(scale)}, n));`,
    );
  }
  for (const steps of voices) {
    const voice = inScale.map((n) => Scale.transposeBySteps(scale, n, steps));
    const intervals = notes.map((n, i) => Interval.distance(n, voice[i]));
    lines.push(
      "",
      `const voice = ${from}.map((n) => Scale.transposeBySteps(${show(scale)}, n, ${steps}));`,
      `// => ${show(voice)}`,
      "const intervals = melody.map((n, i) => Interval.distance(n, voice[i]));",
      `// => ${show(intervals)}`,
      `intervals.map((i) => Interval.consonance(i${options}));`,
      `// => ${show(intervals.map((i) => Interval.consonance(i, { consonantFourth })))}`,
    );
  }
  return lines.join("\n");
}
