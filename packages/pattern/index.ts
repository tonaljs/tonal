/**
 * The name of an arpeggio order. Other strings are accepted (and give `[]`),
 * so a name read at runtime still type-checks.
 */
export type ArpeggioName =
  | "up"
  | "down"
  | "up-down"
  | "down-up"
  | "up-down-repeat"
  | "down-up-repeat"
  | "converge"
  | "diverge"
  | "converge-diverge"
  | "thumb-up"
  | "thumb-up-down"
  | "pinky-up"
  | "pinky-up-down";

const isIndex = (n: unknown): n is number =>
  typeof n === "number" && Number.isInteger(n);

const isCount = (n: unknown): n is number => isIndex(n) && n >= 0;

const isIndexList = (list: unknown): list is number[] =>
  Array.isArray(list) && list.every(isIndex);

// 0 to n - 1
const up = (n: number) => Array.from({ length: n }, (_, i) => i);

const reversed = (list: number[]) => [...list].reverse();

// The order, then back: without repeating the last note, nor the first one
// when the loop starts again (up-down)
const bounce = (list: number[]) =>
  list.length < 2
    ? list
    : [...list.slice(0, -1), ...reversed(list).slice(0, -1)];

// The order, then back, repeating both ends (up-down-repeat)
const bounceRepeat = (list: number[]) => [...list, ...reversed(list)];

// Lowest, highest, second lowest, second highest... towards the middle
const converge = (n: number) =>
  up(n).map((i) => (i % 2 === 0 ? i / 2 : n - 1 - (i - 1) / 2));

// The anchor before each note of the order (thumb)
const before = (anchor: number, list: number[]) =>
  list.flatMap((i) => [anchor, i]);

// The anchor after each note of the order (pinky)
const after = (anchor: number, list: number[]) =>
  list.flatMap((i) => [i, anchor]);

// The notes above the lowest one: 1 to n - 1
const upper = (n: number) => up(n - 1).map((i) => i + 1);

const ARPEGGIOS: Record<ArpeggioName, (n: number) => number[]> = {
  up: (n) => up(n),
  down: (n) => reversed(up(n)),
  "up-down": (n) => bounce(up(n)),
  "down-up": (n) => bounce(reversed(up(n))),
  "up-down-repeat": (n) => bounceRepeat(up(n)),
  "down-up-repeat": (n) => bounceRepeat(reversed(up(n))),
  converge: (n) => converge(n),
  diverge: (n) => reversed(converge(n)),
  "converge-diverge": (n) => bounce(converge(n)),
  "thumb-up": (n) => before(0, upper(n)),
  "thumb-up-down": (n) => before(0, bounce(upper(n))),
  "pinky-up": (n) => after(n - 1, up(n - 1)),
  "pinky-up-down": (n) => after(n - 1, bounce(up(n - 1))),
};

/**
 * Get the names of the arpeggio orders that `Pattern.arpeggio` knows.
 *
 * @returns the arpeggio names
 * @example
 * Pattern.arpeggios() // => ["up", "down", "up-down", "down-up", "up-down-repeat", "down-up-repeat", "converge", "diverge", "converge-diverge", "thumb-up", "thumb-up-down", "pinky-up", "pinky-up-down"]
 */
export function arpeggios(): ArpeggioName[] {
  return Object.keys(ARPEGGIOS) as ArpeggioName[];
}

/**
 * Get an arpeggio order over n notes: the indexes of the notes (0 is the
 * lowest, n - 1 the highest) in the order they're played, once round the
 * loop. The order adapts to the number of notes: `"up"` is 3 notes over a
 * triad, 4 over a seventh chord. Every index is in 0..n - 1.
 *
 * - `"up"`, `"down"`: lowest to highest, highest to lowest.
 * - `"up-down"`, `"down-up"`: there and back, playing each end once, so the
 *   loop doesn't repeat a note (2n - 2 notes). `"up-down-repeat"` and
 *   `"down-up-repeat"` play each end twice (2n notes).
 * - `"converge"`: lowest, highest, second lowest, second highest… towards
 *   the middle. `"diverge"` is converge backwards, so it ends on the lowest
 *   note. `"converge-diverge"` bounces like up-down (2n - 2 notes).
 * - `"thumb-up"`: the lowest note before each of the notes above it, upwards
 *   (2n - 2 notes). `"thumb-up-down"` does the same with the notes above going
 *   up and down (4n - 8 notes).
 * - `"pinky-up"`: the highest note after each of the notes below it, upwards
 *   (2n - 2 notes). `"pinky-up-down"` does the same up and down (4n - 8
 *   notes).
 *
 * Over one note every order is `[0]`. It returns `[]` for 0 notes, an unknown
 * name, or a count that isn't a non-negative integer. For more than n notes
 * (octaves), ask for an order over more notes, or move one with
 * `Pattern.sequence`: see the README.
 *
 * Sources: the common vocabulary of arpeggiators (up, down, up-down,
 * converge, diverge, thumb, pinky). Products define the ends of up-down and
 * the direction of diverge differently; the definitions here are tonal's.
 * @param name the name of the order (see `Pattern.arpeggios`)
 * @param n the number of notes
 * @returns the indexes of the notes, in order
 * @example
 * Pattern.arpeggio("up-down", 4) // => [0, 1, 2, 3, 2, 1]
 * Pattern.arpeggio("converge", 4) // => [0, 3, 1, 2]
 * Pattern.arpeggio("thumb-up", 4) // => [0, 1, 0, 2, 0, 3]
 * Pattern.arpeggio("up-down", 4).map(Chord.steps(["C4", "maj7"])) // => ["C4", "E4", "G4", "B4", "G4", "E4"]
 */
