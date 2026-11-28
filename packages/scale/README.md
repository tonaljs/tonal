# @tonaljs/scale ![tonal](https://img.shields.io/badge/@tonaljs-scale-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/scale.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/scale)

`@tonaljs/scale` is a collection of functions to create and manipulate musical scales

```js
import { Scale } from "tonal";

Scale.get("c5 pentatonic").notes; // => ["C5", "D5", "E5", "G5", "A5"]
```

## Usage

ES6:

```js
import { Scale } from "tonal";
```

nodejs:

```js
const { Scale } = require("tonal");
```

Single module:

```js
import Scale from "@tonaljs/scale";
```

## Scale properties

### `Scale.get`

`get(name: string) => Scale`

Get a scale from a scale name. `Scale.get` accepts tonics in the scale name and returns a [scale type](https://tonaljs.github.io/tonal/docs/dictionaries/scale-types) with two more properties: `tonic` and `notes`:

```js
Scale.get("c5 pentatonic");
// =>
// {
//   empty: false,
//   name: "C5 major pentatonic",
//   type: "major pentatonic",
//   tonic: "C5",
//   notes: ["C5", "D5", "E5", "G5", "A5"],
//   intervals: ["1P", "2M", "3M", "5P", "6M"],
//   aliases: ["pentatonic"],
//   setNum: 2708,
//   chroma: "101010010100",
//   normalized: "100101001010"
// }
```

### `Scale.tokenize`

`tokenize(name: string) => [string, string]`

Split a scale name into its tonic and scale type. It doesn't check that the scale type exists:

```js
Scale.tokenize("C mixolydian"); // => ["C", "mixolydian"]
Scale.tokenize("C4 major"); // => ["C4", "major"]
Scale.tokenize("anything is valid"); // => ["", "anything is valid"]
```

## Scale notes

### `Scale.degrees`

`degrees(scaleName: string) => (degree: number | string) => string`

`Scale.degrees` returns a function to get a note name from a scale degree:

```js
const c4major = Scale.degrees("C4 major");
c4major(1); // => "C4"
c4major(2); // => "D4"
c4major(8); // => "C5"
c4major(-1); // => "B3"
c4major(-3); // => "G3"
c4major(-7); // => "C3"
```

Bear in mind that degree numbers starts with 1 and 0 returns an empty string:

```js
c4major(0); // => ""
```

Because it returns a function, it's handy to be used with `map` (and similar functions):

```js
[1, 2, 3].map(Scale.degrees("C major")); // => ["C", "D", "E"]
[1, 2, 3].map(Scale.degrees("C4 major")); // => ["C4", "D4", "E4"]
[-1, -2, -3].map(Scale.degrees("C major")); // => ["B", "A", "G"]
```

Notice that it uses octaves if the scale tonic has an octave or pitch classes (_octaveless_ notes) otherwise.

A degree can also be a string with accidentals after the number, to get notes outside the scale. The note keeps the letter of the scale degree, so it's spelled by interval:

```js
const cMajor = Scale.degrees("C major");
cMajor("7b"); // => "Bb"
cMajor("4#"); // => "F#"
cMajor("-2b"); // => "Ab" (the 2nd degree below the tonic, lowered)
Scale.degrees("A major")("7b"); // => "G" (not F##)
```

The number counts scale notes, so `"7b"` is the 7th note of the scale, lowered. In a scale that isn't major it's not a minor seventh: `Scale.degrees("D dorian")("3#")` is `"F#"`, and in C major pentatonic the 7th note is `D`, so `"7b"` is `"Db"`. The accidentals go after the number so that a scale step can't be mixed up with an interval name like `"b7"` (the minor seventh, as in [`Chord.noteOf`](https://tonaljs.github.io/tonal/docs/groups/chords#chordnoteof)): `cMajor("b7")` is `""`.

See [`Chord.degrees`](https://tonaljs.github.io/tonal/docs/groups/chords#chorddegrees)

See https://en.wikipedia.org/wiki/Degree_(music)

### `Scale.steps`

`steps(scaleName: string) => (step: number | string) => string`

Same as `Scale.degrees` but 0 is tonic. It plays better with ranges:

```js
import { Range, Scale } from "tonal";

Range.numeric([-3, 3]).map(Scale.steps("C4 major"));
// => ["G3", "A3", "B3", "C4", "D4", "E4", "F4"]
```

Steps take accidentals too: `Scale.steps("C4 major")("6b")` is `"Bb4"`.

A melody written as scale steps can be played in any scale:

```js
const melody = [0, 2, 4, "3#", 4, 7, 6, 4];
melody.map(Scale.steps("C4 major"));
// => ["C4", "E4", "G4", "F#4", "G4", "C5", "B4", "G4"]
melody.map(Scale.steps("D4 dorian"));
// => ["D4", "F4", "A4", "G#4", "A4", "D5", "C5", "A4"]
```

### `Scale.transposeBySteps`

`transposeBySteps(scaleName: string, note: string, steps: number) => string`

Transpose a note of the scale by a number of scale steps (up, or down if negative):

```js
Scale.transposeBySteps("C major", "E4", 2); // => "G4"
Scale.transposeBySteps("C major", "E4", -3); // => "B3"
Scale.transposeBySteps("C major", "E4", 7); // => "E5"
Scale.transposeBySteps("C major", "E", 2); // => "G" (pitch classes work too)
```

The note is compared by pitch, so an enharmonic spelling works, and the result is spelled as in the scale:

```js
Scale.transposeBySteps("C major", "B#3", 1); // => "D4"
```

A note that isn't in the scale gives an empty string. Use `Scale.nearest` to move it into the scale first:

```js
Scale.transposeBySteps("C major", "F#4", 1); // => ""
Scale.transposeBySteps("C major", Scale.nearest("C major", "F#4"), 1); // => "A4"
```

### `Scale.nearest`

`nearest(scaleName: string, note: string) => string`

Find the scale note closest to a note, by pitch. A note halfway between two scale notes goes up, whatever its spelling, as in `Midi.pcsetNearest`:

```js
Scale.nearest("C major", "F#4"); // => "G4"
Scale.nearest("C major", "Gb4"); // => "G4"
Scale.nearest("C minor pentatonic", "D4"); // => "Eb4"
Scale.nearest("C major", "Eb"); // => "E"
```

The result is spelled as in the scale (`Scale.nearest("C major", "Cb4")` is `"B3"`), and a scale note gives itself back.

### `Scale.approaches`

`approaches(scaleName: string, target: string) => ApproachNotes`

The notes that lead to a target note, each with an octave next to it: a half step below or above, the nearest scale note below or above, the target's fifth (its dominant) a fourth below or a fifth above, and the two-note figures made of them:

```js
Scale.approaches("G mixolydian", "G2");
// => {
//   below: "F#2", above: "Ab2",
//   scaleBelow: "F2", scaleAbove: "A2",
//   dominantBelow: "D2", dominantAbove: "D3",
//   enclosure: ["A2", "F#2"],            // the scale note above, then the half step below
//   chromaticEnclosure: ["Ab2", "F#2"],  // the half step above, then the half step below
//   doubleBelow: ["F2", "F#2"],          // two half steps up to the target
//   doubleAbove: ["A2", "Ab2"],          // two half steps down to the target
// }
```

The half step below is the leading tone (`E#2` below `F#2`); the notes above take the simplest spelling (`B2` above `Bb2`, not `Cb3`), as a bass line is written; the whole step below and the fifths are spelled from the target, respelled only when they would need a double sharp or flat. The scale notes are spelled as in the scale, and the target doesn't need to be in it:

```js
Scale.approaches("C major", "F#2").below; // => "E#2"
Scale.approaches("C major", "F#2").scaleAbove; // => "G2"
```

For the scale of a chord in a key, use `Chord.chordScale`:

```js
Scale.approaches(Chord.chordScale("E7", { key: "C major" }), "E2").scaleAbove; // => "F2" (E phrygian dominant)
```

With `""` as the scale only the chromatic notes and the dominants are given; a target without an octave gives empty fields. These are the most common ways a walking bass moves into a chord change (in the FiloBass corpus: from a half step below or above, a whole step above, or a fourth below). Which one to use, and when, is up to the app.

### `Scale.scaleNotes`

`scaleNotes(notes: string[]) => string[]`

Given an array of notes, return an array of sorted note names starting from the first note name of the input array.

```js
// Always start with the first note of the input array
Scale.scaleNotes(["D4", "c#5", "A5", "F#6"]); // => ["D", "F#", "A", "C#"]
// Remove duplicates
Scale.scaleNotes(["C4", "c3", "C5", "C4", "c4"]); // => ["C"]
```

### `Scale.rangeOf`

`rangeOf(scale: string | string[]) => (from: string, to: string) => string[]`

`Scale.rangeOf` returns a function to create scale ranges:

```js
const range = Scale.rangeOf("C pentatonic");
range("C4", "C5"); // => ["C4", "D4", "E4", "G4", "A4", "C5"]
```

Please note that the scale name _must_ have tonic:

```js
const range = Scale.rangeOf("pentatonic");
range("C4", "C5"); // => []
```

This function also works with a collection of notes:

```js
const range = Scale.rangeOf(["C", "Db", "G"]);
range("C4", "C5"); // => ["C4", "Db4", "G4", "C5"]
```

## Finding scales

### `Scale.names`

`names() => string[]`

List all known scale names. Same as `ScaleType.names()`

See [scale-type](https://tonaljs.github.io/tonal/docs/dictionaries/scale-types)

### `Scale.detect`

`detect(notes: string[], options: { tonic?: string, match?: "fit" | "exact" }) => string[]`

Find all scales that first a collection of notes with a given tonic:

```js
Scale.detect(["C", "D", "E", "F", "G", "A", "B"]);
// => ["C major", "C bebop", "C bebop major",
//     "C ichikosucho",  "C chromatic"];
```

You can pass an optional tonic (otherwise first note will be used):

```js
Scale.detect(["C", "D", "E", "F", "G", "A", "B"], { tonic: "A" });
// => [ 'A minor', 'A minor bebop', 'A chromatic' ]
```

You can ask just the exact match:

```js
Scale.detect(["D", "E", "F#", "A", "B"], { match: "exact" });
// => ["D major pentatonic"]
Scale.detect(["D", "E", "F#", "A", "B"], { match: "exact", tonic: "B" });
// => ["B minor pentatonic"]
```

## Relationships

### `Scale.chords`

`chords(scale: string, options?: { size?: number, step?: number, all?: boolean, types?: string[], order?: "common" | "dictionary" }) => { degree: number, notes: string[], symbol: string }[]`

Get the chord built on each degree of a scale, by stacking scale notes. `size` is the number of notes (3 by default: triads) and `step` the scale steps between them (2 by default: thirds; 3 for fourths, 1 for seconds). It works for any scale with a tonic:

```js
Scale.chords("C major").map((c) => c.symbol);
// => ["C", "Dm", "Em", "F", "G", "Am", "Bdim"]
Scale.chords("C major", { size: 4 })[6];
// => { degree: 7, notes: ["B", "D", "F", "A"], symbol: "Bm7b5" }
Scale.chords("C melodic minor", { size: 4 }).map((c) => c.symbol);
// => ["CmMaj7", "Dm7", "Ebmaj7#5", "F7", "G7", "Am7b5", "Bm7b5"]
```

With an octave in the tonic, the notes have octaves:

```js
Scale.chords("C4 major").map((c) => c.notes);
// => [["C4", "E4", "G4"], ["D4", "F4", "A4"], ["E4", "G4", "B4"], ["F4", "A4", "C5"],
//     ["G4", "B4", "D5"], ["A4", "C5", "E5"], ["B4", "D5", "F5"]]
```

The symbol is the chord type whose intervals spell the notes: Eb G B D is `Ebmaj7#5`, not `EbM7b6`. When no type spells them, it's a type with the same notes over the same root, which can spell a note differently (the diminished scale's Eb Gb A is `Ebdim`). When no chord type has those notes, the symbol is `""` and the notes are still there:

```js
Scale.chords("C major", { step: 3 }).map((c) => c.notes);
// => [["C", "F", "B"], ["D", "G", "C"], ...]   (symbols are "")
Scale.chords("C major", { size: 4, step: 3 })[1];
// => { degree: 2, notes: ["D", "G", "C", "F"], symbol: "Dquartal" }
```

A major triad is written without quality (`"C"`), as in `Key`. The chords of major and minor scales are the ones in [`Key`](/packages/key) and [`Mode`](/packages/mode), except the melodic minor tonic: `Scale.chords` stacks thirds (`CmMaj7`), while `Key.minorKey("C").melodic.chords` lists `Cm6`, as used in jazz.

Scales with more than seven notes (bebop, octatonic) or fewer (pentatonic) give stacks that may have no name.

#### Every chord on each degree

With `all: true`, it lists every chord type whose notes are all in the scale, rooted on each degree: the chords to choose from in a key, for any scale. They come by degree and, on each degree, the common ones first (by `complexity`; `order: "dictionary"` keeps the dictionary's order). `types` limits the chord types:

```js
Scale.chords("B minor", {
  all: true,
  types: ["M", "m", "7", "m7", "maj7"],
}).map((c) => c.symbol);
// => ["Bm", "Bm7", "D", "Dmaj7", "Em", "Em7", "F#m", "F#m7", "G", "Gmaj7", "A", "A7"]
Scale.chords("C major", { all: true })
  .filter((c) => c.degree === 7)
  .map((c) => c.symbol);
// => ["Bdim", "Bm7#5", "Bm7b5", "Bquartal", "Bmb6b9", "Bm#5", "B7#5sus4"]
```

Types match by pitch class and the notes are spelled as in the scale, so a type that spells a note differently is listed with the scale's note: Bm#5 is B D G in C major, and Cdim7 is C Eb Gb A in the diminished scale. `Scale.scaleChords` gives the chord types from the tonic only, without root.

### `Scale.scaleChords`

`scaleChords(scale: string) => string[]`

Get all chords that fits a given scale:

```js
Scale.scaleChords("pentatonic");
// => ["5", "M", "6", "sus2", "Madd9"]
```

### `Scale.outside`

`outside(scale: string | string[], chord: string | string[]) => string[]`

Get the notes of a chord that aren't in a scale: the borrowed or chromatic notes. They're pitch classes spelled as in the chord, each listed once, in the chord order. The list is empty exactly when the chord fits the scale:

```js
Scale.outside("C major", "Bb7"); // => ["Bb", "Ab"]
Scale.outside("C major", "Fm"); // => ["Ab"]
Scale.outside("C major", "Dm7"); // => []
```

The scale is a name with tonic or a list of notes, and the chord a chord symbol or a list of notes. Enharmonic notes are the same note:

```js
Scale.outside("A minor", ["E4", "G#4", "B4"]); // => ["G#"]
Scale.outside(["C", "D", "E", "G", "A"], "F"); // => ["F"]
Scale.outside("D major", "Gb"); // => ["Bb"]
```

The number of notes outside, with [`ChordType.complexity`](/packages/chord-type#chordtypecomplexity), can order chords for a key: the ones that fit first, then the ones with one note outside, sorted by complexity:

```js
const key = "C major";
const chords = ["Ab", "G7", "Fm", "Db7", "Dm7", "Bb"];
const outside = (chord) => Scale.outside(key, chord).length;
const complexity = (chord) => Chord.get(chord).complexity;
chords.sort((a, b) => outside(a) - outside(b) || complexity(a) - complexity(b));
// => ["G7", "Dm7", "Fm", "Bb", "Ab", "Db7"]
```

It returns `[]` if the scale (or its tonic) or the chord isn't valid.

### `Scale.extended`

`extended(scale: string) => string[]`

Get all scales names that has the same notes and at least one more:

```js
Scale.extended("major");
// => ["bebop", "bebop major", "ichikosucho", "chromatic"]
```

### `Scale.reduced`

`reduced(scale: string) => string[]`

Find all scales names that are a subset of the given one (less notes but all from the given scale)

```js
Scale.reduced("major");
// => ["major pentatonic", "ionian pentatonic", "ritusen"]
```

### `Scale.modeNames`

`modeNames(name: string) => [string, string][]`

Find mode names (if any) of a given scale:

```js
Scale.modeNames("C pentatonic"); // => [
//    ["C", "major pentatonic"],
//    ["D", "egyptian"],
//    ["E", "malkos raga"],
//    ["G", "ritusen"],
//    ["A", "minor pentatonic"]
//  ]
```
