---
"@tonaljs/chord": minor
"@tonaljs/chord-detect": minor
"@tonaljs/scale": patch
---

Diminished ninth and eleventh chords: `Chord.get("Co9")` (or `Cdim9`, `C°9`) is the diminished seventh with a 9th, `["C", "Eb", "Gb", "Bbb", "D"]`, and `Co11` adds the 11th too. More tokens can follow (`Co9b13`). `Cdim13` stays empty: its 13th would be the same note as the diminished seventh.

Chord symbols can have spaces between their qualifiers: `Chord.get("Cm7 b9")` is `Cm7b9`, and `Cmin maj7`, `Cmaj add 9` and `C7(#5) b9` work too. The spaces are removed only when the symbol with them isn't a chord, so names like `"C major seventh"` are unchanged, and the symbol is written without them.

`Chord.detect` finds chords played without their fifth. When the notes over a root have no name of their own but a chord with a third, a perfect fifth and a seventh has them plus the fifth, it's named with `no5`: `Chord.detect(["C", "E", "B"])` is `["Cmaj7no5"]` (it was `[]`), and C Eb Bb D is `Cm9no5`. These names go after the inversions with every note and before unusual readings, and parse back with `Chord.get`. Listed types without fifth keep their name (`C7no5`, `C9no5`). The new `missingFifth: false` option leaves them out; `assumePerfectFifth` works as before. `Scale.chords` only names listed chord types, as before.
