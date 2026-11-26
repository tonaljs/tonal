---
"@tonaljs/chord": patch
"@tonaljs/chord-type": patch
"@tonaljs/chord-detect": patch
"@tonaljs/rhythm-pattern": patch
---

Invalid input gives an empty value instead of an exception in more functions:

- Every `Chord` function given something that isn't a string (`Chord.get(undefined)`, `Chord.notes(null)`, `Chord.degrees(5)`…) gives an empty chord, `[]` or `""`. So do `Voicing.get`, `Voicing.search` and `Voicing.sequence`.
- `Chord.detect` gives `[]` when the notes aren't an array.
- `ChordType.complexity` gives `0`, and `ChordType.family` `""`, when the intervals aren't an array (`ChordType.complexity("m7")` used to throw).
- `RhythmPattern.toDurations(undefined)` gives `[]`.

A new test calls every public function with invalid values and fails if one throws, apart from a list of known cases still to fix.
