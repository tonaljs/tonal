# Chord dictionary

> A dictionary of musical chords.

```js
import { ChordType } from "tonal";

ChordType.get("major").intervals; // => ["1P", "3M", "5P"]
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
- complexity: a number, the notes added to a triad plus two for each chromatic note: 0 for `m`, 1 for `m7`, 4 for `7b9` (see [`ChordType.complexity`](#chordtypecomplexity))
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

`ChordType.get` only finds listed types. `Chord.get` also reads a listed type followed by alterations, such as `7(b9,#9)`, `m7b5b9` or `7b5b9` (see [`Chord.get`](https://tonaljs.github.io/tonal/docs/groups/chords.md#chordget)).

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
ChordType.get("m7b5").complexity; // => 1
ChordType.get("maj9").complexity; // => 2
ChordType.get("dim7").complexity; // => 3
ChordType.get("7b9#11").complexity; // => 7
ChordType.complexity(["1P", "3M", "5P", "7M", "9M"]); // => 2
```

It's the number of notes added to a triad, plus two for each chromatic note:

- **Added notes**: the distinct pitch classes beyond three. A triad adds 0, a seventh chord 1, a ninth chord 2.
- **Chromatic notes**: the notes, as spelled, that don't fit in the major scale that holds most of them. A major scale is seven consecutive notes on the line of fifths (F C G D A E B), so its modes, like the natural minor, count as well.

| Type      | Notes            | Added | Chromatic        | Complexity |
| --------- | ---------------- | ----- | ---------------- | ---------- |
| `m`       | C Eb G           | 0     | 0                | 0          |
| `m7b5`    | C Eb Gb Bb       | 1     | 0                | 1          |
| `13`      | C E G Bb D A     | 3     | 0                | 3          |
| `aug`     | C E G#           | 0     | 1 (G# or C)      | 2          |
| `dim7`    | C Eb Gb Bbb      | 1     | 1                | 3          |
| `7b9`     | C E G Bb Db      | 2     | 1                | 4          |
| `7b9#11`  | C E G Bb Db F#   | 3     | 2                | 7          |

So the triads of a major scale (major, minor, diminished, suspended) are 0 and its seventh chords 1. Chords that need the harmonic or melodic minor (`aug`, `dim7`, `mMaj7`, `7#5`) come after them, and altered dominants last. A chromatic note counts double so that alterations weigh more than extensions: `13` (3) is plainer than `7b9` (4).

The notes are taken as spelled: `Mb5` (C E Gb) has a chromatic note, though C E F# is in G major. But a type spelled with diatonic intervals is diatonic: `m7#5` is written C Eb Ab Bb (`1P 3m 6m 7m`), the notes of Ab major, so it's 1.

Sorting by complexity puts the common types first:

```js
ChordType.all()
  .sort((a, b) => a.complexity - b.complexity)
  .map((t) => t.aliases[0])
  .slice(0, 7);
// => ["5", "sus4", "7no5", "M", "m", "dim", "sus2"]
```

The complexity of an empty chord type is 0.

The measure is tonal's own, built on standard ideas of diatonic theory:

- John Clough and Gerald Myerson, "Variety and Multiplicity in Diatonic Systems", _Journal of Music Theory_ 29 (1985), 249–270: the structure of the diatonic scale, the reference collection the chromatic notes are counted against.
- David Temperley, "The Line of Fifths", _Music Analysis_ 19 (2000): the line of fifths, which tells apart enharmonic spellings (G# and Ab) that the circle of fifths merges.
- Dmitri Tymoczko, _A Geometry of Music_ (Oxford University Press, 2011): the macroharmony, the scale that governs the notes of a passage and that chords are heard against.

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
