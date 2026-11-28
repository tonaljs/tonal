"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { useEffect, useMemo, useState } from "react";
import { Chart, Chord, Key, Note, Scale, Voicing } from "tonal";
import type { TimedNotes } from "@/lib/piano";
import { audioTime } from "@/lib/piano";
import { voice } from "@/lib/voice";
import { Chip, PianoMessage, show, TONICS } from "./controls";
import { usePiano } from "./use-piano";

type Reading = ReturnType<typeof Key.analyzeChord>[number];
type Kind = ReturnType<typeof Key.substitutes>[number]["kind"];
type Option = { chords: string[]; kind: Kind | "original" };

const EXAMPLES: { title: string; chart: string }[] = [
  { title: "ii–V–I", chart: "| Dm7 | G7 | Cmaj7 | Cmaj7 |" },
  {
    title: "Turnaround",
    chart: "| Cmaj7 | Am7 | Dm7 | G7 |\n| Cmaj7 | Am7 | Dm7 G7 | Cmaj7 |",
  },
  {
    title: "Minor ii–V–i",
    chart: "| Bm7b5 | E7 | Am7 | Am7 |\n| Dm7 | G7 | Cmaj7 | E7 |",
  },
  {
    title: "Rhythm changes",
    chart:
      "| Bbmaj7 G7 | Cm7 F7 | Dm7 G7 | Cm7 F7 |\n| Fm7 Bb7 | Ebmaj7 Ab7 | Dm7 G7 | Cm7 F7 |",
  },
  { title: "Pop", chart: "| C | G | Am | F |\n| C | G | F | C |" },
  {
    title: "Ballad",
    chart: "| Fmaj7 | Dm7 | Gm7 | C7 |\n| Fmaj7 | Bbmaj7 | Gm7 C7 | Fmaj7 |",
  },
];

// One click fills the dropdowns of every chord that is still the original
const STRATEGIES: { id: string; title: string; kind: Kind; help: string }[] = [
  {
    id: "tritone",
    title: "Tritone subs",
    kind: "tritone substitute",
    help: "every dominant by the dominant a tritone away",
  },
  {
    id: "two",
    title: "ii–V",
    kind: "related ii",
    help: "the related ii before every dominant",
  },
  {
    id: "secondary",
    title: "Secondary dominants",
    kind: "secondary dominant",
    help: "a V7 of the next chord in the second half of the chord",
  },
  {
    id: "passing",
    title: "Passing diminished",
    kind: "passing diminished",
    help: "a dim7 between roots a whole step apart",
  },
];

