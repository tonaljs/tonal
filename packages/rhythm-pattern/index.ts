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
  if (!numbers.every((n) => Number.isInteger(n) && n >= 0)) return [];
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
  if (typeof hexNumber !== "string") return [];
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
 * @deprecated The numbers are gaps, not onsets: use
 * `RhythmPattern.fromDurations` with each number + 1 (`onsets(1, 2)` is
 * `fromDurations([2, 3])`). Removed in tonal 7.
 * @example
 * RhythmPattern.onsets(1, 2, 2, 1) // => [1, 0, 1, 0, 0, 1, 0, 0, 1, 0]
 */
export function onsets(...numbers: number[]): RhythmPattern {
  console.warn(
    "RhythmPattern.onsets is deprecated. Use RhythmPattern.fromDurations with each number + 1.",
  );
  return numbers.reduce((pattern, number) => {
    pattern.push(1);
    for (let i = 0; i < number; i++) {
      pattern.push(0);
    }
    return pattern;
  }, [] as RhythmPattern);
}

const isCount = (n: unknown): n is number =>
  typeof n === "number" && Number.isInteger(n) && n >= 0;

// An array of 0s and 1s
const isPattern = (pattern: unknown): pattern is RhythmPattern =>
  Array.isArray(pattern) && pattern.every((x) => x === 0 || x === 1);

/**
 * Create a rhythm pattern from durations: each duration is an onset (a 1)
 * followed by rests, so a duration of n takes n steps. A duration of 0 adds
 * nothing. It returns `[]` if a duration is negative or not an integer.
 *
 * Sources: proposed in tonaljs/tonal#483, which found that `onsets` takes
 * gaps; durations as inter-onset intervals, as Godfried T. Toussaint writes
 * them in *The Geometry of Musical Rhythm* (2013), ch. 7 (the clave son is
 * [3-3-4-2-4]).
 * @param durations the number of steps from each onset to the next
 * @returns an array of 0s and 1s
 * @example
 * RhythmPattern.fromDurations([3, 3, 2]) // => [1, 0, 0, 1, 0, 0, 1, 0]
 * RhythmPattern.fromDurations([1, 2, 2, 1]) // => [1, 1, 0, 1, 0, 1]
 */
export function fromDurations(durations: number[]): RhythmPattern {
  if (!Array.isArray(durations) || !durations.every(isCount)) return [];
  const pattern: RhythmPattern = [];
  for (const duration of durations) {
    for (let i = 0; i < duration; i++) pattern.push(i === 0 ? 1 : 0);
  }
  return pattern;
}

/**
 * Create a rhythm pattern from the positions of its onsets, counted from 0.
 * The length defaults to the last position + 1; positions at or past the
 * length are left out. It returns `[]` if a position or the length is
 * negative or not an integer.
 *
 * Sources: proposed in tonaljs/tonal#483. Positions count from 0, like every
 * index in tonal (the issue counted from 1).
 * @param positions the steps that have an onset (0 is the first step)
 * @param length the length of the pattern (optional)
 * @returns an array of 0s and 1s
 * @example
 * RhythmPattern.fromOnsets([0, 3, 6], 8) // => [1, 0, 0, 1, 0, 0, 1, 0]
 * RhythmPattern.fromOnsets([0, 2, 5, 8]) // => [1, 0, 1, 0, 0, 1, 0, 0, 1]
 */
export function fromOnsets(
  positions: number[],
  length?: number,
): RhythmPattern {
  if (!Array.isArray(positions) || !positions.every(isCount)) return [];
  if (length !== undefined && !isCount(length)) return [];
  const size = length ?? (positions.length ? Math.max(...positions) + 1 : 0);
  const pattern: RhythmPattern = Array(size).fill(0);
  for (const position of positions) {
    if (position < size) pattern[position] = 1;
  }
  return pattern;
}

/**
 * Get the positions of the onsets of a rhythm pattern, counted from 0. It
 * returns `[]` if the pattern isn't an array of 0s and 1s.
 *
 * Sources: the inverse of `fromOnsets` (tonaljs/tonal#483).
 * @param pattern an array of 0s and 1s
 * @returns the steps that have an onset
 * @example
 * RhythmPattern.toOnsets([1, 0, 0, 1, 0, 0, 1, 0]) // => [0, 3, 6]
 */
