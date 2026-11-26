# @tonaljs/rhythm-pattern ![tonal](https://img.shields.io/badge/@tonaljs-rhythm_pattern-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/rhythm-pattern.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/rhythm-pattern)

> Generate and manipulate rhythmic patterns

A rhythmic pattern is an array of `1` and `0` indicating beats (onsets) or rests (respectively). They are dimension-less: each element is a step, with no duration in time. A pattern is a loop, so the step after the last is the first again:

```js
import { RhythmPattern } from "tonal";

RhythmPattern.euclid(8, 3); // => [1, 0, 0, 1, 0, 0, 1, 0]
RhythmPattern.toDurations([1, 0, 0, 1, 0, 0, 1, 0]); // => [3, 3, 2]
RhythmPattern.isMaximallyEven([1, 0, 0, 1, 0, 0, 1, 0]); // => true
```

## Usage

ES6:

```js
import { RhythmPattern } from "tonal";
```

node:

```js
const { RhythmPattern } = require("tonal");
```

single module:

```js
import { binary, euclid } from "@tonaljs/rhythm-pattern";
```

## Generate patterns

### `RhythmPattern.binary`

`binary(...numbers: number[]) => number[]`

Create a rhythm pattern from a number or concatenation of numbers in binary form: first the numbers are converted to binary, and the result is concatenated:

```js
RhythmPattern.binary(13); // => [1, 1, 0, 1]
RhythmPattern.binary(12, 13); // => [1, 1, 0, 0, 1, 1, 0, 1]
```

### `RhythmPattern.hex`

`hex(hexNumber: string) => number[]`

Create a rhythmic pattern using an hexadecimal numbers. Same as before, but using hexadecimal numbers:

```js
RhythmPattern.hex("8f"); // => [1, 0, 0, 0, 1, 1, 1, 1]
```

### `RhythmPattern.fromDurations`

`fromDurations(durations: number[]) => number[]`

Create a rhythm pattern from durations: each duration is an onset followed by rests, so a duration of n takes n steps. A duration of 0 adds nothing, and a negative or non-integer duration gives `[]`:

```js
RhythmPattern.fromDurations([3, 3, 2]); // => [1, 0, 0, 1, 0, 0, 1, 0]
RhythmPattern.fromDurations([1, 2, 2, 1]); // => [1, 1, 0, 1, 0, 1]
```

### `RhythmPattern.fromOnsets`

`fromOnsets(positions: number[], length?: number) => number[]`

Create a rhythm pattern from the positions of its onsets, counted from 0. The length defaults to the last position + 1 (pass it when the pattern ends with rests); positions at or past the length are left out:

```js
RhythmPattern.fromOnsets([0, 3, 6], 8); // => [1, 0, 0, 1, 0, 0, 1, 0]
RhythmPattern.fromOnsets([0, 2, 5, 8]); // => [1, 0, 1, 0, 0, 1, 0, 0, 1]
```

### `RhythmPattern.onsets`

`onsets(...numbers: number[]) => number[]`

**Deprecated**, removed in tonal 7: the numbers are gaps (how many rests follow each onset), not onsets. Use `fromDurations` with each number + 1, or `fromOnsets` for positions:

```js
RhythmPattern.onsets(1, 2, 2, 1); // => [1, 0, 1, 0, 0, 1, 0, 0, 1, 0]
RhythmPattern.fromDurations([2, 3, 3, 2]); // => [1, 0, 1, 0, 0, 1, 0, 0, 1, 0]
```

### `RhythmPattern.random`

`random(length: number, probability = 0.5, rnd = Math.random) => number[]`

Create a random rhythm pattern with a specified length

| Param       | Description                                                          |
| ----------- | -------------------------------------------------------------------- |
| length      | length of the pattern                                                |
| probability | Threshold where random number is considered a beat (defaults to 0.5) |
| rnd         | A random function (Math.random by default)                           |

```js
RhythmPattern.random(4); // => for example [1, 0, 0, 1]
```

### `RhythmPattern.probability`

`probability(probabilities: number[], rnd = Math.random) => number[]`

Create a rhythm pattern based on the given probability thresholds

| Param         | Description                                             |
| ------------- | ------------------------------------------------------- |
| probabilities | An array with the probability of each step to be a beat |
| rnd           | A random function (Math.random by default)              |

```js
RhythmPattern.probability([0.6, 0, 0.2, 0.5]); // => for example [0, 0, 0, 1]
```

### `RhythmPattern.euclid`

`euclid(steps: number, beats: number) => number[]`

Generates an euclidean rhythm pattern: the beats spread as evenly as possible over the steps (a maximally even pattern).

