---
"@tonaljs/chord-type": minor
"@tonaljs/chord": minor
"tonal": minor
---

Chord symbols as written in charts.

`Chord.get` reads a listed chord type followed by alterations: `Cm7b5b9`, `C7(b9,#9)`, `C7(no3)`, `Cdim(maj7)`, `C(add9)`. The tokens are `b5 #5 +5 b9 #9 #11 #4 b13 b6`, `add` plus a tone (`add9`, `add11`, `addb9`...), `9 11 13 6` inside parentheses, `no3`, `no5` and `maj7`. An altered tone replaces the natural one (`C13b9` has no 9). The chord keeps the symbol as written, and has the listed type's name when its intervals are a listed type, or an empty `type` otherwise. `7alt` stays `7#5#9`.

`Chord.get("N.C.")` (or `"NC"`) is "no chord": not empty, with no notes.

New chord types: `mb6`, `m7b6`, `m9b6`, `mMaj11`, `mMaj13`, `Madd4`, `7susadd3` and `maj7#9`. New aliases for chart shorthand: `-b6 -7b6 -9b6 -^11 -^13 -add2 -add4 add4 7susadd3 7susb9 7susb9b13 ^7#9 ^7b5 ^13#11 h9 o^7`, plus `madd2`, `maj7b5` and `ø9`.

The new types are part of the dictionary, so functions that list or search chord types can return them: `Chord.detect(["C", "E", "G", "B"])` is `["Cmaj7", "Emb6/C"]` (it was `["Cmaj7"]`), `Chord.extended("Cmaj7")` includes `Cmaj7#9`, `Scale.scaleChords("minor")` includes `mb6`, `m7b6` and `m9b6`, and `Progression.fromRomanNumerals("C", ["iiadd2"])` is `["Dmadd2"]` (it was `["Dmadd9"]`, the same chord).

`m9b5` has a ninth (`9M`) instead of a second (`2M`), so `Chord.get("Cm9b5").notes` is `["C", "Eb", "Gb", "Bb", "D"]`.
