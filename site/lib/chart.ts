import { Chord } from "tonal";

export type ChartChord = {
  /** As written in the chart, spaces included */
  text: string;
  chord: ReturnType<typeof Chord.get>;
};
export type Bar = ChartChord[];

// A chord starts with a note letter, or is "N.C." (no chord). Any other word
// is a qualifier of the chord before it: "Cm7 b9" is one chord, "Cm7 F7" two.
const STARTS_CHORD = /^([A-G]|N\.?C\.?$)/;

/**
 * Read a chart: bars between "|" (or on separate lines), chords separated by
 * spaces. "%" repeats the bar before.
 */
export function parseChart(text: string): Bar[] {
  const bars: Bar[] = [];
  for (const segment of text.split(/[|\n]/)) {
    const words = segment.trim().split(/\s+/).filter(Boolean);
    if (!words.length) continue;
    if (words.length === 1 && words[0] === "%") {
      bars.push(bars[bars.length - 1] ?? []);
      continue;
    }
    const texts: string[] = [];
    for (const word of words) {
      if (STARTS_CHORD.test(word) || !texts.length) texts.push(word);
      else texts[texts.length - 1] += ` ${word}`;
    }
    bars.push(texts.map((t) => ({ text: t, chord: Chord.get(t) })));
  }
  return bars;
}