| Param | Description               |
| ----- | ------------------------- |
| steps | The length of the pattern |
| beats | The number of beats       |

```js
RhythmPattern.euclid(8, 3); // => [1, 0, 0, 1, 0, 0, 1, 0]
```

Note the order: steps first, then beats. Toussaint and many live-coding tools write it the other way, E(beats, steps), so E(3, 8) is `euclid(8, 3)`. The result can be a rotation of theirs, with the onsets the same distances apart.

## Manipulate

### `RhythmPattern.rotate`

`rotate(pattern: number[], rotations: number) => number[]`

Rotate a pattern to the right:

| Param     | Description                   |
| --------- | ----------------------------- |
| pattern   | the pattern to rotate         |
| rotations | the number of steps to rotate |

```js
RhythmPattern.rotate([1, 0, 0, 1], 2); // => [0, 1, 1, 0]
```

### `RhythmPattern.complement`

`complement(pattern: number[]) => number[]`

The rhythm of the rests: every 0 becomes 1 and every 1 becomes 0.

```js
RhythmPattern.complement([1, 0, 0, 1, 0, 0, 1, 0]); // => [0, 1, 1, 0, 1, 1, 0, 1]
```

## Read patterns

### `RhythmPattern.toOnsets`

`toOnsets(pattern: number[]) => number[]`

The positions of the onsets, counted from 0:

```js
RhythmPattern.toOnsets([1, 0, 0, 1, 0, 0, 1, 0]); // => [0, 3, 6]
```

### `RhythmPattern.toDurations`

`toDurations(pattern: number[]) => number[]`

The number of steps from each onset to the next. The pattern is a loop, so the last onset lasts until the first one comes round again, and rests before the first onset count there. For a pattern that starts with an onset, `fromDurations(toDurations(pattern))` is the pattern:

```js
RhythmPattern.toDurations([1, 0, 0, 1, 0, 0, 1, 0]); // => [3, 3, 2]
RhythmPattern.toDurations([0, 1, 0, 1]); // => [2, 2]
```

### `RhythmPattern.necklace`

`necklace(pattern: number[]) => number[]`

The rotation that is the largest when read as a binary number (so it starts with an onset). All the rotations of a pattern have the same necklace, so two rhythms are rotations of each other when their necklaces are equal:

```js
RhythmPattern.necklace([0, 1, 0, 0, 1, 0, 0, 1]); // => [1, 0, 1, 0, 0, 1, 0, 0]
```

### `RhythmPattern.intervalVector`

`intervalVector(pattern: number[]) => number[]`

How many pairs of onsets are at each distance, from 1 to half the length (index 0 is distance 1). The distance between two onsets is the shortest way round the loop. The clave son:

```js
RhythmPattern.intervalVector(RhythmPattern.fromDurations([3, 3, 4, 2, 4])); // => [0, 1, 2, 2, 0, 3, 2, 0]
```

## Measure patterns

Measures from Godfried Toussaint's _The Geometry of Musical Rhythm_, which explain why some rhythms recur across the world's music. The examples use the book's six timelines of 16 steps, written as durations: shiko `[4, 2, 4, 2, 4]`, son `[3, 3, 4, 2, 4]`, rumba `[3, 4, 3, 2, 4]`, soukous `[3, 3, 4, 1, 5]`, gahu `[3, 3, 4, 4, 2]` and bossa-nova `[3, 3, 4, 3, 3]`.

A measure that can't be computed (an empty pattern, or one that isn't an array of 0s and 1s) gives `null`, or `false` for a test.

### `RhythmPattern.isMaximallyEven`

`isMaximallyEven(pattern: number[]) => boolean`

Whether the onsets are spread over the loop as evenly as the steps allow: every pair of onsets that are the same number of onsets apart is the same number of steps apart, or one step more (Clough and Douthett). `euclid` always gives one:

```js
RhythmPattern.isMaximallyEven([1, 0, 0, 1, 0, 0, 1, 0]); // => true
RhythmPattern.isMaximallyEven([1, 1, 0, 1, 0, 0, 0, 0]); // => false
```

### `RhythmPattern.evenness`

`evenness(pattern: number[]) => number | null`

How evenly the onsets are spread, at most 1: the sum of the straight-line distances between every pair of onsets, with the steps drawn on a circle, divided by the same sum for a maximally even pattern with as many onsets. It's 1 for a maximally even pattern, and lower the more the onsets bunch together. The bossa-nova is more even than the son, which is more even than the soukous:

