# Chords

> Get and manipulate chords

> **Try it:** [Chord finder](https://tonaljs.github.io/tonal/apps/chord-finder/). Play or type some notes to get the chord name, or type a chord symbol to get its notes.

```js
import { Chord } from "tonal";

Chord.get("Cmaj7").notes; // => ["C", "E", "G", "B"]
Chord.chordScales("C7b9"); // => ["phrygian dominant", "flamenco", "spanish heptatonic", "half-whole diminished", "chromatic"]
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

The `name` is the tonic and the chord type's long name (`"C major seventh"`, `"C major over E"`). Many chord types have no long name, because the symbol says it all; those chords are named by their symbol: `Chord.get("Cadd9").name` is `"Cadd9"`, and `Chord.get("C7b9b13").name` is `"C7b9b13"`.

The `family` property (from `ChordType`) classifies the chord as major, minor, dominant, half-diminished, diminished, augmented, suspended or power (see [`ChordType.family`](https://tonaljs.github.io/tonal/docs/dictionaries/chord-types.md#chordtypefamily)):

```js
Chord.get("C7b9").family; // => "dominant"
Chord.get("Cm7b5b9").family; // => "half-diminished"
```

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
//   family: 'major',
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
Chord.get("Cmaj7sus4").notes; // => ["C", "F", "G", "B"]
Chord.get("C7sus2").notes; // => ["C", "D", "G", "Bb"]
```

The tokens are:

- `b5`, `#5` and `+5` replace the fifth.
- `b9`, `#9`, `#11` (or `#4`), `b13` and `b6` add an altered tone, which replaces the natural one: `C13b9` has a b9 and no 9. `b13` and `b6` keep the fifth.
- `add` followed by a tone adds it: `add9` (or `add2`), `add11`, `add4`, `add13`, `add6`, and altered ones such as `addb9`.
- `9`, `11`, `13` and `6` without `add` only inside parentheses: `C7(9,13)`, `Cm7(11)`.
- `no3` and `no5` remove the third or the fifth.
- `sus4` (or `sus`) and `sus2` replace the third with a 4th or a 2nd: `Cmaj7sus4`, `C7sus2`, `C6sus4`. The minor third is replaced too, so `Cm7sus4` is the same chord as `C7sus4`.
- `maj7` (or `M7`, `^7`, `Δ7`) makes the seventh major: `Cm(maj7)`, `Caug(maj7)`. It replaces a minor or diminished seventh only inside parentheses, as in `Cm9(^7)` or `Cdim7(maj7)`: `C7maj7` is not a chord. Neither is `C4maj7`, so an octave written inside a chord name gives an empty chord instead of a wrong one.

A token can't double an interval: `Cmaj7(maj7)` and `Csus4sus4` are not chords.

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

Its numbers count the notes of the chord in order, as [`Scale.degrees`](https://tonaljs.github.io/tonal/docs/groups/scales.md#scaledegrees) does for a scale: `Chord.degrees("C")(3)` is `"G"`. For the degree named 3 (`"E"`), use [`Chord.noteOf`](#chordnoteof).

### `Chord.steps`

`steps(chordType: string, tonic?: string) => (degree: number) => string`

Same as `Chord.degrees` but 0 is the tonic. Plays better with numeric ranges:

```js
import { Range, Chord } from "tonal";

Range.numeric([-3, 3]).map(Chord.steps("aug", "C4"));
// => ["C3", "E3", "G#3", "C4", "E4", "G#4", "C5"]
```

## Chord degrees by name

The degrees of a chord are named as in chord formulas, counted from the major scale of the root: `1`, `b3`, `3`, `4`, `b5`, `5`, `#5`, `6`, `bb7`, `b7`, `7`, `b9`, `9`, `#9`, `11`, `#11`, `b13`, `13`. So the third of a minor chord is `b3`, and `3` is always a major third.

The 2nd, 4th and 6th are different degrees from the 9th, 11th and 13th: a chord tone is named after its interval in the chord type, so the 6th of `C6` is `6` and the 13th of `C13` is `13`. The bass of a slash chord doesn't change the degrees.

### `Chord.formula`

`formula(chord: string) => string[]`

The degrees of a chord, in the order of its intervals:

```js
Chord.formula("Cm7"); // => ["1", "b3", "5", "b7"]
Chord.formula("dim7"); // => ["1", "b3", "b5", "bb7"]
Chord.formula("C13/E"); // => ["1", "3", "5", "b7", "9", "13"]
```

### `Chord.degreeOf`

`degreeOf(chord: string, note: string) => string`

The degree a note plays in a chord. A chord tone gets its degree in the chord, whatever its spelling:

```js
Chord.degreeOf("C7b9", "Db"); // => "b9"
Chord.degreeOf("C7b9", "C#4"); // => "b9"
Chord.degreeOf("Cm7", "Eb"); // => "b3"
```

Any other note gets its most probable degree:

| Semitones from the root | Degree                                         |
| ----------------------- | ---------------------------------------------- |
| 1, 2                    | `b9`, `9`                                      |
| 3                       | `#9` over a major third, `b3` otherwise        |
| 4                       | `3`                                            |
| 5                       | `4` in a chord without third, `11` otherwise   |
| 6, 7, 8                 | `#11`, `5`, `b13`                              |
| 9                       | `6` in a chord without seventh, `13` otherwise |
| 10, 11                  | `b7`, `7`                                      |

```js
Chord.degreeOf("C", "Eb"); // => "#9"
Chord.degreeOf("C7", "F"); // => "11"
Chord.degreeOf("C7sus4", "D"); // => "9"
Chord.degreeOf("C", "A"); // => "6"
Chord.degreeOf("C7", "A"); // => "13"
```

It returns `""` if the chord has no tonic or the note isn't valid.

### `Chord.noteOf`

`noteOf(chord: string, degree: string) => string`

The note of a degree, as a pitch class spelled from the root. It undoes `degreeOf`: chord tones come back as they are spelled in the chord, and other notes as the same pitch class.

```js
Chord.noteOf("C7b9", "b9"); // => "Db"
Chord.noteOf("C#7", "b9"); // => "D"
Chord.noteOf("Cm7", "b3"); // => "Eb"
Chord.noteOf("Cm7", "3"); // => "E"
```

It returns `""` if the chord has no tonic or the degree isn't a degree name (a number like `3` isn't one: it's not the same as `"3"`).

### `Chord.degreesByImportance`

`degreesByImportance(chord: string) => string[]`

The degrees of a chord sorted by how much they define it, to choose which ones to keep when there are fewer voices than chord tones:

1. the third, or in a chord without third the 4th, 2nd or 11th that replaces it
2. the fifth, if it's altered
3. the seventh, or the 6th in a chord without seventh
4. the first extension (the first degree not listed here)
5. the root
6. the fifth, if it's natural
7. the other extensions

```js
Chord.degreesByImportance("C13"); // => ["3", "b7", "9", "1", "5", "13"]
Chord.degreesByImportance("C7#5"); // => ["3", "#5", "b7", "1"]
Chord.degreesByImportance("Csus4"); // => ["4", "1", "5"]
Chord.degreesByImportance("Cm6"); // => ["b3", "6", "1", "5"]
```

## Finding chords

### `Chord.detect`

`detect(notes: string[], options?: { assumePerfectFifth?: boolean, exclude?: string[] }) => string[]`

Given a list of notes, get the possible chord names, most likely first. The bass is the first note, or the lowest one when every note has an octave:

```js
Chord.detect(["D", "F#", "A", "C"]); // => ["D7"]
Chord.detect(["F#", "A", "C", "D"]); // => ["D7/F#"]
Chord.detect(["E4", "G4", "C5"]); // => ["CM/E", "Em#5"]
Chord.detect(["A3", "C4", "F3"]); // => ["FM", "Am#5/F"]
```

See [`@tonaljs/chord-detect`](https://tonaljs.github.io/tonal/docs/groups/chord-detection.md) for the ranking and the options.

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
