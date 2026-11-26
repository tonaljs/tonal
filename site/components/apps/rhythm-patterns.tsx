"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { useEffect, useMemo, useState } from "react";
import { RhythmPattern } from "tonal";
import { Chip, Toggle } from "./controls";
import { type DrumStatus, useRhythmPlayer } from "./use-rhythm-player";

type Preset = { name: string; title: string; durations: number[] };

// Toussaint's six distinguished timelines (The Geometry of Musical Rhythm,
// ch. 7), five onsets in 16 steps, and a few shorter ones
const TIMELINES: Preset[] = [
  { name: "shiko", title: "Shiko", durations: [4, 2, 4, 2, 4] },
  { name: "son", title: "Clave son", durations: [3, 3, 4, 2, 4] },
  { name: "rumba", title: "Clave rumba", durations: [3, 4, 3, 2, 4] },
  { name: "soukous", title: "Soukous", durations: [3, 3, 4, 1, 5] },
  { name: "gahu", title: "Gahu", durations: [3, 3, 4, 4, 2] },
  { name: "bossa", title: "Bossa-nova", durations: [3, 3, 4, 3, 3] },
];
const MORE: Preset[] = [
  { name: "tresillo", title: "Tresillo", durations: [3, 3, 2] },
  { name: "cinquillo", title: "Cinquillo", durations: [2, 1, 2, 1, 2] },
  { name: "bembe", title: "Bembé", durations: [2, 2, 1, 2, 2, 2, 1] },
];
const PRESETS = [...TIMELINES, ...MORE];

const MAX_STEPS = 32;
const SON = RhythmPattern.fromDurations(TIMELINES[1].durations);

// beats of 2, 3 or 4 steps; the one that divides the length, 4 first
const defaultBeat = (n: number) => (n % 4 === 0 ? 4 : n % 3 === 0 ? 3 : 2);

const parseNumbers = (text: string): number[] | null => {
  const words = text
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean);
  const numbers = words.map(Number);
  return words.length && numbers.every(Number.isInteger) ? numbers : null;
};

const fixed = (n: number | null) =>
  n === null ? "—" : Number.isInteger(n) ? String(n) : n.toFixed(4);
const yes = (b: boolean) => (b ? "yes" : "no");
const four = (n: number | null) => (n === null ? "—" : n.toFixed(4));
// JSON with a space after each comma, for the code panel
const list = (value: unknown) => JSON.stringify(value).replaceAll(",", ", ");

/** Everything the app shows about a pattern, from tonal. */
function measure(pattern: number[]) {
  return {
    onsets: RhythmPattern.toOnsets(pattern),
    durations: RhythmPattern.toDurations(pattern),
    evenness: RhythmPattern.evenness(pattern),
    maximallyEven: RhythmPattern.isMaximallyEven(pattern),
    deep: RhythmPattern.isDeep(pattern),
    hasOddity: RhythmPattern.hasOddity(pattern),
    oddity: RhythmPattern.oddity(pattern),
    offbeatness: RhythmPattern.offbeatness(pattern),
    intervalVector: RhythmPattern.intervalVector(pattern),
    necklace: RhythmPattern.necklace(pattern),
  };
}

