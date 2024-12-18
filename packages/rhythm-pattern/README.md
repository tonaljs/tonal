# @tonaljs/rhythm-pattern ![tonal](https://img.shields.io/badge/@tonaljs-duration_value-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/rhythm-pattern.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/rhythm-pattern)

> Generate and manipulate rhythmic patterns

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

## Functions

<a name="binary"></a>

### binary(numbers) ⇒ number[]

Create a rhythm pattern from a number or concatenation of numbers in binary form

**Returns**: an array of 0s and 1s representing the rhythm pattern

| Param   | Description        |
| ------- | ------------------ |
| numbers | one or more number |

**Example**

```js
binary(13); // => [1, 1, 0, 1]
binary(12, 13); // => [1, 1, 0, 0, 1, 1, 0, 1]
```

<a name="hex"></a>

## hex(hexNumber) ⇒ number[]

Create a rhythmic pattern using an hexadecimal numbers

**Returns**: an array of 0s and 1s representing the rhythm pattern

| Param     | Description                        |
| --------- | ---------------------------------- |
| hexNumber | string with the hexadecimal number |

**Example**

```js
hex("8f"); // => [1, 0, 0, 0, 1, 1, 1, 1]
```

<a name="onsets"></a>

## onsets(numbers) ⇒ number[]

Create a rhythm pattern from the onsets

**Returns**: an array of 0s and 1s representing the rhythm pattern

| Param   | Description      |
| ------- | ---------------- |
| numbers | the onsets sizes |

**Example**

```js
onsets(1, 2, 2, 1); // => [1, 0, 1, 0, 0, 1, 0, 0, 1, 0]
```

<a name="random"></a>

## random(length, probability, rnd) ⇒ number[]

Create a random rhythm pattern with a specified length

**Returns**: an array of 0s and 1s representing the rhythm pattern

| Param       | Description                                                          |
| ----------- | -------------------------------------------------------------------- |
| length      | length of the pattern                                                |
| probability | Threshold where random number is considered a beat (defaults to 0.5) |
| rnd         | A random function (Math.random by default)                           |

**Example**

```js
random(4); // => [1, 0, 0, 1]
```

<a name="probability"></a>

## probability(probabilities, rnd) ⇒ number[]

Create a rhythm pattern based on the given probability thresholds

**Returns**: an array of 0s and 1s representing the rhythm pattern

| Param         | Description                                             |
| ------------- | ------------------------------------------------------- |
| probabilities | An array with the probability of each step to be a beat |
| rnd           | A random function (Math.random by default)              |

**Example**

```js
probability([0.6, 0, 0.2, 0.5]); // => [0, 0, 0, 1]
```

<a name="rotate"></a>

### rotate(pattern, rotations) ⇒ number[]

Rotate a pattern right

**Returns**: the rotated pattern (an array of 0s and 1s)

| Param     | Description                   |
| --------- | ----------------------------- |
| pattern   | the pattern to rotate         |
| rotations | the number of steps to rotate |

**Example**

```ts
rotate([1, 0, 0, 1], 2); // => [0, 1, 1, 0]
```

<a name="euclid"></a>

### euclid(steps, beats) ⇒ number[]

Generates an euclidean rhythm pattern

**Returns**: an array with 0s and 1s representing the rhythmic pattern

| Param | Description               |
| ----- | ------------------------- |
| steps | The length of the pattern |
| beats | The number of beats       |

**Example**

```ts
euclid(8, 3); // => [1, 0, 0, 1, 0, 0, 1, 0]
```

## References

- [Godfried Toussaint - The Euclidean Algorithm Generates Traditional Musical Rhythms](http://cgm.cs.mcgill.ca/~godfried/publications/banff.pdf)
- [Godfried Toussaint - A mathematical analysis of African, Brazilian, and Cuban clave rhythms](http://cgm.cs.mcgill.ca/~godfried/publications/bridges.pdf)
- [Comparative Musicology - Musical Rhythm and Mathematics](http://cgm.cs.mcgill.ca/~godfried/rhythm-and-mathematics.html)
