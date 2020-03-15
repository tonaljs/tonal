import DATA from "./data";

type Fraction = [number, number];

const VALUES: DurationValue[] = [];

DATA.forEach(([denominator, shorthand, names]) =>
  add(denominator, shorthand, names)
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
  names: []
};

export function names(): string[] {
  return VALUES.reduce((names, duration) => {
    duration.names.forEach(name => names.push(name));
    return names;
  }, [] as string[]);
}

export function shorthands(): string[] {
  return VALUES.map(dur => dur.shorthand);
}

const REGEX = /^([^.]+)(\.*)$/;

export function get(name: string): DurationValue {
  const [_, simple, dots] = REGEX.exec(name) || [];
  const base = VALUES.find(
    dur => dur.shorthand === simple || dur.names.includes(simple)
  );
  if (!base) {
    return NoDuration;
  }

  const fraction = calcDots(base.fraction, dots.length);
  const value = fraction[0] / fraction[1];

  return { ...base, name, dots, value, fraction };
}

export const value = (name: string) => get(name).value;
export const fraction = (name: string) => get(name).fraction;

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
    names
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