```js
RhythmPattern.evenness(RhythmPattern.fromDurations([3, 3, 4, 3, 3])); // => 1
RhythmPattern.evenness(RhythmPattern.fromDurations([3, 3, 4, 2, 4])); // => 0.9972137053736072
RhythmPattern.evenness(RhythmPattern.fromDurations([3, 3, 4, 1, 5])); // => 0.9794096264000053
```

### `RhythmPattern.isDeep`

`isDeep(pattern: number[]) => boolean`

Whether each distance between two onsets occurs a different number of times (Winograd's deep scales). Distances that don't occur aren't counted. Of the six timelines, only the shiko and the bossa-nova are deep:

```js
RhythmPattern.isDeep(RhythmPattern.fromDurations([4, 2, 4, 2, 4])); // => true
RhythmPattern.isDeep(RhythmPattern.fromDurations([3, 3, 4, 2, 4])); // => false
```

### `RhythmPattern.hasOddity`

`hasOddity(pattern: number[]) => boolean`

Whether the pattern has rhythmic oddity (Arom): no two onsets are opposite each other on the loop, so none splits it into two equal halves. A pattern with an odd number of steps always has it:

```js
RhythmPattern.hasOddity(RhythmPattern.fromDurations([3, 3, 4, 2, 4])); // => true
RhythmPattern.hasOddity(RhythmPattern.fromDurations([4, 2, 4, 2, 4])); // => false
```

### `RhythmPattern.oddity`

`oddity(pattern: number[]) => number | null`

How far the pattern is from losing its rhythmic oddity: for each onset, the number of steps to the nearest step opposite an onset, added up. Higher is odder. `null` for an odd number of steps, where no step is opposite another. Of the six timelines, the son scores the highest:

```js
RhythmPattern.oddity(RhythmPattern.fromDurations([3, 3, 4, 2, 4])); // => 7
RhythmPattern.oddity(RhythmPattern.fromDurations([3, 3, 4, 4, 2])); // => 4
```

### `RhythmPattern.offbeatness`

`offbeatness(pattern: number[]) => number | null`

The number of onsets on steps that no regular subdivision of the loop reaches, other than every step: the steps that share no divisor with the length (the odd steps of a loop of 16; steps 1, 5, 7 and 11 of a loop of 12):

```js
RhythmPattern.offbeatness(RhythmPattern.fromDurations([3, 3, 4, 2, 4])); // => 1
RhythmPattern.offbeatness([1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1]); // => 3
```

### `RhythmPattern.distance`

`distance(a: number[], b: number[], metric?: "hamming" | "swap") => number | null`

The distance between two patterns of the same length. `"hamming"` (the default) counts the steps where they differ. `"swap"` counts the swaps of a step with the next one that turn one into the other: how far each onset moves, the first to the first and so on, so both need the same number of onsets. It's `null` when the lengths or (for `"swap"`) the numbers of onsets differ:

```js
RhythmPattern.distance([1, 0, 1, 0], [1, 1, 0, 0]); // => 2
const shiko = RhythmPattern.fromDurations([4, 2, 4, 2, 4]);
const gahu = RhythmPattern.fromDurations([3, 3, 4, 4, 2]);
RhythmPattern.distance(shiko, gahu, "swap"); // => 3
```

### Scales

A scale is a pattern too: its chroma has 12 steps, one per pitch class. The measures work the same, and the major scale is maximally even and deep:

```js
const major = Scale.get("C major").chroma.split("").map(Number);
RhythmPattern.isMaximallyEven(major); // => true
RhythmPattern.isDeep(major); // => true
RhythmPattern.intervalVector(major); // => [2, 5, 4, 3, 6, 1]
```

## Sources

- Godfried T. Toussaint, _The Geometry of Musical Rhythm_ (CRC Press, 2013): the six timelines (ch. 7), the interval vector (ch. 8), necklaces (ch. 14), rhythmic oddity (ch. 15), off-beatness (ch. 16), evenness and maximally even rhythms (ch. 18), Euclidean rhythms (ch. 19), complementary rhythms (ch. 23), deep rhythms (ch. 25), distances (ch. 33) and the oddity score (ch. 37).
- John Clough and Jack Douthett, "Maximally Even Sets", _Journal of Music Theory_ 35 (1991).

## References

- [Godfried Toussaint - The Euclidean Algorithm Generates Traditional Musical Rhythms](http://cgm.cs.mcgill.ca/~godfried/publications/banff.pdf)
- [Godfried Toussaint - A mathematical analysis of African, Brazilian, and Cuban clave rhythms](http://cgm.cs.mcgill.ca/~godfried/publications/bridges.pdf)
- [Comparative Musicology - Musical Rhythm and Mathematics](http://cgm.cs.mcgill.ca/~godfried/rhythm-and-mathematics.html)