export function RhythmPatterns() {
  const [pattern, setPattern] = useState<number[]>(SON);
  const [bpm, setBpm] = useState(100);
  const [beat, setBeat] = useState(4);
  const [pulse, setPulse] = useState(true);
  const [euclidSteps, setEuclidSteps] = useState(16);
  const [euclidBeats, setEuclidBeats] = useState(5);
  const [linkRead, setLinkRead] = useState(false);
  const player = useRhythmPlayer();

  // read the pattern of a shared link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const steps = (params.get("p") ?? "").split("").map(Number);
    if (
      steps.length >= 2 &&
      steps.length <= MAX_STEPS &&
      steps.every((s) => s === 0 || s === 1)
    ) {
      setPattern(steps);
      setBeat(defaultBeat(steps.length));
    }
    const linkBpm = Number(params.get("bpm"));
    if (linkBpm >= 40 && linkBpm <= 240) setBpm(linkBpm);
    const linkBeat = Number(params.get("beat"));
    if ([2, 3, 4].includes(linkBeat)) setBeat(linkBeat);
    setLinkRead(true);
  }, []);

  // keep the link up to date, to share it
  useEffect(() => {
    if (!linkRead) return;
    const params = new URLSearchParams({
      p: pattern.join(""),
      bpm: String(bpm),
      beat: String(beat),
    });
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString()}`,
    );
  }, [linkRead, pattern, bpm, beat]);

  // what plays: the pattern, and a pulse on every beat (a beat is a quarter
  // note when it has 4 steps, a dotted quarter with 3, an eighth with 2)
  const pulsePattern = useMemo(
    () => pattern.map((_, i) => (i % beat === 0 ? 1 : 0)),
    [pattern, beat],
  );
  const { update } = player;
  useEffect(() => {
    const secondsPerBeat = 60 / bpm;
    update(
      [
        { pattern, sound: "clave", velocity: 110 },
        ...(pulse
          ? [{ pattern: pulsePattern, sound: "kick" as const, velocity: 70 }]
          : []),
      ],
      secondsPerBeat / beat,
    );
  }, [update, pattern, pulsePattern, pulse, bpm, beat]);

  const m = useMemo(() => measure(pattern), [pattern]);
  const preset = PRESETS.find(
    (p) =>
      p.durations.join() === m.durations.join() &&
      pattern.length === p.durations.reduce((a, b) => a + b, 0),
  );

  const load = (next: number[]) => {
    if (next.length < 2 || next.length > MAX_STEPS) return;
    if (next.length !== pattern.length) setBeat(defaultBeat(next.length));
    setPattern(next);
  };
  const toggle = (i: number) => {
    const next = pattern.map((s, j) => (j === i ? 1 - s : s));
    if (next[i] === 1) player.hit("clave");
    setPattern(next);
  };
  const resize = (length: number) => {
    if (length < 2 || length > MAX_STEPS) return;
    load(
      Array.from({ length }, (_, i) => (i < pattern.length ? pattern[i] : 0)),
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-fd-muted-foreground">Timelines</span>
          {TIMELINES.map((p) => (
            <Chip
              key={p.name}
              pressed={preset?.name === p.name}
              onClick={() => load(RhythmPattern.fromDurations(p.durations))}
            >
              {p.title}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-fd-muted-foreground">More</span>
          {MORE.map((p) => (
            <Chip
              key={p.name}
              pressed={preset?.name === p.name}
              onClick={() => load(RhythmPattern.fromDurations(p.durations))}
            >
              {p.title}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-fd-muted-foreground">Euclid</span>
          <NumberInput
            label="beats"
            value={euclidBeats}
            min={0}
            max={euclidSteps}
            onChange={setEuclidBeats}
          />
          <span className="text-fd-muted-foreground">in</span>
          <NumberInput
            label="steps"
            value={euclidSteps}
            min={2}
            max={MAX_STEPS}
            onChange={setEuclidSteps}
          />
          <button
            type="button"
            className="rounded-lg border border-fd-border px-2 py-0.5 hover:bg-fd-accent"
            onClick={() =>
              load(
                RhythmPattern.euclid(
                  euclidSteps,
                  Math.min(euclidBeats, euclidSteps),
                ),
              )
            }
          >
            E({Math.min(euclidBeats, euclidSteps)}, {euclidSteps})
          </button>
        </div>
      </section>

      <section className="flex flex-col items-center gap-4 md:flex-row md:items-start">
        <RhythmCircle
          pattern={pattern}
          beat={beat}
          step={player.step}
          onToggle={toggle}
        />
        <div className="flex w-full min-w-0 flex-col gap-3">
          <StepRow
            pattern={pattern}
            beat={beat}
            step={player.step}
            onToggle={toggle}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Chip onClick={() => setPattern(RhythmPattern.rotate(pattern, -1))}>
              ← rotate
            </Chip>
            <Chip onClick={() => setPattern(RhythmPattern.rotate(pattern, 1))}>
              rotate →
            </Chip>
            <Chip onClick={() => setPattern(RhythmPattern.necklace(pattern))}>
              necklace
            </Chip>
            <Chip onClick={() => setPattern(RhythmPattern.complement(pattern))}>
              complement
            </Chip>
            <Chip onClick={() => setPattern(pattern.map(() => 0))}>clear</Chip>
          </div>
          <NumbersField
            label="Durations"
            value={m.durations}
            onCommit={(numbers) => {
              const next = RhythmPattern.fromDurations(numbers);
              if (next.length) load(next);
            }}
          />
          <NumbersField
            label="Onsets"
            value={m.onsets}
            onCommit={(numbers) => {
              const next = RhythmPattern.fromOnsets(numbers, pattern.length);
              if (next.length) setPattern(next);
            }}
          />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <label className="flex items-center gap-2">
              <span className="text-fd-muted-foreground">Steps</span>
              <NumberInput
                label="steps"
                value={pattern.length}
                min={2}
                max={MAX_STEPS}
                onChange={resize}
              />
            </label>
            <Toggle
              label="Beat"
              value={beat}
              options={[
                [2, "2 steps"],
                [3, "3"],
                [4, "4"],
              ]}
              onChange={setBeat}
            />
          </div>
          <PlayControls
            playing={player.playing}
            status={player.status}
            bpm={bpm}
            pulse={pulse}
            onPlay={player.play}
            onStop={player.stop}
            onBpm={setBpm}
            onPulse={setPulse}
          />
        </div>
      </section>

      <Measures pattern={pattern} m={m} />
      <Compare pattern={pattern} onLoad={load} />

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">The code</h2>
        <DynamicCodeBlock lang="js" code={code(pattern, m, preset)} />
      </section>
    </div>
  );
}

function NumberInput({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <input
      type="number"
      aria-label={label}
      value={value}
      min={min}
      max={max}
      onChange={(e) => {
        const n = Number(e.target.value);
        if (Number.isInteger(n) && n >= min && n <= max) onChange(n);
      }}
      className="w-16 rounded-lg border border-fd-border bg-fd-background px-2 py-0.5"
    />
  );
}

/** A list of numbers to edit as text; it's applied when it parses. */
function NumbersField({
  label,
  value,
  onCommit,
}: {
  label: string;
  value: number[];
  onCommit: (numbers: number[]) => void;
}) {
  const text = value.join(" ");
  const [draft, setDraft] = useState(text);
  // follow the pattern when it changes elsewhere
  useEffect(() => setDraft(text), [text]);
  const numbers = parseNumbers(draft);
  return (
    <label className="flex flex-wrap items-center gap-2">
      <span className="w-20 text-fd-muted-foreground">{label}</span>
      <input
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          const parsed = parseNumbers(e.target.value);
          if (parsed) onCommit(parsed);
        }}
        aria-invalid={draft.trim() !== "" && !numbers}
        className="min-w-0 flex-1 rounded-lg border border-fd-border bg-fd-background px-2 py-1 font-mono aria-invalid:border-red-500"
      />
    </label>
  );
}

function PlayControls({
  playing,
  status,
  bpm,
  pulse,
  onPlay,
  onStop,
  onBpm,
  onPulse,
}: {
  playing: boolean;
  status: DrumStatus;
  bpm: number;
  pulse: boolean;
  onPlay: () => void;
  onStop: () => void;
  onBpm: (bpm: number) => void;
  onPulse: (pulse: boolean) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <button
        type="button"
        className="rounded-lg bg-fd-primary px-3 py-1.5 font-medium text-fd-primary-foreground hover:opacity-90"
        onClick={playing ? onStop : onPlay}
      >
        {playing ? "Stop" : "Play"}
      </button>
      <label className="flex flex-wrap items-center gap-2">
        <span className="text-fd-muted-foreground">Tempo</span>
        <input
          type="range"
          min={40}
          max={240}
          value={bpm}
          onChange={(e) => onBpm(Number(e.target.value))}
          className="w-28"
        />
        <span className="w-16 font-mono text-sm">{bpm} bpm</span>
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={pulse}
          onChange={(e) => onPulse(e.target.checked)}
        />
        <span className="text-fd-muted-foreground">Kick on the beat</span>
      </label>
      {status === "loading" ? (
        <span className="text-sm text-fd-muted-foreground">
          Loading the drums…
        </span>
      ) : status === "error" ? (
        <span className="text-sm text-fd-muted-foreground">
          The drum samples could not be loaded.
        </span>
      ) : null}
    </div>
  );
}

const SIZE = 300;
const C = SIZE / 2;
const R = 118;
// rounded, so the server and the browser render the same numbers
const round = (n: number) => Math.round(n * 100) / 100;
const at = (i: number, n: number, r = R) => {
  const a = (2 * Math.PI * i) / n - Math.PI / 2;
  return [round(C + r * Math.cos(a)), round(C + r * Math.sin(a))];
};
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/**
 * The pattern in polygon notation: the steps clockwise from the top, the
 * onsets joined. Dashed lines join opposite onsets (no rhythmic oddity), and
 * a ring marks the onsets off every beat (off-beatness).
 */
function RhythmCircle({
  pattern,
  beat,
  step,
  onToggle,
}: {
  pattern: number[];
  beat: number;
  step: number | null;
  onToggle: (i: number) => void;
}) {
  const n = pattern.length;
  const onsets = pattern.flatMap((s, i) => (s ? [i] : []));
  const opposite =
    n % 2 === 0 ? onsets.filter((p) => p < n / 2 && pattern[p + n / 2]) : [];
  const dot = n > 24 ? 6 : 9;
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="w-full max-w-[300px] shrink-0"
      role="img"
      aria-label="The pattern on a circle"
    >
      <circle
        cx={C}
        cy={C}
        r={R}
        className="fill-none stroke-fd-border"
        strokeWidth={1}
      />
      {onsets.length > 1 ? (
        <polygon
          points={onsets.map((p) => at(p, n).join(",")).join(" ")}
          className="fill-sky-500/10 stroke-sky-600 dark:stroke-sky-400"
          strokeWidth={2}
        />
      ) : null}
      {opposite.map((p) => {
        const [x1, y1] = at(p, n);
        const [x2, y2] = at(p + n / 2, n);
        return (
          <line
            key={p}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className="stroke-red-500"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
        );
      })}
      {pattern.map((s, i) => {
        const [x, y] = at(i, n);
        const [lx, ly] = at(i, n, R + 20);
        const offbeat = s === 1 && i > 0 && gcd(i, n) === 1;
        return (
          <g
            key={i}
            onClick={() => onToggle(i)}
            className="cursor-pointer"
            role="button"
            aria-label={`Step ${i}: ${s ? "onset" : "rest"}`}
          >
            {step === i ? (
              <circle cx={x} cy={y} r={dot + 5} className="fill-amber-400/50" />
            ) : null}
            {offbeat ? (
              <circle
                cx={x}
                cy={y}
                r={dot + 3}
                className="fill-none stroke-violet-500"
                strokeWidth={1.5}
              />
            ) : null}
            <circle
              cx={x}
              cy={y}
              r={dot}
              strokeWidth={1.5}
              className={
                s
                  ? "fill-sky-600 stroke-sky-600 dark:fill-sky-400 dark:stroke-sky-400"
                  : "fill-fd-background stroke-fd-muted-foreground"
              }
            />
            {n <= 24 ? (
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                className={`text-[11px] ${i % beat === 0 ? "fill-fd-foreground font-semibold" : "fill-fd-muted-foreground"}`}
              >
                {i}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

/** The pattern in box notation, one box per step, the beats marked. */
function StepRow({
  pattern,
  beat,
  step,
  onToggle,
}: {
  pattern: number[];
  beat: number;
  step: number | null;
  onToggle: (i: number) => void;
}) {
  return (
    <div className="flex overflow-x-auto pb-1">
      {pattern.map((s, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Step ${i}: ${s ? "onset" : "rest"}`}
          aria-pressed={s === 1}
          onClick={() => onToggle(i)}
          className={`h-8 w-7 shrink-0 border-y border-e border-fd-border font-mono text-sm first:rounded-s-md first:border-s last:rounded-e-md ${
            i % beat === 0 && i > 0 ? "border-s-2 border-s-fd-foreground" : ""
          } ${
            s
              ? "bg-sky-600 text-white dark:bg-sky-400 dark:text-black"
              : "bg-fd-background text-fd-muted-foreground"
          } ${step === i ? "ring-2 ring-amber-400 ring-inset" : ""}`}
        >
          {s ? "x" : "."}
        </button>
      ))}
    </div>
  );
}

