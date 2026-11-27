# @tonaljs/time ![tonal](https://img.shields.io/badge/@tonaljs-time-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/time.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/time)

> Musical time as exact fractions of quarter notes: positions, durations, meters and bar:beat

`Time` says **where** something is in musical time: positions and durations in quarter notes, meters, bar and beat. It doesn't say **when** it plays yet: there are no seconds and no tempo. They're planned, step by step. Playing and scheduling belong to an audio library.

```js
import { Time } from "tonal";

Time.fromBarBeat("2:3", "4/4"); // => [6, 1]  (beat 3 of bar 2: six quarters in)
Time.duration("q."); // => [3, 2]  (a dotted quarter)
Time.meter("6/8").pulses; // => [[3, 2], [3, 2]]  (felt in two dotted quarters)
Time.onsets([1, 0, 0, 1, 0, 0, 1, 0], [1, 2]); // => [[0, 1], [3, 2], [3, 1]]
```

## Usage

ES6:

```js
import { Time } from "tonal";
```

node:

```js
const { Time } = require("tonal");
```

single module:

```js
import { fromBarBeat, meter } from "@tonaljs/time";
```

## Time values

A time value is a number of **quarter notes**, like music21's quarter lengths, MIDI's ticks per quarter or MusicXML's divisions: a quarter note is 1, a 4/4 bar is 4, a 6/8 bar is 3, a dotted quarter 1.5 and a triplet eighth 1/3.

Every function returns time values as **exact fractions**, `[numerator, denominator]` arrays, reduced and with a positive denominator: a dotted quarter is `[3, 2]`, a triplet eighth `[1, 3]`. Floats can't hold a third exactly, and the error shows up on a chart: 84 triplet eighths add up to `27.999999999999968` quarters, which is bar 7, not bar 8. With fractions they're `[28, 1]`, bar 8.

As input, functions also take numbers and strings:

- an exact number, a multiple of 1/1024: `1.5`, `0.25`, `3`. Numbers that aren't exact (`0.1`, `1 / 3`) aren't valid: write `[1, 3]` or `"1/3"`;
- a string: `"3/2"`, `"1.5"`.

Invalid values give `null` (`""` for strings, `[]` for lists), never an error.

### `Time.fraction`

`fraction(value: TimeValue) => [number, number] | null`

A time value as a reduced fraction:

```js
Time.fraction(1.5); // => [3, 2]
Time.fraction("6/4"); // => [3, 2]
Time.fraction([2, 4]); // => [1, 2]
Time.fraction(1 / 3); // => null
```

### `Time.add`, `Time.sub`, `Time.mul`, `Time.div`

`add(a: TimeValue, b: TimeValue) => [number, number] | null`

Arithmetic on time values. `mul` multiplies a duration by a number of times or by a tuplet ratio; `div` gives how many of one fit in another:

```js
Time.add([1, 3], [1, 6]); // => [1, 2]
Time.add(4, "1/3"); // => [13, 3]
Time.sub(4, [1, 3]); // => [11, 3]
Time.mul([1, 2], [2, 3]); // => [1, 3]  (an eighth in a triplet)
Time.mul([3, 2], 4); // => [6, 1]
Time.div(4, [1, 3]); // => [12, 1]  (twelve triplet eighths in a 4/4 bar)
```

### `Time.compare` and `Time.equal`

`compare(a: TimeValue, b: TimeValue) => number`

`compare` is negative, 0 or positive, so it sorts a list; `equal` compares the values, whatever their form:

```js
Time.compare([1, 3], 0.5); // => -1
[[3, 2], [1, 3], 1].sort(Time.compare); // => [[1, 3], 1, [3, 2]]
Time.equal([2, 4], 0.5); // => true
```

### `Time.toNumber` and `Time.toString`

`toNumber(value: TimeValue) => number | null`

For an app's output, and for display:

```js
Time.toNumber([3, 2]); // => 1.5
Time.toString([3, 2]); // => "3/2"
Time.toString(4); // => "4"
```

