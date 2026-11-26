// TYPES: PARSING
export type TimeSignatureLiteral = string | [number, number] | [string, string];
type ParsedTimeSignature = [number | number[], number];

// TYPES: PROPERTIES
export type ValidTimeSignature = {
  readonly empty: false;
  readonly name: string;
  readonly upper: number | number[];
  readonly lower: number;
  readonly type: "simple" | "compound" | "irregular" | "irrational";
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
  additive: [],
};

const NAMES = ["4/4", "3/4", "2/4", "2/2", "12/8", "9/8", "6/8", "3/8"];

// PUBLIC API

/**
 * Get the names of the most common time signatures.
 *
 * @example
 * TimeSignature.names() // => ["4/4", "3/4", "2/4", "2/2", "12/8", "9/8", "6/8", "3/8"]
 */
export function names() {
  return NAMES.slice();
}

const REGEX = /^(\d*\d(?:\+\d)*)\/(\d+)$/;
// Common time and cut time symbols
const ALIASES = new Map([
  ["C", "4/4"],
  ["c", "4/4"],
  ["C|", "2/2"],
  ["¢", "2/2"],
]);
const CACHE = new Map<TimeSignatureLiteral, TimeSignature>();

/**
 * Get the TimeSignature object of a name ("3/4", "3+2/8", or the symbols "C"
 * and "C|"), or of a `[upper, lower]` pair. `type` is "simple", "compound",
 * "irregular" or "irrational". Invalid input gives an object with
 * `empty: true` and `name: ""`.
 *
 * @example
 * TimeSignature.get("3/4") // => { empty: false, name: "3/4", type: "simple", upper: 3, lower: 4, additive: [] }
 * TimeSignature.get("C").name // => "4/4"
 * TimeSignature.get("6/8").type // => "compound"
 * TimeSignature.get("3+2/8").additive // => [3, 2]
 * TimeSignature.get("x").empty // => true
 */
export function get(literal: TimeSignatureLiteral): TimeSignature {
  const stringifiedLiteral = JSON.stringify(literal);
  const cached = CACHE.get(stringifiedLiteral);
  if (cached) {
    return cached;
  }

  const ts = build(parse(literal));
  // Only valid signatures are cached, so arbitrary input can't grow the cache
  if (!ts.empty) CACHE.set(stringifiedLiteral, ts);
  return ts;
}

/**
 * Parse a time signature into `[upper, lower]`: the upper is a number, or a
 * list of numbers for an additive signature. Invalid input gives `[0, 0]`.
 * Use `TimeSignature.get` to get a validated object.
 *
 * @example
 * TimeSignature.parse("3/4") // => [3, 4]
 * TimeSignature.parse("3+2/8") // => [[3, 2], 8]
 * TimeSignature.parse("x") // => [0, 0]
 */
export function parse(literal: TimeSignatureLiteral): ParsedTimeSignature {
  if (typeof literal === "string") {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, up, low] = REGEX.exec(ALIASES.get(literal) ?? literal) || [];
    return parse([up, low]);
  }

  if (!Array.isArray(literal)) return [0, 0];
  const [up, down] = literal;
  const denominator = +down;
  if (typeof up === "number") {
    return [up, denominator];
  }

  // Guard against input that does not match REGEX (e.g. "C"): the exec above
  // yields an undefined `up`, so `up.split` would throw. Return a zeroed parse
  // that `build` maps to the NONE signature, matching invalid inputs like "0/0".
  if (typeof up !== "string") {
    return [0, 0];
  }

  const list = up.split("+").map((n) => +n);
  return list.length === 1 ? [list[0], denominator] : [list, denominator];
}

/** @deprecated */
export default { names, parse, get };

// PRIVATE

const isPowerOfTwo = (x: number) => (Math.log(x) / Math.log(2)) % 1 === 0;
const isPositiveInteger = (x: number) => Number.isInteger(x) && x > 0;

function build([up, down]: ParsedTimeSignature): TimeSignature {
  const parts = Array.isArray(up) ? up : [up];
  if (!parts.every(isPositiveInteger) || !isPositiveInteger(down)) {
    return NONE;
  }
  const upper = parts.reduce((a, b) => a + b, 0);
  const lower = down;

  const name = Array.isArray(up) ? `${up.join("+")}/${down}` : `${up}/${down}`;
  const additive = Array.isArray(up) ? up : [];
  const type =
    lower === 4 || lower === 2
      ? "simple"
      : lower >= 8 && isPowerOfTwo(lower) && upper % 3 === 0
        ? "compound"
        : isPowerOfTwo(lower)
          ? "irregular"
          : "irrational";

  return {
    empty: false,
    name,
    type,
    upper,
    lower,
    additive,
  };
}
