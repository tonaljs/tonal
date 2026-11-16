---
"@tonaljs/chord-type": patch
"@tonaljs/chord": minor
"tonal": minor
---

Chord names and suspensions.

A chord whose type has no long name is named by its symbol: `Chord.get("Cadd9").name` is `"Cadd9"` (it was `"C "`, with a trailing space), and `Chord.get("C7b9b13").name` is `"C7b9b13"`. Types with a long name don't change (`"C major seventh"`).

Chord symbols as written in charts accept `sus4` (or `sus`) and `sus2`, which replace the third: `Cmaj7sus4`, `Cmaj9sus4`, `C7sus2`, `Cmaj7sus2`, `C6sus4` and `C6sus2` were empty. `Chord.get("Cmaj7sus4")` is the `M7sus4` type. The minor third is replaced too, so `Cm7sus4` is the same chord as `C7sus4`.
