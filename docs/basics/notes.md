# Notes

> Parse and manipulate notes

```js
import { Note } from "tonal";

Note.get("C4"); // => { midi: 60 ...}
Note.name("fx4"); // => "F##4"
Note.pitchClass("Ab5"); // => "Ab"
Note.octave("C4"); // => 4
Note.midi("A4"); // => 69
Note.fromMidi(61); // => "Db4"
Note.enharmonic("C#"); // => "Db"
```

## Note properties

### `Note.get`

`get(noteName: string) => Note`

Given a note name, it returns an object with the following properties:

- name: the note name
- pc: the pitch class name
- letter: the note letter
- step: the letter number (0..6)
- acc: the note accidentals
- alt: the accidental number (..., -1 = 'b', 0 = '', 1 = '#', ...)
- oct: the octave (or null if not present)
- chroma: the note chroma (0..11)
- height: a number to compare and sort notes by pitch. Equals the midi number when the note has an octave (even outside the 0..127 midi range). Pitch classes get a large negative value, so they sort before any note with octave
- midi: the note midi or null if octave is not present
- freq: the note frequency in Hertzes, or null if the octave is not present

```js
Note.get("C4"); // => { name: "C4", midi: 60, ... }
```

It has several shorthands to retrieve properties easily:

```js
Note.name("fx4"); // => "F##4"
Note.pitchClass("Ab5"); // => "Ab"
Note.accidentals("Eb"); // => 'b'
Note.octave("C4"); // => 4
Note.midi("A4"); // => 69
Note.freq("A4"); // => 440
Note.chroma("D"); // => 2

["C", "D", "E"].map(Note.chroma); // => [0, 2, 4]
```

### `Note.fromMidi`

`fromMidi(midi: number) => string`

