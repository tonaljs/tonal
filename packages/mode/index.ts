import { chromaToIntervals, EmptyPcset, Pcset } from "@tonaljs/pcset";
import DATA from "./data";

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

const ea: Pcset = NoMode;

const NAMES: string[] = [];
const ALIASES: string[] = [];
const MODES: Record<string, Mode> = {};

export function mode(name: string): Mode {
  return MODES[name] || NoMode;
}

export function names() {
  return NAMES.slice();
}
export function aliases() {
  return ALIASES.slice();
}

DATA.forEach(([name, setNum, alt, triad, seventh, alias], modeNum) => {
  const aliases = alias ? [alias] : [];
  const chroma = Number(setNum).toString(2);
  const intervals = chromaToIntervals(chroma);
  const mode: Mode = {
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
  NAMES.push(mode.name);
  MODES[mode.name] = mode;
  mode.aliases.forEach(alias => {
    MODES[alias] = mode;
    ALIASES.push(alias);
  });
});
