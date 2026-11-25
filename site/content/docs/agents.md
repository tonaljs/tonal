---
title: For AI agents
description: How to write correct code with tonal. Written for coding agents, useful for people too.
---

This page is for coding agents (and people) writing code that uses tonal. Read
it before writing tonal code, then look up the functions you need in the
[API list](https://tonaljs.github.io/tonal/llms-api.txt), which has every
function with its exact signature and return type. Don't guess function names:
tonal's API has changed over the years, so names you remember may be gone or
deprecated. Every page of these docs is also available as markdown: add `.md`
to its url, or start from [llms.txt](https://tonaljs.github.io/tonal/llms.txt).

The API list is also in the npm package, at `node_modules/tonal/llms-api.txt`,
matching the version you have installed.

## Import

```js
import { Chord, Interval, Key, Note, Scale } from "tonal";
```

`tonal` exports one namespace per module (`Note`, `Interval`, `Chord`,
`ChordType`, `Scale`, `ScaleType`, `Key`, `Mode`, `Midi`, `Pcset`,
`Progression`, `RomanNumeral`, `Range`, `Collection`, `Voicing`,
`VoicingDictionary`, `VoiceLeading`, `TimeSignature`, `DurationValue`,
`RhythmPattern`, `AbcNotation`) and a few top-level functions (`note`,
`interval`, `transpose`, `distance`). Each namespace is also its own npm package:
`import * as Chord from "@tonaljs/chord"`. Use `tonal` unless bundle size
matters. In a browser without a bundler, `tonal/browser/tonal.min.js` defines a
`Tonal` global.

Don't use the deprecated namespaces `Tonal`, `PcSet`, `ChordDictionary` and
`ScaleDictionary`: use the top-level functions, `Pcset`, `ChordType` and
`ScaleType`.

## How tonal works

**Everything is a string or a plain object.** Notes are strings (`"C4"`,
`"Eb5"`, `"F#"`), intervals are strings (`"5P"`, `"3m"`), chords and scales are
named by strings (`"Cmaj7"`, `"D dorian"`). Functions that parse a name return
a plain object with its properties. There are no classes and nothing mutates.

**Invalid input never throws.** It returns an empty value, so check it:

```js
Note.get("H4").empty; // => true
Chord.get("Cxyz").empty; // => true
Note.transpose("C4", "X"); // => ""
Note.midi("C"); // => null (a pitch class has no midi number)
Key.majorKey("X").tonic; // => "" (Key objects have no `empty` field)
Interval.semitones("X"); // => NaN
Note.chroma("X"); // => NaN
```

Number results are `null`, `undefined` or `NaN` depending on the function: the
API list shows which. `NaN` passes `typeof x === "number"`, so test with
`Number.isFinite(x)`.

**Notes and pitch classes.** A note with an octave (`"C4"`) is a note; without
one (`"C"`) it's a pitch class. Most functions keep what they're given:
transposing a pitch class gives a pitch class, and a chord or scale with a
plain tonic has pitch-class notes. Octave 4 is the one with middle C (`"C4"` is
midi 60, `"A4"` is 440 Hz).

```js
Note.transpose("C4", "5P"); // => "G4"
Note.transpose("C", "8P"); // => "C"
Scale.get("C4 major").notes; // => ["C4", "D4", "E4", "F4", "G4", "A4", "B4"]
```

**Intervals** are written number first, quality second: `"5P"`, `"3M"`,
`"3m"`, `"4A"`, `"5d"`, `"-2M"` (descending). Quality first (`"P5"`, `"M3"`) is
also accepted as input, but tonal always returns number first:

```js
Interval.distance("C4", "G4"); // => "5P"
Interval.distance("G4", "C4"); // => "-5P"
Interval.distance("G", "C"); // => "4P" (between pitch classes, always upwards)
Interval.semitones("5P"); // => 7
Interval.fromSemitones(7); // => "5P"
```

**Spelling is kept.** Transposition follows the interval, so the result can have
double accidentals or `E#`. Use `Note.simplify` or `Note.enharmonic` when you
want the simplest name:

```js
Note.transpose("C#", "3M"); // => "E#"
Note.simplify("C##4"); // => "D4"
Note.enharmonic("C#4"); // => "Db4"
```

**MIDI numbers have no spelling**, so converting them to names needs a choice.
`Note.fromMidi` uses flats, `Note.fromMidiSharps` uses sharps:

```js
Note.midi("C4"); // => 60
Note.fromMidi(61); // => "Db4"
Note.fromMidiSharps(61); // => "C#4"
```

## Chords

```js
Chord.get("Cmaj7").notes; // => ["C", "E", "G", "B"]
Chord.get("Cmaj7").intervals; // => ["1P", "3M", "5P", "7M"]
Chord.get("Cmaj7/E").notes; // => ["E", "G", "B", "C"] (the bass first)
Chord.notes("Cmaj7", "C4"); // => ["C4", "E4", "G4", "B4"]
Chord.transpose("Dm7", "4P"); // => "Gm7"
```

- **Don't put an octave in a chord name.** `Chord.get("C4maj7")` is empty, and
  `Chord.get("C4")` is not C at octave 4 but C quartal (`["C", "F", "Bb", "Eb"]`,
  `"4"` is an alias of the quartal chord). For notes with octaves, pass the
  tonic separately: `Chord.notes("Cmaj7", "C4")` or `Chord.notes("maj7", "C4")`.
- Chord names accept the usual symbols and aliases (`"CM7"`, `"CΔ"`, `"C^7"`,
  `"C-7"`, `"Cø"`, `"Cm7b5"`, `"C7(b9,#9)"`, `"Co9"`, and spaced qualifiers
  like `"Cm7 b9"`, which is `"Cm7b9"`). Check `.empty` for symbols you aren't
  sure of. `ChordType.get("maj7").aliases` lists the aliases of a type.
- `Chord.detect` returns names, best match first, and the lowest note is the
  bass. A major triad is named `"CM"`, not `"C"`:

  ```js
  Chord.detect(["E4", "G4", "C5"]); // => ["CM/E", "Em#5"]
  Chord.detect(["C", "Eb", "G", "Bb"]); // => ["Cm7", "Eb6/C"]
  ```

  Chords played without their fifth are named with `no5`
  (`Chord.detect(["C", "E", "B"])` is `["Cmaj7no5"]`). Pass
  `{ missingFifth: false }` for names of listed chord types only, or
  `{ assumePerfectFifth: true }` to get `"Cmaj7"`.

- Chord degrees by name (counted from the major scale of the root, as in chord
  symbols): `Chord.formula`, `Chord.noteOf`, `Chord.degreeOf`.
  `Chord.degreesByImportance` sorts them by how much they define the chord, to
  choose which notes to keep when there are fewer voices than chord tones:

  ```js
  Chord.formula("Cm7"); // => ["1", "b3", "5", "b7"]
  Chord.noteOf("G13", "3"); // => "B"
  Chord.degreesByImportance("G13"); // => ["3", "b7", "13", "1", "9", "5"]
  ```

- `Chord.get(name).complexity` (or `ChordType.get(type).complexity`) is the
  number of notes added to a triad plus two for each chromatic note (outside
  the major scale that holds most of the chord, as spelled): `m` is 0, `m7`
  1, `dim7` 3, `7b9#11` 7. Sort by it to list common chords first.

- `Chord.degrees` and `Chord.steps` are different: they count chord notes by
  position (1 or 0 is the root), not degrees by name. `Chord.degrees("C")(3)`
  is `"G"`, the third note of the chord.

## Scales, modes and keys

```js
Scale.get("D dorian").notes; // => ["D", "E", "F", "G", "A", "B", "C"]
Scale.rangeOf("C major")("C4", "C5"); // => ["C4", "D4", ..., "B4", "C5"]
[1, 3, 5].map(Scale.degrees("C major")); // => ["C", "E", "G"]
Key.majorKey("F").chords; // => ["Fmaj7", "Gm7", "Am7", "Bbmaj7", "C7", "Dm7", "Em7b5"]
Key.majorKey("F").triads; // => ["F", "Gm", "Am", "Bb", "C", "Dm", "Edim"]
Key.minorKey("A").harmonic.chords; // => ["AmMaj7", "Bm7b5", "C+maj7", "Dm7", "E7", "Fmaj7", "G#o7"]
```

- Scale names are full names: `"C major"`, `"A minor"`, `"C maj"` is empty.
  `Scale.names()` lists all of them. A scale without a tonic (`"major"`) has
  intervals but no notes.
- `Key.majorKey` and `Key.minorKey` return everything about a key at once
  (scale, triads, seventh chords, harmonic functions, chord scales, secondary
  and substitute dominants). A minor key has three scales: `natural`,
  `harmonic` and `melodic`. In `secondaryDominants` and similar lists, `""`
  means the degree has none.
- `Scale.outside(scale, chord)` lists the chord notes that aren't in the
  scale, spelled as in the chord: `Scale.outside("C major", "Bb7")` is
  `["Bb", "Ab"]`, and `[]` when the chord fits. To list the chord types that
  fit a scale, use `Scale.scaleChords`; for the chord on each degree,
  `Scale.chords`.
- `Mode` is about the seven Greek modes (`Mode.names()`); for other scales
  use `Scale`. `Scale.modeNames("C harmonic major")` names the modes of any
  scale, and a scale type that is a mode of a parent scale has `family` and
  `degree`: `ScaleType.get("dorian b5")` is degree 2 of `"harmonic major"`.

## Roman numerals and progressions

```js
Progression.fromRomanNumerals("Bb", ["ii7", "V7", "Imaj7"]); // => ["Cm7", "F7", "Bbmaj7"]
Progression.toRomanNumerals("C", ["Dm7", "G7", "Cmaj7"]); // => ["IIm7", "V7", "Imaj7"]
```

Lowercase numerals are minor (`"ii7"` is the same as `"IIm7"`). Applied
chords such as `"V7/V"` are supported. `RomanNumeral.get` parses one numeral
into its parts.

## Voicings

```js
Voicing.get("Dm7"); // => ["F3", "A3", "C4", "E4"]
Voicing.search("Cmaj7", ["E3", "D5"]); // every voicing in the range
Voicing.sequence(["Dm7", "G7", "Cmaj7"], ["E3", "G4"]); // one voicing per chord, smooth voice leading
```

Voicings come from a dictionary of voicings for common chord types
(`VoicingDictionary`), within a range of notes. This module is being
extended: check the API list for its current functions.

`VoiceLeading` measures how far the voices move between two voicings (notes
with octave) and finds the smoothest path through candidate voicings. It works
with any voicings, including ones you build yourself:

```js
VoiceLeading.distance(["C4", "E4", "G4"], ["B3", "D4", "G4"]); // => 3 (semitones in total)
VoiceLeading.pcDistance(Chord.notes("C"), Chord.notes("Am")); // => 2 (pitch classes, no octaves)
VoiceLeading.path([[["C4", "E4", "G4"]], [["F4", "A4", "C5"], ["C4", "F4", "A4"]]]).voicings;
// => [["C4", "E4", "G4"], ["C4", "F4", "A4"]]
```

`distance` and `pcDistance` return `null`, not a number, for an empty voicing
or a note without octave.

## Time

tonal describes where things are in musical time, never when they play: there
is nothing in seconds, no tempo-based timing, no scheduling and no audio.
`TimeSignature`, `DurationValue` and `RhythmPattern` cover meters, note values
and rhythm patterns. Use an audio or scheduling library for playback.

## Common mistakes

- Using functions that don't exist or are deprecated: check the
  [API list](https://tonaljs.github.io/tonal/llms-api.txt). Functions marked
  `[deprecated]` there still work, but write new code with their replacement.
- Not checking for empty results: an invalid name gives `""`, `[]`, `null` or
  an object with `empty: true`, and the error shows up later.
- Expecting octaves from chords and scales named with a pitch class, or
  putting the octave inside a chord name.
- Comparing notes as strings: `"C#4"` and `"Db4"` are different strings for the
  same key on a piano. Compare `Note.midi(a) === Note.midi(b)` for the same
  pitch, or `Note.chroma(a) === Note.chroma(b)` for the same pitch class.
- Writing `"C"` for a C major chord when comparing with `Chord.detect` results,
  which name it `"CM"`. Compare chords by their notes or with `Chord.get(name).symbol`
  instead of by name.
