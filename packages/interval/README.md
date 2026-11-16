# @tonaljs/interval ![tonal](https://img.shields.io/badge/@tonaljs-interval-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/interval.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/interval)

> A collection of functions to create and manipulate music intervals

`Intervals` module allow to do distance calculations between notes using intervals, obtain information and do calculations:

```js
import { Interval } from "tonal";

Interval.distance("C4", "G4"); // => "5P"
Interval.invert("2M"); // => "7m"
Interval.simplify("9M"); // => "2M"
Interval.semitones("4P"); // => 5
Interval.add("4P", "2M"); // => "5P"
```

## Usage

ES6:

```js
import { Interval } from "tonal";
```

nodejs:

```js
const { Interval } = require("tonal");
```

## Interval properties

### `Interval.get`

`get(name: string) => Interval`

Get properties of an interval:

- name: the interval name (number + quality)
- type: "perfectable" | "majorable"
- dir: direction: 1 | -1
- num: the interval number
- q: quality (...| 'dd' | 'd' | 'm' | 'M' | 'A' | ...)
- alt: the quality number as a number
- oct: the number of octaves it spans
- semitones: the number of semitones it spans
- simple: the simplified number

```js
Interval.get("5P"); // => { name: "5P", num: 5, ...}
```

There are some shorthand functions (`name`, `num`, `semitones`, `quality`):

```js
Interval.name("d4"); // => "4d"
Interval.num("5P"); // => 5
Interval.quality("5P"); // => "P"
Interval.semitones("P4"); // => 5
```

## Collections and conversion

### `Interval.names`

`names() => string[]`

Return a list of (natural) interval names:

```js
Interval.names(); // => ["1P", "2M", "3M", "4P", "5P", "6m", "7m"]
```

### `Interval.fromSemitones`

`fromSemitones(semitones: number) => string`

Given a number of semitones, returns the interval name:

```js
Interval.fromSemitones(7); // => "5P"
Interval.fromSemitones(-7); // => "-5P"

[0, 1, 2, 3, 4].map(Interval.fromSemitones);
```

## Operations

### `Interval.simplify`

`simplify(interval: string) => string`

Simplify an interval: keep its quality and direction, and reduce its number to an octave or less. An octave stays an octave, so only a unison simplifies to a unison:

```js
Interval.simplify("9M"); // => "2M"
Interval.simplify("2M"); // => "2M"
Interval.simplify("-2M"); // => "-2M"
["8P", "9M", "10M", "11P", "12P", "13M", "14M", "15P"].map(Interval.simplify);
// => [ "8P", "2M", "3M", "4P", "5P", "6M", "7M", "8P" ]
```

### `Interval.invert`

`invert(interval: string) => string`

Get the interval inversion: the interval that completes the simplified interval to an octave. A unison and an octave invert to each other, compound intervals are simplified first, and the direction is kept:

```js
Interval.invert("3m"); // => "6M"
Interval.invert("2M"); // => "7m"
Interval.invert("1P"); // => "8P"
Interval.invert("9M"); // => "7m"
Interval.invert("-3M"); // => "-6m"
```

### `Interval.pitchClass`

`pitchClass(interval: string) => string`

Get the pitch class of an interval: the interval within an octave, ascending by letter, that leads to the same pitch class. It ignores octaves and direction, like the distance between two pitch classes:

```js
Interval.pitchClass("10M"); // => "3M"
Interval.pitchClass("-3M"); // => "6m"
Interval.pitchClass("8P"); // => "1P"
```

### `Interval.negate`

`negate(interval: string) => string`

Get the same interval in the opposite direction:

```js
Interval.negate("3M"); // => "-3M"
Interval.negate("-5P"); // => "5P"
```

### `Interval.abs`

`abs(interval: string) => string`

Get the ascending version of an interval:

```js
Interval.abs("-3M"); // => "3M"
Interval.abs("3M"); // => "3M"
```

### `Interval.multiply`

