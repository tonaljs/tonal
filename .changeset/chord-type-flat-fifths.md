---
"@tonaljs/chord-type": patch
"@tonaljs/chord": patch
"tonal": patch
---

A `b5` in a chord symbol lowers the fifth. Six chord types listed a `b5` spelling as another name of a `#11` chord, which keeps the fifth, so `Chord.get("C7b5b9").notes` was `["C", "E", "G", "Bb", "Db", "F#"]` (now `["C", "E", "Gb", "Bb", "Db"]`, like `C7b5` and `Cm7b5b9`). The spellings were `7b5b9`, `7b9b5`, `7b5#9`, `7#9b5`, `7b5b13`, `9b5b13`, `7b5b9b13`, `6b5` and `M6b5`. They aren't listed types any more: `Chord.get` reads them as a listed type plus alterations, and `ChordType.get("7b5b9")` is empty. `7b9#11`, `7#9#11`, `6#11` and the other `#11` spellings are unchanged, and so is `Chord.detect`.
