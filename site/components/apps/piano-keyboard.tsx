"use client";

import type { KeyboardEvent } from "react";

const BLACK = new Set([1, 3, 6, 8, 10]);
const isBlack = (midi: number) => BLACK.has(midi % 12);

const WHITE_WIDTH = 24;
const WHITE_HEIGHT = 112;
const BLACK_WIDTH = 15;
const BLACK_HEIGHT = 70;

export type PianoKeyboardProps = {
  /** The midi number of the first key (a white key) */
  from: number;
  /** The midi number of the last key (a white key) */
  to: number;
  /** The pressed keys: midi number to the label shown on the key */
  active: Map<number, string>;
  /** A pressed key to mark, such as the bass of a chord */
  marked?: number;
  /** The accessible name of each key */
  keyName: (midi: number) => string;
  onKey: (midi: number) => void;
};

/** An SVG piano keyboard whose keys can be pressed and labelled. */
export function PianoKeyboard({
  from,
  to,
  active,
  marked,
  keyName,
  onKey,
}: PianoKeyboardProps) {
  const keys: { midi: number; x: number; black: boolean }[] = [];
  let whites = 0;
  for (let midi = from; midi <= to; midi++) {
    if (isBlack(midi)) {
      keys.push({
        midi,
        x: whites * WHITE_WIDTH - BLACK_WIDTH / 2,
        black: true,
      });
    } else {
      keys.push({ midi, x: whites * WHITE_WIDTH, black: false });
      whites++;
    }
  }
  const width = whites * WHITE_WIDTH;

  const onKeyDown = (midi: number) => (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onKey(midi);
    }
  };

  // black keys after white keys, so they are drawn on top
  const ordered = [
    ...keys.filter((k) => !k.black),
    ...keys.filter((k) => k.black),
  ];

  return (
    <svg
      viewBox={`0 0 ${width + 1} ${WHITE_HEIGHT + 1}`}
      className="h-auto w-full select-none touch-manipulation"
      role="group"
      aria-label="Piano keyboard"
    >
      {ordered.map(({ midi, x, black }) => {
        const label = active.get(midi);
        const pressed = label !== undefined;
        const w = black ? BLACK_WIDTH : WHITE_WIDTH;
        const h = black ? BLACK_HEIGHT : WHITE_HEIGHT;
        // a color of its own: the theme's primary is near white in dark mode
        const fill = pressed
          ? midi === marked
            ? "fill-sky-700"
            : "fill-sky-500"
          : black
            ? "fill-neutral-800 dark:fill-neutral-950"
            : "fill-white dark:fill-neutral-200";
        return (
          <g
            key={midi}
            role="button"
            tabIndex={0}
            aria-label={keyName(midi)}
            aria-pressed={pressed}
            className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-fd-ring [&:focus-visible>rect]:stroke-2"
            onClick={() => onKey(midi)}
            onKeyDown={onKeyDown(midi)}
          >
            <rect
              x={x + 0.5}
              y={0.5}
              width={w}
              height={h}
              rx={black ? 2 : 3}
              className={`${fill} stroke-neutral-400 dark:stroke-neutral-600`}
            />
            {label ? (
              <text
                x={x + 0.5 + w / 2}
                y={h - (black ? 8 : 10)}
                textAnchor="middle"
                className="pointer-events-none fill-white font-semibold"
                style={{ fontSize: black ? 8 : 9 }}
              >
                {label}
              </text>
            ) : !black && midi % 12 === 0 ? (
              // the C of each octave, to find your way on the keyboard
              <text
                x={x + 0.5 + w / 2}
                y={h - 10}
                textAnchor="middle"
                className="pointer-events-none fill-neutral-400"
                style={{ fontSize: 8 }}
              >
                {`C${Math.floor(midi / 12) - 1}`}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
