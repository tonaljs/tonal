# tonal

## 6.11.0

### Minor Changes

- bf12819: Key: substitute dominants never have a double flat, and the harmonic minor IV chord scale is "dorian #4".

  - **Substitute dominants** are spelled a diminished fifth above their secondary dominant, as before, unless that needs a double flat or sharp: then they take the simplest name, as a lead sheet writes them. In Eb major the substitute of `Eb7` is `A7`, not `Bbb7`, and its ii is `Em7`, not `Fbm7`:

    ```js
    Key.majorKey("Eb").substituteDominants; // => ["", "Gb7", "Ab7", "A7", "Cb7", "Db7", ""]
    Key.minorKey("C").natural.substituteDominants; // => ["Db7", "", "", "Gb7", "Ab7", "A7", "Cb7"]
    ```

    Roots with a single flat keep their spelling (`Cb7` in Gb major, where Cb is a note of the key). Since `minorKeyChords` merges chords by name, `A7` in C minor now has two roles: `subV/bVI` and `V/II`.

  - **The fourth degree of harmonic minor** had "lydian diminished", a scale with a note outside the key (F lydian diminished has E, C harmonic minor has Eb). It is now "dorian #4" (F G Ab B C D Eb), which fits the degree's chord, Fm7.

### Patch Changes

- Updated dependencies [bf12819]
  - @tonaljs/key@4.12.0

## 6.10.0

### Minor Changes

- 6d3c02c: `Chord.degreesByImportance` follows jazz voicing practice. The 7th now comes before an altered 5th (`Cm7b5` is `b3 b7 b5 1`), and the extension that names the chord comes before the root, with the implied extensions after it and the natural 5th last: `C13` is `3 b7 13 1 9 5` (it was `3 b7 9 1 5 13`), so four voices of a 13 chord keep the 13. Altered extensions come right after the one that names the chord.
- 85a4f22: Measure voice leading and find the smoothest path, following Dmitri Tymoczko's _A Geometry of Music_:

  - `VoiceLeading.get(from, to)`: the smallest voice leading between two voicings, `{ distance, moves }`. Voices are matched in order from the bottom; a smaller voicing doubles notes.
  - `VoiceLeading.distance(from, to, { metric })`: its size, as the sum of the moves (`"L1"`, default), Euclidean (`"L2"`) or the largest move (`"Linf"`). `null` for an empty voicing or a note without octave.
  - `VoiceLeading.pcDistance(from, to)`: the same between pitch-class sets, each voice moving the shortest way.
  - `VoiceLeading.path(candidates, { metric, previous, maxLeap, costs })`: the smoothest path through the candidate voicings of each chord, exact (dynamic programming), not greedy.

- f7f99c8: Found while building the voicings app:

  - A chord a template gives nothing for (no form for its family, such as a dominant with `"so-what"` or a triad with `"rootless"`, or no form that fits the range) is voiced by the rules with the same options, instead of `[]`. An unknown template name still gives `[]`.
  - When there are more voices than tones, the root or the 5th is doubled, and every mix is a candidate (it was the root first, then the 5th). A triad in four voices can now double the 5th, so `{ voices: 4, spacing: "drop2" }` voices D as F#3 A3 D4 A4 in C3–C5. A fixed top note is still doubled first, and the 3rd and the 7th are not doubled.

- 4866365: `Voicing.get(chord, options)` and `Voicing.search(chord, options)` voice any chord tonal can parse, by rules instead of a dictionary. By default a voicing has the notes of the symbol, in root position near the middle of C3–C5 (`Voicing.get("C7")` is `C4 E4 G4 Bb4`). Options: `voices` (a number or a range per voice), `extensions` (degrees or `"available"`), `bass` (`"none"`, `"root"`, `"external"`), `range`, `bassRange`, `top`, `degrees`, `previous`, `metric`, `anchor` and `mode`, `lowIntervals`. The rules (tensions by chord family, doubling, low interval limits, the cost of each voicing) are documented in the README with their sources (Levine, DeGreg, Jazzology, Novello, Dobbins, Richards, Lindsay, Tymoczko).

  **Migration:** `Voicing.get(chord)` and `Voicing.search(chord)` without a range now use the new rules, so their results change (`Voicing.get("Dm7")` was `F3 A3 C4 E4`, now `D3 F3 A3 C4`). Pass a range array as the second argument for the old dictionary voicings (`Voicing.get("Dm7", ["C3", "C5"])`), which are deprecated and will be removed in tonal 7. For rootless jazz voicings with the new rules, use `{ voices: 4, extensions: "available", bass: "external" }`. `Voicing.sequence` is unchanged for now.

  `@tonaljs/voicing-dictionary` exports its `VoicingDictionary` type.

- 8cb2ad2: `Voicing.sequence(chords, options)` voices a progression with the options of `Voicing.get`, for every chord or per chord (`{ chord: "G7", voices: 5 }`), and chooses the smoothest path over the whole progression with `VoiceLeading.path` (exact, not greedy). Each step costs the voice-leading distance plus the voicing's own register and spacing cost; `maxLeap` limits the move of each voice.

  **Migration:** `Voicing.sequence(chords)` without a range now uses the new rules, so its results change. Pass a range array as the second argument for the old dictionary voicings, which are deprecated and will be removed in tonal 7.

- 8d007fe: Spacing of voicings, measured in chord steps (Dmitri Tymoczko, _Tonality: An Owner's Manual_):

  - The `spacing` option of `Voicing.get`, `search` and `sequence` keeps only voicings with a spacing: `"close"`, `"open"`, `"drop2"`, `"drop3"`, `"drop24"` (Gary Lindsay, _Jazz Arranging Techniques_, ch. 11), `"spread"` (ch. 16), `"block"` (close under the top note, doubled an octave below), or the chord steps between neighbour voices (`[2, 1, 2]`).
  - `Voicing.analyze(notes, chord?)` describes a voicing: notes, bass, top, span, chord steps, the named spacing, and the degree of each note.
  - `Voicing.invert(notes, n)` moves every voice along the voicing's own notes, keeping its spacing.
  - `Voicing.drop(notes, n)` lowers voices an octave, counting from the top.

- 58b37c1: Voicing templates: the `template` option of `Voicing.get`, `search` and `sequence` fixes the order of a voicing's notes as chord degrees (`"3-5-7-9"`, `"R | 3-7-9"`), or names a template of tonal's catalogue: `shell`, `guide-tones`, `rootless`, `rootless-spread`, `so-what`, `fourths`, `upper-structure` (and `-II`, `-bIII`, `-bV`, `-bVI`, `-VI`) and `triad-over-root`. Each catalogue template is in two or more jazz piano books (Levine, DeGreg, Jazzology, Haerle, Richards, Mantooth, Siskind, Harrison), cited in the README and the JSDoc. `Voicing.templates()` lists the names.
- dd77b64: A voicing that carries its own bass (`bass: "none"`) prefers root position on every chord of a sequence, and with `previous`, not only without context: its lowest note is heard as the bass (C E A alone sounds like Am/C). The preference is soft. For triads that invert over a root, use a bass part: `{ bass: "root", voices: 3 }`. Checked on Phil DeGreg's ii–V–I with alternating A and B forms: 11 of 16 with the book's voicings (9 before).

  The weights of the voicing cost are in one documented place, and the README says how they were checked: against the voicings of Phil DeGreg's _Jazz Keyboard Harmony_, keeping the textbook results of the tests (they didn't change).

