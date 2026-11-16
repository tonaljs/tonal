# @tonaljs/chord ![tonal](https://img.shields.io/badge/@tonaljs-chord-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/chord.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/chord)

```js
import { Chord } from "tonal";

Chord.get("Cmaj7").notes; // => ["C", "E", "G", "B"]
Chord.chordScales("C7b9"); // => ["phrygian dominant", "flamenco", "spanish heptatonic", "half-whole diminished", "chromatic"]
```

## Usage

ES6:

```js
import { Chord } from "tonal";
```

Nodejs:

```js
const { Chord } = require("tonal");
```

## Chord properties

### `Chord.get`

`get(name: string | [string, string] | [string, string, string]) => Chord`

Given a chord symbol or tokens, it returns the chord properties.

Chord properties is the the same object that `ChordType.get` but with additional fields:

- symbol: the chord symbol (a combination of the tonic, chord type shortname and root, if present). For example: `Cmaj7`, `Db7b5/F`. The symbol always uses pitch classes (note names without octaves) for both the tonic and root.
- tonic: the tonic of the chord (or an empty string if not present)
- bass: the bass of the chord (or an empty string if not present). The bass can be any pitch class.
- root: the root of the chord (or an empty string if not present). The root is present if the bass not belongs to the chord. It could be chords with bass without root field, but not the opposite.
- rootDegree: the degree of the root. NaN if root not present. A number greater than 0 if present, where 1 indicates the tonic, 2 the second note (normally the 3th), 2 the third note (normally the 5th), etc.
- notes: an array of notes, or empty array if tonic is not present. The notes will be always pitch classes.

Example:

```js
Chord.get("Cmaj7/B"); // =>
// {
//   empty: false,
//   name: 'C major seventh over B',
//   setNum: 2193,
//   chroma: '100010010001',
//   normalized: '100010010001',
//   intervals: [ '7M', '8P', '10M', '12P' ],
//   quality: 'Major',
//   aliases: [ 'maj7', 'Δ', 'ma7', 'M7', 'Maj7', '^7' ],
//   symbol: 'Cmaj7/B',
//   tonic: 'C',
//   type: 'major seventh',
//   root: 'B',
//   bass: 'B',
//   rootDegree: 4,
//   notes: [ 'B', 'C', 'E', 'G' ]
// }
```

#### Alterations

A symbol that isn't a listed chord type can be a listed type followed by alterations. The alterations are tokens, written one after another or in parentheses separated by commas or spaces:

```js
Chord.get("Cm7b5b9").notes; // => ["C", "Eb", "Gb", "Bb", "Db"]
Chord.get("C7(b9,#9)").notes; // => ["C", "E", "G", "Bb", "Db", "D#"]
Chord.get("C7(no3)").notes; // => ["C", "G", "Bb"]
Chord.get("Cdim(maj7)").notes; // => ["C", "Eb", "Gb", "B"]
Chord.get("C(add9)").notes; // => ["C", "E", "G", "D"]
```

The tokens are:

- `b5`, `#5` and `+5` replace the fifth.
- `b9`, `#9`, `#11` (or `#4`), `b13` and `b6` add an altered tone, which replaces the natural one: `C13b9` has a b9 and no 9. `b13` and `b6` keep the fifth.
- `add` followed by a tone adds it: `add9` (or `add2`), `add11`, `add4`, `add13`, `add6`, and altered ones such as `addb9`.
- `9`, `11`, `13` and `6` without `add` only inside parentheses: `C7(9,13)`, `Cm7(11)`.
- `no3` and `no5` remove the third or the fifth.
- `maj7` (or `M7`, `^7`, `Δ7`) makes the seventh major: `Cm(maj7)`, `Caug(maj7)`.

Without a type before the tokens, the base is a major triad: `C(add9)`, `C(no3)`.

The result keeps the symbol as written. When its intervals are a listed type, it has that type's name and aliases. Otherwise `type` is empty and `aliases` is an empty list:

```js
Chord.get("Cm(maj7)").type; // => "minor/major seventh"
Chord.get("Cm(maj7)").symbol; // => "Cm(maj7)"
Chord.get("Cm7b5b9").type; // => ""
```

`alt` isn't a token. `7alt` is a listed type with a sharp fifth and a sharp ninth (`7#5#9`). Write the other altered tones to get them: `C7b9#9#11b13`.

#### No chord

`N.C.` (or `NC`) is "no chord", as written in charts. Unlike a symbol that can't be read, it isn't empty, but it has no notes:

