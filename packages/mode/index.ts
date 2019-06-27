import DATA from "./data";

export interface ModeValid {
  valid: boolean;
  name: string;
  modeNum: number;
  pcset: number;
  alt: number; // number of alterations === number of fiths
  triad: string;
  seventh: string;
  aliases: string[];
}

export interface ModeInvalid extends Partial<ModeValid> {
  valid: false;
}

export const NoMode: ModeInvalid = {
  valid: false,
  name: ""
};

export type Mode = ModeValid | ModeInvalid;

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
    aliases
  };
  NAMES.push(mode.name);
  MODES[mode.name] = mode;
  mode.aliases.forEach(alias => {
    MODES[alias] = mode;
    ALIASES.push(alias);
  });
});
