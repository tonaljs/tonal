# @tonaljs/chord-type ![tonal](https://img.shields.io/badge/@tonaljs-chord_type-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/chord-type.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/chord-type)

> A dictionary of musical chords.

```js
import { ChordType } from "tonal";

ChordType.get("major").intervals; // => ["1P", "3M", "5P"]
```

## Usage

ES6:

```js
import { ChordType } from "tonal";
```

node:

```js
const { ChordType } = require("tonal");
```

## API

### `ChordType.get`

`get(name: string) => ChordType`

Given a chord type name, return an object with the following properties:

- empty: true if the chord type is not found
- name: the chord type name
- aliases: a list of alternative names
- quality: Major | Minor | Augmented | Diminished | Unknown
- family: major | minor | dominant | half-diminished | diminished | augmented | suspended | power (see [`ChordType.family`](#chordtypefamily))
- complexity: a number, 0 for triads, 1 for sevenths, more for extended and altered chords (see [`ChordType.complexity`](#chordtypecomplexity))
- setNum: the pcset number
- chroma: the pcset chroma
- normalized: the pcset chroma rotated to start with its first note
- intervals: the interval list

Example:

```js
ChordType.get("major"); // =>
// {
//   empty: false,
//   name: "major",
//   setNum: 2192,
//   chroma: "100010010000",
//   normalized: "100001000100",
//   intervals: ["1P", "3M", "5P"],
//   quality: "Major",
//   family: "major",
//   complexity: 0,
//   aliases: ["M", "^", "", "maj"],
// }
```

The dictionary includes the shorthand often written in charts: `-` for minor, `^` for major seventh, `h` for half-diminished and `o` for diminished, so `-7b6`, `^7#9`, `h9` and `o^7` are listed types.

`ChordType.get` only finds listed types. `Chord.get` also reads a listed type followed by alterations, such as `7(b9,#9)`, `m7b5b9` or `7b5b9` (see [`Chord.get`](https://tonaljs.github.io/tonal/docs/groups/chords#chordget)).

A `b5` lowers the fifth and a `#11` is added above it, so `7b5b9` (C E Gb Bb Db) and `7b9#11` (C E G Bb Db F#) are different chords.

### `ChordType.family`

`family(intervals: string[]) => string`

Classify a chord by its intervals. The family is coarser than `quality` and answers questions like "is this a dominant chord?", for choices that depend on the kind of chord, such as a bass line or a comping pattern. Every chord type has a `family` property computed with this function:

```js
ChordType.get("7b9").family; // => "dominant"
ChordType.get("m7b5").family; // => "half-diminished"
ChordType.get("7sus4").family; // => "suspended"
ChordType.get("5").family; // => "power"
ChordType.family(["1P", "3m", "5P", "7M"]); // => "minor"
```

It looks at the third, then the fifth and the seventh:

| Third | Also                               | Family                    | Examples                  |
| ----- | ---------------------------------- | ------------------------- | ------------------------- |
| major | minor seventh (any fifth)          | `dominant`                | `7`, `13b9`, `7#5`, `7b5` |
| major | augmented fifth                    | `augmented`               | `aug`, `maj7#5`           |
| major | anything else                      | `major`                   | `maj7`, `6`, `add9`       |
| minor | diminished fifth and minor seventh | `half-diminished`         | `m7b5`, `m9b5`            |
| minor | diminished fifth                   | `diminished`              | `dim`, `dim7`, `oM7`      |
| minor | anything else                      | `minor`                   | `m7`, `mMaj7`, `m#5`      |
| none  | a second or a fourth               | `suspended`               | `sus4`, `7sus4`, `11`     |
| none  | minor or major seventh             | `dominant`, `major`       | `7(no3)`, `maj7(no3)`     |
| none  | diminished or augmented fifth      | `diminished`, `augmented` |                           |
| none  | anything else                      | `power`                   | `5`                       |

Some choices to bear in mind:

- `7sus4` and the other suspended dominants are `suspended`, not `dominant`. If you need to know whether a suspended chord also works as a dominant, check for a minor seventh (`7m`).
- `aug7` (`7#5`) is `dominant`, while `aug` and `maj7#5` are `augmented`.
- `oM7` (`dim(maj7)`) is `diminished`.
- The quartal chord (`1P 4P 7m 10m`) is spelled with a minor third (`10m`), so it's `minor`.

The family of an empty chord type is an empty string.

### `ChordType.complexity`

`complexity(intervals: string[]) => number`

How complex a chord type is, to sort long lists of chords from the plainest to the most colourful. Every chord type has a `complexity` property computed with this function:

```js
ChordType.get("m").complexity; // => 0
ChordType.get("m7").complexity; // => 1
ChordType.get("maj9").complexity; // => 2
ChordType.get("7b9#11").complexity; // => 7
ChordType.complexity(["1P", "3M", "5P", "7M", "9M"]); // => 2
```

It's the sum of a weight for each interval:

| Weight | Intervals                                                                     |
| ------ | ----------------------------------------------------------------------------- |
| 0      | root, minor or major third, perfect fifth                                     |
| 0      | the diminished fifth of a diminished or half-diminished chord                 |
| 0      | the augmented fifth of an augmented chord                                     |
| 1      | any seventh                                                                   |
| 1      | a major or perfect second, fourth, sixth, ninth, eleventh or thirteenth       |
| 3      | any other: `b9`, `#9`, `#11`, `b13`, `b6`, and a `b5` or `#5` that's an alteration |

So triads and power chords are 0, sevenths and sixths 1 (`dim7` and `m7b5` too), and each extension adds 1, or 3 if it's altered: `maj7#5` is 1 (an augmented chord with a seventh), but `7#5` is 4 (a dominant with an altered fifth). Sorting by complexity puts the common types first:

```js
ChordType.all()
  .sort((a, b) => a.complexity - b.complexity)
  .map((t) => t.aliases[0])
  .slice(0, 5);
// => ["5", "aug", "M", "m", "dim"]
```

The complexity of an empty chord type is 0.

### `ChordType.names`

`names() => string[]`

List all chord type (long) names in the dictionary

### `ChordType.symbols`

`symbols() => string[]`

List all chord type (long) names in the dictionary

### `ChordType.all`

`all() => object[]`

Return a list of all available chord types.

### `ChordType.add`

`add(intervals: string[], names: string[], fullName?: string) => void`

Add a chord type to dictionary:

```js
ChordType.add(["1P", "3M", "5P"], ["M"], "mayor");
```

### `ChordType.addAlias`

`addAlias(chordType: ChordType, alias: string) => void`

Add an alias to get a chord type from the dictionary. The alias is only used to find it (it's not added to its `aliases`):

```js
ChordType.addAlias(ChordType.get("major"), "dur");
ChordType.get("dur").name; // => "major"
```

### `ChordType.keys`

`keys() => string[]`

List every key that finds a chord type: names, aliases, set numbers and chromas:

```js
ChordType.keys().includes("maj7"); // => true
```

### `ChordType.removeAll`

`removeAll() => void`

Remove every chord type from the dictionary. Other modules that use it (`Chord`, `Scale.scaleChords`...) won't find any chord afterwards.

## How to...

### How to get triad chord names?

```js
ChordType.all()
  .filter((chordType) => chordType.intervals.length === 3)
  .map((chordType) => chordType.name);
```

### How to add a chord type to the dictionary?

```js
ChordType.add(["1P", "3M", "5P"], ["M", "may"], "mayor");
ChordType.get("mayor"); // => { name: 'mayor', quality: "Major", chroma: ... }
ChordType.get("may"); // => { name: 'mayor', quality: "Major", chroma: ... }
```
