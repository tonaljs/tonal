---
"@tonaljs/pattern": major
"tonal": minor
---

A new package, `@tonaljs/pattern` (`Pattern` in `tonal`): note patterns as lists of indexes into a chord, a voicing or a scale. It says which notes, in which order; `RhythmPattern` says when.

- `arpeggio(name, n)` gives an arpeggio order over n notes (`arpeggio("up-down", 4)` is `[0, 1, 2, 3, 2, 1]`), and `arpeggios()` lists the 13 names: up, down, up-down, down-up, up-down-repeat, down-up-repeat, converge, diverge, converge-diverge, thumb-up, thumb-up-down, pinky-up and pinky-up-down.
- `sequence(cell, step, count)` moves a cell by a step, as groups (`sequence([0, 2], 1, 3)` is `[[0, 2], [1, 3], [2, 4]]`), for groups of three or four through a scale, thirds, or 1-2-3-5 (`[0, 1, 2, 4]`).
- `alternate(groups)` reverses every other group, and `repeat(indexes, times)` repeats each index.

Realise a pattern with `Scale.steps` or `Chord.steps`, which wrap into the next octave. The README shows both ways of spreading an arpeggio over more octaves.
