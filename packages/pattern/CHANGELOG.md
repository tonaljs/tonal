# @tonaljs/pattern

## 1.0.0

### Major Changes

- c3ab33a: A new package, `@tonaljs/pattern` (`Pattern` in `tonal`): note patterns as lists of indexes into a chord, a voicing or a scale. It says which notes, in which order; `RhythmPattern` says when.

  - `arpeggio(name, n)` gives an arpeggio order over n notes (`arpeggio("up-down", 4)` is `[0, 1, 2, 3, 2, 1]`), and `arpeggios()` lists the 13 names: up, down, up-down, down-up, up-down-repeat, down-up-repeat, converge, diverge, converge-diverge, thumb-up, thumb-up-down, pinky-up and pinky-up-down.
  - `sequence(cell, step, count)` moves a cell by a step, as groups (`sequence([0, 2], 1, 3)` is `[[0, 2], [1, 3], [2, 4]]`), for groups of three or four through a scale, thirds, or 1-2-3-5 (`[0, 1, 2, 4]`).
  - `alternate(groups)` reverses every other group, and `repeat(indexes, times)` repeats each index.

  Realise a pattern with `Scale.steps` or `Chord.steps`, which wrap into the next octave. The README shows both ways of spreading an arpeggio over more octaves.

### Patch Changes

- 7ce587b: Play note patterns over voicings and keep them in a register.

  - `Voicing.steps(voicing)` gives a function from a position to a note, 0 being the lowest voice, like `Scale.steps` and `Chord.steps`: `[0, 1, 2, 3].map(Voicing.steps(["C4", "E4", "G4"]))` is `["C4", "E4", "G4", "C5"]`. Past the top voice the voicing repeats above itself, moved up the fewest octaves that put its lowest note at or above the top note (two for C3 G3 E4), so `Pattern` arpeggios keep going up. Negative positions go down the same way.
  - `Note.fold(notes, [low, high])` moves a figure by octaves into a range, keeping its shape and spelling; with `{ each: true }` each note moves on its own. `Note.fold(["C2", "E2", "G2", "Bb2"], ["E2", "G3"])` is `["C3", "E3", "G3", "Bb3"]`.
  - `Chord.bass(chord, octave?)` is the slash bass, or the root: `Chord.bass("C7/E", 2)` is `"E2"`, `Chord.bass("C7")` is `"C"`.

  The pattern README plays patterns over voicings with `Voicing.steps`. The chord README shows approach notes for bass lines (a half step or a scale step below or above, the fifth, enclosures) as transpositions of the target.