export function toOnsets(pattern: number[]): number[] {
  if (!isPattern(pattern)) return [];
  const positions: number[] = [];
  pattern.forEach((step, i) => {
    if (step === 1) positions.push(i);
  });
  return positions;
}

/**
 * Get the durations of a rhythm pattern: the number of steps from each onset
 * to the next. The pattern is a loop, so the last onset lasts until the first
 * one comes round again (rests before the first onset count there). It
 * returns `[]` if the pattern has no onsets or isn't an array of 0s and 1s.
 *
 * Sources: the inverse of `fromDurations` (tonaljs/tonal#483). Reading the
 * pattern as a loop follows Toussaint's cyclic rhythms (*The Geometry of
 * Musical Rhythm*, 2013, ch. 7).
 * @param pattern an array of 0s and 1s
 * @returns the duration of each onset, in steps
 * @example
 * RhythmPattern.toDurations([1, 0, 0, 1, 0, 0, 1, 0]) // => [3, 3, 2]
 * RhythmPattern.toDurations([0, 1, 0, 1]) // => [2, 2]
 */
export function toDurations(pattern: number[]): number[] {
  const positions = toOnsets(pattern);
  if (positions.length === 0) return [];
  const n = pattern.length;
  return positions.map(
    (p, i) =>
      (i < positions.length - 1 ? positions[i + 1] : positions[0] + n) - p,
  );
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
  if (!Array.isArray(probabilities)) return [];
  if (typeof rnd !== "function") rnd = Math.random;
  return probabilities.map((probability) => (rnd() <= probability ? 1 : 0));
}

/**
 * Rotate a pattern to the right (a negative number rotates to the left). It
 * returns a new pattern of the same type, so it rotates any array of numbers
 * (probabilities or accents too), or `[]` if it isn't an array.
 * @param pattern the pattern to rotate
 * @param rotations the number of steps to rotate
 * @returns the rotated pattern (an array of 0s and 1s)
 * @example
 * RhythmPattern.rotate([1, 0, 0, 1], 2) // => [0, 1, 1, 0]
 * RhythmPattern.rotate([1, 0, 0, 1], -1) // => [0, 0, 1, 1]
 */
export function rotate<T extends number>(pattern: T[], rotations: number): T[] {
  if (!Array.isArray(pattern)) return [];
  if (!Number.isInteger(rotations)) rotations = 0;
  const len = pattern.length;
  const rotated: T[] = [];
  for (let i = 0; i < len; i++) {
    const pos = (((i - rotations) % len) + len) % len;
    rotated[i] = pattern[pos];
  }
  return rotated;
}

/**
 * Create a Euclidean rhythm pattern: the given number of beats spread as
 * evenly as possible over the steps (a maximally even pattern). Note the
 * order: steps first, then beats, the opposite of Toussaint's E(beats,
 * steps) and of many live-coding tools. The result can be a rotation of the
 * pattern those give: the onsets are the same distances apart.
 *
 * Sources: Godfried T. Toussaint, "The Euclidean Algorithm Generates
 * Traditional Musical Rhythms" (2005), and *The Geometry of Musical Rhythm*
 * (2013), ch. 19. tonal spreads the beats with a floor formula instead of
 * Bjorklund's algorithm, which gives the same pattern up to rotation.
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

// The shortest distance between two steps of a cycle of n steps
const geodesic = (a: number, b: number, n: number) => {
  const d = Math.abs(a - b) % n;
  return Math.min(d, n - d);
};

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/**
 * Get the complement of a rhythm pattern: the rhythm of its rests (every 0
 * becomes 1 and every 1 becomes 0). It returns `[]` if the pattern isn't an
 * array of 0s and 1s.
 *
 * Sources: Godfried T. Toussaint, *The Geometry of Musical Rhythm* (2013),
 * ch. 23, "Complementary Rhythms".
 * @param pattern an array of 0s and 1s
 * @returns the complementary pattern
 * @example
 * RhythmPattern.complement([1, 0, 0, 1, 0, 0, 1, 0]) // => [0, 1, 1, 0, 1, 1, 0, 1]
 */
export function complement(pattern: number[]): RhythmPattern {
  if (!isPattern(pattern)) return [];
  return pattern.map((step) => (step === 1 ? 0 : 1));
}

