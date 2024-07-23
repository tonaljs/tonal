type RhythmPatternValue = 0 | 1;

export type RhythmPattern = Array<RhythmPatternValue>;

/**
 * Create a rhythm pattern from a number or concatenation of numbers in binary form
 * @param numbers one or more number
 * @returns an array of 0s and 1s representing the rhythm pattern
 * @example
 * binary(13) // => [1, 1, 0, 1]
 * binary(12, 13) // => [1, 1, 0, 0, 1, 1, 0, 1]
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
 * Create a rhythm pattern from the onsets
 * @param numbers the onsets sizes
 * @returns an array of 0s and 1s representing the rhythm pattern
 * @example
 * onsets(1, 2, 2, 1) // => [1, 0, 1, 0, 0, 1, 0, 0, 1, 0]
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
 * Create a random rhythm pattern with a specified length
 * @param length length of the pattern
 * @param probability Threshold where random number is considered a beat (defaults to 0.5)
 * @param rnd A random function (Math.random by default)
 * @returns an array of 0s and 1s representing the rhythm pattern
 * @example
 * random(4) // => [1, 0, 0, 1]
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
 * Create a rhythm pattern based on the given probability thresholds
 * @param probabilities An array with the probability of each step to be a beat
 * @param rnd A random function (Math.random by default)
 * @returns an array of 0s and 1s representing the rhythm pattern
 * @example
 * probability([0.6, 0, 0.2, 0.5]) // => [0, 0, 0, 1]
 */
export function probability(
  probabilities: number[],
  rnd: () => number = Math.random,
): RhythmPattern {
  return probabilities.map((probability) => (rnd() <= probability ? 1 : 0));
}

/**
 * Rotate a pattern right
 * @param pattern the pattern to rotate
 * @param rotations the number of steps to rotate
 * @returns the rotated pattern (an array of 0s and 1s)
 * @example
 * rotate([1, 0, 0, 1], 2); // => [0, 1, 1, 0]
 *
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
 * Generates an euclidean rhythm pattern
 * @param steps The length of the pattern
 * @param beats The number of beats
 * @returns an array with 0s and 1s representing the rhythmic pattern
 * @example
 * euclid(8, 3); // => [1, 0, 0, 1, 0, 0, 1, 0]
 */
export function euclid(steps: number, beats: number): RhythmPattern {
  const pattern: RhythmPattern = [];
  let d = -1;

  for (let i = 0; i < steps; i++) {
    const v = Math.floor(i * (beats / steps));
    pattern[i] = v !== d ? 1 : 0;
    d = v;
  }
  return pattern;
}