function Measures({
  pattern,
  m,
}: {
  pattern: number[];
  m: ReturnType<typeof measure>;
}) {
  const n = pattern.length;
  const max = Math.max(1, ...m.intervalVector);
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">
        Measures
        <span className="ms-2 text-base font-normal text-fd-muted-foreground">
          from Toussaint, <i>The Geometry of Musical Rhythm</i>
        </span>
      </h2>
      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        <Measure
          name="Evenness"
          value={four(m.evenness)}
          note="1 when the onsets are spread as evenly as the steps allow"
        >
          {m.evenness !== null ? (
            <div className="mt-1 h-1.5 w-full rounded bg-fd-secondary">
              <div
                className="h-full rounded bg-sky-500"
                style={{ width: `${Math.max(0, m.evenness) * 100}%` }}
              />
            </div>
          ) : null}
        </Measure>
        <Measure
          name="Maximally even"
          value={yes(m.maximallyEven)}
          note="Euclidean rhythms always are"
        />
        <Measure
          name="Deep"
          value={yes(m.deep)}
          note="each distance between onsets occurs a different number of times"
        />
        <Measure
          name="Rhythmic oddity"
          value={
            n % 2
              ? "yes (odd length)"
              : `${yes(m.hasOddity)}, score ${fixed(m.oddity)}`
          }
          note="no two onsets opposite each other (red lines when there are)"
        />
        <Measure
          name="Off-beatness"
          value={fixed(m.offbeatness)}
          note="onsets off every beat (ringed); the only one that changes with rotation"
        />
        <Measure
          name="Necklace"
          value={m.necklace.map((s) => (s ? "x" : ".")).join("")}
          note="the same for every rotation"
        />
      </dl>
      <div>
        <h3 className="font-medium">Interval vector</h3>
        <p className="text-sm text-fd-muted-foreground">
          How many pairs of onsets are at each distance (the shortest way round
          the loop).
        </p>
        <div className="mt-2 flex items-end gap-1">
          {m.intervalVector.map((count, d) => (
            <div key={d} className="flex w-7 flex-col items-center gap-0.5">
              <span className="font-mono text-xs">{count}</span>
              <div
                className="w-5 rounded-t bg-sky-500"
                style={{ height: `${(count / max) * 64}px` }}
              />
              <span className="text-xs text-fd-muted-foreground">{d + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Measure({
  name,
  value,
  note,
  children,
}: {
  name: string;
  value: string;
  note: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <dt className="font-medium">{name}</dt>
      <dd className="font-mono">{value}</dd>
      {children}
      <dd className="text-xs text-fd-muted-foreground">{note}</dd>
    </div>
  );
}

/** The six timelines measured, and their distance to the pattern. */
function Compare({
  pattern,
  onLoad,
}: {
  pattern: number[];
  onLoad: (pattern: number[]) => void;
}) {
  const rows = TIMELINES.map((t) => {
    const p = RhythmPattern.fromDurations(t.durations);
    return { ...t, pattern: p, m: measure(p) };
  });
  const sameLength = pattern.length === 16;
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">The six timelines</h2>
      <p className="text-sm text-fd-muted-foreground">
        Toussaint&apos;s six distinguished timelines, five onsets in 16 steps.
        The distances are to your pattern
        {sameLength ? "" : " (they need 16 steps)"}: Hamming counts the steps
        that differ, swap how far the onsets move.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="text-start text-fd-muted-foreground">
              {[
                "",
                "durations",
                "evenness",
                "max. even",
                "deep",
                "oddity",
                "off-beat",
                "Hamming",
                "swap",
              ].map((h) => (
                <th key={h} className="p-1 text-start font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t border-fd-border">
                <td className="p-1">
                  <button
                    type="button"
                    className="underline decoration-fd-border hover:decoration-fd-foreground"
                    onClick={() => onLoad(r.pattern)}
                  >
                    {r.title}
                  </button>
                </td>
                <td className="p-1 font-mono">{r.durations.join("-")}</td>
                <td className="p-1 font-mono">{four(r.m.evenness)}</td>
                <td className="p-1">{yes(r.m.maximallyEven)}</td>
                <td className="p-1">{yes(r.m.deep)}</td>
                <td className="p-1 font-mono">
                  {r.m.hasOddity ? "yes" : "no"}, {fixed(r.m.oddity)}
                </td>
                <td className="p-1 font-mono">{fixed(r.m.offbeatness)}</td>
                <td className="p-1 font-mono">
                  {fixed(RhythmPattern.distance(pattern, r.pattern))}
                </td>
                <td className="p-1 font-mono">
                  {fixed(RhythmPattern.distance(pattern, r.pattern, "swap"))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function code(
  pattern: number[],
  m: ReturnType<typeof measure>,
  preset: Preset | undefined,
) {
  const make = preset
    ? `RhythmPattern.fromDurations(${list(preset.durations)})`
    : `RhythmPattern.fromOnsets(${list(m.onsets)}, ${pattern.length})`;
  const lines = [
    `import { RhythmPattern } from "tonal";`,
    "",
    `const pattern = ${make};`,
    `// => ${list(pattern)}`,
    `RhythmPattern.toOnsets(pattern); // => ${list(m.onsets)}`,
    `RhythmPattern.toDurations(pattern); // => ${list(m.durations)}`,
    `RhythmPattern.evenness(pattern); // => ${list(m.evenness)}`,
    `RhythmPattern.isMaximallyEven(pattern); // => ${m.maximallyEven}`,
    `RhythmPattern.isDeep(pattern); // => ${m.deep}`,
    `RhythmPattern.hasOddity(pattern); // => ${m.hasOddity}`,
    `RhythmPattern.oddity(pattern); // => ${list(m.oddity)}`,
    `RhythmPattern.offbeatness(pattern); // => ${list(m.offbeatness)}`,
    `RhythmPattern.intervalVector(pattern); // => ${list(m.intervalVector)}`,
    `RhythmPattern.necklace(pattern); // => ${list(m.necklace)}`,
  ];
  if (pattern.length === 16) {
    lines.push(
      `RhythmPattern.distance(pattern, RhythmPattern.fromDurations([3, 3, 4, 2, 4]), "swap"); // => ${list(RhythmPattern.distance(pattern, SON, "swap"))}`,
    );
  }
  return lines.join("\n");
}
