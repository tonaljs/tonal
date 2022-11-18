# @tonaljs/interval ![tonal](https://img.shields.io/badge/@tonaljs-interval-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/interval.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/interval)

> A collection of functions to create and manipulate music intervals

## Usage

ES6:

```js
import { Interval } from "tonal";
```

nodejs:

```js
const { Interval } = require("tonal");
```

## API

#### `Interval.get(name: string)`

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

#### `distance(from: string, to: string) => string`

Find the interval between two notes.

```js
Interval.distance("C4", "G4"); // => "5P"
```

#### `names() => string[]`

Return a list of (natural) interval names:

```js
Interval.names(); // => ["1P", "2M", "3M", "4P", "5P", "6m", "7m"]
```

#### `fromSemitones(semitones: number) => string`

Given a number of semitones, returns the interval name:

```js
Interval.fromSemitones(7); // => "5P"
Interval.fromSemitones(-7); // => "-5P"

[0, 1, 2, 3, 4].map(Interval.fromSemitones);
```

#### `simplify(interval: string) => string`

Simplify an interval:

```js
Interval.simplify("9M"); // => "2M"
Interval.simplify("2M"); // => "2M"
Interval.simplify("-2M"); // => "7m"
["8P", "9M", "10M", "11P", "12P", "13M", "14M", "15P"].map(Interval.simplify);
// => [ "8P", "2M", "3M", "4P", "5P", "6M", "7M", "8P" ]
```

#### `invert(interval: string) => string`

Get the interval inversion:

```js
Interval.invert("3m"); // => "6M"
Interval.invert("2M"); // => "7m"
```

#### `add(a: string, b: string) => string`

Add two intervals:

```js
Interval.add("3m", "5P"); // => "7m"
```

#### `substract(min: string, sub: string) => string`

Substract two intervals:

```js
substract("5P", "3M"); // => '3m'
substract("3M", "5P"); // => '-3m'
```
