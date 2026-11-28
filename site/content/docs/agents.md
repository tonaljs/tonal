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
`ChordType`, `Scale`, `ScaleType`, `Key`, `Mode`, `Chart`, `Midi`, `Pcset`,
`Progression`, `RomanNumeral`, `Range`, `Collection`, `Voicing`,
`VoiceLeading`, `Time`, `TimeSignature`, `DurationValue`,
`RhythmPattern`, `Pattern`, `AbcNotation`) and a few top-level functions (`note`,
`interval`, `transpose`, `distance`). Each namespace is also its own npm package:
`import * as Chord from "@tonaljs/chord"`. Use `tonal` unless bundle size
matters. In a browser without a bundler, `tonal/browser/tonal.min.js` defines a
`Tonal` global.

Don't use the deprecated namespaces `Tonal`, `PcSet`, `ChordDictionary`,
`ScaleDictionary` and `VoicingDictionary`: use the top-level functions, `Pcset`,
`ChordType`, `ScaleType` and `Voicing` (with options or templates).

## How tonal works

**Everything is a string or a plain object.** Notes are strings (`"C4"`,
`"Eb5"`, `"F#"`), intervals are strings (`"5P"`, `"3m"`), chords and scales are
named by strings (`"Cmaj7"`, `"D dorian"`). Functions that parse a name return
a plain object with its properties. There are no classes and nothing mutates.

**Invalid input never throws**, not even a value of the wrong type (`Chord.get(undefined)`); the one exception is `ChordType.add`, which registers a chord type. It returns an empty value, so check it:

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

