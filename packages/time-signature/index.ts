// TYPES: PARSING
export type TimeSignatureLiteral = string | [number, number] | [string, string];
type ParsedTimeSignature = [number | number[], number];

// TYPES: PROPERTIES
export type ValidTimeSignature = {
  readonly empty: false;
  readonly name: string;
  readonly upper: number | number[];
  readonly lower: number;
  readonly type: "simple" | "compound" | "irregular";
  readonly additive: number[];
};

export type InvalidTimeSignature = {
  readonly empty: true;
  readonly name: "";
  readonly upper: undefined;
  readonly lower: undefined;
  readonly type: undefined;
  readonly additive: [];
};

export type TimeSignature = ValidTimeSignature | InvalidTimeSignature;

// CONSTANTS
const NONE: InvalidTimeSignature = {
  empty: true,
  name: "",
  upper: undefined,
  lower: undefined,
  type: undefined,
  additive: []
};

const NAMES = ["4/4", "3/4", "2/4", "2/2", "12/8", "9/8", "6/8", "3/8"];

// PUBLIC API

export function names() {
  return NAMES.slice();
}

const REGEX = /^(\d?\d(?:\+\d)*)\/(\d)$/;
const CACHE = new Map<TimeSignatureLiteral, TimeSignature>();

export function get(literal: TimeSignatureLiteral): TimeSignature {
  const cached = CACHE.get(literal);
  if (cached) {
    return cached;
  }

  const ts = build(parse(literal));
  CACHE.set(literal, ts);
  return ts;
}

export function parse(literal: TimeSignatureLiteral): ParsedTimeSignature {
  if (typeof literal === "string") {
    const [_, up, low] = REGEX.exec(literal) || [];
    return parse([up, low]);
  }

  const [up, down] = literal;
  const denominator = +down;
  if (typeof up === "number") {
    return [up, denominator];
  }

  const list = up.split("+").map(n => +n);
  return list.length === 1 ? [list[0], denominator] : [list, denominator];
}

export default { names, parse, get };

// PRIVATE

function build([up, down]: ParsedTimeSignature): TimeSignature {
  const upper = Array.isArray(up) ? up.reduce((a, b) => a + b, 0) : up;
  const lower = down;
  if (upper === 0 || lower === 0) {
    return NONE;
  }

  const name = Array.isArray(up) ? `${up.join("+")}/${down}` : `${up}/${down}`;
  const additive = Array.isArray(up) ? up : [];
  const type =
    lower === 4 || lower === 2
      ? "simple"
      : lower === 8 && upper % 3 === 0
      ? "compound"
      : "irregular";

  return {
    empty: false,
    name,
    type,
    upper,
    lower,
    additive
  };
}
