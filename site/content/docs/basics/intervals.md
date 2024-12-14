---
title: Intervals
description: Calculate and manipulate intervals
package: interval
---

`Intervals` module allow to do distance calculations between notes using intervals, obtain information and do calculations:

```js
import { Interval } from "tonal";

Interval.distance("C4", "G4"); // => "5P"
Interval.invert("2M"); // => "7m"
Interval.simplify("9M"); // => "2M"
Interval.semitones("4P"); // => 5
Interval.add("4P", "2M"); // => "5P"
```

## Interval properties

### `Interval.get`

`get(name: string) -> Interval`

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

Simplify an interval:

```js
Interval.simplify("9M"); // => "2M"
Interval.simplify("2M"); // => "2M"
Interval.simplify("-2M"); // => "7m"
["8P", "9M", "10M", "11P", "12P", "13M", "14M", "15P"].map(Interval.simplify);
// => [ "8P", "2M", "3M", "4P", "5P", "6M", "7M", "8P" ]
```

### `Interval.invert`

`invert(interval: string) => string`

Get the interval inversion:

```js
Interval.invert("3m"); // => "6M"
Interval.invert("2M"); // => "7m"
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

### `Interval.subtract`

`subtract(min: string, sub: string) => string`

Subtract two intervals:

```js
subtract("5P", "3M"); // => '3m'
subtract("3M", "5P"); // => '-3m'
```
