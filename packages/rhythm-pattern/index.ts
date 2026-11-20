type RhythmPatternValue = 0 | 1;

export type RhythmPattern = Array<RhythmPatternValue>;

/**
 * Create a rhythm pattern (an array of 0s and 1s) from the binary digits of
 * one or more numbers, concatenated.
 * @param numbers one or more number
 * @returns an array of 0s and 1s representing the rhythm pattern
 * @example
 * RhythmPattern.binary(13) // => [1, 1, 0, 1]
 * RhythmPattern.binary(12, 13) // => [1, 1, 0, 0, 1, 1, 0, 1]
 */
export function binary(...numbers: number[]): RhythmPattern {
  return numbers.reduce((pattern, number) => {
    number
      .toString(2)
      .split("")
      .forEach((digit: string) => {
        pattern.push(parseInt(digit) as RhythmPatternValue);
      });
    return pattern;
  }, [] as RhythmPattern);
}

/**
 * Create a rhythm pattern from a hexadecimal string: each digit gives four
 * steps (non-hex digits give four 0s).
 * @param hexNumber string with the hexadecimal number
 * @returns an array of 0s and 1s representing the rhythm pattern
 * @example
 * RhythmPattern.hex("8f"); // => [1, 0, 0, 0, 1, 1, 1, 1]
 */
export function hex(hexNumber: string): RhythmPattern {
  const pattern: RhythmPattern = [];
  for (let i = 0; i < hexNumber.length; i++) {
    const digit = parseInt("0x" + hexNumber[i]);
    const binary = isNaN(digit) ? "0000" : digit.toString(2).padStart(4, "0");
    binary.split("").forEach((digit: string) => {
      pattern.push(digit === "1" ? 1 : 0);
    });
  }
  return pattern;
}

/**
 * Create a rhythm pattern from the gaps between onsets: each number is how
 * many 0s follow a 1.
 * @param numbers the onsets sizes
 * @returns an array of 0s and 1s representing the rhythm pattern
 * @example
 * RhythmPattern.onsets(1, 2, 2, 1) // => [1, 0, 1, 0, 0, 1, 0, 0, 1, 0]
 */
export function onsets(...numbers: number[]): RhythmPattern {
  return numbers.reduce((pattern, number) => {
    pattern.push(1);
    for (let i = 0; i < number; i++) {
      pattern.push(0);
    }
    return pattern;
  }, [] as RhythmPattern);
}

/**
 * Create a random rhythm pattern of the given length: each step is 1 when
 * `rnd()` is at least `probability`. Pass `rnd` to make it deterministic.
 * @param length length of the pattern
 * @param probability Threshold where random number is considered a beat (defaults to 0.5)
 * @param rnd A random function (Math.random by default)
 * @returns an array of 0s and 1s representing the rhythm pattern
 * @example
 * RhythmPattern.random(4, 0.5, () => 0.7) // => [1, 1, 1, 1]
 */
export function random(
  length: number,
  probability = 0.5,
  rnd: () => number = Math.random,
): RhythmPattern {
  const pattern: RhythmPattern = [];
  for (let i = 0; i < length; i++) {
    pattern.push(rnd() >= probability ? 1 : 0);
  }
  return pattern;
}

/**
 * Create a rhythm pattern with one step per probability: a step is 1 when
 * `rnd()` is at most its probability. Pass `rnd` to make it deterministic.
 * @param probabilities An array with the probability of each step to be a beat
 * @param rnd A random function (Math.random by default)
 * @returns an array of 0s and 1s representing the rhythm pattern
 * @example
 * RhythmPattern.probability([0.6, 0, 0.2, 0.5], () => 0.5) // => [1, 0, 0, 1]
 */
export function probability(
  probabilities: number[],
  rnd: () => number = Math.random,
): RhythmPattern {
  return probabilities.map((probability) => (rnd() <= probability ? 1 : 0));
}

/**
 * Rotate a pattern to the right (a negative number rotates to the left). It
 * returns a new pattern.
 * @param pattern the pattern to rotate
 * @param rotations the number of steps to rotate
 * @returns the rotated pattern (an array of 0s and 1s)
 * @example
 * RhythmPattern.rotate([1, 0, 0, 1], 2) // => [0, 1, 1, 0]
 * RhythmPattern.rotate([1, 0, 0, 1], -1) // => [0, 0, 1, 1]
 */
export function rotate(
  pattern: RhythmPattern,
  rotations: number,
): RhythmPattern {
  const len = pattern.length;
  const rotated: RhythmPattern = [];
  for (let i = 0; i < len; i++) {
    const pos = (((i - rotations) % len) + len) % len;
    rotated[i] = pattern[pos];
  }
  return rotated;
}

/**
 * Create a Euclidean rhythm pattern: the given number of beats spread as
 * evenly as possible over the steps.
 * @param steps The length of the pattern
 * @param beats The number of beats
 * @returns an array with 0s and 1s representing the rhythmic pattern
 * @example
 * RhythmPattern.euclid(8, 3) // => [1, 0, 0, 1, 0, 0, 1, 0]
 */
export function euclid(steps: number, beats: number): RhythmPattern {
  const pattern: RhythmPattern = [];
  let d = -1;

  for (let i = 0; i < steps; i++) {
    const v = Math.floor(i * (beats / steps));
    pattern[i] = beats > 0 && v !== d ? 1 : 0;
    d = v;
  }
  return pattern;
}