`multiply(interval: string, times: number) => string`

Stack an interval a number of times. A negative number stacks it downwards, and zero gives a unison:

```js
Interval.multiply("5P", 3); // => "13M"
Interval.multiply("2M", 3); // => "4A"
Interval.multiply("3M", -2); // => "-5A"
```

### `Interval.transposeFifths`

`transposeFifths(interval: string, fifths: number) => string`

Add a number of perfect fifths to an interval. The fifths are stacked (the result is not reduced to an octave), and a negative number subtracts them:

```js
Interval.transposeFifths("4P", 1); // => "8P"
[0, 1, 2, 3, 4].map((fifths) => Interval.transposeFifths("1P", fifths)); // => ["1P", "5P", "9M", "13M", "17M"]
[0, -1, -2].map((fifths) => Interval.transposeFifths("1P", fifths)); // => ["1P", "-5P", "-9M"]
```

### `Interval.distance`

`distance(from: string, to: string) => string`

Find the interval between two notes.

```js
Interval.distance("C4", "G4"); // => "5P"
```

### `Interval.add`

`add(a: string, b: string) => string`

Add two intervals:

```js
Interval.add("3m", "5P"); // => "7m"
```

### `Interval.addTo`

`addTo(interval: string) => (other: string) => string`

A curried version of `Interval.add`, handy with arrays:

```js
["1P", "2M", "3M"].map(Interval.addTo("5P")); // => ["5P", "6M", "7M"]
```

### `Interval.subtract`

`subtract(min: string, sub: string) => string`

Subtract two intervals:

```js
Interval.subtract("5P", "3M"); // => "3m"
Interval.subtract("3M", "5P"); // => "-3m"
```

## Consonance

### `Interval.consonance`

`consonance(interval: string, options?: { consonantFourth?: boolean }) => "perfect" | "imperfect" | "dissonant" | ""`

Classify an interval as a perfect consonance, an imperfect consonance or a dissonance:

| Consonance | Intervals |
| --- | --- |
| `"perfect"` | unison, fifth and octave (`1P 5P 8P`) |
| `"imperfect"` | major and minor thirds and sixths (`3m 3M 6m 6M`) |
| `"dissonant"` | seconds, sevenths, the perfect fourth, and every augmented or diminished interval |

```js
Interval.consonance("5P"); // => "perfect"
Interval.consonance("6m"); // => "imperfect"
Interval.consonance("7m"); // => "dissonant"
Interval.consonance("blah"); // => ""
```

Direction and octaves don't change the consonance:

```js
Interval.consonance("-5P"); // => "perfect"
Interval.consonance("10m"); // => "imperfect"
Interval.consonance("-9M"); // => "dissonant"
```

The spelling decides, not the sound. A diminished fourth sounds like a major third, and an augmented fifth like a minor sixth, but they're dissonances:

```js
Interval.consonance("4d"); // => "dissonant"
Interval.consonance("3M"); // => "imperfect"
Interval.consonance("5A"); // => "dissonant"
```

The perfect fourth is a dissonance by default, as it is against the bass in common practice harmony. Pass `consonantFourth: true` to count it as a perfect consonance, as between upper voices or in early counterpoint:

```js
Interval.consonance("4P"); // => "dissonant"
Interval.consonance("4P", { consonantFourth: true }); // => "perfect"
Interval.consonance("4A", { consonantFourth: true }); // => "dissonant"
```

### `Interval.isConsonant`

`isConsonant(interval: string, options?: { consonantFourth?: boolean }) => boolean`

Is the interval a perfect or imperfect consonance? It takes the same options as `Interval.consonance`, and invalid intervals are `false`:

```js
Interval.isConsonant("6M"); // => true
Interval.isConsonant("-12P"); // => true
Interval.isConsonant("2M"); // => false
Interval.isConsonant("4P"); // => false
Interval.isConsonant("4P", { consonantFourth: true }); // => true
```
