# @tonaljs/progression ![tonal](https://img.shields.io/badge/@tonaljs-progression-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/progression.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/progression)

> Roman numerals to chords and back, and the named progressions of jazz (ii–V–I, turnarounds…) in any key

```js
import { Progression } from "tonal";

Progression.fromRomanNumerals("C", ["IMaj7", "IIm7", "V7"]); // => ["CMaj7", "Dm7", "G7"]
```

## Usage

ES6:

```js
import { Progression } from "tonal";
```

node:

```js
const { Progression } = require("tonal");
```

## API

### `Progression.fromRomanNumerals`

`fromRomanNumerals(keyTonic: string, chordProgression: string[]) => string[]`

Given a tonic and a chord progression expressed in roman numeral analysis chords, returns the progression expressed in leadsheet chords.

```js
Progression.fromRomanNumerals("C", ["IMaj7", "IIm7", "V7"]);
// => ["CMaj7", "Dm7", "G7"]
```

A lowercase roman numeral is a minor chord, unless its chord type already has a quality (like `viio`, `viidim7`, `iim7` or `ii+`). Every spelling of a chord type gives the same chord (`iimaj7` and `iiMaj7` are both minor-major sevenths, and `viio7` and `viidim7` are both diminished sevenths):

```js
Progression.fromRomanNumerals("C", ["I", "vi", "ii7", "V7", "viio"]);
// => ["C", "Am", "Dm7", "G7", "Bo"]
```

With alterations, the third becomes minor and the rest of the chord type is kept: `ii7b9` is `Dm7b9`, and `ii7b5` is `Dm7b5` (half-diminished). A chord type with a `#9` stays as written (`ii7#9` is `D7#9`), since its minor third would be the same note as the `#9`.

An applied (secondary) chord, like `V7/V`, is a chord on a degree of another degree's major scale. Applied chords can nest:

```js
Progression.fromRomanNumerals("C", ["I", "V7/ii", "ii", "V7/V", "V7", "I"]);
// => ["C", "A7", "Dm", "D7", "G7", "C"]
Progression.fromRomanNumerals("C", ["viio7/V", "V/V/V"]);
// => ["F#o7", "A"]
```

A chord type can also be a listed type plus alterations, like in `Chord.get`:

```js
Progression.fromRomanNumerals("C", ["V7(b9)", "IV(add9)", "ii(add9)"]);
// => ["G7(b9)", "F(add9)", "Dm(add9)"]
```

A note after a slash is the bass: `I/E` is `C/E`. A numeral whose chord type isn't a known chord type gives an empty string:

```js
Progression.fromRomanNumerals("C", ["I/E", "V65", "It6"]);
// => ["C/E", "", ""]
```

### `Progression.toRomanNumerals`

`toRomanNumerals(keyTonic: string, chordProgression: string[]) => string[]`

The opposite of `fromRomanNumerals`. Given a tonic and a chord progression expressed in leadsheet chords, returns the progression using roman numeral analysis chords.

```js
Progression.toRomanNumerals("C", ["CMaj7", "Dm7", "G7"]);
// => "IMaj7", "IIm7", "V7"]
```

## Named progressions

A catalogue of the progressions jazz (and some pop and blues) is made of, and a search for them in any key.

### `Progression.patterns`

`patterns() => Pattern[]`

The catalogue: each pattern has its `name`, its `aliases`, its `numerals` (one per chord, from the tonic) and its `family` (cadence, turnaround, launcher, pop, blues).

```js
Progression.patterns()[2];
// => { name: "ii–V–I", aliases: ["two-five-one", "regular cadence", "cadence"], numerals: ["IIm7|IIm7b5", "V7|V7sus4", "Imaj7|Im7"], family: "cadence" }
```

A numeral is a degree and a chord type, and `|` separates alternatives. A chord fits when it's on that degree and has the same family (`Chord.get(symbol).family`): `"IIm7|IIm7b5"` takes Dm7, Dm9 or Dm7b5 in C, and `"Imaj7|Im7"` a major or a minor tonic (C6, Cmaj9, Cm6…). Numerals are read from the major scale of the tonic, as in `fromRomanNumerals`.

Names are the common ones when there is one (ii–V–I, backdoor cadence), and the numerals otherwise. The aliases include the names of John Elliott's _Insights in Jazz_ and Conrad Cork's _Harmony with LEGO Bricks_ ("POT", "SPOT", "long cadence", "dogleg"…).

