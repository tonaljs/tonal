"use client";

import { Key } from "tonal";

export type KeyMode = "major" | "minor";

const SIZE = 320;
const C = SIZE / 2;
const OUTER = 150;
const MIDDLE = 106;
const INNER = 64;

/**
 * The key signatures (-7 to 7, flats negative) at each position of the
 * circle, clockwise from the top: C, G, D… Three positions have two spellings
 * (B and Cb, F# and Gb, Db and C#); the first is the one shown first.
 */
export const POSITIONS: number[][] = Array.from({ length: 12 }, (_, i) =>
  Array.from({ length: 15 }, (_, k) => k - 7)
    .filter((sig) => ((sig % 12) + 12) % 12 === i)
    .sort((a, b) => Math.abs(a) - Math.abs(b) || b - a),
);

export const positionOf = (sig: number) => ((sig % 12) + 12) % 12;

/** The tonic of a key signature, as a major or a minor key. */
export function tonicOf(sig: number, mode: KeyMode): string {
  const major = Key.majorTonicFromKeySignature(sig) ?? "";
  return mode === "major" ? major : Key.majorKey(major).minorRelative;
}

// the path of a ring sector between two radii, centred on an angle
// rounded, so the server and the browser render the same numbers
const round = (n: number) => Math.round(n * 100) / 100;

function sector(index: number, r1: number, r2: number) {
  const a0 = ((index * 30 - 90 - 15) * Math.PI) / 180;
  const a1 = ((index * 30 - 90 + 15) * Math.PI) / 180;
  const p = (r: number, a: number) =>
    `${round(C + r * Math.cos(a))} ${round(C + r * Math.sin(a))}`;
  return `M ${p(r2, a0)} A ${r2} ${r2} 0 0 1 ${p(r2, a1)} L ${p(r1, a1)} A ${r1} ${r1} 0 0 0 ${p(r1, a0)} Z`;
}

function labelAt(index: number, r: number) {
  const a = ((index * 30 - 90) * Math.PI) / 180;
  return { x: round(C + r * Math.cos(a)), y: round(C + r * Math.sin(a)) };
}

/**
 * A circle of fifths: major keys outside, their relative minor keys inside.
 * Clicking a key selects it; clicking a selected key with two spellings
 * (B/Cb, F#/Gb, Db/C#) switches to the other spelling.
 */
export function CircleOfFifths({
  sig,
  mode,
  onSelect,
}: {
  sig: number;
  mode: KeyMode;
  onSelect: (sig: number, mode: KeyMode) => void;
}) {
  const selected = positionOf(sig);
  const near = new Set([(selected + 1) % 12, (selected + 11) % 12]);

  const click = (index: number, ringMode: KeyMode) => {
    const options = POSITIONS[index];
    const same = index === selected && ringMode === mode;
    const next =
      same && options.length > 1
        ? options[(options.indexOf(sig) + 1) % options.length]
        : // keep the spelling side of the current key when possible
          (options.find((s) => Math.sign(s) === Math.sign(sig)) ?? options[0]);
    onSelect(next, ringMode);
  };

  const ring = (ringMode: KeyMode, r1: number, r2: number) =>
    POSITIONS.map((options, index) => {
      const isSelected = index === selected && ringMode === mode;
      const isRelative = index === selected && ringMode !== mode;
      const isNear = near.has(index) && ringMode === mode;
      const shown =
        index === selected && options.includes(sig) ? [sig] : options;
      const names = shown.map((s) => tonicOf(s, ringMode));
      const label =
        ringMode === "major" ? names : names.map((n) => n.toLowerCase());
      const { x, y } = labelAt(index, (r1 + r2) / 2);
      return (
        <g
          key={`${ringMode}-${index}`}
          role="button"
          aria-pressed={isSelected}
          aria-label={`${names.join(" or ")} ${ringMode}`}
          className="cursor-pointer"
          onClick={() => click(index, ringMode)}
        >
          <path
            d={sector(index, r1, r2)}
            className={`stroke-fd-border ${
              isSelected
                ? "fill-sky-500"
                : isRelative
                  ? "fill-sky-500/30"
                  : isNear
                    ? "fill-sky-500/15"
                    : "fill-fd-card hover:fill-fd-accent"
            }`}
          />
          <text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            className={`pointer-events-none font-mono ${
              ringMode === "major" ? "text-[13px] font-bold" : "text-[11px]"
            } ${isSelected ? "fill-white" : "fill-fd-foreground"}`}
          >
            {label.length > 1 ? (
              <>
                <tspan x={x} dy="-0.55em">
                  {label[0]}
                </tspan>
                <tspan x={x} dy="1.1em">
                  {label[1]}
                </tspan>
              </>
            ) : (
              label[0]
            )}
          </text>
        </g>
      );
    });

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="w-full max-w-[320px] select-none"
      role="group"
      aria-label="Circle of fifths"
    >
      {ring("major", MIDDLE, OUTER)}
      {ring("minor", INNER, MIDDLE)}
      <text
        x={C}
        y={C}
        textAnchor="middle"
        dominantBaseline="central"
        className="pointer-events-none fill-fd-muted-foreground text-[11px]"
      >
        {sig === 0
          ? "no accidentals"
          : `${Math.abs(sig)} ${sig > 0 ? "♯" : "♭"}`}
      </text>
    </svg>
  );
}