### Patch Changes

- 1bc3aff: Fix three `lefthand` voicings that gave wrong or misspelled notes: `69` had an augmented sixth (`C69` sounded A# instead of A), `7#11` had an augmented thirteenth (A# instead of A), and `o7` spelled its diminished seventh as a major sixth (A instead of Bbb, unlike `Chord.notes("Co7")`). A new test checks that every voicing note is a chord tone or a tension, spelled as in the chord.
- 732fe81: Deprecations, removed in tonal 7:

  - **`@tonaljs/voicing-dictionary` (`VoicingDictionary`):** voicings are now generated by rules and templates. Use `Voicing.get`, `search` or `sequence` with options (`voices`, `extensions`, `bass`, `template`); the rootless "left hand" voicings are `{ template: "rootless" }`.
  - **The positional forms of `Voicing.get`, `search` and `sequence`** (a range array as second argument): use the options object.
  - **`VoiceLeading.topNoteDiff` and the `VoiceLeadingFunction` type:** use `VoiceLeading.path`, or `previous` in `Voicing.get` and `sequence`.

  They keep working, unchanged. `llms-api.txt` marks a deprecated overload on its own line instead of the whole function.

- Updated dependencies [6d3c02c]
- Updated dependencies [1bc3aff]
- Updated dependencies [85a4f22]
- Updated dependencies [732fe81]
- Updated dependencies [f7f99c8]
- Updated dependencies [4866365]
- Updated dependencies [8cb2ad2]
- Updated dependencies [8d007fe]
- Updated dependencies [58b37c1]
- Updated dependencies [dd77b64]
  - @tonaljs/chord@6.5.0
  - @tonaljs/voicing-dictionary@5.1.11
  - @tonaljs/voice-leading@5.2.0
  - @tonaljs/voicing@5.3.0
  - @tonaljs/progression@4.11.4
  - @tonaljs/scale@4.15.1

## 6.9.0

### Minor Changes

- a13e397: `ChordType.complexity(intervals)`, and a `complexity` property on every chord type and chord: the number of notes added to a triad, plus two for each chromatic note (a note, as spelled, outside the major scale that holds most of the chord). `m` is 0, `m7b5` 1, `maj9` 2, `dim7` 3, `7b9#11` 7. Sorting by it lists the common chord types first.

  `Scale.outside(scale, chord)` returns the notes of a chord that aren't in a scale, spelled as in the chord: `Scale.outside("C major", "Bb7")` is `["Bb", "Ab"]`, and `[]` when the chord fits. The scale and the chord can also be note lists.

- 3456e6c: Every mode of the harmonic major, neapolitan major, neapolitan minor and double harmonic major scales has a name now. 18 new scale types: dorian b5, phrygian b4, mixolydian b2, lydian augmented #2, locrian bb7 (harmonic major); lydian augmented dominant, locrian #2 b4, altered bb3 (neapolitan major); lydian #6, mixolydian augmented, aeolian #4, locrian dominant, ionian #2, ultralocrian bb3 (neapolitan minor); lydian #2 #6, ultraphrygian, ionian augmented #2, locrian bb3 bb7 (double harmonic major). So `Scale.modeNames("C harmonic major")` names all seven modes.

  Scale types (and scales) have `family` and `degree`: the parent scale they're a mode of and the degree they start on, or `""` and `0`. The families are major, melodic minor, harmonic minor, harmonic major, neapolitan major, neapolitan minor, double harmonic major and major pentatonic: `ScaleType.get("dorian b5")` is degree 2 of "harmonic major".

  "balinese" is now named "neapolitan minor", its usual name and its family's name; "balinese" stays as an alias, so `Scale.get("C balinese")` still works, but its `name` and `type` are "C neapolitan minor" and "neapolitan minor", and `Scale.names()`, `Scale.detect` and `Scale.modeNames` give the new name.

  New aliases: "lydian b3" (lydian diminished), "lydian augmented #6" (leading whole tone), "byzantine" and "gypsy major" (double harmonic major), "freygish" and "spanish gypsy" (phrygian dominant). The other names and aliases are unchanged. More scales also means more results from functions that search the dictionary: `Chord.chordScales("C7b9")` now includes mixolydian b2 and phrygian b4.

- 94b2e44: Diminished ninth and eleventh chords: `Chord.get("Co9")` (or `Cdim9`, `C°9`) is the diminished seventh with a 9th, `["C", "Eb", "Gb", "Bbb", "D"]`, and `Co11` adds the 11th too. More tokens can follow (`Co9b13`). `Cdim13` stays empty: its 13th would be the same note as the diminished seventh.

  Chord symbols can have spaces between their qualifiers: `Chord.get("Cm7 b9")` is `Cm7b9`, and `Cmin maj7`, `Cmaj add 9` and `C7(#5) b9` work too. The spaces are removed only when the symbol with them isn't a chord, so names like `"C major seventh"` are unchanged, and the symbol is written without them.

  `Chord.detect` finds chords played without their fifth. When the notes over a root have no name of their own but a chord with a third, a perfect fifth and a seventh has them plus the fifth, it's named with `no5`: `Chord.detect(["C", "E", "B"])` is `["Cmaj7no5"]` (it was `[]`), and C Eb Bb D is `Cm9no5`. These names go after the inversions with every note and before unusual readings, and parse back with `Chord.get`. Listed types without fifth keep their name (`C7no5`, `C9no5`). The new `missingFifth: false` option leaves them out; `assumePerfectFifth` works as before. `Scale.chords` only names listed chord types, as before.

### Patch Changes

- Updated dependencies [a13e397]
- Updated dependencies [3456e6c]
- Updated dependencies [94b2e44]
  - @tonaljs/chord-type@5.4.0
  - @tonaljs/chord@6.4.0
  - @tonaljs/scale@4.15.0
  - @tonaljs/scale-type@4.10.0
  - @tonaljs/progression@4.11.3
  - @tonaljs/voicing@5.2.3
  - @tonaljs/voicing-dictionary@5.1.10
  - @tonaljs/mode@4.9.8

## 6.8.0

### Minor Changes

- `Midi.isMidi` narrows to a number or a numeric string (it said `number`). TypeScript code that passes a value checked with `Midi.isMidi` to a function that only takes numbers needs `+v` or `Midi.toMidi(v)`. See `@tonaljs/midi`'s changelog.

### Patch Changes

- 7d6ca63: Ship `llms-api.txt`, a list of every public function with its signature, return type and a one-line description, for coding agents. It's generated from the source (`npm run docs:api`) and also published on the docs site, next to `llms.txt` and an agent guide.
- Updated dependencies [aa4ab10]
- Updated dependencies [1cf932e]
- Updated dependencies [1cf932e]
- Updated dependencies [1cf932e]
- Updated dependencies [1cf932e]
  - @tonaljs/chord@6.3.2
  - @tonaljs/duration-value@4.9.2
  - @tonaljs/midi@4.11.0
  - @tonaljs/pcset@4.10.6
  - @tonaljs/voice-leading@5.1.8
  - @tonaljs/key@4.11.8
  - @tonaljs/progression@4.11.2
  - @tonaljs/voicing@5.2.2
  - @tonaljs/voicing-dictionary@5.1.9
  - @tonaljs/note@4.12.7
  - @tonaljs/range@4.9.8
  - @tonaljs/chord-type@5.3.2
  - @tonaljs/mode@4.9.7
  - @tonaljs/scale@4.14.2
  - @tonaljs/scale-type@4.9.7

## 6.7.1

### Patch Changes

- a328946: A `b5` in a chord symbol lowers the fifth. Six chord types listed a `b5` spelling as another name of a `#11` chord, which keeps the fifth, so `Chord.get("C7b5b9").notes` was `["C", "E", "G", "Bb", "Db", "F#"]` (now `["C", "E", "Gb", "Bb", "Db"]`, like `C7b5` and `Cm7b5b9`). The spellings were `7b5b9`, `7b9b5`, `7b5#9`, `7#9b5`, `7b5b13`, `9b5b13`, `7b5b9b13`, `6b5` and `M6b5`. They aren't listed types any more: `Chord.get` reads them as a listed type plus alterations, and `ChordType.get("7b5b9")` is empty. `7b9#11`, `7#9#11`, `6#11` and the other `#11` spellings are unchanged, and so is `Chord.detect`.
- 9b041bb: `Midi.chroma` returns a pitch class from 0 to 11 for midi numbers below 0 too (`Midi.chroma(-1)` was `-1`, now `11`), so `Midi.pcset([-1])` is `[11]`. `Midi.pcsetNearest` finds the nearest note below midi 0 (`pcsetNearest([2])(-11)` was `undefined`, now `-10`) and for decimal midi numbers like the ones from `freqToMidi` (`pcsetNearest(Scale.get("C major").chroma)(59.96)` was `undefined`, now `60`). Whole midi numbers from 0 to 127 give the same results as before.
- 4162dde: `Midi.pcset` rounds decimal midi numbers to the nearest note and ignores numbers that aren't finite, so a pitch class set is always whole numbers from 0 to 11, and `pcsetNearest`, `pcsetSteps` and `pcsetDegrees` return whole midi numbers for a set built from decimal midi. `Midi.chroma` keeps the fraction of a decimal midi number, which is now documented.
- 9cac7a4: `Progression.fromRomanNumerals` reads composed chord types, like `Chord.get` does: `fromRomanNumerals("C", ["V7(b9)", "Imaj7(no3)"])` gave `["", ""]` (now `["G7(b9)", "Cmaj7(no3)"]`). So `toRomanNumerals("C", ["G7(b9)"])`, which gives `"V7(b9)"`, now reads back as `"G7(b9)"`.
- 5519908: `Progression.fromRomanNumerals` makes the third of a lowercase numeral minor and keeps the rest of the chord type, alterations included: `fromRomanNumerals("C", ["ii7b9", "ii13#11", "ii7(b9)"])` gave `["D7b9", "D13#11", "D7(b9)"]` (now `["Dm7b9", "Dm13#11", "Dm7(b9)"]`). A flat fifth gives a half-diminished chord: `ii7b5` was `D7b5` and is now `Dm7b5`, and `ii7b5b9` is `Dm7b5b9`. A chord type with a `#9` stays as written (`ii7#9` is `D7#9`), since its minor third would be the same note as the `#9`.
- 6c10671: Roman numerals read chord types with an `i` or a `v` in them: `RomanNumeral.get("viidim7")` and `"iimin7"` were empty, so `Progression.fromRomanNumerals("C", ["viidim7", "iimin7"])` gave `["", ""]` (now `["Bdim7", "Dmin7"]`). `Progression.toRomanNumerals("C", ["Bdim7"])` gives `"VIIdim7"`, which now reads back as `"Bdim7"`.
- Updated dependencies [a328946]
- Updated dependencies [9b041bb]
- Updated dependencies [4162dde]
- Updated dependencies [9cac7a4]
- Updated dependencies [5519908]
- Updated dependencies [6c10671]
  - @tonaljs/chord-type@5.3.1
  - @tonaljs/chord@6.3.1
  - @tonaljs/midi@4.10.7
  - @tonaljs/progression@4.11.1
  - @tonaljs/roman-numeral@4.10.1
  - @tonaljs/scale@4.14.1
  - @tonaljs/key@4.11.7
  - @tonaljs/voicing@5.2.1
  - @tonaljs/voicing-dictionary@5.1.8
  - @tonaljs/note@4.12.6
  - @tonaljs/range@4.9.7
  - @tonaljs/voice-leading@5.1.7

## 6.7.0

### Minor Changes

- 1f86506: Chord symbols as written in charts.

  `Chord.get` reads a listed chord type followed by alterations: `Cm7b5b9`, `C7(b9,#9)`, `C7(no3)`, `Cdim(maj7)`, `C(add9)`. The tokens are `b5 #5 +5 b9 #9 #11 #4 b13 b6`, `add` plus a tone (`add9`, `add11`, `addb9`...), `9 11 13 6` inside parentheses, `no3`, `no5` and `maj7`. An altered tone replaces the natural one (`C13b9` has no 9). The chord keeps the symbol as written, and has the listed type's name when its intervals are a listed type, or an empty `type` otherwise. `7alt` stays `7#5#9`.

  `Chord.get("N.C.")` (or `"NC"`) is "no chord": not empty, with no notes.

  New chord types: `mb6`, `m7b6`, `m9b6`, `mMaj11`, `mMaj13`, `Madd4`, `7susadd3` and `maj7#9`. New aliases for chart shorthand: `-b6 -7b6 -9b6 -^11 -^13 -add2 -add4 add4 7susadd3 7susb9 7susb9b13 ^7#9 ^7b5 ^13#11 h9 o^7`, plus `madd2`, `maj7b5` and `ø9`.

  The new types are part of the dictionary, so functions that list or search chord types can return them: `Chord.detect(["C", "E", "G", "B"])` is `["Cmaj7", "Emb6/C"]` (it was `["Cmaj7"]`), `Chord.extended("Cmaj7")` includes `Cmaj7#9`, `Scale.scaleChords("minor")` includes `mb6`, `m7b6` and `m9b6`, and `Progression.fromRomanNumerals("C", ["iiadd2"])` is `["Dmadd2"]` (it was `["Dmadd9"]`, the same chord).

  `m9b5` has a ninth (`9M`) instead of a second (`2M`), so `Chord.get("Cm9b5").notes` is `["C", "Eb", "Gb", "Bb", "D"]`.

- 3d5530d: Chord degrees by name: `Chord.formula`, `Chord.degreeOf`, `Chord.noteOf` and `Chord.degreesByImportance`.

  Degrees are named as in chord formulas, counted from the major scale of the root (`1 b3 5 b7` for a minor seventh). `Chord.formula("Cm7")` is `["1", "b3", "5", "b7"]`. `Chord.degreeOf("C7b9", "Db")` is `"b9"`; a note that isn't in the chord gets its most probable degree (`Chord.degreeOf("C7", "F")` is `"11"`, `Chord.degreeOf("C", "A")` is `"6"`). `Chord.noteOf("C7b9", "b9")` is `"Db"`, spelled from the root, and gives back the note of any degree from `degreeOf`. `Chord.degreesByImportance("C13")` is `["3", "b7", "9", "1", "5", "13"]`: the degrees sorted by how much they define the chord.

  `Chord.degrees` doesn't change: its numbers count the chord notes in order (`Chord.degrees("C")(3)` is `"G"`), while `Chord.noteOf("C", "3")` is `"E"`.

- 09043d6: `Chord.detect` finds the bass and ranks names better, and every name it returns parses back. This changes its output:

  - When every note has an octave, the lowest note is the bass, whatever the order: `Chord.detect(["A3", "C4", "F3"])` is `["FM", "Am#5/F"]` (it was `["Am#5", "FM/A"]`). Without octaves, the first note is still the bass.
  - Unusual readings go after inversions, with a rule adapted from sharp11: no perfect fifth and no stated altered fifth (except dominant chords without fifth, like `C7no5`), a fifth with a minor third and a minor sixth, a sixth chord with an added fourth, or `o7M7`. `Chord.detect(["E4", "G4", "C5"])` is `["CM/E", "Em#5"]` (it was `["Em#5", "CM/E"]`), `Chord.detect(["E", "G", "B", "C"])` is `["Cmaj7/E", "Emb6"]` and `Chord.detect(["C", "F", "Bb", "Eb"])` is `["F7sus4/C", "Bbsus24/C", "Cquartal"]` (it started with `"C4"`).
  - Among names with the same notes over the same root, the one that spells the given notes goes first: `Chord.detect(["Eb", "G", "B", "D"])` starts with `"Ebmaj7#5"` (it was `"EbM7b6"`).
  - A new `exclude` option leaves out chord types by name or alias: `Chord.detect(["C", "F", "Bb", "Eb"], { exclude: ["quartal"] })` is `["F7sus4/C", "Bbsus24/C"]`.

  Three chord types have a new first alias, so they're printed differently by `Chord.detect`, `Scale.scaleChords`, `Scale.extended`, `Scale.reduced`, `Chord.extended`, `Chord.reduced` and `Progression.fromRomanNumerals` (`iimaj7` in C is `DmMaj7`, it was `Dm/ma7`). No alias is removed, so the old names still parse:

  - `mMaj7` (was `m/ma7`, which made inversions like `Cm/ma7/Eb`): `Chord.detect(["Eb", "G", "B", "C"])` is `["CmMaj7/Eb"]`.
  - `7b9sus4` (was `b9sus`: `Chord.get("Cb9sus")` is Cb plus `9sus`): `Chord.detect(["C", "F", "G", "Bb", "Db"])` starts with `"C7b9sus4"`.
  - `quartal` (was `4`, so `C4` read as a note).

- d880522: Chord types and chords have a `family`: `major`, `minor`, `dominant`, `half-diminished`, `diminished`, `augmented`, `suspended` or `power`, computed from the third, fifth and seventh. It's coarser than `quality`, which doesn't change: `ChordType.get("m7b5").family` is `"half-diminished"` (its quality is `"Diminished"`), `ChordType.get("7b9").family` is `"dominant"` and `ChordType.get("7sus4").family` is `"suspended"` (its quality is `"Unknown"`). Composed chords get one too: `Chord.get("C7(b9,#9)").family` is `"dominant"`.

  `ChordType.family(intervals)` classifies any list of intervals.

- f2cecb3: Intervals can have any number of augmented or diminished: `Interval.get("4AAAAA").semitones` is `10`, and `Interval.add`, `Interval.subtract` and `Interval.distance` give a name for every pair (`Interval.add("4AAAA", "1A")` was `""`, now it's `"4AAAAA"`)
- f2cecb3: Add `Interval.pitchClass`, `Interval.negate`, `Interval.abs` and `Interval.multiply`. `pitchClass` drops octaves and direction, like the distance between pitch classes (`pitchClass("-3M")` is `"6m"`), `negate` turns the direction around (`negate("3M")` is `"-3M"`), `abs` gives the ascending interval (`abs("-3M")` is `"3M"`), and `multiply` stacks an interval a number of times (`multiply("5P", 3)` is `"13M"`)
- d81d784: Interval consonance: `Interval.consonance` and `Interval.isConsonant`.

  `Interval.consonance` classifies an interval as `"perfect"` (unison, fifth and octave), `"imperfect"` (major and minor thirds and sixths) or `"dissonant"` (seconds, sevenths, the perfect fourth, and every augmented or diminished interval), and gives `""` for an invalid interval. Direction and octaves don't change it (`Interval.consonance("-12P")` is `"perfect"`), and the spelling decides, not the sound: `Interval.consonance("4d")` is `"dissonant"`. The perfect fourth is a dissonance unless you pass `{ consonantFourth: true }`.

  `Interval.isConsonant("6M")` is `true`: the interval is a perfect or imperfect consonance.

- 0ad56fe: Applied (secondary) chords. `RomanNumeral.get("V7/V")` has `of: "V"`, and its `interval`, `step` and `alt` locate the chord's root from the tonic (`2M`). `Progression.fromRomanNumerals("C", ["V7/V", "V/V/V"])` gives `["D7", "A"]`. `RomanNumeral.tokenize` returns the applied degree as a fifth element.

  `Progression.fromRomanNumerals` gives an empty string when a numeral's chord type isn't a known chord type, instead of a made-up chord: `V65` was `G65`, `It6` was `Ct6` and `VIIb5` was `Bb5`. A lowercase numeral with a bass note is minor (`i/Eb` is `Cm/Eb`, it was `C/Eb`).

- f064526: `Scale.chords(scale, { size, step })`: the chord built on each degree of any scale, by stacking scale notes. Each chord has its `degree`, its `notes` and its `symbol`.

  `Scale.chords("C major", { size: 4 })[6]` is `{ degree: 7, notes: ["B", "D", "F", "A"], symbol: "Bm7b5" }`, and `Scale.chords("C melodic minor", { size: 4 })` gives `CmMaj7 Dm7 Ebmaj7#5 F7 G7 Am7b5 Bm7b5`. `size` is the number of notes (3, triads, by default) and `step` the scale steps between them (2, thirds, by default; 3 for fourths, 1 for seconds). With an octave in the tonic, the notes have octaves: `Scale.chords("C4 major")[4].notes` is `["G4", "B4", "D5"]`.

  The symbol is the chord type that spells the notes, or one with the same notes over the same root, or `""` when no chord type has them. A major triad is written `"C"`, as in `Key`. The melodic minor tonic is `CmMaj7`, while `Key.minorKey("C").melodic.chords` keeps `Cm6`.

  `@tonaljs/scale` now depends on `@tonaljs/chord-detect`.

- 6a92fc2: Move within a scale: `Scale.transposeBySteps`, `Scale.nearest`, and altered degrees in `Scale.degrees` and `Scale.steps`.

  `Scale.transposeBySteps("C major", "E4", 2)` is `"G4"` and `Scale.transposeBySteps("C major", "E4", -3)` is `"B3"`. Pitch classes work too (`"E"` gives `"G"`). Notes are compared by pitch, so enharmonic spellings work, and the result is spelled as in the scale. A note outside the scale gives `""`.

  `Scale.nearest("C major", "F#4")` is `"G4"`: the scale note closest to a note, by pitch. A note halfway between two scale notes goes up, so `Gb4` gives `G4` too.

  `Scale.degrees` and `Scale.steps` accept a string with accidentals after the number: `Scale.degrees("C major")("7b")` is `"Bb"`, `Scale.degrees("A major")("7b")` is `"G"` (spelled by interval), and `Scale.steps("C4 major")("-1b")` is `"Bb3"`. The number counts scale notes, so `"7b"` is the 7th scale note lowered. A string with the accidentals in front, like `"b7"`, is an interval name (as in `Chord.noteOf`) and gives `""`.

- f2cecb3: **Behaviour change.** `Interval.simplify` keeps the octave, however many octaves an interval spans, and `Interval.invert` gives the interval that completes the simplified interval to an octave. Before, `simplify` kept `8P` but turned `15P` into `1P`, and `invert` kept compound intervals compound and left unisons and octaves as they were. The new results follow music21's semi-simple intervals and complements:

  |                    | before  | now     |
  | ------------------ | ------- | ------- |
  | `simplify("15P")`  | `"1P"`  | `"8P"`  |
  | `simplify("-22P")` | `"-1P"` | `"-8P"` |
  | `invert("1P")`     | `"1P"`  | `"8P"`  |
  | `invert("8P")`     | `"8P"`  | `"1P"`  |
  | `invert("1A")`     | `"1d"`  | `"8d"`  |
  | `invert("9M")`     | `"14m"` | `"7m"`  |

  Other simple intervals are unchanged, and the direction is kept (`invert("-3M")` is still `"-6m"`). `Interval.get(i).simple` follows `simplify`: it's `8` for `"15P"`

- bb8889d: Chord names and suspensions.

  A chord whose type has no long name is named by its symbol: `Chord.get("Cadd9").name` is `"Cadd9"` (it was `"C "`, with a trailing space), and `Chord.get("C7b9b13").name` is `"C7b9b13"`. Types with a long name don't change (`"C major seventh"`).

  Chord symbols as written in charts accept `sus4` (or `sus`) and `sus2`, which replace the third: `Cmaj7sus4`, `Cmaj9sus4`, `C7sus2`, `Cmaj7sus2`, `C6sus4` and `C6sus2` were empty. `Chord.get("Cmaj7sus4")` is the `M7sus4` type. The minor third is replaced too, so `Cm7sus4` is the same chord as `C7sus4`.

- b2c7821: **Behaviour change.** `Voicing.get` now returns `[]` when no voicing is found (it was `undefined`); check `voicing.length === 0` instead of `!voicing` or `??`, because `[]` is truthy. `Voicing.search` without a dictionary now searches `VoicingDictionary.all` (it was `VoicingDictionary.triads`), the same default as `Voicing.get`, so it returns more results:

  |                           | before      | now          |
  | ------------------------- | ----------- | ------------ |
  | `Voicing.search("Cmaj7")` | `[]`        | two voicings |
  | `Voicing.get("C13")`      | `undefined` | `[]`         |

  `Voicing.sequence` keeps `[]` at the position of chords without voicing, and voice-leads the next chord from the last chord that had a voicing

### Patch Changes

- 7aa10aa: `RhythmPattern.euclid(steps, 0)` now returns only rests. It returned a beat on the first step.
- e6cd704: A unison, fourth, fifth or octave with a major or minor quality is not an interval anymore: `Interval.get("5m")` used to be a perfect fifth (`semitones: 7`) and `Note.transpose("C4", "5m")` gave `"G4"`; now they give the empty interval and `""`, like `"2P"` already did.
- 8a32ef0: `Key` supertonics have the right chord quality (#232).

  - `secondaryDominantSupertonics`: a ii-V into a minor chord gets a half-diminished ii (`Em7b5` before `A7` → `Dm`), and a ii-V into a major chord gets a minor seventh ii (`Gm7` before `C7` → `F`). They were swapped since `@tonaljs/key` 4.11.0 (#447). C major gives `["", "Em7b5", "F#m7b5", "Gm7", "Am7", "Bm7b5", ""]` (it was `["", "Em7", "F#m7", "Gm7b5", "Am7b5", "Bm7", ""]`).
  - `substituteDominantSupertonics`: the ii of a substitute dominant is always a minor seventh (`Bbm7` before `Eb7` → `Dm`), because a substitute dominant doesn't resolve to its own tonic. C major gives `["", "Bbm7", "Cm7", "Dbm7", "Ebm7", "Fm7", ""]` (it was `["", "Bbm7", "Cm7", "Dbm7b5", "Ebm7b5", "Fm7", ""]`).

  This also changes the deprecated `secondaryDominantsMinorRelative` and `substituteDominantsMinorRelative`, and the `ii/` and `subii/` roles of `majorKeyChords` and `minorKeyChords`. For example, in C major `Em7` is no longer `ii/II` (`Em7b5` is), and `Am7` is now also `ii/V`.

  The `@deprecated` tags of the `...MinorRelative` fields name the right replacement and show up in editors.

- 66f551a: The octave of a note is read as a number: `Note.get("C04").name` is `"C4"` (was `"C04"`, so `Note.sortedUniqNames(["C04", "C4"])` kept both), and `"C-0"` is `"C0"` with `oct: 0` (was `-0`). A minus sign with no octave digits is not a note anymore: `Note.get("C-")` used to be a note with a `NaN` octave and height, and `Note.transpose("C-", "M2")` gave `"D"`; now they give the empty note and `""`. Code that reads a tonic with `note()` changes the same way: `Key.majorKey("C-")` and `Key.minorKey("C-")` are the empty key, and `Chord.get(["C-", "maj7"])` is no chord (they used to ignore the `-`).
- 223f729: `Pcset.get` only reads whole numbers from 0 to 4095 as pcset numbers. A number like `2.5` used to give a non-empty set with the chroma `"0000000010.1"` (and `Pcset.notes(2.5)` gave `["Ab", "B"]`); now it gives the empty set.
- 99ee8a1: `Collection.range` (and `Range.numeric` / `Range.chromatic`) no longer hang when a bound is not a whole number, like `Range.numeric([Midi.freqToMidi(261), 72])`. Non-finite bounds give an empty range.
- f035b9b: A scale whose tonic has a double sharp written as `x` works now: `Scale.get("Cx major")` used to be the empty scale, because `Scale.tokenize("Cx major")` gave `["C##", "ajor"]`; now it gives `["C##", "major"]`, the same as `"C## major"`.
- 6c44917: `Note.sortedUniqNames` (and so `Scale.scaleNotes`) removes every duplicate, even when an enharmonic note sorts between two copies: `Note.sortedUniqNames(["C4", "B#3", "C4"])` is now `["C4", "B#3"]` instead of `["C4", "B#3", "C4"]`.
- d21bd4b: `TimeSignature.get` types 6/16, 9/16 and 12/16 as `compound` (they were `irregular`), and returns an empty signature when a number is not a positive integer (`["4", "x"]` gave `"4/NaN"`).
- Updated dependencies [1f86506]
- Updated dependencies [3d5530d]
- Updated dependencies [09043d6]
- Updated dependencies [d880522]
- Updated dependencies [7aa10aa]
- Updated dependencies [f2cecb3]
- Updated dependencies [d81d784]
- Updated dependencies [8a32ef0]
- Updated dependencies [223f729]
- Updated dependencies [99ee8a1]
- Updated dependencies [0ad56fe]
- Updated dependencies [f064526]
- Updated dependencies [6a92fc2]
- Updated dependencies [f035b9b]
- Updated dependencies [f2cecb3]
- Updated dependencies [bb8889d]
- Updated dependencies [6c44917]
- Updated dependencies [d21bd4b]
- Updated dependencies [b2c7821]
  - @tonaljs/chord-type@5.3.0
  - @tonaljs/chord@6.3.0
  - @tonaljs/rhythm-pattern@1.0.2
  - @tonaljs/interval@5.2.0
  - @tonaljs/key@4.11.6
  - @tonaljs/pcset@4.10.5
  - @tonaljs/collection@4.9.2
  - @tonaljs/array@4.8.7
  - @tonaljs/range@4.9.6
  - @tonaljs/roman-numeral@4.10.0
  - @tonaljs/progression@4.11.0
  - @tonaljs/scale@4.14.0
  - @tonaljs/note@4.12.5
  - @tonaljs/time-signature@4.10.2
  - @tonaljs/voicing@5.2.0
  - @tonaljs/voicing-dictionary@5.1.7
  - @tonaljs/core@5.0.6
  - @tonaljs/mode@4.9.6
  - @tonaljs/abc-notation@4.9.5
  - @tonaljs/midi@4.10.6
  - @tonaljs/scale-type@4.9.6
  - @tonaljs/voice-leading@5.1.6

## 6.6.0

### Minor Changes

- 875f1b7: **Behavior change:** `distance` between pitch classes (when either note has no octave) now always returns a simple interval, ascending by letter, even when it sounds lower. Some results that led to the right note before are now named differently: `C` to `Cb` is `1d` (was `8d`), and `C#` to `Dbb` is `2dd` (was `9dd`).

  Fix `distance` results that led to the wrong note. The written letters now decide the interval: between notes with octaves, the direction comes from the letters, and only a unison takes it from the sound. `C4` to `B##3` is `-2dd` (was `7AA`), `B#3` to `Cb4` is `2dd` (was `-7AA`), and `C10` to `B#9` is `-2d` (was `7A`). `C4` to `Cb4` is still `-1A`. Between pitch classes, `Cbb` to `A#` is `6AAA` (was `-1AAA`).

- 875f1b7: Fix `Interval.add`, `Interval.subtract` and `Interval.transposeFifths` results that led to the wrong note. The letter steps now decide the direction of the result, even when the sound goes the other way: `subtract("2d", "1A")` is `2dd` (was `-7AA`) and `subtract("2m", "1AA")` is `2dd` (was `-7AA`). A unison still takes its direction from the sound: `subtract("1P", "1A")` is `-1A`.

  **Deprecated:** the `forceDescending` parameter of `coordToInterval`, since the letter steps already give the direction.

- b757383: `Progression.fromRomanNumerals` reads a lowercase roman numeral as a minor chord: `fromRomanNumerals("C", ["ii", "ii7"])` returns `["Dm", "Dm7"]` instead of `["D", "D7"]`. Every spelling of a chord type gives the same chord (`iimaj7` and `iiMaj7` are both minor-major sevenths, `ii6/9` and `ii69` are both `Dm69`). A chord type with its own quality (`viio`, `iim7`, `viim7b5`, `ii+`, `ii7#5`) is kept as written, and so is one without a minor form (`ii7b9`) (#457)

### Patch Changes

- 61dedc5: Fix `distance` for a descending diminished second written across the octave line, e.g. `C4` to `B#3` is now `-2d` (see #514)
- 012c2f2: Fix `majorTonicFromKeySignature`: only strings made of all `b` or all `#` are read as a key signature (`"F#"` and `"b#"` now give `null`), and `""` gives `"C"` (see #517)
- f3b53a4: Fix `Note.simplify` dropping the octave of notes outside the midi range (`simplify("C10")` was `"C"`), and `Midi.midiToNoteName` returning `NaN` for negative numbers (`midiToNoteName(-1)` is now `"B-2"`)
- 80a12e3: Fix `isMidi` and `toMidi`: empty or blank strings, `null`, arrays and booleans are not midi numbers anymore (`toMidi("")` was `0`) (see #519)
- Updated dependencies [875f1b7]
- Updated dependencies [012c2f2]
- Updated dependencies [b757383]
- Updated dependencies [f3b53a4]
- Updated dependencies [80a12e3]
  - @tonaljs/interval@5.1.2
  - @tonaljs/key@4.11.5
  - @tonaljs/progression@4.10.0
  - @tonaljs/midi@4.10.5
  - @tonaljs/note@4.12.4
  - @tonaljs/range@4.9.5
  - @tonaljs/abc-notation@4.9.4
  - @tonaljs/chord@6.2.2
  - @tonaljs/core@5.0.5
  - @tonaljs/mode@4.9.5
  - @tonaljs/pcset@4.10.4
  - @tonaljs/scale@4.13.7
  - @tonaljs/roman-numeral@4.9.4
  - @tonaljs/voicing@5.1.6
  - @tonaljs/voice-leading@5.1.5
  - @tonaljs/voicing-dictionary@5.1.6
  - @tonaljs/chord-type@5.2.2
  - @tonaljs/scale-type@4.9.5

## 6.5.1

### Patch Changes

- 4694a12: - Build `dist/index.js` and `dist/index.d.ts` again, so the `main` and `types` entries of every package resolve. Since the tsdown migration the build wrote `index.cjs` and `index.d.cts` instead, and `require("tonal")` or `import "tonal"` in Node failed with "Cannot find module".
- Updated dependencies [4694a12]
  - @tonaljs/abc-notation@4.9.3
  - @tonaljs/array@4.8.6
  - @tonaljs/chord@6.2.1
  - @tonaljs/chord-type@5.2.1
  - @tonaljs/collection@4.9.1
  - @tonaljs/core@5.0.4
  - @tonaljs/duration-value@4.9.1
  - @tonaljs/interval@5.1.1
  - @tonaljs/key@4.11.4
  - @tonaljs/midi@4.10.4
  - @tonaljs/mode@4.9.4
  - @tonaljs/note@4.12.3
  - @tonaljs/pcset@4.10.3
  - @tonaljs/progression@4.9.4
  - @tonaljs/range@4.9.4
  - @tonaljs/rhythm-pattern@1.0.1
  - @tonaljs/roman-numeral@4.9.3
  - @tonaljs/scale@4.13.6
  - @tonaljs/scale-type@4.9.4
  - @tonaljs/time-signature@4.10.1
  - @tonaljs/voice-leading@5.1.4
  - @tonaljs/voicing@5.1.5
  - @tonaljs/voicing-dictionary@5.1.5

## 6.5.0

### Minor Changes

- 9aeb912: - Add `maj11` chord type (major eleventh) (#476)
  - Name `aug7` chord type as "seventh augmented fifth", so `Chord.get("Caug7").type` is no longer empty (#500)
  - `Chord.steps` and `Chord.degrees` keep the tonic octave when the chord is given as tokens: `Chord.steps(["C4", "aug"])` (#497)
  - `TimeSignature.get` accepts common time (`C`) and cut time (`C|`, `¢`) symbols, and no longer throws on invalid input (#490)
  - `Interval.get` rejects malformed intervals like `ddd5` or `5Pgarbage` (#494)
  - Faster pitch class set normalization (#499)
  - Invalid input is no longer cached, so caches can't grow without limit (#498)
  - `Object.prototype` keys like `"constructor"` no longer return built-in functions from `Interval.get`, `RomanNumeral.get`, `ChordType.get`, `ScaleType.get` and `Mode.get`

### Patch Changes

- Updated dependencies [9aeb912]
  - @tonaljs/chord-type@5.2.0
  - @tonaljs/chord@6.2.0
  - @tonaljs/time-signature@4.10.0
  - @tonaljs/pcset@4.10.2
  - @tonaljs/roman-numeral@4.9.2
  - @tonaljs/scale-type@4.9.3
  - @tonaljs/mode@4.9.3
  - @tonaljs/scale@4.13.5
  - @tonaljs/key@4.11.3
  - @tonaljs/progression@4.9.3
  - @tonaljs/voicing@5.1.4
  - @tonaljs/voicing-dictionary@5.1.4
  - @tonaljs/core@5.0.3
  - @tonaljs/note@4.12.2
  - @tonaljs/abc-notation@4.9.2
  - @tonaljs/array@4.8.5
  - @tonaljs/midi@4.10.3
  - @tonaljs/voice-leading@5.1.3
  - @tonaljs/range@4.9.3

## 6.4.3

### Patch Changes

- - Fix neapolitan spelling (#480)
  - Fix scale uppercase problem (#482)
- Updated dependencies
  - @tonaljs/scale-type@4.9.2
  - @tonaljs/scale@4.13.4
  - @tonaljs/chord@6.1.2
  - @tonaljs/mode@4.9.2
  - @tonaljs/progression@4.9.2
  - @tonaljs/voicing@5.1.3
  - @tonaljs/voicing-dictionary@5.1.3

## 6.4.2

### Patch Changes

- 3c89703: Fix octave displacement of Midi.pcsetNearest

- Updated dependencies [3c89703]
  - @tonaljs/midi@4.10.2
  - @tonaljs/note@4.12.1
  - @tonaljs/range@4.9.2
  - @tonaljs/key@4.11.2
  - @tonaljs/scale@4.13.3
  - @tonaljs/voice-leading@5.1.2
  - @tonaljs/voicing@5.1.2
  - @tonaljs/voicing-dictionary@5.1.2

## 6.4.x

- 72de4e4: Fix a bug where `Scale.tokenize` didn't lowercase scale type when tonic is not preset

### Minor Changes

- b791283: ### Export `NoteType` and `IntervalType` types

  Typescript types `NoteType` and `IntervalType` are now exported:

  ```ts
  import { Interval, IntervalType, Note, NoteType } from "tonal";

  const note: NoteType = Note.get("C4");
  const interval: IntervalType = Interval.get("P4");
  ```

### Patch Changes

- Updated dependencies [b791283]
  - @tonaljs/note@4.12.0
  - @tonaljs/core@5.0.2
  - @tonaljs/pcset@4.10.1
  - @tonaljs/progression@4.9.1
  - @tonaljs/roman-numeral@4.9.1
  - @tonaljs/abc-notation@4.9.1
  - @tonaljs/array@4.8.4
  - @tonaljs/chord@6.1.1
  - @tonaljs/key@4.11.1
  - @tonaljs/midi@4.10.1
  - @tonaljs/mode@4.9.1
  - @tonaljs/scale@4.13.1
  - @tonaljs/voice-leading@5.1.1
  - @tonaljs/voicing@5.1.1
  - @tonaljs/voicing-dictionary@5.1.1
  - @tonaljs/chord-type@5.1.1
  - @tonaljs/scale-type@4.9.1
  - @tonaljs/range@4.9.1

## 6.3.0

- New `Key.majorKeyChords` and `Key.minorKeyChords` functions.

```js
import * as Key from "tonal";

Key.majorKeyChords("C").find((chord) => chord.name === "Em"); // => { name: "Em", roles: ["T", "ii/II"] }
```

- Renamed fields of key results. `secondaryDominantsMinorRelative` is now `secondaryDominantSupertonics` and `substituteDominantsMinorRelative` is now `substituteDominantSupertonics`. Previous names are kept for compatibility as deprecated (will be removed in next major version)

## 6.2.0

### Minor Changes

#### `default` export is deprecated for @tonaljs modules

Using default exports for single packages are deprecated, so instead of:

```js
import Note from "@tonaljs/note";
```

You should do this:

```js
import * as Note from "@tonaljs/note";
```

The same for all modules.

### Patch Changes

#### Fix: add `Note.distance` back

The documentation said `Note.distance` was available, but was not.

Now you can do:

```js
import { Note } from "tonal";
Note.distance("c4", "e7"); // => "24M"
```

#### Fix a bug finding distance between notes when they are in adjacent octaves (see #428)

## 6.1.0

New `rhythm-pattern` package:

```ts
import { RhythmPattern } from "tonal";

RhythmPattern.euclid(8, 3); // => [1, 0, 0, 1, 0, 0, 1, 0]
RhythmPattern.binary(12, 13); // => [1, 1, 0, 0, 1, 1, 0, 1]
RhythmPattern.hex("8f"); // => [1, 0, 0, 0, 1, 1, 1, 1]
RhythmPattern.onsets(1, 2, 2, 1); // => [1, 0, 1, 0, 0, 1, 0, 0, 1, 0]
RhythmPattern.random(4); // => [1, 0, 0, 1]
RhythmPattern.probability([0.6, 0, 0.2, 0.5]); // => [0, 0, 0, 1]
RhythmPattern.rotate([1, 0, 0, 1], 2); // => [0, 1, 1, 0]
```

## 6.0.1

Scale.get ignores case.

Now both calls returns the same scale:

```js
Scale.get("C Major");
Scale.get("c major");
```

## 6.0.0

### Major Changes

#### Breaking change: chord uses pitch classes, never notes with octaves

Chords now uses only pitch classes. Before `Chord.getChord('M', 'C4')` would consider `C4` to be the tonic and now is `C``

So **before**:

```js
Chord.get("M", "C4"); // =>
// {
//   name: 'C4 major',
//   tonic: 'C4',
//   notes: [ 'C4', 'E4', 'G4' ]
// ...
// }
```

**Now**:

```js
Chord.get("M", "C4"); // =>
// {
//   name: 'C major',
//   tonic: 'C',
//   notes: [ 'C', 'E', 'G' ]
// }
```

#### Feature: slash chords

- Chord now accepts a slash and a bass. The bass _must_ be a pitch class
- Chord properties include `bass` that is a pitch class that could or could not belong to the chord itself.

Example:

```js
Chord.get("Cmaj7/B");
Chord.get("Eb/D");
```

#### Feature: chord `notes`

Now `notes` property of a chord are always pitch classes, there's a new function to get the actual notes:

```js
Chord.notes("Cmaj7", "C4"); // => ['C4', 'E4', 'G4', 'B4']
Chord.notes("maj7", "D5"); // => ['D5', 'F#5', 'A5', 'C#6']
```

- 48fecc4: Fix typo (breaking change): `substract` is now `subtract`
- 48fecc4: Breaking change: remove `NoInterval` interface. Return `Interval` type (with `emtpy: true`) when parsing invalid intervals.
- 48fecc4: Breaking change: `NoNote` interface is removed. Always return `Note` type (with `empty: true`) when parsing invalid notes.

### Patch Changes

Updated dependencies

## 5.2.x

Updated dependencies

## 5.2.0

### Minor Changes

- Add `Pcset.notes()` function that returns the ordered pitch class notes of the given set

### Patch Changes

- Updated dependencies [f21525b]

## 5.1.3

### Patch Changes

- Named type was renamed to NamedPitch. Add old export for backwards compatibility
- Updated dependencies

## 5.1.2

### Patch Changes

- Move core into pitch modules
- Updated dependencies
  - @tonaljs/core@4.10.2

## 5.1.1

### Patch Changes

- Restructure code to use new `@tonaljs/pitch`. No changes to functionality
- Updated dependencies
  - @tonaljs/core@4.10.1

## 5.1.0

### Minor Changes

- Publish voicing packages. Now there a three new namespaces:

  ```ts
  import { VoiceLeading, Voicing, VoicingDictionary } from "tonal";
  ```

- Updated dependencies [15017c0]
  - @tonaljs/voicing-dictionary@5.0.0
  - @tonaljs/voice-leading@5.0.0
  - @tonaljs/voicing@5.0.0

## 5.0.1

- Add -maj7 chord alias
- Updated dependencies
  - @tonaljs/chord-type@5.0.2

## 5.0.0

### Major Changes

Breaking change: `Chord.get` and `Chord.tokenize` assumes all numbers are part of the chord type, and never the tonic octave, when using with a single string parameter.

Before, in v4.x:

```js
Chord.get("C4maj7"); // => { symbol: 'Cmaj7', tonic: 'C4' ... }
```

Now, in > 5.x:

```js
Chord.get("C4maj7"); // => { empty: true } <- there is no "4maj7" chord type, so no chord is returned
```

The old behaviour can be replicated by using an array as parameter.

This works both in v4.x and v5.x:

```js
Chord.get(["C4", "maj7"]); // => { symbol: 'Cmaj7', tonic: 'C4' ... }
```

The reasons for this change are:

1. Chord symbols never use octaves
2. The old behavior is confusing and arbitrary

### Patch Changes

- Updated dependencies [b07a54c0]
  - @tonaljs/chord-type@5.0.0
  - @tonaljs/chord@5.0.0
  - @tonaljs/scale@4.12.2
  - @tonaljs/progression@4.8.1

## 4.14.2

### Patch Changes

- pcset - Fix setNumToChroma: it must return a string of length in order to work correctly

## 4.14.1

### Patch Changes

- 96df1a19: Add 6add9 to chord types aliases. Rename to "sixth added ninth"
- Updated dependencies [96df1a19]
  - @tonaljs/chord-type@4.8.1
  - @tonaljs/chord@4.10.1

## 4.14.0

### Minor Changes

- 52c5c9cc: Numeric ranges support negative numbers

```js
Range.numeric([-5, 5]); // => [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]
```

- 6fcd52db: Add Scale.steps and Chord.steps

```js
import { Range, Scale, Chod } from "tonal";

Range.numeric([-3, 3]).map(Scale.steps("C4 major"));
Range.numeric([-3, 3]).map(Chord.steps(["C4", "aug"]));
// => ["G3", "A3", "B3", "C4", "D4", "E4", "F4"]
```

## 4.13.0

### Minor Changes

- Add Scale.detect function

```js
Scale.detect(["C", "D", "E", "F", "G", "A", "B"]);
// => ["C major", "C bebop", "C bebop major",
//     "C ichikosucho",  "C chromatic"];
```

## 4.12.0

### Minor Changes

- New midi functions
  - Midi.pcset
  - Midi.pcsetSteps
  - Midi.pcsetDegrees
  - Midi.pcsetNearest

```js
Midi.pcset([62, 63, 60, 65, 70, 72]); // => [0, 2, 3, 5, 10]
Midi.pcset("100100100101"); // => [0, 3, 6, 9, 11]

const steps = Midi.pcsetSteps(Scale.get("D dorian").chroma, 60);
[-2, -1, 0, 1, 2, 3].map(steps); // => [ 57, 58, 60, 62, 63, 65 ]

const steps = Midi.pcsetDegrees(Scale.get("D dorian").chroma, 60);
[-2, -1, 1, 2, 3, 4].map(steps); // => [ 57, 58, 60, 62, 63, 65 ]

const nearest = Midi.pcsetNearest(Scale.get("D dorian").chroma);
[60, 61, 62, 63, 64, 65, 66].map(nearest); // => [60, 62, 62, 63, 65, 65, 67]
```

## 4.11.0

### Minor Changes

- Scale.degrees

```js
[1, 2, 3, 4].map(Chord.degrees("C4")) => ["C4", "E4", "G4", "C5"]`
```

## 4.10.0

### Minor Changes

- Scale.degrees new function

```js
[1, 2, 3].map(Scale.degrees("C major")) => ["C", "D", "E"]
[1, 2, 3].map(Scale.degrees("C4 major")) => ["C4", "D4", "E4"]
[-1, -2, -3].map(Scale.degrees("C major")) => ["B", "A", "G"]
```

## 4.9.0

### Minor Changes

- 10056eff: Add triads to key.

  For example: `Key.majorKey("C").triads` or `Key.minorKey("C").melodic.triads`

### Patch Changes

- Updated dependencies [10056eff]

## 4.8.1

### Patch Changes

- 3f4e78ee: Fix browser build

## 4.8.0

### Minor Changes

- - fix time signature parsing
  - add support for irrational time signatures
  - add option `assumePerfectFifth` to `Chord.detect` function

### Patch Changes

- Updated dependencies

## 4.7.2

### Patch Changes

- Unify package versions
- Updated dependencies

## 4.7.1

### Patch Changes

- fix npm publish problem
- Updated dependencies

## 4.7.0

### Minor Changes

- b120fc42: Publish tonal in `tonal` package. So use `npm install tonal` instead of `npm install @tonaljs/tonal`

### Patch Changes

- fix memory leak
- Updated dependencies
- Updated dependencies [b120fc42]

## 4.6.x

- Add `Note.enharmonic`
- Bug fixing
- Updated dependencies

## 4.5.x

- Mode notes, triads, seventhChords and relativeTonic #221
- Scale.rangeOf #220
- Improve chord detection and remove invalid chord #209
- Fixes #218, #208, #207, #215

## 4.x

Adopt a fixed/locked mode with lerna. Before, each module has it's own version. Now the same version is used for all modules. [More info](https://github.com/lerna/lerna#fixedlocked-mode-default)

Deprecated modules:

- @tonaljs/modules (use tonal)
- @tonaljs/array (use @tonaljs/collection)

## Before

Before 4.5.0 there's no changelog, sorry 🙏. I'm afraid you have to dive into commits.

To make things worse, each module had it's own version, making difficult to know what was released when.

At least I'll try to keep this one up to date

Theres a [migration guide](migration-guide.md) for older versions (pre 4)
