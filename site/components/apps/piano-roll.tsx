"use client";

import { useEffect, useState } from "react";
import { Note, VoiceLeading } from "tonal";

const ROW = 7; // height of a semitone
const LABELS = 34; // room for the chord labels below
const KEYS = 28; // room for the note names on the left
const BLACK = new Set([1, 3, 6, 8, 10]);

export type RollChord = {
  /** The notes of the voicing, with octave; [] for a rest */
  notes: string[];
  /** Where it starts and how long it lasts, in any unit */
  start: number;
  duration: number;
  /** The labels below the column */
  label: string;
  sublabel?: string;
  /** The fill of its notes (a Tailwind class), instead of the default */
  className?: string;
};

// how far a voice moves: none (held), a step, a 3rd, or a leap
function moveClass(semitones: number) {
  const size = Math.abs(semitones);
  if (size === 0) return "stroke-fd-muted-foreground";
  if (size <= 2) return "stroke-sky-500";
  if (size <= 4) return "stroke-amber-500";
  return "stroke-rose-500";
}

/**
 * The voicings of a progression on a piano roll: time from left to right,
 * pitch from bottom to top, and a line for the move of each voice from one
 * chord to the next (the smallest voice leading, `VoiceLeading.get`).
 */
export function PianoRoll({
  chords,
  unit,
  selected,
  onSelect,
  playback,
  secondsPerUnit = 1,
  clock,
}: {
  chords: RollChord[];
  /** Pixels per unit of time */
  unit: number;
  selected: number | null;
  onSelect: (index: number) => void;
  /** A playback to follow with a playhead: when it started, its length, and whether it loops */
  playback?: { start: number; duration: number; loop?: boolean } | null;
  /** Seconds per unit of time, to place the playhead */
  secondsPerUnit?: number;
  /** The clock of the playback, in seconds */
  clock?: () => number;
}) {
  // the playhead, in units of time, redrawn every frame while playing
  const [head, setHead] = useState<number | null>(null);
  useEffect(() => {
    if (!playback || !clock) {
      setHead(null);
      return;
    }
    let frame = 0;
    const tick = () => {
      let elapsed = clock() - playback.start;
      if (playback.loop) {
        elapsed =
          ((elapsed % playback.duration) + playback.duration) %
          playback.duration;
      } else if (elapsed > playback.duration) {
        setHead(null);
        return;
      }
      setHead(Math.max(0, elapsed) / secondsPerUnit);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playback, clock, secondsPerUnit]);

  const midis = chords.flatMap((c) => c.notes.map((n) => Note.midi(n) ?? 0));
  if (!midis.length) return null;
  const low = Math.min(...midis) - 2;
  const high = Math.max(...midis) + 2;
  const end = Math.max(...chords.map((c) => c.start + c.duration));
  const width = KEYS + end * unit;
  const height = (high - low + 1) * ROW + LABELS;
  const y = (midi: number) => (high - midi) * ROW;
  const x = (time: number) => KEYS + time * unit;

  // the voice leading between each chord and the last one with notes
  const lines: {
    key: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    move: number;
  }[] = [];
  let last = -1;
  chords.forEach((chord, i) => {
    if (!chord.notes.length) return;
    if (last >= 0) {
      const before = chords[last];
      const { moves } = VoiceLeading.get(before.notes, chord.notes);
      moves.forEach(([from, to], m) => {
        const a = Note.midi(from) ?? 0;
        const b = Note.midi(to) ?? 0;
        lines.push({
          key: `${i}-${m}`,
          x1: x(before.start + before.duration) - 2,
          y1: y(a) + ROW / 2,
          x2: x(chord.start) + 2,
          y2: y(b) + ROW / 2,
          move: b - a,
        });
      });
    }
    last = i;
  });

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="The voicings on a piano roll, with the move of each voice"
      className="select-none"
    >
      {/* the pitch rows, black keys shaded, C labelled */}
      {Array.from({ length: high - low + 1 }, (_, r) => {
        const midi = high - r;
        return (
          <g key={midi}>
            <rect
              x={KEYS}
              y={r * ROW}
              width={width - KEYS}
              height={ROW}
              className={
                BLACK.has(midi % 12) ? "fill-fd-muted" : "fill-transparent"
              }
            />
            {midi % 12 === 0 ? (
              <>
                <line
                  x1={KEYS}
                  x2={width}
                  y1={(r + 1) * ROW}
                  y2={(r + 1) * ROW}
                  className="stroke-fd-border"
                />
                <text
                  x={2}
                  y={(r + 1) * ROW - 1}
                  className="fill-fd-muted-foreground text-[9px]"
                >
                  {Note.fromMidi(midi)}
                </text>
              </>
            ) : null}
          </g>
        );
      })}

      {/* a column for each chord, to select it */}
      {chords.map((chord, i) => (
        <g
          key={i}
          onClick={() => onSelect(i)}
          className="cursor-pointer"
          role="button"
          aria-label={`${chord.label} ${chord.sublabel ?? ""}`}
        >
          <rect
            x={x(chord.start)}
            y={0}
            width={chord.duration * unit}
            height={height}
            className={
              head !== null &&
              head >= chord.start &&
              head < chord.start + chord.duration
                ? "fill-amber-500/15"
                : selected === i
                  ? "fill-sky-500/10"
                  : "fill-transparent hover:fill-fd-accent/40"
            }
          />
          <line
            x1={x(chord.start)}
            x2={x(chord.start)}
            y1={0}
            y2={height - LABELS}
            className="stroke-fd-border"
            strokeDasharray="2 3"
          />
          <text
            x={x(chord.start) + 3}
            y={height - LABELS + 13}
            className="fill-fd-foreground font-mono text-[11px] font-bold"
          >
            {chord.label}
          </text>
          {chord.sublabel ? (
            <text
              x={x(chord.start) + 3}
              y={height - LABELS + 26}
              className="fill-fd-muted-foreground font-mono text-[10px]"
            >
              {chord.sublabel}
            </text>
          ) : null}
        </g>
      ))}

      {/* the moves of the voices */}
      {lines.map((l) => (
        <line
          key={l.key}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          strokeWidth={1.5}
          className={moveClass(l.move)}
          pointerEvents="none"
        />
      ))}

      {/* the playhead */}
      {head !== null ? (
        <line
          x1={x(head)}
          x2={x(head)}
          y1={0}
          y2={height - LABELS}
          strokeWidth={2}
          className="stroke-amber-500"
          pointerEvents="none"
        />
      ) : null}

      {/* the notes */}
      {chords.map((chord, i) =>
        chord.notes.map((n) => {
          const midi = Note.midi(n) ?? 0;
          return (
            <rect
              key={`${i}-${n}`}
              x={x(chord.start) + 2}
              y={y(midi) + 1}
              width={Math.max(chord.duration * unit - 4, 2)}
              height={ROW - 2}
              rx={2}
              className={
                chord.className
                  ? `${chord.className} ${selected === i ? "stroke-fd-foreground" : ""}`
                  : selected === i
                    ? "fill-sky-600"
                    : "fill-sky-500/70"
              }
              strokeWidth={selected === i && chord.className ? 1.5 : 0}
              pointerEvents="none"
            >
              <title>{n}</title>
            </rect>
          );
        }),
      )}
    </svg>
  );
}

/** What the colours of the moves mean. */
export function PianoRollLegend() {
  const items: [string, string][] = [
    ["bg-fd-muted-foreground", "held"],
    ["bg-sky-500", "a step"],
    ["bg-amber-500", "a 3rd"],
    ["bg-rose-500", "a leap"],
  ];
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-fd-muted-foreground">
      {items.map(([color, text]) => (
        <span key={text} className="flex items-center gap-1">
          <span className={`h-0.5 w-4 ${color}`} />
          {text}
        </span>
      ))}
    </div>
  );
}