/**
 * Get the necklace of a rhythm pattern: the rotation that is the largest
 * when read as a binary number, so it starts with an onset. All the
 * rotations of a pattern have the same necklace, so two rhythms are
 * rotations of each other when their necklaces are equal. It returns `[]` if
 * the pattern isn't an array of 0s and 1s.
 *
 * Sources: Godfried T. Toussaint, *The Geometry of Musical Rhythm* (2013),
 * ch. 14, "Necklaces and Bracelets": a necklace is a rhythm up to rotation.
 * Which rotation stands for it (the largest binary number) is tonal's
 * choice.
 * @param pattern an array of 0s and 1s
 * @returns the rotation that represents all of them
 * @example
 * RhythmPattern.necklace([0, 1, 0, 0, 1, 0, 0, 1]) // => [1, 0, 1, 0, 0, 1, 0, 0]
 */
export function necklace(pattern: number[]): RhythmPattern {
  if (!isPattern(pattern)) return [];
  let best: RhythmPattern = [...pattern];
  let bestKey = best.join("");
  for (let r = 1; r < pattern.length; r++) {
    const rotation = rotate(pattern, -r);
    const key = rotation.join("");
    if (key > bestKey) {
      best = rotation;
      bestKey = key;
    }
  }
  return best;
}

/**
 * Get the interval vector of a rhythm pattern: how many pairs of onsets are
 * at each distance, from 1 to half the length. The distance between two
 * onsets is the shortest way round the loop (in a cycle of 16 steps, the
 * onsets at 0 and 10 are 6 steps apart). It returns `[]` if the pattern isn't
 * an array of 0s and 1s.
 *
 * Sources: Godfried T. Toussaint, *The Geometry of Musical Rhythm* (2013),
 * ch. 8, "The Distance Geometry of Rhythm" (the full interval content);
 * David Lewin, *Generalized Musical Intervals and Transformations* (1987).
 * @param pattern an array of 0s and 1s
 * @returns the number of pairs of onsets at each distance (index 0 is distance 1)
 * @example
 * RhythmPattern.intervalVector(RhythmPattern.fromDurations([3, 3, 4, 2, 4])) // => [0, 1, 2, 2, 0, 3, 2, 0]
 */
export function intervalVector(pattern: number[]): number[] {
  if (!isPattern(pattern)) return [];
  const n = pattern.length;
  const positions = toOnsets(pattern);
  const vector: number[] = Array(Math.floor(n / 2)).fill(0);
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      vector[geodesic(positions[i], positions[j], n) - 1]++;
    }
  }
  return vector;
}

/**
 * Test whether a rhythm pattern is maximally even: its onsets are spread over
 * the loop as evenly as the steps allow. Every pair of onsets that are the
 * same number of onsets apart is the same number of steps apart, or one step
 * more. Patterns with fewer than two onsets are maximally even.
 * `RhythmPattern.euclid` always gives one. It returns `false` if the pattern
 * is empty or isn't an array of 0s and 1s.
 *
 * Sources: John Clough and Jack Douthett, "Maximally Even Sets", *Journal of
 * Music Theory* 35 (1991); Godfried T. Toussaint, *The Geometry of Musical
 * Rhythm* (2013), ch. 18. The diatonic scale is maximally even, like the
 * tresillo.
 * @param pattern an array of 0s and 1s
 * @returns true if the onsets are spread as evenly as possible
 * @example
 * RhythmPattern.isMaximallyEven([1, 0, 0, 1, 0, 0, 1, 0]) // => true
 * RhythmPattern.isMaximallyEven([1, 1, 0, 1, 0, 0, 0, 0]) // => false
 */
export function isMaximallyEven(pattern: number[]): boolean {
  if (!isPattern(pattern) || pattern.length === 0) return false;
  const n = pattern.length;
  const positions = toOnsets(pattern);
  const k = positions.length;
  for (let span = 1; span < k; span++) {
    const sizes = positions.map(
      (p, i) => (positions[(i + span) % k] - p + n) % n,
    );
    if (Math.max(...sizes) - Math.min(...sizes) > 1) return false;
  }
  return true;
}

