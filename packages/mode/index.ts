import { intervals } from "@tonaljs/pcset";
import DATA from "./data";

export interface ModeValid {
  readonly valid: boolean;
  readonly name: string;
  readonly modeNum: number;
  readonly pcset: number;
  readonly alt: number; // number of alterations === number of fiths
  readonly triad: string;
  readonly seventh: string;
  readonly aliases: string[];
  readonly intervals: string[];
}

export interface NoMode extends Partial<ModeValid> {
  readonly valid: false;
  readonly name: "";
}

const NoMode: NoMode = {
  valid: false,
  name: "",
  aliases: [],
  intervals: []
};

export type Mode = ModeValid | NoMode;

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

DATA.forEach(([name, pcset, alt, triad, seventh, alias], modeNum) => {
  const aliases = alias ? [alias] : [];
  const mode: Mode = {
    valid: true,
    modeNum,
    name,
    pcset,
    alt,
    triad,
    seventh,
    aliases,
    intervals: intervals(Number(pcset).toString(2))
  };
  NAMES.push(mode.name);
  MODES[mode.name] = mode;
  mode.aliases.forEach(alias => {
    MODES[alias] = mode;
    ALIASES.push(alias);
  });
});