- To play a pattern written over one chord over another (a bass line over
  C7 over Fm7b5), use `Chord.fitNote(note, from, to)`: each note keeps its
  role (the 3rd goes to the new 3rd, 11 to #11 on a dominant) and stays near
  its place. Transposing by the root gets the 3rd wrong. A phrase is a `map`;
  pass `{ bass: true }` for the slash bass, `{ scale }` to let the chord's
  scale decide, `{ keep: "non-chord" }` so passing notes keep their interval
  from the root (otherwise a chromatic line can collapse), and `Note.fold` to
  keep the result in a range:

  ```js
  Chord.fitNote("E4", "C7", "Fm7b5"); // => "Ab4"
  ["C2", "E2", "G2", "Bb2"].map((n) => Chord.fitNote(n, "C7", "Fm7")); // => ["F2", "Ab2", "C3", "Eb3"]
  ```

- To reharmonise, `Chord.substitutes(chord, { next, kinds })` lists what can
  take a chord's place as `{ chords, kind }`: the tritone substitute, the
  backdoor dominant, the chords contained in it (Em for Cmaj7) and the
  related ii of a dominant, plus approach chords to `next` (secondary and
  substitute dominants, passing diminished). Filter with `kinds`; for the
  tritone substitute alone use `Chord.tritoneSubstitute`.
  `Chord.containing(note)` lists the chords that can harmonise a melody note:

  ```js
  Chord.tritoneSubstitute("G7"); // => "Db7"
  Chord.substitutes("C", { next: "Dm7" }).map((s) => s.chords); // => [["C", "A7"], ["C", "Eb7"], ["C", "C#dim7"]]
  ```

- `Chord.get(name).complexity` (or `ChordType.get(type).complexity`) is the
  number of notes added to a triad plus two for each chromatic note (outside
  the major scale that holds most of the chord, as spelled): `m` is 0, `m7`
  1, `dim7` 3, `7b9#11` 7. Sort by it to list common chords first.

- To ask "can this note go over this chord", use `Chord.classify`: it returns
  `"chord tone"`, `"tension"`, `"avoid"` (a half step above a chord tone, or
  another form of its 3rd, 5th or 7th) or `"outside"`. Pass a `key` (or a
  `scale`) for the notes that depend on it, like the 13 of a minor 7th.
  `Chord.tensions` lists a chord's tensions as degree names, and
  `Chord.chordScale` gives the scale for a chord in a key:

  ```js
  Chord.classify("Cmaj7", "F"); // => "avoid"
  Chord.classify("Dm7", "B", { key: "C major" }); // => "tension"
  Chord.tensions("C7b9"); // => ["#9", "#11", "b13", "13"]
  Chord.chordScale("D7", { key: "C major" }); // => "D mixolydian"
  ```

  The tensions are one documented table; to use your own, pass
  `{ tensions: [...] }` to `classify`, `chordScales` or `chordScale`.
  `Chord.chordScales(chord)` without a key isn't ranked: use
  `Chord.chordScale` or pass `{ key }` for the best scale first.

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
- `Key.analyzeChord(key, chord, { previous, next })` says what a chord does
  in a key: every reading, ranked (`[0]` is the default), each with a
  numeral as the books write it (`"V7/ii"`, `"subV7/I"`, `"bVIImaj7"`), a
  `source` (`"diatonic"`, `"secondary dominant"`, `"borrowed"`…), a
  `function` and a `chordScale` chosen by function. Pass the neighbours:
  related ii chords, backdoor and diminished readings need them. The key is
  `"C major"` or `"A minor"`; for a whole progression, `map` over the chords.
- `Key.substitutes(key, chord, { next, kinds })` is `Chord.substitutes` plus
  the key's own: `"diatonic"` (chords of the key with the same function) and
  `"borrowed"` (from `Key.borrowedChords`, the modal interchange table: each
  with its numeral, the scale it comes from and the numerals it replaces).
  In a key, the related ii of a dominant to a minor chord is an m7b5:

  ```js
  Key.substitutes("C major", "Fmaj7", { kinds: ["diatonic", "borrowed"] }).map(
    (s) => s.chords[0],
  ); // => ["Dm7", "Ebmaj7", "Fm7", "Fm6", "Bbmaj7"]
  ```

- To find the scale of some notes or chords ("which key is this?"), use
  `Scale.rank(notes, { chords })`: every tonic with the common scale types,
  best first, each with `matched`, `missing` and `outside` notes.
  `Scale.detect` only tries the first note as the tonic:

  ```js
  Scale.rank([], { chords: ["Dm7", "G7", "Cmaj7"] })[0].name; // => "C major"
  ```

- To modulate, `Key.pivotChords(from, to, { sevenths, chromatic })` lists the
  chords two keys share with their numeral in each (`"Em": "iii"` in C,
  `"vi"` in G); `chromatic` adds chords with a functional reading in the other
  key (D: V/V in C, V in G).

- `Scale.outside(scale, chord)` lists the chord notes that aren't in the
  scale, spelled as in the chord: `Scale.outside("C major", "Bb7")` is
  `["Bb", "Ab"]`, and `[]` when the chord fits. To list the chord types that
  fit a scale, use `Scale.scaleChords`; for the chord on each degree,
  `Scale.chords`; for every chord on each degree (a chord browser for a key
  and scale type), `Scale.chords(scale, { all: true, types })`.
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

## Chord charts

`Chart.parse` reads a chart from text: bars between `|`, chords separated by
spaces, `%` repeats a bar, `[A]` starts a section, `3/4` changes the meter,
`A7@4` places a chord on beat 4, `|: ... :|` repeats, `|1 ... :|2 ...` are
endings, and `<D.S. al Coda>`, `<Segno>`, `<To Coda>`, `<Coda>`, `<Fine>`
are jumps. With `choruses`, a coda or a Fine is played once, at the end; a
plain D.C. or D.S. is played in every chorus. `Chart.fromForm({ A: "| C | G |",
B: "| F |" }, "A A B A")` builds a chart from named sections and a form.
`Chart.transpose(chart, "2M")` transposes its chords, `Chart.toText(chart)`
writes it back as text, and `Chart.barAt(played, position)` gives the played
bar at a position. Several chords in a bar without `@` are
placed by the meter's pulses (`| C F G |` is 2+1+1 beats). Check
`Chart.problems(chart)`: words it can't read are left out, not errors.
`N.C.` (or `NC`) is a rest: its chord has `rest: true`, so check it before
playing a chord (`Chord.get("N.C.")` has no notes and no tonic).

`Chart.unroll` gives the bars as they're played (with `start`, `duration`,
`section`, `sectionBar`, `chorus`); `Chart.chords` the chords with `value`
(the symbol), `start` and `duration`; `Chart.chordAt(chords, position)` the
chord at a position. Every position and duration is a `Time` value in quarter
notes (`[n, d]`):

```js
const chart = Chart.parse("| Dm7 G7 | Cmaj7 |");
const chords = Chart.chords(chart);
chords.map((c) => [c.value, c.start, c.duration]);
// => [["Dm7", [0, 1], [2, 1]], ["G7", [2, 1], [2, 1]], ["Cmaj7", [4, 1], [4, 1]]]
Chart.chordAt(chords, 3)?.value; // => "G7"
```

To accompany a chart with a rhythm, add `Time.onsets(pattern, step)` to each
played bar's `start` and ask `Chart.chordAt` for each position.

## Voicings

