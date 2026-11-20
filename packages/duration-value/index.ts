import DATA from "./data";

type Fraction = [number, number];

const VALUES: DurationValue[] = [];

DATA.forEach(([denominator, shorthand, names]) =>
  add(denominator, shorthand, names),
);

export interface DurationValue {
  empty: boolean;
  value: number;
  name: string;
  fraction: Fraction;
  shorthand: string;
  dots: string;
  names: string[];
}

const NoDuration: DurationValue = {
  empty: true,
  name: "",
  value: 0,
  fraction: [0, 0],
  shorthand: "",
  dots: "",
  names: [],
};

/**
 * Get all the duration names ("quarter", "crotchet", "eighth"...) that
 * `DurationValue.get` accepts, in a flat list from the longest to the
 * shortest.
 *
 * @example
 * DurationValue.names().slice(0, 4) // => ["large", "duplex longa", "maxima", "octuple"]
 */
export function names(): string[] {
  return VALUES.reduce((names, duration) => {
    duration.names.forEach((name) => names.push(name));
    return names;
  }, [] as string[]);
}

/**
 * Get the shorthand of every duration value ("w" whole, "h" half, "q"
 * quarter, "e" eighth...), from the longest to the shortest.
 *
 * @example
 * DurationValue.shorthands() // => ["dl", "l", "d", "w", "h", "q", "e", "s", "t", "sf", "h", "th"]
 */
export function shorthands(): string[] {
  return VALUES.map((dur) => dur.shorthand);
}

const REGEX = /^([^.]+)(\.*)$/;

/**
 * Get the DurationValue object (value, fraction, shorthand, names...) of a
 * duration name or shorthand, with optional trailing dots ("q", "quarter",
 * "q."). The value is the fraction of a whole note. Unknown names give an
 * object with `empty: true` and `value: 0`.
 *
 * @example
 * DurationValue.get("q").value // => 0.25
 * DurationValue.get("quarter.").fraction // => [3, 8]
 * DurationValue.get("x").empty // => true
 */
export function get(name: string): DurationValue {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, simple, dots] = REGEX.exec(name) || [];
  const base = VALUES.find(
    (dur) => dur.shorthand === simple || dur.names.includes(simple),
  );
  if (!base) {
    return NoDuration;
  }

  const fraction = calcDots(base.fraction, dots.length);
  const value = fraction[0] / fraction[1];

  return { ...base, name, dots, value, fraction };
}

/**
 * Get the value of a duration (with optional dots) as a fraction of a whole
 * note, or 0 if not valid.
 *
 * @example
 * DurationValue.value("e") // => 0.125
 * DurationValue.value("q.") // => 0.375
 */
export const value = (name: string) => get(name).value;

/**
 * Get the value of a duration (with optional dots) as a `[numerator,
 * denominator]` fraction of a whole note, or `[0, 0]` if not valid.
 *
 * @example
 * DurationValue.fraction("q") // => [1, 4]
 * DurationValue.fraction("q..") // => [7, 16]
 */
export const fraction = (name: string) => get(name).fraction;

/** @deprecated */
export default { names, shorthands, get, value, fraction };

//// PRIVATE ////

function add(denominator: number, shorthand: string, names: string[]) {
  VALUES.push({
    empty: false,
    dots: "",
    name: "",
    value: 1 / denominator,
    fraction: denominator < 1 ? [1 / denominator, 1] : [1, denominator],
    shorthand,
    names,
  });
}

function calcDots(fraction: Fraction, dots: number): Fraction {
  const pow = Math.pow(2, dots);

  let numerator = fraction[0] * pow;
  let denominator = fraction[1] * pow;
  const base = numerator;

  // add fractions
  for (let i = 0; i < dots; i++) {
    numerator += base / Math.pow(2, i + 1);
  }

  // simplify
  while (numerator % 2 === 0 && denominator % 2 === 0) {
    numerator /= 2;
    denominator /= 2;
  }
  return [numerator, denominator];
}
