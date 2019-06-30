import { chromaToIntervals, EmptyPcset, Pcset } from "@tonaljs/pcset";
import { Named } from "@tonaljs/tonal";
import DATA, { ModeDefinition } from "./data";

export interface Mode extends Pcset {
  readonly name: string;
  readonly modeNum: number;
  readonly alt: number; // number of alterations === number of fiths
  readonly triad: string;
  readonly seventh: string;
  readonly aliases: string[];
}

const NoMode: Mode = {
  ...EmptyPcset,
  name: "",
  alt: 0,
  modeNum: NaN,
  triad: "",
  seventh: "",
  aliases: []
};

const all: Mode[] = DATA.map(toMode);
const index: Record<string, Mode> = {};
all.forEach(mode => {
  index[mode.name] = mode;
  mode.aliases.forEach(alias => {
    index[alias] = mode;
  });
});

type ModeLiteral = string | Named;

/**
 * Get a Mode by it's name
 *
 * @example
 * mode('dorian')
 * // =>
 * // {
 * //   intervals: [ '1P', '2M', '3m', '4P', '5P', '6M', '7m' ],
 * //   modeNum: 1,
 * //   chroma: '101101010110',
 * //   normalized: '101101010110',
 * //   name: 'dorian',
 * //   setNum: 2902,
 * //   alt: 2,
 * //   triad: 'm',
 * //   seventh: 'm7',
 * //   aliases: []
 * // }
 */
export function mode(name: ModeLiteral): Mode {
  return typeof name === "string"
    ? index[name.toLowerCase()] || NoMode
    : name && name.name
    ? mode(name.name)
    : NoMode;
}

/**
 * Get a list of all know modes
 */
export function entries() {
  return all.slice();
}

function toMode(mode: ModeDefinition): Mode {
  const [modeNum, setNum, alt, name, triad, seventh, alias] = mode;
  const aliases = alias ? [alias] : [];
  const chroma = Number(setNum).toString(2);
  const intervals = chromaToIntervals(chroma);
  return {
    empty: false,
    intervals,
    modeNum,
    chroma,
    normalized: chroma,
    name,
    setNum,
    alt,
    triad,
    seventh,
    aliases
  };
}