```js
Chord.get("N.C."); // => { empty: false, symbol: "N.C.", type: "no chord", notes: [], ... }
Chord.get("Cnonsense").empty; // => true
```

`Chord.chord` is an alias that is handy if using the `@tonaljs/chord` directly:

```js
import { chord } from "@tonaljs/chord";

chord("C6add2");
```

### `Chord.getChord`

`getChord(type: string, tonic?: string, bass?: string) => Chord`

Very similar to `Chord.get`, but with arguments for each chord part:

```js
Chord.getChord("maj7", "C", "B") === Chord.get("Cmaj7/B");
```

### `Chord.tokenize`

`tokenize(name: string) => [string, string, string]`

Split a chord name into its tonic, chord type and bass. It doesn't check that the chord type exists:

```js
Chord.tokenize("Cmaj7"); // => ["C", "maj7", ""]
Chord.tokenize("Eb7b9/G"); // => ["Eb", "7b9", "G"]
Chord.tokenize("mMaj7"); // => ["", "mMaj7", ""]
```

## Chord notes

### `Chord.notes`

`notes(chordType: string, tonic?: string) => string[]`

Print the notes of the given chord at the given tonic:

```js
Chord.notes("maj7", "C4"); // => ["C4", "E4", "G4", "B4"]
```

### `Chord.degrees`

`degrees(chordType: string, tonic?: string) => (degree: number) => string`

`Chord.degrees` returns a function to get a note name from a chord degree:

```js
const c4m7 = Chord.degrees("m7", "C4");
c4m7(1); // => "C4"
c4m7(2); // => "Eb4"
c4m7(3); // => "G4"
c4m7(4); // => "Bb4"
c4m7(5); // => "C5"
```

It can be used, for example, to get the notes of chord inversions:

```js
[1, 2, 3, 4].map(c4m7); // => ["C4", "Eb4", "G4", "Bb4"]
[2, 3, 4, 5].map(c4m7); // => ["Eb4", "G4", "Bb4", "C5"]
[3, 4, 5, 6].map(c4m7); // => ["G4", "Bb4", "C5", "Eb5"]
[4, 5, 6, 7].map(c4m7); // => ["Bb4", "C5", "Eb5", "G5"]
```

Bear in mind that degree numbers starts with 1 and 0 returns an empty string:

```js
c4m7(0); // => ""
```

See [`Scale.degrees`](https://tonaljs.github.io/tonal/docs/groups/scales#scaledegrees)

### `Chord.steps`

`steps(chordType: string, tonic?: string) => (degree: number) => string`

Same as `Chord.degrees` but 0 is the tonic. Plays better with numeric ranges:

```js
import { Range, Chord } from "tonal";

Range.numeric([-3, 3]).map(Chord.steps("aug", "C4"));
// => ["C3", "E3", "G#3", "C4", "E4", "G#4", "C5"]
```

## Finding chords

### `Chord.detect`

`detect(notes: string[]) => string[]`

Given a list of notes, get the possible chord names:

```js
Chord.detect(["D", "F#", "A", "C"]); // => ["D7"]
Chord.detect(["F#", "A", "C", "D"]); // => ["D7/F#"]
```

You can add new chords to the dictionary using `ChordType` module:

```ts
import { Chord, ChordType } from "tonal";

ChordType.add(["1P", "5P", "7M"], ["5maj7", "5add7"]);
Chord.detect(["C3", "G3", "B3"]); // => ["C5maj7"]
```

## Transposition

### `Chord.transpose`

`transpose(chordName: string, intervalName: string) => string`

Transpose a chord symbol by an interval:

```js
Chord.transpose("Eb7b9", "5P"); // => "Bb7b9"
```

## Relationships

### `Chord.chordScales`

`chordScales(chordName: string) => string[]`

Get all scales where the given chord fits:

```js
Chord.chordScales("C7b9"); // => ["phrygian dominant", "flamenco", "spanish heptatonic", "half-whole diminished", "chromatic"]
```

### `Chord.extended`

`extended(chord: string) => string[]`

Get all chords names that are a superset of the given one (has the same notes and at least one more)

```js
Chord.extended("Cmaj7");
// => [ 'Cmaj#4', 'Cmaj7#9#11', 'Cmaj9', 'Cmaj13', 'CM7add13', 'Cmaj9#11', 'CM13#11', 'Cmaj11', 'CM7b9' ]
```

### `Chord.reduced`

`reduced(chord: string) => string[]`

Find all chords names that are a subset of the given one (less notes but all from the given chord)

```js
Chord.reduced("Cmaj7"); // => ["C5", "CM"]
```