// The sum of the straight-line distances between every pair of onsets, with
// the steps on a circle of radius 1/2
const chordSum = (positions: number[], n: number) => {
  let sum = 0;
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      sum += Math.sin((Math.PI * (positions[j] - positions[i])) / n);
    }
  }
  return sum;
};

/**
 * Get how evenly the onsets of a rhythm pattern are spread over the loop, at
 * most 1: the sum of the straight-line distances between every pair of
 * onsets, with the steps drawn on a circle, divided by the same sum for a
 * maximally even pattern with as many onsets. It's 1 for a maximally even
 * pattern (and for one with fewer than two onsets), and lower the more the
 * onsets bunch together. It returns `null` if the pattern is empty or isn't
 * an array of 0s and 1s.
 *
 * Sources: Godfried T. Toussaint, *The Geometry of Musical Rhythm* (2013),
 * ch. 18: the distances along the circle can't tell even rhythms from uneven
 * ones, the straight-line distances can (László Fejes Tóth, 1956). Dividing
 * by the sum of a maximally even pattern, so the scale ends at 1, is tonal's
 * choice.
 * @param pattern an array of 0s and 1s
 * @returns the evenness (at most 1), or null
 * @example
 * RhythmPattern.evenness(RhythmPattern.fromDurations([3, 3, 4, 3, 3])) // => 1
 * RhythmPattern.evenness(RhythmPattern.fromDurations([3, 3, 4, 2, 4])) // => 0.9972137053736072
 */
export function evenness(pattern: number[]): number | null {
  if (!isPattern(pattern) || pattern.length === 0) return null;
  const n = pattern.length;
  const positions = toOnsets(pattern);
  if (isMaximallyEven(pattern)) return 1;
  return (
    chordSum(positions, n) / chordSum(toOnsets(euclid(n, positions.length)), n)
  );
}

/**
 * Test whether a rhythm pattern is deep: each distance between two onsets
 * (from `RhythmPattern.intervalVector`) occurs a different number of times.
 * Distances that don't occur aren't counted. It returns `false` if the
 * pattern has fewer than two onsets or isn't an array of 0s and 1s.
 *
 * Sources: Terry Winograd's deep scales (1966), via Godfried T. Toussaint,
 * *The Geometry of Musical Rhythm* (2013), ch. 25, "Deep Rhythms". The diatonic
 * scale is deep; of the six timelines of the book, the shiko and the
 * bossa-nova are.
 * @param pattern an array of 0s and 1s
 * @returns true if every distance occurs a different number of times
 * @example
 * RhythmPattern.isDeep([1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1]) // => true
 * RhythmPattern.isDeep(RhythmPattern.fromDurations([3, 3, 4, 2, 4])) // => false
 */
export function isDeep(pattern: number[]): boolean {
  const counts = intervalVector(pattern).filter((count) => count > 0);
  return counts.length > 0 && new Set(counts).size === counts.length;
}

/**
 * Test whether a rhythm pattern has rhythmic oddity: no two of its onsets are
 * opposite each other on the loop, so none splits it into two equal halves.
 * A pattern with an odd number of steps always has it. It returns `false` if
 * the pattern is empty or isn't an array of 0s and 1s.
 *
 * Sources: Simha Arom's rhythmic oddity, from his study of the Aka Pygmies'
 * music, via Godfried T. Toussaint, *The Geometry of Musical Rhythm* (2013),
 * ch. 15, "Rhythmic Oddity".
 * @param pattern an array of 0s and 1s
 * @returns true if no two onsets are opposite each other
 * @example
 * RhythmPattern.hasOddity(RhythmPattern.fromDurations([3, 3, 4, 2, 4])) // => true
 * RhythmPattern.hasOddity(RhythmPattern.fromDurations([4, 2, 4, 2, 4])) // => false
 */
export function hasOddity(pattern: number[]): boolean {
  if (!isPattern(pattern) || pattern.length === 0) return false;
  const n = pattern.length;
  if (n % 2 === 1) return true;
  return toOnsets(pattern).every((p) => pattern[(p + n / 2) % n] === 0);
}