```js
Voicing.get("C7"); // => ["C4", "E4", "G4", "Bb4"] (the symbol's notes, root position)
Voicing.get("C13", { voices: 4 }); // => ["C4", "E4", "A4", "Bb4"] (3rd, 7th and 13th kept)
Voicing.get("Dm7", { voices: 4, extensions: "available", bass: "external" }); // => ["F3", "A3", "C4", "E4"] (rootless)
Voicing.get("G7", {
  voices: 4,
  extensions: "available",
  bass: "external",
  previous: ["F3", "A3", "C4", "E4"],
}); // => ["F3", "A3", "B3", "E4"]
Voicing.search("C"); // every voicing that fits, best first
Voicing.sequence(["Dm7", "G7", "Cmaj7"], {
  voices: 4,
  extensions: "available",
  bass: "external",
}); // the smoothest path over the whole progression
Voicing.sequence(["Dm7", { chord: "G7", voices: 5 }, "Cmaj7"], { voices: 4 }); // options per chord
Voicing.get("Dm7", { template: "rootless" }); // => ["F3", "A3", "C4", "E4"] (Voicing.templates() lists the catalogue)
Voicing.get("Cmaj7", { spacing: "drop2" }); // => ["C3", "G3", "B3", "E4"] (close, open, drop2, drop3, drop24, spread, block)
Voicing.analyze(["G3", "C4", "E4", "B4"], "Cmaj7").spacing; // => "drop2"
Voicing.invert(["C4", "E4", "G4"], 1); // => ["E4", "G4", "C5"]
Voicing.drop(["C4", "E4", "G4", "B4"], 2); // => ["G3", "C4", "E4", "B4"]
```

The chord symbol says which notes the chord has; the options say how to play
them: `voices` (a number, or a range per voice), `extensions` (`"available"` or
a list of degrees), `bass` (`"none"`, `"root"` for a bass part, `"external"` for
a bass player), `range`, `top` (a melody note), `previous`, `anchor`. The rules
are in the API list. `[]` means the chord isn't valid or no voicing fits.

Calling `Voicing.get`, `search` or `sequence` with a range array as the second
argument uses the old dictionary voicings (`VoicingDictionary`), which are
deprecated, as is `VoiceLeading.topNoteDiff`: use the options object and
`previous` (or `VoiceLeading.path`).

`VoiceLeading` measures how far the voices move between two voicings (notes
with octave) and finds the smoothest path through candidate voicings. It works
with any voicings, including ones you build yourself:

```js
VoiceLeading.distance(["C4", "E4", "G4"], ["B3", "D4", "G4"]); // => 3 (semitones in total)
VoiceLeading.pcDistance(Chord.notes("C"), Chord.notes("Am")); // => 2 (pitch classes, no octaves)
VoiceLeading.path([
  [["C4", "E4", "G4"]],
  [
    ["F4", "A4", "C5"],
    ["C4", "F4", "A4"],
  ],
]).voicings;
// => [["C4", "E4", "G4"], ["C4", "F4", "A4"]]
```

`distance` and `pcDistance` return `null`, not a number, for an empty voicing
or a note without octave.

`VoiceLeading` measures how far the voices move between two voicings (notes
with octave) and finds the smoothest path through candidate voicings. It works
with any voicings, including ones you build yourself:

```js
VoiceLeading.distance(["C4", "E4", "G4"], ["B3", "D4", "G4"]); // => 3 (semitones in total)
VoiceLeading.pcDistance(Chord.notes("C"), Chord.notes("Am")); // => 2 (pitch classes, no octaves)
VoiceLeading.path([
  [["C4", "E4", "G4"]],
  [
    ["F4", "A4", "C5"],
    ["C4", "F4", "A4"],
  ],
]).voicings;
// => [["C4", "E4", "G4"], ["C4", "F4", "A4"]]
```

`distance` and `pcDistance` return `null`, not a number, for an empty voicing
or a note without octave.

## Note patterns

`Pattern` makes arpeggio orders and melodic sequences as lists of 0-based
indexes. Turn them into notes with the notes they're played over: `Scale.steps`
for a scale, `Chord.steps` for a chord, `Voicing.steps` for a voicing (a list
of notes with octave). All three wrap above the top and go down for negative
indexes: `Voicing.steps(v)(-1)` is the top voice an octave (or more) down, not
the top voice, which is `v.at(-1)`. Books count from 1: their 1-2-3-5 is
`[0, 1, 2, 4]`.

```js
Pattern.arpeggio("up-down", 4); // => [0, 1, 2, 3, 2, 1]
Pattern.arpeggio("up-down", 4).map(Chord.steps(["C4", "maj7"]));
// => ["C4", "E4", "G4", "B4", "G4", "E4"]
Pattern.sequence([0, 1, 2, 3], 1, 3)
  .flat()
  .map(Scale.steps("C4 major pentatonic"));
// => ["C4", "D4", "E4", "G4", "D4", "E4", "G4", "A4", "E4", "G4", "A4", "C5"]
```

