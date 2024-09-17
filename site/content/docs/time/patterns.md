---
title: Rhythm Patterns
description: Generate and manipulate rhythmic patterns
package: rhythm-pattern
---

A rhythmic pattern is an array of `1` and `0` indicating beats or rests (respectively). They are dimension-less:

```js
import { RhythmPattern } from "tonal";

RhythmPattern.euclid(8, 3); // => [1, 0, 0, 1, 0, 0, 1, 0]
```

## Generate patterns

<a name="binary"></a>

### `binary(numbers) ⇒ number[]`

Create a rhythm pattern from a number or concatenation of numbers in binary form: first the numbers are converted to binary, and the result is concatenated:

```js
RhythmPattern.binary(13); // => [1, 1, 0, 1]
RhythmPattern.binary(12, 13); // => [1, 1, 0, 0, 1, 1, 0, 1]
```

<a name="hex"></a>

### `hex(hexNumber) ⇒ number[]`

Create a rhythmic pattern using an hexadecimal numbers. Same as before, but using hexadecimal numbers:

```js
RhythmPattern.hex("8f"); // => [1, 0, 0, 0, 1, 1, 1, 1]
```

<a name="onsets"></a>

### `onsets(numbers) ⇒ number[]`

Create a rhythm pattern from the onsets. The onsets is the space between beats:

```js
RhythmPattern.onsets(1, 2, 2, 1); // => [1, 0, 1, 0, 0, 1, 0, 0, 1, 0]
```

<a name="random"></a>

### `random(length, probability, rnd) ⇒ number[]`

Create a random rhythm pattern with a specified length

| Param       | Description                                                          |
| ----------- | -------------------------------------------------------------------- |
| length      | length of the pattern                                                |
| probability | Threshold where random number is considered a beat (defaults to 0.5) |
| rnd         | A random function (Math.random by default)                           |

```js
RhythmPattern.random(4); // => [1, 0, 0, 1]
```

<a name="probability"></a>

### `probability(probabilities, rnd) ⇒ number[]`

Create a rhythm pattern based on the given probability thresholds

| Param         | Description                                             |
| ------------- | ------------------------------------------------------- |
| probabilities | An array with the probability of each step to be a beat |
| rnd           | A random function (Math.random by default)              |

```js
RhythmPattern.probability([0.6, 0, 0.2, 0.5]); // => [0, 0, 0, 1]
```

<a name="euclid"></a>

### `euclid(steps, beats) ⇒ number[]`

Generates an euclidean rhythm pattern

| Param | Description               |
| ----- | ------------------------- |
| steps | The length of the pattern |
| beats | The number of beats       |

```ts
RhythmPattern.euclid(8, 3); // => [1, 0, 0, 1, 0, 0, 1, 0]
```

## Manipulate

<a name="rotate"></a>

### `rotate(pattern, rotations) ⇒ number[]`

Rotate a pattern to the right:

| Param     | Description                   |
| --------- | ----------------------------- |
| pattern   | the pattern to rotate         |
| rotations | the number of steps to rotate |

```ts
RhythmPattern.rotate([1, 0, 0, 1], 2); // => [0, 1, 1, 0]
```

## References

- [Godfried Toussaint - The Euclidean Algorithm Generates Traditional Musical Rhythms](http://cgm.cs.mcgill.ca/~godfried/publications/banff.pdf)
- [Godfried Toussaint - A mathematical analysis of African, Brazilian, and Cuban clave rhythms](http://cgm.cs.mcgill.ca/~godfried/publications/bridges.pdf)
- [Comparative Musicology - Musical Rhythm and Mathematics](http://cgm.cs.mcgill.ca/~godfried/rhythm-and-mathematics.html)