/**
 * Get how far a rhythm pattern is from losing its rhythmic oddity: for each
 * onset, the number of steps to the nearest step opposite an onset, added
 * up. Higher is odder; a pattern with two opposite onsets can still score
 * above 0. It returns `null` if the length is odd (no step is opposite
 * another), or if the pattern is empty or isn't an array of 0s and 1s.
 *
 * Sources: Godfried T. Toussaint, *The Geometry of Musical Rhythm* (2013),
 * ch. 37: of the six timelines of the book, the clave son scores the highest
 * (7). The book only scores even lengths; `null` for odd ones is tonal's
 * choice.
 * @param pattern an array of 0s and 1s
 * @returns the oddity score, or null
 * @example
 * RhythmPattern.oddity(RhythmPattern.fromDurations([3, 3, 4, 2, 4])) // => 7
 * RhythmPattern.oddity(RhythmPattern.fromDurations([3, 3, 4, 4, 2])) // => 4
 */
export function oddity(pattern: number[]): number | null {
  if (!isPattern(pattern) || pattern.length === 0) return null;
  const n = pattern.length;
  if (n % 2 === 1) return null;
  const positions = toOnsets(pattern);
  const opposite = positions.map((p) => (p + n / 2) % n);
  return positions.reduce(
    (sum, p) => sum + Math.min(...opposite.map((o) => geodesic(p, o, n))),
    0,
  );
}

/**
 * Get the off-beatness of a rhythm pattern: the number of onsets on steps
 * that no regular subdivision of the loop reaches, other than every step
 * (the steps that share no divisor with the length: the odd steps of a loop
 * of 16, steps 1, 5, 7 and 11 of a loop of 12). It returns `null` if the
 * pattern is empty or isn't an array of 0s and 1s.
 *
 * Sources: Godfried T. Toussaint, *The Geometry of Musical Rhythm* (2013),
 * ch. 16, "Off-Beat Rhythms".
 * @param pattern an array of 0s and 1s
 * @returns the number of onsets off every beat, or null
 * @example
 * RhythmPattern.offbeatness(RhythmPattern.fromDurations([3, 3, 4, 2, 4])) // => 1
 * RhythmPattern.offbeatness([1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1]) // => 3
 */
export function offbeatness(pattern: number[]): number | null {
  if (!isPattern(pattern) || pattern.length === 0) return null;
  const n = pattern.length;
  return toOnsets(pattern).filter((p) => p > 0 && gcd(p, n) === 1).length;
}

/** How `RhythmPattern.distance` compares two patterns. */
export type RhythmDistanceMetric = "hamming" | "swap";

/**
 * Get the distance between two rhythm patterns of the same length:
 * - `"hamming"` (the default): the number of steps where they differ.
 * - `"swap"`: the number of swaps of a step with the next one that turn one
 *   into the other, which is how far each onset moves (the first onset of
 *   one goes to the first of the other, and so on). Both need the same
 *   number of onsets.
 *
 * It returns `null` if the lengths (or, for `"swap"`, the numbers of onsets)
 * differ, if the metric is unknown, or if a pattern isn't an array of 0s and
 * 1s. Both distances compare the patterns as written, so a rhythm and its
 * rotation can be far apart: compare their `necklace`s for that.
 *
 * Sources: Godfried T. Toussaint, *The Geometry of Musical Rhythm* (2013),
 * ch. 33, "Rhythmic Similarity and Dissimilarity", where the swap distance
 * moves along the pattern (not round the loop), as here.
 * @param a an array of 0s and 1s
 * @param b an array of 0s and 1s
 * @param metric "hamming" (default) or "swap"
 * @returns the distance, or null
 * @example
 * RhythmPattern.distance(RhythmPattern.fromDurations([4, 2, 4, 2, 4]), RhythmPattern.fromDurations([3, 3, 4, 4, 2]), "swap") // => 3
 * RhythmPattern.distance([1, 0, 1, 0], [1, 1, 0, 0]) // => 2
 */
export function distance(
  a: number[],
  b: number[],
  metric: RhythmDistanceMetric = "hamming",
): number | null {
  if (!isPattern(a) || !isPattern(b) || a.length !== b.length) return null;
  if (metric === "hamming") {
    return a.reduce((sum: number, step, i) => sum + (step === b[i] ? 0 : 1), 0);
  }
  if (metric === "swap") {
    const from = toOnsets(a);
    const to = toOnsets(b);
    if (from.length !== to.length) return null;
    return from.reduce((sum, p, i) => sum + Math.abs(p - to[i]), 0);
  }
  return null;
}
