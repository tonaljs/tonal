"use client";

import type { ReactNode } from "react";
import type { PianoStatus } from "./use-piano";

/** A group of buttons to choose one of a few values. */
export function Toggle<T extends string | number>({
  label,
  value,
  options,
  onChange,
  stacked = false,
}: {
  label: string;
  value: T;
  options: [T, string][];
  onChange: (value: T) => void;
  /** The label above the buttons instead of before them */
  stacked?: boolean;
}) {
  return (
    <div
      className={stacked ? "flex flex-col gap-1" : "flex items-center gap-2"}
      role="group"
      aria-label={label}
    >
      <span className={stacked ? "font-medium" : "text-fd-muted-foreground"}>
        {label}
      </span>
      <div className="flex w-fit overflow-hidden rounded-lg border border-fd-border">
        {options.map(([option, text]) => (
          <button
            key={option}
            type="button"
            aria-pressed={option === value}
            className={`px-2 ${stacked ? "py-1.5" : "py-0.5"} ${
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

/** A small button with a chord, a note or an example. */
export function Chip({
  children,
  pressed,
  onClick,
  title,
}: {
  children: ReactNode;
  pressed?: boolean;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      title={title}
      className={`rounded-md px-2 py-0.5 font-mono ${
        pressed
          ? "bg-fd-primary text-fd-primary-foreground"
          : "bg-fd-secondary hover:bg-fd-accent"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/** A line while the piano samples load, or if they can't. */
export function PianoMessage({ status }: { status: PianoStatus }) {
  if (status === "loading") {
    return (
      <p className="text-sm text-fd-muted-foreground">Loading the piano…</p>
    );
  }
  if (status === "error") {
    return (
      <p className="text-sm text-fd-muted-foreground">
        The piano samples could not be loaded.
      </p>
    );
  }
  return null;
}

/** A select of note names, keeping the current one if it isn't listed. */
export function NoteSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const list = options.includes(value) ? options : [value, ...options];
  return (
    <label className="flex flex-col gap-1">
      <span className="font-medium">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-fd-border bg-fd-background px-2 py-1.5"
      >
        {list.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </label>
  );
}

export const TONICS = [
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

/** JSON for the code panels, with a space after each comma and colon. */
export const show = (value: unknown) =>
  JSON.stringify(value)
    .replaceAll('","', '", "')
    .replaceAll('":', '": ')
    .replaceAll(',"', ', "');