The catalogue is ordered by use: the share of a corpus of 1,454 jazz standards (lead-sheet charts) with each pattern at least once, found with `Progression.find`. Pop and blues come last, by the whole corpus of 6,627 lead sheets.

| Pattern          | Alias                | Jazz standards with it |
| ---------------- | -------------------- | ---------------------- |
| V–I              | perfect cadence      | 90%                    |
| ii–V             | two-five             | 89%                    |
| ii–V–I           | regular cadence      | 80%                    |
| VI7–ii–V         | dropback launch      | 56%                    |
| II7–V7           | slow launcher        | 46%                    |
| iii–VI7–ii–V     | SPOT                 | 40%                    |
| VI7–ii–V–I       | dropback             | 39%                    |
| II7–ii–V         | dogleg launch        | 32%                    |
| iii–VI7–ii–V–I   | long cadence         | 27%                    |
| bII7–I           | tritone substitution | 20%                    |
| I–vi–ii–V        | turnaround           | 18%                    |
| I–VI7–ii–V       | POT                  | 14%                    |
| backdoor cadence | iv–bVII7–I           | 7%                     |

In the same corpus, I–IV–V is in 21% of bluegrass songs and 16% of pop songs, and I7–IV7–I7 in 51% of blues.

### `Progression.find`

`find(chords: string[], pattern: string | string[], options?: { literal?: boolean, patterns?: PatternLike[] }) => PatternMatch[]`

Every place a pattern appears in a list of chords, in any key: its first chord (`start`), how many chords it spans (`length`), the `tonic` its numerals are read from, and its `name`. The pattern is a name or alias (case and dashes don't matter), or numerals.

```js
Progression.find(["Em7", "A7", "Dm7", "G7", "Cmaj7"], "ii–V–I");
// => [{ name: "ii–V–I", start: 2, length: 3, tonic: "C" }]
Progression.find(["Em7", "A7", "Dm7", "G7", "Cmaj7"], "long cadence")[0].tonic; // => "C"
Progression.find(["Fm7", "Bb7", "Ebmaj7", "Ebmaj7"], "IIm7 V7 Imaj7");
// => [{ name: "", start: 0, length: 4, tonic: "Eb" }]
```

- A chord repeated right after itself (same root, same family) is held: the match spans its repeats.
- Matches can overlap: a ii–V–I contains a ii–V.
- A match doesn't end on a minor tonic followed by its dominant (a minor chord on the I, then a dominant a fourth up): that chord is a ii. In Em7 A7 Dm7 G7 Cmaj7 the only ii–V–I is the one in C, and `"IIm7 V7 Im7"` finds nothing. With `{ literal: true }` the numerals are matched as written: `find(chords, "IIm7 V7 Im7", { literal: true })` gives the one in D minor.
- To find patterns in a chart: `Progression.find(Chart.chords(chart).map((c) => c.value), "ii–V–I")`.

### `Progression.fromPattern`

`fromPattern(pattern: string | string[], tonic: string, options?: { patterns?: PatternLike[] }) => string[]`

The chords of a pattern in a key: the first alternative of each numeral.

```js
Progression.fromPattern("ii–V–I", "F"); // => ["Gm7", "C7", "Fmaj7"]
Progression.fromPattern("long cadence", "Bb"); // => ["Dm7", "G7", "Cm7", "F7", "Bbmaj7"]
Progression.fromPattern("andalusian cadence", "A"); // => ["Am", "G", "F", "E"]
```

### A catalogue of your own

`find` and `fromPattern` look names up in `Progression.patterns()`, or in the catalogue of the `patterns` option, which takes its place. To add patterns, extend the catalogue; a pattern needs a `name` and `numerals`, and can have `aliases`:

```js
const patterns = [
  ...Progression.patterns(),
  { name: "three-four", numerals: ["IIIm7", "IVmaj7"] },
];
Progression.find(["Em7", "Fmaj7", "C"], "three-four", { patterns });
// => [{ name: "three-four", start: 0, length: 2, tonic: "C" }]
Progression.fromPattern("three-four", "F", { patterns }); // => ["Am7", "Bbmaj7"]
```

The option doesn't change the catalogue: each call says which one it uses.

## References

- [Roman numeral analysis](https://en.wikipedia.org/wiki/Roman_numeral_analysis)
- [Leadsheet chord symbols](https://en.wikipedia.org/wiki/Lead_sheet)
- John A. Elliott, _Insights in Jazz: An Inside View of Jazz Standard Chord Progressions_ (2009), and Conrad Cork, _The New Guide to Harmony with LEGO Bricks_: the names of many patterns