Seconds and ticks are the app's job, from the number of quarters: at 120 bpm a quarter lasts 0.5 seconds, so `Time.toNumber(Time.fromBarBeat("2:3", "4/4")) * 60 / 120` is 3 seconds; at 480 ticks per quarter, a triplet eighth is `Time.toNumber([1, 3]) * 480`, 160 ticks.

## Durations

### `Time.duration`

`duration(name: string) => [number, number] | null`

The length of a duration value (a name or shorthand of [`DurationValue`](/packages/duration-value), with dots) in quarter notes. Tuplets are a multiplication:

```js
Time.duration("q."); // => [3, 2]
Time.duration("e"); // => [1, 2]
Time.duration("w"); // => [4, 1]
Time.mul(Time.duration("e"), [2, 3]); // => [1, 3]  (a triplet eighth)
```

## Meters

### `Time.meter`

`meter(timeSignature: string) => { empty, name, bar, beat, pulses }`

A [time signature](/packages/time-signature) in quarter notes: the length of a bar, of a beat and of each pulse.

- The **beat** is the lower note: what `"bar:beat"` counts, as MEI, DAWs and most music software count. A quarter in 4/4, a half note in 2/2, an eighth in 6/8 and in 7/8.
- The **pulses** are the groups the meter is felt in, used to place chords in a bar:
  - simple meters (the lower number is 2 or 4): one per lower note, so 4/4 has four quarters and 2/2 two half notes;
  - compound meters (6/8, 9/8, 12/8, 3/8): a dotted note per three, so 6/8 has two dotted quarters;
  - additive meters: one per group, so 2+2+3/8 has a quarter, a quarter and a dotted quarter;
  - other meters (5/8, 7/8): one per lower note (groupings such as 2+2+3 for 7/8 aren't guessed: write the additive meter).

```js
Time.meter("6/8"); // => { empty: false, name: "6/8", bar: [3, 1], beat: [1, 2], pulses: [[3, 2], [3, 2]] }
Time.meter("2+2+3/8").pulses; // => [[1, 1], [1, 1], [3, 2]]
```

An invalid time signature gives a meter with `empty: true`.

## Bar and beat

Positions are quarters from the start, but people count bars and beats. `"bar:beat"` counts both from 1, with an optional fraction of the beat: `"2:3+1/3"` is a third of the way into beat 3 of bar 2. The beat is the lower note of the meter, whatever its grouping: in 6/8 there are six beats, so the second dotted quarter is `"1:4"`, and 2+2+3/8 counts seven eighths like 7/8. These functions take a time signature or a meter.

### `Time.fromBarBeat`

`fromBarBeat(text: string, timeSignature: string) => [number, number] | null`

```js
Time.fromBarBeat("2:3", "4/4"); // => [6, 1]
Time.fromBarBeat("2:3+1/3", "4/4"); // => [19, 3]
Time.fromBarBeat("1:4", "6/8"); // => [3, 2]  (the second dotted quarter)
```

### `Time.toBarBeat`

`toBarBeat(position: TimeValue, timeSignature: string) => string`

```js
Time.toBarBeat([19, 3], "4/4"); // => "2:3+1/3"
Time.toBarBeat(28, "4/4"); // => "8:1"
```

## Onsets

### `Time.onsets`

`onsets(pattern: number[], step: TimeValue, start?: TimeValue) => [number, number][]`

The positions of the onsets of a [rhythm pattern](/packages/rhythm-pattern) (an array of 0s and 1s), with each step lasting `step` quarter notes, from `start`:

```js
Time.onsets([1, 0, 0, 1, 0, 0, 1, 0], [1, 2]); // => [[0, 1], [3, 2], [3, 1]]
Time.onsets([1, 1, 1], [1, 3], 4); // => [[4, 1], [13, 3], [14, 3]]

// the tresillo in eighth notes, in two bars of 4/4
const bar = Time.meter("4/4").bar;
[0, 1]
  .flatMap((b) => Time.onsets(RhythmPattern.euclid(8, 3), [1, 2], Time.mul(b, bar)))
  .map((position) => Time.toBarBeat(position, "4/4"));
// => ["1:1", "1:2+1/2", "1:4", "2:1", "2:2+1/2", "2:4"]
```
