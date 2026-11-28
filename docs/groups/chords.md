# Chords

> Get and manipulate chords

> **Try it:** [Chord finder](https://tonaljs.github.io/tonal/apps/chord-finder/). Play or type some notes to get the chord name, or type a chord symbol to get its notes.
> **Try it:** [Chart reader](https://tonaljs.github.io/tonal/apps/chart-reader/). Paste a chord chart with sections, repeats, endings and D.S. al Coda to see the form as it's played, bar by bar, and read every symbol: notes, family, complexity and roman numerals in a key, with applied dominants. Transpose it and play it.
> **Try it:** [Walking bass](https://tonaljs.github.io/tonal/apps/walking-bass/). Paste a chord chart to get a walking bass line: targets on each chord, approach notes into the next one, two-feel in the head, with a ride to play along.
> **Try it:** [Reharmonizer](https://tonaljs.github.io/tonal/apps/reharmonizer/). Paste a chart and reharmonize it: the original on top with what each chord does in the key, and below a dropdown of substitutes on each chord, or one click for tritone subs, ii–Vs, secondary dominants or passing diminished chords. Hear one after the other, with a melody that follows the chords.

```js
import { Chord } from "tonal";

Chord.get("Cmaj7").notes; // => ["C", "E", "G", "B"]
Chord.chordScales("C7b9"); // => ["phrygian dominant", "flamenco", "phrygian b4", "mixolydian b2", "spanish heptatonic", "half-whole diminished", "chromatic"]
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

A symbol that isn't a listed chord type can be a listed type followed by alterations. The alterations are tokens, written one after another (with or without spaces between them) or in parentheses separated by commas or spaces:

```js
Chord.get("Cm7b5b9").notes; // => ["C", "Eb", "Gb", "Bb", "Db"]
Chord.get("C7(b9,#9)").notes; // => ["C", "E", "G", "Bb", "Db", "D#"]
Chord.get("C7(no3)").notes; // => ["C", "G", "Bb"]
Chord.get("Cdim(maj7)").notes; // => ["C", "Eb", "Gb", "B"]
Chord.get("C(add9)").notes; // => ["C", "E", "G", "D"]
Chord.get("Cmaj7sus4").notes; // => ["C", "F", "G", "B"]
Chord.get("C7sus2").notes; // => ["C", "D", "G", "Bb"]
Chord.get("Cm7 b9").symbol; // => "Cm7b9"
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

A diminished chord with a ninth or an eleventh has the diminished seventh: `Cdim9` (or `Co9`, `C°9`) is `Cdim7(9)`, and `Cdim11` is `Cdim7(9,11)`. More tokens can follow: `Co9b13`. `Cdim13` is not a chord, because its 13th would be the same note as the diminished seventh (A and Bbb). As with the other types, `Co(9)` or `Cdimadd9` adds the 9 to the triad, without seventh:

```js
Chord.get("Co9").notes; // => ["C", "Eb", "Gb", "Bbb", "D"]
Chord.get("Cdim11").notes; // => ["C", "Eb", "Gb", "Bbb", "D", "F"]
Chord.get("Cdimadd9").notes; // => ["C", "Eb", "Gb", "D"]
```

Spaces between the type and the tokens, or between tokens, are removed when the symbol with spaces isn't a chord: `Cm7 b9` is `Cm7b9`, `Cmin maj7` is `Cminmaj7` (a minor/major seventh) and `C7(#5) b9` is `C7(#5)b9`. The symbol is written without the spaces. A symbol that isn't a chord without spaces isn't one with them: `C7 maj7` is empty, like `C7maj7`.

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

### `Chord.bass`

`bass(chord: string, octave?: number) => string`

The bass note of a chord: the slash bass of a slash chord, or the root. (`Chord.get(name).bass` is `""` when there's no slash.) With an octave, the note is in that octave:

```js
Chord.bass("C7/E"); // => "E"
Chord.bass("C7"); // => "C"
Chord.bass("C7/E", 2); // => "E2"
```

To put a bass line in an instrument's range, fold the pitch classes with [`Note.fold`](https://tonaljs.github.io/tonal/docs/basics/notes.md#notefold): each goes to the lowest octave in the range:

```js
const chords = ["Cmaj7", "A7/C#", "Dm7", "G7"];
chords.map((chord) => Chord.bass(chord)); // => ["C", "C#", "D", "G"]
Note.fold(
  chords.map((chord) => Chord.bass(chord)),
  ["E1", "D2"],
);
// => ["C2", "C#2", "D2", "G1"]
```

#### Approach notes

A bass line often leads into the next chord's bass with an approach note. `Scale.approaches` gives every kind (a half step, a scale step, the dominant, enclosures) next to the target, with the chord's scale from `Chord.chordScale`:

```js
const target = Chord.bass("G7", 2); // => "G2"
const scale = Chord.chordScale("G7", { key: "C major" }); // => "G mixolydian"
Scale.approaches(scale, target).below; // => "F#2"
Scale.approaches(scale, target).scaleBelow; // => "F2"

// a bar of Dm7 leading to G7
[
  ...[0, 1, 2].map(Chord.steps(["D2", "m7"])),
  Scale.approaches(scale, target).below,
];
// => ["D2", "F2", "A2", "F#2"]
```

Which approach to use, and when, is up to the app.

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
2. the seventh, or the 6th in a chord without seventh
3. the fifth, if it's altered
4. the extension that names the chord (the highest one), then the altered extensions
5. the root
6. the other extensions, implied by the one that names the chord
7. the fifth, if it's natural

The order follows jazz voicing practice: the 3rd and 7th define the quality and are kept, the root is left out when a bass player has it, and the natural 5th goes first. So four voices of C13 are the root, 3rd, 7th and 13th, and without the root the 3rd, 7th, 13th and 9th:

```js
Chord.degreesByImportance("C13"); // => ["3", "b7", "13", "1", "9", "5"]
Chord.degreesByImportance("Cm7b5"); // => ["b3", "b7", "b5", "1"]
Chord.degreesByImportance("C7#5"); // => ["3", "b7", "#5", "1"]
Chord.degreesByImportance("Csus4"); // => ["4", "1", "5"]
Chord.degreesByImportance("Cm6"); // => ["b3", "6", "1", "5"]
```

Sources:

- Bill Dobbins, _The Contemporary Jazz Pianist_, vol. 2, p. 11: the 3rd and 7th (or 3rd and 6th) carry the quality of a chord; the root and the natural 5th can go.
- Tim Richards, _Exploring Jazz Piano_: "dominant chords should never omit the seventh" (vol. 1, p. 226), and the three-note 13th chord is 7-3-13, without root and 5th (vol. 2, fig. 7.3).
- Mark Levine, _The Jazz Piano Book_, ch. 7: rootless voicings leave the root to the bass player.
- Phil DeGreg, _Jazz Keyboard Harmony_, chs. 4 and 6, and Dan Haerle, _Jazz Piano Voicing Skills_, skills 40–45: three- and four-note rootless voicings keep the 3rd and 7th, also on m7b5 and dim7.

## Fit notes to another chord

A pattern written over one chord (a bass line over C7) can be played over any other chord by moving each note to the same role: the 3rd to the new 3rd, the 9th to a 9th the new chord takes. Transposing by the root gets the 3rd wrong between major and minor; fitting doesn't.

### `Chord.fitNote`

`fitNote(note: string, from: string, to: string, options?: { scale?: string, bass?: boolean, keep?: "non-chord" }) => string`

The note's role in `from` (`Chord.degreeOf`), moved to `to` with `Chord.fitDegree`, in the octave nearest the note moved with the root (the root moves the nearest way, a tritone goes up; ties go up). A pitch class gives a pitch class.

```js
Chord.fitNote("E4", "C7", "Fm7b5"); // => "Ab4" (3 → b3)
Chord.fitNote("F4", "C7", "Fmaj7"); // => "B4" (11 → #11)
Chord.fitNote("E4", "C7", "F7sus4"); // => "Bb4" (3 → 4)
Chord.fitNote("D4", "C7", "Fm7b5"); // => "G4" (9 is a tension of m7b5)
Chord.fitNote("D4", "C7", "Fm7b5", { scale: "F locrian" }); // => "Gb4"
```

A phrase is a `map`. A bar of walking bass over C7, fitted to a ii-V-I in Eb:

```js
const bar = ["C2", "E2", "G2", "Bb2"];
["Fm7", "Bb7", "Ebmaj7"].map((chord) =>
  bar.map((note) => Chord.fitNote(note, "C7", chord)),
);
// => [["F2", "Ab2", "C3", "Eb3"], ["Bb1", "D2", "F2", "Ab2"], ["Eb2", "G2", "Bb2", "D3"]]
```

Roles count from the root. With `{ bass: true }`, the root role goes to the slash bass of the target, for bass lines; no other role changes:

```js
Chord.fitNote("C3", "C7", "F7/Eb"); // => "F3"
Chord.fitNote("C3", "C7", "F7/Eb", { bass: true }); // => "Eb3"
```

Every note is fitted by its role, also the notes that aren't chord tones of the source chord, so a chromatic line can collapse. With `{ keep: "non-chord" }`, those notes keep their interval from the root (passing and approach notes move with the root) and only the chord tones are fitted:

```js
const line = ["C3", "Db3", "D3"];
line.map((n) => Chord.fitNote(n, "C7", "Fmaj7")); // => ["F3", "G3", "G3"]
line.map((n) => Chord.fitNote(n, "C7", "Fmaj7", { keep: "non-chord" })); // => ["F3", "Gb3", "G3"]
```

A kept note is spelled by its role, and a chord tone that moves can reach it: Eb is the #9 of C7, so `C Db D Eb E` over Fm7 gives `F Gb G G# Ab`, where G# and Ab sound the same because the 3rd moved down to the passing note. Fixing that needs the whole phrase, so it's left to the app.

To keep the fitted notes in a range, use `Note.fold` after fitting.

### `Chord.fitDegree`

`fitDegree(degree: string, to: string, options?: { scale?: string }) => string`

The degree of `to` that plays the role of `degree`. The number counts in the octave (9 and 2, 11 and 4, 13 and 6 are the same role). The first rule that matches:

0. A chord tone stays, and so does a tension (`Chord.tensions`) when there's no `scale` or the scale has it: `"7"` on Cdim7, `"#9"` on C7b9.
1. A chord tone with the same number: `"3"` is `"b3"` on Cm7, `"7"` is `"b7"` on C7, `"11"` is `"4"` on Csus4.
2. A chord tone with the same pitch class: `"#11"` is `"b5"` on Cm7b5.
3. With a `scale`, the scale note with the same number, counted from the chord's root: `"9"` is `"b9"` with C locrian over Cm7b5.
4. A tension with the same number: `"11"` is `"#11"` on C7, `"13"` is `"b13"` on Cm7b5, `"b9"` is `"9"` on Cm7.
5. A 3rd on a chord without 3rd goes to its sus tone (`"4"` or `"2"`).
6. Otherwise the degree stays: `"13"` on C7#5.

Among several candidates, the same alteration wins, then the nearest in semitones, ties up.

```js
Chord.fitDegree("3", "Cm7"); // => "b3"
Chord.fitDegree("11", "F7"); // => "#11"
Chord.fitDegree("9", "Fm7b5", { scale: "F locrian" }); // => "b9"
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

## Tensions, avoid notes and chord scales

Over a chord, a note is a chord tone, a tension (a note the chord can add without changing what it is), an avoid note (one that clashes with it) or outside. Which scale fits a chord depends on the key.

### `Chord.tensions`

`tensions(chordName: string) => string[]`

The tensions of a chord, as degree names (see [chord degrees by name](#chord-degrees-by-name)). They come from a table by the chord's 3rd, 5th and 7th, after Ted Pease (_Jazz Composition_, p. xv) and John Novello (_The Contemporary Keyboardist_, p. 96):

| Chord                  | Tensions                |
| ---------------------- | ----------------------- |
| maj7, major triad      | 9, #11, 13              |
| 6                      | 9, #11, 7               |
| augmented, 7#5         | 9, #11                  |
| 7                      | b9, 9, #9, #11, b13, 13 |
| 7sus4                  | b9, 9, 13               |
| mMaj7                  | 9, 11, 13               |
| m6                     | 9, 11, 7                |
| m7, minor triad        | 9, 11                   |
| m7b5, diminished triad | 9, 11, b13              |
| dim7                   | 9, 11, b13, 7           |
| no 3rd                 | 9, 11, 13               |

The tensions the chord already says are left out: a chord tone (C9 has no 9 tension), the 9 when the symbol has b9 or #9 over a major 3rd (and b9 and #9 when it has the 9), and the b13 when it has the 13 (and the other way round).

```js
Chord.tensions("C7"); // => ["b9", "9", "#9", "#11", "b13", "13"]
Chord.tensions("Cmaj7"); // => ["9", "#11", "13"]
Chord.tensions("C7b9"); // => ["#9", "#11", "b13", "13"]
Chord.tensions("m7"); // => ["9", "11"]
```

The 13 of a minor 7th is a tension only in Dorian, so it comes from a key or a scale (see `Chord.classify`).

### `Chord.classify`

`classify(chordName: string, note: string, options?: { key?: string, scale?: string, tensions?: string[] }) => "chord tone" | "tension" | "avoid" | "outside" | ""`

What a note is over a chord. Only its pitch class counts. The rule, in order:

1. **chord tone**: a note of the chord.
2. **avoid**: a half step above a chord tone, or another form of the chord's 3rd, 5th or 7th (the major 3rd over a minor chord, the 5th over a b5, the b7 over a maj7), unless it's one of the chord's tensions. So b9 on a dominant is a tension, and F on Cmaj7 is avoid.
3. **tension**: without a scale, one of `Chord.tensions`; with a scale, any other note of the scale.
4. **outside**: everything else (with a scale, a note not in it).

```js
Chord.classify("Cmaj7", "E"); // => "chord tone"
Chord.classify("C7", "Db"); // => "tension"
Chord.classify("Cmaj7", "F"); // => "avoid"
Chord.classify("Dm7", "B"); // => "outside"
Chord.classify("Dm7", "B", { key: "C major" }); // => "tension" (D dorian)
Chord.classify("Em7", "F", { key: "C major" }); // => "avoid" (b9 in E phrygian)
Chord.classify("G7", "Ab", { scale: "G phrygian dominant" }); // => "tension"
```

With `key`, the scale is the chord's scale in that key (`Chord.chordScale`); `scale` gives it directly. An avoid note is one to handle with care, not a wrong one: it works as a passing note, or resolving down (Mark Levine, _The Jazz Piano Book_).

#### Your own tensions

The books don't agree on every tension. To use others, pass them as `tensions`, with the same shape `Chord.tensions` returns. They decide which notes escape avoid, and without a key or scale they are also the tensions:

```js
Chord.classify("Dm7", "B", { tensions: ["9", "11", "13"] }); // => "tension"
Chord.classify("Cmaj7", "F", { tensions: [...Chord.tensions("Cmaj7"), "11"] }); // => "tension"
```

With a key or scale the tensions are the notes of the scale, so a listed tension outside it is outside. To make it a tension, choose a scale that has it:

```js
Chord.classify("G7", "Ab", { key: "C major" }); // => "outside" (G mixolydian has no Ab)
Chord.classify("G7", "Ab", { scale: "G phrygian dominant" }); // => "tension"
```

`Chord.chordScales` and `Chord.chordScale` take the same option.

### `Chord.chordScales`

`chordScales(chordName: string, options?: { key?: string, tensions?: string[] }) => string[]`

The scale types (names without tonic) that contain every note of the chord. Without options they are in the order of the scale catalogue:

```js
Chord.chordScales("C7b9"); // => ["phrygian dominant", "flamenco", "phrygian b4", "mixolydian b2", "spanish heptatonic", "half-whole diminished", "chromatic"]
```

With a `key` (a key or scale name, like `"C major"`, `"A minor"` or `"A harmonic minor"`) they are ranked:

1. the key's own mode on the chord's root, when it contains the chord;
2. the common chord scales (the modes of major, melodic minor and harmonic minor, the two diminished scales and whole tone) that agree with the chord: none of their notes is another form of the chord's 3rd, 5th or 7th unless it's a tension (dorian #4, with a natural 5th, doesn't agree with m7b5);
3. the common chord scales that don't agree;
4. every other scale.

Within each group, the fewest notes outside the key first, then the scales of seven notes, then the ones that share more notes with the key.

```js
Chord.chordScales("D7", { key: "C major" }).slice(0, 3); // => ["mixolydian", "lydian dominant", "mixolydian b6"]
```

### `Chord.chordScale`

`chordScale(chordName: string, options?: { key?: string, tensions?: string[] }) => string`

The first ranked chord scale, as a full name:

```js
Chord.chordScale("Dm7", { key: "C major" }); // => "D dorian"
Chord.chordScale("D7", { key: "C major" }); // => "D mixolydian"
Chord.chordScale("E7", { key: "C major" }); // => "E phrygian dominant"
Chord.chordScale("Fm6", { key: "C major" }); // => "F melodic minor"
Chord.chordScale("Bdim7", { key: "C major" }); // => "B diminished"
Chord.chordScale("Cdim7"); // => "C diminished"
```

In a key every diatonic chord gets the scale `Key` gives it (`Key.majorKey("C").chordScales`). The rule ranks by notes, not by function: secondary dominants get mixolydian (to a major chord) or phrygian dominant (to a minor chord), borrowed chords their minor-key scale, but a tritone substitute gets phrygian dominant, not the lydian dominant the books give it.

## Substitutions

### `Chord.substitutes`

`substitutes(chord: string, options?: { next?: string, kinds?: string[], minor?: boolean }) => { chords: string[], kind: string }[]`

The chords that can take a chord's place, each with its kind, in a documented order (the JSDoc has every rule). A substitute is one chord, or two when it adds one: the related ii before a dominant, or an approach chord to `next` after the chord. Roots are spelled by interval from the chord's root.

| Kind                  | Rule                                                                           | Example                     |
| --------------------- | ------------------------------------------------------------------------------ | --------------------------- |
| `tritone substitute`  | a dominant a tritone away                                                      | G7 → Db7                    |
| `backdoor`            | for a dominant, the 7 chord a whole step below its target                      | G7 → Bb7                    |
| `contained`           | triads, 7ths and 6ths on another chord tone, made of the chord's notes         | Cmaj7 → Em; G9 → Bm7b5, Dm6 |
| `related ii`          | the m7 before a dominant (m7b5 on a b9 dominant or with `minor: true`)         | G7 → Dm7 G7                 |
| `secondary dominant`  | with `next`: the chord, then the V7 of `next`                                  | C → C A7 before Dm7         |
| `substitute dominant` | with `next`: the chord, then the tritone substitute of that V7                 | C → C Eb7 before Dm7        |
| `passing diminished`  | with `next` a whole step up: the chord, then the dim7 a half step below `next` | C → C C#dim7 before Dm7     |

```js
Chord.substitutes("G7");
// => [{ chords: ["Db7"], kind: "tritone substitute" }, { chords: ["Bb7"], kind: "backdoor" }, { chords: ["Bdim"], kind: "contained" }, { chords: ["Dm7", "G7"], kind: "related ii" }]
Chord.substitutes("C", { next: "Dm7" }).map((s) => s.chords);
// => [["C", "A7"], ["C", "Eb7"], ["C", "C#dim7"]]
Chord.substitutes("G9", { kinds: ["contained"] }).map((s) => s.chords[0]); // => ["Bm7b5", "Dm6"]
```

### `Chord.tritoneSubstitute`

`tritoneSubstitute(chord: string) => string`

The most used one on its own: a dominant a tritone away, spelled with fewer accidentals. The substitute of the substitute is the chord.

```js
Chord.tritoneSubstitute("G7"); // => "Db7"
Chord.tritoneSubstitute("Db7"); // => "G7"
Chord.tritoneSubstitute("Gm7"); // => ""
```

### `Chord.containing`

`containing(note: string, options?: { types?: string[] }) => { chord: string, degree: string }[]`

The chords that have a note as a chord tone or a tension (`Chord.tensions`), to harmonise a melody note. maj7, 7 and m7 by default:

```js
Chord.containing("C", { types: ["m7"] });
// => [{ chord: "Cm7", degree: "1" }, { chord: "Am7", degree: "b3" }, { chord: "Fm7", degree: "5" }, { chord: "Dm7", degree: "b7" }, { chord: "Bbm7", degree: "9" }, { chord: "Gm7", degree: "11" }]
```

## Relationships

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