// The kinds in the dropdown, in this order
const KINDS: Kind[] = [
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

type Slot = { bar: number; index: number; chord: string; flat: number };
// a chord of a version, with its place and its share of the bar
type Played = { slot: number; chord: string; start: number; duration: number };

// The chords of a chart, bar by bar (repeats and jumps are read, not played)
function readBars(text: string): string[][] {
  return Chart.parse(text).bars.map((bar) => bar.chords.map((c) => c.value));
}

// Each slot's chords, in time: a slot shares its bar with the others, and a
// substitute of two chords shares the slot's time
function timeline(slots: Slot[], bars: string[][], chosen: string[][]) {
  const list: Played[] = [];
  slots.forEach((s, i) => {
    const slotTime = BAR / bars[s.bar].length;
    const start = s.bar * BAR + s.index * slotTime;
    const chords = chosen[i];
    chords.forEach((chord, j) => {
      list.push({
        slot: i,
        chord,
        start: start + (j * slotTime) / chords.length,
        duration: slotTime / chords.length,
      });
    });
  });
  return list;
}

// Voice a list of chords so they move little, or each on its own
function voiceAll(chords: string[]): string[][] {
  try {
    const list = Voicing.sequence(chords);
    return chords.map((c, i) =>
      list[i]?.length ? list[i] : voice(Chord.get(c).notes),
    );
  } catch {
    return chords.map((c) => voice(Chord.get(c).notes));
  }
}

export function Reharmonizer() {
  const [text, setText] = useState(EXAMPLES[1].chart);
  const [keyChoice, setKeyChoice] = useState("auto");
  // the option chosen in each slot's dropdown (0 is the original)
  const [choices, setChoices] = useState<Record<number, number>>({});
  const [inspect, setInspect] = useState<number | null>(null);
  const [melody, setMelody] = useState(false);
  const [motifText, setMotifText] = useState("C4 E4 G4 A4 Bb4 A4 G4 E4");
  const [motifChord, setMotifChord] = useState("C7");
  const [linkRead, setLinkRead] = useState(false);
  const { status, play, playSteps, stop, playing } = usePiano();
  const [what, setWhat] = useState<"original" | "new" | "ab">("ab");
  const [now, setNow] = useState<{ version: 0 | 1; slot: number } | null>(null);

  // read a shared link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chart = params.get("chart");
    if (chart) setText(chart);
    const key = params.get("key");
    if (key && KEYS.includes(key)) setKeyChoice(key);
    const picks = params.get("picks");
    if (picks) {
      const read: Record<number, number> = {};
      for (const pair of picks.split(",")) {
        const [slot, option] = pair.split(":").map(Number);
        if (slot >= 0 && option > 0) read[slot] = option;
      }
      setChoices(read);
    }
    if (params.get("melody") === "true") setMelody(true);
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
    const picks = Object.entries(choices)
      .filter(([, o]) => o > 0)
      .map(([s, o]) => `${s}:${o}`)
      .join(",");
    if (picks) params.set("picks", picks);
    if (melody) {
      params.set("melody", "true");
      params.set("motif", motifText);
      params.set("over", motifChord);
    }
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString().replaceAll("+", "%20")}`,
    );
  }, [linkRead, text, keyChoice, choices, melody, motifText, motifChord]);

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
      symbols.map((c, i) =>
        Key.analyzeChord(key, c, {
          previous: symbols[i - 1],
          next: symbols[i + 1],
        }),
      ),
    [symbols, key],
  );

  // the dropdown of each slot: the original, then its substitutes in the key
  const options = useMemo(
    () =>
      symbols.map((c, i): Option[] => {
        const subs = Key.substitutes(key, c, { next: symbols[i + 1] });
        const sorted = KINDS.flatMap((k) => subs.filter((s) => s.kind === k));
        return [{ chords: [c], kind: "original" }, ...sorted];
      }),
    [symbols, key],
  );
  const chosen = useMemo(
    () =>
      options.map((list, i) => list[choices[i] ?? 0]?.chords ?? list[0].chords),
    [options, choices],
  );
  const changed = (i: number) =>
    (choices[i] ?? 0) > 0 && !!options[i]?.[choices[i]];

  const original = useMemo(
    () =>
      timeline(
        slots,
        bars,
        symbols.map((c) => [c]),
      ),
    [slots, bars, symbols],
  );
  const reharmonized = useMemo(
    () => timeline(slots, bars, chosen),
    [slots, bars, chosen],
  );
  // the numeral of each new chord in the new progression
  const newReadings = useMemo(() => {
    const list = reharmonized.map((p) => p.chord);
    return list.map(
      (c, i) =>
        Key.analyzeChord(key, c, {
          previous: list[i - 1],
          next: list[i + 1],
        })[0],
    );
  }, [reharmonized, key]);

  // the motif, written over one chord, fitted to each chord
  const motif = useMemo(
    () =>
      motifText
        .split(/[\s,]+/)
        .filter((n) => !Note.get(n).empty && Note.get(n).oct !== undefined),
    [motifText],
  );
  const motifOk = !Chord.get(motifChord).empty && !!Chord.get(motifChord).tonic;

  const steps = useMemo(() => {
    const build = (version: Played[]): TimedNotes[] => {
      const voiced = voiceAll(version.map((p) => p.chord));
      const list: TimedNotes[] = [];
      let time = 0;
      version.forEach((p, i) => {
        // a rest for the bars without chords
        if (p.start > time)
          list.push({ notes: [], duration: (p.start - time) * QUARTER });
        time = p.start + p.duration;
        const duration = p.duration * QUARTER;
        const chord = voiced[i] ?? [];
        const line = melody && motifOk ? fitMotif(motif, motifChord, p) : [];
        if (!line.length) {
          list.push({ notes: chord, duration });
          return;
        }
        const each = duration / line.length;
        line.forEach((n, j) =>
          list.push({
            notes: n ? [n] : [],
            duration: each,
            held: j === 0 ? { notes: chord, duration } : undefined,
          }),
        );
      });
      const end = bars.length * BAR;
      if (end > time)
        list.push({ notes: [], duration: (end - time) * QUARTER });
      return list;
    };
    return { a: build(original), b: build(reharmonized) };
  }, [original, reharmonized, melody, motif, motifChord, motifOk, bars]);

  function start(which: typeof what) {
    setWhat(which);
    const list =
      which === "original"
        ? steps.a
        : which === "new"
          ? steps.b
          : [...steps.a, ...steps.b];
    playSteps(list, { loop: which === "ab" });
  }

  // follow the playback: the version and the slot that sound now
  useEffect(() => {
    if (!playing) {
      setNow(null);
      return;
    }
    let frame = 0;
    const tick = () => {
      let t = (audioTime() - playing.start) / QUARTER;
      const length = bars.length * BAR;
      let version: 0 | 1 = what === "new" ? 1 : 0;
      if (what === "ab") {
        t = t % (length * 2);
        if (t >= length) {
          version = 1;
          t -= length;
        }
      }
      const list = version ? reharmonized : original;
      let slot = -1;
      for (const p of list) if (p.start <= t) slot = p.slot;
      setNow((before) =>
        before && before.version === version && before.slot === slot
          ? before
          : { version, slot },
      );
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, what, bars, original, reharmonized]);

  function loadChart(newText: string) {
    setText(newText);
    setChoices({});
    setInspect(null);
    setKeyChoice("auto");
  }

  function choose(slot: number, option: number) {
    setChoices((c) => ({ ...c, [slot]: option }));
    const chords = options[slot][option]?.chords ?? [];
    play(voice(Chord.get(chords[0]).notes));
  }

  // a strategy: the first option of its kind, where the chord is the original
  function applyStrategy(kind: Kind) {
    setChoices((c) => {
      const next = { ...c };
      options.forEach((list, i) => {
        if ((next[i] ?? 0) > 0) return;
        const at = list.findIndex((o) => o.kind === kind);
        if (at > 0) next[i] = at;
      });
      return next;
    });
  }

  const inspected = inspect !== null ? slots[inspect] : undefined;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="reharmonizer-input" className="text-sm font-medium">
          Chart: bars between “|”, chords separated by spaces
        </label>
        <textarea
          id="reharmonizer-input"
          value={text}
          rows={2}
          onChange={(e) => {
            setText(e.target.value);
            setChoices({});
            setInspect(null);
          }}
          spellCheck={false}
          autoComplete="off"
          className="rounded-lg border border-fd-border bg-fd-background px-3 py-2 font-mono text-base outline-none focus:ring-2 focus:ring-fd-ring"
        />
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-fd-muted-foreground">Try:</span>
          {EXAMPLES.map((example) => (
            <Chip key={example.title} onClick={() => loadChart(example.chart)}>
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
            onChange={(e) => {
              setKeyChoice(e.target.value);
              setChoices({});
            }}
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
        <div className="flex flex-col gap-1">
          <span className="font-medium">Reharmonize</span>
          <div className="flex flex-wrap gap-2">
            {STRATEGIES.map((s) => (
              <button
                key={s.id}
                type="button"
                title={s.help}
                className="rounded-lg border border-fd-border px-2 py-1 hover:bg-fd-accent"
                onClick={() => applyStrategy(s.kind)}
              >
                {s.title}
              </button>
            ))}
            <button
              type="button"
              className="rounded-lg border border-fd-border px-2 py-1 hover:bg-fd-accent disabled:opacity-50"
              onClick={() => setChoices({})}
              disabled={!Object.values(choices).some((o) => o > 0)}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {slots.length ? (
        <section className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <h2 className="text-lg font-semibold">In {key}</h2>
            <div className="ms-auto flex flex-wrap items-center gap-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={melody}
                  onChange={(e) => setMelody(e.target.checked)}
                />
                With melody
              </label>
              {(
                [
                  ["original", "Original"],
                  ["new", "Reharmonized"],
                  ["ab", "A/B"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={`rounded-lg px-3 py-1.5 font-medium ${
                    playing && what === id
                      ? "bg-fd-primary text-fd-primary-foreground"
                      : "border border-fd-border hover:bg-fd-accent"
                  }`}
                  onClick={() => (playing && what === id ? stop() : start(id))}
                >
                  {playing && what === id ? "Stop" : `▶ ${label}`}
                </button>
              ))}
            </div>
          </div>
          <PianoMessage status={status} />
          <p className="text-sm text-fd-muted-foreground">
            The original on top, with what each chord does in the key (
            <span className="font-mono">Key.analyzeChord</span>; click one for
            every reading). Below, a dropdown on each chord with its substitutes
            (<span className="font-mono">Key.substitutes</span>); “A/B” plays
            one then the other, in a loop.
          </p>
          <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {bars.map((bar, b) => (
              <li
                key={b}
                className="flex flex-col gap-1 rounded-xl border border-fd-border bg-fd-card p-1.5"
              >
                <div className="flex gap-1">
                  {bar.map((chord, i) => {
                    const slot = slots.find(
                      (s) => s.bar === b && s.index === i,
                    )!;
                    const reading = readings[slot.flat][0];
                    const sounding =
                      now?.version === 0 && now.slot === slot.flat;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setInspect(slot.flat);
                          play(voice(Chord.get(chord).notes));
                        }}
                        className={`flex min-w-0 flex-1 flex-col items-start rounded-md border-l-4 px-2 py-1 text-left ${
                          FUNCTION_COLORS[reading?.function ?? ""]
                        } ${
                          sounding
                            ? "bg-amber-500/20"
                            : inspect === slot.flat
                              ? "bg-fd-primary/15"
                              : "hover:bg-fd-accent"
                        }`}
                      >
                        <span className="font-mono font-semibold">{chord}</span>
                        <span className="font-mono text-xs text-fd-muted-foreground">
                          {reading?.numeral ?? "?"}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-1">
                  {bar.map((_, i) => {
                    const slot = slots.find(
                      (s) => s.bar === b && s.index === i,
                    )!;
                    const n = slot.flat;
                    const sounding = now?.version === 1 && now.slot === n;
                    const parts = reharmonized.filter((p) => p.slot === n);
                    const first = reharmonized.indexOf(parts[0]);
                    return (
                      <div
                        key={i}
                        className={`flex min-w-0 flex-1 flex-col gap-0.5 rounded-md px-1 py-1 ${
                          sounding
                            ? "bg-amber-500/20"
                            : changed(n)
                              ? "bg-emerald-500/10 ring-1 ring-emerald-500/50"
                              : ""
                        }`}
                      >
                        <select
                          aria-label={`Substitute for ${slot.chord}`}
                          value={choices[n] ?? 0}
                          onChange={(e) => choose(n, Number(e.target.value))}
                          className="w-full min-w-0 rounded border border-fd-border bg-fd-background px-1 py-0.5 font-mono text-sm"
                        >
                          {groups(options[n]).map(([kind, list]) =>
                            kind === "original" ? (
                              list.map(({ option, at }) => (
                                <option key={at} value={at}>
                                  {option.chords.join(" ")}
                                </option>
                              ))
                            ) : (
                              <optgroup key={kind} label={kind}>
                                {list.map(({ option, at }) => (
                                  <option key={at} value={at}>
                                    {option.chords.join(" ")}
                                  </option>
                                ))}
                              </optgroup>
                            ),
                          )}
                        </select>
                        <span className="flex gap-1 font-mono text-xs text-fd-muted-foreground">
                          {parts.map((p, j) => (
                            <span key={j} className="flex-1 truncate">
                              {newReadings[first + j]?.numeral ?? "?"}
                            </span>
                          ))}
                          {changed(n) ? (
                            <button
                              type="button"
                              title="Back to the original"
                              className="text-fd-muted-foreground hover:text-fd-foreground"
                              onClick={() => choose(n, 0)}
                            >
                              ×
                            </button>
                          ) : null}
                        </span>
                      </div>
                    );
                  })}
                </div>
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
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-sm bg-emerald-500/30" />
              changed
            </span>
          </p>
        </section>
      ) : (
        <p className="text-fd-muted-foreground">
          Write some bars, like “| Dm7 | G7 | Cmaj7 |”.
        </p>
      )}

      {melody ? (
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">The melody</h2>
          <p className="text-sm text-fd-muted-foreground">
            A figure written over one chord, fitted to every chord it plays over
            (<span className="font-mono">Chord.fitNote</span>, passing notes
            keep their interval): change a chord and the same line follows it.
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
          </div>
          {!motifOk ? (
            <p className="text-sm text-rose-500">
              “{motifChord}” isn&apos;t a chord with a root.
            </p>
          ) : null}
        </section>
      ) : null}

      {inspected ? (
        <ReadingsPanel
          chord={inspected.chord}
          readings={readings[inspected.flat]}
          onClose={() => setInspect(null)}
        />
      ) : null}

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">The code</h2>
        <DynamicCodeBlock
          lang="js"
          code={code({
            symbols,
            ranked: ranked.slice(0, 3).map((r) => r.name),
            key,
            inspected,
            readings: inspected ? readings[inspected.flat] : [],
            options,
            choices,
            newChords: reharmonized.map((p) => p.chord),
            melody: melody && motifOk ? { motif, motifChord } : null,
          })}
        />
      </section>
    </div>
  );
}

// The motif notes over a chord of a version: the notes of the motif that fall
// in the chord's time, fitted to it (the motif spans one bar)
function fitMotif(motif: string[], over: string, played: Played): string[] {
  if (!motif.length) return [];
  const per = motif.length / BAR;
  const from = Math.round((played.start % BAR) * per);
  const to = Math.round(((played.start % BAR) + played.duration) * per);
  return motif
    .slice(from, Math.max(to, from + 1))
    .map((n) => Chord.fitNote(n, over, played.chord, { keep: "non-chord" }));
}

// The options of a dropdown grouped by kind, keeping their index
function groups(list: Option[]) {
  const out: [Option["kind"], { option: Option; at: number }[]][] = [];
  list.forEach((option, at) => {
    const last = out[out.length - 1];
    if (last && last[0] === option.kind) last[1].push({ option, at });
    else out.push([option.kind, [{ option, at }]]);
  });
  return out;
}

function ReadingsPanel({
  chord,
  readings,
  onClose,
}: {
  chord: string;
  readings: Reading[];
  onClose: () => void;
}) {
  return (
    <section className="flex flex-col gap-2 rounded-xl border border-fd-border p-4 text-sm">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold">
          Readings of <span className="font-mono">{chord}</span>, the likeliest
          first
        </h2>
        <button
          type="button"
          className="ms-auto rounded-md px-2 hover:bg-fd-accent"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </div>
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
    </section>
  );
}

function code(p: {
  symbols: string[];
  ranked: string[];
  key: string;
  inspected: Slot | undefined;
  readings: Reading[];
  options: Option[][];
  choices: Record<number, number>;
  newChords: string[];
  melody: { motif: string[]; motifChord: string } | null;
}): string {
  const lines = [
    `const chords = ${show(p.symbols)};`,
    `Scale.rank([], { chords, types: ["major", "minor"] }).map((s) => s.name);`,
    `// => ${show(p.ranked)}${p.ranked.length ? " ..." : ""}`,
  ];
  if (p.inspected) {
    const c = p.inspected.chord;
    const i = p.inspected.flat;
    const opts = [
      p.symbols[i - 1] ? `previous: ${show(p.symbols[i - 1])}` : "",
      p.symbols[i + 1] ? `next: ${show(p.symbols[i + 1])}` : "",
    ]
      .filter(Boolean)
      .join(", ");
    lines.push(
      "",
      `Key.analyzeChord(${show(p.key)}, ${show(c)}${opts ? `, { ${opts} }` : ""})[0];`,
      `// => ${show(p.readings[0] ?? null)}`,
    );
  }
  // the substitutes of the first changed chord, or of the first chord
  const changedAt = Object.entries(p.choices).find(([, o]) => o > 0)?.[0];
  const at = changedAt !== undefined ? Number(changedAt) : 0;
  if (p.symbols[at]) {
    const next = p.symbols[at + 1];
    lines.push(
      "",
      `Key.substitutes(${show(p.key)}, ${show(p.symbols[at])}${next ? `, { next: ${show(next)} }` : ""}).map((s) => \`\${s.kind}: \${s.chords.join(" ")}\`);`,
      `// => ${show(p.options[at].slice(1).map((o) => `${o.kind}: ${o.chords.join(" ")}`))}`,
    );
  }
  lines.push("", `// the reharmonized chords`, `// => ${show(p.newChords)}`);
  if (p.melody && p.newChords.length) {
    lines.push(
      "",
      `${show(p.melody.motif)}.map((n) => Chord.fitNote(n, ${show(p.melody.motifChord)}, ${show(p.newChords[0])}, { keep: "non-chord" }));`,
      `// => ${show(p.melody.motif.map((n) => Chord.fitNote(n, p.melody!.motifChord, p.newChords[0], { keep: "non-chord" })))}`,
    );
  }
  return lines.join("\n");
}