Given a midi number, returns the note name. This function is the same as `midiToNoteName` from [@tonaljs/midi](https://tonaljs.github.io/tonal/docs/basics/midi.md)

```js
Note.fromMidi(61); // => "Db4"
Note.fromMidi(61.7); // => "D4"
[60, 61, 62].map(Note.fromMidi); // => ["C4", "Db4", "D4"]
```

There's also a `Note.fromMidiSharps` version:

```js
Note.fromMidiSharps(61); // => "C#4"
```

### `Note.fromFreq`

`fromFreq(freq: number) => string`

Given a frequency in Hz, returns the note name.

```js
Note.fromFreq(440); // => "A4"
```

It rounds to the nearest name:

```js
[440, 550, 660].map(t.Note.fromFreq); // => [ 'A4', 'Db5', 'E5' ]
```

There's also a `Note.fromFreqSharps` version:

```js
[440, 550, 660].map(t.Note.fromFreqSharps); // => [ 'A4', 'C#5', 'E5' ]
```

## Transposition and distances

### `Note.transpose`

`transpose(note: string, interval: string) => string`

Transpose a note by an interval. It returns the note name or "" if not valid parameters.

Examples:

```js
Note.transpose("d3", "3M"); // => "F#3"
Note.transpose("D", "3M"); // => "F#"
```

`transposeBy` and `transposeFrom` are curried versions of this function to make easy work with arrays:

```js
["C", "D", "E"].map(Note.transposeBy("5P"));
// => ["G", "A", "B"]
```

```js
["1P", "3M", "5P"].map(Note.transposeFrom("C"));
// => ["C", "E", "G"]
```

`Note.tr`, `Note.trBy` and `Note.trFrom` are short aliases of `Note.transpose`, `Note.transposeBy` and `Note.transposeFrom` (and `Note.trFifths` of `Note.transposeFifths`).

### `Note.transposeFifths`

`transposeFifths(noteName: string, fifths: number) => string`

Transpose a note a given number of fifths:

```js
Note.transposeFifths("G4", 3); // => "E6"
Note.transposeFifths("G", 3); // => "E"

[0, 1, 2, 3, 4, 5, 6].map((n) => Note.transposeFifths("F#", n));
// => ["F#", "C#", "G#", "D#", "A#", "E#", "B#"]
[0, -1, -2, -3, -4, -5, -6].map((n) => Note.transposeFifths("Bb", n));
// => ["Bb", "Eb", "Ab", "Db", "Gb", "Cb", "Fb"]
```

### `Note.transposeOctaves`

`transposeOctaves(noteName: string, octaves: number) => string`

Transpose a note a given number of octaves. Pitch classes (notes without octave) stay the same:

```js
Note.transposeOctaves("C4", 2); // => "C6"
Note.transposeOctaves("C4", -1); // => "C3"
Note.transposeOctaves("C", 1); // => "C"
```

### `Note.distance`

`distance(from: string, to: string) => string`

Find the interval between two notes:

```js
Note.distance("C", "D"); // => "2M"
Note.distance("C3", "E3"); // => "3M"
Note.distance("C3", "E4"); // => "10M"
```

## Named collections

### `Note.names`

`names(array?: any[]) => string[]`

Get note names of an array of anything. Notice that names are normalized:

```js
Note.names(["fx", "bb", 12, "nothing", {}, null]); // => ["F##", "Bb"]
```

Without parameters, it returns a list of natural pitch classes:

```js
Note.names(); // => ["C", "D", "E", "F", "G", "A", "B"]
```

You may be in a situation where you have note names with octaves, but don't want them, remove them like this:

```js
Note.names(["C2", "C#3", "Db4", 12, "nothing", {}, null]).map(Note.pitchClass); // => ["C", "C#", "Db"]
```

### `Note.sortedNames`

`sortedNames(array?: any[], comparator?: NoteComparator) => string[]`

Sort an array of note names in ascending order. Pitch classes are listed before notes. Anything that is not a note is removed:

```js
Note.sortedNames(["c2", "c5", "c1", "c0", "c6", "c"]);
// => ['C', 'C0', 'C1', 'C2', 'C5', 'C6']
Note.sortedNames(["c", "F", "G", "a", "b", "h", "J"]);
// => ['C', 'F', 'G', 'A', 'B']
```

An optional comparator can be passed as a second argument. `Note.ascending` (the default) and `Note.descending` are provided:

```js
Note.sortedNames(["c2", "c5", "c1", "c0", "c6", "c"], Note.descending);
// => ['C6', 'C5', 'C2', 'C1', 'C0', 'C']
```

### `Note.sortedUniqNames`

`sortedUniqNames(array?: any[]) => string[]`

Sort notes ascending and remove duplicates. Enharmonic notes are different names, so both are kept:

```js
Note.sortedUniqNames(["C4", "c4", "B#3", "C4"]); // => ["C4", "B#3"]
```

## Enharmonics

### `Note.simplify`

`simplify(noteName: string) => string`

Given a note name, return the same note with less accidentals (or "" if not a valid note):

```js
Note.simplify("C#"); // => "C#"
Note.simplify("C##"); // => "D"
Note.simplify("C###"); // => "D#"
```

### `Note.enharmonic`

`enharmonic(noteName: string, pitchClass?: string) => string`

Given a note name, returns its enharmonic (or "" if not valid note):

```js
Note.enharmonic("C#"); // => "Db"
Note.enharmonic("C##"); // => "D"
Note.enharmonic("C###"); // => "Eb"

Note.enharmonic("C##b"); // => ""
```

Using enharmonic on a natural will return the same value passed in:

```js
Note.enharmonic("C"); // => "C"
Note.enharmonic("C4"); // => "C4"
```

The destination pitch class can be enforced to calculate the octave:

```js
Note.enharmonic("F2", "E#"); // => "E#2"
Note.enharmonic("B2", "Cb"); // => "Cb3"
Note.enharmonic("C2", "B#"); // => "B#1"
```

Enforced pitch class must have the same chroma as the note, otherwise "" is returned:

```js
Note.enharmonic("F2", "Eb"); // => ""
```