An arpeggio order adapts to the number of notes it's given (`Pattern.arpeggios()`
lists the names); a sequence's cell has a fixed length. `sequence` returns
groups (`number[][]`): call `.flat()` before realising them. For more octaves,
ask for the order over more notes (`arpeggio("up", 3 * 2)`), or move it by an
octave's worth of notes (`sequence(arpeggio("up-down", 3), 3, 2).flat()`).
`Pattern` has no rhythm: put the notes on the onsets of a `RhythmPattern`, and
rotate an order with `RhythmPattern.rotate`, which takes any list of numbers.

Keep a figure in a register with `Note.fold(notes, [low, high])`: it moves the
whole figure by octaves (its shape stays), or each note with `{ each: true }`.
A pitch class goes to the lowest octave in the range. To place a note near the
one before (a line built one note at a time), use `Note.nearest(note, previous)`:
the nearest octave, keeping the spelling (`Note.nearest("A", "C3")` is `"A2"`),
with `direction: "up" | "down"` and a `range` it turns around in.
For a bass line, `Chord.bass(chord, octave)` is the slash bass or the root
(`Chord.get(chord).bass` is `""` without a slash):

```js
Pattern.arpeggio("up-down", 4).map(Voicing.steps(Voicing.get("Dm7")));
// => ["D3", "F3", "A3", "C4", "A3", "F3"]
Note.fold(["C2", "E2", "G2", "Bb2"], ["E2", "G3"]); // => ["C3", "E3", "G3", "Bb3"]
Chord.bass("C7/E", 2); // => "E2"
```

Approach notes to a target come from `Scale.approaches(scale, target)`: a
record with each kind (`below`, `above`, `scaleBelow`, `scaleAbove`,
`dominantBelow`, `dominantAbove`, `enclosure`, `chromaticEnclosure`,
`doubleBelow`, `doubleAbove`), notes with octave next to the target. Use the
chord's scale in a key: `Scale.approaches(Chord.chordScale("G7", { key: "C major" }), "G2").below`
is `"F#2"`.

## Time

tonal describes where things are in musical time: `Time`, `TimeSignature`,
`DurationValue`, `RhythmPattern` and `Chart` cover positions, meters, note
values, rhythm patterns and chord charts. When they play (tempo, seconds) isn't
in tonal yet; it's planned, step by step. Playback, clocks and scheduling stay
outside: use an audio or scheduling library for those.

`Time` measures in quarter notes and returns exact fractions,
`[numerator, denominator]`: a dotted quarter is `[3, 2]`, a triplet eighth
`[1, 3]`. Don't do time arithmetic with floats (84 triplet eighths add up to
27.999… quarters): use `Time.add`, `Time.compare` and `Time.equal`. Inputs
also take exact numbers (`1.5`; not `0.1` or `1 / 3`, which give `null`) and
strings (`"1/3"`). Bars and beats count from 1, and a beat is the lower note
of the meter (in 6/8, an eighth: the second dotted quarter is `"1:4"`):

```js
Time.fromBarBeat("2:3+1/3", "4/4"); // => [19, 3]
Time.toBarBeat(28, "4/4"); // => "8:1"
Time.duration("q."); // => [3, 2]
Time.onsets([1, 0, 0, 1, 0, 0, 1, 0], [1, 2]); // => [[0, 1], [3, 2], [3, 1]]
```

For seconds, convert at the end: `Time.toNumber(position) * 60 / bpm`.

A rhythm pattern is an array of 0s and 1s, one per step, read as a loop.
Build one from durations or onset positions (counted from 0), and read them
back with the `to` functions. Don't use the deprecated `onsets`, whose numbers
are the rests after each onset:

```js
RhythmPattern.fromDurations([3, 3, 2]); // => [1, 0, 0, 1, 0, 0, 1, 0]
RhythmPattern.fromOnsets([0, 3, 6], 8); // => [1, 0, 0, 1, 0, 0, 1, 0]
RhythmPattern.toDurations([1, 0, 0, 1, 0, 0, 1, 0]); // => [3, 3, 2]
```

The measures (`evenness`, `oddity`, `offbeatness`, `distance`) return `null`
when they can't be computed, and the tests (`isMaximallyEven`, `isDeep`,
`hasOddity`) return `false`. `euclid` takes the steps first:
`euclid(8, 3)` is the tresillo, E(3, 8) in most other tools.

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