export function arpeggio(
  name: ArpeggioName | (string & {}),
  n: number,
): number[] {
  if (!Object.prototype.hasOwnProperty.call(ARPEGGIOS, name)) return [];
  if (!isCount(n)) return [];
  if (n < 2) return up(n);
  return ARPEGGIOS[name as ArpeggioName](n);
}

/**
 * Move a cell of indexes by a step, again and again: a melodic sequence.
 * Group i is the cell with i × step added to each index, so the cell keeps
 * its shape and moves through the notes it's realised over (a scale moves
 * diatonically). It returns the groups; `.flat()` gives one list.
 *
 * Indexes can be negative or past the last note: `Scale.steps` realises them
 * in the octaves below and above. A negative step moves the cell down. It
 * returns `[]` if the cell is empty or has a non-integer, or if the step
 * isn't an integer or the count isn't a non-negative integer.
 *
 * Sources: Tim Richards, *Exploring Jazz Piano*, vol. 1, Figs 3.12-3.13
 * (groups of three and four notes, and thirds, through a scale) and Figs
 * 5.5-5.10 (the same patterns over a pentatonic); Jerry Coker, *The Teaching
 * of Jazz*, "digital patterns" (1-2-3-5, 1-3-5-3… moved to each chord).
 * @param cell the indexes of the first group (`[0, 1, 2, 4]` is 1-2-3-5)
 * @param step how far each group moves from the one before
 * @param count the number of groups
 * @returns the groups of indexes
 * @example
 * Pattern.sequence([0, 1, 2, 3], 1, 3) // => [[0, 1, 2, 3], [1, 2, 3, 4], [2, 3, 4, 5]]
 * Pattern.sequence([0, 2], 1, 4) // => [[0, 2], [1, 3], [2, 4], [3, 5]]
 * Pattern.sequence([0, 1, 2], 1, 3).flat().map(Scale.steps("C4 major pentatonic")) // => ["C4", "D4", "E4", "D4", "E4", "G4", "E4", "G4", "A4"]
 */
export function sequence(
  cell: number[],
  step: number,
  count: number,
): number[][] {
  if (!isIndexList(cell) || cell.length === 0) return [];
  if (!isIndex(step) || !isCount(count)) return [];
  return Array.from({ length: count }, (_, i) =>
    cell.map((index) => index + i * step),
  );
}

/**
 * Reverse every other group, starting with the second: the first group stays
 * as it is, the second is played backwards, and so on. A sequence of thirds
 * becomes thirds alternately up and down.
 *
 * It returns new groups, or `[]` if the groups aren't arrays of integers.
 *
 * Sources: Tim Richards, *Exploring Jazz Piano*, vol. 1, Fig 5.11
 * (pentatonic "thirds" alternately up and down, "obtained by reversing the
 * direction of every other pair of notes").
 * @param groups the groups of indexes (from `Pattern.sequence`)
 * @returns the groups, every other one reversed
 * @example
 * Pattern.alternate([[0, 2], [1, 3], [2, 4], [3, 5]]) // => [[0, 2], [3, 1], [2, 4], [5, 3]]
 */
export function alternate(groups: number[][]): number[][] {
  if (!Array.isArray(groups) || !groups.every(isIndexList)) return [];
  return groups.map((group, i) => (i % 2 === 0 ? [...group] : reversed(group)));
}

/**
 * Repeat each index a number of times, in place: `[0, 1]` twice is
 * `[0, 0, 1, 1]`. Over an arpeggio, it gives the doubled orders. (To repeat
 * the whole list, use `Pattern.sequence` with a step of 0.)
 *
 * It returns `[]` if the list isn't an array of integers or the times isn't
 * a non-negative integer.
 * @param indexes the indexes
 * @param times how many times each index is played
 * @returns the indexes, each repeated
 * @example
 * Pattern.repeat([0, 1, 2], 2) // => [0, 0, 1, 1, 2, 2]
 * Pattern.repeat(Pattern.arpeggio("down", 3), 2) // => [2, 2, 1, 1, 0, 0]
 */
export function repeat(indexes: number[], times: number): number[] {
  if (!isIndexList(indexes) || !isCount(times)) return [];
  return indexes.flatMap((index) => Array(times).fill(index));
}
